import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, InputNumber, Select, Button, Space, Divider } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import type { Tour, Destination } from '../../types';
import { destinationsService } from '../../services/destinationsService';

interface TourFormModalProps {
    visible: boolean;
    onCancel: () => void;
    onSubmit: (values: any) => void;
    initialValues?: Tour | null;
    loading: boolean;
}

const TourFormModal: React.FC<TourFormModalProps> = ({
    visible,
    onCancel,
    onSubmit,
    initialValues,
    loading
}) => {
    const [form] = Form.useForm();
    const [destinations, setDestinations] = useState<Destination[]>([]);

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
                    images: [''],
                    itinerary: [{ day: 1, title: '', details: '' }]
                }}
            >
                <Form.Item
                    name="title"
                    label="Tour Title"
                    rules={[{ required: true, message: 'Please enter tour title' }]}
                >
                    <Input placeholder="e.g. Tour Đà Lạt 4N3Đ" />
                </Form.Item>

                <div style={{ display: 'flex', gap: 16 }}>
                    <Form.Item
                        name="price"
                        label="Price"
                        rules={[{ required: true, message: 'Required' }]}
                        style={{ flex: 1 }}
                    >
                        <InputNumber
                            style={{ width: '100%' }}
                            formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={value => value!.replace(/\$\s?|(,*)/g, '')}
                        />
                    </Form.Item>
                    <Form.Item
                        name="departurePoint"
                        label="Departure Point"
                        rules={[{ required: true, message: 'Required' }]}
                        style={{ flex: 1 }}
                    >
                        <Input placeholder="e.g. TP. Hồ Chí Minh" />
                    </Form.Item>
                    <Form.Item
                        name="transport"
                        label="Transport"
                        rules={[{ required: true, message: 'Required' }]}
                        style={{ flex: 1 }}
                    >
                        <Input placeholder="e.g. Xe khách" />
                    </Form.Item>
                </div>

                <div style={{ display: 'flex', gap: 16 }}>
                    <Form.Item label="Duration (Days)" name={['duration', 'days']} style={{ flex: 1 }} rules={[{ required: true }]}>
                        <InputNumber min={1} style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item label="Duration (Nights)" name={['duration', 'nights']} style={{ flex: 1 }} rules={[{ required: true }]}>
                        <InputNumber min={0} style={{ width: '100%' }} />
                    </Form.Item>
                </div>

                <Form.Item
                    name="destinationIDs"
                    label="Destinations"
                    rules={[{ required: true, message: 'Please select at least one destination' }]}
                >
                    <Select mode="multiple" placeholder="Select destinations">
                        {destinations.map(dest => (
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

                <Divider orientation="left">Images (URLs)</Divider>
                <Form.List name="images">
                    {(fields, { add, remove }) => (
                        <>
                            {fields.map((field) => (
                                <Form.Item
                                    required={false}
                                    key={field.key}
                                >
                                    <Form.Item
                                        {...field}
                                        validateTrigger={['onChange', 'onBlur']}
                                        rules={[
                                            {
                                                required: true,
                                                whitespace: true,
                                                message: "Please input image URL or delete this field.",
                                            },
                                        ]}
                                        noStyle
                                    >
                                        <Input placeholder="Image URL" style={{ width: '90%', marginRight: 8 }} />
                                    </Form.Item>
                                    {fields.length > 1 ? (
                                        <MinusCircleOutlined
                                            className="dynamic-delete-button"
                                            onClick={() => remove(field.name)}
                                        />
                                    ) : null}
                                </Form.Item>
                            ))}
                            <Form.Item>
                                <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
                                    Add Image URL
                                </Button>
                            </Form.Item>
                        </>
                    )}
                </Form.List>

                <Divider orientation="left">Itinerary</Divider>
                <Form.List name="itinerary">
                    {(fields, { add, remove }) => (
                        <>
                            {fields.map(({ key, name, ...restField }) => (
                                <Space key={key} style={{ display: 'flex', marginBottom: 8, alignItems: 'flex-start' }} align="baseline">
                                    <Form.Item
                                        {...restField}
                                        name={[name, 'day']}
                                        rules={[{ required: true, message: 'Missing day' }]}
                                    >
                                        <InputNumber placeholder="Day" min={1} />
                                    </Form.Item>
                                    <Form.Item
                                        {...restField}
                                        name={[name, 'title']}
                                        rules={[{ required: true, message: 'Missing title' }]}
                                    >
                                        <Input placeholder="Title (e.g. HCM - Da Lat)" />
                                    </Form.Item>
                                    <Form.Item
                                        {...restField}
                                        name={[name, 'details']}
                                        rules={[{ required: true, message: 'Missing details' }]}
                                        style={{ width: 300 }}
                                    >
                                        <Input.TextArea placeholder="Details" autoSize />
                                    </Form.Item>
                                    <MinusCircleOutlined onClick={() => remove(name)} />
                                </Space>
                            ))}
                            <Form.Item>
                                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
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
