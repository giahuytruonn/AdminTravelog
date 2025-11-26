import React, { useState, useEffect } from "react";
import { message, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import EntityTable from "../components/table/EntityTable";
import CouponFormModal from "../components/modals/CouponFormModal";
import { couponsService } from "../services/couponsService";
import type { Coupon } from "../types";
import dayjs from "dayjs";
import PageContainer from "../components/layout/PageContainer";

type CouponFormValues = Record<string, unknown>;

const CouponsPage: React.FC = () => {
  const [data, setData] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<Coupon | null>(null);
  const [searchText, setSearchText] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const items = await couponsService.getAll();
      setData(items);
    } catch (error) {
      message.error("Failed to fetch coupons");
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

  const handleStatusChange = async (id: string, status: boolean) => {
    try {
      await couponsService.setStatus(id, status);
      message.success(status ? "Coupon activated" : "Coupon set to inactive");
      fetchData();
    } catch (error) {
      console.error(error);
      message.error("Failed to update coupon status");
    }
  };

  const handleSubmit = async (values: CouponFormValues) => {
    setLoading(true);
    try {
      if (editingItem) {
        await couponsService.update(editingItem.id, values as Partial<Coupon>);
        message.success("Coupon updated successfully");
      } else {
        await couponsService.create(
          values as Omit<Coupon, "id" | "createdAt" | "updatedAt" | "status">
        );
        message.success("Coupon created successfully");
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
      item.code.toLowerCase().includes(searchText.toLowerCase()) ||
      item.description.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns: ColumnsType<Coupon> = [
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
      render: (text) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Discount",
      key: "discount",
      render: (_, record) => (
        <span>
          {record.type === "percentage"
            ? `${record.cost}%`
            : record.cost.toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              })}
        </span>
      ),
    },
    {
      title: "Min Order",
      dataIndex: "minimumOrderValue",
      key: "minimumOrderValue",
      render: (val) =>
        val
          ? val.toLocaleString("vi-VN", { style: "currency", currency: "VND" })
          : "-",
    },
    {
      title: "Valid Until",
      dataIndex: "timeEnd",
      key: "timeEnd",
      render: (val) => (val ? dayjs(val.toDate()).format("DD MMM YYYY") : "-"),
    },
  ];

  return (
    <PageContainer
      title="Quản lý Mã giảm giá"
      subtitle="Thiết kế ưu đãi thông minh và đảm bảo các chiến dịch luôn ở trạng thái kiểm soát."
    >
      <EntityTable
        data={filteredData}
        loading={loading}
        columns={columns}
        entityName="Coupon"
        onAdd={handleAdd}
        onEdit={handleEdit}
        onStatusChange={handleStatusChange}
        onSearch={setSearchText}
        onRefresh={fetchData}
        title="Danh sách mã đang hoạt động"
      />
      <CouponFormModal
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onSubmit={handleSubmit}
        initialValues={editingItem}
        loading={loading}
      />
    </PageContainer>
  );
};

export default CouponsPage;
