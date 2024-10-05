import React from "react";
import { Button, Checkbox, Form, Input, Select } from "antd";
import { UserAddOutlined } from "@ant-design/icons";

const { Option } = Select;

const PageAddAdmin: React.FC = () => {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log("Received values:", values);
    // Xử lý logic gửi dữ liệu đến API hoặc server ở đây
  };

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4 flex items-center">
          <UserAddOutlined className="mr-2" />
          Thêm Admin
        </h2>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          style={{ maxWidth: 600 }}
        >
          <Form.Item
            label="Họ tên"
            name="fullname"
            rules={[
              { required: true, message: "Vui lòng nhập họ tên!" },
              {
                pattern: /^[A-Z].*$/,
                message: "Chữ cái đầu tiên phải viết hoa!",
              },
            ]}
          >
            <Input placeholder="Nhập họ tên" />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { type: "email", message: "Email không hợp lệ!" },
              { required: true, message: "Vui lòng nhập email!" },
            ]}
          >
            <Input placeholder="Nhập email" />
          </Form.Item>
          <Form.Item
            label="Số điện thoại"
            name="phone"
            rules={[
              { required: true, message: "Vui lòng nhập số điện thoại!" },
            ]}
          >
            <Input placeholder="Nhập số điện thoại" />
          </Form.Item>
          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
          >
            <Input.Password placeholder="Nhập mật khẩu" />
          </Form.Item>
          <Form.Item
            label="Nhập lại mật khẩu"
            name="confirmPassword"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Vui lòng nhập lại mật khẩu!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject("Mật khẩu không khớp!");
                },
              }),
            ]}
          >
            <Input.Password placeholder="Nhập lại mật khẩu" />
          </Form.Item>
          <Form.Item
            label="Chọn quyền"
            name="role"
            rules={[{ required: true, message: "Vui lòng chọn quyền!" }]}
          >
            <Select placeholder="Chọn quyền">
              <Option value="admin">Quản lý sản phẩm</Option>
              <Option value="user">Quản lý danh mục</Option>
              <Option value="guest">Quản lý đơn hàng</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Form.Item
              name="isActive"
              valuePropName="checked"
              initialValue={true}
            >
              <Checkbox defaultChecked>Kích hoạt</Checkbox>
            </Form.Item>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-full">
              Thêm Admin
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default PageAddAdmin;
