import React from 'react';
import { Table, Tabs, Switch, Tag, Button, Space, Tooltip, App, Modal } from 'antd';
import { 
    CheckCircleOutlined, 
    CloseCircleOutlined, 
    DollarCircleOutlined, 
    UserOutlined, 
    ShopOutlined,
    ExclamationCircleOutlined
} from '@ant-design/icons';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase'; 
import { useFirestoreQuery } from '../hooks/useFirestoreQuery'; 
import type { User } from '../types';

// KHÔNG CẦN IMPORT EMAILJS NỮA
// KHÔNG CẦN IMPORT FETCH NỮA

const UserManagementContent: React.FC = () => {
    const { message: messageApi, modal } = App.useApp();
    const { data: users, loading, refetch } = useFirestoreQuery<User>('users', []);

    // ========================================================================
    // LOGIC MỚI: CHỈ CẦN UPDATE DB, BACKEND TỰ LO PHẦN CÒN LẠI
    // ========================================================================

    // 1. DUYỆT HỒ SƠ
    const handleApprovePartner = async (record: User) => {
        try {
            // Chỉ cần chuyển status sang 'payment_pending'
            // Firebase Function sẽ tự phát hiện -> Tạo Link PayOS -> Gửi Mail
            await updateDoc(doc(db, 'users', record.id), { 
                status: 'payment_pending' 
            });
            
            messageApi.success('Đã duyệt! Hệ thống đang tạo link thanh toán và gửi mail tự động.');
            refetch(); 
        } catch (error: any) {
            console.error(error);
            messageApi.error('Lỗi cập nhật: ' + error.message);
        }
    };

    // 2. TỪ CHỐI HỒ SƠ
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

    // 3. KÍCH HOẠT THỦ CÔNG (Nếu khách đưa tiền mặt)
    const handleManualActivate = async (record: User) => {
        try {
            await updateDoc(doc(db, 'users', record.id), { status: 'active' });
            messageApi.success("Đã kích hoạt và gửi mail chào mừng!");
            refetch();
        } catch (e) { messageApi.error("Lỗi khi kích hoạt"); }
    };

    // ... (Giữ nguyên phần Customer Handler và Columns như cũ) ...
    const handleToggleCustomer = async (id: string, currentStatus: boolean) => {
        try {
            await updateDoc(doc(db, 'users', id), { status: !currentStatus });
            messageApi.success(`Đã cập nhật trạng thái khách hàng`);
            refetch();
        } catch (error) { messageApi.error("Lỗi cập nhật"); }
    };

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
    ];

    const partnerColumns = [
        { title: 'Đại Lý', dataIndex: 'agencyName', key: 'agency', render: (t:string) => <b>{t}</b> },
        { title: 'Email', dataIndex: 'email', key: 'email' },
        { title: 'Quy trình', dataIndex: 'status', key: 'status', render: (s: string) => <Tag color={s==='active'?'green':s==='payment_pending'?'blue':'orange'}>{s}</Tag> },
        {
            title: 'Hành động', key: 'action',
            render: (_, record: User) => (
                <Space>
                    {record.status === 'pending_review' && (
                        <Tooltip title="Duyệt & Gửi Mail tự động">
                            <Button type="primary" size="small" icon={<CheckCircleOutlined />} 
                                onClick={() => handleApprovePartner(record)}>Duyệt</Button>
                        </Tooltip>
                    )}
                    {record.status === 'payment_pending' && (
                        <Tooltip title="Xác nhận tiền thủ công">
                            <Button size="small" style={{color:'#52c41a', borderColor:'#52c41a'}} icon={<DollarCircleOutlined />}
                                onClick={() => handleManualActivate(record)}>Xác nhận tiền</Button>
                        </Tooltip>
                    )}
                    {record.status !== 'rejected' && record.status !== 'active' && (
                        <Button danger size="small" icon={<CloseCircleOutlined />} onClick={() => handleRejectPartner(record)}>Từ chối</Button>
                    )}
                </Space>
            )
        }
    ];

    return (
        <div style={{ background: '#fff', padding: 24, borderRadius: 8 }}>
            <h2>Quản lý Người dùng</h2>
            <Tabs defaultActiveKey="2" items={[
                { key: '1', label: <span><UserOutlined />Khách hàng</span>, children: <Table dataSource={users.filter(u => u.userType === 'CUSTOMER')} columns={customerColumns} rowKey="id" loading={loading} /> },
                { key: '2', label: <span><ShopOutlined />Đối tác</span>, children: <Table dataSource={users.filter(u => u.userType === 'PARTNER')} columns={partnerColumns} rowKey="id" loading={loading} /> }
            ]} />
        </div>
    );
};

const UserManagement: React.FC = () => ( <App><UserManagementContent /></App> );
export default UserManagement;