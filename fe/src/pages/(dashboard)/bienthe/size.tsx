import { IColor } from "@/common/types/product";
import instance from "@/configs/admin";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button, Form, Input, message, Spin } from "antd";
import {  Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const getSizeTypeDisplay = (loaiKichThuoc: string): string => {
  switch (loaiKichThuoc) {
    case "tre_em":
      return "Trẻ em";
    case "nam":
      return "Nam";
    case "nu":
      return "Nữ";
    default:
      return loaiKichThuoc;
  }
};


const Size = () => {
  const { id } = useParams<{ id: string }>();
  const [form] = Form.useForm();
  const nav = useNavigate();
  const [sizeType, setSizeType] = useState<string>("");
  const [originalSizeType, setOriginalSizeType] = useState<string>("");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["size", id],
    queryFn: async () => {
      const response = await instance.get(`/bienthekichthuoc/${id}`);
      return response.data;
    },
  });

  useEffect(() => {
    if (data) {
      const formData = {
        ...data.data,
        loai_kich_thuoc: getSizeTypeDisplay(data.data.loai_kich_thuoc),
      };
      form.setFieldsValue(formData);
      setSizeType(data.data.loai_kich_thuoc);
      setOriginalSizeType(data.data.loai_kich_thuoc);
    }
  }, [data, form]);

  const updateMutation = useMutation({
    mutationFn: async (values: IColor) => {
      const updatedValues = {
        ...values,
        loai_kich_thuoc: originalSizeType,
      };
      const response = await instance.put(
        `/bienthekichthuoc/${id}`,
        updatedValues
      );
      return response.data;
    },
    onSuccess: () => {
      message.success("Cập nhật kích thước thành công");
      nav("/admin/products/bienthe");
    },
    onError: (error: any) => {
      console.error("Error adding size:", error);
      if (error.response && error.response.data && error.response.data.errors) {
        const errorMessages = Object.values(error.response.data.errors).flat();
        errorMessages.map((msg) => message.error(msg as string));
      } else {
        message.error(error.message || "Cập nhập kích thước thất bại");
      }
    },
  });

  const onFinish = (values: IColor) => {
    updateMutation.mutate(values);
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center mt-[250px]">
        <Spin size="large" />
      </div>
    );

  if (isError) return <div>Error</div>;

  const getSizeRules = () => {
    const commonRules = [
      { required: true, message: "Vui lòng nhập tên kích thước" },
      { max: 50, message: "Tên kích thước không được quá 50 ký tự" },
    ];

    switch (sizeType) {
      case "tre_em":
        return [
          ...commonRules,
          { pattern: /^\d+$/, message: "Kích thước trẻ em chỉ được nhập số" },
        ];
      case "nam":
      case "nu":
        return [
          ...commonRules,
          {
            pattern: /^[A-Z]*$/,
            message:
              "Kích thước phải bắt đầu bằng chữ hoa và không được chứa số",
          },
        ];
      default:
        return commonRules;
    }
  };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="md:text-base">
          Quản trị / Biến thể /
          <span className="font-semibold px-px"> Cập nhật kích thước</span>
        </h1>
      </div>
      <div className="flex items-center justify-between">
        <h1 className="font-semibold md:text-3xl">
          Cập nhật Kích thước: {data?.data?.kich_thuoc}
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
                label="Kích thước"
                name="kich_thuoc"
                rules={getSizeRules()}
              >
                <Input placeholder="Nhập kích thước" />
              </Form.Item>

              <Form.Item label="Loại kích thước" name="loai_kich_thuoc">
                <Input disabled />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="bg-gradient-to-r from-blue-500 to-blue-400 text-white rounded-lg py-1 hover:bg-blue-600 shadow-md transition-colors"
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
