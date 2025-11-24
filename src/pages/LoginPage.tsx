import React, { useState } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import { useNavigate, Link } from 'react-router-dom';

const LoginPage = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onFinish = async (values: any) => {
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, values.email, values.password);
            message.success('Đăng nhập thành công');
            navigate('/'); // AuthGuard sẽ tự kiểm tra tiếp xem đi đâu
        } catch (error: any) {
            message.error('Đăng nhập thất bại: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f0f2f5' }}>
            <Card title="Đăng nhập Hệ thống" style={{ width: 400 }}>
                <Form layout="vertical" onFinish={onFinish}>
                    <Form.Item name="email" label="Email" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="password" label="Mật khẩu" rules={[{ required: true }]}>
                        <Input.Password />
                    </Form.Item>
                    <Button type="primary" htmlType="submit" block loading={loading}>
                        Đăng nhập
                    </Button>
                    <div style={{marginTop: 15, textAlign: 'center'}}>
                        Chưa có tài khoản? <Link to="/register">Đăng ký Đối tác</Link>
                    </div>
                </Form>
            </Card>
        </div>
    );
};
export default LoginPage;