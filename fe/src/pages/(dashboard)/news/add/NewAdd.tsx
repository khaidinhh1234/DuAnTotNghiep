import React from 'react';
import { Form, Input, Select, Button, message } from 'antd';
import { Editor } from '@tinymce/tinymce-react';
import TextArea from 'antd/es/input/TextArea';
import { useMutation, useQuery } from '@tanstack/react-query';
import instance from '@/configs/axios';
import { INew } from '@/common/types/new';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;

const NewAdd = () => {
    const nav = useNavigate();
    const [form] = Form.useForm();

    const onValuesChange = (changedValues: any, allValues: any) => {
        console.log("Values changed:", changedValues, allValues);
    };

    const { data, error, isLoading } = useQuery({
        queryKey: ['danhmuctintuc', 'taikhoan'],
        queryFn: async () => {
            try {
                const [categoryResponse, userResponse] = await Promise.all([
                    instance.get(`/admin/danhmuctintuc`),
                    instance.get(`/admin/taikhoan`)
                ]);

                return {
                    categories: categoryResponse.data.data, // Lấy dữ liệu từ danh mục tin tức
                    users: userResponse.data.data // Lấy dữ liệu từ danh sách tài khoản
                };
            } catch (error) {
                console.error(error);
                return { categories: [], users: [] }; 
            }
        },
    });

    if (isLoading) {
        return <div>Đang tải...</div>;
    }

    if (error) {
        return <div>Có lỗi xảy ra khi tải dữ liệu</div>;
    }

    const { mutate } = useMutation({
        mutationFn: async (news: INew) => {
            const response = await instance.post(`/admin/tintuc`, news);
            return response.data;
        },
        onSuccess: () => {
            message.success("Thêm tin tức thành công");
            form.resetFields();
            nav('/admin/news');
        },
        onError: (error) => {
            message.error(error.message);
        },
    });

    const onFinish = (values: any) => {
        const categoryData: INew = {
            ...values,
            user_id: values.user_id // Ghi nhận user_id từ form
        };
        mutate(categoryData);
    };

    return (
        <Form
            form={form}
            name="product"
            layout="vertical"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 1000 }}
            className="mx-10 my-5"
            autoComplete="off"
            onValuesChange={onValuesChange}
            onFinish={onFinish}
        >
            <div className="grid grid-cols-2 gap-5">
                <Form.Item
                    label="Tiêu đề"
                    name="tieu_de"
                    rules={[{ required: true, message: "Tiêu đề bắt buộc phải nhập!" }]}
                >
                    <Input placeholder="Nhập tiêu đề tin tức" />
                </Form.Item>
                <Form.Item
                    label="Danh mục tin tức"
                    name="danh_muc_tin_tuc_id"
                    rules={[{ required: true, message: "Vui lòng chọn danh mục" }]}
                >
                    <Select placeholder="Vui lòng chọn danh mục" className="w-full">
                        {Array.isArray(data?.categories) && data.categories.length > 0 ? (
                            data.categories.map((newcategory: any) => (
                                <Option key={newcategory.id} value={newcategory.id}>
                                    {newcategory.ten_danh_muc_tin_tuc}
                                </Option>
                            ))
                        ) : (
                            <Option disabled>Không có danh mục nào</Option>
                        )}
                    </Select>
                </Form.Item>
            </div>

            <div className="grid grid-cols-1 gap-5">
                <Form.Item
                    label="Tài khoản"
                    name="user_id"
                    rules={[{ required: true, message: "Vui lòng chọn tài khoản" }]}
                >
                    <Select placeholder="Vui lòng chọn tài khoản" className="w-full">
                        {Array.isArray(data?.users) && data.users.length > 0 ? (
                            data.users.map((user: any) => (
                                <Option key={user.id} value={user.id}>
                                    {user.ten} {/* Hoặc thông tin bạn muốn hiển thị */}
                                </Option>
                            ))
                        ) : (
                            <Option disabled>Không có tài khoản nào</Option>
                        )}
                    </Select>
                </Form.Item>
            </div>

            <div className="grid grid-cols-1 gap-5">
                <Form.Item
                    label="Mô tả ngắn"
                    name="mo_ta_ngan"
                    rules={[{ required: true, message: "Mô tả ngắn bắt buộc phải nhập!" }]}
                >
                    <TextArea rows={5} placeholder="Nhập mô tả ngắn" />
                </Form.Item>
            </div>

            <div className="grid grid-cols-1 gap-5">
                <Form.Item
                    label="Nội dung"
                    name="noi_dung"
                    rules={[{ required: true, message: "Nội dung sản phẩm bắt buộc phải nhập!" }]}
                >
                    <Editor
                        apiKey="4co2z7i0ky0nmudlm5lsoetsvp6g3u4110d77s2cq143a9in"
                        init={{
                            plugins: [
                                "anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount",
                                "checklist mediaembed casechange export formatpainter pageembed a11ychecker tinymcespellchecker permanentpen powerpaste advtable advcode editimage advtemplate ai mentions tinycomments tableofcontents footnotes mergetags autocorrect typography inlinecss markdown",
                            ],
                            toolbar:
                                "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat",
                            tinycomments_mode: "embedded",
                            tinycomments_author: "Author name",
                            mergetags_list: [
                                { value: "First.Name", title: "First Name" },
                                { value: "Email", title: "Email" },
                            ],
                            setup: (editor) => {
                                editor.on('Change', () => {
                                    form.setFieldsValue({ noi_dung: editor.getContent() });
                                });
                            },
                        }}
                        initialValue="Chào mừng bạn đến với Glow clothing!"
                    />
                </Form.Item>
            </div>

            <Form.Item wrapperCol={{ span: 24 }} className="text-right">
                <Button type="primary" htmlType="submit">
                    Thêm mới
                </Button>
            </Form.Item>
        </Form>
    );
};

export default NewAdd;
