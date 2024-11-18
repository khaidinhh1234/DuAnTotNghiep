import instance from "@/configs/admin";
import { uploadToCloudinary } from "@/configs/cloudinary";
import { PlusOutlined } from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  Empty,
  Form,
  Image,
  Input,
  InputNumber,
  Modal,
  Select,
  Switch,
  Upload,
  UploadFile,
  message,
} from "antd";
import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Link, useNavigate } from "react-router-dom";
import CategorySelect from "../../../../components/CategorySelect";
import AddCategorySelect from "@/components/AddCaterogySelect";
const { TextArea } = Input;

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
  const [variants, setVariants] = useState<VariantType[]>([]);
  const [fileLists, setFileLists] = useState<{ [key: number]: UploadFile[] }>(
    {}
  );
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewTitle, setPreviewTitle] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [productImage, setProductImage] = useState("");
  const [selectedSizeType, setSelectedSizeType] = useState<string | null>(null);
  const [sizeValues, setSizeValues] = useState<number[]>([]);
  const [combinations, setCombinations] = useState<any[]>([]);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  // const [isSubmitting, setIsSubmitting] = useState(false);

  const queryClient = useQueryClient();
  const sizeTypeLabels: { [key: string]: string } = {
    nam: "Nam",
    nu: "Nữ",
    tre_em: "Trẻ Em",
  };
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
      const response = await instance.get("/bosuutap");
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
  const the = tagsData?.data;

  const addProductMutation = useMutation({
    mutationFn: (newProduct: any) => instance.post("/sanpham", newProduct),
    onSuccess: () => {
      message.success("Thêm sản phẩm thành công");
      queryClient.invalidateQueries({ queryKey: ["products"] });
      navigate("/admin/products");
    },
    onError: (error) => {
      message.error("Có lỗi xảy ra khi thêm sản phẩm");
      console.error("Error adding product:", error);
    },
  });

  const generateRandomCode = () => {
    const length = 8;
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let randomCode = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomCode += characters.charAt(randomIndex);
    }
    setProductCode(randomCode);
  };

  useEffect(() => {
    generateRandomCode();
  }, []);

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as File);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewVisible(true);
    setPreviewTitle(
      file.name || file.url!.substring(file.url!.lastIndexOf("/") + 1)
    );
  };

  const getBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      <PlusOutlined />
    </button>
  );
  const removeVariant = (index: number) => {
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  const addVariant = (value: "color" | "size") => {
    setVariants((prev) => {
      const variantExists = prev.some((v) => v.type === value);
      if (!variantExists) {
        return [
          ...prev,
          { type: value, values: [], sizeType: selectedSizeType || undefined },
        ];
      }
      return prev;
    });
  };
  const groupSizesByType = (sizes: any[]) => {
    return sizes.reduce((acc, size) => {
      if (!acc[size.loai_kich_thuoc]) {
        acc[size.loai_kich_thuoc] = [];
      }
      acc[size.loai_kich_thuoc].push(size);
      return acc;
    }, {});
  };

  const handleSizeTypeChange = (value: string) => {
    if (sizeValues.length === 0) {
      setSelectedSizeType(value);
      setVariants((prev) =>
        prev.map((v) =>
          v.type === "size" ? { ...v, values: [], sizeType: value } : v
        )
      );
    } else {
      message.warning(
        "Bạn đã chọn kích thước. Hãy xóa kích thước hiện tại trước khi chọn loại mới."
      );
    }
  };

  const updateVariantValues = (index: number, values: number[]) => {
    setVariants((prev) =>
      prev.map((v, i) => {
        if (i === index) {
          if (v.type === "size") {
            setSizeValues(values);
            return { ...v, values };
          }
          return { ...v, values };
        }
        return v;
      })
    );
  };

  const handleChange = (info: { fileList: UploadFile[] }, index: number) => {
    setFileLists((prev) => ({
      ...prev,
      [index]: info.fileList,
    }));
  };

  const generateVariantCombinations = () => {
    const colorVariant = variants.find((v) => v.type === "color")?.values || [];
    const sizeVariant = variants.find((v) => v.type === "size")?.values || [];

    const newCombinations = [];
    for (const color of colorVariant) {
      for (const sizeId of sizeVariant) {
        const sizeData = kichthuoc.data.find((s: any) =>
          s.id === sizeId &&
          s.loai_kich_thuoc === selectedSizeType
        );

        if (sizeData) {
          newCombinations.push({
            color,
            size: sizeData.kich_thuoc,
            sizeId: sizeData.id,
            sizeType: sizeData.loai_kich_thuoc
          });
        }
      }
    }
    setCombinations(newCombinations);
  };

  useEffect(() => {
    generateVariantCombinations();
  }, [variants]);

  const handleCancel = () => setPreviewVisible(false);

  const onFinish = async (values: any) => {
    try {
      let imageUrl = productImage;

      if (values.anh_san_pham && values.anh_san_pham.length > 0) {
        const file = values.anh_san_pham[0].originFileObj;
        if (file) {
          imageUrl = await uploadToCloudinary(file);
        }
      }

      const productData = {
        ten_san_pham: values.ten_san_pham,
        anh_san_pham: imageUrl,
        ma_san_pham: "SP-" + productCode,
        mo_ta_ngan: values.mo_ta_ngan,
        noi_dung: value,
        danh_muc_id: values.danh_muc_id,
        gia_tot: values.gia_tot ? 1 : 0,
        bo_suu_tap: values.tags,
        bien_the: combinations.map((combo, index) => ({
          mau_sac_id: mausac?.data.find((c: any) => c.ten_mau_sac === combo.color)?.id,
          kich_thuoc_id: combo.sizeId,
          so_luong_bien_the: parseInt(values[`so_luong_bien_the-${index}`], 10),
          gia_ban: parseFloat(values[`gia_ban-${index}`]),
          chi_phi_san_xuat: parseFloat(values[`chi_phi_san_xuat-${index}`]),
          gia_khuyen_mai: parseFloat(values[`gia_khuyen_mai-${index}`]),
          anh: fileLists[index]?.map((file: any) => file.response?.url) || [],
        })),
      };

      addProductMutation.mutate(productData);
      console.log("Success:", productData);
    } catch (error) {
      console.error("Error uploading image:", error);
      message.error("Có lỗi xảy ra khi tải ảnh lên");
    }
  };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="md:text-base">
          Quản trị / Sản phẩm /
          <span className="font-semibold px-px"> Thêm sản phẩm</span>
        </h1>
      </div>
      <div className="flex items-center justify-between">
        <h1 className="font-semibold md:text-3xl">Thêm sản phẩm</h1>
        <div>
          <Link to="/admin/products" className="mr-1">
            <Button className="bg-gradient-to-r  from-blue-500 to-blue-400 text-white rounded-lg py-1 hover:bg-blue-600 shadow-md transition-colors">
              Quay lại
            </Button>
          </Link>
        </div>
      </div>
      <div className="bg-white p-3">
        <Form
          form={form}
          name="basic"
          layout="vertical"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 24 }}
          style={{ maxWidth: "100%" }}
          className="mx-10 my-5"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <div className="grid grid-cols-2 gap-5">
            <Form.Item
              className="block text-md font-medium text-gray-700 mt-2 mb-1"
              label="Tên sản phẩm"
              name="ten_san_pham"
              rules={[
                { required: true, message: "Tên sản phẩm bắt buộc phải nhập!" },
              ]}
            >
              <Input placeholder="Nhập tên sản phẩm" />
            </Form.Item>
            {/* <Form.Item
            className="block text-md font-medium text-gray-700 mt-2 mb-1"
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
          {/* <CategorySelect categoriesData={categoriesData} /> */}
            {/* </Form.Item>  */}
            <Form.Item
              className="block text-md font-medium mt-2 text-gray-700 mb-1"
              label="Danh mục sản phẩm"
              name="danh_muc_id"
              rules={[{ required: true, message: "Vui lòng chọn danh mục" }]}
            >
              <CategorySelect
                categoriesData={categoriesData}
                onChange={(value) => {
                  console.log("Category selected:", value);
                  form.setFieldsValue({ danh_muc_id: value });
                }}
              />
            </Form.Item>
          </div>{" "}
          <div className="grid grid-cols-1 gap-5">
            <Form.Item
              className="block text-md font-medium mt-2 text-gray-700 mb-1"
              label="Mô tả ngắn"
              name="mo_ta_ngan"
              rules={[
                { required: true, message: "Mô tả ngắn bắt buộc phải nhập!" },
                { max: 225, message: "Mô tả ngắn không được vượt quá 225 ký tự!" },

              ]}
            >
              <TextArea rows={5} placeholder="Nhập mô tả sản phẩm" />
            </Form.Item>
          </div>
          <div className="grid grid-cols-2 gap-5">
            <Form.Item
              className="block text-md font-medium mt-2 text-gray-700 mb-1"
              label="Chọn bộ sưu tập"
              name="tags"
              // rules={[{ required: true, message: "Vui lòng chọn bộ sưu tập" }]}
            >
              <Select
                mode="multiple"
                className="w-full"
                placeholder="Chọn bộ sưu tập"
              >
                {the &&
                  the.map((tag: any) => (
                    <Select.Option key={tag.id} value={tag.id}>
                      {tag.ten}
                    </Select.Option>
                  ))}
              </Select>
            </Form.Item>

            <Form.Item
              className="block text-md font-medium mt-2 text-gray-700 mb-1"
              label="Mã sản phẩm"
              name="ma_san_pham"
            >
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Nhập mã sản phẩm"
                  value={"SP-" + productCode}
                  readOnly
                />
                <Button onClick={generateRandomCode}>Đổi mã</Button>
              </div>
            </Form.Item>
          </div>
          <div className="grid grid-cols-2 gap-5 mb-5">
            <Form.Item
              className="block text-md font-medium mt-2 text-gray-700 mb-1"
              label="Ảnh nổi bật"
              name="anh_san_pham"
              rules={[{ required: true, message: "Ảnh sản phẩm là bắt buộc!" }]}
              valuePropName="fileList"
              getValueFromEvent={(e) => {
                if (Array.isArray(e)) {
                  return e;
                }
                return e && e.fileList;
              }}
            >
              <Upload
                listType="picture-card"
                fileList={fileList}
                beforeUpload={(file) => {
                  const isImage = file.type.startsWith("image/");
                  if (!isImage) {
                    message.error("Bạn chỉ có thể tải lên file ảnh!");
                  }
                  return false; // Prevent default upload
                }}
                onChange={({ fileList: newFileList }) => {
                  setFileList(newFileList);
                  if (newFileList.length > 0) {
                    const file = newFileList[0].originFileObj;
                    if (file instanceof File) {
                      setProductImage(URL.createObjectURL(file));
                    }
                  } else {
                    setProductImage("");
                  }
                }}
                onPreview={handlePreview}
                maxCount={1}
              >
                {fileList.length >= 1 ? null : uploadButton}
              </Upload>
            </Form.Item>
            {/* <Form.Item
      label="Ảnh nổi bật"
      name="anh_san_pham"
      rules={[{ required: true, message: "Ảnh sản phẩm là bắt buộc!" }]}
      valuePropName="fileList"
      getValueFromEvent={(e) => {
        if (Array.isArray(e)) {
          return e;
        }
        return e && e.fileList;
      }}
    >
      <Upload
        listType="picture-card"
        fileList={fileList}
        beforeUpload={(file) => {
          const isImage = file.type.startsWith('image/');
          if (!isImage) {
            message.error('Bạn chỉ có thể tải lên file ảnh!');
          }
          return false; // Prevent default upload
        }}
        onChange={({ fileList: newFileList }) => {
          setFileList(newFileList);
        }}
        onPreview={handlePreview}
        maxCount={1}
      >
        {fileList.length >= 1 ? null : (
          <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
          </div>
        )}
      </Upload>
      <Modal
        visible={previewVisible}
        title={previewTitle}
        footer={null}
        onCancel={handleCancel}
      >
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </Form.Item> */}
            {/* <Form.Item 
            className="block text-md font-medium mt-2 text-gray-700 mb-1"
            label="Giá tốt" name="gia_tot" valuePropName="checked">
            <Checkbox />
          </Form.Item> */}
            <Form.Item
              className="block text-md font-medium mt-2 text-gray-700 mb-1"
              label="Giá tốt"
              name="gia_tot"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
          </div>
          <div className="grid grid-cols-1 gap-5 ">
            <Form.Item
              name="noi_dung"
              className="block text-md font-medium mt-2 text-gray-700 mb-1"
              label="Nội dung sản phẩm"
              rules={[
                {
                  required: true,
                  message: "Nội dung sản phẩm là bắt buộc!",
                },
              ]}
              initialValue={"Xin chào bạn đã đến với chúng tôi "}
            >
              <ReactQuill
                theme="snow"
                value={value}
                onChange={setValue}
                className="h-56"
              />
            </Form.Item>
          </div>
          <div className="mt-8">
            <h2 className="text-2xl pt-8 font-semibold mb-4 ">
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
                      className="text-white text-xs hover:bg-red-500 bg-red-400 gap-1 px-2 py-1 rounded-md flex items-center"
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
                    {variant.type === "size" ? (
                      <>
                        <Select
                          style={{ width: "100%", marginBottom: "10px" }}
                          placeholder="Chọn loại kích thước"
                          onChange={handleSizeTypeChange}
                          value={selectedSizeType}
                        >
                          {Object.keys(groupSizesByType(kichthuoc.data)).map(
                            (type) => (
                              <Select.Option key={type} value={type}>
                                {sizeTypeLabels[type] || type}
                              </Select.Option>
                            )
                          )}
                        </Select>
                        {selectedSizeType && (
                          <Select
                            mode="multiple"
                            style={{ width: "100%" }}
                            placeholder="Chọn kích thước"
                            onChange={(values) =>
                              updateVariantValues(index, values)
                            }
                            value={variant.values}
                          >
                            {groupSizesByType(kichthuoc.data)[
                              selectedSizeType
                            ].map((size: any) => (
                              <Select.Option key={size.id} value={size.id}>
                                {size.kich_thuoc}
                              </Select.Option>
                            ))}
                          </Select>
                        )}
                      </>
                    ) : (
                      <Select
                        mode="multiple"
                        style={{ width: "100%" }}
                        placeholder="Chọn màu sắc"
                        onChange={(values) =>
                          updateVariantValues(index, values)
                        }
                        value={variant.values}
                      >
                        {mausac?.data.map((color: any) => (
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
                        ))}
                      </Select>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="p-0">
            <h2 className="text-xl font-bold ">Giá bán & Kho hàng</h2>
            <div className="mt-4 overflow-x-auto shadow-md">
              <table className="w-full max-w-full table-auto bg-white rounded-lg  border border-gray-300">
                <thead>
                  <tr className="bg-gray-100 border-b border-gray-300 text-center">
                    <th className="p-1 border-r border-gray-300">Kích thước</th>
                    <th className="p-1 border-r border-gray-300">Màu sắc</th>
                    <th className="p-1 border-r border-gray-300">Giá bán</th>
                    <th className="p-1 border-r border-gray-300">
                      Chi phí sản xuất
                    </th>

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
                      <tr         key={`${combo.color}-${combo.sizeId}-${index}`} 
                      className="border-t border-gray-300 text-center">
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
                          //   rules={[
                          //     {
                          //       required: true,
                          //       message: "Vui lòng nhập giá bán!",
                          //     },
                          //     {
                          //       type: "number",
                          //       min: 1000,
                          //       message: "Giá bán phải lớn hơn hoặc bằng 1000!",
                          //     },
                          //     {
                          //       validator: (_, value) => {
                          //         const chiPhiSanXuat = form.getFieldValue(
                          //           `chi_phi_san_xuat-${index}`
                          //         );
                          //         if (
                          //           value &&
                          //           chiPhiSanXuat &&
                          //           value < chiPhiSanXuat
                          //         ) {
                          //           return Promise.reject(
                          //             "Giá bán phải lớn hơn hoặc bằng chi phí sản xuất!"
                          //           );
                          //         }
                          //         if (
                          //           value &&
                          //           chiPhiSanXuat &&
                          //           value > chiPhiSanXuat * 1.5
                          //         ) {
                          //           return Promise.reject(
                          //             "Giá bán không được vượt quá 150% giá sản xuất!"
                          //           );
                          //         }
                          //         return Promise.resolve();
                          //       },
                          //     },
                          //   ]}
                          // >
                          //   <InputNumber
                          //     style={{ width: "100%" }}
                          //     min={1000}
                          //     max={2000000}
                          //     placeholder="Nhập giá bán"
                          //   />
                          rules={[
                            { required: true, message: "Vui lòng nhập giá bán!" },
                            { type: "number", min: 1000, message: "Giá bán phải lớn hơn hoặc bằng 1000!" },
                          ]}
                        >
                          <InputNumber style={{ width: "100%" }} placeholder="Nhập giá bán" />
                          </Form.Item>
                        </td>

                        <td className="p-1 border-r border-gray-300 w-[20%]">
                          <Form.Item
                            name={`chi_phi_san_xuat-${index}`}
                            className="my-0 px-5"
                            rules={[
                              {
                                required: true,
                                message: "Vui lòng nhập chi phí sản xuất!",
                              },
                              {
                                type: "number",
                                min: 1000,
                                message: "Chi phí sản xuất phải lớn hơn 1000!",
                              },
                              {
                                validator: (_, value) => {
                                  const giaBan = form.getFieldValue(
                                    `gia_ban-${index}`
                                  );
                                  if (value && giaBan && value >= giaBan) {
                                    return Promise.reject(
                                      "Chi phí sản xuất phải nhỏ hơn giá bán!"
                                    );
                                  }
                                  return Promise.resolve();
                                },
                              },
                            ]}
                            style={{ margin: 0 }}
                          >
                            <InputNumber
                              placeholder="0"
                              style={{ width: "100%" }}
                              min={1000}
                              max={2000000}
                            />
                          </Form.Item>
                        </td>

                        {/* <td className="p-1 border-r border-gray-300 w-[20%]">
                        <Form.Item
                          name={`gia_khuyen_mai-${index}`}
                          className="my-0 px-5"
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng nhập giá khuyến mãi!",
                            },
                            {
                              validator: (_, value) => {
                                const giaBan = form.getFieldValue(`gia_ban-${index}`);
                                if (value && giaBan && value >= giaBan) {
                                  return Promise.reject("Giá khuyến mãi phải nhỏ hơn giá bán!");
                                }
                                return Promise.resolve();
                              },
                            },
                          ]}
                          style={{ margin: 0 }}
                        >
                          <InputNumber
                            placeholder="0"
                            style={{ width: "100%" }}
                            min={0}
                          />
                        </Form.Item>

                      </td> */}
                        <td className="p-1 border-r border-gray-300 w-[20%]">
                          <Form.Item
                            name={`gia_khuyen_mai-${index}`}
                            className="my-0 px-5"
                            rules={[
                              {
                                validator: (_, value) => {
                                  const giaBan = form.getFieldValue(
                                    `gia_ban-${index}`
                                  );
                                  if (
                                    value === undefined ||
                                    value === null ||
                                    value === ""
                                  ) {
                                    // Cho phép không nhập gì
                                    return Promise.resolve();
                                  }
                                  if (giaBan) {
                                    const giaToiThieu = giaBan * 0.8; // 80% giá bán
                                    if (value < giaToiThieu) {
                                      return Promise.reject(
                                        new Error(
                                          `Giá khuyến mãi không được nhỏ hơn 80% giá bán (tối thiểu ${giaToiThieu.toFixed(
                                            0
                                          )})!`
                                        )
                                      );
                                    }
                                    if (value > giaBan) {
                                      return Promise.reject(
                                        new Error(
                                          "Giá khuyến mãi không được lớn hơn giá bán!"
                                        )
                                      );
                                    }
                                  }
                                  return Promise.resolve();
                                },
                              },
                            ]}
                          >
                            <InputNumber
                              placeholder="Nhập giá khuyến mãi"
                              style={{ width: "100%" }}
                              min={0}
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
                              {
                                type: "number",
                                min: 0,
                                message: "Số lượng phải lớn hơn âm!",
                              },
                              {
                                validator: (_, value) =>
                                  value && isNaN(value)
                                    ? Promise.reject("Số lượng phải là một số!")
                                    : Promise.resolve(),
                              },
                            ]}
                            style={{ margin: 0 }}
                          >
                            <InputNumber
                              placeholder="Nhập số lượng"
                              style={{ width: "100%" }}
                              min={0}
                              max={100000}
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
                              action="https://api.cloudinary.com/v1_1/dpundwxg1/image/upload"
                              data={{ upload_preset: "upload" }}
                              listType="picture-card"
                              fileList={fileLists[index] || []}
                              onPreview={handlePreview}
                              onChange={(info: any) =>
                                handleChange(info, index)
                              }
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
              <Button
                type="primary"
                htmlType="submit"
                loading={addProductMutation.isPending}
                className="bg-gradient-to-r  from-blue-500 to-blue-400 text-white rounded-lg py-1 hover:bg-blue-600 shadow-md transition-colors ml-12"
                style={{
                  padding: "14px 50px",
                  marginRight: "190px",
                }}
              >
                {" "}
                Thêm sản phẩm
              </Button>
            </Form.Item>
          </div>
          <Modal
            visible={previewVisible}
            title={previewTitle}
            footer={null}
            onCancel={handleCancel}
          >
            <img alt="example" style={{ width: "100%" }} src={previewImage} />
          </Modal>
        </Form>
      </div>
    </main>
  );
};

export default AddProducts;
