
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Button, Form, Select, Spin, message, Upload } from "antd";
import { ArrowLeftOutlined, LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { Link, useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import instance from "@/configs/axios";
import { uploadToCloudinary } from '@/configs/cloudinary';
import { RcFile, UploadChangeParam, UploadFile } from "antd/es/upload";
import ProductForm from "./ProductForm";
import VariantForm from "./VariantForm";
import {
  Category,
  Size,
  Color,
  Tag,
  VariantType,
  Variant,
  ProductFormData
} from "@/common/types/product";

const { Option } = Select;

// API calls
const fetchData = async (endpoint: string): Promise<any> => {
  const response = await instance.get(`/admin/${endpoint}`);
  return response.data;
};

const fetchProduct = async (id: string): Promise<any> => {
  const response = await instance.get(`/admin/sanpham/${id}`);
  return response.data;
};

const updateProduct = async ({ id, productData }: { id: string, productData: FormData }): Promise<any> => {
  console.log("Sending update request for product ID:", id);
  const response = await instance.put(`/admin/sanpham/${id}`, productData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  console.log("Update response:", response);
  return response.data;
};

const EditProductsAndVariants: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [variants, setVariants] = useState<VariantType[]>([]);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [form] = Form.useForm();
  
  const [variantData, setVariantData] = useState<Variant[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [productFormData, setProductFormData] = useState<ProductFormData>({} as ProductFormData);
  const [selectedColors, setSelectedColors] = useState<number[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<number[]>([]);

  // Queries
  const { data: categoriesData, isLoading: categoriesLoading } = useQuery<{ data: Category[] }>({
    queryKey: ["categories"],
    queryFn: () => fetchData("danhmuc"),
  });

  const { data: sizesData, isLoading: sizesLoading } = useQuery<{ data: Size[] }>({
    queryKey: ["sizes"],
    queryFn: () => fetchData("bienthekichthuoc"),
  });

  const { data: colorsData, isLoading: colorsLoading } = useQuery<{ data: Color[] }>({
    queryKey: ["colors"],
    queryFn: () => fetchData("bienthemausac"),
  });

  const { data: tagsData, isLoading: tagsLoading } = useQuery<{ data: Tag[] }>({
    queryKey: ["tags"],
    queryFn: () => fetchData("the"),
  });

  const { data: productData, isLoading: productLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: () => fetchProduct(id!),
    enabled: !!id,
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
      const formData = {
        ten_san_pham: productData.data.ten_san_pham,
        danh_muc_id: productData.data.danh_muc_id,
        mo_ta_ngan: productData.data.mo_ta_ngan,
        noi_dung: productData.data.noi_dung,
        tags: productData.data.the_san_pham.map((tag: any) => tag.id),
        ma_san_pham: productData.data.ma_san_pham,
        anh_san_pham: productData.data.anh_san_pham,
        featured: productData.data.featured,
      };

      form.setFieldsValue(formData);
      setProductFormData(formData);

      if (productData.data.anh_san_pham) {
        setFileList([
          {
            uid: '-1',
            name: 'image.png',
            status: 'done',
            url: productData.data.anh_san_pham,
          },
        ]);
      }

      if (productData.data.bien_the_san_pham && productData.data.bien_the_san_pham.length > 0) {
        const colors = new Set<number>();
        const sizes = new Set<number>();

        productData.data.bien_the_san_pham.forEach((v: any) => {
          if (v.mau_sac_id) colors.add(Number(v.mau_sac_id));
          if (v.kich_thuoc_id) sizes.add(Number(v.kich_thuoc_id));
          if (v.bien_the_mau_sac_id) colors.add(Number(v.bien_the_mau_sac_id));
          if (v.bien_the_kich_thuoc_id) sizes.add(Number(v.bien_the_kich_thuoc_id));
        });

        setSelectedColors(Array.from(colors));
        setSelectedSizes(Array.from(sizes));

        const newVariantData = productData.data.bien_the_san_pham.map((v: any) => ({
          id: `${v.bien_the_mau_sac_id || v.mau_sac_id}-${v.bien_the_kich_thuoc_id || v.kich_thuoc_id}`,
          mau_sac_id: Number(v.bien_the_mau_sac_id || v.mau_sac_id),
          kich_thuoc_id: Number(v.bien_the_kich_thuoc_id || v.kich_thuoc_id),
          gia_ban: v.gia_ban,
          gia_khuyen_mai: v.gia_khuyen_mai,
          so_luong_bien_the: v.so_luong_bien_the,
          ngay_bat_dau_khuyen_mai: v.ngay_bat_dau_khuyen_mai,
          ngay_ket_thuc_khuyen_mai: v.ngay_ket_thuc_khuyen_mai,
          anh_bien_the: v.anh_bien_the || [],
        }));
        setVariantData(newVariantData);
      }
    }
  }, [productData, form]);

  useEffect(() => {
    const newVariants = generateVariants(selectedColors, selectedSizes);
    setVariantData(prevVariants => {
      const mergedVariants = newVariants.map(newVariant => {
        const existingVariant = prevVariants.find(v => v.id === newVariant.id);
        return existingVariant ? { ...newVariant, ...existingVariant } : newVariant;
      });
      return mergedVariants;
    });
  }, [selectedColors, selectedSizes]);

  const generateVariants = useCallback((colors: number[], sizes: number[]): Variant[] => {
    const newVariants: Variant[] = [];
    colors.forEach(colorId => {
      sizes.forEach(sizeId => {
        const id = `${colorId}-${sizeId}`;
        newVariants.push({
          id,
          mau_sac_id: colorId,
          kich_thuoc_id: sizeId,
          gia_ban: '',
          gia_khuyen_mai: '',
          so_luong_bien_the: '',
          ngay_bat_dau_khuyen_mai: null,
          ngay_ket_thuc_khuyen_mai: null,
          anh_bien_the: [],
        });
      });
    });
    return newVariants;
  }, []);

  const isLoading = useMemo(() => 
    categoriesLoading || sizesLoading || colorsLoading || tagsLoading || productLoading, 
    [categoriesLoading, sizesLoading, colorsLoading, tagsLoading, productLoading]
  );

  const handleProductFormValuesChange = (_: any, allValues: ProductFormData) => {
    console.log("Form values changed:", allValues);
    setProductFormData(allValues);
  };

  const handleRemoveImage = (file: UploadFile, record: Variant) => {
    updateVariant({ ...record, anh_bien_the: record.anh_bien_the.filter((item) => item.uid !== file.uid) });
  };

  const handleImageChange = (info: UploadChangeParam<UploadFile<any>>, record: Variant) => {
    const { fileList } = info;
    const newImages = fileList.map(file => ({
      id: file.uid,
      name: file.name,
      duong_dan_anh: file.url || (file.originFileObj && URL.createObjectURL(file.originFileObj)),
    }));
    
    updateVariant({
      ...record,
      anh_bien_the: newImages,
    });
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
    setVariantData(prevData =>
      prevData.map(v => v.id === updatedVariant.id ? updatedVariant : v)
    );
  };

  const handleUpdateProductError = (error: any) => {
    console.error("Error updating product:", error);
    if (error.response?.data?.errors) {
      const errorMessages = Object.entries(error.response.data.errors)
        .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
        .join('\n');
      message.error(`Lỗi cập nhật sản phẩm:\n${errorMessages}`);
    } else {
      message.error("Đã xảy ra lỗi khi cập nhật sản phẩm.");
    }
    setIsSubmitting(false);
  };
  
  const validateVariants = () => {
    if (variantData.length === 0) {
      throw new Error('Vui lòng thêm ít nhất một biến thể sản phẩm.');
    }

    variantData.forEach((variant, index) => {
      if (!variant.kich_thuoc_id || !variant.mau_sac_id) {
        throw new Error(`Thiếu kích thước hoặc màu sắc cho biến thể ${index + 1}.`);
      }

      const regularPrice = parseFloat(variant.gia_ban);
      if (!regularPrice || isNaN(regularPrice)) {
        throw new Error(`Giá bán của biến thể ${index + 1} không hợp lệ.`);
      }

      if (!variant.so_luong_bien_the || isNaN(parseInt(variant.so_luong_bien_the))) {
        throw new Error(`Số lượng của biến thể ${index + 1} không hợp lệ.`);
      }
    });
  };

const prepareFormData = async () => {
  const formData = new FormData();

  // Add product data
  Object.entries(productFormData).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (key === 'tags' || key === 'the') {
        formData.append(key, JSON.stringify(value));
      } else if (key === 'featured') {
        formData.append(key, value ? '1' : '0');
      } else {
        formData.append(key, value.toString());
      }
    }
  });

  // Add product image
  if (fileList.length > 0 && fileList[0].originFileObj) {
    try {
      const imageUrl = await uploadToCloudinary(fileList[0].originFileObj as RcFile);
      formData.append('anh_san_pham', imageUrl);
    } catch (error) {
      console.error('Error uploading product image:', error);
      throw new Error('Lỗi khi tải lên ảnh sản phẩm');
    }
  } else if (productData.data.anh_san_pham) {
    formData.append('anh_san_pham', productData.data.anh_san_pham);
  } else {
    throw new Error('Vui lòng chọn ảnh sản phẩm');
  }

  // Add variants
  if (variantData.length > 0) {
    variantData.forEach((variant, index) => {
      Object.entries(variant).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (key === 'anh_bien_the') {
            formData.append(`bien_the[${index}][${key}]`, JSON.stringify(value));
          } else if (key === 'ngay_bat_dau_khuyen_mai' || key === 'ngay_ket_thuc_khuyen_mai') {
            formData.append(`bien_the[${index}][${key}]`, value ? new Date(value).toISOString() : '');
          } else {
            formData.append(`bien_the[${index}][${key}]`, value.toString());
          }
        }
      });
    });
  } else {
    throw new Error('Vui lòng thêm ít nhất một biến thể sản phẩm');
  }

  // Log FormData contents for debugging
  for (let [key, value] of formData.entries()) {
    console.log(key, value);
  }

  return formData;
};

  const handleSubmitError = (error: unknown) => {
    if (error instanceof Error) {
      message.error(error.message);
    } else {
      message.error('Có lỗi xảy ra. Vui lòng kiểm tra lại thông tin.');
    }
    setIsSubmitting(false);
  };

  if (isLoading) {
    return <Spin className="flex justify-center items-center h-screen" />;
  }

  if (!id || !productData || !categoriesData || !sizesData || !colorsData || !tagsData) {
    return <div className="text-center text-red-500">Không thể tải dữ liệu. Vui lòng thử lại sau.</div>;
  }

  return (
    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-semibold text-gray-800">
            Chỉnh sửa sản phẩm và biến thể
          </h1>
          <Link to="/admin/products">
            <Button icon={<ArrowLeftOutlined />} className="flex items-center bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md">
              Quay lại
            </Button>
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <ProductForm
            form={form}
            fileList={fileList}
            setFileList={setFileList}
            categoriesData={categoriesData?.data || []}
            tagsData={tagsData?.data || []}
            onValuesChange={handleProductFormValuesChange}
            initialValues={productData?.data}
          />

          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Giá bán, Kho hàng và Biến thể</h2>
            
            <div className="mb-6 bg-gray-50 p-4 rounded-md">
              <h3 className="text-lg font-medium mb-2">Biến thể Màu sắc</h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Màu sắc đã chọn
                </label>
                <Select
                  mode="multiple"
                  style={{ width: '100%' }}
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
                  style={{ width: '100%' }}
                  value={selectedSizes}
                  onChange={(values) => setSelectedSizes(values as number[])}
                >
                  {sizesData.data.map((size) => (
                    <Option key={size.id} value={size.id}>{size.kich_thuoc}</Option>
                  ))}
                </Select>
              </div>
            </div>

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
              marginTop: '-60px',
              padding: '16px',
              marginRight: '20px',
            }}
            disabled={isSubmitting}
          >
            {isSubmitting && (
              <Spin indicator={<LoadingOutlined style={{ fontSize: 22, marginLeft: 10 }} spin />} />
            )} {isSubmitting ? 'Đang xử lý...' : 'Cập nhật sản phẩm'}
          </Button>
        </div>
      </Form.Item>
    </main>
  );
};

export default EditProductsAndVariants;
