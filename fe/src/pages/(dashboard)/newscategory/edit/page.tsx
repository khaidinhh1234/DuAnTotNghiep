import { ICategories } from "@/common/types/category";
import instance from "@/configs/admin";

import { useMutation, useQuery } from "@tanstack/react-query";
import { Button, Form, Input, message, Spin } from "antd";
import { Link, useNavigate, useParams } from "react-router-dom";

const NewCategoriesEdit = () => {
  const [form] = Form.useForm();
  const nav = useNavigate();
  const { id } = useParams();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["danhmuctintuc", id],
    queryFn: async () => {
      const response = await instance.get(`/danhmuctintuc/${id}`);
      return response.data;
    },
  });

  const { mutate } = useMutation({
    mutationFn: async (category: ICategories) => {
      const response = await instance.put(`/danhmuctintuc/${id}`, category);
      return response.data;
    },
    onSuccess: () => {
      message.success("Cập nhật danh mục thành công");
      form.resetFields();
      nav("/admin/newcategory");
    },
    onError: (error) => {
      message.error(error.message);
    },
  });

  const onFinish = (values: any) => {
    mutate(values);
  };

  // Nếu đang tải dữ liệu
  if (isLoading) {
    return <Spin />;
  }

  // Nếu có lỗi khi tải dữ liệu
  if (isError) {
    return <div>Lỗi khi lấy dữ liệu danh mục. Vui lòng thử lại sau.</div>;
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="md:text-base">
          Quản trị / Danh mục tin tức /
          <span className="font-semibold px-px">Cập nhật danh mục tin tức</span>
        </h1>
      </div>
      <div className="flex items-center justify-between">
        <h1 className="font-semibold md:text-3xl">
          Cập nhật danh mục tin tức: {data?.data.ten_danh_muc_tin_tuc}
        </h1>
        <div>
          <Link to="/admin/newcategory" className="mr-1">
            <Button className="bg-gradient-to-r  from-blue-500 to-blue-400 text-white rounded-lg py-1 hover:bg-blue-600 shadow-md transition-colors">
              Quay lại
            </Button>
          </Link>
        </div>
      </div>
      <div>
        <div style={{ padding: 24, minHeight: 360 }}>
          <div className="bg-white px-4 rounded-xl py-5 shadow-lg max-w-2xl">
            <Form
              form={form}
              name="basic"
              layout="vertical"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 24 }}
              initialValues={{ ...data?.data }}
              autoComplete="off"
              onFinish={onFinish}
            >
              <Form.Item
                label="Tên danh mục tin tức"
                name="ten_danh_muc_tin_tuc"
                rules={[
                  {
                    required: true,
                    message: "Tên danh mục bắt buộc phải nhập!",
                  },
                  {
                    pattern: /^[^\s]+(\s+[^\s]+)*$/,
                    message: "Vui lòng  không chứa ký tự trắng!",
                  },
                ]}
              >
                <Input placeholder="Nhập tên danh mục tin tức" />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="bg-gradient-to-r  from-blue-500 to-blue-400 text-white rounded-lg py-1 hover:bg-blue-600 shadow-md transition-colors"
                >
                  Cập nhật danh mục tin tức
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </main>
  );
};

export default NewCategoriesEdit;
