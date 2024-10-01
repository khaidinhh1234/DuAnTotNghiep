import React, { useEffect } from 'react';
import { Form, Input, Select, Button, message } from 'antd';
import { Editor } from '@tinymce/tinymce-react';
import { useMutation, useQuery } from '@tanstack/react-query';
import instance from '@/configs/axios';
import { INew } from '@/common/types/new';
import { Link, useNavigate, useParams } from 'react-router-dom';

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
            return await instance.put(`/admin/tintuc/${id}`, news);
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

    // Loading state
    if (isFetching || isLoadingNews) {
        return <div>Đang tải...</div>;
    }

    // Error state
    if (fetchError || newsError) {
        return <div>Có lỗi xảy ra khi tải dữ liệu: {fetchError?.message || newsError?.message}</div>;
    }

    // Ensure that newsData is ready before rendering the form
    if (!newsData) {
        return <div>Không tìm thấy dữ liệu tin tức.</div>;
    }

    return (
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
            <div className="flex items-center">
                <h1 className="md:text-base">
                    Quản trị / Tin tức /
                    <span className="font-semibold px-px">Cập nhật tin tức</span>
                </h1>
            </div>
            <div className="flex items-center justify-between">
                <h1 className="font-semibold md:text-3xl">Cập nhật tin tức: {newsData?.data.tieu_de}</h1>
                <div>
                    <Link to="/admin/news" className="mr-1">
                        <Button className="bg-gradient-to-r  from-blue-500 to-blue-400 text-white rounded-lg py-1 hover:bg-blue-600 shadow-md transition-colors">
                            Quay lại
                        </Button>
                    </Link>
                </div>
            </div>
            <div>
                <div style={{ padding: 24, minHeight: 360 }}>
                    <div className="bg-white px-4 rounded-xl py-5 shadow-lg max-w-7xl">
                        <Form
                            form={form}
                            name="news"
                            layout="vertical"
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}
                            style={{ maxWidth: 1000 }}
                            initialValues={newsData.data} // Cập nhật cách lấy dữ liệu khởi tạo
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
                                                    {user.ho} {user.ten}
                                                </Option>
                                            ))
                                        ) : (
                                            <Option disabled>Không có tài khoản nào</Option>
                                        )}
                                    </Select>
                                </Form.Item>
                            </div>
                            <Form.Item
                                label="Danh mục tin tức"
                                name="danh_muc_tin_tuc_id"
                                rules={[{ required: true, message: "Vui lòng chọn danh mục" }]}
                            >
                                <Select placeholder="Vui lòng chọn danh mục" className="w-full">
                                    {Array.isArray(categoriesAndUsers?.categories) && categoriesAndUsers.categories.length > 0 ? (
                                        categoriesAndUsers.categories.map((newcategory: any) => (
                                            <Option key={newcategory.id} value={newcategory.id}>
                                                {newcategory.ten_danh_muc_tin_tuc}
                                            </Option>
                                        ))
                                    ) : (
                                        <Option disabled>Không có danh mục nào</Option>
                                    )}
                                </Select>
                            </Form.Item>
                            <div className="grid grid-cols-1 gap-5">
                                <Form.Item
                                    label="Nội dung"
                                    name="noi_dung"
                                    rules={[{ required: true, message: "Nội dung tin tức bắt buộc phải nhập!" }]}
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
                                        initialValue={newsData.data.noi_dung || "Chào mừng bạn đến với Glow clothing!"}
                                    />
                                </Form.Item>
                            </div>
                            <Form.Item>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    className="px-3 py-2 bg-black text-white rounded-lg"
                                >
                                    Cập nhật
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default NewEdit;
