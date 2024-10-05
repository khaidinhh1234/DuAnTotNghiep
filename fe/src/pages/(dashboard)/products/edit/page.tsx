import React, { useState, useEffect, useCallback } from "react";
import { Button, Form, Select, Spin, message } from "antd";
import { ArrowLeftOutlined, LoadingOutlined } from "@ant-design/icons";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadToCloudinary } from "@/configs/cloudinary";
import { RcFile, UploadChangeParam, UploadFile } from "antd/es/upload";
import ProductForm from "./ProductForm";
import VariantForm from "./VariantForm";
import {
  Category,
  Size,
  Color,
  Tag,
  Variant,
  ProductFormData,
} from "@/common/types/product";
import instance from "@/configs/admin";

const { Option } = Select;

const fetchData = async (endpoint: string): Promise<any> => {
  const response = await instance.get(`/${endpoint}`);
  return response.data;
};

const fetchProduct = async (id: string): Promise<any> => {
  const response = await instance.get(`/sanpham/${id}`);
  return response.data;
};

const updateProduct = async ({
  id,
  productData,
  
}: {
  id: string;
  productData: FormData;
}): Promise<any> => {
  console.log("Sending update request for product ID:", id);
  const plainObject = Object.fromEntries(productData.entries());
  if (plainObject.the) plainObject.the = JSON.parse(plainObject.the as string);
  if (plainObject.bien_the)
    plainObject.bien_the = JSON.parse(plainObject.bien_the as string);

  const response = await instance.put(`/sanpham/${id}`, plainObject, {
    headers: { "Content-Type": "application/json" },
  });
  console.log("Update response:", response);
  return response.data;
};

const EditProductsAndVariants: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [form] = Form.useForm();

  const [variantData, setVariantData] = useState<Variant[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [productFormData, setProductFormData] = useState<ProductFormData>(
    {} as ProductFormData
  );
  const [selectedColors, setSelectedColors] = useState<number[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<any>([]);



  // Queries
  const { data: categoriesData } = useQuery<{ data: Category[] }>({
    queryKey: ["categories"],
    queryFn: () => fetchData("danhmuc"),
  });

  const { data: sizesData } = useQuery<{ data: Size[] }>({
    queryKey: ["sizes"],
    queryFn: () => fetchData("bienthekichthuoc"),
  });

  const { data: colorsData } = useQuery<{ data: Color[] }>({
    queryKey: ["colors"],
    queryFn: () => fetchData("bienthemausac"),
  });

  const { data: tagsData } = useQuery<{ data: Tag[] }>({
    queryKey: ["tags"],
    queryFn: () => fetchData("the"),
  });

  const { data: productData } = useQuery({
    queryKey: ["product", id],
    queryFn: () => fetchProduct(id!),
    enabled: !!id,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });

  const updateProductMutation = useMutation({
    mutationFn: updateProduct,
    
    onSuccess: () => {
      message.success("Sản phẩm đã được cập nhật thành công!");
      navigate("/admin/products");
    },
    onError: (error: any) => {
      handleUpdateProductError(error);
    },
  });

  useEffect(() => {
    if (productData && productData.data) {
      const formData: ProductFormData = {
        ten_san_pham: productData.data.ten_san_pham,
        danh_muc_id: productData.data.danh_muc_id,
        mo_ta_ngan: productData.data.mo_ta_ngan,
        noi_dung: productData.data.noi_dung,
        tags: productData.data.the_san_pham.map((tag: any) => tag.id),
        ma_san_pham: productData.data.ma_san_pham,
        anh_san_pham: productData.data.anh_san_pham,
        mo_ta_san_pham: "",
      };

      form.setFieldsValue(formData);
      setProductFormData(formData);

      if (productData.data.anh_san_pham) {
        setFileList([
          {
            uid: "-1",
            name: "image.png",
            status: "done",
            url: productData.data.anh_san_pham,
          },
        ]);
      }

      if (
        productData.data.bien_the_san_pham &&
        productData.data.bien_the_san_pham.length > 0
      ) {
        const colors = new Set<number>();
        const sizes = new Set<number>();

        productData.data.bien_the_san_pham.forEach((v: any) => {
          if (v.mau_sac_id) colors.add(Number(v.mau_sac_id));
          if (v.kich_thuoc_id) sizes.add(Number(v.kich_thuoc_id));
          if (v.bien_the_mau_sac_id) colors.add(Number(v.bien_the_mau_sac_id));
          if (v.bien_the_kich_thuoc_id)
            sizes.add(Number(v.bien_the_kich_thuoc_id));
        });

        setSelectedColors(Array.from(colors));
        setSelectedSizes(Array.from(sizes));

        const newVariantData = productData.data.bien_the_san_pham.map(
          (v: any) => ({
            id: `${v.bien_the_mau_sac_id || v.mau_sac_id}-${v.bien_the_kich_thuoc_id || v.kich_thuoc_id}`,
            mau_sac_id: Number(v.bien_the_mau_sac_id || v.mau_sac_id),
            kich_thuoc_id: Number(v.bien_the_kich_thuoc_id || v.kich_thuoc_id),
            gia_ban: v.gia_ban,
            gia_khuyen_mai: v.gia_khuyen_mai,
            so_luong_bien_the: v.so_luong_bien_the,
            ngay_bat_dau_khuyen_mai: v.ngay_bat_dau_khuyen_mai,
            ngay_ket_thuc_khuyen_mai: v.ngay_ket_thuc_khuyen_mai,
            anh_bien_the: v.anh_bien_the
              ? v.anh_bien_the.map((img: any) => ({
                  uid: img.id.toString(),
                  name: `image-${img.id}.png`,
                  status: "done",
                  url: img.duong_dan_anh,
                }))
              : [],
          })
        );
        setVariantData(newVariantData);
      }

      setIsLoading(false);
    }
  }, [productData, form]);

  useEffect(() => {
    const newVariants = generateVariants(selectedColors, selectedSizes);
    setVariantData((prevVariants) => {
      const mergedVariants = newVariants.map((newVariant) => {
        const existingVariant = prevVariants.find(
          (v) => v.id === newVariant.id
        );
        return existingVariant
          ? { ...newVariant, ...existingVariant }
          : newVariant;
      });
      return mergedVariants;
    });
  }, [selectedColors, selectedSizes]);

  useEffect(() => {
    return () => {
      setFileList([]);
      setVariantData([]);
      setProductFormData({} as ProductFormData);
      setSelectedColors([]);
      setSelectedSizes([]);
      form.resetFields();
      queryClient.removeQueries({ queryKey: ["product", id] });
    };
  }, [id, queryClient, form]);

  const generateVariants = useCallback(
    (colors: number[], sizes: number[]): Variant[] => {
      const newVariants: Variant[] = [];
      colors.forEach((colorId) => {
        sizes.forEach((sizeId) => {
          const id = `${colorId}-${sizeId}`;
          newVariants.push({
            id,
            mau_sac_id: colorId,
            kich_thuoc_id: sizeId,
            gia_ban: "",
            gia_khuyen_mai: "",
            so_luong_bien_the: "",
            ngay_bat_dau_khuyen_mai: null,
            ngay_ket_thuc_khuyen_mai: null,
            anh_bien_the: [],
          });
        });
      });
      return newVariants;
    },
    []
  );

  const handleProductFormValuesChange = (
    _: any,
    allValues: ProductFormData
  ) => {
    const add = { ...allValues, noi_dung: data };

    setProductFormData(add);
  };

  const handleRemoveImage = (file: UploadFile, record: Variant) => {
    updateVariant({
      ...record,
      anh_bien_the: record.anh_bien_the.filter((item) => item.uid !== file.uid),
    });
  };

  const handleImageChange = (
    info: UploadChangeParam<UploadFile<any>>,
    variant: Variant
  ) => {
    const { fileList } = info;
    const updatedVariant = {
      ...variant,
      anh_bien_the: fileList.map((file) => ({
        uid: file.uid,
        name: file.name,
        status: file.status,
        url:
          file.url ||
          (file.originFileObj ? URL.createObjectURL(file.originFileObj) : ""),
        originFileObj: file.originFileObj,
      })),
    };
    updateVariant(updatedVariant);
  };

  const handleSubmit = async () => {
    try {
      await form.validateFields();
      validateVariants();
      setIsSubmitting(true);
      console.log("Form values before submission:", form.getFieldsValue());
      console.log("Product Form Data before submission:", productFormData);
      console.log("Variant Data before submission:", variantData);
      const formData = await prepareFormData();
      console.log("FormData prepared successfully");

      updateProductMutation.mutate({ id: id!, productData: formData });
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      handleSubmitError(error);
    }
  };

  const updateVariant = (updatedVariant: Variant) => {
    setVariantData((prevData) =>
      prevData.map((v) => (v.id === updatedVariant.id ? updatedVariant : v))
    );
  };

  const handleUpdateProductError = (error: any) => {
    console.error("Error updating product:", error);
    if (error.response?.data?.errors) {
      const errorMessages = Object.entries(error.response.data.errors)
        .map(([field, messages]) => {
          if (Array.isArray(messages)) {
            return `${field}: ${messages.join(", ")}`;
          } else if (typeof messages === "string") {
            return `${field}: ${messages}`;
          } else {
            return `${field}: Unknown error`;
          }
        })
        .join("\n");
      message.error(`Lỗi cập nhật sản phẩm:\n${errorMessages}`);
    } else {
      message.error("Đã xảy ra lỗi khi cập nhật sản phẩm.");
    }
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
        throw new Error(
          `Giá bán của biến thể ${index + 1} phải bằng 0 hoặc lớn hơn hoặc bằng 1000.`
        );
      }

      if (variant.gia_khuyen_mai !== undefined) {
        const promotionalPrice = parseFloat(variant.gia_khuyen_mai);

        if (promotionalPrice > regularPrice) {
          throw new Error(
            `Giá khuyến mãi của biến thể ${index + 1} không thể lớn hơn giá bán.`
          );
        }
      }

      const quantity = parseInt(variant.so_luong_bien_the);
      if (isNaN(quantity) || quantity <= 0) {
        throw new Error(
          `Số lượng của biến thể ${index + 1} phải là số nguyên dương.`
        );
      }
    });
  };

  const prepareFormData = async () => {
    const formData = new FormData();
    formData.append("ten_san_pham", productFormData.ten_san_pham || "");
    formData.append(
      "danh_muc_id",
      productFormData.danh_muc_id?.toString() || ""
    );
    formData.append("mo_ta_ngan", productFormData.mo_ta_ngan || "");
    formData.append("noi_dung", productFormData.noi_dung || "");
    formData.append("ma_san_pham", productFormData.ma_san_pham || "");
    formData.append("the", JSON.stringify(productFormData.tags || []));

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
    } else if (productData.data.anh_san_pham && fileList.length > 0) {
      formData.append("anh_san_pham", productData.data.anh_san_pham);
    } else {
      formData.append("anh_san_pham", "");
    }

    if (variantData.length > 0) {
      const variantsWithImages = await Promise.all(
        variantData.map(async (variant) => {
          const variantImages = await Promise.all(
            variant.anh_bien_the.map(async (image) => {
              if (image.originFileObj) {
                try {
                  const imageUrl = await uploadToCloudinary(
                    image.originFileObj as RcFile
                  );
                  return imageUrl;
                } catch (error) {
                  console.error("Error uploading variant image:", error);
                  return null;
                }
              }
              return image.url;
            })
          );

          return {
            ...variant,
            anh: variantImages.filter(Boolean),
          };
        })
      );

      formData.append("bien_the", JSON.stringify(variantsWithImages));
    } else {
      throw new Error("Vui lòng thêm ít nhất một biến thể sản phẩm");
    }

    for (let [key, value] of formData.entries()) {
      console.log(key, value);
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

  if (
    isLoading ||
    !id ||
    !productData ||
    !categoriesData ||
    !sizesData ||
    !colorsData ||
    !tagsData
  ) {
    return <Spin className="flex justify-center items-center h-screen" />;
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="md:text-base">
          Quản trị / Sản phẩm /{" "}
          <span className="font-semibold">Cập nhật sản phẩm </span>
        </h1>
      </div>
      <div className="flex items-center justify-between">
        <h1 className="font-semibold md:text-3xl">
          Cập nhật sản phẩm:{" "}
          {productData?.data?.ten_san_pham
            ? productData.data.ten_san_pham
            : "Chưa cập nhật tên sản phẩm"}
        </h1>
        <div className="flex gap-2">
          <Link to="/admin/products">
            <Button className="bg-gradient-to-r  from-blue-500 to-blue-400 text-white rounded-lg py-1 hover:bg-blue-600 shadow-md transition-colors">
              Quay lại
            </Button>
          </Link>
        </div>
      </div>

      <div className="max-w-8xl mx-5 px-5 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <ProductForm
            form={form}
            fileList={fileList}
            setFileList={setFileList}
            categoriesData={categoriesData?.data || []}
            tagsData={tagsData?.data || []}
            onValuesChange={handleProductFormValuesChange}
            initialValues={productData?.data}
            setData={setData}

          />
          <div className="mt-8 px-10">
            <h2 className="text-xl font-semibold mb-4">
              Giá bán, Kho hàng và Biến thể
            </h2>

            <div className="mb-6 bg-gray-50 p-4 rounded-md">
              <h3 className="text-lg font-medium mb-2">Biến thể Màu sắc</h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Màu sắc đã chọn
                </label>
                <Select
                  mode="multiple"
                  style={{ width: "100%" }}
                  value={selectedColors}
                  onChange={(values) => setSelectedColors(values as number[])}
                >
                  {colorsData.data.map((color) => (
                    <Option key={color.id} value={color.id}>
                      <div className="flex items-center">
                        <div
                          className="w-4 h-4 rounded-full mr-2"
                          style={{ backgroundColor: color.ma_mau_sac }}
                        />
                        {color.ten_mau_sac}
                      </div>
                    </Option>
                  ))}
                </Select>
              </div>
            </div>

            <div className="mb-6 bg-gray-50 p-4 rounded-md">
              <h3 className="text-lg font-medium mb-2">Biến thể Kích thước</h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kích thước đã chọn
                </label>
                <Select
                  mode="multiple"
                  style={{ width: "100%" }}
                  value={selectedSizes}
                  onChange={(values) => setSelectedSizes(values as number[])}
                >
                  {sizesData.data.map((size) => (
                    <Option key={size.id} value={size.id}>
                      {size.kich_thuoc}
                    </Option>
                  ))}
                </Select>
              </div>
            </div>

            <h3 className="text-lg font-medium mb-4">Giá bán & Kho hàng</h3>

            <VariantForm
              variants={[...variantData]}
              updateVariant={updateVariant}
              handleRemoveImage={handleRemoveImage}
              handleImageChange={handleImageChange}
              colorsData={colorsData.data}
              sizesData={sizesData.data}
            />
          </div>
          <Form.Item className="mt-8 px-10">
            <div className="flex items-center justify-start gap-2">
              <Link to="/admin/products">
                <Button className="py-[18px] px-10">Hủy</Button>
              </Link>
              <Button
                type="primary"
                onClick={handleSubmit}
                className="bg-gradient-to-r  from-blue-500 to-blue-400 text-white rounded-lg py-1 hover:bg-blue-600 shadow-md transition-colors"
                style={{
                  padding: "18px 30px",
                  marginRight: "190px",
                }}
                disabled={isSubmitting}
              >
                {isSubmitting && (
                  <Spin
                    indicator={
                      <LoadingOutlined
                        style={{ fontSize: 20, marginLeft: 5 }}
                        spin
                      />
                    }
                  />
                )}{" "}
                {isSubmitting ? "Đang xử lý..." : "Cập nhật sản phẩm"}
              </Button>
            </div>
          </Form.Item>{" "}
        </div>
      </div>
    </main>
  );
};

export default EditProductsAndVariants;
