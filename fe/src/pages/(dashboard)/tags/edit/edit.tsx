import instance from "@/configs/admin";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button, Form, Input, message } from "antd";
import { Link, useNavigate, useParams } from "react-router-dom";

const Tagsedit = () => {
  const [form] = Form.useForm();
  const nav = useNavigate();
  const { id } = useParams();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["tag", id],
    queryFn: async () => {
      try {
        const response = await instance.get("/the/" + id);
        const tag = response.data;

        return tag; // Đảm bảo rằng categories.data chứa createdAt
      } catch (error) {
        console.error("Error fetching categories:", error);
        throw new Error("Error fetching categories");
      }
    },
  });

  const { mutate } = useMutation({
    mutationFn: async (data: any) => {
      const response = await instance.put(`/the/` + id, data);
      return response.data;
    },
    onSuccess: () => {
      message.success("Cập nhật nhãn dán thành công");
      // form.resetFields();
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
  // const tagId = tagid?.data.ten_the;
  // console.log(tagid?.data?.ten_the);
  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error</p>;
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="md:text-base">
          Quản trị / Nhãn dán /
          <span className="font-semibold px-px"> Thêm nhãn dán</span>
        </h1>
      </div>
      <div className="flex items-center justify-between">
        <h1 className="font-semibold md:text-3xl">
          Cập nhật nhãn dán :{data?.data?.ten_the ? data?.data?.ten_the : ""}
          {/* Cập nhật nhãn dán :{tagId.ten_the ? tagId?.ten_the : ""} */}
        </h1>
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
              initialValues={{ ...data?.data }}
              onFinish={onFinish}
            >
              <Form.Item
                label="Tên nhãn dán"
                name="ten_the"
                rules={[
                  {
                    required: true,
                    message: "Tên nhãn dán bắt buộc phải nhập!",
                  },
                  {
                    pattern: /^[A-Z].*$/,
                    message: "Chữ cái đầu tiên phải viết hoa!",
                  },
                  {
                    pattern: /^[^\s]+(\s+[^\s]+)*$/,
                    message: "Vui lòng nhập chứa ký tự trắng!",
                  },
                ]}
              >
                <Input
                  placeholder="Nhập tên nhãn dán"
                  // value={tagid?.data.ten_the}
                />
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

export default Tagsedit;
