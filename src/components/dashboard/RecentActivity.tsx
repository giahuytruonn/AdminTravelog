import React from 'react';
import { Card, List, Avatar, Typography, Tag } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';
import type { Tour } from '../../types';

const { Text, Title } = Typography;

interface RecentActivityProps {
    tours: Tour[];
}

const RecentActivity: React.FC<RecentActivityProps> = ({ tours }) => {
    return (
        <Card
            bordered={false}
            style={{
                borderRadius: 12,
                boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)',
                height: '100%'
            }}
        >
            <Title level={4} style={{ marginBottom: 24 }}>Recent Tours</Title>
            <List
                itemLayout="horizontal"
                dataSource={tours}
                renderItem={(item) => (
                    <List.Item style={{ padding: '12px 0', borderBottom: '1px solid #f0f0f0' }}>
                        <List.Item.Meta
                            avatar={
                                <Avatar
                                    src={item.images?.[0]}
                                    shape="square"
                                    size={48}
                                    style={{ borderRadius: 8 }}
                                />
                            }
                            title={
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Text strong style={{ fontSize: 15 }}>{item.title}</Text>
                                    <Text strong style={{ color: '#1890ff' }}>${item.price.toLocaleString()}</Text>
                                </div>
                            }
                            description={
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                                    <Text type="secondary" style={{ fontSize: 13 }}>
                                        <ClockCircleOutlined style={{ marginRight: 4 }} />
                                        {item.duration.days} Days
                                    </Text>
                                    <Tag color={item.status ? 'success' : 'default'}>
                                        {item.status ? 'Active' : 'Inactive'}
                                    </Tag>
                                </div>
                            }
                        />
                    </List.Item>
                )}
            />
        </Card>
    );
};

export default RecentActivity;
