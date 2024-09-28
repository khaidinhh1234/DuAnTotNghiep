import React, { useState } from 'react';
import { Form, Input, InputNumber, Upload, Button, Typography, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import instance from "@/configs/axios";

const { Title } = Typography;

const MemberRank = () => {
    const [form] = Form.useForm();
    const [imageUrl, setImageUrl] = useState('');
    const { id } = useParams(); // Get the id from the URL if editing
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    // Fetch existing data if editing
    const { data: existingRank, isLoading } = useQuery({
        queryKey: ['memberRank', id],
        queryFn: async () => {
            if (id) {
                const response = await instance.get(`/admin/hangthanhvien/${id}`);
                return response.data;
            }
            return null;
        },
        enabled: !!id,
    });

    // Update form fields when existing data is loaded
    React.useEffect(() => {
        if (existingRank) {
            form.setFieldsValue({
                rankName: existingRank.ten_hang_thanh_vien,
                minSpend: existingRank.chi_tieu_toi_thieu,
                maxSpend: existingRank.chi_tieu_toi_da,
            });
            setImageUrl(existingRank.hinh_anh);
        }
    }, [existingRank, form]);

    const mutation = useMutation({
        mutationFn: (values) => {
            const formData = new FormData();
            formData.append('ten_hang_thanh_vien', values.rankName);
            formData.append('chi_tieu_toi_thieu', values.minSpend);
            formData.append('chi_tieu_toi_da', values.maxSpend);
            if (values.rankImage) {
                formData.append('hinh_anh', values.rankImage);
            }

            if (id) {
                return instance.put(`/admin/hangthanhvien/${id}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
            } else {
                return instance.post('/admin/hangthanhvien', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['memberRanks']);
            message.success(id ? 'Cập nhật thành công!' : 'Tạo mới thành công!');
            navigate('/admin/users/rank');
        },
        onError: (error) => {
            message.error('Có lỗi xảy ra: ' + error.message);
        },
    });

    const onFinish = (values) => {
        mutation.mutate(values);
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

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
            <div className="flex items-center">
                <h1 className="md:text-base">
                    Quản trị / Danh mục /
                    <span className="font-semibold px-px"> Hạng thành viên</span>
                </h1>
            </div>

            <div className="flex items-center justify-between">
                <h1 className="font-semibold md:text-3xl">
                    {id ? 'Chỉnh sửa hạng thành viên' : 'Thêm hạng thành viên'}
                </h1>
                <div>
                    <Link to="/admin/users/rank" className="mr-1">
                        <Button className="ml-auto bg-black text-white rounded-lg py-1">
                            Quay lại
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="max-w-2xl ml-5 mt-6 p-6 bg-white shadow-md rounded-lg">
                <Title level={3} className="mb-4">
                    {id ? 'Chỉnh sửa hạng thành viên' : 'Tạo hạng thành viên mới'}
                </Title>
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
                        <Button 
                            type="primary" 
                            size="middle" 
                            htmlType="submit"
                            className="px-8 py-3 bg-black text-white rounded-lg"
                            loading={mutation.isLoading}
                        >
                            {id ? 'Cập nhật' : 'Tạo mới'}
                        </Button>
                    </div>
                </Form>
            </div>
        </main>
    );
};

export default MemberRank;
