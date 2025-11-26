import React, { useState, useEffect } from "react";
import { message, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { PlayCircleOutlined } from "@ant-design/icons";
import EntityTable from "../components/table/EntityTable";
import ExploreFormModal from "../components/modals/ExploreFormModal";
import { exploreService } from "../services/exploreService";
import type { ExploreVideo } from "../types";
import PageContainer from "../components/layout/PageContainer";

type ExploreFormValues = Record<string, unknown>;

const ExplorePage: React.FC = () => {
  const [data, setData] = useState<ExploreVideo[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<ExploreVideo | null>(null);
  const [searchText, setSearchText] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const items = await exploreService.getAll();
      setData(items);
    } catch (error) {
      message.error("Failed to fetch videos");
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

  const handleEdit = (record: ExploreVideo) => {
    setEditingItem(record);
    setModalVisible(true);
  };

  const handleStatusChange = async (id: string, status: boolean) => {
    try {
      await exploreService.setStatus(id, status);
      message.success(status ? "Video activated" : "Video set to inactive");
      fetchData();
    } catch (error) {
      console.error(error);
      message.error("Failed to update video status");
    }
  };

  const handleSubmit = async (values: ExploreFormValues) => {
    setLoading(true);
    try {
      if (editingItem) {
        await exploreService.update(
          editingItem.id,
          values as Partial<ExploreVideo>
        );
        message.success("Video updated successfully");
      } else {
        await exploreService.create(
          values as Omit<
            ExploreVideo,
            "id" | "createdAt" | "updatedAt" | "status" | "likes"
          >
        );
        message.success("Video created successfully");
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
      item.description.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns: ColumnsType<ExploreVideo> = [
    {
      title: "Video Preview",
      dataIndex: "videoLink",
      key: "videoLink",
      width: 150,
      render: (link) => (
        <div
          style={{
            position: "relative",
            width: 120,
            height: 70,
            background: "#000",
            borderRadius: 4,
            overflow: "hidden",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <video
            src={link}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            // Mute để không phát tiếng ồn khi lướt admin, hover để play nếu muốn hoặc dùng controls
            muted
          />
          <PlayCircleOutlined
            style={{
              position: "absolute",
              fontSize: 24,
              color: "rgba(255,255,255,0.8)",
            }}
          />
        </div>
      ),
    },
    {
      title: "Title & Desc",
      dataIndex: "title",
      key: "info",
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 600, fontSize: 15 }}>{record.title}</div>
          <div
            style={{
              fontSize: 12,
              color: "yellow",
              maxWidth: 300,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {record.description}
          </div>
        </div>
      ),
    },
    {
      title: "Linked Tour",
      dataIndex: "tourID",
      key: "tourID",
      width: 120,
      render: (tourID) =>
        tourID ? (
          <Tag color="blue">Linked</Tag>
        ) : (
          <Tag color="orange">General Promo</Tag>
        ),
    },
    {
      title: "Likes",
      dataIndex: "likes",
      key: "likes",
      width: 100,
      render: (val) => (val ? val.toLocaleString() : 0),
    },
    // Cột Created At nếu cần thiết
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 120,
      render: (date) =>
        date?.seconds
          ? new Date(date.seconds * 1000).toLocaleDateString("vi-VN")
          : "-",
    },
  ];

  return (
    <PageContainer
      title="Quản lý Khám phá"
      subtitle="Nuôi dưỡng nội dung video truyền cảm hứng và gắn kết với các tour phù hợp."
    >
      <EntityTable
        data={filteredData}
        loading={loading}
        columns={columns}
        entityName="Explore Video"
        onAdd={handleAdd}
        onEdit={handleEdit}
        onStatusChange={handleStatusChange}
        onSearch={setSearchText}
        onRefresh={fetchData}
        title="Thư viện video cảm hứng"
      />
      <ExploreFormModal
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onSubmit={handleSubmit}
        initialValues={editingItem}
        loading={loading}
      />
    </PageContainer>
  );
};

export default ExplorePage;
