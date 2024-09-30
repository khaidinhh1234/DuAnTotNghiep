import React, { useEffect } from "react";
import { IColor } from "@/common/types/product";
import instance from "@/configs/axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button, Form, Input, message, Spin } from "antd";
import { Link, useNavigate, useParams } from "react-router-dom";

const Size = () => {
  const { id } = useParams<{ id: string }>();
  console.log(id); // Kiểm tra ID

  const [form] = Form.useForm();
  const nav = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["size", id],
    queryFn: async () => {
      const response = await instance.get(`/admin/bienthekichthuoc/${id}`);
      console.log(data);
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
      const response = await instance.put(
        `/admin/bienthekichthuoc/${id}`,
        values
      );
      return response.data;
    },
    onSuccess: () => {
      message.success("Cập nhật màu sắc thành công");
      nav("/admin/products/bienthe");
    },
    onError: () => {
      message.error("Cập nhật màu sắc thất bại");
    },
  });

  const onFinish = (values: IColor) => {
    updateMutation.mutate(values);
  };

  if (isLoading)
    return (
      <div>
        <div className="flex items-center justify-center  mt-[250px]">
          <div className=" ">
            <Spin size="large" />
          </div>
        </div>
      </div>
    );
  if (isError) return <div>Error</div>;

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="md:text-base">
          Quản trị / Danh mục /
          <span className="font-semibold px-px"> Cập nhật kích thướcc</span>
        </h1>
      </div>
      <div className="flex items-center justify-between">
        <h1 className="font-semibold md:text-3xl">
          Cập nhật : {data?.kich_thuoc}
        </h1>
        <div>
          <Link to="/admin/products/bienthe" className="mr-1">
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
              initialValues={data?.data}
              onFinish={onFinish}
              autoComplete="off"
            >
              <Form.Item
                label="kích thước "
                name="kich_thuoc"
                rules={[
                  { required: true, message: "Vui lòng nhập tên kích thước" },
                  {
                    max: 50,
                    message: "Tên kích thước không được quá 50 ký tự",
                  },
                  {
                    pattern: /^[^\s]+(\s+[^\s]+)*$/,
                    message: "Vui lòng nhập họ không chứa ký tự trắng!",
                  },
                ]}
              >
                <Input placeholder="Nhập kích thước" />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="px-3 py-2 bg-black text-white rounded-lg"
                >
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

export default Size;
