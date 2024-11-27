import { ICategories } from "@/common/types/category";
import instance from "@/configs/admin";
import { UploadOutlined } from "@ant-design/icons";
import { uploadToCloudinary } from "@/configs/cloudinary";
import { Button, Form, Input, Upload, message, Spin } from "antd";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import { NewCategories } from "@/common/types/newcategory";
import { useEffect } from "react";

const NewCategoriesEdit = () => {
  const [form] = Form.useForm();
  const nav = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["danhmuctintuc", id],
    queryFn: async () => {
      const response = await instance.get(`/danhmuctintuc/${id}`);
      return response.data;
    },
  });
  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        ten_danh_muc_tin_tuc: data.data.ten_danh_muc_tin_tuc,
        mo_ta: data.data.mo_ta,
        imageFile: data.data.hinh_anh ? [{ url: data.data.hinh_anh }] : [],
      });
    }
  }, [data, form]);
  const { mutate } = useMutation({
    mutationFn: async (category: ICategories) => {
      const response = await instance.put(`/danhmuctintuc/${id}`, category);
      return response.data;
    },
    onSuccess: () => {
      message.success("Cập nhật danh mục thành công");
      queryClient.invalidateQueries({ queryKey: ["danhmuctintuc"] });
      form.resetFields();
      nav("/admin/newcategory");
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
      const categoryData = {
        ...values,
        hinh_anh: imageUrl || data?.data.hinh_anh, // Nếu không có ảnh mới, giữ ảnh cũ
      };
      mutate(categoryData);
    } catch (error) {
      message.error("Lỗi khi tải ảnh lên");
    }
  };

  if (isLoading) {
    return <Spin />;
  }

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
              initialValues={data?.data} // Đặt dữ liệu ban đầu
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
                    message: "Vui lòng không chứa ký tự trắng!",
                  },
                ]}
              >
                <Input placeholder="Nhập tên danh mục tin tức" />
              </Form.Item>
              <Form.Item
                label="Mô tả"
                name="mo_ta"
                rules={[
                  { required: true, message: "Mô tả bắt buộc phải nhập!" },
                  {
                    pattern: /^[^\s]+(\s+[^\s]+)*$/,
                    message: "Vui lòng không chứa ký tự trắng!",
                  },
                ]}
              >
                <Input placeholder="Nhập mô tả tin tức" />
              </Form.Item>
              {/* <Form.Item
                label="Thêm ảnh"
                name="imageFile"
                valuePropName="fileList"
                getValueFromEvent={(e) => Array.isArray(e) ? e : e?.fileList}
              >
                <Upload
                  listType="picture"
                  maxCount={1}
                  beforeUpload={() => false}
                  defaultFileList={
                    data?.data.hinh_anh
                      ? [{ url: data.data.hinh_anh, name: "Hình ảnh hiện tại", thumbUrl: data.data.hinh_anh }]
                      : []
                  }
                >
                  <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
                </Upload>
              </Form.Item> */}
              <Form.Item
                label="Thêm ảnh"
                name="imageFile"
                valuePropName="fileList"
                getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
              >
                <Upload
                  listType="picture"
                  maxCount={1}
                  beforeUpload={() => false}
                  defaultFileList={
                    data?.data.hinh_anh
                      ? [
                          {
                            uid: "-1", // ID duy nhất cho file
                            name: "image.jpg",
                            url: data.data.hinh_anh,
                            status: "done",
                          },
                        ]
                      : []
                  }
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
