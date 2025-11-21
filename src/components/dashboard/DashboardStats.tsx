import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import {
    GlobalOutlined,
    TagsOutlined,
    EnvironmentOutlined,
    UserOutlined,
    ArrowUpOutlined,
    ArrowDownOutlined
} from '@ant-design/icons';

interface DashboardStatsProps {
    stats: {
        tours: number;
        coupons: number;
        destinations: number;
        users: number; // Mocking users for now
    };
}

const StatCard = ({ title, value, prefix, color, trend }: any) => (
    <Card
        bordered={false}
        style={{
            borderRadius: 12,
            boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)',
            height: '100%'
        }}
    >
        <Statistic
            title={<span style={{ color: '#8c8c8c', fontWeight: 500 }}>{title}</span>}
            value={value}
            valueStyle={{ fontWeight: 'bold', color: '#262626', fontSize: 28 }}
            prefix={
                <div style={{
                    backgroundColor: `${color}15`,
                    padding: 10,
                    borderRadius: 12,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 12
                }}>
                    {React.cloneElement(prefix, { style: { color: color, fontSize: 20 } })}
                </div>
            }
            suffix={
                trend && (
                    <div style={{ fontSize: 14, color: trend > 0 ? '#52c41a' : '#ff4d4f', display: 'flex', alignItems: 'center', marginLeft: 8 }}>
                        {trend > 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                        <span style={{ marginLeft: 4 }}>{Math.abs(trend)}%</span>
                    </div>
                )
            }
        />
    </Card>
);

const DashboardStats: React.FC<DashboardStatsProps> = ({ stats }) => {
    return (
        <Row gutter={[24, 24]}>
            <Col xs={24} sm={12} lg={6}>
                <StatCard
                    title="Total Tours"
                    value={stats.tours}
                    prefix={<GlobalOutlined />}
                    color="#1890ff"
                    trend={12}
                />
            </Col>
            <Col xs={24} sm={12} lg={6}>
                <StatCard
                    title="Active Coupons"
                    value={stats.coupons}
                    prefix={<TagsOutlined />}
                    color="#722ed1"
                    trend={-5}
                />
            </Col>
            <Col xs={24} sm={12} lg={6}>
                <StatCard
                    title="Destinations"
                    value={stats.destinations}
                    prefix={<EnvironmentOutlined />}
                    color="#fa8c16"
                    trend={8}
                />
            </Col>
            <Col xs={24} sm={12} lg={6}>
                <StatCard
                    title="Total Users"
                    value={stats.users}
                    prefix={<UserOutlined />}
                    color="#52c41a"
                    trend={24}
                />
            </Col>
        </Row>
    );
};

export default DashboardStats;
