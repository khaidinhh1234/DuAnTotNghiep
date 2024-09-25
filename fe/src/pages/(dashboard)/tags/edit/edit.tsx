import { ICategories } from "@/common/types/category";
import instance from "@/configs/axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button, Form, Input, message } from "antd";
import { Link, useNavigate, useParams } from "react-router-dom";

const Tagsedit = () => {
  const [form] = Form.useForm();
  const nav = useNavigate();
  const { id } = useParams();
  const {
    data: tagid,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["tag"],
    queryFn: async () => {
      try {
        const response = await instance.get("/admin/the/" + id);
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
      const response = await instance.put(`/admin/the/` + id, data);
      return response.data;
    },
    onSuccess: () => {
      message.success("Thêm nhãn dán thành công");
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
  const tagId = tagid?.data;
  console.log(tagid);
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
          Cập nhật nhãn dán
          {/* Cập nhật nhãn dán :{tagId.ten_the ? tagId?.ten_the : ""} */}
        </h1>
        <div>
          <Link to="/admin/categories" className="mr-1">
            <Button className="ml-auto bg-black text-white rounded-lg py-1">
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
              // initialValues={{ ...tagid.data }}
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
                    pattern: /^[^\s]+(\s+[^\s]+)*$/,
                    message: "Vui lòng nhập chứa ký tự trắng!",
                  },
                ]}
              >
                <Input placeholder="Nhập tên nhãn dán" />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="px-3 py-2 bg-black text-white rounded-lg"
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
