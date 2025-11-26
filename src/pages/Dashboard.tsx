import React, { useEffect, useState } from 'react';
import { Row, Col, Spin, Button, Tooltip } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { toursService } from '../services/toursService';
import { couponsService } from '../services/couponsService';
import { destinationsService } from '../services/destinationsService';
import type { Tour } from '../types';
import DashboardStats from '../components/dashboard/DashboardStats';
import RecentActivity from '../components/dashboard/RecentActivity';
import PageContainer from '../components/layout/PageContainer';

const Dashboard: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        tours: 0,
        coupons: 0,
        destinations: 0,
    });
    const [recentTours, setRecentTours] = useState<Tour[]>([]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [tours, coupons, destinations] = await Promise.all([
                toursService.getAll(),
                couponsService.getAll(),
                destinationsService.getAll()
            ]);

            setStats({
                tours: tours.filter(t => t.status).length,
                coupons: coupons.filter(c => c.status).length,
                destinations: destinations.filter(d => d.status).length,
            });

            setRecentTours(tours.slice(0, 5));
        } catch (error) {
            console.error("Failed to fetch dashboard data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const loadingState = (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            background: 'linear-gradient(135deg, #eef4ff 0%, #f9fbff 55%, #e5f6ff 100%)',
            borderRadius: 32
        }}>
            <Spin size="large" />
        </div>
    );

    if (loading) {
        return loadingState;
    }

    return (
        <PageContainer
            title="Dashboard Overview"
            subtitle="Welcome back! Here's what's happening with your travel business today."
            actions={
                <Tooltip title="Refresh Data">
                    <Button
                        icon={<ReloadOutlined />}
                        onClick={fetchData}
                        style={{
                            borderRadius: 14,
                            height: 44,
                            width: 44,
                            border: '1px solid rgba(255,255,255,0.4)',
                            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08)',
                            backdropFilter: 'blur(8px)'
                        }}
                    />
                </Tooltip>
            }
        >
            <DashboardStats stats={stats} />

            <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
                <Col xs={24} lg={24}>
                    <RecentActivity tours={recentTours} />
                </Col>
            </Row>
        </PageContainer>
    );
};

export default Dashboard;
