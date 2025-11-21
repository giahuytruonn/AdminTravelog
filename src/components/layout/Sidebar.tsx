import React from 'react';
import { Layout, Menu } from 'antd';
import {
    DashboardOutlined,
    GlobalOutlined,
    TagsOutlined,
    EnvironmentOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';

const { Sider } = Layout;

interface SidebarProps {
    collapsed: boolean;
    onCollapse: (collapsed: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, onCollapse }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const items = [
        {
            key: '/',
            icon: <DashboardOutlined />,
            label: 'Dashboard',
        },
        {
            key: '/tours',
            icon: <GlobalOutlined />,
            label: 'Tours',
        },
        {
            key: '/coupons',
            icon: <TagsOutlined />,
            label: 'Coupons',
        },
        {
            key: '/destinations',
            icon: <EnvironmentOutlined />,
            label: 'Destinations',
        },
    ];

    return (
        <Sider
            collapsible
            collapsed={collapsed}
            onCollapse={onCollapse}
            theme="light"
            width={250}
            style={{
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                zIndex: 10,
                height: '100vh',
                position: 'fixed',
                left: 0,
                top: 0,
                bottom: 0,
            }}
        >
            <div style={{
                height: 64,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderBottom: '1px solid #f0f0f0'
            }}>
                <h2 style={{
                    color: '#0770e4',
                    margin: 0,
                    fontSize: collapsed ? '18px' : '24px',
                    fontWeight: 'bold',
                    transition: 'all 0.2s'
                }}>
                    {collapsed ? 'AT' : 'Admin Travelog'}
                </h2>
            </div>
            <Menu
                theme="light"
                mode="inline"
                selectedKeys={[location.pathname]}
                items={items}
                onClick={({ key }) => navigate(key)}
                style={{ borderRight: 0 }}
            />
        </Sider>
    );
};

export default Sidebar;
