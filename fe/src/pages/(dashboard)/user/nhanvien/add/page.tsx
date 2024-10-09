import { Loading3QuartersOutlined } from "@ant-design/icons";
import { Button, DatePicker, Form, Input, message, Radio, Select } from "antd";

import { FormProps } from "antd";
import { useState } from "react";

import { useMutation, useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import instance from "@/configs/admin";

// import type { SelectProps } from "antd";

// const options: SelectProps["options"] = [];
type FieldType = {
  ho?: string;
  ten?: string;
  email?: string;
  password?: string;
  so_dien_thoai?: string;
  dia_chi?: string;
  gioi_tinh?: string;
  ngay_sinh?: string;
  vai_tros?: string[];
};
const UsersNhanvienAdd = () => {
  const { data } = useQuery({
    queryKey: ["VAITRO"],
    queryFn: async () => {
      try {
        const res = await instance.get("/vaitro");
        return res.data;
      } catch (error) {
        console.log(error);
      }
    },
  });
  const vaitro = data?.data.map((item: any) => {
    return { label: item.ten_vai_tro, value: item.ten_vai_tro };
  });

  // const handleChange = (value: string) => {
  //   console.log(value);
  // };
  const nav = useNavigate();
  const mutate = useMutation({
    mutationFn: async (data) => {
      try {
        const res = await instance.post("/taikhoan", data);
        return res.data;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: () => {
      message.open({
        type: "success",
        content: "Thêm tài khoản Nhân viên thành công",
      });
      nav("/admin/users/nhanvien");

      // form.resetFields();
    },
    onError: (error: any) => {
      message.open({
        type: "error",
        content: error?.response?.data?.message || "Có lỗi xảy ra",
      });
    },
  });
  const [isPending] = useState(false);
  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    const data = {
      ...values,
      ngay_sinh: values.ngay_sinh
        ? (values.ngay_sinh as any).format("YYYY-MM-DD")
        : undefined,
    };
    mutate.mutate(data as any);
  };
  // const onChange: DatePickerProps["onChange"] = (dateString) => {
  //   console.log(dateString);
  // };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className=" md:text-base">
          Quản trị / Tài khoản /
          <span className="font-semibold px-px=">
            {" "}
            Thêm Tài khoản Nhân viên{" "}
          </span>{" "}
        </h1>
      </div>
      <div className="flex items-center justify-between">
        <h1 className=" font-semibold md:text-3xl">
          {" "}
          Thêm Tài khoản Nhân viên{" "}
        </h1>
        <div>
          {" "}
          <Link to="/admin/users/nhanvien" className="mr-1">
            <Button className="ml-auto bg-black text-white rounded-lg  py-1">
              Quay lại
            </Button>
          </Link>
        </div>
      </div>
      <div>
        <div
          style={{
            padding: 24,
            minHeight: 360,
          }}
        >
          <div className="bg-white  px-4  rounded-xl py-5 shadow-lg max-w-8xl  mx-10">
            <Form
              // form={form}
              name="basic"
              layout={"vertical"}
              labelCol={{ span: 15 }}
              wrapperCol={{ span: 24 }}
              style={{ maxWidth: "100%" }}
              className="mx-10 my-5"
              // initialValues={{ remember: true }}
              onFinish={onFinish}
              autoComplete="off"
            >
              <div className="flex">
                <div className=" w-[80%]">
                  <div className="grid grid-cols-3 gap-5 ">
                    <Form.Item
                      label="Họ Nhân viên"
                      name="ho"
                      rules={[
                        {
                          required: true,
                          message: "Họ của Nhân viên bắt buộc phải nhập!",
                        },
                        {
                          pattern: /^[^\s]+(\s+[^\s]+)*$/,
                          message: "Vui lòng nhập họ không chứa ký tự trắng!",
                        },
                      ]}
                    >
                      <Input placeholder="Nhập Họ của Nhân viên" />
                    </Form.Item>
                    <Form.Item
                      label="Tên của Nhân viên"
                      name="ten"
                      rules={[
                        {
                          required: true,
                          message: "Tên của Nhân viên bắt buộc phải nhập!",
                        },

                        {
                          pattern: /^[^\s]+(\s+[^\s]+)*$/,
                          message: "Vui lòng nhập tên không chứa ký tự trắng!",
                        },
                      ]}
                    >
                      <Input placeholder="Nhập tên của Nhân viên" />
                    </Form.Item>
                    <Form.Item
                      label="Giới tính"
                      name="gioi_tinh"
                      rules={[
                        {
                          required: true,
                          message: "Giới tính bắt buộc phải nhập!",
                        },
                      ]}
                      // initialValue={userGender} // Replace with dynamic value
                    >
                      <Radio.Group className="flex ">
                        <Radio
                          value="1"
                          className="flex flex-row items-end flex-nowrap"
                        >
                          Nam
                        </Radio>
                        <Radio
                          value="2"
                          className="flex flex-row items-end flex-nowrap"
                        >
                          Nữ
                        </Radio>
                        <Radio
                          value="0"
                          className="flex flex-row items-end flex-nowrap"
                        >
                          Khác...
                        </Radio>
                      </Radio.Group>
                    </Form.Item>
                  </div>

                  <div className="grid grid-cols-3 gap-5">
                    <Form.Item
                      label="Email"
                      name="email"
                      rules={[
                        {
                          required: true,
                          message: "Email bắt buộc phải nhập!",
                        },
                        {
                          pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message:
                            "Email không hợp lệ! Vui lòng nhập đúng định dạng email.",
                        },
                      ]}
                    >
                      <Input placeholder="Nhập Email của Nhân viên " />
                    </Form.Item>{" "}
                    <Form.Item
                      label="Số điện thoại"
                      name="so_dien_thoai"
                      rules={[
                        {
                          required: true,
                          message: "Số địện thoại  bắt buộc phải nhập!",
                        },
                        {
                          pattern: /^[0-9]{10,11}$/,
                          message:
                            "Số điện thoại không hợp lệ! Vui lòng nhập 10-11 chữ số.",
                        },
                        {
                          pattern: /^[^\s]+(\s+[^\s]+)*$/,
                          message: "Vui lòng nhập họ không chứa ký tự trắng!",
                        },
                      ]}
                    >
                      <Input placeholder="Nhập số điện thoại của Nhân viên  " />
                    </Form.Item>
                    <Form.Item
                      label="Ngày sinh"
                      name="ngay_sinh"
                      rules={[
                        {
                          required: true,
                          message: "Ngày sinh bắt buộc phải nhập!",
                        },
                        {
                          validator: (_, value) => {
                            if (!value) {
                              return Promise.resolve();
                            }
                            const today = new Date();
                            const birthDate = new Date(value);
                            let age =
                              today.getFullYear() - birthDate.getFullYear();
                            if (age < 3) {
                              return Promise.reject(
                                new Error("Nhân viên yêu cầu độ tuổi phù hợp!")
                              );
                            }
                            if (birthDate > today) {
                              return Promise.reject(
                                new Error(
                                  "Ngày sinh không được là ngày trong tương lai!"
                                )
                              );
                            }
                            return Promise.resolve();
                          },
                        },
                      ]}
                    >
                      <DatePicker />
                    </Form.Item>
                  </div>
                  <div className="grid grid-cols-6 gap-5">
                    <Form.Item
                      label="Password"
                      name="password"
                      className="col-span-2"
                      rules={[
                        {
                          required: true,
                          message: "Mật khẩu bắt buộc phải nhập!",
                        },

                        {
                          pattern:
                            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/,
                          message:
                            "Mật khẩu phải chứa ít nhất 1 chữ hoa và 1 số!",
                        },
                        {
                          pattern: /^[^\s]+(\s+[^\s]+)*$/,
                          message: "Vui lòng nhập họ không chứa ký tự trắng!",
                        },
                      ]}
                    >
                      <Input placeholder="Mật khẩu " />
                    </Form.Item>{" "}
                    <Form.Item
                      label="Địa chỉ của Nhân viên"
                      name="dia_chi"
                      className="col-span-3"
                    >
                      <Input placeholder="Nhập Địa chỉ của khác hàng" />
                    </Form.Item>{" "}
                  </div>
                </div>
                <div className="w-[20%]">
                  <Form.Item
                    label="Vai trò"
                    name="vai_tros"
                    rules={[
                      {
                        required: true,
                        message: "Vai trò bắt buộc phải nhập!",
                      },
                    ]}
                    // initialValue={userGender} // Replace with dynamic value
                  >
                    <Select
                      mode="tags"
                      style={{ width: "100%" }}
                      placeholder="Chọn vai trò"
                      options={vaitro}
                    />
                  </Form.Item>
                </div>{" "}
              </div>
              <Form.Item>
                <button
                  type="submit"
                  className="px-3 py-2 bg-black text-white rounded-lg"
                >
                  {isPending ? (
                    <>
                      <Loading3QuartersOutlined className="animate-spin" />{" "}
                      Submit
                    </>
                  ) : (
                    "Submit"
                  )}
                </button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </main>
  );
};

export default UsersNhanvienAdd;
