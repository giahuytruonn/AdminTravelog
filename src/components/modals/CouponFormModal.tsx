import React, { useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Select, DatePicker } from 'antd';
import type { Coupon } from '../../types';
import dayjs from 'dayjs';

interface CouponFormModalProps {
    visible: boolean;
    onCancel: () => void;
    onSubmit: (values: any) => void;
    initialValues?: Coupon | null;
    loading: boolean;
}

const CouponFormModal: React.FC<CouponFormModalProps> = ({
    visible,
    onCancel,
    onSubmit,
    initialValues,
    loading
}) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (visible && initialValues) {
            form.setFieldsValue({
                ...initialValues,
                timeStart: initialValues.timeStart ? dayjs(initialValues.timeStart.toDate()) : null,
                timeEnd: initialValues.timeEnd ? dayjs(initialValues.timeEnd.toDate()) : null,
            });
        } else {
            form.resetFields();
        }
    }, [visible, initialValues, form]);

    const handleOk = () => {
        form.validateFields().then((values) => {
            const formattedValues = {
                ...values,
                timeStart: values.timeStart ? values.timeStart.toDate() : null,
                timeEnd: values.timeEnd ? values.timeEnd.toDate() : null,
            };
            onSubmit(formattedValues);
        });
    };

    return (
        <Modal
            title={initialValues ? "Edit Coupon" : "Create Coupon"}
            open={visible}
            onCancel={onCancel}
            onOk={handleOk}
            confirmLoading={loading}
            width={600}
        >
            <Form
                form={form}
                layout="vertical"
                initialValues={{ status: true, type: 'percentage' }}
            >
                <Form.Item
                    name="title"
                    label="Title"
                    rules={[{ required: true, message: 'Please enter title' }]}
                >
                    <Input placeholder="e.g. Summer Sale" />
                </Form.Item>

                <Form.Item
                    name="code"
                    label="Coupon Code"
                    rules={[{ required: true, message: 'Please enter coupon code' }]}
                >
                    <Input placeholder="e.g. SUMMER2024" />
                </Form.Item>

                <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                    <Form.Item
                        name="type"
                        label="Type"
                        rules={[{ required: true, message: 'Required' }]}
                    >
                        <Select style={{ width: 120 }}>
                            <Select.Option value="percentage">Percentage</Select.Option>
                            <Select.Option value="fixed">Fixed Amount</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="cost"
                        label="Value"
                        rules={[{ required: true, message: 'Required' }]}
                        style={{ flex: 1 }}
                    >
                        <InputNumber min={0} style={{ width: '100%' }} />
                    </Form.Item>
                </div>

                <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                    <Form.Item
                        name="minimumOrderValue"
                        label="Min Order Value"
                        rules={[{ required: true, message: 'Required' }]}
                        style={{ flex: 1 }}
                    >
                        <InputNumber
                            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' ₫'}
                            parser={value => value!.replace(/\s?₫|(\.*)/g, '')}
                            style={{ width: '100%' }}
                        />
                    </Form.Item>
                    <Form.Item
                        name="maximumDiscount"
                        label="Max Discount"
                        style={{ flex: 1 }}
                    >
                        <InputNumber
                            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' ₫'}
                            parser={value => value!.replace(/\s?₫|(\.*)/g, '')}
                            style={{ width: '100%' }}
                            placeholder="Unlimited"
                        />
                    </Form.Item>
                </div>

                <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                    <Form.Item
                        name="timeStart"
                        label="Start Time"
                        rules={[{ required: true, message: 'Required' }]}
                        style={{ flex: 1 }}
                    >
                        <DatePicker showTime style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item
                        name="timeEnd"
                        label="End Time"
                        rules={[{ required: true, message: 'Required' }]}
                        style={{ flex: 1 }}
                    >
                        <DatePicker showTime style={{ width: '100%' }} />
                    </Form.Item>
                </div>

                <Form.Item
                    name="description"
                    label="Description"
                >
                    <Input.TextArea rows={3} />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default CouponFormModal;
