import React from 'react';
import { Card, Typography, Select } from 'antd';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

const { Title } = Typography;
const { Option } = Select;

const data = [
    { name: 'Jan', revenue: 4000, orders: 2400 },
    { name: 'Feb', revenue: 3000, orders: 1398 },
    { name: 'Mar', revenue: 2000, orders: 9800 },
    { name: 'Apr', revenue: 2780, orders: 3908 },
    { name: 'May', revenue: 1890, orders: 4800 },
    { name: 'Jun', revenue: 2390, orders: 3800 },
    { name: 'Jul', revenue: 3490, orders: 4300 },
    { name: 'Aug', revenue: 4000, orders: 2400 },
    { name: 'Sep', revenue: 3000, orders: 1398 },
    { name: 'Oct', revenue: 2000, orders: 9800 },
    { name: 'Nov', revenue: 2780, orders: 3908 },
    { name: 'Dec', revenue: 1890, orders: 4800 },
];

const RevenueChart: React.FC = () => {
    return (
        <Card
            bordered={false}
            style={{
                borderRadius: 12,
                boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)',
                height: '100%'
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <Title level={4} style={{ margin: 0 }}>Revenue Overview</Title>
                <Select defaultValue="year" style={{ width: 120 }} bordered={false}>
                    <Option value="week">This Week</Option>
                    <Option value="month">This Month</Option>
                    <Option value="year">This Year</Option>
                </Select>
            </div>
            <div style={{ height: 350, width: '100%' }}>
                <ResponsiveContainer>
                    <AreaChart
                        data={data}
                        margin={{
                            top: 10,
                            right: 30,
                            left: 0,
                            bottom: 0,
                        }}
                    >
                        <defs>
                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#1890ff" stopOpacity={0.2} />
                                <stop offset="95%" stopColor="#1890ff" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#8c8c8c', fontSize: 12 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#8c8c8c', fontSize: 12 }}
                            tickFormatter={(value) => `${value.toLocaleString('vi-VN')} ₫`}
                        />
                        <Tooltip
                            contentStyle={{
                                borderRadius: 8,
                                border: 'none',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                            }}
                            formatter={(value: number) => [`${value.toLocaleString('vi-VN')} ₫`, 'Revenue']}
                        />
                        <Area
                            type="monotone"
                            dataKey="revenue"
                            stroke="#1890ff"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorRevenue)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
};

export default RevenueChart;
