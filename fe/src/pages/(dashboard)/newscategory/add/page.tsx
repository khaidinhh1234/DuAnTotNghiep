// import { ICategories } from "@/common/types/category";
import { NewCategories } from "@/common/types/newcategory";
import instance from "@/configs/admin";
import { UploadOutlined } from "@ant-design/icons";
import { uploadToCloudinary } from "@/configs/cloudinary";
import { Button, Form, Input, Upload, message } from "antd";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";

const NewCategoriesAdd = () => {
  const [form] = Form.useForm();
  const nav = useNavigate();

  const { mutate } = useMutation({
    mutationFn: async (category: NewCategories) => {
      const response = await instance.post(`/danhmuctintuc`, category);
      return response.data;
    },
    onSuccess: () => {
      message.success("Thêm danh mục tin tức thành công");
      form.resetFields();
      nav("/admin/newcategory/add");
    },
    onError: (error) => {
      // console.log(error);
      message.error("Thêm danh mục tin tức thất bại. Vui lòng kiểm tra lại thông tin!");
    },
  });
  // const onFinish = (values: any) => {
  //   mutate(values);
  // };
  const onFinish = async (values: any) => {
    try {
      let imageUrl = null;
      if (values.imageFile && values.imageFile[0]) {
        imageUrl = await uploadToCloudinary(values.imageFile[0].originFileObj);
      }
      const categoryData = {
        ...values,
        hinh_anh: imageUrl,
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
          Quản trị / Danh mục tin tức /
          <span className="font-semibold px-px"> Thêm danh mục tin tức</span>
        </h1>
      </div>
      <div className="flex items-center justify-between">
        <h1 className="font-semibold md:text-3xl">Thêm danh mục tin tức</h1>
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
              <Form.Item
                label="Mô tả"
                name="mo_ta"
                rules={[
                  {
                    required: true,
                    message: "Mô tả bắt buộc phải nhập!",
                  },

                  {
                    pattern: /^[^\s]+(\s+[^\s]+)*$/,
                    message: "Vui lòng  không chứa ký tự trắng!",
                  },
                ]}
              >
                <Input placeholder="Nhập mô tả tin tức" />
              </Form.Item>
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
                >
                  <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
                </Upload>
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="bg-gradient-to-r  from-blue-500 to-blue-400 text-white rounded-lg py-1 hover:bg-blue-600 shadow-md transition-colors"
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

export default NewCategoriesAdd;
