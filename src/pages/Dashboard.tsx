    import React, { useEffect, useState } from 'react';
    import { Row, Col, Typography, Spin } from 'antd';
    import { toursService } from '../services/toursService';
    import { couponsService } from '../services/couponsService';
    import { destinationsService } from '../services/destinationsService';
    import type { Tour } from '../types';
    import DashboardStats from '../components/dashboard/DashboardStats';
    import RecentActivity from '../components/dashboard/RecentActivity';

    const { Title, Text } = Typography;

    const Dashboard: React.FC = () => {
        const [loading, setLoading] = useState(true);
        const [stats, setStats] = useState({
            tours: 0,
            coupons: 0,
            destinations: 0,
        });
        const [recentTours, setRecentTours] = useState<Tour[]>([]);

        useEffect(() => {
            const fetchData = async () => {
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

            fetchData();
        }, []);

        if (loading) {
            return (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <Spin size="large" />
                </div>
            );
        }

        return (
            <div style={{ paddingBottom: 24 }}>
                <div style={{ marginBottom: 32 }}>
                    <Title level={2} style={{ marginBottom: 8, fontWeight: 700 }}>Dashboard Overview</Title>
                    <Text type="secondary">Welcome back! Here's what's happening with your travel business today.</Text>
                </div>

                <DashboardStats stats={stats} />

                <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
                    <Col xs={24} lg={24}>
                        <RecentActivity tours={recentTours} />
                    </Col>
                </Row>
            </div>
        );
    };

    export default Dashboard;
