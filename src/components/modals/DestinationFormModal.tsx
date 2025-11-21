import React, { useEffect } from 'react';
import { Modal, Form, Input, Checkbox } from 'antd';
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
                initialValues={{ status: true, popular: false, tourCount: 0 }}
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

                <Form.Item
                    name="imageUrl"
                    label="Image URL"
                    rules={[{ required: true, message: 'Please enter image URL' }]}
                >
                    <Input placeholder="https://..." />
                </Form.Item>

                <Form.Item name="popular" valuePropName="checked">
                    <Checkbox>Mark as Popular Destination</Checkbox>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default DestinationFormModal;
