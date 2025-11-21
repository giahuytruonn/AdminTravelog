import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, List, Typography, Spin } from 'antd';
import {
    GlobalOutlined,
    TagsOutlined,
    EnvironmentOutlined,
    ArrowUpOutlined
} from '@ant-design/icons';
import { toursService } from '../services/toursService';
import { couponsService } from '../services/couponsService';
import { destinationsService } from '../services/destinationsService';
import type { Tour } from '../types';

const { Title } = Typography;

const Dashboard: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        tours: 0,
        coupons: 0,
        destinations: 0
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
                    destinations: destinations.filter(d => d.status).length
                });

                // Get top 5 recent tours (mocking "recent" by slicing for now, or sort by createdAt if available)
                // Since we don't have sorting in getAll yet, we'll just take the first 5.
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
        return <div style={{ display: 'flex', justifyContent: 'center', padding: 50 }}><Spin size="large" /></div>;
    }

    return (
        <div>
            <Title level={2} style={{ marginBottom: 24 }}>Dashboard</Title>

            <Row gutter={[16, 16]}>
                <Col xs={24} sm={8}>
                    <Card variant="borderless" className="shadow-sm">
                        <Statistic
                            title="Active Tours"
                            value={stats.tours}
                            prefix={<GlobalOutlined style={{ color: '#0770e4' }} />}
                            valueStyle={{ color: '#0770e4' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card variant="borderless" className="shadow-sm">
                        <Statistic
                            title="Active Coupons"
                            value={stats.coupons}
                            prefix={<TagsOutlined style={{ color: '#ff5e1f' }} />}
                            valueStyle={{ color: '#ff5e1f' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card variant="borderless" className="shadow-sm">
                        <Statistic
                            title="Destinations"
                            value={stats.destinations}
                            prefix={<EnvironmentOutlined style={{ color: '#0194f3' }} />}
                            valueStyle={{ color: '#0194f3' }}
                        />
                    </Card>
                </Col>
            </Row>

            <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
                <Col xs={24} lg={16}>
                    <Card title="Recent Tours" variant="borderless" className="shadow-sm">
                        <List
                            itemLayout="horizontal"
                            dataSource={recentTours}
                            renderItem={(item) => (
                                <List.Item>
                                    <List.Item.Meta
                                        title={item.title}
                                        description={`Price: $${item.price.toLocaleString()}`}
                                    />
                                    <div>
                                        {`${item.duration.days} Days ${item.duration.nights} Nights`}
                                    </div>
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>
                <Col xs={24} lg={8}>
                    <Card title="Quick Actions" variant="borderless" className="shadow-sm">
                        <List
                            dataSource={[
                                'Add New Tour',
                                'Create Coupon',
                                'Update Destination'
                            ]}
                            renderItem={(item) => (
                                <List.Item>
                                    <Typography.Text><ArrowUpOutlined /> {item}</Typography.Text>
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default Dashboard;
