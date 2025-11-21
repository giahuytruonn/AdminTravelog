import React, { useState, useEffect } from 'react';
import { message, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import EntityTable from '../components/table/EntityTable';
import CouponFormModal from '../components/modals/CouponFormModal';
import { couponsService } from '../services/couponsService';
import type { Coupon } from '../types';
import dayjs from 'dayjs';

const CouponsPage: React.FC = () => {
    const [data, setData] = useState<Coupon[]>([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingItem, setEditingItem] = useState<Coupon | null>(null);
    const [searchText, setSearchText] = useState('');

    const fetchData = async () => {
        setLoading(true);
        try {
            const items = await couponsService.getAll();
            setData(items);
        } catch (error) {
            message.error('Failed to fetch coupons');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAdd = () => {
        setEditingItem(null);
        setModalVisible(true);
    };

    const handleEdit = (record: Coupon) => {
        setEditingItem(record);
        setModalVisible(true);
    };

    const handleDelete = async (id: string) => {
        try {
            await couponsService.softDelete(id);
            message.success('Coupon deleted successfully');
            fetchData();
        } catch (error) {
            message.error('Failed to delete coupon');
        }
    };

    const handleRestore = async (id: string) => {
        try {
            await couponsService.restore(id);
            message.success('Coupon restored successfully');
            fetchData();
        } catch (error) {
            message.error('Failed to restore coupon');
        }
    };

    const handleSubmit = async (values: any) => {
        setLoading(true);
        try {
            if (editingItem) {
                await couponsService.update(editingItem.id, values);
                message.success('Coupon updated successfully');
            } else {
                await couponsService.create(values);
                message.success('Coupon created successfully');
            }
            setModalVisible(false);
            fetchData();
        } catch (error) {
            message.error('Operation failed');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const filteredData = data.filter(item =>
        item.code.toLowerCase().includes(searchText.toLowerCase()) ||
        item.description.toLowerCase().includes(searchText.toLowerCase())
    );

    const columns: ColumnsType<Coupon> = [
        {
            title: 'Code',
            dataIndex: 'code',
            key: 'code',
            render: (text) => <Tag color="blue">{text}</Tag>
        },
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Discount',
            key: 'discount',
            render: (_, record) => (
                <span>
                    {record.type === 'percentage' ? `${record.cost}%` : record.cost.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                </span>
            )
        },
        {
            title: 'Min Order',
            dataIndex: 'minimumOrderValue',
            key: 'minimumOrderValue',
            render: (val) => val ? val.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) : '-',
        },
        {
            title: 'Valid Until',
            dataIndex: 'timeEnd',
            key: 'timeEnd',
            render: (val) => val ? dayjs(val.toDate()).format('DD MMM YYYY') : '-',
        },
        {
            title: 'Usage',
            key: 'usage',
            render: (_, record) => `${record.usedCount || 0} / ${record.usageLimit || '∞'}`,
        },
    ];

    return (
        <>
            <EntityTable
                data={filteredData}
                loading={loading}
                columns={columns}
                entityName="Coupon"
                onAdd={handleAdd}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onRestore={handleRestore}
                onSearch={setSearchText}
            />
            <CouponFormModal
                visible={modalVisible}
                onCancel={() => setModalVisible(false)}
                onSubmit={handleSubmit}
                initialValues={editingItem}
                loading={loading}
            />
        </>
    );
};

export default CouponsPage;
