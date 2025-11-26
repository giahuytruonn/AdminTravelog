import React, { useState, useEffect } from "react";
import { message } from "antd";
import type { ColumnsType } from "antd/es/table";
import EntityTable from "../components/table/EntityTable";
import DestinationFormModal from "../components/modals/DestinationFormModal";
import { destinationsService } from "../services/destinationsService";
import type { Destination } from "../types";
import PageContainer from "../components/layout/PageContainer";

type DestinationFormValues = Record<string, unknown>;

const DestinationsPage: React.FC = () => {
  const [data, setData] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<Destination | null>(null);
  const [searchText, setSearchText] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const items = await destinationsService.getAll();
      setData(items);
    } catch (error) {
      message.error("Failed to fetch destinations");
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

  const handleStatusChange = async (id: string, status: boolean) => {
    try {
      await destinationsService.setStatus(id, status);
      message.success(
        status ? "Destination activated" : "Destination set to inactive"
      );
      fetchData();
    } catch (error) {
      console.error(error);
      message.error("Failed to update destination status");
    }
  };

  const handleSubmit = async (values: DestinationFormValues) => {
    setLoading(true);
    try {
      if (editingItem) {
        await destinationsService.update(
          editingItem.id,
          values as Partial<Destination>
        );
        message.success("Destination updated successfully");
      } else {
        await destinationsService.create(
          values as Omit<
            Destination,
            "id" | "createdAt" | "updatedAt" | "status"
          >
        );
        message.success("Destination created successfully");
      }
      setModalVisible(false);
      fetchData();
    } catch (error) {
      message.error("Operation failed");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = data.filter(
    (item) =>
      item.name.toLowerCase().includes(searchText.toLowerCase()) ||
      item.country.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns: ColumnsType<Destination> = [
    {
      title: "Destination",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <img
            src={record.coverImage}
            alt={text}
            style={{
              width: 50,
              height: 50,
              objectFit: "cover",
              borderRadius: 4,
            }}
            onError={(e) =>
              (e.currentTarget.src = "https://via.placeholder.com/50")
            }
          />
          <div>
            <div style={{ fontWeight: 500 }}>{text}</div>
            <div style={{ fontSize: 12, color: "yellow" }}>
              {record.country}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },
  ];

  return (
    <PageContainer
      title="Quản lý Điểm đến"
      subtitle="Tối ưu danh sách điểm đến nổi bật và đảm bảo nội dung luôn được cập nhật tươi mới."
    >
      <EntityTable
        data={filteredData}
        loading={loading}
        columns={columns}
        entityName="Destination"
        onAdd={handleAdd}
        onEdit={handleEdit}
        onStatusChange={handleStatusChange}
        onSearch={setSearchText}
        onRefresh={fetchData}
        title="Danh sách điểm đến"
      />
      <DestinationFormModal
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onSubmit={handleSubmit}
        initialValues={editingItem}
        loading={loading}
      />
    </PageContainer>
  );
};

export default DestinationsPage;
