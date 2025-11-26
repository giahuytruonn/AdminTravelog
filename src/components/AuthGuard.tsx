import React from 'react';
import { Navigate } from 'react-router-dom';
import { Spin, Result, Button } from 'antd';
import { useAuth } from '../auth/useAuth';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/firebase';

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
    const { user, userProfile, loading } = useAuth();

    if (loading) {
        return <div style={{height: '100vh', display:'flex', justifyContent:'center', alignItems:'center'}}><Spin size="large" tip="Loading..." /></div>;
    }

    // 1. Chưa đăng nhập -> Về trang Login
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // 2. Đã đăng nhập nhưng chưa tải xong profile -> Chờ xíu
    if (!userProfile) {
         return <div style={{height: '100vh', display:'flex', justifyContent:'center', alignItems:'center'}}><Spin /></div>;
    }

    // 3. LOGIC CHẶN PARTNER THEO STATUS (Status Check)
    if (userProfile.userType === 'PARTNER') {
        const status = userProfile.status as string;

        if (status === 'pending_review') {
            return (
                <Result
                    status="info"
                    title="Đang xét duyệt hồ sơ"
                    subTitle="Hồ sơ đối tác của bạn đang được Admin xem xét. Vui lòng kiểm tra email sau."
                    extra={<Button type="primary" onClick={() => signOut(auth)}>Đăng xuất</Button>}
                />
            );
        }
        if (status === 'payment_pending') {
            return (
                <Result
                    status="warning"
                    title="Hồ sơ đã được duyệt!"
                    subTitle="Vui lòng hoàn tất phí kích hoạt để truy cập hệ thống quản lý Tour."
                    extra={[
                        <Button type="primary" key="pay">Thanh toán ngay (Demo)</Button>,
                        <Button key="logout" onClick={() => signOut(auth)}>Đăng xuất</Button>
                    ]}
                />
            );
        }
        if (status === 'rejected') {
            return (
                <Result
                    status="error"
                    title="Hồ sơ bị từ chối"
                    subTitle="Tài khoản của bạn không đủ điều kiện tham gia."
                    extra={<Button onClick={() => signOut(auth)}>Đăng xuất</Button>}
                />
            );
        }
    }

    // 4. Nếu là Admin hoặc Partner Active -> Cho phép truy cập vào Layout
    return children;
};