import React, { useState, useEffect } from "react";
import { message } from "antd";
import type { ColumnsType } from "antd/es/table";
import EntityTable from "../components/table/EntityTable";
import TourFormModal from "../components/modals/TourFormModal";
import { toursService } from "../services/toursService";
import type { Tour } from "../types";
import PageContainer from "../components/layout/PageContainer";

type TourFormValues = Record<string, unknown>;

const ToursPage: React.FC = () => {
  const [data, setData] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<Tour | null>(null);
  const [searchText, setSearchText] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const items = await toursService.getAll();
      setData(items);
    } catch (error) {
      message.error("Failed to fetch tours");
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

  const handleEdit = (record: Tour) => {
    setEditingItem(record);
    setModalVisible(true);
  };

  const handleStatusChange = async (id: string, status: boolean) => {
    try {
      await toursService.setStatus(id, status);
      message.success(status ? "Tour activated" : "Tour set to inactive");
      fetchData();
    } catch (error) {
      console.error(error);
      message.error("Failed to update tour status");
    }
  };

  const handleSubmit = async (values: TourFormValues) => {
    setLoading(true);
    try {
      if (editingItem) {
        await toursService.update(editingItem.id, values as Partial<Tour>);
        message.success("Tour updated successfully");
      } else {
        await toursService.create(
          values as Omit<Tour, "id" | "createdAt" | "updatedAt" | "status">
        );
        message.success("Tour created successfully");
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
      item.title.toLowerCase().includes(searchText.toLowerCase()) ||
      item.departurePoint.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns: ColumnsType<Tour> = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text, record) => (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <img
            src={record.images?.[0]}
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
              {record.departurePoint}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (val) =>
        val.toLocaleString("vi-VN", { style: "currency", currency: "VND" }),
      width: 120,
    },
    {
      title: "Duration",
      key: "duration",
      render: (_, record) =>
        `${record.duration?.days}D ${record.duration?.nights}N`,
      width: 100,
    },
    {
      title: "Transport",
      dataIndex: "transport",
      key: "transport",
      width: 120,
    },
    {
      title: "Rating",
      dataIndex: "averageRating",
      key: "averageRating",
      width: 80,
      render: (val) => (val ? val.toFixed(1) : "-"),
    },
  ];

  return (
    <PageContainer
      title="Quản lý Tour"
      subtitle="Kiểm soát chất lượng hành trình, giá bán và trải nghiệm khách hàng trong cùng một bề mặt."
    >
      <EntityTable
        data={filteredData}
        loading={loading}
        columns={columns}
        entityName="Tour"
        onAdd={handleAdd}
        onEdit={handleEdit}
        onStatusChange={handleStatusChange}
        onSearch={setSearchText}
        onRefresh={fetchData}
        title="Danh sách tour đang hiển thị"
      />
      <TourFormModal
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onSubmit={handleSubmit}
        initialValues={editingItem}
        loading={loading}
      />
    </PageContainer>
  );
};

export default ToursPage;
