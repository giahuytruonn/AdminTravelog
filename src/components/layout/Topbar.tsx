import React from 'react';
import { Layout, Avatar, Space, Typography, Input } from 'antd';
import { UserOutlined, SearchOutlined, BellOutlined } from '@ant-design/icons';

const { Header } = Layout;
const { Title } = Typography;

interface TopbarProps {
    collapsed: boolean;
}

const Topbar: React.FC<TopbarProps> = () => {
    return (
        <Header style={{
            padding: '0 24px',
            background: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'sticky',
            top: 0,
            zIndex: 9,
            width: '100%',
            boxShadow: '0 1px 4px rgba(0,21,41,0.08)'
        }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                {/* Title or Breadcrumbs could go here */}
                <Title level={4} style={{ margin: 0, color: '#1c1c1c' }}>
                    Admin Console
                </Title>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                <Input
                    prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
                    placeholder="Search..."
                    style={{ width: 250, borderRadius: 6 }}
                    variant="borderless"
                    className="bg-gray-50"
                />

                <Space size="large">
                    <BellOutlined style={{ fontSize: '18px', color: '#687176', cursor: 'pointer' }} />
                    <Space style={{ cursor: 'pointer' }}>
                        <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#0770e4' }} />
                        <span style={{ color: '#1c1c1c', fontWeight: 500 }}>Admin User</span>
                    </Space>
                </Space>
            </div>
        </Header>
    );
};

export default Topbar;
