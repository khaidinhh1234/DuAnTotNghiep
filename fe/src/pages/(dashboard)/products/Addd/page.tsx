import instance from "@/configs/admin";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import {
  Button,
  Checkbox,
  Empty,
  Form,
  Image,
  Input,
  Modal,
  Select,
  Upload,
  UploadFile,
} from "antd";
import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Link } from "react-router-dom";
const { TextArea } = Input;
type FieldType = {
  username?: string;
  password?: string;
  remember?: string;
};
export interface VariantType {
  type: "color" | "size";
  values: number[];
}
export interface Variant {
  id: string;
  mau_sac_id: number;
  kich_thuoc_id: number;
  gia_ban: string;
  gia_khuyen_mai: string;
  so_luong_bien_the: string;
  ngay_bat_dau_khuyen_mai: Date | null;
  ngay_ket_thuc_khuyen_mai: Date | null;
  anh_bien_the: UploadFile[];
}
const AddProducts: React.FC = () => {
  const [value, setValue] = useState("");
  const [productCode, setProductCode] = useState("");

  //Call API
  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await instance.get("/danhmuc");
      return response.data;
    },
  });
  const { data: tagsData } = useQuery({
    queryKey: ["tags"],
    queryFn: async () => {
      const response = await instance.get("/the");
      return response.data;
    },
  });
  const { data: mausac } = useQuery({
    queryKey: ["bienthemausac"],
    queryFn: async () => {
      const response = await instance.get("/bienthemausac");
      return response.data;
    },
  });
  const { data: kichthuoc } = useQuery({
    queryKey: ["bienthekichthuoc"],
    queryFn: async () => {
      const response = await instance.get("/bienthekichthuoc");
      return response.data;
    },
  });

  // tạo mã sản phẩm
  const [productCode, setProductCode] = useState("");
  const generateRandomCode = () => {
    const length = 8; // Độ dài mã khuyến mãi
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let randomCode = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomCode += characters.charAt(randomIndex);
    }

    setProductCode(randomCode); // Cập nhật voucherCode
  };
  useEffect(() => {
    generateRandomCode();
  }, []);

  const the = tagsData?.data;

  // Ảnh biến thể
  const [fileList, setFileList] = useState([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewTitle, setPreviewTitle] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const handlePreview = async (file: any) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as any);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const getBase64 = (file: any) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      <PlusOutlined />
    </button>
  );

  // Biến thể
  const [variants, setVariants] = useState<VariantType[]>([]);
  // console.log("Variants:", variants);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);

  const handleVariantChange = (value: string) => {
    setSelectedVariant(value);
  };
  const removeVariant = (index: number) => {
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };
  const addVariant = (value: "color" | "size") => {
    setVariants((prev) => {
      const variantExists = prev.some((v) => v.type === value);
      if (!variantExists) {
        return [...prev, { type: value, values: [] }];
      }
      return prev;
    });
  };
  const updateVariantValues = (index: number, values: number[]) => {
    setVariants((prev) =>
      prev.map((v, i) => (i === index ? { ...v, values } : v))
    );
  };
  const [fileLists, setFileLists] = useState<{ [key: number]: UploadFile[] }>(
    {}
  );
  const handleChange = (info: { fileList: UploadFile[] }, index: number) => {
    setFileLists((prev) => ({
      ...prev,
      [index]: info.fileList, // Lưu fileList cho từng biến thể
    }));
  };
  const generateVariantCombinations = () => {
    const colorVariant = variants.find((v) => v.type === "color")?.values || [];
    const sizeVariant = variants.find((v) => v.type === "size")?.values || [];

    const combinations = [];
    for (const color of colorVariant) {
      for (const size of sizeVariant) {
        combinations.push({ color, size });
      }
    }

    return combinations;
  };
  const combinations = generateVariantCombinations();

  // Call this when user selects variants
  // useEffect(() => {
  //   const selectedColors = mausac?.data || [];
  //   const selectedSizes = kichthuoc?.data || [];
  //   generateVariantRows(selectedColors, selectedSizes);
  // }, [mausac, kichthuoc]);

  const handleCancel = () => setPreviewVisible(false);
  const onFinish = (values: any) => {
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
                {categoriesData &&
                  categoriesData.data &&
                  categoriesData.data.map((category: any) => (
                    <Select.Option key={category.id} value={category.id}>
                      {category.ten_danh_muc}
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
            <Form.Item
              label="Chọn tags"
              name="tags"
              rules={[{ required: true, message: "Vui lòng chọn tags" }]}
            >
              <Select
                mode="multiple"
                className="w-full"
                placeholder="Chọn tags"
              >
                {the &&
                  the.map((tag: any) => (
                    <Select.Option key={tag.id} value={tag.id}>
                      {tag.ten_the}
                    </Select.Option>
                  ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="Mã sản phẩm"
              name="ma_san_pham"
              // rules={[
              //   { required: true, message: "Mã sản phẩm bắt buộc phải nhập!" },
              // ]}
              initialValue={productCode ? productCode : generateRandomCode}
            >
              {" "}
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Nhập mã sản phẩm"
                  value={"SP-" + productCode}
                />
                <Button onClick={generateRandomCode}>Đổi mã</Button>{" "}
              </div>
            </Form.Item>
          </div>
          <div className="grid grid-cols-2 gap-5 mb-5">
            <Form.Item
              label="Ảnh nổi bật"
              name="feature_image"
              rules={[{ required: true, message: "Ảnh sản phẩm là bắt buộc!" }]}
            >
              <Upload
                listType="picture"
                // fileList={fileList}
                // onChange={({ fileList }: any) => setFileList(fileList)}
                beforeUpload={() => false}
                onPreview={() => {}}
                maxCount={1}
                multiple
              >
                <Button icon={<UploadOutlined />}>Tải ảnh </Button>
              </Upload>
            </Form.Item>

            <Form.Item label="Giá tốt" name="gia_tot" valuePropName="checked">
              <Checkbox />
            </Form.Item>
          </div>
          <div className="grid grid-cols-1 gap-5 ">
            <Form.Item
              name="noi_dung"
              className=""
              rules={[
                {
                  required: true,
                  message: "Nội dung sản phẩm là bắt buộc!",
                },
              ]}
              initialValue={"Xin chào bạn đã đến với chúng tôi "}
            >
              {/* @ts-ignore */}
              <ReactQuill
                theme="snow"
                value={value}
                onChange={setValue}
                className="h-56"
              />
            </Form.Item>
          </div>
          <div className="mt-8 px-2">
            <h2 className="text-2xl font-semibold mb-4">
              Giá bán, Kho hàng và Biến thể
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Tạo biến thể nếu sản phẩm có hơn một tùy chọn, ví dụ như về kích
              thước hay màu sắc.
            </p>
            <div className="mb-6 flex gap-5 items-center">
              <label className="block text-md font-medium text-gray-700 mb-1">
                Thêm biến thể :
              </label>
              <Select
                style={{ width: 120 }}
                onSelect={addVariant}
                placeholder="Chọn biến thể"
              >
                <Select.Option value="color">Màu sắc</Select.Option>
                <Select.Option value="size">Kích thước</Select.Option>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-10 ">
              {variants?.map((variant, index) => (
                <div key={index} className="mb-6 bg-gray-50 p-4 rounded-md">
                  <h3 className="text-lg font-medium mb-2 flex justify-between items-center">
                    Biến thể{" "}
                    {variant.type === "color" ? "Màu sắc" : "Kích thước"}
                    <button
                      className="text-white text-xs hover:bg-red-700  bg-red-600 gap-1 px-2 py-1 rounded-md flex items-center"
                      onClick={() => removeVariant(index)}
                    >
                      <i className="fa-solid fa-trash-can" /> Xóa
                    </button>
                  </h3>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {variant.type === "color"
                        ? "Chọn màu sắc"
                        : "Chọn kích thước"}
                    </label>
                    <Select
                      mode="multiple"
                      style={{ width: "100%" }}
                      placeholder={`Chọn ${variant.type === "color" ? "màu sắc" : "kích thước"}`}
                      onChange={(values) => updateVariantValues(index, values)}
                      value={variant.values}
                    >
                      {variant.type === "color"
                        ? mausac?.data.map((color: any) => (
                            <Select.Option
                              key={color.id}
                              value={color.ten_mau_sac}
                            >
                              <div className="flex items-center">
                                <div
                                  className="w-4 h-4 rounded-full mr-2"
                                  style={{ backgroundColor: color.ma_mau_sac }}
                                />
                                {color.ten_mau_sac}
                              </div>
                            </Select.Option>
                          ))
                        : kichthuoc.data.map((size: any) => (
                            <Select.Option
                              key={size.id}
                              value={size.kich_thuoc}
                            >
                              {size.ten_kich_thuoc}
                            </Select.Option>
                          ))}
                    </Select>
                  </div>
                </div>
              ))}
            </div>
            {/* <Select
              mode="multiple"
              allowClear
              style={{ width: "100%" }}
              placeholder="Please select"
              defaultValue={["a10", "c12"]}
              // onChange={handleChange}
              // options={options}
            /> */}
          </div>
          <div className="p-4">
            <h2 className="text-xl font-bold ">Giá bán & Kho hàng</h2>
            <div className="mt-4 overflow-x-auto shadow-md">
              <table className="w-full max-w-full table-auto bg-white rounded-lg  border border-gray-300">
                <thead>
                  <tr className="bg-gray-100 border-b border-gray-300 text-center">
                    <th className="p-1 border-r border-gray-300">Kích thước</th>
                    <th className="p-1 border-r border-gray-300">Màu sắc</th>
                    <th className="p-1 border-r border-gray-300">Giá bán</th>
                    <th className="p-1 border-r border-gray-300">
                      Giá khuyến mãi
                    </th>
                    <th className="p-1 border-r border-gray-300">Số lượng</th>
                    <th className="p-1">Ảnh biến thể</th>
                  </tr>
                </thead>
                <tbody>
                  {combinations &&
                    combinations.map((combo, index) => (
                      <tr className="border-t border-gray-300 text-center">
                        <td className="p-1 border-r border-gray-300 text-center">
                          {" "}
                          {combo.size}
                        </td>
                        <td className="p-1 border-r border-gray-300 text-center">
                          {combo.color}
                        </td>
                        <td className="p-1 border-r border-gray-300 w-[20%]">
                          <Form.Item
                            name={`gia_ban-${index}`}
                            className="my-0 px-5"
                            rules={[
                              {
                                required: true,
                                message: "Vui lòng nhập giá bán!",
                              },
                            ]}
                          >
                            <Input
                              placeholder="0"
                              style={{ padding: "5px 10px" }}
                            />
                          </Form.Item>
                        </td>
                        <td className="p-1 border-r border-gray-300 w-[20%]">
                          <Form.Item
                            name={`gia_khuyen_mai-${index}`}
                            className="my-0 px-5"
                            rules={[
                              {
                                required: true,
                                message: "Vui lòng nhập giá khuyến mãi!",
                              },
                            ]}
                            style={{ margin: 0 }}
                          >
                            <Input
                              placeholder="0"
                              style={{ padding: "5px 10px" }}
                            />
                          </Form.Item>
                        </td>
                        <td className="p-1 border-r border-gray-300 w-[20%]">
                          <Form.Item
                            name={`so_luong_bien_the-${index}`}
                            className="my-0 px-5"
                            rules={[
                              {
                                required: true,
                                message: "Vui lòng nhập số lượng!",
                              },
                            ]}
                            style={{ margin: 0 }}
                          >
                            <Input
                              placeholder="0"
                              style={{ padding: "5px 10px" }}
                            />
                          </Form.Item>
                        </td>
                        <td className="p-1">
                          <Form.Item
                            name={`anh_bien_the-${index}`}
                            valuePropName="fileList"
                            getValueFromEvent={(e) => e.fileList}
                            className="my-0 flex justify-center"
                          >
                            <Upload
                              action="https://api.cloudinary.com/v1_1/dpypwbeis/image/upload"
                              data={{ upload_preset: "ml_default" }}
                              listType="picture-card"
                              fileList={fileLists[index] || []} // Sử dụng fileList theo index
                              onPreview={handlePreview}
                              onChange={(info: any) =>
                                handleChange(info, index)
                              } // Cập nhật fileList
                              maxCount={5}
                              multiple
                              className={`custom-upload mx-auto ${
                                (fileLists[index] && fileLists[index].length) >=
                                3
                                  ? "w-[200px]"
                                  : "w-auto"
                              }`}
                            >
                              {(fileLists[index] && fileLists[index].length) >=
                              5
                                ? null
                                : uploadButton}
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
                            )}
                            <Modal
                              visible={previewVisible}
                              title={previewTitle}
                              footer={null}
                              onCancel={handleCancel}
                            >
                              <img alt="Ảnh biến thể" src={previewImage} />
                            </Modal>
                          </Form.Item>
                        </td>
                      </tr>
                    ))}
                </tbody>{" "}
              </table>{" "}
              {combinations.length === 0 && (
                <div className="border border-gray-300 text-center mx-auto">
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    className="mx-auto"
                  />
                </div>
              )}
            </div>
          </div>{" "}
          <div className="mt-10">
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </div>
        </Form>{" "}
      </div>
    </main>
  );
};

export default AddProducts;
