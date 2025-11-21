import React, { useState, useEffect } from 'react';
import { message, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import EntityTable from '../components/table/EntityTable';
import DestinationFormModal from '../components/modals/DestinationFormModal';
import { destinationsService } from '../services/destinationsService';
import type { Destination } from '../types';

const DestinationsPage: React.FC = () => {
    const [data, setData] = useState<Destination[]>([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingItem, setEditingItem] = useState<Destination | null>(null);
    const [searchText, setSearchText] = useState('');

    const fetchData = async () => {
        setLoading(true);
        try {
            const items = await destinationsService.getAll();
            setData(items);
        } catch (error) {
            message.error('Failed to fetch destinations');
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

    const handleEdit = (record: Destination) => {
        setEditingItem(record);
        setModalVisible(true);
    };

    const handleDelete = async (id: string) => {
        try {
            await destinationsService.softDelete(id);
            message.success('Destination deleted successfully');
            fetchData();
        } catch (error) {
            message.error('Failed to delete destination');
        }
    };

    const handleRestore = async (id: string) => {
        try {
            await destinationsService.restore(id);
            message.success('Destination restored successfully');
            fetchData();
        } catch (error) {
            message.error('Failed to restore destination');
        }
    };

    const handleSubmit = async (values: any) => {
        setLoading(true);
        try {
            if (editingItem) {
                await destinationsService.update(editingItem.id, values);
                message.success('Destination updated successfully');
            } else {
                await destinationsService.create(values);
                message.success('Destination created successfully');
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
        item.name.toLowerCase().includes(searchText.toLowerCase()) ||
        item.country.toLowerCase().includes(searchText.toLowerCase())
    );

    const columns: ColumnsType<Destination> = [
        {
            title: 'Destination',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <img
                        src={record.coverImage}
                        alt={text}
                        style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4 }}
                        onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/50')}
                    />
                    <div>
                        <div style={{ fontWeight: 500 }}>{text}</div>
                        <div style={{ fontSize: 12, color: '#888' }}>{record.country}</div>
                    </div>
                </div>
            )
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            ellipsis: true,
        },
    ];

    return (
        <>
            <EntityTable
                data={filteredData}
                loading={loading}
                columns={columns}
                entityName="Destination"
                onAdd={handleAdd}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onRestore={handleRestore}
                onSearch={setSearchText}
            />
            <DestinationFormModal
                visible={modalVisible}
                onCancel={() => setModalVisible(false)}
                onSubmit={handleSubmit}
                initialValues={editingItem}
                loading={loading}
            />
        </>
    );
};

export default DestinationsPage;
