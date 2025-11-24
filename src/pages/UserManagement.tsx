import React from 'react';
import { Table, Tabs, Switch, Tag, Button, Space, message, Tooltip, Modal } from 'antd';
import { 
    CheckCircleOutlined, 
    CloseCircleOutlined, 
    DollarCircleOutlined, 
    UserOutlined, 
    ShopOutlined 
} from '@ant-design/icons';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase'; // Đường dẫn tới file config firebase của bạn
import { useFirestoreQuery } from '../hooks/useFirestoreQuery'; // Hook bạn đã có
import type { User, PartnerStatus } from '../types';

const { TabPane } = Tabs;

const UserManagement: React.FC = () => {
    // 1. Lấy dữ liệu từ collection 'users'
    const { data: users, loading, refetch } = useFirestoreQuery<User>('users', []);

    // --- HÀM XỬ LÝ CHO CUSTOMER ---
    const handleToggleCustomer = async (id: string, currentStatus: boolean) => {
        try {
            await updateDoc(doc(db, 'users', id), { status: !currentStatus });
            message.success(`Đã cập nhật trạng thái khách hàng`);
            refetch();
        } catch (error) {
            message.error("Lỗi cập nhật");
        }
    };

    // --- HÀM XỬ LÝ CHO PARTNER ---
    const handleUpdatePartnerStatus = async (id: string, newStatus: PartnerStatus) => {
        try {
            await updateDoc(doc(db, 'users', id), { status: newStatus });
            message.success("Đã cập nhật trạng thái hồ sơ");
            refetch();
            // Cloud Function sẽ tự động lắng nghe thay đổi này để gửi mail
        } catch (error) {
            message.error("Lỗi cập nhật");
        }
    };

    // --- CỘT BẢNG CUSTOMER ---
    const customerColumns = [
        { title: 'Tên khách hàng', dataIndex: 'displayName', key: 'name' },
        { title: 'Email', dataIndex: 'email', key: 'email' },
        { title: 'Phone', dataIndex: 'phoneNumber', key: 'phone' },
        { title: 'Rank', dataIndex: 'rank', key: 'rank', render: (rank: string) => <Tag color="geekblue">{rank || 'N/A'}</Tag> },
        { 
            title: 'Trạng thái', 
            dataIndex: 'status', 
            key: 'status',
            render: (status: boolean, record: User) => (
                <Switch 
                    checked={status === true}
                    checkedChildren="Active"
                    unCheckedChildren="Banned"
                    onChange={() => handleToggleCustomer(record.id, status as boolean)}
                />
            )
        },
    ];

    // --- CỘT BẢNG PARTNER ---
    const partnerColumns = [
        { title: 'Tên Đại Lý (Agency)', dataIndex: 'agencyName', key: 'agency', render: (text: string) => <b>{text}</b> },
        { title: 'Người đại diện', dataIndex: 'displayName', key: 'name' },
        { title: 'Email', dataIndex: 'email', key: 'email' },
        { title: 'Lý do đăng ký', dataIndex: 'reason', key: 'reason' },
        { 
            title: 'Quy trình', 
            dataIndex: 'status', 
            key: 'status',
            render: (status: string) => {
                let color = 'default';
                let text = status;
                switch(status) {
                    case 'active': color = 'green'; text = 'HOẠT ĐỘNG'; break;
                    case 'pending_review': color = 'orange'; text = 'CHỜ DUYỆT'; break;
                    case 'payment_pending': color = 'blue'; text = 'CHỜ THANH TOÁN'; break;
                    case 'rejected': color = 'red'; text = 'TỪ CHỐI'; break;
                }
                return <Tag color={color}>{text}</Tag>;
            }
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record: User) => (
                <Space>
                    {/* Nút Duyệt: Chỉ hiện khi Chờ duyệt */}
                    {record.status === 'pending_review' && (
                        <>
                            <Tooltip title="Duyệt hồ sơ -> Gửi mail yêu cầu đóng phí">
                                <Button type="primary" size="small" icon={<CheckCircleOutlined />} 
                                    onClick={() => handleUpdatePartnerStatus(record.id, 'payment_pending')} 
                                >Duyệt</Button>
                            </Tooltip>
                            <Button danger size="small" icon={<CloseCircleOutlined />} 
                                onClick={() => handleUpdatePartnerStatus(record.id, 'rejected')}
                            >Từ chối</Button>
                        </>
                    )}

                    {/* Nút Xác nhận tiền: Chỉ hiện khi Chờ thanh toán */}
                    {record.status === 'payment_pending' && (
                        <Tooltip title="Xác nhận đã nhận tiền -> Kích hoạt tài khoản">
                            <Button style={{borderColor: '#52c41a', color: '#52c41a'}} size="small" icon={<DollarCircleOutlined />}
                                onClick={() => handleUpdatePartnerStatus(record.id, 'active')}
                            >Xác nhận thu phí</Button>
                        </Tooltip>
                    )}

                    {/* Nút Hủy: Chỉ hiện khi Đã hoạt động */}
                    {record.status === 'active' && (
                        <Button danger type="text" size="small" 
                            onClick={() => handleUpdatePartnerStatus(record.id, 'rejected')}
                        >Khóa đối tác</Button>
                    )}
                </Space>
            )
        }
    ];

    return (
        <div style={{ background: '#fff', padding: 24, borderRadius: 8 }}>
            <h2>Quản lý Người dùng & Đối tác</h2>
            <Tabs defaultActiveKey="1">
                <TabPane tab={<span><UserOutlined />Khách hàng</span>} key="1">
                    <Table 
                        dataSource={users.filter(u => u.userType === 'CUSTOMER')} 
                        columns={customerColumns} 
                        rowKey="id"
                        loading={loading}
                    />
                </TabPane>
                <TabPane tab={<span><ShopOutlined />Đối tác Lữ hành</span>} key="2">
                    <Table 
                        dataSource={users.filter(u => u.userType === 'PARTNER')} 
                        columns={partnerColumns} 
                        rowKey="id"
                        loading={loading}
                    />
                </TabPane>
            </Tabs>
        </div>
    );
};

export default UserManagement;