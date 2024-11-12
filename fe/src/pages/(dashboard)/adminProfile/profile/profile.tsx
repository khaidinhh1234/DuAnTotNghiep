import { Button, DatePicker, Form, Input, Radio } from "antd";
// import { useNavigate } from 'react-router-dom';

const Profile = ({ profile }: any) => {
  // const nav = useNavigate();

  const [form] = Form.useForm();

  const onFinish = async (values: any) => {
    console.log("Success:", values);
  };
  console.log("Profile:", profile?.tai_khoan);
  const thongtin = profile?.tai_khoan;
  return (
    <div className="max-w mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4">Chỉnh sửa trang cá nhân</h2>
      <Form
        form={form}
        name="basic"
        layout="vertical"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 24 }}
        style={{ maxWidth: 1000 }}
        initialValues={{ ...profile?.tai_khoan }}
        className=" my-5"
        autoComplete="off"
        onFinish={onFinish}
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập email của bạn!",
            },
          ]}
        >
          <Input placeholder="Nhập Email của bạn" value={thongtin?.email} />
        </Form.Item>
        <Form.Item
          label="Số điện thoại"
          name="so_dien_thoai"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập số điện thoại của bạn!",
            },
          ]}
        >
          <Input placeholder="Nhập số điện thoại của bạn" />
        </Form.Item>
        <Form.Item
          label="Địa chỉ "
          name="dia_chi"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập Địa chỉ của bạn!",
            },
          ]}
        >
          <Input placeholder="Nhập địa chỉ của bạn" />
        </Form.Item>

        <Form.Item
          label="Ngày sinh  "
          name="ngay_sinh"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập Ngày sinh của bạn!",
            },
          ]}
        >
          <DatePicker
            className="w-full h-[52px] rounded-xl border-2 border-gray-200"
            format="DD/MM/YYYY"
          />
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
            <Radio value="1" className="flex flex-row items-end flex-nowrap">
              Nam
            </Radio>
            <Radio value="2" className="flex flex-row items-end flex-nowrap">
              Nữ
            </Radio>
            <Radio value="0" className="flex flex-row items-end flex-nowrap">
              Khác...
            </Radio>
          </Radio.Group>
        </Form.Item>
        <div>
          <Button type="primary">Lưu thay đổi</Button>
        </div>
      </Form>
    </div>
  );
};

export default Profile;
