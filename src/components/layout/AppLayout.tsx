import React, { useState, useEffect } from 'react';
import { Layout, notification } from 'antd';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const { Content } = Layout;

const AppLayout: React.FC = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [api, contextHolder] = notification.useNotification();

    useEffect(() => {
        const loginFlag = sessionStorage.getItem('loginSuccess');
        if (loginFlag) {
            api.success({
                message: 'Đăng nhập thành công',
                description: 'Chào mừng bạn quay lại Travelog Admin!',
                placement: 'topRight',
                duration: 3
            });
            sessionStorage.removeItem('loginSuccess');
        }
    }, [api]);

    return (
        <>
        {contextHolder}
        <Layout style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #e6f0ff 0%, #f9fbff 60%, #e2f7ff 100%)' }}>
            <Sidebar collapsed={collapsed} onCollapse={setCollapsed} />
            <Layout style={{
                marginLeft: collapsed ? 80 : 250,
                transition: 'margin-left 0.2s',
                minHeight: '100vh',
                background: 'transparent'
            }}>
                <Content style={{
                    margin: '24px 16px',
                    padding: 24,
                    minHeight: 280,
                    background: 'transparent',
                    overflow: 'initial'
                }}>
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
        </>
    );
};

export default AppLayout;
