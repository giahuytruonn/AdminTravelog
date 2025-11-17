import { Table, Input, Button, Space, Tag, Popconfirm, Tooltip } from 'antd';
import {
    PlusOutlined,
    SearchOutlined,
    EditOutlined,
    DeleteOutlined,
    UndoOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { BaseEntity } from '../../types';

interface EntityTableProps<T extends BaseEntity> {
    data: T[];
    loading: boolean;
    columns: ColumnsType<T>;
    entityName: string;
    onAdd: () => void;
    onEdit: (record: T) => void;
    onDelete: (id: string) => void;
    onRestore: (id: string) => void;
    onSearch: (value: string) => void;
}

function EntityTable<T extends BaseEntity>({
    data,
    loading,
    columns,
    entityName,
    onAdd,
    onEdit,
    onDelete,
    onRestore,
    onSearch
}: EntityTableProps<T>) {

    const actionColumn: ColumnsType<T>[0] = {
        title: 'Actions',
        key: 'actions',
        width: 150,
        render: (_, record) => (
            <Space>
                <Tooltip title="Edit">
                    <Button
                        icon={<EditOutlined />}
                        size="small"
                        onClick={() => onEdit(record)}
                    />
                </Tooltip>
                {record.status ? (
                    <Popconfirm
                        title={`Delete ${entityName}?`}
                        description="This will soft-delete the record."
                        onConfirm={() => onDelete(record.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Tooltip title="Delete">
                            <Button
                                danger
                                icon={<DeleteOutlined />}
                                size="small"
                            />
                        </Tooltip>
                    </Popconfirm>
                ) : (
                    <Tooltip title="Restore">
                        <Button
                            type="primary"
                            ghost
                            icon={<UndoOutlined />}
                            size="small"
                            onClick={() => onRestore(record.id)}
                        />
                    </Tooltip>
                )}
            </Space>
        ),
    };

    const statusColumn: ColumnsType<T>[0] = {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        width: 100,
        render: (status: boolean) => (
            <Tag color={status ? 'success' : 'default'}>
                {status ? 'Active' : 'Inactive'}
            </Tag>
        ),
    };

    const tableColumns = [
        ...columns,
        statusColumn,
        actionColumn
    ];

    return (
        <div style={{ background: '#fff', padding: 24, borderRadius: 8 }}>
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
                <Input
                    placeholder={`Search ${entityName}...`}
                    prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
                    style={{ width: 300 }}
                    onChange={(e) => onSearch(e.target.value)}
                    allowClear
                />
                <Button type="primary" icon={<PlusOutlined />} onClick={onAdd}>
                    Add {entityName}
                </Button>
            </div>

            <Table
                rowKey="id"
                columns={tableColumns}
                dataSource={data}
                loading={loading}
                pagination={{ pageSize: 10 }}
            />
        </div>
    );
}

export default EntityTable;
