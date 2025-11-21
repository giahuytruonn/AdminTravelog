import React, { useEffect } from 'react';
import { Modal, Form, Input, Checkbox, Upload, Button, Image } from 'antd';
import { UploadOutlined, DeleteOutlined } from '@ant-design/icons';
import type { Destination } from '../../types';

interface DestinationFormModalProps {
    visible: boolean;
    onCancel: () => void;
    onSubmit: (values: any) => void;
    initialValues?: Destination | null;
    loading: boolean;
}

const DestinationFormModal: React.FC<DestinationFormModalProps> = ({
    visible,
    onCancel,
    onSubmit,
    initialValues,
    loading
}) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (visible && initialValues) {
            form.setFieldsValue(initialValues);
        } else {
            form.resetFields();
        }
    }, [visible, initialValues, form]);

    const handleOk = () => {
        form.validateFields().then((values) => {
            onSubmit(values);
        });
    };

    /** 🔥 Upload ảnh Cloudinary */
    const uploadToCloudinary = async (file: File) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "Travelog"); // preset của bạn

        const res = await fetch(
            `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
            {
                method: "POST",
                body: formData
            }
        );

        const data = await res.json();
        return data.secure_url;
    };

    return (
        <Modal
            title={initialValues ? "Edit Destination" : "Add Destination"}
            open={visible}
            onCancel={onCancel}
            onOk={handleOk}
            confirmLoading={loading}
        >
            <Form
                form={form}
                layout="vertical"
                initialValues={{ status: true, popular: false }}
            >
                <Form.Item
                    name="name"
                    label="Destination Name"
                    rules={[{ required: true, message: 'Please enter name' }]}
                >
                    <Input placeholder="e.g. Bali" />
                </Form.Item>

                <Form.Item
                    name="country"
                    label="Country"
                    rules={[{ required: true, message: 'Please enter country' }]}
                >
                    <Input placeholder="e.g. Indonesia" />
                </Form.Item>

                <Form.Item
                    name="description"
                    label="Description"
                    rules={[{ required: true, message: 'Please enter description' }]}
                >
                    <Input.TextArea rows={4} />
                </Form.Item>

                {/* 🔥 Upload ảnh */}
                <Form.Item
                    label="Destination Image"
                    required
                >
                    {/* Nếu có ảnh thì hiển thị */}
                    {form.getFieldValue("coverImage") ? (
                        <div style={{ marginBottom: 12 }}>
                            <Image
                                src={form.getFieldValue("coverImage")}
                                width={200}
                                style={{ borderRadius: 8 }}
                            />
                            <Button
                                danger
                                icon={<DeleteOutlined />}
                                style={{ marginTop: 8 }}
                                onClick={() => form.setFieldsValue({ coverImage: "" })}
                            >
                                Remove Image
                            </Button>
                        </div>
                    ) : null}

                    {/* Nút upload */}
                    <Upload
                        accept="image/*"
                        showUploadList={false}
                        customRequest={async ({ file, onSuccess }) => {
                            const url = await uploadToCloudinary(file as File);
                            if (url) {
                                form.setFieldsValue({ coverImage: url });
                                onSuccess && onSuccess("ok");
                            }
                        }}
                    >
                        <Button icon={<UploadOutlined />}>
                            Upload Image
                        </Button>
                    </Upload>
                </Form.Item>

                <Form.Item name="popular" valuePropName="checked">
                    <Checkbox>Mark as Popular Destination</Checkbox>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default DestinationFormModal;
