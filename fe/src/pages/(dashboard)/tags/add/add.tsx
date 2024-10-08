import instance from "@/configs/admin";
import { useMutation } from "@tanstack/react-query";
import { Button, Form, Input, message } from "antd";
import { Link, useNavigate } from "react-router-dom";

const Tagsadd = () => {
  const [form] = Form.useForm();
  const nav = useNavigate();

  const { mutate } = useMutation({
    mutationFn: async (data: any) => {
      const response = await instance.post(`/the`, data);
      return response.data;
    },
    onSuccess: () => {
      message.success("Thêm thẻ đính kèm thành công");
      form.resetFields();
      nav("/admin/products/tags");
    },
    onError: (error) => {
      message.error(error.message);
    },
  });

  const onFinish = (values: any) => {
    const data: any = {
      ...values,
    };
    mutate(data);
    // console.log(values);
  };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="md:text-base">
          Quản trị / thẻ đính kèm /
          <span className="font-semibold px-px"> Thêm thẻ đính kèm</span>
        </h1>
      </div>
      <div className="flex items-center justify-between">
        <h1 className="font-semibold md:text-3xl">Thêm thẻ đính kèm</h1>
        <div>
          <Link to="/admin/products/tags" className="mr-1">
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
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 24 }}
              autoComplete="off"
              onFinish={onFinish}
            >
              <Form.Item
                label="Tên thẻ đính kèm"
                name="ten_the"
                rules={[
                  {
                    required: true,
                    message: "Tên thẻ đính kèm bắt buộc phải nhập!",
                  },

                  {
                    pattern: /^[^\s]+(\s+[^\s]+)*$/,
                    message: "Vui lòng nhập chứa ký tự trắng!",
                  },
                ]}
              >
                <Input placeholder="Nhập tên thẻ đính kèm" />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="bg-gradient-to-r  from-blue-500 to-blue-400 text-white rounded-lg py-1 hover:bg-blue-600 shadow-md transition-colors"
                >
                  Thêm
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Tagsadd;
