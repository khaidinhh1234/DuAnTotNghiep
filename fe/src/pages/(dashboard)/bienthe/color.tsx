import React, { useEffect, useState } from "react";
import { IColor } from "@/common/types/product";

import { useMutation, useQuery } from "@tanstack/react-query";
import { Button, Form, Input, message, Spin } from "antd";
import { Link, useNavigate, useParams } from "react-router-dom";
import { SketchPicker } from "react-color";
import instance from "@/configs/admin";

const Color = () => {
  const { id } = useParams<{ id: string }>();
  const [form] = Form.useForm();
  const nav = useNavigate();
  const [color, setColor] = useState("#000000");
  const [displayColorPicker, setDisplayColorPicker] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["color", id],
    queryFn: async () => {
      const response = await instance.get(`/bienthemausac/${id}`);
      console.log("Raw API response:", response.data);
      return response.data;
    },
  });

  useEffect(() => {
    if (data && data.data) {
      console.log("Setting form data:", data.data);
      const colorData = data.data;
      form.setFieldsValue({
        ten_mau_sac: colorData.ten_mau_sac,
        ma_mau_sac: colorData.ma_mau_sac,
      });
      setColor(colorData.ma_mau_sac);
      console.log("Color set to:", colorData.ma_mau_sac);
    }
  }, [data, form]);

  const updateMutation = useMutation({
    mutationFn: async (values: IColor) => {
      const response = await instance.put(`/bienthemausac/${id}`, values);
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
    console.log("Form submitted with values:", values);
    updateMutation.mutate({ ...values, ma_mau_sac: color });
  };

  const handleColorChange = (newColor: any) => {
    console.log("Color changed to:", newColor.hex);
    setColor(newColor.hex);
    form.setFieldsValue({ ma_mau_sac: newColor.hex });
  };

  const handleClick = () => {
    setDisplayColorPicker(!displayColorPicker);
  };

  const handleClose = () => {
    setDisplayColorPicker(false);
  };

  console.log("Current color state:", color);

  const popover: React.CSSProperties = {
    position: "absolute",
    zIndex: 2,
  };

  const cover: React.CSSProperties = {
    position: "fixed",
    top: "0px",
    right: "0px",
    bottom: "0px",
    left: "0px",
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
          Quản trị / Biến thể /
          <span className="font-semibold px-px"> Cập nhật màu sắc</span>
        </h1>
      </div>
      <div className="flex items-center justify-between">
        <h1 className="font-semibold md:text-3xl">
          Cập nhật màu sắc: {data?.data?.ten_mau_sac}
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
                label="Tên màu"
                name="ten_mau_sac"
                rules={[
                  { required: true, message: "Tên màu bắt buộc phải nhập!" },
                ]}
              >
                <Input placeholder="Nhập tên màu" />
              </Form.Item>
              <Form.Item
                label="Mã màu"
                name="ma_mau_sac"
                rules={[{ required: true, message: "Vui lòng chọn màu" }]}
              >
                <div>
                  <div
                    style={{
                      padding: "5px",
                      background: "#fff",
                      borderRadius: "1px",
                      boxShadow: "0 0 0 1px rgba(0,0,0,.1)",
                      display: "inline-block",
                      cursor: "pointer",
                    }}
                    onClick={handleClick}
                  >
                    <div
                      style={{
                        width: "26px",
                        height: "26px",
                        borderRadius: "2px",
                        background: color,
                      }}
                    />
                  </div>
                  {displayColorPicker ? (
                    <div style={popover}>
                      <div style={cover} onClick={handleClose} />
                      <SketchPicker
                        color={color}
                        onChange={handleColorChange}
                        onChangeComplete={(newColor) =>
                          console.log("Color picked:", newColor.hex)
                        }
                      />
                    </div>
                  ) : null}
                  <span style={{ marginLeft: "10px" }}>{color}</span>
                </div>
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="bg-gradient-to-r  from-blue-500 to-blue-400 text-white rounded-lg py-1 hover:bg-blue-600 shadow-md transition-colors"
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

export default Color;
