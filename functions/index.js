// SỬ DỤNG PHIÊN BẢN V1 ĐỂ ỔN ĐỊNH NHẤT
const functions = require("firebase-functions/v1");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

// TỰ ĐỘNG LOAD BIẾN MÔI TRƯỜNG TỪ FILE .ENV
require("dotenv").config();

const PayOSLib = require("@payos/node");
const PayOS = PayOSLib.PayOS || PayOSLib.default || PayOSLib;

admin.initializeApp();
const db = admin.firestore();

// --- HÀM HỖ TRỢ: LẤY DỊCH VỤ (LAZY LOADING) ---
function getServices() {
    // DÙNG PROCESS.ENV THAY VÌ FUNCTIONS.CONFIG
    const gmailEmail = process.env.GMAIL_EMAIL;
    const gmailPass = process.env.GMAIL_PASS;
    const clientId = process.env.PAYOS_CLIENT_ID;
    const apiKey = process.env.PAYOS_API_KEY;
    const checksum = process.env.PAYOS_CHECKSUM_KEY;

    // Log để debug (ẩn 3 ký tự cuối để bảo mật)
    console.log("Checking Env:", { 
        email: !!gmailEmail, 
        clientId: !!clientId 
    });

    if (!gmailEmail || !clientId) {
        throw new Error("THIẾU .ENV: Hãy kiểm tra file functions/.env");
    }

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: { user: gmailEmail, pass: gmailPass }
    });

    const payos = new PayOS(clientId, apiKey, checksum);

    return { transporter, payos, emailUser: gmailEmail };
}

// 1. TRIGGER (DUYỆT -> GỬI MAIL)
exports.onPartnerStatusChange = functions.firestore
    .document("users/{uid}")
    .onUpdate(async (change, context) => {
        const newData = change.after.data();
        const oldData = change.before.data();
        
        if (newData.status === oldData.status || newData.userType !== 'PARTNER') return null;

        try {
            const { transporter, payos, emailUser } = getServices();
            const email = newData.email;
            const name = newData.agencyName || "Đối tác";
            let subject = "";
            let htmlContent = "";

            if (newData.status === 'payment_pending') {
                const orderCode = Number(String(Date.now()).slice(-6));
                const domain = "http://localhost:5173"; 

                const paymentLinkData = await payos.createPaymentLink({
                    orderCode: orderCode,
                    amount: 10000, // 10.000 VNĐ
                    description: `KICHHOAT ${newData.phoneNumber.replace(/\s/g, '').slice(-9)}`,
                    cancelUrl: `${domain}/payment-fail`,
                    returnUrl: `${domain}/payment-success`
                });

                await change.after.ref.update({ payosOrderCode: orderCode });

                subject = "Hồ sơ đã được duyệt - Vui lòng thanh toán";
                htmlContent = `
                    <h3>Chào ${name},</h3>
                    <p>Phí kích hoạt: <b>10,000 VNĐ</b>.</p>
                    <a href="${paymentLinkData.checkoutUrl}" style="background:#28a745;color:#fff;padding:10px 20px;text-decoration:none;border-radius:5px">THANH TOÁN NGAY</a>
                `;
            }
            else if (newData.status === 'active') {
                subject = "Kích hoạt tài khoản thành công!";
                htmlContent = `<p>Chào mừng ${name}! Tài khoản đã kích hoạt.</p>`;
            }
            else if (newData.status === 'rejected') {
                subject = "Thông báo từ chối hồ sơ";
                htmlContent = `<p>Rất tiếc, hồ sơ chưa phù hợp.</p>`;
            }

            if (subject) {
                await transporter.sendMail({
                    from: `"Travelog Admin" <${emailUser}>`,
                    to: email,
                    subject: subject,
                    html: htmlContent
                });
                console.log(`📧 Mail sent to ${email}`);
            }
        } catch (error) {
            console.error("❌ Trigger Error:", error.message);
        }
        return null;
    });

// ============================================================
// 2. WEBHOOK (PAYOS GỌI VÀO) - ĐÃ SỬA LỖI
// ============================================================
exports.payosWebhook = functions.https.onRequest(async (req, res) => {
    try {
        // KHỞI TẠO DỊCH VỤ TẠI ĐÂY (Lazy Loading)
        const { payos } = getServices();

        console.log("Webhook Body:", JSON.stringify(req.body)); // Log để debug xem PayOS gửi gì

        const webhookData = payos.verifyPaymentWebhookData(req.body);

        console.log("Verified Data:", JSON.stringify(webhookData)); // Log kết quả xác thực

        // KIỂM TRA KỸ DỮ LIỆU TRƯỚC KHI ĐỌC
        if (webhookData && webhookData.code === "00" && webhookData.data) {
            const orderCode = webhookData.data.orderCode;
            console.log("💰 Nhận được thanh toán đơn:", orderCode);

            const snapshot = await db.collection("users")
                                     .where("payosOrderCode", "==", orderCode)
                                     .limit(1)
                                     .get();

            if (!snapshot.empty) {
                await snapshot.docs[0].ref.update({ status: 'active' });
                console.log("✅ Đã kích hoạt user");
            } else {
                console.log("⚠️ Không tìm thấy User khớp mã đơn");
            }
        } else {
            console.error("❌ Dữ liệu Webhook không hợp lệ hoặc thiếu data:", webhookData);
        }
        
        res.json({ success: true });

    } catch (error) {
        console.error("❌ Webhook Error:", error.message);
        // Trả về 200 để PayOS không spam lỗi, dù server mình lỗi
        res.json({ success: false }); 
    }
});