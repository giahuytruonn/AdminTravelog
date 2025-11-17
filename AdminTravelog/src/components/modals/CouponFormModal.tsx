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
                validFrom: initialValues.validFrom ? dayjs(initialValues.validFrom.toDate()) : null,
                validUntil: initialValues.validUntil ? dayjs(initialValues.validUntil.toDate()) : null,
            });
        } else {
            form.resetFields();
        }
    }, [visible, initialValues, form]);

    const handleOk = () => {
        form.validateFields().then((values) => {
            // Convert dayjs back to Date or Timestamp if needed by service
            // Service expects standard JS Date or Firestore Timestamp?
            // The service uses addDoc which handles Date objects, but our type says Timestamp.
            // Let's pass Date objects and let the service/firebase handle conversion or we convert here.
            // For simplicity, let's pass the values and let the service handle it or assume service takes Date.
            // Actually, our type definition says Timestamp. 
            // But when creating, we usually pass Date objects and Firebase converts them.
            // Let's just pass the values as is, but we might need to convert dayjs to Date.
            const formattedValues = {
                ...values,
                validFrom: values.validFrom ? values.validFrom.toDate() : null,
                validUntil: values.validUntil ? values.validUntil.toDate() : null,
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
                initialValues={{ status: true, discountType: 'percentage' }}
            >
                <Form.Item
                    name="code"
                    label="Coupon Code"
                    rules={[{ required: true, message: 'Please enter coupon code' }]}
                >
                    <Input placeholder="e.g. SUMMER2024" />
                </Form.Item>

                <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                    <Form.Item
                        name="discountType"
                        label="Type"
                        rules={[{ required: true, message: 'Required' }]}
                    >
                        <Select style={{ width: 120 }}>
                            <Select.Option value="percentage">Percentage</Select.Option>
                            <Select.Option value="fixed">Fixed Amount</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="discountValue"
                        label="Value"
                        rules={[{ required: true, message: 'Required' }]}
                        style={{ flex: 1 }}
                    >
                        <InputNumber min={0} style={{ width: '100%' }} />
                    </Form.Item>
                </div>

                <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                    <Form.Item
                        name="minOrderValue"
                        label="Min Order Value"
                        rules={[{ required: true, message: 'Required' }]}
                        style={{ flex: 1 }}
                    >
                        <InputNumber
                            formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={value => value!.replace(/\$\s?|(,*)/g, '')}
                            style={{ width: '100%' }}
                        />
                    </Form.Item>
                    <Form.Item
                        name="maxDiscount"
                        label="Max Discount"
                        style={{ flex: 1 }}
                    >
                        <InputNumber
                            formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={value => value!.replace(/\$\s?|(,*)/g, '')}
                            style={{ width: '100%' }}
                        />
                    </Form.Item>
                </div>

                <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                    <Form.Item
                        name="validFrom"
                        label="Valid From"
                        rules={[{ required: true, message: 'Required' }]}
                        style={{ flex: 1 }}
                    >
                        <DatePicker showTime style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item
                        name="validUntil"
                        label="Valid Until"
                        rules={[{ required: true, message: 'Required' }]}
                        style={{ flex: 1 }}
                    >
                        <DatePicker showTime style={{ width: '100%' }} />
                    </Form.Item>
                </div>

                <Form.Item
                    name="usageLimit"
                    label="Usage Limit"
                    rules={[{ required: true, message: 'Required' }]}
                >
                    <InputNumber min={1} style={{ width: '100%' }} />
                </Form.Item>

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
