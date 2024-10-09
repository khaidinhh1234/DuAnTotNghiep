// import { IChuongTrinhUuDai } from "@/common/types/chuongtrinhuudai";
// import { ISanPham } from "@/common/types/sanpham";
// import instance from "@/configs/admin";
// import { uploadToCloudinary } from "@/configs/cloudinary";
// import { UploadOutlined } from "@ant-design/icons";
// import { useMutation, useQuery } from "@tanstack/react-query";
// import { Button, Form, Input, Select, Upload, message, DatePicker } from "antd";
// import { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";

// const { RangePicker } = DatePicker;

// const ChuongTrinhUuDaiAdd = () => {
//   const [form] = Form.useForm();
//   const nav = useNavigate();
//   const [allProducts, setAllProducts] = useState<ISanPham[]>([]);

//   const { data: allProductsData } = useQuery({
//     queryKey: ["allProducts"],
//     queryFn: async () => {
//       const response = await instance.get("/sanpham");
//       return response.data;
//     },
//   });

//   useEffect(() => {
//     if (allProductsData) {
//       setAllProducts(allProductsData.data);
//     }
//   }, [allProductsData]);

//   const { mutate } = useMutation({
//     mutationFn: async (chuongTrinhUuDai: IChuongTrinhUuDai) => {
//       const response = await instance.post(`/chuongtrinhuudai`, chuongTrinhUuDai);
//       return response.data;
//     },
//     onSuccess: () => {
//       message.success("Thêm chương trình ưu đãi thành công");
//       form.resetFields();
//       nav("/admin/chuongtrinhuudai");
//     },
//     onError: (error) => {
//       message.error(error.message);
//     },
//   });

//   const onFinish = async (values: any) => {
//     try {
//       let imageUrl = null;
//       if (values.imageFile && values.imageFile[0]) {
//         imageUrl = await uploadToCloudinary(values.imageFile[0].originFileObj);
//       }

//       const [startDate, endDate] = values.date_range;

//       const chuongTrinhUuDaiData: IChuongTrinhUuDai = {
//         ten_uu_dai: values.ten_uu_dai,
//         duong_dan_anh: imageUrl,
//         ngay_hien_thi: values.ngay_hien_thi.format('YYYY-MM-DD'),
//         mo_ta: values.mo_ta,
//         ngay_bat_dau: startDate.format('YYYY-MM-DD'),
//         ngay_ket_thuc: endDate.format('YYYY-MM-DD'),
//         gia_tri_uu_dai: values.gia_tri_uu_dai,
//         loai: values.loai,
//         san_pham: values.san_pham,
//       };

//       mutate(chuongTrinhUuDaiData);
//     } catch (error) {
//       message.error("Lỗi khi tải ảnh lên");
//     }
//   };

//   return (
//     <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
//       <div className="flex items-center">
//         <h1 className="md:text-base">
//           Quản trị / Chương trình ưu đãi /
//           <span className="font-semibold px-px"> Thêm chương trình ưu đãi</span>
//         </h1>
//       </div>
//       <div className="flex items-center justify-between">
//         <h1 className="font-semibold md:text-3xl">Thêm chương trình ưu đãi</h1>
//         <div>
//           <Link to="/admin/chuongtrinhuudai" className="mr-1">
//             <Button className="bg-gradient-to-r from-blue-500 to-blue-400 text-white rounded-lg py-1 hover:bg-blue-600 shadow-md transition-colors">
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
//               autoComplete="off"
//               onFinish={onFinish}
//             >
//               <Form.Item
//                 label="Tên ưu đãi"
//                 name="ten_uu_dai"
//                 rules={[{ required: true, message: "Vui lòng nhập tên ưu đãi!" }]}
//               >
//                 <Input placeholder="Nhập tên ưu đãi" />
//               </Form.Item>

//               <Form.Item
//                 label="Thêm ảnh"
//                 name="imageFile"
//                 valuePropName="fileList"
//                 getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
//                 rules={[{ required: true, message: "Vui lòng chọn ảnh!" }]}
//               >
//                 <Upload
//                   listType="picture"
//                   maxCount={1}
//                   beforeUpload={() => false}
//                 >
//                   <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
//                 </Upload>
//               </Form.Item>

//               <Form.Item
//                 label="Ngày hiển thị"
//                 name="ngay_hien_thi"
//                 rules={[{ required: true, message: "Vui lòng chọn ngày hiển thị!" }]}
//               >
//                 <DatePicker />
//               </Form.Item>

//               <Form.Item
//                 label="Mô tả"
//                 name="mo_ta"
//                 rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
//               >
//                 <Input.TextArea rows={4} placeholder="Nhập mô tả" />
//               </Form.Item>

//               <Form.Item
//                 label="Thời gian ưu đãi"
//                 name="date_range"
//                 rules={[{ required: true, message: "Vui lòng chọn thời gian ưu đãi!" }]}
//               >
//                 <RangePicker />
//               </Form.Item>

//               <Form.Item
//                 label="Giá trị ưu đãi"
//                 name="gia_tri_uu_dai"
//                 rules={[{ required: true, message: "Vui lòng nhập giá trị ưu đãi!" }]}
//               >
//                 <Input type="number" placeholder="Nhập giá trị ưu đãi" />
//               </Form.Item>

//               <Form.Item
//                 label="Loại ưu đãi"
//                 name="loai"
//                 rules={[{ required: true, message: "Vui lòng chọn loại ưu đãi!" }]}
//               >
//                 <Select placeholder="Chọn loại ưu đãi">
//                   <Select.Option value="phan_tram">Phần trăm</Select.Option>
//                   <Select.Option value="tien">Tiền</Select.Option>
//                 </Select>
//               </Form.Item>

//               <Form.Item
//                 label="Sản phẩm áp dụng"
//                 name="san_pham"
//                 rules={[{ required: true, message: "Vui lòng chọn sản phẩm áp dụng!" }]}
//               >
//                 <Select mode="multiple" placeholder="Chọn sản phẩm áp dụng">
//                   {allProducts.map((product) => (
//                     <Select.Option key={product.id} value={product.id}>
//                       {product.ten_san_pham}
//                     </Select.Option>
//                   ))}
//                 </Select>
//               </Form.Item>

//               <Form.Item>
//                 <Button
//                   type="primary"
//                   htmlType="submit"
//                   className="bg-gradient-to-r from-blue-500 to-blue-400 text-white rounded-lg py-1 hover:bg-blue-600 shadow-md transition-colors"
//                 >
//                   Thêm chương trình ưu đãi
//                 </Button>
//               </Form.Item>
//             </Form>
//           </div>
//         </div>
//       </div>
//     </main>
//   );
// };

// export default ChuongTrinhUuDaiAdd;
// import { IChuongTrinhUuDai } from "@/common/types/chuongtrinhuudai";
// import { ISanPham } from "@/common/types/sanpham";
// import instance from "@/configs/admin";
// import { uploadToCloudinary } from "@/configs/cloudinary";
// import { UploadOutlined } from "@ant-design/icons";
// import { useMutation, useQuery } from "@tanstack/react-query";
// import { Button, Form, Input, Select, Upload, message, DatePicker } from "antd";
// import { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";

// const { RangePicker } = DatePicker;

// const ChuongTrinhUuDaiAdd = () => {
//   const [form] = Form.useForm();
//   const nav = useNavigate();
//   const [allProducts, setAllProducts] = useState<ISanPham[]>([]);
//   const [selectedProducts, setSelectedProducts] = useState<number[]>([]);

//   const { data: allProductsData } = useQuery({
//     queryKey: ["allProducts"],
//     queryFn: async () => {
//       const response = await instance.get("/sanpham");
//       return response.data;
//     },
//   });

//   useEffect(() => {
//     if (allProductsData) {
//       setAllProducts(allProductsData.data);
//     }
//   }, [allProductsData]);

//   const { mutate } = useMutation({
//     mutationFn: async (chuongTrinhUuDai: IChuongTrinhUuDai) => {
//       const response = await instance.post(`/chuongtrinhuudai`, chuongTrinhUuDai);
//       return response.data;
//     },
//     onSuccess: () => {
//       message.success("Thêm chương trình ưu đãi thành công");
//       form.resetFields();
//       nav("/admin/chuongtrinhuudai");
//     },
//     onError: (error) => {
//       message.error(error.message);
//     },
//   });

//   const onFinish = async (values: any) => {
//     try {
//       let imageUrl = null;
//       if (values.imageFile && values.imageFile[0]) {
//         imageUrl = await uploadToCloudinary(values.imageFile[0].originFileObj);
//       }

//       const [startDate, endDate] = values.date_range;

//       const chuongTrinhUuDaiData: IChuongTrinhUuDai = {
//         ten_uu_dai: values.ten_uu_dai,
//         duong_dan_anh: imageUrl,
//         ngay_hien_thi: values.ngay_hien_thi.format('YYYY-MM-DD'),
//         mo_ta: values.mo_ta,
//         ngay_bat_dau: startDate.format('YYYY-MM-DD'),
//         ngay_ket_thuc: endDate.format('YYYY-MM-DD'),
//         gia_tri_uu_dai: values.gia_tri_uu_dai,
//         loai: values.loai,
//         san_pham: selectedProducts,
//       };

//       mutate(chuongTrinhUuDaiData);
//     } catch (error) {
//       message.error("Lỗi khi tải ảnh lên");
//     }
//   };

//   const handleProductChange = (selectedValues: number[]) => {
//     setSelectedProducts(selectedValues);
//   };

//   const handleSelectAll = (selected: boolean) => {
//     if (selected) {
//       setSelectedProducts(allProducts.map(product => product.id));
//     } else {
//       setSelectedProducts([]);
//     }
//   };

//   return (
//     <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
//       <div className="flex items-center">
//         <h1 className="md:text-base">
//           Quản trị / Chương trình ưu đãi /
//           <span className="font-semibold px-px"> Thêm chương trình ưu đãi</span>
//         </h1>
//       </div>
//       <div className="flex items-center justify-between">
//         <h1 className="font-semibold md:text-3xl">Thêm chương trình ưu đãi</h1>
//         <div>
//           <Link to="/admin/chuongtrinhuudai" className="mr-1">
//             <Button className="bg-gradient-to-r from-blue-500 to-blue-400 text-white rounded-lg py-1 hover:bg-blue-600 shadow-md transition-colors">
//               Quay lại
//             </Button>
//           </Link>
//         </div>
//       </div>
//       <div>
//         <div style={{ padding: 24, minHeight: 360 }}>
//           <div className="bg-white px-4 rounded-xl py-5 shadow-lg max-w-7xl">
//             <Form
//               form={form}
//               name="basic"
//               layout="vertical"
//               labelCol={{ span: 8 }}
//               wrapperCol={{ span: 24 }}
//               autoComplete="off"
//               onFinish={onFinish}
//             >
//               <Form.Item
//                 label="Tên ưu đãi"
//                 name="ten_uu_dai"
//                 rules={[{ required: true, message: "Vui lòng nhập tên ưu đãi!" }]}
//               >
//                 <Input placeholder="Nhập tên ưu đãi" />
//               </Form.Item>

//               <Form.Item
//                 label="Thêm ảnh"
//                 name="imageFile"
//                 valuePropName="fileList"
//                 getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
//                 rules={[{ required: true, message: "Vui lòng chọn ảnh!" }]}
//               >
//                 <Upload
//                   listType="picture"
//                   maxCount={1}
//                   beforeUpload={() => false}
//                 >
//                   <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
//                 </Upload>
//               </Form.Item>

//               <Form.Item
//                 label="Ngày hiển thị"
//                 name="ngay_hien_thi"
//                 rules={[{ required: true, message: "Vui lòng chọn ngày hiển thị!" }]}
//               >
//                 <DatePicker />
//               </Form.Item>

//               <Form.Item
//                 label="Mô tả"
//                 name="mo_ta"
//                 rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
//               >
//                 <Input.TextArea rows={4} placeholder="Nhập mô tả" />
//               </Form.Item>

//               <Form.Item
//                 label="Thời gian ưu đãi"
//                 name="date_range"
//                 rules={[{ required: true, message: "Vui lòng chọn thời gian ưu đãi!" }]}
//               >
//                 <RangePicker />
//               </Form.Item>
//               <Form.Item label="Loại và giá trị ưu đãi">
//   <Input.Group compact>
//     <Form.Item
//       name="loai"
//       rules={[{ required: true, message: "Vui lòng chọn loại ưu đãi!" }]}
//       style={{ marginBottom: 0, marginRight: 8 }}
//     >
//       <Select placeholder="Chọn loại ưu đãi" style={{ width: 610 }}>
//         <Select.Option value="phan_tram">Phần trăm</Select.Option>
//         <Select.Option value="tien">Tiền</Select.Option>
//       </Select>
//     </Form.Item>
//     <Form.Item
//       name="gia_tri_uu_dai"
//       rules={[{ required: true, message: "Vui lòng nhập giá trị ưu đãi!" }]}
//       style={{ marginBottom: 0 }}
//     >
//       <Input type="number" placeholder="Nhập giá trị ưu đãi" style={{ width: 620 }} />
//     </Form.Item>
//   </Input.Group>
// </Form.Item>

//               <Form.Item
//                 label="Sản phẩm áp dụng"
//                 name="san_pham"
//                 rules={[{ required: true, message: "Vui lòng chọn sản phẩm áp dụng!" }]}
//               >
//                 <Select
//                   mode="multiple"
//                   placeholder="Chọn sản phẩm áp dụng"
//                   value={selectedProducts}
//                   onChange={handleProductChange}
//                   showSearch
//                   filterOption={(input, option) =>
//                     (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
//                   }
//                   options={[
//                     { label: selectedProducts.length === allProducts.length ? 'Bỏ chọn tất cả' : 'Chọn tất cả', value: -1 },
//                     ...allProducts.map((product) => ({
//                       label: product.ten_san_pham,
//                       value: product.id,
//                     })),
//                   ]}
//                   onSelect={(value) => {
//                     if (value === -1) {
//                       handleSelectAll(selectedProducts.length !== allProducts.length);
//                     }
//                   }}
//                 />
//               </Form.Item>

//               <Form.Item>
//                 <Button
//                   type="primary"
//                   htmlType="submit"
//                   className="bg-gradient-to-r from-blue-500 to-blue-400 text-white rounded-lg py-1 hover:bg-blue-600 shadow-md transition-colors"
//                 >
//                   Thêm chương trình ưu đãi
//                 </Button>
//               </Form.Item>
//             </Form>
//           </div>
//         </div>
//       </div>
//     </main>
//   );
// };

// export default ChuongTrinhUuDaiAdd;
import { IChuongTrinhUuDai } from "@/common/types/chuongtrinhuudai";
import { ISanPham } from "@/common/types/sanpham";
import { IDanhMuc } from "@/common/types/danhmuc";
import instance from "@/configs/admin";
import { uploadToCloudinary } from "@/configs/cloudinary";
import { UploadOutlined } from "@ant-design/icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button, Form, Input, Select, Upload, message, DatePicker, TreeSelect, Col, Row } from "antd";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const { RangePicker } = DatePicker;

const ChuongTrinhUuDaiAdd = () => {
  const [form] = Form.useForm();
  const nav = useNavigate();
  const [allProducts, setAllProducts] = useState<ISanPham[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [categories, setCategories] = useState<IDanhMuc[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ISanPham[]>([]);

  const { data: allProductsData } = useQuery({
    queryKey: ["allProducts"],
    queryFn: async () => {
      const response = await instance.get("/sanpham");
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

  useEffect(() => {
    if (allProductsData) {
      setAllProducts(allProductsData.data);
      setFilteredProducts(allProductsData.data);
    }
    if (categoriesData) {
      setCategories(categoriesData.data);
    }
  }, [allProductsData, categoriesData]);

  const { mutate } = useMutation({
    mutationFn: async (chuongTrinhUuDai: IChuongTrinhUuDai) => {
      const response = await instance.post(`/chuongtrinhuudai`, chuongTrinhUuDai);
      return response.data;
    },
    onSuccess: () => {
      message.success("Thêm chương trình ưu đãi thành công");
      form.resetFields();
      nav("/admin/chuongtrinhuudai");
    },
    onError: (error) => {
      message.error(error.message);
    },
  });

  const onFinish = async (values: any) => {
    try {
      let imageUrl = null;
      if (values.imageFile && values.imageFile[0]) {
        imageUrl = await uploadToCloudinary(values.imageFile[0].originFileObj);
      }

      const [startDate, endDate] = values.date_range;

      const chuongTrinhUuDaiData: IChuongTrinhUuDai = {
        ten_uu_dai: values.ten_uu_dai,
        duong_dan_anh: imageUrl,
        ngay_hien_thi: values.ngay_hien_thi.format('YYYY-MM-DD'),
        mo_ta: values.mo_ta,
        ngay_bat_dau: startDate.format('YYYY-MM-DD'),
        ngay_ket_thuc: endDate.format('YYYY-MM-DD'),
        gia_tri_uu_dai: values.gia_tri_uu_dai,
        loai: values.loai,
        san_pham: selectedProducts,
      };

      mutate(chuongTrinhUuDaiData);
    } catch (error) {
      message.error("Lỗi khi tải ảnh lên");
    }
  };

  const handleProductChange = (selectedValues: number[]) => {
    setSelectedProducts(selectedValues);
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedProducts(filteredProducts.map(product => product.id));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleCategoryChange = (selectedCategories: string[]) => {
    if (selectedCategories.length === 0) {
      setFilteredProducts(allProducts);
    } else {
      const filtered = allProducts.filter(product => 
        selectedCategories.includes(product.danh_muc_id.toString())
      );
      setFilteredProducts(filtered);
    }
    setSelectedProducts([]);
  };

  const renderTreeNodes = (data: IDanhMuc[]) => 
    data.map((item) => ({
      title: item.ten_danh_muc,
      value: item.id.toString(),
      children: item.children ? renderTreeNodes(item.children) : [],
    }));

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="md:text-base">
          Quản trị / Chương trình ưu đãi /
          <span className="font-semibold px-px"> Thêm chương trình ưu đãi</span>
        </h1>
      </div>
      <div className="flex items-center justify-between">
        <h1 className="font-semibold md:text-3xl">Thêm chương trình ưu đãi</h1>
        <div>
          <Link to="/admin/chuongtrinhuudai" className="mr-1">
            <Button className="bg-gradient-to-r from-blue-500 to-blue-400 text-white rounded-lg py-1 hover:bg-blue-600 shadow-md transition-colors">
              Quay lại
            </Button>
          </Link>
        </div>
      </div>
      <div>
        <div style={{ padding: 24, minHeight: 360 }}>
          <div className="bg-white px-4 rounded-xl py-5 shadow-lg max-w-7xl">
            <Form
              form={form}
              name="basic"
              layout="vertical"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 24 }}
              autoComplete="off"
              onFinish={onFinish}
            >
              <Form.Item
                label="Tên ưu đãi"
                name="ten_uu_dai"
                rules={[{ required: true, message: "Vui lòng nhập tên ưu đãi!" }]}
              >
                <Input placeholder="Nhập tên ưu đãi" />
              </Form.Item>

              <Form.Item
                label="Thêm ảnh"
                name="imageFile"
                valuePropName="fileList"
                getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
                rules={[{ required: true, message: "Vui lòng chọn ảnh!" }]}
              >
                <Upload
                  listType="picture"
                  maxCount={1}
                  beforeUpload={() => false}
                >
                  <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
                </Upload>
              </Form.Item>

              <Form.Item
                label="Ngày hiển thị"
                name="ngay_hien_thi"
                rules={[{ required: true, message: "Vui lòng chọn ngày hiển thị!" }]}
              >
                <DatePicker />
              </Form.Item>

              <Form.Item
                label="Mô tả"
                name="mo_ta"
                rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
              >
                <Input.TextArea rows={4} placeholder="Nhập mô tả" />
              </Form.Item>

              <Form.Item
                label="Thời gian ưu đãi"
                name="date_range"
                rules={[{ required: true, message: "Vui lòng chọn thời gian ưu đãi!" }]}
              >
                <RangePicker />
              </Form.Item>

              <Form.Item label="Loại và giá trị ưu đãi">
                <Input.Group compact>
                  <Form.Item
                    name="loai"
                    rules={[{ required: true, message: "Vui lòng chọn loại ưu đãi!" }]}
                    style={{ marginBottom: 0, marginRight: 8 }}
                  >
                    <Select placeholder="Chọn loại ưu đãi" style={{ width: 610 }}>
                      <Select.Option value="phan_tram">Phần trăm</Select.Option>
                      <Select.Option value="tien">Tiền</Select.Option>
                    </Select>
                  </Form.Item>
                  <Form.Item
                    name="gia_tri_uu_dai"
                    rules={[{ required: true, message: "Vui lòng nhập giá trị ưu đãi!" }]}
                    style={{ marginBottom: 0 }}
                  >
                    <Input type="number" placeholder="Nhập giá trị ưu đãi" style={{ width: 620 }} />
                  </Form.Item>
                </Input.Group>
              </Form.Item>

              <Row gutter={16}>
      <Col span={10}>
        <Form.Item label="Lọc theo danh mục">
          <TreeSelect
            treeData={renderTreeNodes(categories)}
            onChange={handleCategoryChange}
            treeCheckable
            showCheckedStrategy={TreeSelect.SHOW_PARENT}
            placeholder="Chọn danh mục"
            style={{ width: '100%' }}
          />
        </Form.Item>
      </Col>
      <Col span={14}>
        <Form.Item
          label="Sản phẩm áp dụng"
          name="san_pham"
          rules={[{ required: true, message: "Vui lòng chọn sản phẩm áp dụng!" }]}
        >
          <Select
            mode="multiple"
            placeholder="Chọn sản phẩm áp dụng"
            value={selectedProducts}
            onChange={handleProductChange}
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            options={[
              { label: selectedProducts.length === filteredProducts.length ? 'Bỏ chọn tất cả' : 'Chọn tất cả', value: -1 },
              ...filteredProducts.map((product) => ({
                label: product.ten_san_pham,
                value: product.id,
              })),
            ]}
            onSelect={(value) => {
              if (value === -1) {
                handleSelectAll(selectedProducts.length !== filteredProducts.length);
              }
            }}
          />
        </Form.Item>
      </Col>
    </Row>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="bg-gradient-to-r from-blue-500 to-blue-400 text-white rounded-lg py-1 hover:bg-blue-600 shadow-md transition-colors"
                >
                  Thêm chương trình ưu đãi
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ChuongTrinhUuDaiAdd;
