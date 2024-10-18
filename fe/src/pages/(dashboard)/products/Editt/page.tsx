
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Form,
  Input,
  Button,
  Select,
  Upload,
  message,
  InputNumber,
  Empty,
  Modal,
  Spin,
  Switch,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import instance from "@/configs/admin";
import { uniqBy } from "lodash";
import { uploadToCloudinary } from "@/configs/cloudinary";
import CategorySelect from '../../../../components/CategorySelect';


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
  anh_bien_the: any[];
}

const EditProducts: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { id } = useParams<{ id: string }>();
  const [value, setValue] = useState("");
  const [productCode, setProductCode] = useState("");
  const [variants, setVariants] = useState<VariantType[]>([]);
  const [fileLists, setFileLists] = useState<{ [key: string]: any[] }>({});  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [productImage, setProductImage] = useState("");
  const [selectedSizeType, setSelectedSizeType] = useState<string | null>(null);
  const [combinations, setCombinations] = useState<any[]>([]);
  const [productImageList, setProductImageList] = useState<any[]>([]);



  const sizeTypeLabels: { [key: string]: string } = {
    nam: "Nam",
    nu: "Nữ",
    tre_em: "Trẻ Em",
  };

  const { data: productData, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const response = await instance.get(`/sanpham/${id}`);
      return response.data;
    },
  });

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

  const updateProductMutation = useMutation({
    mutationFn: (updatedProduct: any) => instance.put(`/sanpham/${id}`, updatedProduct),
    onSuccess: () => {
      message.success("Cập nhật sản phẩm thành công");
      queryClient.invalidateQueries({ queryKey: ["products"] });
      navigate("/admin/products");
    },
    onError: (error) => {
      message.error("Có lỗi xảy ra khi cập nhật sản phẩm");
      console.error("Error updating product:", error);
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
  const handlePreview = async (file: any) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setPreviewImage(file.url || file.preview);
    setPreviewVisible(true);
    setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
  };

  const handleCancel = () => setPreviewVisible(false);

  const handleRemove = () => {
    setProductImage("");
    message.success("Ảnh sản phẩm đã được xóa");
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

  const removeVariant = (index: number) => {
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  const addVariant = (value: "color" | "size") => {
    setVariants((prev) => {
      const variantExists = prev.some((v) => v.type === value);
      if (!variantExists) {
        return [...prev, { type: value, values: [], sizeType: selectedSizeType || undefined }];
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
    const sizeVariant = variants.find((v) => v.type === 'size');
    if (!sizeVariant || sizeVariant.values.length === 0) {
      setSelectedSizeType(value);
      setVariants((prev) =>
        prev.map((v) => (v.type === 'size' ? { ...v, values: [], sizeType: value } : v))
      );
    } else {
      message.warning("Bạn đã chọn kích thước. Hãy xóa kích thước hiện tại trước khi chọn loại mới.");
    }
  };

  const updateVariantValues = (index: number, values: number[]) => {
    setVariants((prev) =>
      prev.map((v, i) => {
        if (i === index) {
          return { ...v, values };
        }
        return v;
      })
    );
  };

  const handleChange = (info: { fileList: any[] }, index: number) => {
    setFileLists((prev: any) => ({
      ...prev,
      [index]: info.fileList,
    }));
  };

  const generateVariantCombinations = () => {
    const colorVariant = variants.find((v) => v.type === "color")?.values || [];
    const sizeVariant = variants.find((v) => v.type === "size")?.values || [];
  
    const newCombinations = [];
    for (const colorId of colorVariant) {
      for (const sizeId of sizeVariant) {
        const colorData = mausac?.data.find((c: any) => c.id === colorId);
        const sizeData = kichthuoc?.data.find((s: any) => s.id === sizeId);
        newCombinations.push({
          color: colorId,
          size: sizeId,
          colorName: colorData?.ten_mau_sac,
          sizeName: sizeData?.kich_thuoc,
          sizeType: sizeData?.loai_kich_thuoc
        });
      }
    }
  
    setCombinations(newCombinations);
  };

  useEffect(() => {
    generateVariantCombinations();
  }, [variants, mausac, kichthuoc]);

  useEffect(() => {
    console.log("productImage:", productImage);
    console.log("productImageList:", productImageList);
  }, [productImage, productImageList]);
  useEffect(() => {
    if (productData && productData.data) {
      form.setFieldsValue({
        ten_san_pham: productData.data.ten_san_pham,
        danh_muc_id: productData.data.danh_muc_id,
        mo_ta_ngan: productData.data.mo_ta_ngan,
        tags: productData.data.bo_suu_tap_san_pham.map((tag: any) => tag.id),
        gia_tot: productData.data.gia_tot === 1,
        noi_dung: productData.data.noi_dung,
      });

      setProductCode(productData.data.ma_san_pham?.replace("SP-", "") || '');
      setProductImage(productData.data.anh_san_pham || '');

 
      if (productData.data.anh_san_pham) {
        setProductImageList([{
          uid: "-1",
          name: "product-image.png",
          status: "done",
          url: productData.data.anh_san_pham,
        }]);
      } else {
        setProductImageList([]);
      }

      if (productData.data.bien_the_san_pham && productData.data.bien_the_san_pham.length > 0) {
        const colors = new Set<number>();
        const sizes = new Set<number>();
        let sizeType: string | null = null;
  
        productData.data.bien_the_san_pham.forEach((v: any) => {
          if (v.mau_bien_the && v.mau_bien_the.id) colors.add(v.mau_bien_the.id);
          if (v.kich_thuoc_bien_the && v.kich_thuoc_bien_the.id) {
            sizes.add(v.kich_thuoc_bien_the.id);
            if (!sizeType && v.kich_thuoc_bien_the.loai_kich_thuoc) {
              sizeType = v.kich_thuoc_bien_the.loai_kich_thuoc;
            }
          }
        });
  
        setVariants([
          { type: 'color', values: Array.from(colors) },
          { type: 'size', values: Array.from(sizes) }
        ]);
  
        setSelectedSizeType(sizeType);
    
        const newCombinations = productData.data.bien_the_san_pham.map((v: any) => ({
          id: `${v.bien_the_mau_sac_id || v.mau_sac_id}-${v.bien_the_kich_thuoc_id || v.kich_thuoc_id}`,
          color: Number(v.bien_the_mau_sac_id || v.mau_sac_id),
          size: Number(v.bien_the_kich_thuoc_id || v.kich_thuoc_id),
          gia_ban: v.gia_ban,
          chi_phi_san_xuat: v.chi_phi_san_xuat,
          gia_khuyen_mai: v.gia_khuyen_mai,
          so_luong_bien_the: v.so_luong_bien_the,
          anh_bien_the: v.anh_bien_the
            ? uniqBy(v.anh_bien_the, 'duong_dan_anh').map((img: any) => ({
                uid: img.id.toString(),
                name: `image-${img.id}.png`,
                status: "done",
                url: img.duong_dan_anh,
              }))
            : [],
        }));
        setCombinations(newCombinations);
        
        const newFileLists: any = {};
        newCombinations.forEach((combo: any, index: number) => {
          newFileLists[index] = combo.anh_bien_the;
        });
        setFileLists(newFileLists);
      }
    }
  }, [productData, form]);

  const onFinish = async (values: any) => {
    const isValid = combinations.every((combo, index) => {
      return (
        combo.color &&
        combo.size &&
        fileLists[index] &&
        fileLists[index].length > 0
      );
    });

    if (!isValid) {
      message.error('Vui lòng chọn màu sắc, kích thước và tải lên ít nhất một ảnh cho mỗi biến thể.');
      return;
    }
    try {
      let productImageUrl = productImage; // Use the existing image URL by default
  
      if (productImageList.length > 0 && productImageList[0].originFileObj) {
        // Only upload if there's a new file
        const file = productImageList[0].originFileObj;
        productImageUrl = await uploadToCloudinary(file);
      }
  
      const updatedCombinations = await Promise.all(combinations.map(async (combo, index) => {
        const variantImages = fileLists[index] || [];
        const uploadedUrls = await Promise.all(
          variantImages.map(async (file: any) => {
            if (file.originFileObj) {
              return await uploadToCloudinary(file.originFileObj);
            }
            return file.url; 
          })
        );
  
        return {
          ...combo,
          anh: uploadedUrls,
        };
      }));
  
      const updatedProductData = {
        ten_san_pham: values.ten_san_pham,
        anh_san_pham: productImageUrl,
        ma_san_pham: "SP-" + productCode,
        mo_ta_ngan: values.mo_ta_ngan,
        noi_dung: value,
        danh_muc_id: values.danh_muc_id,
        gia_tot: values.gia_tot ? 1 : 0,
        bo_suu_tap: values.tags,
        bien_the: updatedCombinations.map((combo, index) => ({
          mau_sac_id: combo.color,
          kich_thuoc_id: combo.size,
          so_luong_bien_the: parseInt(values[`so_luong_bien_the-${index}`], 10),
          gia_ban: parseFloat(values[`gia_ban-${index}`]),
          chi_phi_san_xuat: parseFloat(values[`chi_phi_san_xuat-${index}`]),
          gia_khuyen_mai: parseFloat(values[`gia_khuyen_mai-${index}`]),
          anh: combo.anh,
        })),
      };
  
      updateProductMutation.mutate(updatedProductData);
    } catch (error) {
      console.error('Error during form submission:', error);
      message.error('An error occurred while submitting the form. Please try again.');
    }
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center mt-[250px]">
        <Spin size="large" />
      </div>
    );

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="md:text-base">
          Quản trị / Sản phẩm /
          <span className="font-semibold px-px"> Chỉnh sửa sản phẩm</span>
        </h1>
      </div>
      <div className="flex items-center justify-between">
        <h1 className="font-semibold md:text-3xl">Chỉnh sửa sản phẩm</h1>
        <div>
          <Link to="/admin/products" className="mr-1">
            <Button className="bg-gradient-to-r from-blue-500 to-blue-400 text-white rounded-lg py-1 hover:bg-blue-600 shadow-md transition-colors">
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
              label="Tên sản phẩm"
              name="ten_san_pham"
              rules={[
                { required: true, message: "Tên sản phẩm bắt buộc phải nhập!" },
              ]}
            >
              <Input placeholder="Nhập tên sản phẩm" />
            </Form.Item>
            {/* <Form.Item
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
            </Form.Item> */}
            <Form.Item
  label="Danh mục sản phẩm"
  name="danh_muc_id"
  rules={[{ required: true, message: "Vui lòng chọn danh mục" }]}
>
  <CategorySelect 
    categories={categoriesData?.data || []} 
    onChange={(value: any) => form.setFieldsValue({ danh_muc_id: value })}
  />
</Form.Item>
          </div>
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
              label="Chọn bộ sưu tập"
              name="tags"
              // rules={[{ required: true, message: "Vui lòng chọn bộ sưu tập" }]}
            >
              <Select
                mode="multiple"
                className="w-full"
                placeholder="Chọn bộ sưu tập"
              >
                {tagsData &&
                  tagsData.data &&
                  tagsData.data.map((tag: any) => (
                    <Select.Option key={tag.id} value={tag.id}>
                      {tag.ten}
                    </Select.Option>
                  ))}
              </Select>
            </Form.Item>
            <Form.Item label="Mã sản phẩm" name="ma_san_pham">
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Nhập mã sản phẩm"
                  value={"SP-" + productCode}
                  readOnly
                  disabled
                />
              </div>
            </Form.Item>
          </div>
          <div className="grid grid-cols-2 gap-5 mb-5">
     
   <Form.Item
  label="Ảnh nổi bật"
  name="anh_san_pham"
  rules={[
    {
      validator: (_) => {
        if (productImageList.length > 0 || productImage) {
          return Promise.resolve();
        }
        return Promise.reject(new Error('Vui lòng tải lên ảnh sản phẩm!'));
      },
    },
  ]}>
  <Upload
    listType="picture-card"
    beforeUpload={(file) => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('Bạn chỉ có thể tải lên file ảnh!');
      }
      return false; 
    }}
    onChange={({ fileList }) => setProductImageList(fileList)}
    onPreview={handlePreview}
    onRemove={handleRemove}
    fileList={productImageList}
  >
    {productImageList.length === 0 && uploadButton}
  </Upload>
</Form.Item>

            <Form.Item label="Giá tốt" name="gia_tot" valuePropName="checked">
            <Switch />
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
                    Biến thể {variant.type === "color" ? "Màu sắc" : "Kích thước"}
                    <button
                      className="text-white text-xs hover:bg-red-500 bg-red-400 gap-1 px-2 py-1 rounded-md flex items-center"
                      onClick={() => removeVariant(index)}
                    >
                      <i className="fa-solid fa-trash-can" /> Xóa
                    </button>
                  </h3>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {variant.type === "color" ? "Chọn màu sắc" : "Chọn kích thước"}
                    </label>
                    {variant.type === "size" ? (
                      <>
                        <Select
                          style={{ width: "100%", marginBottom: "10px" }}
                          placeholder="Chọn loại kích thước"
                          onChange={handleSizeTypeChange}
                          value={selectedSizeType}
                        >
                          {Object.keys(groupSizesByType(kichthuoc?.data || [])).map((type) => (
                            <Select.Option key={type} value={type}>
                              {sizeTypeLabels[type] || type}
                            </Select.Option>
                          ))}
                        </Select>
                        {selectedSizeType && (
                          <Select
                            mode="multiple"
                            style={{ width: "100%" }}
                            placeholder="Chọn kích thước"
                            onChange={(values) => updateVariantValues(index, values)}
                            value={variant.values}
                          >
                            {groupSizesByType(kichthuoc?.data || [])[selectedSizeType]?.map((size: any) => (
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
                        onChange={(values) => updateVariantValues(index, values)}
                        value={variant.values}
                      >
                        {mausac?.data.map((color: any) => (
                          <Select.Option key={color.id} value={color.id}>
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
          <div className="p-4">
            <h2 className="text-xl font-bold ">Giá bán & Kho hàng</h2>
            <div className="mt-4 overflow-x-auto shadow-md">
              <table className="w-full max-w-full table-auto bg-white rounded-lg  border border-gray-300">
                <thead>
                  <tr className="bg-gray-100 border-b border-gray-300 text-center">
                    <th className="p-1 border-r border-gray-300">Kích thước</th>
                    <th className="p-1 border-r border-gray-300">Màu sắc</th>
                    <th className="p-1 border-r border-gray-300">Giá bán</th>
                    <th className="p-1 border-r border-gray-300">Chi phí sản xuất</th>
                    <th className="p-1 border-r border-gray-300">Giá khuyến mãi</th>
                    <th className="p-1 border-r border-gray-300">Số lượng</th>
                    <th className="p-1">Ảnh biến thể</th>
                  </tr>
                </thead>
                <tbody>
                  {combinations.map((combo, index) => (
                    <tr key={`combo-${index}`} className="border-t border-gray-300 text-center">
                      <td className="p-1 border-r border-gray-300 text-center">
                        {combo.sizeName}
                      </td>
                      <td className="p-1 border-r border-gray-300 text-center">
                        {combo.colorName}
                      </td>
                      <td className="p-1 border-r border-gray-300 w-[20%]">
                        <Form.Item
                          name={`gia_ban-${index}`}
                          className="my-0 px-5"
                          initialValue={combo.gia_ban}
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
                          initialValue={combo.chi_phi_san_xuat}

                          rules={[
                            {
                              required: true,
                              message: "Vui lòng nhập chi phí sản xuất!",
                            },
                            { type: "number", min: 1000, message: "Giá bán phải lớn hơn hoặc bằng 1000!" },

                            {
                              validator: (_, value) => {
                                const giaBan = form.getFieldValue(`gia_ban-${index}`);
                                if (value && giaBan && value >= giaBan) {
                                  return Promise.reject("Chi phí sản xuất  phải nhỏ hơn giá bán!");
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

                      </td>
                  
                      <td className="p-1 border-r border-gray-300 w-[20%]">
  <Form.Item
    name={`gia_khuyen_mai-${index}`}
    className="my-0 px-5"
    initialValue={combo.gia_khuyen_mai}
    rules={[
      { required: true, message: "Vui lòng nhập giá khuyến mãi!" },
      {
        type: "number",
        min: 0,
        message: "Giá khuyến mãi phải lớn hơn hoặc bằng 0!",
      },
      {
        validator: (_, value) => {
          const giaBan = form.getFieldValue(`gia_ban-${index}`);
          if (value === 0 || (value > 0 && value >= 1000)) {
            if (giaBan && value >= giaBan) {
              return Promise.reject(new Error("Giá khuyến mãi phải nhỏ hơn giá bán!"));
            }
            return Promise.resolve();
          }
          return Promise.reject(new Error("Giá khuyến mãi phải bằng 0 hoặc lớn hơn hoặc bằng 1000!"));
        },
      },
    ]}
  >
    <InputNumber placeholder="0" style={{ width: "100%" }} min={0} />
  </Form.Item>
</td>

                      <td className="p-1 border-r border-gray-300 w-[20%]">
                        <Form.Item
                          name={`so_luong_bien_the-${index}`}
                          className="my-0 px-5"
                          initialValue={combo.so_luong_bien_the}
                          rules={[
                            { required: true, message: "Vui lòng nhập số lượng!" },
                            { type: "number", min: 0, message: "Số lượng phải số âm!" },
                          ]}
                        >
                          <InputNumber placeholder="Nhập số lượng" style={{ width: "100%" }} min={0} />
                        </Form.Item>
                      </td>
                      <td className="p-1">
                        <Form.Item
                          name={`anh_bien_the-${index}`}
                          valuePropName="fileList"
                          getValueFromEvent={(e) => e.fileList}
                          className="my-0 flex justify-center"
                                                initialValue={combo.anh_bien_the}
                                              >
                                                <Upload
                                                  action="https://api.cloudinary.com/v1_1/dpypwbeis/image/upload"
                                                  data={{ upload_preset: "ml_default" }}
                                                  listType="picture-card"
                                                  fileList={fileLists[index] || []}
                                                  onPreview={handlePreview}
                                                  onChange={(info: any) => handleChange(info, index)}
                                                  maxCount={5}
                                                  multiple
                                                  className={`custom-upload mx-auto ${
                                                    (fileLists[index] && fileLists[index].length) >= 3 ? "w-[200px]" : "w-auto"
                                                  }`}
                                                >
                                                  {(fileLists[index] && fileLists[index].length) >= 5 ? null : uploadButton}
                                                </Upload>
                                              </Form.Item>
                                            </td>
                                     
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                    {combinations.length === 0 && (
                                      <div className="border border-gray-300 text-center mx-auto">
                                        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} className="mx-auto" />
                                      </div>
                                    )}
                                  </div>
                                </div>{" "}
                                  <div className="mt-10">
                                    <Form.Item>
                                    <Button type="primary" htmlType="submit" className="bg-gradient-to-r  from-blue-500 to-blue-400 text-white rounded-lg py-1 hover:bg-blue-600 shadow-md transition-colors ml-12"
  style={{
    padding: "14px 40px",
    marginRight: "190px",
  }} loading={updateProductMutation.isPending}>
                                    Cập nhập sản phẩm
                                      </Button>
                                    </Form.Item>
                                  </div>
                                  <Modal
        visible={previewVisible}
        title={previewTitle}
        footer={null}
        onCancel={handleCancel}
      >
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>
                                </Form>
                                </div>
                              </main>
                            );
                          };
                          
                          export default EditProducts;