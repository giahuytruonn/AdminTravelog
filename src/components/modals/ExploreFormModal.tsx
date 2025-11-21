import React, { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  Button,
  message,
  Upload,
} from "antd";
import { UploadOutlined, VideoCameraOutlined } from "@ant-design/icons";
import type { ExploreVideo, Tour } from "../../types";
import { toursService } from "../../services/toursService"; // Để lấy danh sách tour link vào

interface ExploreFormModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  initialValues?: ExploreVideo | null;
  loading: boolean;
}

const CLOUD_NAME = "dpyshymwv";
const UPLOAD_PRESET = "Travelog"; // Đảm bảo preset này trên Cloudinary cho phép upload video

const ExploreFormModal: React.FC<ExploreFormModalProps> = ({
  visible,
  onCancel,
  onSubmit,
  initialValues,
  loading,
}) => {
  const [form] = Form.useForm();
  const [tours, setTours] = useState<Tour[]>([]);
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [uploading, setUploading] = useState(false);

  // Load danh sách tour để chọn (nếu muốn link video với tour)
  useEffect(() => {
    const fetchTours = async () => {
      try {
        const data = await toursService.getAll();
        setTours(data);
      } catch (error) {
        console.error("Failed to fetch tours", error);
      }
    };
    if (visible) fetchTours();
  }, [visible]);

  // Reset form
  useEffect(() => {
    if (visible && initialValues) {
      form.setFieldsValue(initialValues);
      setVideoUrl(initialValues.videoLink);
    } else {
      form.resetFields();
      setVideoUrl("");
    }
  }, [visible, initialValues, form]);

  const handleOk = () => {
    form.validateFields().then((values) => {
      // Đảm bảo videoLink được gửi đi
      onSubmit({ ...values, videoLink: videoUrl });
    });
  };

  // CLOUDINARY VIDEO UPLOAD
  const uploadVideoToCloudinary = async (file: File) => {
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);
    formData.append("resource_type", "video"); // Quan trọng: báo cho Cloudinary đây là video

    try {
      // Lưu ý: endpoint đổi thành /video/upload
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/video/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await res.json();
      if (data.secure_url) {
        setVideoUrl(data.secure_url);
        form.setFieldValue("videoLink", data.secure_url);
        message.success("Video uploaded successfully!");
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      console.error(error);
      message.error("Failed to upload video.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Modal
      title={initialValues ? "Edit Explore Video" : "Add New Video"}
      open={visible}
      onCancel={onCancel}
      onOk={handleOk}
      confirmLoading={loading || uploading}
      width={700}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{ status: true, tourID: null }}
      >
        <Form.Item
          name="title"
          label="Title"
          rules={[{ required: true, message: "Please enter title" }]}
        >
          <Input placeholder="e.g. 5 Ưu Đãi HOT Nhất Mùa Lễ Hội" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: "Please enter description" }]}
        >
          <Input.TextArea rows={3} placeholder="Short description for the feed" />
        </Form.Item>

        <Form.Item
          name="tourID"
          label="Linked Tour (Optional)"
          help="Select a tour if this video promotes a specific one, or leave empty for general promo."
        >
          <Select
            allowClear
            placeholder="Select a tour"
            showSearch
            optionFilterProp="children"
          >
            {tours.map((tour) => (
              <Select.Option key={tour.id} value={tour.id}>
                {tour.title}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        {/* VIDEO UPLOAD SECTION */}
        <Form.Item
          label="Video File"
          required
          help="Supports MP4, MOV. Max size depends on Cloudinary plan."
        >
          <div style={{ marginBottom: 16 }}>
            <Upload
              accept="video/*"
              showUploadList={false}
              customRequest={({ file }) => uploadVideoToCloudinary(file as File)}
            >
              <Button icon={<UploadOutlined />} loading={uploading}>
                {uploading ? "Uploading..." : videoUrl ? "Change Video" : "Upload Video"}
              </Button>
            </Upload>
          </div>

          {videoUrl && (
            <div style={{ marginTop: 10, border: "1px solid #eee", padding: 8, borderRadius: 8 }}>
              <video
                src={videoUrl}
                style={{ width: "100%", maxHeight: 300, borderRadius: 4 }}
                controls
              />
              {/* Hidden input to store URL for form validation if needed */}
              <Form.Item name="videoLink" hidden>
                <Input />
              </Form.Item>
            </div>
          )}
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ExploreFormModal;