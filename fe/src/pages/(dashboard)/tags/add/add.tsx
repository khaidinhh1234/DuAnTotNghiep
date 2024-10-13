import instance from "@/configs/admin";
import { uploadToCloudinary } from "@/configs/cloudinary";
import { UploadOutlined } from "@ant-design/icons";
import { useMutation } from "@tanstack/react-query";
import { Button, Form, Input, message, Spin, Upload } from "antd";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Tagsadd = () => {
  const [form] = Form.useForm();
  const nav = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { mutate } = useMutation({
    mutationFn: async (data: any) => {
      const response = await instance.post(`/bosuutap`, data);
      return response.data;
    },
    onSuccess: () => {
      message.success("Thêm thẻ đính kèm thành công");
      form.resetFields();
      nav("/admin/products/tags");
    },
    onError: (error) => {
      message.error(error.message);
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  const onFinish = async (values: any) => {
    // const data: any = {
    //   ...values,
    // };
    // mutate(data);
    // console.log(values);
    setIsSubmitting(true);

    try {
      let imageUrl = null;
      if (values.imageFile && values.imageFile[0]) {
        imageUrl = await uploadToCloudinary(values.imageFile[0].originFileObj);
      }

      const data = {
        ...values,
        ten: values.ten,
        duong_dan_anh: imageUrl,
      };
      mutate(data);
    } catch (error) {
      message.error("Lỗi khi tải ảnh lên");
      setIsSubmitting(false);

    }
  };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="md:text-base">
          Quản trị /Bộ sưu tập /
          <span className="font-semibold px-px"> Bộ sưu tập</span>
        </h1>
      </div>
      <div className="flex items-center justify-between">
        <h1 className="font-semibold md:text-3xl">Thêm bộ sưu tập</h1>
        <div>
          <Link to="/admin/products/tags" className="mr-1">
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
                label="Tên thẻ đính kèm"
                name="ten"
                rules={[
                  {
                    required: true,
                    message: "Tên thẻ đính kèm bắt buộc phải nhập!",
                  },

                  {
                    pattern: /^[^\s]+(\s+[^\s]+)*$/,
                    message: "Vui lòng nhập chứa ký tự trắng!",
                  },
                ]}
              >
                <Input placeholder="Nhập tên thẻ đính kèm" />
              </Form.Item>
              <Form.Item
                label="Thêm ảnh"
                name="imageFile"
                valuePropName="fileList"
                getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
                rules={[{ required: true, message: "Vui lòng chọn ảnh!" }]}
              >
                <Upload
                  listType="picture-card"
                  maxCount={1}
                  beforeUpload={() => false}
                >
                  <Button>  
                      <UploadOutlined /> tải ảnh
                    </Button>
                </Upload>
              </Form.Item>
              <Form.Item>
              <Button
  type="primary"
  htmlType="submit"
  className="bg-gradient-to-r from-blue-500 to-blue-400 text-white rounded-lg py-1 hover:bg-blue-600 shadow-md transition-colors"
  disabled={isSubmitting}
>
{isSubmitting ? <><Spin size="small"/> Đang Thêm...</> : "Thêm"}
</Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Tagsadd;
