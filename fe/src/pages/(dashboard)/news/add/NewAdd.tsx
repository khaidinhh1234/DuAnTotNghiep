import { INew } from '@/common/types/new';
import instance from '@/configs/axios';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Editor } from '@tinymce/tinymce-react';
import { Button, Form, Input, message, Select } from 'antd';
import { Link, useNavigate } from 'react-router-dom';

const { Option } = Select;

const NewAdd = () => {
    const nav = useNavigate();
    const [form] = Form.useForm();


    const { data, error, isLoading } = useQuery({
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
                return { categories: [], users: [] };
            }
        },
    });

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
            user_id: values.user_id
        };
        mutate(categoryData);
    };

    if (isLoading) {
        return <div>Đang tải...</div>;
    }

    if (error) {
        return <div>Có lỗi xảy ra khi tải dữ liệu</div>;
    }

    return (
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
            <div className="flex items-center">
                <h1 className="md:text-base">
                    Quản trị / Tin tức /
                    <span className="font-semibold px-px"> Thêm tin tức</span>
                </h1>
            </div>
            <div className="flex items-center justify-between">
                <h1 className="font-semibold md:text-3xl">Thêm danh mục tin tức</h1>
                <div>
                    <Link to="/admin/news" className="mr-1">
                        <Button className="ml-auto bg-black text-white rounded-lg py-1">
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
                            name="product"
                            layout="vertical"
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}
                            style={{ maxWidth: 1000 }}
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
                                        {Array.isArray(data?.users) && data.users.length > 0 ? (
                                            data.users.map((user: any) => (
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
                            <Form.Item>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    className="px-3 py-2 bg-black text-white rounded-lg"
                                >
                                    Thêm
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </div>
            </div>
        </main>

    );
};

export default NewAdd;
