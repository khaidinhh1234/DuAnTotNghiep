import React, { useEffect } from 'react';
import { Form, Input, Select, Button, message } from 'antd';
import { Editor } from '@tinymce/tinymce-react';
import TextArea from 'antd/es/input/TextArea';
import { useMutation, useQuery } from '@tanstack/react-query';
import instance from '@/configs/axios';
import { INew } from '@/common/types/new';
import { useNavigate, useParams } from 'react-router-dom';

const { Option } = Select;

const NewEdit = () => {
    const nav = useNavigate();
    const [form] = Form.useForm();
    const { id } = useParams();
    
    const { data: categoriesAndUsers, error: fetchError, isLoading: isFetching } = useQuery({
        queryKey: ['danhmuctintuc', 'taikhoan'],
        queryFn: async () => {
            try {
                const [categoryResponse, userResponse] = await Promise.all([
                    instance.get(`/admin/danhmuctintuc`),
                    instance.get(`/admin/taikhoan`)
                ]);
                return {
                    categories: categoryResponse.data.data,
                    users: userResponse.data.data
                };
            } catch (error) {
                console.error(error);
                throw new Error("Không thể tải dữ liệu danh mục và tài khoản.");
            }
        },
    });

    const { data: newsData, error: newsError, isLoading: isLoadingNews } = useQuery({
        queryKey: ['tintuc', id],
        queryFn: async () => {
            try {
                const response = await instance.get(`/admin/tintuc/${id}`);
                return response.data;
            } catch (error) {
                throw new Error("Lấy tin tức thất bại");
            }
        },
    });

    const { mutate } = useMutation({
        mutationFn: async (news: INew) => {
            return   await instance.put(`/admin/tintuc/${id}`, news)
        },
        onSuccess: () => {
            message.success("Thao tác thành công");
            form.resetFields();
            nav('/admin/news');
        },
        onError: (error) => {
            message.error(error.message);
        },
    });

    const onFinish = (values: any) => {
        const newsData: INew = {
            ...values,
            user_id: values.user_id // Ghi nhận user_id từ form
        };
        mutate(newsData);
    };


    if (isFetching || isLoadingNews) {
        return <div>Đang tải...</div>;
    }

    if (fetchError || newsError) {
        return <div>Có lỗi xảy ra khi tải dữ liệu: {fetchError?.message || newsError?.message}</div>;
    }
console.log(newsData)
    return (
        <Form
            form={form}
            name="news"
            layout="vertical"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 1000 }}
            initialValues={{ ...newsData?.data }}
            className="mx-10 my-5"
            autoComplete="off"
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
                        {Array.isArray(categoriesAndUsers?.categories) && categoriesAndUsers.categories.length > 0 ? (
                            categoriesAndUsers.categories.map((category: any) => (
                                <Option key={category.id} value={category.id}>
                                    {category.ten_danh_muc_tin_tuc}
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
                        {Array.isArray(categoriesAndUsers?.users) && categoriesAndUsers.users.length > 0 ? (
                            categoriesAndUsers.users.map((user: any) => (
                                <Option key={user.id} value={user.id}>
                                    {user.ten}
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
                    label="Nội dung"
                    name="noi_dung"
                    rules={[{ required: true, message: "Nội dung bắt buộc phải nhập!" }]}
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
                        initialValue={newsData ? newsData.noi_dung : "Chào mừng bạn đến với Glow clothing!"}
                    />
                </Form.Item>
            </div>

            <Form.Item wrapperCol={{ span: 24 }} className="text-right">
                <Button type="primary" htmlType="submit">
                    {id ? "Cập nhật" : "Thêm mới"}
                </Button>
            </Form.Item>
        </Form>
    );
};

export default NewEdit;
