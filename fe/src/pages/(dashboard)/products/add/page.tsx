import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Button, Form, Select, Spin, message } from "antd";
import { ArrowLeftOutlined, LoadingOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import instance from "@/configs/axios";
import { uploadToCloudinary } from "@/configs/cloudinary";
import { RcFile, UploadFile } from "antd/es/upload";
import ProductForm from "./ProductForm";
import VariantForm from "./VariantForm";
import {
  Category,
  Size,
  Color,
  Tag,
  VariantType,
  Variant,
  ProductFormData,
} from "@/common/types/product";
const { Option } = Select;

// API calls
const fetchData = async (endpoint: string): Promise<any> => {
  const response = await instance.get(`/admin/${endpoint}`);
  return response.data;
};

const addProduct = async (productData: FormData): Promise<any> => {
  const response = await instance.post("/admin/sanpham", productData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

const ProductsAndVariants: React.FC = () => {
  const [variants, setVariants] = useState<VariantType[]>([]);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [form] = Form.useForm<ProductFormData>();
  const [variantData, setVariantData] = useState<Variant[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [productFormData, setProductFormData] = useState<ProductFormData>(
    {} as ProductFormData
  );
  const navigate = useNavigate();

  // Queries
  const { data: categoriesData, isLoading: categoriesLoading } = useQuery<{
    data: Category[];
  }>({
    queryKey: ["categories"],
    queryFn: () => fetchData("danhmuc"),
  });

  const { data: sizesData, isLoading: sizesLoading } = useQuery<{
    data: Size[];
  }>({
    queryKey: ["sizes"],
    queryFn: () => fetchData("bienthekichthuoc"),
  });

  const { data: colorsData, isLoading: colorsLoading } = useQuery<{
    data: Color[];
  }>({
    queryKey: ["colors"],
    queryFn: () => fetchData("bienthemausac"),
  });

  const { data: tagsData, isLoading: tagsLoading } = useQuery<{ data: Tag[] }>({
    queryKey: ["tags"],
    queryFn: () => fetchData("the"),
  });

  const addProductMutation = useMutation({
    mutationFn: addProduct,
    onSuccess: () => {
      message.success("Sản phẩm đã được thêm thành công!");
      resetForm();
      navigate("/admin/products");
    },
    onError: (error: any) => {
      handleAddProductError(error);
    },
  });

  const generateVariantData = useCallback(() => {
    const colorVariant = variants.find((v) => v.type === "color");
    const sizeVariant = variants.find((v) => v.type === "size");

    if (colorVariant && sizeVariant) {
      const newVariantData: Variant[] = colorVariant.values.flatMap((colorId) =>
        sizeVariant.values.map((sizeId) => ({
          id: `${colorId}-${sizeId}`,
          mau_sac_id: colorId,
          kich_thuoc_id: sizeId,
          gia_ban: "",
          gia_khuyen_mai: "",
          so_luong_bien_the: "",
          ngay_bat_dau_khuyen_mai: null,
          ngay_ket_thuc_khuyen_mai: null,
          anh_bien_the: [],
        }))
      );
      setVariantData(newVariantData);
    } else {
      setVariantData([]);
    }
  }, [variants]);

  useEffect(() => {
    generateVariantData();
  }, [generateVariantData]);

  const isLoading = useMemo(
    () => categoriesLoading || sizesLoading || colorsLoading || tagsLoading,
    [categoriesLoading, sizesLoading, colorsLoading, tagsLoading]
  );

  if (isLoading) {
    return <Spin className="flex justify-center items-center h-screen" />;
  }

  if (!categoriesData || !sizesData || !colorsData || !tagsData) {
    return (
      <div className="text-center text-red-500">
        Không thể tải dữ liệu. Vui lòng thử lại sau.
      </div>
    );
  }

  const addVariant = (value: "color" | "size") => {
    setVariants((prev) => [...prev, { type: value, values: [] }]);
  };

  const removeVariant = (index: number) => {
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  const updateVariantValues = (index: number, values: number[]) => {
    setVariants((prev) =>
      prev.map((v, i) => (i === index ? { ...v, values } : v))
    );
  };

  const handleProductFormValuesChange = (
    _: any,
    allValues: ProductFormData
  ) => {
    setProductFormData(allValues);
  };

  const handleRemoveImage = (file: UploadFile, record: Variant) => {
    updateVariant({
      ...record,
      anh_bien_the: record.anh_bien_the.filter((item) => item.uid !== file.uid),
    });
  };

  const handleImageChange = (info: any, record: Variant) => {
    updateVariant({ ...record, anh_bien_the: info.fileList });
  };

  const handleSubmit = async () => {
    try {
      await form.validateFields();
      validateVariants();
      setIsSubmitting(true);
      const formData = await prepareFormData();
      addProductMutation.mutate(formData);
    } catch (error) {
      handleSubmitError(error);
    }
  };

  const updateVariant = (updatedVariant: Variant) => {
    setVariantData((prevData) =>
      prevData.map((v) => (v.id === updatedVariant.id ? updatedVariant : v))
    );
  };

  // Helper functions
  const resetForm = () => {
    form.resetFields();
    setFileList([]);
    setVariants([]);
    setVariantData([]);
    setIsSubmitting(false);
  };

  const handleAddProductError = (error: any) => {
    console.error("Error adding product:", error);
    const errorFields = error.response?.data?.errors
      ? Object.keys(error.response.data.errors)
      : [];
    const errorMessage =
      errorFields.length > 0
        ? `Vui lòng kiểm tra lại các trường: ${errorFields.join(", ")}`
        : "Đã xảy ra lỗi khi thêm sản phẩm.";
    message.error(errorMessage);
    setIsSubmitting(false);
  };

  const validateVariants = () => {
    if (variantData.length === 0) {
      throw new Error("Vui lòng thêm ít nhất một biến thể sản phẩm.");
    }
  
    variantData.forEach((variant, index) => {
      if (!variant.kich_thuoc_id || !variant.mau_sac_id) {
        throw new Error(
          `Thiếu kích thước hoặc màu sắc cho biến thể ${index + 1}.`
        );
      }
  
      const regularPrice = parseFloat(variant.gia_ban);
      if (isNaN(regularPrice) || (regularPrice !== 0 && regularPrice < 1000)) {
        throw new Error(`Giá bán của biến thể ${index + 1} phải bằng 0 hoặc lớn hơn hoặc bằng 1000.`);
      }
  
      if (variant.gia_khuyen_mai !== undefined) {
        const promotionalPrice = parseFloat(variant.gia_khuyen_mai);
       
        if (promotionalPrice > regularPrice) {
          throw new Error(`Giá khuyến mãi của biến thể ${index + 1} không thể lớn hơn giá bán.`);
        }
      }
 
      const quantity = parseInt(variant.so_luong_bien_the);
      if (isNaN(quantity) || quantity <= 0) {
        throw new Error(`Số lượng của biến thể ${index + 1} phải là số nguyên dương.`);
      }
    });
  };
  

  const prepareFormData = async () => {
    const formData = new FormData();

    // Add product form data
    Object.entries(productFormData).forEach(([key, value]) => {
      if (key !== "tags" && key !== "sizes" && key !== "colors") {
        formData.append(key, value as string);
      }
    });

    // Upload product image
    if (fileList.length > 0 && fileList[0].originFileObj) {
      try {
        const imageUrl = await uploadToCloudinary(
          fileList[0].originFileObj as RcFile
        );
        formData.append("anh_san_pham", imageUrl);
      } catch (error) {
        console.error("Error uploading product image:", error);
        throw new Error("Lỗi khi tải lên ảnh sản phẩm");
      }
    }

    // Add tags
    (productFormData.tags || []).forEach((tagId: number, index: number) => {
      formData.append(`the[${index}]`, tagId.toString());
    });

    // Add variant data
    for (let index = 0; index < variantData.length; index++) {
      const variant = variantData[index];
      Object.entries(variant).forEach(([key, value]) => {
        if (key !== "anh_bien_the") {
          formData.append(
            `bien_the[${index}][${key}]`,
            value?.toString() || ""
          );
        }
      });

      // Upload variant images
      if (variant.anh_bien_the && variant.anh_bien_the.length > 0) {
        for (
          let imgIndex = 0;
          imgIndex < variant.anh_bien_the.length;
          imgIndex++
        ) {
          const img = variant.anh_bien_the[imgIndex];
          if (img.originFileObj) {
            try {
              const imageUrl = await uploadToCloudinary(
                img.originFileObj as RcFile
              );
              formData.append(`bien_the[${index}][anh][${imgIndex}]`, imageUrl);
            } catch (error) {
              console.error("Error uploading variant image:", error);
              throw new Error("Lỗi khi tải lên ảnh biến thể");
            }
          }
        }
      } else {
        formData.append(`bien_the[${index}][anh][]`, "");
      }
    }

    return formData;
  };

  const handleSubmitError = (error: unknown) => {
    if (error instanceof Error) {
      message.error(error.message);
    } else {
      message.error("Có lỗi xảy ra. Vui lòng kiểm tra lại thông tin.");
    }
    setIsSubmitting(false);
  };

  return (
    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
      <div className="flex items-center justify-between mt-5 left-5">
        <h1 className="w-full text-3xl font-semibold text-gray-800 text-left">
          Thêm sản phẩm và biến thể
        </h1>

        <Link to="/admin/products">
          <Button
            icon={<ArrowLeftOutlined />}
            className="flex items-center bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md ml-2.5"
          >
            Quay lại
          </Button>
        </Link>
      </div>
      <div className="container mx-auto px-6 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <ProductForm
            form={form}
            fileList={fileList}
            setFileList={setFileList}
            categoriesData={categoriesData?.data || []}
            tagsData={tagsData?.data || []}
            onValuesChange={handleProductFormValuesChange}
          />

          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">
              Giá bán, Kho hàng và Biến thể
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Tạo biến thể nếu sản phẩm có hơn một tùy chọn, ví dụ như về kích
              thước hay màu sắc.
            </p>
            <div className="mb-6">
              <Select
                style={{ width: 120 }}
                onSelect={addVariant}
                placeholder="Chọn biến thể"
              >
                <Option value="color">Màu sắc</Option>
                <Option value="size">Kích thước</Option>
              </Select>
            </div>

            {variants?.map((variant, index) => (
              <div key={index} className="mb-6 bg-gray-50 p-4 rounded-md">
                <h3 className="text-lg font-medium mb-2 flex justify-between items-center">
                  Biến thể {variant.type === "color" ? "Màu sắc" : "Kích thước"}
                  <button
                    className="text-gray-400 hover:text-gray-600"
                    onClick={() => removeVariant(index)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
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
                      ? colorsData.data.map((color) => (
                          <Option key={color.id} value={color.id}>
                            <div className="flex items-center">
                              <div
                                className="w-4 h-4 rounded-full mr-2"
                                style={{ backgroundColor: color.ma_mau_sac }}
                              />
                              {color.ten_mau_sac}
                            </div>
                          </Option>
                        ))
                      : sizesData.data.map((size) => (
                          <Option key={size.id} value={size.id}>
                            {size.kich_thuoc}
                          </Option>
                        ))}
                  </Select>
                </div>
              </div>
            ))}
            <h3 className="text-lg font-medium mb-4">Giá bán & Kho hàng</h3>

            <VariantForm
              variants={variantData}
              updateVariant={updateVariant}
              handleRemoveImage={handleRemoveImage}
              handleImageChange={handleImageChange}
              colorsData={colorsData.data}
              sizesData={sizesData.data}
            />
          </div>
        </div>
      </div>
      <Form.Item className="mt-8">
        <div className="flex items-center justify-end">
          <Button
            type="primary"
            onClick={handleSubmit}
            className="px-3 py-1 bg-black text-white rounded-lg flex items-center"
            style={{
              marginTop: "-60px",
              padding: "18px 30px",
              marginRight: "190px",
            }}
            disabled={isSubmitting}
          >
            {isSubmitting && (
              <Spin
                indicator={
                  <LoadingOutlined
                    style={{ fontSize: 22, marginLeft: 10 }}
                    spin
                  />
                }
              />
            )}{" "}
            {isSubmitting ? "Đang xử lý..." : "Thêm sản phẩm"}
          </Button>
        </div>
      </Form.Item>
    </main>
  );
};

export default ProductsAndVariants;
