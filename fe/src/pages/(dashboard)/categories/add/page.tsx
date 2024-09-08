import { DeleteOutlined, Loading3QuartersOutlined } from "@ant-design/icons";
import {
  Breadcrumb,
  Button,
  Checkbox,
  Form,
  Input,
  InputNumber,
  Select,
} from "antd";

import TextArea from "antd/es/input/TextArea";

import { Link } from "react-router-dom";

const CategoriesAdd = () => {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className=" md:text-base">
          Quản trị / Sản phẩm /
          <span className="font-semibold px-px="> Thêm danh mục</span>{" "}
        </h1>
      </div>
      <div className="flex items-center justify-between">
        <h1 className=" font-semibold md:text-3xl"> Thêm danh mục </h1>
        <div>
          {" "}
          <Link to="/admin/categories" className="mr-1">
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
          <div className="bg-white  px-4  rounded-xl py-5 shadow-lg max-w-2xl ">
            <Form
              // form={form}
              name="basic"
              layout={"vertical"}
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 24 }}
              style={{ maxWidth: 400 }}
              className="mx-10 my-5"
              // initialValues={{ remember: true }}
              // onFinish={onFinish}
              autoComplete="off"
            >
              <div className="grid grid-cols-1 gap-5">
                <Form.Item
                  label="Tên sản phẩm"
                  name="name"
                  rules={[
                    {
                      required: true,
                      message: "Tên sản phẩm bắt buộc phải nhập!",
                    },
                  ]}
                >
                  <Input placeholder="Nhập tên sản phẩm" />
                </Form.Item>
              </div>

              <Form.Item>
                <button
                  type="submit"
                  className="px-3 py-2 bg-black text-white rounded-lg"
                >
                  {/* {isPending ? ( */}
                  <>
                    <Loading3QuartersOutlined className="animate-spin" /> Submit
                  </>
                  {/* ) : (
                      "Submit"
                    )} */}
                </button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CategoriesAdd;
