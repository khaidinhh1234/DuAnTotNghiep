import { ICategories } from "@/common/types/category";
import instance from "@/configs/admin";
import { uploadToCloudinary } from "@/configs/cloudinary";
import { UploadOutlined } from "@ant-design/icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button, Form, Input, Select, Upload, message } from "antd";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const CategoriesAdd = () => {
  const [form] = Form.useForm();
  const nav = useNavigate();
  const [allCategories, setAllCategories] = useState<ICategories[]>([]);
  const { data: allCategoriesData } = useQuery({
    queryKey: ["allCategories"],
    queryFn: async () => {
      const response = await instance.get("/danhmuc");
      return response.data;
    },
  });

  useEffect(() => {
    if (allCategoriesData) {
      setAllCategories(allCategoriesData.data);
    }
  }, [allCategoriesData]);

  const { mutate } = useMutation({
    mutationFn: async (category: ICategories) => {
      const response = await instance.post(`/danhmuc`, category);
      return response.data;
    },
    onSuccess: () => {
      message.success("Thêm danh mục thành công");
      form.resetFields();
      nav("/admin/categories/add");
    },
    onError: (error) => {
      message.error(error.message);
    },
  });

  const onFinish = async (values: any) => {
    try {
      let imageUrl = null;
      if (values.imageFile && values.imageFile[0]) {
        imageUrl = await uploadToCloudinary(values.imageFile[0].originFileObj);
      }

      const categoryData: ICategories = {
        ...values,
        cha_id: values.category || null,
        anh_danh_muc: imageUrl,
      };
      mutate(categoryData);
    } catch (error) {
      message.error("Lỗi khi tải ảnh lên");
    }
  };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="md:text-base">
          Quản trị / Danh mục /
          <span className="font-semibold px-px"> Thêm danh mục</span>
        </h1>
      </div>
      <div className="flex items-center justify-between">
        <h1 className="font-semibold md:text-3xl">Thêm danh mục</h1>
        <div>
          <Link to="/admin/categories" className="mr-1">
            <Button className="bg-gradient-to-r from-blue-500 to-blue-400 text-white rounded-lg py-1 hover:bg-blue-600 shadow-md transition-colors">
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
                label="Tên danh mục"
                name="ten_danh_muc"
                rules={[
                  {
                    required: true,
                    message: "Tên danh mục bắt buộc phải nhập!",
                  },
                  {
                    pattern: /^[^\s]+(\s+[^\s]+)*$/,
                    message: "Vui lòng không chứa ký tự trắng!",
                  },
                ]}
              >
                <Input placeholder="Nhập tên danh mục" />
              </Form.Item>
              <Form.Item
                label="Chọn danh mục cha"
                name="category"
                rules={[{ required: false }]}
              >
                <Select placeholder="Chọn danh mục cha" allowClear>
                  {allCategories.map((category) => (
                    <Select.Option key={category.id} value={category.id}>
                      {category.ten_danh_muc}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                label="Thêm ảnh"
                name="imageFile"
                valuePropName="fileList"
                getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
                rules={[{ required: false, message: "Vui lòng chọn ảnh!" }]}
              >
                <Upload
                  listType="picture"
                  maxCount={1}
                  beforeUpload={() => false}
                >
                  <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
                </Upload>
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="bg-gradient-to-r from-blue-500 to-blue-400 text-white rounded-lg py-1 hover:bg-blue-600 shadow-md transition-colors"
                >
                  Thêm danh mục
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CategoriesAdd;
