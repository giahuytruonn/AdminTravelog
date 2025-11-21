import React, { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Button,
  Space,
  Divider,
  Upload,
  Image,
  message,
} from "antd";
import {
  MinusCircleOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import type { Tour, Destination } from "../../types";
import { destinationsService } from "../../services/destinationsService";

interface TourFormModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  initialValues?: Tour | null;
  loading: boolean;
}

const CLOUD_NAME = "dpyshymwv";
const UPLOAD_PRESET = "Travelog";

const TourFormModal: React.FC<TourFormModalProps> = ({
  visible,
  onCancel,
  onSubmit,
  initialValues,
  loading,
}) => {
  const [form] = Form.useForm();
  const [destinations, setDestinations] = useState<Destination[]>([]);

  // Load destination list
  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const data = await destinationsService.getAll();
        setDestinations(data);
      } catch (error) {
        console.error("Failed to fetch destinations", error);
      }
    };
    if (visible) {
      fetchDestinations();
    }
  }, [visible]);

  // Reset form or load initial values
  useEffect(() => {
    if (visible && initialValues) {
      form.setFieldsValue(initialValues);
    } else {
      form.resetFields();
    }
  }, [visible, initialValues, form]);

  // Submit handler
  const handleOk = () => {
    form.validateFields().then((values) => {
      onSubmit(values);
    });
  };

  // CLOUDINARY UPLOAD FUNCTION
  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      if (data.secure_url) return data.secure_url;

      throw new Error("Upload failed");
    } catch (error) {
      console.error(error);
      message.error("Upload image failed!");
      return "";
    }
  };

  return (
    <Modal
      title={initialValues ? "Edit Tour" : "Add New Tour"}
      open={visible}
      onCancel={onCancel}
      onOk={handleOk}
      confirmLoading={loading}
      width={800}
      style={{ top: 20 }}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          status: true,
          averageRating: 5,
          reviewCount: 0,
          duration: { days: 1, nights: 0 },
          images: [""],
          itinerary: [{ day: 1, title: "", details: "" }],
        }}
      >
        {/* BASIC INFO */}
        <Form.Item
          name="title"
          label="Tour Title"
          rules={[{ required: true, message: "Please enter tour title" }]}
        >
          <Input placeholder="e.g. Tour Đà Lạt 4N3Đ" />
        </Form.Item>

        <div style={{ display: "flex", gap: 16 }}>
          <Form.Item
            name="price"
            label="Price"
            rules={[{ required: true, message: "Required" }]}
            style={{ flex: 1 }}
          >
            <InputNumber
              style={{ width: "100%" }}
              formatter={(value) =>
                `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
            />
          </Form.Item>
          <Form.Item
            name="departurePoint"
            label="Departure Point"
            rules={[{ required: true, message: "Required" }]}
            style={{ flex: 1 }}
          >
            <Input placeholder="e.g. TP. Hồ Chí Minh" />
          </Form.Item>
          <Form.Item
            name="transport"
            label="Transport"
            rules={[{ required: true, message: "Required" }]}
            style={{ flex: 1 }}
          >
            <Input placeholder="e.g. Xe khách" />
          </Form.Item>
        </div>

        <div style={{ display: "flex", gap: 16 }}>
          <Form.Item
            label="Duration (Days)"
            name={["duration", "days"]}
            style={{ flex: 1 }}
            rules={[{ required: true }]}
          >
            <InputNumber min={1} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            label="Duration (Nights)"
            name={["duration", "nights"]}
            style={{ flex: 1 }}
            rules={[{ required: true }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
        </div>

        <Form.Item
          name="destinationIDs"
          label="Destinations"
          rules={[
            {
              required: true,
              message: "Please select at least one destination",
            },
          ]}
        >
          <Select mode="multiple" placeholder="Select destinations">
            {destinations.map((dest) => (
              <Select.Option key={dest.id} value={dest.id}>
                {dest.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true }]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>

        {/* IMAGES */}
        <Divider orientation="left">Images</Divider>

        <Form.List name="images">
          {(fields, { add, remove }) => (
            <>
              {fields.map((field, index) => {
                const images = form.getFieldValue("images") || [];
                const imageUrl = images[index];

                return (
                  <div
                    key={field.key}
                    style={{
                      marginBottom: 20,
                      padding: 12,
                      border: "1px solid #eee",
                      borderRadius: 8,
                    }}
                  >
                    {/* Hiển thị ảnh */}
                    {imageUrl && (
                      <div
                        style={{
                          marginBottom: 10,
                          position: "relative",
                          width: 200,
                        }}
                      >
                        <Image
                          src={imageUrl}
                          width={200}
                          height={150}
                          style={{
                            borderRadius: 8,
                            objectFit: "cover",
                            border: "1px solid #ddd",
                          }}
                        />

                        {/* Chỉ xoá ảnh bằng nút X */}
                        <Button
                          danger
                          size="small"
                          style={{
                            position: "absolute",
                            top: 5,
                            right: 5,
                            borderRadius: "50%",
                          }}
                          onClick={() => remove(field.name)}
                        >
                          X
                        </Button>
                      </div>
                    )}

                    {/* Upload thay ảnh */}
                    <Upload
                      accept="image/*"
                      showUploadList={false}
                      customRequest={async ({ file, onSuccess }) => {
                        const url = await uploadToCloudinary(file as File);
                        if (url) {
                          const updatedImages = [...images];
                          updatedImages[index] = url;

                          form.setFieldsValue({ images: updatedImages });
                          onSuccess && onSuccess("ok");
                        }
                      }}
                    >
                      <Button icon={<UploadOutlined />}>
                        {imageUrl ? "Change Image" : "Upload Image"}
                      </Button>
                    </Upload>
                  </div>
                );
              })}

              {/* Thêm ảnh */}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  icon={<PlusOutlined />}
                >
                  Add New Image
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        {/* ITINERARY */}
        <Divider orientation="left">Itinerary</Divider>
        <Form.List name="itinerary">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Space
                  key={key}
                  style={{ display: "flex", marginBottom: 8 }}
                  align="baseline"
                >
                  <Form.Item
                    {...restField}
                    name={[name, "day"]}
                    rules={[{ required: true, message: "Missing day" }]}
                  >
                    <InputNumber placeholder="Day" min={1} />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, "title"]}
                    rules={[{ required: true, message: "Missing title" }]}
                  >
                    <Input placeholder="Title (e.g. HCM - Da Lat)" />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, "details"]}
                    rules={[{ required: true, message: "Missing details" }]}
                    style={{ width: 300 }}
                  >
                    <Input.TextArea placeholder="Details" autoSize />
                  </Form.Item>
                </Space>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                >
                  Add Itinerary Day
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </Form>
    </Modal>
  );
};

export default TourFormModal;
