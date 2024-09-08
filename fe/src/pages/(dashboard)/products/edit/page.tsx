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

const ProductsEdit = () => {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className=" md:text-base">
          Quản trị / Sản phẩm /
          <span className="font-semibold px-px="> Cập nhật sản phẩm</span>{" "}
        </h1>
      </div>
      <div className="flex items-center justify-between">
        <h1 className=" font-semibold md:text-3xl"> Cập nhật sản phẩm </h1>
        <div>
          {" "}
          <Link to="/admin/products" className="mr-1">
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
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 24 }}
              style={{ maxWidth: 1000 }}
              className="mx-10 my-5"
              // initialValues={{ remember: true }}
              // onFinish={onFinish}
              autoComplete="off"
            >
              <div className="grid grid-cols-2 gap-5">
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
                <Form.Item label="Danh mục sản phẩm" name="category">
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
                </Form.Item>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <Form.Item
                  label="Mô tả ngắn"
                  name="description"
                  rules={[
                    {
                      required: true,
                      message: "Tên sản phẩm bắt buộc phải nhập!",
                    },
                  ]}
                >
                  <TextArea rows={5} placeholder="Nhập mô tả sản phẩm" />
                </Form.Item>
                <Form.Item
                  label="Nội dung"
                  name="description"
                  rules={[
                    {
                      required: true,
                      message: "Tên sản phẩm bắt buộc phải nhập!",
                    },
                  ]}
                >
                  <TextArea rows={5} placeholder="Nhập mô tả sản phẩm" />
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
                    label="Sản phẩm nổi bật"
                    name="featured"
                    valuePropName="checked"
                    // initialValue={false}
                  >
                    <Checkbox />
                  </Form.Item>
                </div>
                <Form.Item
                  className=""
                  label="số lượng sản phẩm"
                  name="countIn_stock"
                  rules={[
                    {
                      required: true,
                      message: "Số lượng sản phẩm bắt buộc phải nhập!",
                    },
                  ]}
                >
                  <Input placeholder="Nhập số lượng sản phẩm" />
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

export default ProductsEdit;
