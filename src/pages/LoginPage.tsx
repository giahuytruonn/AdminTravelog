import React, { useState } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import { useNavigate, Link } from 'react-router-dom';
import type { CSSProperties } from 'react';

const backgroundStyle: CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #e4f3ff 0%, #f9fbff 55%, #e8fbff 100%)',
    padding: 20,
    position: 'relative',
    overflow: 'hidden'
};

const haloBase: CSSProperties = {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: '50%',
    filter: 'blur(100px)',
    opacity: 0.45
};

const LoginPage = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onFinish = async (values: any) => {
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, values.email, values.password);
            sessionStorage.setItem('loginSuccess', 'true');
            navigate('/'); // AuthGuard sẽ tự kiểm tra tiếp xem đi đâu
        } catch (error: any) {
            message.error('Đăng nhập thất bại: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={backgroundStyle}>
            <div style={{ ...haloBase, top: -90, right: -70, background: 'rgba(0, 97, 255, 0.25)' }} />
            <div style={{ ...haloBase, bottom: -110, left: -80, background: 'rgba(96, 239, 255, 0.35)' }} />
            <Card
                style={{
                    width: 420,
                    maxWidth: '100%',
                    borderRadius: 20,
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.01)',
                    border: 'none',
                    position: 'relative',
                    zIndex: 1,
                    background: 'rgba(255,255,255,0.95)',
                    backdropFilter: 'blur(6px)'
                }}
            >
                <div style={{ textAlign: 'center', marginBottom: 30 }}>
                    <h2 style={{
                        margin: 0,
                        background: 'linear-gradient(135deg, #0061ff 0%, #60efff 100%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        fontSize: 28,
                        fontWeight: 700,
                        fontFamily: "'Outfit', sans-serif",
                        color: 'transparent'
                    }}>
                        Admin Travelog
                    </h2>
                    <div style={{ color: '#888', marginTop: 5 }}>Đăng nhập hệ thống quản trị</div>
                </div>

                <Form layout="vertical" onFinish={onFinish} size="large">
                    <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Vui lòng nhập email' }]}>
                        <Input style={{ borderRadius: 10 }} placeholder="admin@example.com" />
                    </Form.Item>
                    <Form.Item name="password" label="Mật khẩu" rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}>
                        <Input.Password style={{ borderRadius: 10 }} placeholder="••••••••" />
                    </Form.Item>
                    <Form.Item style={{ marginTop: 20 }}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            block
                            loading={loading}
                            style={{
                                height: 45,
                                borderRadius: 10,
                                background: 'linear-gradient(135deg, #0061ff 0%, #60efff 100%)',
                                border: 'none',
                                boxShadow: '0 4px 10px rgba(0, 97, 255, 0.3)',
                                fontWeight: 600,
                                fontSize: 16
                            }}
                        >
                            Đăng nhập
                        </Button>
                    </Form.Item>
                    <div style={{ textAlign: 'center', marginTop: 10 }}>
                        Chưa có tài khoản? <Link to="/register" style={{ color: '#0061ff', fontWeight: 600 }}>Đăng ký Đối tác</Link>
                    </div>
                </Form>
            </Card>
        </div>
    );
};
export default LoginPage;