import React from 'react';
import { Card, Row, Col } from 'antd';
import {
    GlobalOutlined,
    TagsOutlined,
    EnvironmentOutlined
} from '@ant-design/icons';

interface DashboardStatsProps {
    stats: {
        tours: number;
        coupons: number;
        destinations: number;
    };
}

const StatCard = ({ title, value, prefix, gradient }: any) => (
    <Card
        bordered={false}
        style={{
            borderRadius: 20,
            background: gradient,
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
            height: '100%',
            border: 'none',
            position: 'relative',
            overflow: 'hidden'
        }}
        bodyStyle={{ padding: '24px' }}
    >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
            <div>
                <div style={{ color: 'rgba(255,255,255,0.9)', fontSize: 16, fontWeight: 600, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{title}</div>
                <div style={{ color: '#fff', fontSize: 42, fontWeight: 800, lineHeight: 1, textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>{value}</div>
            </div>
            <div style={{
                backgroundColor: 'rgba(255,255,255,0.2)',
                backdropFilter: 'blur(8px)',
                width: 64,
                height: 64,
                borderRadius: 20,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                border: '1px solid rgba(255,255,255,0.3)'
            }}>
                {React.cloneElement(prefix, { style: { color: '#fff', fontSize: 32 } })}
            </div>
        </div>
        {/* Decorative background circles */}
        <div style={{
            position: 'absolute',
            top: -20,
            right: -20,
            width: 100,
            height: 100,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.1)',
            pointerEvents: 'none'
        }} />
        <div style={{
            position: 'absolute',
            bottom: -30,
            left: -30,
            width: 140,
            height: 140,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.05)',
            pointerEvents: 'none'
        }} />
    </Card>
);

const DashboardStats: React.FC<DashboardStatsProps> = ({ stats }) => {
    return (
        <Row gutter={[24, 24]}>
            <Col xs={24} sm={12} lg={8}>
                <StatCard
                    title="Total Tours"
                    value={stats.tours}
                    prefix={<GlobalOutlined />}
                    gradient="linear-gradient(135deg, #0061ff 0%, #60efff 100%)"
                />
            </Col>
            <Col xs={24} sm={12} lg={8}>
                <StatCard
                    title="Active Coupons"
                    value={stats.coupons}
                    prefix={<TagsOutlined />}
                    gradient="linear-gradient(135deg, #00c6ff 0%, #0072ff 100%)"
                />
            </Col>
            <Col xs={24} sm={12} lg={8}>
                <StatCard
                    title="Destinations"
                    value={stats.destinations}
                    prefix={<EnvironmentOutlined />}
                    gradient="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
                />
            </Col>
        </Row>
    );
};

export default DashboardStats;
