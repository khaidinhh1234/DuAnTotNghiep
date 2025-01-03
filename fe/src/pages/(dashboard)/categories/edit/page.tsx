import { ICategories } from "@/common/types/category";
import { useEffect, useState } from "react";

import instance from "@/configs/admin";
import { UploadOutlined } from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Form, Input, Select, Upload, message } from "antd";
import { Link, useNavigate, useParams } from "react-router-dom";
import { uploadToCloudinary } from "@/configs/cloudinary";
import AddCategorySelect from "@/components/AddCaterogySelect";

const CategoriesEdit = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [form] = Form.useForm();
  const nav = useNavigate();
  const [parentCategories, setParentCategories] = useState<ICategories[]>([]);

  const { data } = useQuery({
    queryKey: ["danhmuc", id],
    queryFn: async () => {
      try {
        const response = await instance.get(`/danhmuc/${id}`);
        return response.data;
      } catch (error) {
        throw new Error("Lấy danh mục thất bại");
      }
    },
  });

  const { data: allCategoriesData } = useQuery({
    queryKey: ["allCategories"],
    queryFn: async () => {
      try {
        const response = await instance.get("/danhmuc");
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

  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        ten_danh_muc: data.data.ten_danh_muc,
        cha_id: data.data.cha_id || null,
        imageFile: data.data.anh_danh_muc
          ? [{ url: data.data.anh_danh_muc }]
          : [], // Thêm ảnh vào trường form nếu có
      });
    }
  }, [data, form]);

  const { mutate } = useMutation({
    mutationFn: async (category: ICategories) => {
      try {
        const response = await instance.put(`/danhmuc/${id}`, category);
        return response.data;
      } catch (error: any) {
        throw new Error(
          error.response.data.message || "Error updating category"
        );
      }
    },
    onSuccess: () => {
      message.success("Sửa danh mục thành công");
      queryClient.invalidateQueries({ queryKey: ["danhmuc"] });
      form.resetFields();
      nav("/admin/categories");
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
      } else {
        imageUrl = data?.data.anh_danh_muc;
      }
      const categoryData: ICategories = {
        ...values,
        cha_id: values.cha_id || null,
        anh_danh_muc: imageUrl,
      };

      // console.log("Dữ liệu gửi lên server: ", categoryData);

      mutate(categoryData);
    } catch (error) {
      // console.error("Lỗi chi tiết:", error);
      message.error("Lỗi khi tải ảnh lên");
    }
  };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="md:text-base">
          Quản trị / Danh mục /
          <span className="font-semibold px-px">Cập nhập danh mục</span>
        </h1>
      </div>
      <div className="flex items-center justify-between">
        <h1 className="font-semibold md:text-3xl">
          Cập nhập danh mục: {data?.data.ten_danh_muc}
        </h1>
        <div>
          <Link to="/admin/categories" className="mr-1">
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
              style={{ maxWidth: 400 }}
              initialValues={{ ...data?.data }}
              className="mx-10 my-5"
              autoComplete="off"
              onFinish={onFinish}
            >
              <div className="grid grid-cols-1 gap-5">
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
                <Form.Item label="Chọn danh mục cha" name="cha_id">
                  {allCategoriesData ? (
                    <AddCategorySelect
                      categoriesData={allCategoriesData}
                      onChange={(value) => {
                        form.setFieldsValue({ cha_id: value }); // Đảm bảo lưu đúng vào cha_id
                      }}
                      value={form.getFieldValue("cha_id")}
                    />
                  ) : (
                    <Select disabled placeholder="Đang tải danh mục..." />
                  )}
                </Form.Item>
                <Form.Item
                  label="Thêm ảnh"
                  name="imageFile"
                  valuePropName="fileList"
                  getValueFromEvent={(e) =>
                    Array.isArray(e) ? e : e?.fileList
                  }
                  initialValue={
                    data?.data.anh_danh_muc
                      ? [
                          {
                            url: data.data.anh_danh_muc,
                            name: "image.jpg",
                            status: "done",
                          },
                        ]
                      : []
                  }
                >
                  <Upload
                    listType="picture"
                    maxCount={1}
                    beforeUpload={() => false}
                  >
                    <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
                  </Upload>
                </Form.Item>
              </div>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="bg-gradient-to-r  from-blue-500 to-blue-400 text-white rounded-lg py-1 hover:bg-blue-600 shadow-md transition-colors"
                >
                  Cập nhập danh mục
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CategoriesEdit;
