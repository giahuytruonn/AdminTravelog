import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, Divider, App } from 'antd';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase/firebase';
import { useNavigate, Link } from 'react-router-dom';
import type { User } from '../types';
import type { CSSProperties } from 'react';

const { Title, Text } = Typography;

// Tách logic ra thành component con để dùng được Hook App.useApp()
const RegisterForm: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [form] = Form.useForm();

    // Sử dụng hook của Ant Design v5 để hiện thông báo chuẩn
    const { message, notification } = App.useApp();

    const onFinish = async (values: any) => {
        setLoading(true);
        try {
            // 1. Tạo tài khoản bên Firebase Authentication
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                values.email,
                values.password
            );
            const uid = userCredential.user.uid;

            // 2. Chuẩn bị dữ liệu
            const newUser: User = {
                id: uid,
                email: values.email,
                displayName: values.fullName,
                phoneNumber: values.phone,
                userType: 'PARTNER',
                status: 'pending_review',
                agencyName: values.agencyName,
                reason: values.reason || '',
                createdAt: serverTimestamp() as any,
                rank: 'Bronze',
                pointReward: 0,
                coupons: [],
                savedTours: []
            };

            // 3. Lưu vào Firestore
            await setDoc(doc(db, 'users', uid), newUser);

            message.success('Đăng ký thành công! Vui lòng đăng nhập.');
            navigate('/login');

        } catch (error: any) {
            console.error("Register Error:", error);

            // Xử lý các lỗi Firebase thường gặp
            if (error.code === 'auth/email-already-in-use') {
                notification.error({
                    message: 'Đăng ký thất bại',
                    description: 'Email này đã được sử dụng. Vui lòng dùng email khác hoặc đăng nhập.',
                });
            } else if (error.code === 'auth/weak-password') {
                message.error('Mật khẩu quá yếu (tối thiểu 6 ký tự).');
            } else {
                message.error('Đã có lỗi xảy ra: ' + error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card
            style={{
                width: 500,
                maxWidth: '100%',
                borderRadius: 20,
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.01)',
                border: 'none'
            }}
        >
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <Title level={3} style={{
                    margin: 0,
                    background: 'linear-gradient(135deg, #0061ff 0%, #60efff 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    color: 'transparent'
                }}>
                    Đăng ký Đối tác
                </Title>
                <Text type="secondary">Trở thành đại lý lữ hành cùng Travelog</Text>
            </div>

            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                scrollToFirstError
                autoComplete="off" // Tắt gợi ý rác của trình duyệt
            >
                <Form.Item
                    name="email"
                    label="Email đăng nhập"
                    rules={[
                        { required: true, message: 'Vui lòng nhập Email' },
                        { type: 'email', message: 'Email không hợp lệ' }
                    ]}
                >
                    <Input placeholder="example@company.com" size="large" autoComplete="username" style={{ borderRadius: 10 }} />
                </Form.Item>

                <Form.Item
                    name="password"
                    label="Mật khẩu"
                    rules={[
                        { required: true, message: 'Vui lòng nhập mật khẩu' },
                        { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' }
                    ]}
                >
                    <Input.Password placeholder="••••••••" size="large" autoComplete="new-password" style={{ borderRadius: 10 }} />
                </Form.Item>

                <Divider orientation="left" style={{ fontSize: 14, color: '#999' }}>Thông tin Đại lý</Divider>

                <Form.Item
                    name="agencyName"
                    label="Tên Công ty / Đại lý"
                    rules={[{ required: true, message: 'Vui lòng nhập tên đơn vị' }]}
                >
                    <Input placeholder="Ví dụ: Viettravel..." size="large" style={{ borderRadius: 10 }} />
                </Form.Item>

                <Form.Item
                    name="fullName"
                    label="Họ tên người đại diện"
                    rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
                >
                    <Input placeholder="Nguyễn Văn A" size="large" style={{ borderRadius: 10 }} />
                </Form.Item>

                <Form.Item
                    name="phone"
                    label="Số điện thoại"
                    rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
                >
                    <Input placeholder="0909xxxxxx" size="large" style={{ borderRadius: 10 }} />
                </Form.Item>

                <Form.Item
                    name="reason"
                    label="Lý do hợp tác"
                >
                    <Input.TextArea rows={3} placeholder="Mô tả ngắn..." style={{ borderRadius: 10 }} />
                </Form.Item>

                <Form.Item style={{ marginTop: 20 }}>
                    <Button
                        type="primary"
                        htmlType="submit"
                        block
                        loading={loading}
                        size="large"
                        style={{
                            height: 45,
                            borderRadius: 10,
                            background: 'linear-gradient(135deg, #0061ff 0%, #60efff 100%)',
                            border: 'none',
                            boxShadow: '0 4px 10px rgba(0, 97, 255, 0.3)',
                            fontWeight: 600
                        }}
                    >
                        Gửi hồ sơ đăng ký
                    </Button>
                </Form.Item>

                <div style={{ textAlign: 'center' }}>
                    Đã có tài khoản? <Link to="/login" style={{ fontWeight: 600, color: '#0061ff' }}>Đăng nhập ngay</Link>
                </div>
            </Form>
        </Card>
    );
};

// Bọc Component chính trong <App> để fix lỗi warning của Ant Design v5
const backgroundStyle: CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #e3f2ff 0%, #fdfdff 50%, #e8fbff 100%)',
    padding: 20,
    position: 'relative',
    overflow: 'hidden'
};

const haloBase: CSSProperties = {
    position: 'absolute',
    width: 380,
    height: 380,
    borderRadius: '50%',
    filter: 'blur(120px)',
    opacity: 0.4
};

const RegisterPage: React.FC = () => {
    return (
        <div style={backgroundStyle}>
            <div style={{ ...haloBase, top: -80, right: -60, background: 'rgba(0, 97, 255, 0.25)' }} />
            <div style={{ ...haloBase, bottom: -120, left: -80, background: 'rgba(96, 239, 255, 0.35)' }} />
            <App>
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <RegisterForm />
                </div>
            </App>
        </div>
    );
};

export default RegisterPage;