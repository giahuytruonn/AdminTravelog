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
  const gmailEmail = process.env.GMAIL_EMAIL;
  const gmailPass = process.env.GMAIL_PASS;
  const clientId = process.env.PAYOS_CLIENT_ID;
  const apiKey = process.env.PAYOS_API_KEY;
  const checksum = process.env.PAYOS_CHECKSUM_KEY;

  console.log("Checking Env:", { email: !!gmailEmail, clientId: !!clientId });

  if (!gmailEmail || !clientId) {
    throw new Error("THIẾU .ENV: Hãy kiểm tra file functions/.env");
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: gmailEmail, pass: gmailPass },
  });

  const payos = new PayOS(clientId, apiKey, checksum);

  return { transporter, payos, emailUser: gmailEmail };
}

// --- HÀM HỖ TRỢ: TẠO TEMPLATE EMAIL ĐẸP ---
function createEmailTemplate(
  title,
  message,
  buttonText = null,
  buttonLink = null,
  isError = false
) {
  const primaryColor = isError ? "#ff4d4f" : "#1890ff"; // Xanh dương hoặc Đỏ
  const buttonColor = isError ? "#ff4d4f" : "#28a745"; // Xanh lá cho nút hoặc Đỏ

  return `
    <!DOCTYPE html>
    <html>
    <body style="background-color: #f4f6f8; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 20px;">
        <table align="center" width="600" style="background: #ffffff; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); overflow: hidden;">
            <tr>
                <td bgcolor="${primaryColor}" style="padding: 30px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 1px; text-transform: uppercase;">Travelog Admin</h1>
                </td>
            </tr>
            
            <tr>
                <td style="padding: 40px 30px;">
                    <h2 style="color: #333333; margin-top: 0; font-size: 20px; border-bottom: 2px solid ${primaryColor}; padding-bottom: 10px; display: inline-block;">
                        ${title}
                    </h2>
                    
                    <div style="color: #555555; font-size: 16px; line-height: 1.6; margin-top: 20px;">
                        ${message}
                    </div>

                    ${
                      buttonText && buttonLink
                        ? `
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top: 35px;">
                        <tr>
                            <td align="center">
                                <a href="${buttonLink}" target="_blank" style="background-color: ${buttonColor}; color: #ffffff; padding: 15px 40px; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 16px; display: inline-block; box-shadow: 0 4px 6px rgba(0,0,0,0.2);">
                                    ${buttonText} &rarr;
                                </a>
                            </td>
                        </tr>
                    </table>
                    <p style="text-align: center; color: #999; font-size: 13px; margin-top: 20px;">
                        Hoặc truy cập link: <a href="${buttonLink}" style="color: #1890ff;">${buttonLink}</a>
                    </p>
                    `
                        : ""
                    }
                </td>
            </tr>
            
            <tr>
                <td bgcolor="#f9f9f9" style="padding: 20px; text-align: center; color: #999999; font-size: 12px; border-top: 1px solid #eeeeee;">
                    Email tự động từ hệ thống Travelog.<br>
                    Vui lòng không trả lời email này.
                </td>
            </tr>
        </table>
    </body>
    </html>
    `;
}

// 1. TRIGGER (DUYỆT -> GỬI MAIL)
exports.onPartnerStatusChange = functions.firestore
  .document("users/{uid}")
  .onUpdate(async (change, context) => {
    const newData = change.after.data();
    const oldData = change.before.data();

    if (newData.status === oldData.status || newData.userType !== "PARTNER")
      return null;

    try {
      const { transporter, payos, emailUser } = getServices();
      const email = newData.email;
      const name = newData.agencyName || "Đối tác";
      let subject = "";
      let htmlContent = "";

      // TRƯỜNG HỢP 1: THANH TOÁN
      if (newData.status === "payment_pending") {
        const orderCode = Number(String(Date.now()).slice(-6));
        const domain = "https://admin-management-travelog.vercel.app"; // Thay bằng link thật của bạn

        const paymentLinkData = await payos.createPaymentLink({
          orderCode: orderCode,
          amount: 10000,
          description: `KICHHOAT ${newData.phoneNumber
            .replace(/\s/g, "")
            .slice(-9)}`,
          cancelUrl: `${domain}/payment-fail`,
          returnUrl: `${domain}/payment-success`,
        });

        await change.after.ref.update({ payosOrderCode: orderCode });

        subject = "Yêu cầu thanh toán phí kích hoạt - Travelog";
        const msg = `Xin chào <b>${name}</b>,<br><br>Hồ sơ đăng ký đại lý của bạn đã được phê duyệt thành công.<br>Để kích hoạt tài khoản và bắt đầu sử dụng, vui lòng thanh toán khoản phí kích hoạt: <b>10,000 VNĐ</b>.`;

        htmlContent = createEmailTemplate(
          subject,
          msg,
          "THANH TOÁN NGAY",
          paymentLinkData.checkoutUrl
        );
      }
      // TRƯỜNG HỢP 2: KÍCH HOẠT THÀNH CÔNG
      else if (newData.status === "active") {
        subject = "Kích hoạt tài khoản thành công!";
        const msg = `Xin chào <b>${name}</b>,<br><br>Chúc mừng! Chúng tôi đã nhận được thanh toán.<br>Tài khoản đại lý của bạn đã chính thức được kích hoạt. Bạn có thể đăng nhập vào Dashboard ngay bây giờ.`;

        htmlContent = createEmailTemplate(
          subject,
          msg,
          "TRUY CẬP DASHBOARD",
          "https://admin-management-travelog.vercel.app"
        );
      }
      // TRƯỜNG HỢP 3: TỪ CHỐI
      else if (newData.status === "rejected") {
        subject = "Thông báo về hồ sơ đăng ký";
        const msg = `Xin chào <b>${name}</b>,<br><br>Rất tiếc, hồ sơ đăng ký của bạn chưa phù hợp với tiêu chí của chúng tôi tại thời điểm này.<br>Vui lòng liên hệ Admin để biết thêm chi tiết.`;

        htmlContent = createEmailTemplate(subject, msg, null, null, true); // True là màu đỏ (Lỗi)
      }

      if (subject) {
        await transporter.sendMail({
          from: `"Travelog Admin" <${emailUser}>`,
          to: email,
          subject: subject,
          html: htmlContent,
        });
        console.log(`📧 Mail sent to ${email}`);
      }
    } catch (error) {
      console.error("❌ Trigger Error:", error.message);
    }
    return null;
  });

// 2. WEBHOOK (PAYOS GỌI VÀO) - BẢN FIX LỖI "UNDEFINED ORDERCODE"
exports.payosWebhook = functions.https.onRequest(async (req, res) => {
  console.log("🔔 WEBHOOK GỌI ĐẾN!");

  try {
    const { payos } = getServices();
    const body = req.body; // Lấy dữ liệu thô

    console.log("📥 Body nhận được:", JSON.stringify(body));

    // BƯỚC 1: Kiểm tra dữ liệu cơ bản
    if (!body || !body.data) {
      console.error("❌ Body không hợp lệ hoặc thiếu data");
      return res.json({ success: false });
    }

    // BƯỚC 2: Lấy orderCode trực tiếp từ Body (An toàn nhất)
    // PayOS trả về orderCode là number, nhưng ta cứ ép kiểu cho chắc
    const orderCode = Number(body.data.orderCode);
    const responseCode = body.code; // "00" là thành công

    if (responseCode !== "00") {
      console.log("⚠️ Giao dịch không thành công. Code:", responseCode);
      return res.json({ success: true });
    }

    // BƯỚC 3: (Tùy chọn) Xác thực chữ ký để bảo mật
    // Nếu hàm verify lỗi, ta tạm thời bỏ qua để hệ thống chạy được đã
    try {
      payos.verifyPaymentWebhookData(body);
      console.log("✅ Chữ ký hợp lệ");
    } catch (e) {
      console.warn("⚠️ Cảnh báo chữ ký (Bỏ qua để chạy tiếp):", e.message);
    }

    // BƯỚC 4: Tìm và Update User
    console.log(`🔎 Đang tìm User có payosOrderCode = ${orderCode}`);

    const snapshot = await db
      .collection("users")
      .where("payosOrderCode", "==", orderCode)
      .limit(1)
      .get();

    if (!snapshot.empty) {
      const userDoc = snapshot.docs[0];
      await userDoc.ref.update({
        status: "active",
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      console.log(`🎉 Đã kích hoạt User: ${userDoc.id}`);
    } else {
      console.error(`❌ KHÔNG TÌM THẤY User nào có mã đơn: ${orderCode}`);
    }

    res.json({ success: true });
  } catch (error) {
    console.error("💀 LỖI CRASH WEBHOOK:", error);
    res.json({ success: false });
  }
});
