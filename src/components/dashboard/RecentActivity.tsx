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
                borderRadius: 20,
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)',
                height: '100%',
                background: 'linear-gradient(135deg, #0061ff 0%, #60efff 100%)',
                color: '#fff',
                position: 'relative',
                overflow: 'hidden'
            }}
            bodyStyle={{ padding: '24px', position: 'relative', zIndex: 1 }}
        >
            {/* Decorative circles */}
            <div style={{
                position: 'absolute',
                top: -50,
                right: -50,
                width: 150,
                height: 150,
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.1)',
                zIndex: 0
            }} />
            <div style={{
                position: 'absolute',
                bottom: -30,
                left: -30,
                width: 100,
                height: 100,
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.1)',
                zIndex: 0
            }} />

            <Title level={4} style={{
                marginBottom: 24,
                color: '#fff',
                fontWeight: 700,
                fontSize: 20
            }}>
                Recent Tours
            </Title>
            <List
                itemLayout="horizontal"
                dataSource={tours}
                split={false}
                renderItem={(item) => (
                    <List.Item style={{
                        padding: '16px',
                        marginBottom: 12,
                        background: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: 16,
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}>
                        <List.Item.Meta
                            avatar={
                                <Avatar
                                    src={item.images?.[0]}
                                    shape="square"
                                    size={56}
                                    style={{
                                        borderRadius: 12,
                                        boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                                        border: '2px solid rgba(255, 255, 255, 0.5)'
                                    }}
                                />
                            }
                            title={
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <Text strong style={{ fontSize: 16, flex: 1, marginRight: 8, color: '#fff' }} ellipsis={{ tooltip: item.title }}>
                                        {item.title}
                                    </Text>
                                    <Text strong style={{ color: 'rgba(255, 255, 255, 0.9)', whiteSpace: 'nowrap', fontSize: 15 }}>
                                        {item.price?.toLocaleString('vi-VN')} ₫
                                    </Text>
                                </div>
                            }
                            description={
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                                    <Text style={{ fontSize: 13, color: 'rgba(255, 255, 255, 0.7)' }}>
                                        <ClockCircleOutlined style={{ marginRight: 6 }} />
                                        {item.duration.days} Days
                                    </Text>
                                    <Tag
                                        color={item.status ? 'success' : 'default'}
                                        style={{
                                            borderRadius: 8,
                                            border: 'none',
                                            padding: '0 8px',
                                            background: item.status ? 'rgba(82, 196, 26, 0.2)' : 'rgba(0, 0, 0, 0.2)',
                                            color: '#fff'
                                        }}
                                    >
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
