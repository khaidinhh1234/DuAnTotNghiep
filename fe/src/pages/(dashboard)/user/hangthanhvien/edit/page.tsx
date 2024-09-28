import React, { useState, useEffect } from 'react';
import { Form, Input, InputNumber, Upload, Button, Typography, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { Link, useNavigate, useParams } from 'react-router-dom';
import instance from '@/configs/axios';
import { useMutation, useQuery } from "@tanstack/react-query";

const { Title } = Typography;

const MemberRankEdit = () => {
    const [form] = Form.useForm();
    const [imageUrl, setImageUrl] = useState('');
    const nav = useNavigate();
    const { id } = useParams();

    const { data: tagid, isLoading, isError } = useQuery({
        queryKey: ["tag"],
        queryFn: async () => {
            try {
                const response = await instance.post(`/admin/hangthanhvien/${id}`);
                return response.data;
            } catch (error) {
                console.error("Error fetching member rank:", error);
                throw new Error("Error fetching member rank");
            }
        },
    });

    useEffect(() => {
        if (tagid) {
            form.setFieldsValue({
                rankName: tagid.ten_hang_thanh_vien,
                minSpend: tagid.chi_tieu_toi_thieu,
                maxSpend: tagid.chi_tieu_toi_da,
            });
            setImageUrl(tagid.anh_hang_thanh_vien);
        }
    }, [tagid, form]);

    const { mutate } = useMutation({
        mutationFn: async (data) => {
            const response = await instance.put(`/admin/hangthanhvien/${id}`, data);
            return response.data;
        },
        onSuccess: () => {
            message.success("Cập nhật hạng thành viên thành công");
            nav("/admin/users/rank");
        },
        onError: (error) => {
            message.error(error.message);
        },
    });

    const onFinish = (values) => {
        const data = {
            ten_hang_thanh_vien: values.rankName,
            chi_tieu_toi_thieu: values.minSpend,
            chi_tieu_toi_da: values.maxSpend,
            anh_hang_thanh_vien: imageUrl,
        };
        mutate(data);
    };

    const validateUpload = (file) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('Chỉ chấp nhận file JPG/PNG!');
        }
        const isLt1MB = file.size / 1024 / 1024 < 1;
        if (!isLt1MB) {
            message.error('Dung lượng phải nhỏ hơn 1MB!');
        }
        return isJpgOrPng && isLt1MB;
    };

    const handleChange = (info) => {
        if (info.file.status === 'done') {
            getBase64(info.file.originFileObj, (url) => {
                setImageUrl(url);
            });
        }
    };

    const getBase64 = (img, callback) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    };

    const customRequest = ({ file, onSuccess }) => {
        setTimeout(() => {
            onSuccess("ok");
        }, 0);
    };

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error loading data</div>;

    return (
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
            <div className="flex items-center">
                <h1 className="md:text-base">
                    Quản trị / Danh mục /
                    <span className="font-semibold px-px"> Hạng thành viên</span>
                </h1>
            </div>

            <div className="flex items-center justify-between">
                <h1 className="font-semibold md:text-3xl">Chỉnh sửa hạng thành viên</h1>
                <div>
                    <Link to="/admin/users/rank" className="mr-1">
                        <Button className="ml-auto bg-black text-white rounded-lg py-1">
                            Quay lại
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="max-w-2xl ml-5 mt-6 p-6 bg-white shadow-md rounded-lg">
                <Title level={3} className="mb-4">Chỉnh sửa hạng thành viên</Title>
                <hr />
                <br />
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    className="space-y-4"
                >
                    <Form.Item
                        name="rankName"
                        label="Tên hạng thành viên"
                        rules={[{ required: true, message: 'Vui lòng nhập tên hạng thành viên' }]}
                    >
                        <Input placeholder="Diamond" />
                    </Form.Item>

                    <Form.Item
                        name="rankImage"
                        label="Hình cho hạng thành viên"
                        valuePropName="file"
                    >
                        <Upload
                            accept="image/png,image/jpeg"
                            listType="picture-card"
                            className="avatar-uploader"
                            showUploadList={false}
                            beforeUpload={validateUpload}
                            onChange={handleChange}
                            customRequest={customRequest}
                        >
                            {imageUrl ? (
                                <img src={imageUrl} alt="avatar" style={{ width: '100%' }} />
                            ) : (
                                <div>
                                    <UploadOutlined />
                                    <div style={{ marginTop: 8 }}>Tải lên</div>
                                </div>
                            )}
                        </Upload>
                    </Form.Item>
                    <p className="text-xs text-gray-500 mt-1">
                        Dung lượng &lt; 1MB. Kích thước 500x500 pixels. Định dạng: png, jpeg.
                    </p>

                    <div className="flex space-x-4">
                        <Form.Item
                            name="minSpend"
                            label="Chi tiêu tối thiểu (VND)"
                            rules={[{ required: true, message: 'Vui lòng nhập chi tiêu tối thiểu' }]}
                            className="flex-1"
                        >
                            <InputNumber
                                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                                addonAfter="VND"
                                className="w-full"
                            />
                        </Form.Item>

                        <Form.Item
                            name="maxSpend"
                            label="Chi tiêu tối đa (VND)"
                            rules={[{ required: true, message: 'Vui lòng nhập chi tiêu tối đa' }]}
                            className="flex-1"
                        >
                            <InputNumber
                                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                                addonAfter="VND"
                                className="w-full"
                            />
                        </Form.Item>
                    </div>
                    <div className="flex justify-start space-x-1 mt-6">
                        <Button type="primary" size="middle" htmlType="submit"
                            className="px-8 py-3 bg-black text-white rounded-lg"
                        >
                            Cập nhật
                        </Button>
                    </div>
                </Form>
            </div>
        </main>
    );
};

export default MemberRankEdit;
