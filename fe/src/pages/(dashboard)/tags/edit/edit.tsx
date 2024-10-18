
// import React, { useState, useEffect } from "react";
// import instance from "@/configs/admin";
// import { uploadToCloudinary } from "@/configs/cloudinary";
// import { UploadOutlined } from "@ant-design/icons";
// import { useMutation, useQuery } from "@tanstack/react-query";
// import { Button, Form, Input, message, Upload, Modal, Spin } from "antd";
// import {  Link, useNavigate, useParams } from "react-router-dom";

// const Tagsedit: React.FC = () => {
//   const [form] = Form.useForm();
//   const nav = useNavigate();
//   const { id } = useParams();
//   const [imageUrl, setImageUrl] = useState<string | null>(null);
//   const [previewVisible, setPreviewVisible] = useState(false);
//   const [fileList, setFileList] = useState<any[]>([]);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const { data, isLoading, isError } = useQuery({
//     queryKey: ["tag", id],
//     queryFn: async () => {
//       try {
//         const response = await instance.get("/bosuutap/" + id);
//         setImageUrl(response.data.data.duong_dan_anh);
//         if (response.data.data.duong_dan_anh) {
//           setFileList([
//             {
//               uid: '-1',
//               name: 'image.png',
//               status: 'done',
//               url: response.data.data.duong_dan_anh,
//             },
//           ]);
//         }
//         return response.data;
//       } catch (error) {
//         console.error("Error fetching tag:", error);
//         throw new Error("Error fetching tag");
//       }
//     },
//   });

//   useEffect(() => {
//     if (data) {
//       form.setFieldsValue(data.data);
//     }
//   }, [data, form]);

//   const { mutate } = useMutation({
//     mutationFn: async (data: any) => {
//       const response = await instance.put(`/bosuutap/` + id, data);
//       return response.data;
//     },
//     onSuccess: () => {
//       message.success("Cập nhật thẻ đính kèm thành công");
//       nav("/admin/products/tags");
//     },
//     onError: (error) => {
//       message.error(error.message);
//     },
//     onSettled: () => {
//       setIsSubmitting(false);
//     },
//   });

//   const onFinish = async (values: any) => {
//     setIsSubmitting(true);
//     try {
//       let newImageUrl = imageUrl;
//       if (fileList.length > 0 && fileList[0].originFileObj) {
//         newImageUrl = await uploadToCloudinary(fileList[0].originFileObj);
//       }

//       const updatedData = {
//         ...values,
//         ten: values.ten,
//         duong_dan_anh: newImageUrl,
//       };
//       mutate(updatedData);
//     } catch (error) {
//       message.error("Lỗi khi tải ảnh lên");
//       setIsSubmitting(false);
//     }
//   };

//   const handlePreview = () => {
//     setPreviewVisible(true);
//   };

//   const handleChange = ({ fileList }: any) => {
//     setFileList(fileList);
//     if (fileList.length > 0 && fileList[0].originFileObj) {
//       setImageUrl(URL.createObjectURL(fileList[0].originFileObj));
//     } else {
//       setImageUrl(null);
//     }
//   };

//   // const handleRemove = () => {
//   //   setImageUrl(null);
//   //   setFileList([]);
//   // };

//   if (isLoading) return <p>Loading...</p>;
//   if (isError) return <p>Error</p>;

//   return (
//     <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
//         <div className="flex items-center">
//         <h1 className="md:text-base">
//           Quản trị /Bộ sưu tập /
//           <span className="font-semibold px-px"> Bộ sưu tập</span>
//         </h1>
//       </div>
//       <div className="flex items-center justify-between">
//         <h1 className="font-semibold md:text-3xl">Cập nhập bộ sưu tập</h1>
//         <div>
//           <Link to="/admin/products/tags" className="mr-1">
//             <Button className="bg-gradient-to-r  from-blue-500 to-blue-400 text-white rounded-lg py-1 hover:bg-blue-600 shadow-md transition-colors">
//               Quay lại
//             </Button>
//           </Link>
//         </div>
//       </div>
//       <div>
//         <div style={{ padding: 24, minHeight: 360 }}>
//           <div className="bg-white px-4 rounded-xl py-5 shadow-lg max-w-2xl">
//             <Form
//               form={form}
//               name="basic"
//               layout="vertical"
//               labelCol={{ span: 8 }}
//               wrapperCol={{ span: 24 }}
//               onFinish={onFinish}
//             >
//               <Form.Item
//                 label="Tên nhãn dán"
//                 name="ten"
//                 rules={[
//                   { required: true, message: "Tên nhãn dán bắt buộc phải nhập!" },
//                   { pattern: /^[^\s]+(\s+[^\s]+)*$/, message: "Vui lòng nhập chứa ký tự trắng!" },
//                 ]}
//               >
//                 <Input placeholder="Nhập tên nhãn dán" />
//               </Form.Item>

//               <Form.Item label="Ảnh" name="imageFile"
//                   getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
//                   rules={[{ required: true, message: "Vui lòng chọn ảnh!" }]}>
//                 <Upload
//                   listType="picture-card"
//                   fileList={fileList}
//                   onPreview={handlePreview}
//                   onChange={handleChange}
//                   beforeUpload={() => false}
//                   maxCount={1}
                  
//                 >
//                   {fileList.length === 0 && (
//                     <div>
//                       <UploadOutlined />
//                       <div style={{ marginTop: 8 }}>Tải ảnh lên</div>
//                     </div>
//                   )}
//                 </Upload>
//               </Form.Item>

   

//               <Form.Item>
//                 <Button
//                   type="primary"
//                   htmlType="submit"
//                   className="bg-gradient-to-r from-blue-500 to-blue-400 text-white rounded-lg py-1 hover:bg-blue-600 shadow-md transition-colors"
//                   disabled={isSubmitting}
//                 >
// {isSubmitting ? <><Spin size="small"/>Đang cập nhập...</> : "Cập nhật"}
// </Button>
//               </Form.Item>
//             </Form>
//           </div>
//         </div>
//       </div>

//       <Modal
//         visible={previewVisible}
//         title="Xem ảnh"
//         footer={null}
//         onCancel={() => setPreviewVisible(false)}
//       >
//         <img alt="example" style={{ width: '100%' }} src={imageUrl || undefined} />
//       </Modal>
//     </main>
//   );
// };

// export default Tagsedit;
import React, { useState, useEffect } from "react";
import instance from "@/configs/admin";
import { uploadToCloudinary } from "@/configs/cloudinary";
import { UploadOutlined } from "@ant-design/icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button, Form, Input, message, Upload, Modal, Spin, Select } from "antd";
import { Link, useNavigate, useParams } from "react-router-dom";

const Tagsedit: React.FC = () => {
  const [form] = Form.useForm();
  const nav = useNavigate();
  const { id } = useParams();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [fileList, setFileList] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [productOptions, setProductOptions] = useState<{ value: string; label: string }[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  const { data: tagData, isLoading: tagLoading, isError: tagError } = useQuery({
    queryKey: ["tag", id],
    queryFn: async () => {
      try {
        const response = await instance.get("/bosuutap/" + id);
        return response.data;
      } catch (error) {
        console.error("Error fetching tag:", error);
        throw new Error("Error fetching tag");
      }
    },
  });

  const { data: productsData, isLoading: productsLoading } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await instance.get('/sanpham');
      return response.data;
    },
  });

  useEffect(() => {
    if (productsData && productsData.data) {
      const options = productsData.data.map((product: { id: string; ten_san_pham: string }) => ({
        value: product.id,
        label: product.ten_san_pham
      }));
      setProductOptions(options);
    }
  }, [productsData]);

  useEffect(() => {
    if (tagData && tagData.data && productsData) {
      const tagProducts = tagData.data.san_pham || [];
      const selectedProductIds = tagProducts.map((product: any) => product.id);
      setSelectedProducts(selectedProductIds);
      
      setImageUrl(tagData.data.duong_dan_anh);
      if (tagData.data.duong_dan_anh) {
        setFileList([
          {
            uid: '-1',
            name: 'image.png',
            status: 'done',
            url: tagData.data.duong_dan_anh,
          },
        ]);
      }

      form.setFieldsValue({
        ten: tagData.data.ten,
        san_pham: selectedProductIds,
      });
    }
  }, [tagData, productsData, form]);

  const { mutate } = useMutation({
    mutationFn: async (data: any) => {
      const response = await instance.put(`/bosuutap/` + id, data);
      return response.data;
    },
    onSuccess: () => {
      message.success("Cập nhật bộ sưu tập thành công");
      nav("/admin/products/tags");
    },
    onError: (error) => {
      message.error(error.message);
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  const onFinish = async (values: any) => {
    setIsSubmitting(true);
    try {
      let newImageUrl = imageUrl;
      if (fileList.length > 0 && fileList[0].originFileObj) {
        newImageUrl = await uploadToCloudinary(fileList[0].originFileObj);
      }

      const updatedData = {
        ...values,
        ten: values.ten,
        duong_dan_anh: newImageUrl,
        san_pham: values.san_pham,
      };
      mutate(updatedData);
    } catch (error) {
      message.error("Lỗi khi tải ảnh lên");
      setIsSubmitting(false);
    }
  };

  const handlePreview = () => {
    setPreviewVisible(true);
  };

  const handleChange = ({ fileList }: any) => {
    setFileList(fileList);
    if (fileList.length > 0 && fileList[0].originFileObj) {
      setImageUrl(URL.createObjectURL(fileList[0].originFileObj));
    } else {
      setImageUrl(null);
    }
  };

  const handleSelectChange = (selectedValues: string[]) => {
    setSelectedProducts(selectedValues);
    form.setFieldsValue({ san_pham: selectedValues });
  };

  const handleSelectAll = () => {
    if (selectedProducts.length < productOptions.length) {
      const allProductIds = productOptions.map((option: { value: string }) => option.value);
      setSelectedProducts(allProductIds);
      form.setFieldsValue({ san_pham: allProductIds });
    } else {
      setSelectedProducts([]);
      form.setFieldsValue({ san_pham: [] });
    }
  };

  // if (tagLoading || productsLoading) return <p>Loading...</p>;
  
  if (tagLoading || productsLoading)
    return (
      <div className="flex items-center justify-center mt-[250px]">
        <Spin size="large" />
      </div>
    );
  if (tagError) return <p>Error loading tag data</p>;

  return (
          <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <div className="flex items-center">
        <h1 className="md:text-base">
          Quản trị /Bộ sưu tập /
          <span className="font-semibold px-px"> Bộ sưu tập</span>
        </h1>
      </div>
      <div className="flex items-center justify-between">
        <h1 className="font-semibold md:text-3xl">Cập nhập bộ sưu tập</h1>
        <div>
          <Link to="/admin/products/tags" className="mr-1">
            <Button className="bg-gradient-to-r  from-blue-500 to-blue-400 text-white rounded-lg py-1 hover:bg-blue-600 shadow-md transition-colors">
              Quay lại
            </Button>
          </Link>
        </div>
      </div>
      <div>
        <div style={{ padding: 24, minHeight: 360 }}>           <div className="bg-white px-4 rounded-xl py-5 shadow-lg max-w-2xl">
        <Form
        form={form}
        name="basic"
        layout="vertical"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 24 }}
        onFinish={onFinish}
      >
        <Form.Item
          label="Tên bộ sưu tập"
          name="ten"
          rules={[{ required: true, message: "Vui lòng nhập tên bộ sưu tập!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="Ảnh" name="imageFile">
          <Upload
            listType="picture-card"
            fileList={fileList}
            onPreview={handlePreview}
            onChange={handleChange}
            beforeUpload={() => false}
          >
            {fileList.length === 0 && <div>
              <UploadOutlined />
              <div style={{ marginTop: 8 }}>Upload</div>
            </div>}
          </Upload>
        </Form.Item>
        
        <Form.Item
          label="Chọn sản phẩm"
          name="san_pham"
          rules={[{ required: true, message: "Vui lòng chọn ít nhất một sản phẩm!" }]}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Select
              mode="multiple"
              style={{ width: '100%' }}
              placeholder="Chọn sản phẩm"
              options={productOptions}
              onChange={handleSelectChange}
              value={selectedProducts}
              filterOption={(input, option: any) =>
                option?.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              showSearch
            />
            <Button
              onClick={handleSelectAll}
              style={{ whiteSpace: 'nowrap' }}
            >
              {selectedProducts.length === productOptions.length ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
            </Button>
          </div>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="bg-gradient-to-r from-blue-500 to-blue-400 text-white rounded-lg py-1 hover:bg-blue-600 shadow-md transition-colors"
            disabled={isSubmitting}
          >
            {isSubmitting ? <><Spin size="small"/>Đang cập nhật...</> : "Cập nhật"}
          </Button>
        </Form.Item>
      </Form>
           </div>
           </div>
                 </div>
      <Modal
        visible={previewVisible}
        title="Xem trước"
        footer={null}
        onCancel={() => setPreviewVisible(false)}
      >
        <img alt="example" style={{ width: '100%' }} src={imageUrl || undefined} />
      </Modal>
    </main>
  );
};

export default Tagsedit;
