
// import { IColor } from "@/common/types/product";
import instance from "@/configs/admin";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button, Form, Input, message, Spin } from "antd";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

interface SizeData {
  kich_thuoc: string;
  loai_kich_thuoc: string;
  chieu_cao_toi_thieu: number;
  chieu_cao_toi_da: number;
  can_nang_toi_thieu: number;
  can_nang_toi_da: number;
}

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
    mutationFn: async (values: SizeData) => {
      const updatedValues = {
        ...values,
        loai_kich_thuoc: originalSizeType,
        chieu_cao_toi_thieu: Number(values.chieu_cao_toi_thieu),
        chieu_cao_toi_da: Number(values.chieu_cao_toi_da),
        can_nang_toi_thieu: Number(values.can_nang_toi_thieu),
        can_nang_toi_da: Number(values.can_nang_toi_da),
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
      console.error("Error updating size:", error);
      if (error.response?.data?.errors) {
        Object.values(error.response.data.errors).flat().forEach((msg) => 
          message.error(msg as string)
        );
      } else {
        message.error(error.message || "Cập nhật kích thước thất bại");
      }
    },
  });

  const onFinish = (values: SizeData) => {
    updateMutation.mutate(values);
  };

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
            message: "Kích thước phải bắt đầu bằng chữ hoa và không được chứa số",
          },
        ];
      default:
        return commonRules;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center mt-[250px]">
        <Spin size="large" />
      </div>
    );
  }

  if (isError) return <div>Error</div>;

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
            <Button className="bg-gradient-to-r from-blue-500 to-blue-400 text-white rounded-lg py-1 hover:bg-blue-600 shadow-md transition-colors">
              Quay lại
            </Button>
          </Link>
        </div>
      </div>

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
  <div className="grid grid-cols-2 gap-4">
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

    <Form.Item
      label="Chiều cao tối thiểu (cm)"
      name="chieu_cao_toi_thieu"
      rules={[
        { required: true, message: "Vui lòng nhập chiều cao tối thiểu" },
        {
          validator: (_, value) => {
            if (!value) return Promise.resolve();
            const num = Number(value);
            if (isNaN(num) || num <= 0) {
              return Promise.reject('Vui lòng nhập số lớn hơn 0');
            }
            return Promise.resolve();
          }
        }
      ]}
    >
      <Input type="number" placeholder="Nhập chiều cao tối thiểu" />
    </Form.Item>

    <Form.Item
      label="Chiều cao tối đa (cm)"
      name="chieu_cao_toi_da"
      rules={[
        { required: true, message: "Vui lòng nhập chiều cao tối đa" },
        {
          validator: (_, value) => {
            if (!value) return Promise.resolve();
            const num = Number(value);
            if (isNaN(num) || num <= 0) {
              return Promise.reject('Vui lòng nhập số lớn hơn 0');
            }
            const minHeight = form.getFieldValue('chieu_cao_toi_thieu');
            if (minHeight && num <= Number(minHeight)) {
              return Promise.reject('Chiều cao tối đa phải lớn hơn chiều cao tối thiểu');
            }
            return Promise.resolve();
          }
        }
      ]}
    >
      <Input type="number" placeholder="Nhập chiều cao tối đa" />
    </Form.Item>

    <Form.Item
      label="Cân nặng tối thiểu (kg)"
      name="can_nang_toi_thieu"
      rules={[
        { required: true, message: "Vui lòng nhập cân nặng tối thiểu" },
        {
          validator: (_, value) => {
            if (!value) return Promise.resolve();
            const num = Number(value);
            if (isNaN(num) || num <= 0) {
              return Promise.reject('Vui lòng nhập số lớn hơn 0');
            }
            return Promise.resolve();
          }
        }
      ]}
    >
      <Input type="number" placeholder="Nhập cân nặng tối thiểu" />
    </Form.Item>

    <Form.Item
      label="Cân nặng tối đa (kg)"
      name="can_nang_toi_da"
      rules={[
        { required: true, message: "Vui lòng nhập cân nặng tối đa" },
        {
          validator: (_, value) => {
            if (!value) return Promise.resolve();
            const num = Number(value);
            if (isNaN(num) || num <= 0) {
              return Promise.reject('Vui lòng nhập số lớn hơn 0');
            }
            const minWeight = form.getFieldValue('can_nang_toi_thieu');
            if (minWeight && num <= Number(minWeight)) {
              return Promise.reject('Cân nặng tối đa phải lớn hơn cân nặng tối thiểu');
            }
            return Promise.resolve();
          }
        }
      ]}
    >
      <Input type="number" placeholder="Nhập cân nặng tối đa" />
    </Form.Item>
  </div>

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
    </main>
  );
};

export default Size;
