import { Loading3QuartersOutlined } from "@ant-design/icons";
import {
  Button,
  Checkbox,
  Form,
  Input,
  Radio,
  RadioChangeEvent,
  Select,
} from "antd";

import TextArea from "antd/es/input/TextArea";
import { useState } from "react";

import { Link } from "react-router-dom";

const UsersAdd = () => {
  // const [value, setValue] = useState(1);

  // const onChange = (e: RadioChangeEvent) => {
  //   console.log("radio checked", e.target.value);
  //   setValue(e.target.value);
  // };
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className=" md:text-base">
          Quản trị / Tài khoản /
          <span className="font-semibold px-px="> Thêm Tài khoản</span>{" "}
        </h1>
      </div>
      <div className="flex items-center justify-between">
        <h1 className=" font-semibold md:text-3xl"> Thêm Tài khoản </h1>
        <div>
          {" "}
          <Link to="/admin/products/add" className="mr-1">
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
          <div className="bg-white  px-4  rounded-xl py-5 shadow-lg max-w-6xl  mx-10">
            <Form
              // form={form}
              name="basic"
              layout={"vertical"}
              labelCol={{ span: 15 }}
              wrapperCol={{ span: 24 }}
              style={{ maxWidth: 1000 }}
              className="mx-10 my-5"
              // initialValues={{ remember: true }}
              // onFinish={onFinish}
              autoComplete="off"
            >
              <div className="grid grid-cols-4 gap-5 ">
                <Form.Item
                  label="Họ  khách hàng"
                  name="name"
                  rules={[
                    {
                      required: true,
                      message: "Họ của khách hàng bắt buộc phải nhập!",
                    },
                  ]}
                >
                  <Input placeholder="Nhập Họ của khác hàng " />
                </Form.Item>
                <Form.Item
                  label="Tên của khách hàng"
                  name="name"
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
                  name="featured"
                  valuePropName="checked"
                  // initialValue={false}
                >
                  <Radio.Group name="radiogroup" defaultValue={1}>
                    <Radio value={1}>Nam</Radio>
                    <Radio value={2}>Nữ</Radio>
                    <Radio value={3}>Khác...</Radio>
                  </Radio.Group>
                </Form.Item>
              </div>{" "}
              {/* <Form.Item label="Danh mục Tài khoản" name="category">
                  <Select
                    defaultValue="Vui long chon danh muc"
                    className="w-[490px]"
                    // onChange={handleChange}
                    //   options={
                    //     category?.map((item: ICategory) => ({
                    //       value: item._id,
                    //       label: item.name,
                    //     })) || []
                    //   }
                  />
                </Form.Item> */}
              <div className="grid grid-cols-2 gap-5">
                <Form.Item
                  label="Mô tả ngắn"
                  name="description"
                  rules={[
                    {
                      required: true,
                      message: "Tên Tài khoản bắt buộc phải nhập!",
                    },
                  ]}
                >
                  <TextArea rows={5} placeholder="Nhập mô tả Tài khoản" />
                </Form.Item>
                <Form.Item
                  label="Nội dung"
                  name="description"
                  rules={[
                    {
                      required: true,
                      message: "Tên Tài khoản bắt buộc phải nhập!",
                    },
                  ]}
                >
                  <TextArea rows={5} placeholder="Nhập mô tả Tài khoản" />
                </Form.Item>
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <Form.Item
                    className=""
                    label="Ảnh nổi bật "
                    name="feature_image"
                  >
                    {/* <Upload
                        action="https://api.cloudinary.com/v1_1/dpypwbeis/image/upload"
                        data={{ upload_preset: "ml_default" }}
                        listType="picture-card"
                        fileList={fileList}
                        onPreview={handlePreview}
                        onChange={handleChange}
                      >
                        {fileList.length >= 1 ? null : uploadButton}
                      </Upload>
                      {previewImage && (
                        <Image
                          wrapperStyle={{ display: "none" }}
                          preview={{
                            visible: previewOpen,
                            onVisibleChange: (visible) =>
                              setPreviewOpen(visible),
                            afterOpenChange: (visible) =>
                              !visible && setPreviewImage(""),
                          }}
                          src={previewImage}
                        />
                      )}{" "} */}
                  </Form.Item>{" "}
                  <Form.Item
                    label="Tài khoản nổi bật"
                    name="featured"
                    valuePropName="checked"
                    // initialValue={false}
                  >
                    <Checkbox />
                  </Form.Item>
                </div>
                <Form.Item
                  className=""
                  label="số lượng Tài khoản"
                  name="countIn_stock"
                  rules={[
                    {
                      required: true,
                      message: "Số lượng Tài khoản bắt buộc phải nhập!",
                    },
                  ]}
                >
                  <Input placeholder="Nhập số lượng Tài khoản" />
                </Form.Item>{" "}
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

export default UsersAdd;
