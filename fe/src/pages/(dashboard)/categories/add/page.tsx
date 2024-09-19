import { ICategories } from "@/common/types/category";
import instance from "@/configs/axios";
import { UploadOutlined } from "@ant-design/icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button, Form, FormProps, Input, Select, Upload, message } from "antd";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const CategoriesAdd = () => {
  const [form] = Form.useForm();
  const nav = useNavigate();
  const [parentCategories, setParentCategories] = useState<ICategories[]>([]);
  
  const { data: allCategoriesData, error: fetchError } = useQuery({
    queryKey: ['allCategories'],
    queryFn: async () => {
      try {
        const response = await instance.get('/admin/danhmuc');
        return response.data;
      } catch (error) {
        throw new Error("Error fetching all categories");
      }
    },
  });

  useEffect(() => {
    if (allCategoriesData) {
      const filteredCategories = allCategoriesData.data.filter(
        (category: ICategories) => !category.cha_id
      );
      setParentCategories(filteredCategories);
    }
  }, [allCategoriesData]);

  const { mutate } = useMutation({
    mutationFn: async (category: ICategories) => {
      try {
        const response = await instance.post(`/admin/danhmuc`, category);
        return response.data;
      } catch (error: any) {
        throw new Error(error.response.data.message || "Error creating category");
      }
    },
    onSuccess: () => {
      message.success("Thêm danh mục thành công");
      form.resetFields();
      nav('/admin/categories');
    },
    onError: (error) => {
      message.error(error.message);
    },
  });

  const onFinish: FormProps<ICategories>["onFinish"] = (values) => {
    const categoryData: ICategories = {
      ...values,
      cha_id: values.category || null,  // Ensure that the parent category ID is correctly assigned
      // If you need to upload the file to the server, handle it here
      // image: values.imageFile ? values.imageFile.file.originFileObj : null,
    };
    mutate(categoryData);
  };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="md:text-base">
          Quản trị / Sản phẩm / 
          <span className="font-semibold px-px"> Thêm danh mục</span>
        </h1>
      </div>
      <div className="flex items-center justify-between">
        <h1 className="font-semibold md:text-3xl">Thêm danh mục</h1>
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
              style={{ maxWidth: 400 }}
              className="mx-10 my-5"
              autoComplete="off"
              onFinish={onFinish}
            >
              <div className="grid grid-cols-1 gap-5">
                <Form.Item
                  label="Tên danh mục"
                  name="ten_danh_muc"
                  rules={[{ required: true, message: "Tên danh mục bắt buộc phải nhập!" }]}
                >
                  <Input placeholder="Nhập tên danh mục" />
                </Form.Item>
                <Form.Item
                  label="Chọn danh mục cha"
                  name="category"
                >
                  <Select placeholder="Chọn danh mục cha" allowClear>
                    {parentCategories.map(category => (
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
                  getValueFromEvent={(e) => Array.isArray(e) ? e : e?.fileList}
                >
                  <Upload listType="picture" maxCount={1} beforeUpload={() => false}>
                    <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
                  </Upload>
                </Form.Item>
              </div>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="px-3 py-2 bg-black text-white rounded-lg"
                >
                  Submit
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
