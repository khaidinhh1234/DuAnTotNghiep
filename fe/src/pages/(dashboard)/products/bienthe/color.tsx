import React, { useEffect } from "react";
import { IColor } from "@/common/types/product";
import instance from "@/configs/axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button, Form, Input, message } from "antd";
import { Link, useNavigate, useParams } from "react-router-dom";

const Color = () => {
  const { id } = useParams<{ id: string }>();
  console.log(id); // Kiểm tra ID

  const [form] = Form.useForm();
  const nav = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ['color', id],
    queryFn: async () => {
      const response = await instance.get(`/admin/bienthemausac/${id}`);
      console.log(data)
      return response.data;
    },
  });

  useEffect(() => {
    if (data) {
      form.setFieldsValue(data);
    }
  }, [data, form]);

  const updateMutation = useMutation({
    mutationFn: async (values: IColor) => {
      const response = await instance.put(`/admin/bienthemausac/${id}`, values);
      return response.data;
    },
    onSuccess: () => {
      message.success("Cập nhật màu sắc thành công");
      nav('/admin/products/bienthe');
    },
    onError: (error) => {
      message.error("Cập nhật màu sắc thất bại");
    },
  });

  const onFinish = (values: IColor) => {
    updateMutation.mutate(values);
  };

  if (isLoading) return <div>Đang tải...</div>;

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="md:text-base">
          Quản trị / Danh mục /<span className="font-semibold px-px"> Cập nhật màu sắc</span>
        </h1>
      </div>
      <div className="flex items-center justify-between">
        <h1 className="font-semibold md:text-3xl">Cập nhật màu sắc: {data?.ten_mau_sac}</h1>
        <div>
          <Link to="/admin/products/bienthe" className="mr-1">
            <Button className="ml-auto bg-black text-white rounded-lg py-1">Quay lại</Button>
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
              initialValues={data }
              onFinish={onFinish}
              autoComplete="off"
            >
              <Form.Item
                label="Tên màu"
                name="ten_mau_sac"
                rules={[{ required: true, message: "Tên màu bắt buộc phải nhập!" }]}
              >
                <Input placeholder="Nhập tên màu" />
              </Form.Item>
              <Form.Item
                label="Mã màu"
                name="ma_mau_sac"
                rules={[
                    { required: true, message: 'Vui lòng nhập mã màu' },
                    { 
                      pattern: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
                      message: 'Mã màu không hợp lệ. (ví dụ: #FF0000)'
                    },
                  ]}              >
                <Input placeholder="Nhập mã màu" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" className="px-3 py-2 bg-black text-white rounded-lg">
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

export default Color;
