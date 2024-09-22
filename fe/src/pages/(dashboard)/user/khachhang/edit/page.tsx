import instance from "@/configs/axios";
import { Loading3QuartersOutlined } from "@ant-design/icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Button,
  DatePicker,
  Form,
  FormProps,
  Input,
  message,
  Radio,
} from "antd";
import moment from "moment";
import { Link, useNavigate, useParams } from "react-router-dom";
type FieldType = {
  ho?: string;
  ten?: string;
  email?: string;
  password?: string;
  so_dien_thoai?: string;
  dia_chi?: string;
  gioi_tinh?: string;
  ngay_sinh?: any;
};

const UserskhachhangEdit = () => {
  const nav = useNavigate();
  const [form] = Form.useForm();
  const { id } = useParams();

  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["USERID", id],
    queryFn: async () => {
      try {
        const res = await instance.get(`/admin/taikhoan/${id}`);
        return res.data;
      } catch (error) {
        throw error;
      }
    },
  });
  console.log(user);
  const mutate = useMutation({
    mutationFn: async (data) => {
      try {
        const res = await instance.put(`/admin/taikhoan/${id}`, data);
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
      nav("/admin/users/khachhang");
      form.resetFields();
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
        ? (values.ngay_sinh as any).format("YYYY-MM-DD")
        : undefined,
    };
    mutate.mutate(data as any);
  };

  if (isLoading) return <p>Đang tải dữ liệu...</p>;
  if (isError) return <p>Có lỗi xảy ra khi tải dữ liệu</p>;

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className=" md:text-base">
          Quản trị / Tài khoản /
          <span className="font-semibold px-px="> Cập nhật Tài khoản </span>
        </h1>
      </div>
      <div className="flex items-center justify-between">
        <h1 className="font-semibold md:text-3xl">
          Cập nhật Tài khoản{user?.data?.email ? `: ${user.data.email}` : ""}
        </h1>
        <div>
          <Link to="/admin/users/khachhang" className="mr-1">
            <Button className="ml-auto bg-black text-white rounded-lg py-1">
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
                ...user.data,
                ngay_sinh: user.data.ngay_sinh
                  ? moment(user.data.ngay_sinh)
                  : undefined,
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
                    {
                      pattern: /^[^\s]+(\s+[^\s]+)*$/,
                      message: "Vui lòng nhập họ không chứa ký tự trắng!",
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
                    {
                      pattern: /^[^\s]+(\s+[^\s]+)*$/,
                      message: "Vui lòng nhập tên không chứa ký tự trắng!",
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
                  label="Số điện thoại"
                  name="so_dien_thoai"
                  rules={[
                    {
                      required: true,
                      message: "Số điện thoại bắt buộc phải nhập!",
                    },
                    {
                      pattern: /^[0-9]{10,11}$/,
                      message:
                        "Số điện thoại không hợp lệ! Vui lòng nhập 10-11 chữ số.",
                    },
                  ]}
                >
                  <Input placeholder="Nhập số điện thoại của khách hàng" />
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
                        if (!value) return Promise.resolve();
                        const today = new Date();
                        const birthDate = new Date(value);
                        let age = today.getFullYear() - birthDate.getFullYear();
                        if (age < 3)
                          return Promise.reject(
                            new Error("Khách hàng yêu cầu độ tuổi phù hợp!")
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
                <button
                  type="submit"
                  className="px-3 py-2 bg-black text-white rounded-lg"
                >
                  {mutate.status === "pending" ? (
                    <>
                      <Loading3QuartersOutlined className="animate-spin" />{" "}
                      Submit
                    </>
                  ) : (
                    "Cập nhật"
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

export default UserskhachhangEdit;
