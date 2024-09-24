import { ICategories } from "@/common/types/category";
import { NewCategories } from "@/common/types/newcategory";
import instance from "@/configs/axios";
import { useMutation } from "@tanstack/react-query";
import { Button, Form, Input, message } from "antd";
import { Link, useNavigate } from "react-router-dom";

const NewCategoriesAdd = () => {
  const [form] = Form.useForm();
  const nav = useNavigate();

  const { mutate } = useMutation({
    mutationFn: async (category: ICategories) => {
      const response = await instance.post(`/admin/danhmuctintuc`, category);
      return response.data;
    },
    onSuccess: () => {
      message.success("Thêm danh mục thành công");
      form.resetFields();
      nav('/admin/newcategory');
    },
    onError: (error) => {
      message.error(error.message);
    },
  });
  const onFinish = (values : NewCategories) => {
     mutate(values);
  };
  

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="md:text-base">
          Quản trị / Danh mục tin tức / 
          <span className="font-semibold px-px"> Thêm danh mục tin tức</span>
        </h1>
      </div>
      <div className="flex items-center justify-between">
        <h1 className="font-semibold md:text-3xl">Thêm danh mục tin tức</h1>
        <div>
          <Link to="/admin/categories" className="mr-1">
            <Button className="ml-auto bg-black text-white rounded-lg py-1">
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
              autoComplete="off"
              onFinish={onFinish}
            >
              <Form.Item
                label="Tên danh mục tin tức"
                name="ten_danh_muc_tin_tuc"
                rules={[{ required: true, message: "Tên danh mục bắt buộc phải nhập!" }]}
              >
                <Input placeholder="Nhập tên danh mục tin tức" />
              </Form.Item>
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

export default NewCategoriesAdd;
