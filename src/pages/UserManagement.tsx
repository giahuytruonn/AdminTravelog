import React, { useState } from 'react';
import { Table, Tabs, Switch, Tag, Button, Space, Tooltip, App, Modal, Descriptions } from 'antd';
import {
    CheckCircleOutlined,
    CloseCircleOutlined,
    DollarCircleOutlined,
    UserOutlined,
    ShopOutlined,
    ExclamationCircleOutlined,
    EyeOutlined,
    ReloadOutlined
} from '@ant-design/icons';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { useFirestoreQuery } from '../hooks/useFirestoreQuery';
import type { User } from '../types';
import PageContainer from '../components/layout/PageContainer';

const UserManagementContent: React.FC = () => {
    const { message: messageApi, modal } = App.useApp();
    const { data: users, loading, refetch } = useFirestoreQuery<User>('users', []);

    // --- STATE CHO MODAL CHI TIẾT ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    // --- HÀM MỞ MODAL ---
    const showUserDetail = (user: User) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    // ========================================================================
    // LOGIC XỬ LÝ
    // ========================================================================

    const handleApprovePartner = async (record: User) => {
        try {
            await updateDoc(doc(db, 'users', record.id), { status: 'payment_pending' });
            messageApi.success('Đã duyệt! Hệ thống đang tạo link thanh toán và gửi mail tự động.');
            refetch();
        } catch (error: any) {
            console.error(error);
            messageApi.error('Lỗi cập nhật: ' + error.message);
        }
    };

    const handleRejectPartner = (record: User) => {
        modal.confirm({
            title: 'Từ chối đối tác này?',
            icon: <ExclamationCircleOutlined />,
            okType: 'danger',
            content: 'Email thông báo từ chối sẽ được gửi tự động.',
            onOk: async () => {
                try {
                    await updateDoc(doc(db, 'users', record.id), { status: 'rejected' });
                    messageApi.info("Đã từ chối.");
                    refetch();
                } catch (e) { messageApi.error("Lỗi cập nhật DB"); }
            }
        });
    };

    const handleManualActivate = async (record: User) => {
        try {
            await updateDoc(doc(db, 'users', record.id), { status: 'active' });
            messageApi.success("Đã kích hoạt và gửi mail chào mừng!");
            refetch();
        } catch (e) { messageApi.error("Lỗi khi kích hoạt"); }
    };

    const handleToggleCustomer = async (id: string, currentStatus: boolean) => {
        try {
            await updateDoc(doc(db, 'users', id), { status: !currentStatus });
            messageApi.success(`Đã cập nhật trạng thái khách hàng`);
            refetch();
        } catch (error) { messageApi.error("Lỗi cập nhật"); }
    };

    // ========================================================================
    // CẤU HÌNH CỘT BẢNG
    // ========================================================================

    const customerColumns = [
        { title: 'Tên khách hàng', dataIndex: 'displayName', key: 'name' },
        { title: 'Email', dataIndex: 'email', key: 'email' },
        { title: 'Phone', dataIndex: 'phoneNumber', key: 'phone' },
        {
            title: 'Trạng thái', dataIndex: 'status', key: 'status',
            render: (status: boolean, record: User) => (
                <Switch checked={status === true} onChange={() => handleToggleCustomer(record.id, status as boolean)} />
            )
        },
        {
            title: 'Hành động', key: 'action',
            render: (_: any, record: User) => (
                <Button icon={<EyeOutlined />} size="small" onClick={() => showUserDetail(record)}>Chi tiết</Button>
            )
        }
    ];

    const glassButtonBase: React.CSSProperties = {
        borderRadius: 999,
        height: 36,
        paddingInline: 14,
        display: 'flex',
        alignItems: 'center',
        background: 'rgba(255,255,255,0.14)',
        border: '1px solid rgba(255,255,255,0.35)',
        color: '#fff',
        boxShadow: '0 8px 18px rgba(8, 49, 122, 0.25)'
    } as const;

    const partnerColumns = [
        { title: 'Đại Lý', dataIndex: 'agencyName', key: 'agency', render: (t: string) => <b>{t}</b> },
        { title: 'Người đại diện', dataIndex: 'displayName', key: 'name' },
        { title: 'Email', dataIndex: 'email', key: 'email' },
        { title: 'Quy trình', dataIndex: 'status', key: 'status', render: (s: string) => <Tag color={s === 'active' ? 'green' : s === 'payment_pending' ? 'blue' : 'orange'}>{s}</Tag> },
        {
            title: 'Hành động', key: 'action',
            render: (_: any, record: User) => (
                <Space>
                    <Tooltip title="Xem toàn bộ hồ sơ">
                        <Button
                            icon={<EyeOutlined />}
                            onClick={() => showUserDetail(record)}
                            style={{ ...glassButtonBase }}
                            type="text"
                        />
                    </Tooltip>

                    {record.status === 'pending_review' && (
                        <Tooltip title="Duyệt & Gửi Mail tự động">
                            <Button
                                icon={<CheckCircleOutlined />}
                                style={{
                                    ...glassButtonBase,
                                    background: 'linear-gradient(135deg, #1dd1ff 0%, #0f6dea 100%)',
                                    border: 'none'
                                }}
                                onClick={() => handleApprovePartner(record)}
                            >
                                Duyệt
                            </Button>
                        </Tooltip>
                    )}
                    {record.status === 'payment_pending' && (
                        <Tooltip title="Xác nhận tiền thủ công">
                            <Button
                                icon={<DollarCircleOutlined />}
                                style={{
                                    ...glassButtonBase,
                                    color: '#13e57d',
                                    borderColor: 'rgba(19, 229, 125, 0.5)'
                                }}
                                onClick={() => handleManualActivate(record)}
                            >
                                Thu tiền
                            </Button>
                        </Tooltip>
                    )}
                    {record.status !== 'rejected' && record.status !== 'active' && (
                        <Button
                            icon={<CloseCircleOutlined />}
                            onClick={() => handleRejectPartner(record)}
                            style={{
                                ...glassButtonBase,
                                background: 'rgba(255, 89, 94, 0.15)',
                                borderColor: 'rgba(255, 89, 94, 0.45)',
                                color: '#ff5a5f'
                            }}
                            type="text"
                        />
                    )}
                </Space>
            )
        }
    ];

    // Hàm format ngày tháng từ Firebase Timestamp
    const formatDate = (timestamp: any) => {
        if (!timestamp) return 'N/A';
        if (timestamp.toDate) return timestamp.toDate().toLocaleString('vi-VN');
        return new Date(timestamp).toLocaleString('vi-VN');
    };

    return (
        <PageContainer
            title="Quản lý Người dùng"
            subtitle="Bao quát hành trình xét duyệt đối tác và chăm sóc khách hàng chỉ trong một bảng điều khiển."
            actions={
                <Tooltip title="Làm mới">
                    <Button
                        icon={<ReloadOutlined />}
                        onClick={refetch}
                        style={{ borderRadius: 12, border: '1px solid rgba(255,255,255,0.4)' }}
                    />
                </Tooltip>
            }
        >
            <Tabs
                defaultActiveKey="2"
                items={[
                    {
                        key: '1',
                        label: <span><UserOutlined />Khách hàng</span>,
                        children: (
                            <div className="gradient-table-shell" style={{ marginTop: 0 }}>
                                <Table
                                    dataSource={users.filter(u => u.userType === 'CUSTOMER')}
                                    columns={customerColumns}
                                    rowKey="id"
                                    loading={loading}
                                    className="gradient-table"
                                    rowClassName={() => 'gradient-table-row'}
                                />
                            </div>
                        )
                    },
                    {
                        key: '2',
                        label: <span><ShopOutlined />Đối tác</span>,
                        children: (
                            <div className="gradient-table-shell" style={{ marginTop: 0 }}>
                                <Table
                                    dataSource={users.filter(u => u.userType === 'PARTNER')}
                                    columns={partnerColumns}
                                    rowKey="id"
                                    loading={loading}
                                    className="gradient-table"
                                    rowClassName={() => 'gradient-table-row'}
                                />
                            </div>
                        )
                    }
                ]}
            />

            <Modal
                title="Thông tin chi tiết"
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={[
                    <Button key="close" onClick={() => setIsModalOpen(false)}>Đóng</Button>
                ]}
                width={700}
            >
                {selectedUser && (
                    <Descriptions bordered column={1} size="small">
                        <Descriptions.Item label="UID" labelStyle={{ width: '150px' }}>{selectedUser.id}</Descriptions.Item>
                        <Descriptions.Item label="Ngày đăng ký">{formatDate(selectedUser.createdAt)}</Descriptions.Item>
                        <Descriptions.Item label="Email">{selectedUser.email}</Descriptions.Item>
                        <Descriptions.Item label="Số điện thoại">{selectedUser.phoneNumber}</Descriptions.Item>
                        <Descriptions.Item label="Họ tên đại diện">{selectedUser.displayName}</Descriptions.Item>

                        {selectedUser.userType === 'PARTNER' && (
                            <>
                                <Descriptions.Item label="Tên Đại Lý (Agency)" labelStyle={{ fontWeight: 'bold', color: '#1890ff' }}>
                                    {selectedUser.agencyName}
                                </Descriptions.Item>
                                <Descriptions.Item label="Lý do hợp tác">
                                    <div style={{ whiteSpace: 'pre-wrap' }}>{selectedUser.reason}</div>
                                </Descriptions.Item>
                                <Descriptions.Item label="Trạng thái hồ sơ">
                                    <Tag color={selectedUser.status === 'active' ? 'green' : 'orange'}>
                                        {String(selectedUser.status).toUpperCase()}
                                    </Tag>
                                </Descriptions.Item>
                                {selectedUser.payosOrderCode && (
                                    <Descriptions.Item label="Mã đơn thanh toán (PayOS)">
                                        {selectedUser.payosOrderCode}
                                    </Descriptions.Item>
                                )}
                            </>
                        )}
                    </Descriptions>
                )}
            </Modal>
        </PageContainer>
    );
};

const UserManagement: React.FC = () => (<App><UserManagementContent /></App>);
export default UserManagement;