import instance from "@/configs/admin";
import { ReloadOutlined, UploadOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import type { FormProps } from "antd";
import { Button, Form, Input, Select, Upload } from "antd";
import React, { useCallback, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Link } from "react-router-dom";
const { TextArea } = Input;
type FieldType = {
  username?: string;
  password?: string;
  remember?: string;
};
// API calls
const fetchData = async (endpoint: string): Promise<any> => {
  const response = await instance.get(`/${endpoint}`);
  return response.data;
};
const AddProducts: React.FC = () => {
  const [value, setValue] = useState("");
  const [productCode, setProductCode] = useState("");

  const { data: tagsData, isLoading: tagsLoading } = useQuery<{ data: Tag[] }>({
    queryKey: ["tags"],
    queryFn: () => fetchData("the"),
  });
  const { data: categoriesData, isLoading: categoriesLoading } = useQuery<{
    data: Category[];
  }>({
    queryKey: ["danhmuc"],
    queryFn: () => fetchData("danhmuc"),
  });
  const generateRandomProductCode = useCallback(() => {
    const prefix = "SP-";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = prefix;
    for (let i = 0; i < 8; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return result;
  }, []);

  const generateNewProductCode = useCallback(() => {
    const generatedCode = generateRandomProductCode();
    console.log("New product code generated:", generatedCode);
    setProductCode(generatedCode);
    form.setFieldsValue({ ma_san_pham: generatedCode });
    console.log("Form values after update:", form.getFieldsValue());
  }, [form, generateRandomProductCode]);
  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    console.log("Success:", { ...values, noi_dung: value });
  };
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="md:text-base">
          Quản trị / Tin tức /
          <span className="font-semibold px-px"> Thêm tin tức</span>
        </h1>
      </div>
      <div className="flex items-center justify-between">
        <h1 className="font-semibold md:text-3xl">Thêm danh mục tin tức</h1>
        <div>
          <Link to="/admin/news" className="mr-1">
            <Button className="bg-gradient-to-r  from-blue-500 to-blue-400 text-white rounded-lg py-1 hover:bg-blue-600 shadow-md transition-colors">
              Quay lại
            </Button>
          </Link>
        </div>
      </div>
      <div className="bg-white p-3">
        <Form
          name="basic"
          layout="vertical"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 24 }}
          style={{ maxWidth: "100%" }}
          className="mx-10 my-5"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          // onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <div className="grid grid-cols-2 gap-5">
            <Form.Item
              label="Tên sản phẩm"
              name="ten_san_pham"
              rules={[
                { required: true, message: "Tên sản phẩm bắt buộc phải nhập!" },
              ]}
            >
              <Input placeholder="Nhập tên sản phẩm" />
            </Form.Item>
            <Form.Item
              label="Danh mục sản phẩm"
              name="danh_muc_id"
              rules={[{ required: true, message: "Vui lòng chọn danh mục" }]}
            >
              <Select placeholder="Vui lòng chọn danh mục" className="w-full">
                {categoriesData?.data &&
                  categoriesData.data.map((danhmuc: any) => (
                    <Select.Option key={danhmuc.id} value={danhmuc.id}>
                      {danhmuc.ten_danh_muc}
                    </Select.Option>
                  ))}
              </Select>
            </Form.Item>
          </div>{" "}
          <div className="grid grid-cols-1 gap-5">
            <Form.Item
              label="Mô tả ngắn"
              name="mo_ta_ngan"
              rules={[
                { required: true, message: "Mô tả ngắn bắt buộc phải nhập!" },
              ]}
            >
              <TextArea rows={5} placeholder="Nhập mô tả sản phẩm" />
            </Form.Item>
          </div>
          <div className="grid grid-cols-2 gap-5">
            <Form.Item label="Chọn tags" name="tags">
            <Select mode="multiple" className="w-full" placeholder="Chọn tags">
            {tagsData?.data &&
              tagsData.data.map((tag: Tag) => (
                <Select.Option key={tag.id} value={tag.id}>
                  {tag.ten_the}
                </Select.Option>
              ))}
          </Select>
            </Form.Item>

            <Form.Item
              label="Mã sản phẩm"
              name="ma_san_pham"
                rules={[
                  { required: true, message: "Mã sản phẩm bắt buộc phải nhập!" },
                ]}
            >
              <Input
            placeholder="Nhập mã sản phẩm"
            addonAfter={
              <Button
                icon={<ReloadOutlined />}
                onClick={generateNewProductCode}
                type="link"
                style={{ padding: 0 }}
              />
            }
          />
            </Form.Item>
          </div>
          <div className="grid grid-cols-2 gap-5">
            {/* <Form.Item
          label="Ảnh nổi bật"
          name="feature_image"
          rules={[{ required: true, message: "Ảnh sản phẩm là bắt buộc!" }]}
        >
          <Upload
            listType="picture"
            fileList={fileList}
            onChange={({ fileList }: any) => setFileList(fileList)}
            beforeUpload={() => false}
            onPreview={() => {}}
          >
            <Button icon={<UploadOutlined />}>Upload</Button>
          </Upload>
        </Form.Item> */}
          </div>
          <Form.Item
            name="noi_dung"
            rules={[
              {
                required: true,
                message: "Please enter body of post",
              },
            ]}
          >
            {/* @ts-ignore */}
            <ReactQuill
              theme="snow"
              value={value}
              onChange={setValue}
              className="h-96"
            />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>{" "}
      </div>
    </main>
  );
};

export default AddProducts;
