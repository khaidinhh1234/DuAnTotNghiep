import instance from "@/configs/admin";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Button,
  DatePicker,
  Form,
  FormProps,
  Input,
  message,
  Radio,
  Select,
} from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

type FieldType = {
  ho?: string;
  ten?: string;
  email?: string;
  password?: string;
  so_dien_thoai?: string;
  dia_chi?: string;
  gioi_tinh?: string;
  ngay_sinh?: dayjs.Dayjs | null; // Đảm bảo kiểu ngày sinh là Dayjs hoặc null
};

const UsersnhanvienEdit = () => {
  const nav = useNavigate();
  const [form] = Form.useForm();
  const { id } = useParams();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["taikhoanid", id],
    queryFn: async () => {
      try {
        const res = await instance.get(`/taikhoan/${id}`);
        return res.data;
      } catch (error) {
        throw error;
      }
    },
  });

  const { data: vaitroid } = useQuery({
    queryKey: ["vaitro"],
    queryFn: async () => {
      try {
        const res = await instance.get("/vaitro");
        return res.data;
      } catch (error) {
        console.log(error);
      }
    },
  });

  const phanquyen =
    vaitroid?.data
      .filter((item: any) => item.ten_vai_tro !== "Khách hàng")
      .map((item: any) => ({
        label: item.ten_vai_tro,
        value: item.ten_vai_tro,
      })) || [];

  const vaitro =
    data?.data?.tai_khoan?.vai_tros?.map((item: any) => item?.ten_vai_tro) ||
    [];

  const user = data?.data?.tai_khoan;
  console.log(user);
  const [phanquyenSelected, setPhanquyenSelected] = useState<string[]>(vaitro);

  const mutate = useMutation({
    mutationFn: async (data) => {
      try {
        const res = await instance.put(`/taikhoan/${id}`, data);
        return res.data;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: () => {
      message.open({
        type: "success",
        content: "Cập nhật tài khoản khách hàng thành công",
      });
      nav("/admin/users/nhanvien");
    },
    onError: (error: any) => {
      message.open({
        type: "error",
        content: error?.response?.data?.message || "Có lỗi xảy ra",
      });
    },
  });

  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    const data = {
      ...values,
      ngay_sinh: values.ngay_sinh
        ? values.ngay_sinh.format("YYYY-MM-DD")
        : undefined,
      vai_tros: phanquyenSelected,
    };
    mutate.mutate(data as any);
  };

  useEffect(() => {
    if (user) {
      const selectedRoles = user.vai_tros.map((item: any) => item.ten_vai_tro);
      setPhanquyenSelected(selectedRoles);

      // Cập nhật các trường trong form, bao gồm ngày sinh
      form.setFieldsValue({
        ho: user.ho,
        ten: user.ten,
        email: user.email,
        so_dien_thoai: user.so_dien_thoai,
        dia_chi: user.dia_chi,
        gioi_tinh: user.gioi_tinh,
        ngay_sinh: user.ngay_sinh ? dayjs(user.ngay_sinh) : null, // Chuyển đổi sang dayjs
        vai_tros: selectedRoles,
      });
    }
  }, [user, form]);

  useEffect(() => {
    form.setFieldsValue({
      vai_tros: phanquyenSelected,
    });
  }, [phanquyenSelected, form]);

  if (isLoading) return <p>Đang tải dữ liệu...</p>;
  if (isError) return <p>Có lỗi xảy ra khi tải dữ liệu</p>;

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="md:text-base">
          Quản trị / Tài khoản /
          <span className="font-semibold px-px="> Cập nhật Tài khoản </span>
        </h1>
      </div>
      <div className="flex items-center justify-between">
        <h1 className="font-semibold md:text-3xl">
          Cập nhật Tài khoản{user?.email ? `: ${user?.email}` : ""}
        </h1>
        <div>
          <Link to="/admin/users/nhanvien" className="mr-1">
            <Button className="bg-gradient-to-r from-blue-500 to-blue-400 text-white rounded-lg py-1 hover:bg-blue-600 shadow-md transition-colors">
              Quay lại
            </Button>
          </Link>
        </div>
      </div>
      <div>
        <div style={{ padding: 24, minHeight: 360 }}>
          <div className="bg-white px-4 rounded-xl py-5 shadow-lg max-w-7xl mx-10">
            <Form
              form={form}
              name="basic"
              layout={"vertical"}
              labelCol={{ span: 15 }}
              wrapperCol={{ span: 24 }}
              style={{ maxWidth: "100%" }}
              className="mx-10 my-5"
              onFinish={onFinish}
              initialValues={{
                ...user,
                ngay_sinh: user?.ngay_sinh ? dayjs(user.ngay_sinh) : null,
                vai_tros: vaitro,
              }}
              autoComplete="off"
            >
              <div className="grid grid-cols-4 gap-5">
                <Form.Item
                  label="Họ khách hàng"
                  name="ho"
                  rules={[
                    {
                      required: true,
                      message: "Họ của khách hàng bắt buộc phải nhập!",
                    },
                  ]}
                >
                  <Input placeholder="Nhập Họ của khách hàng" />
                </Form.Item>
                <Form.Item
                  label="Tên của khách hàng"
                  name="ten"
                  rules={[
                    {
                      required: true,
                      message: "Tên của khách hàng bắt buộc phải nhập!",
                    },
                  ]}
                >
                  <Input placeholder="Nhập tên của khách hàng" />
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
                >
                  <Radio.Group className="flex">
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
                      value="3"
                      className="flex flex-row items-end flex-nowrap"
                    >
                      Khác...
                    </Radio>
                  </Radio.Group>
                </Form.Item>
              </div>

              <div className="grid grid-cols-4 gap-5">
                <Form.Item
                  label="Số điện thoại"
                  name="so_dien_thoai"
                  className="col-span-1"
                  rules={[
                    {
                      required: true,
                      message: "Số điện thoại bắt buộc phải nhập!",
                    },
                  ]}
                >
                  <Input placeholder="Nhập số điện thoại của khách hàng" />
                </Form.Item>
                <Form.Item
                  label="Ngày sinh"
                  name="ngay_sinh"
                  className="col-span-1"
                  rules={[
                    {
                      required: true,
                      message: "Ngày sinh bắt buộc phải nhập!",
                    },
                    {
                      validator: (_, value) => {
                        if (!value) return Promise.resolve();
                        const today = new Date();
                        const birthDate = new Date(value);
                        let age = today.getFullYear() - birthDate.getFullYear();
                        if (age < 3)
                          return Promise.reject(
                            new Error("Nhân viên yêu cầu độ tuổi phù hợp!")
                          );
                        if (birthDate > today)
                          return Promise.reject(
                            new Error(
                              "Ngày sinh không được là ngày trong tương lai!"
                            )
                          );
                        return Promise.resolve();
                      },
                    },
                  ]}
                >
                  <DatePicker />
                </Form.Item>
                <Form.Item
                  label="Vai trò"
                  name="vai_tros"
                  className="col-span-2"
                  rules={[
                    { required: true, message: "Vai trò bắt buộc phải nhập!" },
                  ]}
                >
                  <Select
                    mode="tags"
                    style={{ width: "100%" }}
                    value={phanquyenSelected}
                    onChange={(value) => {
                      setPhanquyenSelected(value);
                    }}
                    placeholder="Chọn vai trò"
                    options={phanquyen}
                  />
                </Form.Item>
              </div>
              <div className="grid grid-cols-6 gap-5">
                <Form.Item
                  label="Địa chỉ của khách hàng"
                  name="dia_chi"
                  className="col-span-3"
                >
                  <Input placeholder="Nhập Địa chỉ của khách hàng" />
                </Form.Item>
              </div>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="bg-gradient-to-r from-blue-500 to-blue-400 text-white rounded-lg py-1 hover:bg-blue-600 shadow-md transition-colors"
                >
                  Cập nhập tài khoản nhân viên
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </main>
  );
};

export default UsersnhanvienEdit;
