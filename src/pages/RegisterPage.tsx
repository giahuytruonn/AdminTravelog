import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, Divider, App } from 'antd';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase/firebase';
import { useNavigate, Link } from 'react-router-dom';
import type { User } from '../types';

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
            style={{ width: 500, maxWidth: '100%', borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
        >
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <Title level={3} style={{ color: '#1890ff', margin: 0 }}>Đăng ký Đối tác</Title>
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
                    <Input placeholder="example@company.com" size="large" autoComplete="username" />
                </Form.Item>

                <Form.Item 
                    name="password" 
                    label="Mật khẩu" 
                    rules={[
                        { required: true, message: 'Vui lòng nhập mật khẩu' },
                        { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' }
                    ]}
                >
                    <Input.Password placeholder="••••••••" size="large" autoComplete="new-password" />
                </Form.Item>

                <Divider orientation="left" style={{ fontSize: 14, color: '#999' }}>Thông tin Đại lý</Divider>

                <Form.Item 
                    name="agencyName" 
                    label="Tên Công ty / Đại lý" 
                    rules={[{ required: true, message: 'Vui lòng nhập tên đơn vị' }]}
                >
                    <Input placeholder="Ví dụ: Viettravel..." size="large" />
                </Form.Item>

                <Form.Item 
                    name="fullName" 
                    label="Họ tên người đại diện" 
                    rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
                >
                    <Input placeholder="Nguyễn Văn A" size="large" />
                </Form.Item>

                <Form.Item 
                    name="phone" 
                    label="Số điện thoại" 
                    rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
                >
                    <Input placeholder="0909xxxxxx" size="large" />
                </Form.Item>

                <Form.Item 
                    name="reason" 
                    label="Lý do hợp tác"
                >
                    <Input.TextArea rows={3} placeholder="Mô tả ngắn..." />
                </Form.Item>

                <Form.Item style={{ marginTop: 20 }}>
                    <Button type="primary" htmlType="submit" block loading={loading} size="large">
                        Gửi hồ sơ đăng ký
                    </Button>
                </Form.Item>
                
                <div style={{ textAlign: 'center' }}>
                    Đã có tài khoản? <Link to="/login" style={{ fontWeight: 600 }}>Đăng nhập ngay</Link>
                </div>
            </Form>
        </Card>
    );
};

// Bọc Component chính trong <App> để fix lỗi warning của Ant Design v5
const RegisterPage: React.FC = () => {
    return (
        <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: '100vh', 
            background: '#f0f2f5',
            padding: '20px'
        }}>
            <App>
                <RegisterForm />
            </App>
        </div>
    );
};

export default RegisterPage;