import { Table, Input, Button, Space, Tag, Popconfirm, Tooltip } from 'antd';
import {
    PlusOutlined,
    SearchOutlined,
    EditOutlined,
    DeleteOutlined,
    UndoOutlined,
    ReloadOutlined
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
    onRefresh?: () => void;
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
    onSearch,
    onRefresh,
    title // New prop
}: EntityTableProps<T> & { title?: string }) {

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
                        style={{ borderRadius: 6, border: 'none', background: '#f0f5ff', color: '#2f54eb' }}
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
                                style={{ borderRadius: 6, border: 'none', background: '#fff1f0', color: '#f5222d' }}
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
                            style={{ borderRadius: 6 }}
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
            <Tag
                color={status ? 'success' : 'default'}
                style={{ borderRadius: 10, padding: '0 10px', fontWeight: 500 }}
            >
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
        <div style={{
            background: 'rgba(255,255,255,0.9)',
            padding: 24,
            borderRadius: 24,
            boxShadow: '0 15px 40px rgba(15, 60, 140, 0.08)',
            backdropFilter: 'blur(6px)'
        }}>
            {title && (
                <div style={{ marginBottom: 20 }}>
                    <h2 style={{
                        margin: 0,
                        background: 'linear-gradient(135deg, #0061ff 0%, #60efff 100%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        display: 'inline-block',
                        color: 'transparent',
                        fontSize: 24
                    }}>
                        {title}
                    </h2>
                </div>
            )}
            <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Space size="middle">
                    <Input
                        placeholder={`Search ${entityName}...`}
                        prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
                        style={{
                            width: 300,
                            borderRadius: 10,
                            background: '#fafafa',
                            border: '1px solid #f0f0f0',
                            padding: '6px 11px'
                        }}
                        onChange={(e) => onSearch(e.target.value)}
                        allowClear
                    />
                    {onRefresh && (
                        <Tooltip title="Refresh">
                            <Button
                                icon={<ReloadOutlined />}
                                onClick={onRefresh}
                                style={{ borderRadius: 10, border: '1px solid #f0f0f0' }}
                            />
                        </Tooltip>
                    )}
                </Space>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={onAdd}
                    style={{
                        borderRadius: 10,
                        height: 40,
                        padding: '0 20px',
                        background: 'linear-gradient(135deg, #0061ff 0%, #60efff 100%)',
                        border: 'none',
                        boxShadow: '0 4px 10px rgba(0, 97, 255, 0.3)',
                        fontWeight: 600
                    }}
                >
                    Add {entityName}
                </Button>
            </div>

            <div className="gradient-table-shell">
                <Table
                    rowKey="id"
                    columns={tableColumns}
                    dataSource={data}
                    loading={loading}
                    pagination={{ pageSize: 10 }}
                    className="gradient-table"
                    rowClassName={() => 'gradient-table-row'}
                />
            </div>
        </div>
    );
}

export default EntityTable;
