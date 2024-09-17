// import { DeleteOutlined, Loading3QuartersOutlined } from "@ant-design/icons";
// import {
//   Breadcrumb,
//   Button,
//   Checkbox,
//   Form,
//   Input,
//   InputNumber,
//   Select,
// } from "antd";

// import TextArea from "antd/es/input/TextArea";

// import { Link } from "react-router-dom";

// const ProductsAdd = () => {
//   return (
//     <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
//       <div className="flex items-center">
//         <h1 className=" md:text-base">
//           Quản trị / Sản phẩm /
//           <span className="font-semibold px-px="> Thêm sản phẩm</span>{" "}
//         </h1>
//       </div>
//       <div className="flex items-center justify-between">
//         <h1 className=" font-semibold md:text-3xl"> Thêm sản phẩm </h1>
//         <div>
//           {" "}
//           <Link to="/admin/products/add" className="mr-1">
//             <Button className="ml-auto bg-black text-white rounded-lg  py-1">
//               Quay lại
//             </Button>
//           </Link>
//         </div>
//       </div>
//       <div>
//         <div
//           style={{
//             padding: 24,
//             minHeight: 360,
//           }}
//         >
//           <div className="bg-white  px-4  rounded-xl py-5 shadow-lg max-w-6xl  mx-10">
//             <Form
//               // form={form}
//               name="basic"
//               layout={"vertical"}
//               labelCol={{ span: 8 }}
//               wrapperCol={{ span: 24 }}
//               style={{ maxWidth: 1000 }}
//               className="mx-10 my-5"
//               // initialValues={{ remember: true }}
//               // onFinish={onFinish}
//               autoComplete="off"
//             >
//               <div className="grid grid-cols-2 gap-5">
//                 <Form.Item
//                   label="Tên sản phẩm"
//                   name="name"
//                   rules={[
//                     {
//                       required: true,
//                       message: "Tên sản phẩm bắt buộc phải nhập!",
//                     },
//                   ]}
//                 >
//                   <Input placeholder="Nhập tên sản phẩm" />
//                 </Form.Item>
//                 <Form.Item label="Danh mục sản phẩm" name="category">
//                   <Select
//                     defaultValue="Vui long chon danh muc"
//                     className="w-[490px]"
//                     // onChange={handleChange}
//                     //   options={
//                     //     category?.map((item: ICategory) => ({
//                     //       value: item._id,
//                     //       label: item.name,
//                     //     })) || []
//                     //   }
//                   />
//                 </Form.Item>
//               </div>

//               <div className="grid grid-cols-2 gap-5">
//                 <Form.Item
//                   label="Mô tả ngắn"
//                   name="description"
//                   rules={[
//                     {
//                       required: true,
//                       message: "Tên sản phẩm bắt buộc phải nhập!",
//                     },
//                   ]}
//                 >
//                   <TextArea rows={5} placeholder="Nhập mô tả sản phẩm" />
//                 </Form.Item>
//                 <Form.Item
//                   label="Nội dung"
//                   name="description"
//                   rules={[
//                     {
//                       required: true,
//                       message: "Tên sản phẩm bắt buộc phải nhập!",
//                     },
//                   ]}
//                 >
//                   <TextArea rows={5} placeholder="Nhập mô tả sản phẩm" />
//                 </Form.Item>
//               </div>
//               <div className="grid grid-cols-2 gap-5">
//                 <div>
//                   <Form.Item
//                     className=""
//                     label="Ảnh nổi bật "
//                     name="feature_image"
//                   >
//                     {/* <Upload
//                         action="https://api.cloudinary.com/v1_1/dpypwbeis/image/upload"
//                         data={{ upload_preset: "ml_default" }}
//                         listType="picture-card"
//                         fileList={fileList}
//                         onPreview={handlePreview}
//                         onChange={handleChange}
//                       >
//                         {fileList.length >= 1 ? null : uploadButton}
//                       </Upload>
//                       {previewImage && (
//                         <Image
//                           wrapperStyle={{ display: "none" }}
//                           preview={{
//                             visible: previewOpen,
//                             onVisibleChange: (visible) =>
//                               setPreviewOpen(visible),
//                             afterOpenChange: (visible) =>
//                               !visible && setPreviewImage(""),
//                           }}
//                           src={previewImage}
//                         />
//                       )}{" "} */}
//                   </Form.Item>{" "}
//                   <Form.Item
//                     label="Sản phẩm nổi bật"
//                     name="featured"
//                     valuePropName="checked"
//                     // initialValue={false}
//                   >
//                     <Checkbox />
//                   </Form.Item>
//                 </div>
//                 <Form.Item
//                   className=""
//                   label="số lượng sản phẩm"
//                   name="countIn_stock"
//                   rules={[
//                     {
//                       required: true,
//                       message: "Số lượng sản phẩm bắt buộc phải nhập!",
//                     },
//                   ]}
//                 >
//                   <Input placeholder="Nhập số lượng sản phẩm" />
//                 </Form.Item>{" "}
//               </div>
//               <Form.Item>
//                 <button
//                   type="submit"
//                   className="px-3 py-2 bg-black text-white rounded-lg"
//                 >
//                   {/* {isPending ? ( */}
//                   <>
//                     <Loading3QuartersOutlined className="animate-spin" /> Submit
//                   </>
//                   {/* ) : (
//                       "Submit"
//                     )} */}
//                 </button>
//               </Form.Item>
//             </Form>
//           </div>
//         </div>
//       </div>
//     </main>
//   );
// };

// export default ProductsAdd;
// import { Tabs } from "antd";
// import { Loading3QuartersOutlined } from "@ant-design/icons";
// import { Button, Checkbox, Form, Input, InputNumber, Select,  } from "antd";
// import { Link } from "react-router-dom";
// const { TextArea } = Input;
// const { TabPane } = Tabs;
// const { Option } = Select;

// const ProductsAndVariants = () => {
//   const sizes = ["S", "M", "L", "XL", "XXL"]; // Danh sách size có sẵn
//   const colors = ["Đỏ", "Xanh", "Đen", "Trắng", "Vàng"]; // Danh sách màu sắc có sẵn

//   return (
//     <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
//       <div className="flex items-center">
//         <h1 className="md:text-base">
//           Quản trị / Sản phẩm / 
//           <span className="font-semibold px-px="> Thêm sản phẩm và biến thể</span>
//         </h1>
//       </div>

//       <Tabs defaultActiveKey="1">
//         {/* Tab Sản phẩm */}
//         <TabPane tab="Sản phẩm" key="1">
//           <div className="flex items-center justify-between">
//             <h1 className="font-semibold md:text-3xl">Thêm sản phẩm</h1>
//             <div>
//               <Link to="/admin/products" className="mr-1">
//                 <Button className="ml-auto bg-black text-white rounded-lg py-1">
//                   Quay lại
//                 </Button>
//               </Link>
//             </div>
//           </div>
//           <div>
//             <div
//               style={{
//                 padding: 24,
//                 minHeight: 360,
//               }}
//             >
//               <div className="bg-white px-4 rounded-xl py-5 shadow-lg max-w-6xl mx-10">
//                 <Form
//                   name="product"
//                   layout={"vertical"}
//                   labelCol={{ span: 8 }}
//                   wrapperCol={{ span: 24 }}
//                   style={{ maxWidth: 1000 }}
//                   className="mx-10 my-5"
//                   autoComplete="off"
//                 >
//                   <div className="grid grid-cols-2 gap-5">
//                     <Form.Item
//                       label="Tên sản phẩm"
//                       name="name"
//                       rules={[{ required: true, message: "Tên sản phẩm bắt buộc phải nhập!" }]}
//                     >
//                       <Input placeholder="Nhập tên sản phẩm" />
//                     </Form.Item>
//                     <Form.Item label="Danh mục sản phẩm" name="category">
//                       <Select defaultValue="Vui lòng chọn danh mục" className="w-[320px]" />
//                     </Form.Item>
//                   </div>

//                   <div className="grid grid-cols-2 gap-5">
//                     <Form.Item
//                       label="Mô tả ngắn"
//                       name="description"
//                       rules={[{ required: true, message: "Mô tả ngắn bắt buộc phải nhập!" }]}
//                     >
//                       <TextArea rows={5} placeholder="Nhập mô tả sản phẩm" />
//                     </Form.Item>
//                     <Form.Item
//                       label="Nội dung"
//                       name="content"
//                       rules={[{ required: true, message: "Nội dung sản phẩm bắt buộc phải nhập!" }]}
//                     >
//                       <TextArea rows={5} placeholder="Nhập nội dung sản phẩm" />
//                     </Form.Item>
//                   </div>

//                   <div className="grid grid-cols-2 gap-5">
//                     <Form.Item
//                       label="Ảnh nổi bật"
//                       name="feature_image"
//                     >
//                       {/* Upload ảnh */}
//                     </Form.Item>
//                     <Form.Item
//                       label="Sản phẩm nổi bật"
//                       name="featured"
//                       valuePropName="checked"
//                     >
//                       <Checkbox />
//                     </Form.Item>
//                   </div>

//                   <Form.Item>
//                     <button type="submit" className="px-3 py-2 bg-black text-white rounded-lg">
//                       <Loading3QuartersOutlined className="animate-spin" /> Submit
//                     </button>
//                   </Form.Item>
//                 </Form>
//               </div>
//             </div>
//           </div>
//         </TabPane>

//         {/* Tab Biến thể */}
//         <TabPane tab="Biến thể" key="2">
//           <div className="flex items-center justify-between">
//             <h1 className="font-semibold md:text-3xl">Thêm biến thể</h1>
//             <div>
//               <Link to="/admin/products/variants" className="mr-1">
//                 <Button className="ml-auto bg-black text-white rounded-lg py-1">
//                   Quay lại
//                 </Button>
//               </Link>
//             </div>
//           </div>
//           <div>
//             <div
//               style={{
//                 padding: 24,
//                 minHeight: 360,
//               }}
//             >
//               <div className="bg-white px-4 rounded-xl py-5 shadow-lg max-w-6xl mx-10">
//                 <Form
//                   name="variant"
//                   layout={"vertical"}
//                   labelCol={{ span: 8 }}
//                   wrapperCol={{ span: 24 }}
//                   style={{ maxWidth: 1000 }}
//                   className="mx-10 my-5"
//                   autoComplete="off"
//                 >
//                   <div className="grid grid-cols-2 gap-5">
//                     {/* Select size có thể chọn nhiều */}
//                     <Form.Item
//                       label="Chọn size"
//                       name="sizes"
//                       rules={[
//                         { required: true, message: "Hãy chọn ít nhất 1 size!" },
//                       ]}
//                     >
//                       <Select
//                         mode="multiple"
//                         placeholder="Chọn size"
//                         className="w-full"
//                       >
//                         {sizes.map((size) => (
//                           <Option key={size} value={size}>
//                             {size}
//                           </Option>
//                         ))}
//                       </Select>
//                     </Form.Item>

//                     {/* Select màu sắc có thể chọn nhiều */}
//                     <Form.Item
//                       label="màu sắc"
//                       name="colors"
//                       rules={[
//                         { required: true, message: "Hãy chọn ít nhất 1 màu!" },
//                       ]}
//                     >
//                       <Select
//                         mode="multiple"
//                         placeholder="Chọn màu sắc"
//                         className="w-full"
//                       >
//                         {colors.map((color) => (
//                           <Option key={color} value={color}>
//                             {color}
//                           </Option>
//                         ))}
//                       </Select>
//                     </Form.Item>
//                   </div>

//                   <div className="grid grid-cols-2 gap-5">
//                     <Form.Item
//                       label="Số lượng"
//                       name="count"
//                       rules={[
//                         { required: true, message: "Số lượng bắt buộc phải nhập!" },
//                       ]}
//                     >
//                       <InputNumber className="w-full" placeholder="Nhập số lượng biến thể" />
//                     </Form.Item>
//                   </div>

//                   <Form.Item>
//                     <button type="submit" className="px-3 py-2 bg-black text-white rounded-lg">
//                       <Loading3QuartersOutlined className="animate-spin" /> Submit
//                     </button>
//                   </Form.Item>
//                 </Form>
//               </div>
//             </div>
//           </div>
//         </TabPane>
//       </Tabs>
//     </main>
//   );
// };

// export default ProductsAndVariants;
import { Tabs, Button, Form, Select, Radio, Input, Table, Upload } from "antd";
import { useState } from "react";
import { Loading3QuartersOutlined, UploadOutlined } from "@ant-design/icons"; 
import { Link } from "react-router-dom";
import TextArea from "antd/es/input/TextArea";
import Checkbox from "antd/es/checkbox/Checkbox";

const { TabPane } = Tabs;
const { Option } = Select;

// Ánh xạ tên màu thành mã màu hex
const colorMapping = {
  "Đỏ": "#FF0000",
  "Xanh": "#0000FF",
  "Đen": "#000000",
  "Trắng": "#FFFFFF",
  "Vàng": "#FFFF00",
};

const ProductsAndVariants = () => {
  const initialSizes = ["S", "M", "L", "XL", "XXL"];
  const initialColors = ["Đỏ", "Xanh", "Đen", "Trắng", "Vàng"];

  const [sizes, setSizes] = useState(initialSizes);
  const [colors, setColors] = useState(initialColors);
  const [newSize, setNewSize] = useState("");
  const [newColor, setNewColor] = useState("");
  const [selectedOption, setSelectedOption] = useState([]);
  const [variants, setVariants] = useState([]);
  const [fileList, setFileList] = useState([]); // Thêm state cho fileList
  
  const [form] = Form.useForm();

  const handleAddOption = (option) => {
    if (!selectedOption.includes(option)) {
      setSelectedOption([...selectedOption, option]);
    }
  };

  const handleRemoveOption = (option) => {
    setSelectedOption(selectedOption.filter((item) => item !== option));
  };

  const handleSelectAllSizes = () => {
    form.setFieldsValue({ sizes: sizes });
  };

  const handleSelectAllColors = () => {
    form.setFieldsValue({ colors: colors });
  };

  const handleAddSize = () => {
    if (newSize && !sizes.includes(newSize)) {
      setSizes([...sizes, newSize]);
      setNewSize("");
    }
  };

  const handleAddColor = () => {
    if (newColor && !colors.includes(newColor)) {
      setColors([...colors, newColor]);
      setNewColor("");
    }
  };

  const handleSaveVariants = () => {
    const selectedSizes = form.getFieldValue("sizes");
    const selectedColors = form.getFieldValue("colors");

    let newVariants = [];
    selectedSizes.forEach((size) => {
      selectedColors.forEach((color) => {
        newVariants.push({
          size,
          color,
          quantity: "",
          price: "",
          salePrice: "",
          startDate: "",
          endDate: "",
          image: [],
        });
      });
    });

    setVariants(newVariants);
  };

  const handleUpdateVariant = (record, field, value) => {
    const updatedVariants = variants.map((variant) =>
      variant === record ? { ...variant, [field]: value } : variant
    );
    setVariants(updatedVariants);
  };

  const handleImageChange = (fileList, record) => {
    const updatedVariants = variants.map((variant) =>
      variant === record ? { ...variant, image: fileList } : variant
    );
    setVariants(updatedVariants);
  };

  const handleUpload = ({ fileList }) => {
    setFileList(fileList);
  };

  // Thêm hàm handleSubmit
  const handleSubmit = (values) => {
    console.log("Form values: ", values);
    // Xử lý logic lưu sản phẩm tại đây
  };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="md:text-base">
          Quản trị / Sản phẩm /<span className="font-semibold"> Thêm sản phẩm và biến thể</span>
        </h1>
      </div>

      <Tabs defaultActiveKey="1">
        <TabPane tab="Sản phẩm" key="1">
          <div className="flex items-center justify-between">
            <h1 className="font-semibold md:text-3xl">Thêm sản phẩm</h1>
            <div>
              <Link to="/admin/products" className="mr-1">
                <Button className="ml-auto bg-black text-white rounded-lg py-1">
                  Quay lại
                </Button>
              </Link>
            </div>
          </div>
          <div>
            <div style={{ padding: 24, minHeight: 360 }}>
              <div className="bg-white px-4 rounded-xl py-5 shadow-lg max-w-6xl mx-10">
                <Form
                  name="product"
                  layout={"vertical"}
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 24 }}
                  style={{ maxWidth: 1000 }}
                  className="mx-10 my-5"
                  autoComplete="off"
                  onFinish={handleSubmit} // Sửa onFinish
                >
                  <div className="grid grid-cols-2 gap-5">
                    <Form.Item
                      label="Tên sản phẩm"
                      name="name"
                      rules={[{ required: true, message: "Tên sản phẩm bắt buộc phải nhập!" }]}
                    >
                      <Input placeholder="Nhập tên sản phẩm" />
                    </Form.Item>
                    <Form.Item label="Danh mục sản phẩm" name="category">
                      <Select defaultValue="Vui lòng chọn danh mục" className="w-[320px]" />
                    </Form.Item>
                  </div>

                  <div className="grid grid-cols-2 gap-5">
                    <Form.Item
                      label="Mô tả ngắn"
                      name="description"
                      rules={[{ required: true, message: "Mô tả ngắn bắt buộc phải nhập!" }]}
                    >
                      <TextArea rows={5} placeholder="Nhập mô tả sản phẩm" />
                    </Form.Item>
                    <Form.Item
                      label="Nội dung"
                      name="content"
                      rules={[{ required: true, message: "Nội dung sản phẩm bắt buộc phải nhập!" }]}
                    >
                      <TextArea rows={5} placeholder="Nhập nội dung sản phẩm" />
                    </Form.Item>
                  </div>

                  <div className="grid grid-cols-2 gap-5">
                    <Form.Item label="Ảnh nổi bật" name="feature_image">
                      <Upload
                        listType="picture"
                        fileList={fileList} // Sử dụng state fileList
                        onChange={handleUpload}
                        beforeUpload={() => false} // Không upload tự động
                      >
                        <Button icon={<UploadOutlined />}>Upload</Button>
                      </Upload>
                    </Form.Item>
                    <Form.Item label="Sản phẩm nổi bật" name="featured" valuePropName="checked">
                      <Checkbox />
                    </Form.Item>
                  </div>

                  <div className="grid grid-cols-2 gap-5">
                    <Form.Item label="Chọn tags" name="tags">
                      <Select mode="multiple" className="w-full" placeholder="Chọn tags">
                        <Select.Option value="tag1">Tag 1</Select.Option>
                        <Select.Option value="tag2">Tag 2</Select.Option>
                        <Select.Option value="tag3">Tag 3</Select.Option>
                      </Select>
                    </Form.Item>
                  </div>

                  <Form.Item>
                    <button type="submit" className="px-3 py-2 bg-black text-white rounded-lg">
                      <Loading3QuartersOutlined className="animate-spin" /> Submit
                    </button>
                  </Form.Item>
                </Form>
              </div>
            </div>
          </div>
        </TabPane>
          <TabPane tab="Biến thể" key="2">
  <div className="flex items-center justify-between">
    <h1 className="font-semibold md:text-3xl">Thêm biến thể</h1>
    <div>
      <Radio.Group
        options={[
          { label: "Thêm Size", value: "size" },
          { label: "Thêm Màu", value: "color" },
        ]}
        onChange={(e) => handleAddOption(e.target.value)}
        optionType="button"
        buttonStyle="solid"
      />
    </div>
  </div>

  <div className="bg-white px-4 py-5 max-w-6xl mx-[calc(10px-10px)] shadow-lg border-none w-[calc(100%+40px)]">
    <Form layout={"vertical"} form={form} className="mx-10 my-5" autoComplete="off">
      <div className="flex justify-between gap-8">
        {selectedOption.includes("size") && (
          <div className="mb-5 w-1/2">
            <h2 className="font-semibold">Chọn size</h2>
            <Form.Item label="Size" name="sizes">
              <Select
                mode="multiple"
                placeholder="Chọn size"
                className="w-full"
                style={{ border: "none", borderRadius: "0" }}
              >
                {sizes.map((size) => (
                  <Option key={size} value={size}>
                    {size}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <div className="flex items-center gap-4">
              <Button onClick={handleSelectAllSizes} className="bg-blue-500 text-white rounded-lg py-1">
                Chọn tất cả size
              </Button>

              <Input
                value={newSize}
                onChange={(e) => setNewSize(e.target.value)}
                placeholder="Thêm size mới"
                className="w-48"
              />
              <Button onClick={handleAddSize} className="bg-green-500 text-white rounded-lg py-1">
                Thêm Size
              </Button>
            </div>

            <Button className="bg-black text-white rounded-lg py-1 mt-3" onClick={handleSaveVariants}>
              Lưu Size
            </Button>
            <Button
              onClick={() => handleRemoveOption("size")}
              className="ml-2 text-white bg-red-500 rounded-lg py-1 mt-3"
            >
              Xóa Size
            </Button>
          </div>
        )}

        {selectedOption.includes("color") && (
          <div className="mb-5 w-1/2">
            <h2 className="font-semibold">Chọn màu</h2>
            <Form.Item label="Màu sắc" name="colors">
              <Select
                mode="multiple"
                placeholder="Chọn màu"
                className="w-full"
                style={{ border: "none", borderRadius: "0" }}
              >
                {colors.map((color) => (
                  <Option key={color} value={color}>
                    {color}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <div className="flex items-center gap-4">
              <Button onClick={handleSelectAllColors} className="bg-blue-500 text-white rounded-lg py-1">
                Chọn tất cả màu
              </Button>

              <Input
                value={newColor}
                onChange={(e) => setNewColor(e.target.value)}
                placeholder="Thêm màu mới"
                className="w-48"
              />
              <Button onClick={handleAddColor} className="bg-green-500 text-white rounded-lg py-1">
                Thêm Màu
              </Button>
            </div>

            <Button className="bg-black text-white rounded-lg py-1 mt-3" onClick={handleSaveVariants}>
              Lưu Màu
            </Button>
            <Button
              onClick={() => handleRemoveOption("color")}
              className="ml-2 text-white bg-red-500 rounded-lg py-1 mt-3"
            >
              Xóa Màu
            </Button>
          </div>
        )}
      </div>
    </Form>
  </div>

  {/* Hiển thị bảng biến thể */}
  <Table
  dataSource={variants}
  columns={[
    {
      title: "Màu",
      dataIndex: "color",
      key: "color",
      render: (color) => (
        <div
          style={{
            backgroundColor: colorMapping[color] || "#FFFFFF",
            width: "24px",
            height: "24px",
            borderRadius: "50%",
          }}
        ></div>
      ),
    },
    {
      title: "Kích cỡ",
      dataIndex: "size",
      key: "size",
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      render: (_, record) => (
        <Input
          value={record.quantity}
          onChange={(e) => handleUpdateVariant(record, "quantity", e.target.value)}
          style={{ width: "120px" }}
        />
      ),
    },
    {
      title: "Giá bán",
      dataIndex: "price",
      key: "price",
      render: (_, record) => (
        <Input
          value={record.price}
          onChange={(e) => handleUpdateVariant(record, "price", e.target.value)}
          style={{ width: "120px" }}
        />
      ),
    },
    {
      title: "Giá khuyến mãi",
      dataIndex: "salePrice",
      key: "salePrice",
      render: (_, record) => (
        <Input
          value={record.salePrice}
          onChange={(e) => handleUpdateVariant(record, "salePrice", e.target.value)}
          style={{ width: "120px" }}
        />
      ),
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "startDate",
      key: "startDate",
      render: (startDate, record) =>
        record.salePrice ? (
          <Input
            type="date"
            value={startDate}
            onChange={(e) => handleUpdateVariant(record, "startDate", e.target.value)}
            style={{ width: "120px" }}
          />
        ) : null,
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "endDate",
      key: "endDate",
      render: (endDate, record) =>
        record.salePrice ? (
          <Input
            type="date"
            value={endDate}
            onChange={(e) => handleUpdateVariant(record, "endDate", e.target.value)}
            style={{ width: "120px" }}
          />
        ) : null,
    },
    {
      title: "Ảnh",
      dataIndex: "image",
      key: "image",
      width: 300,
      render: (_, record) => (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "5px",
            whiteSpace: "nowrap",
            padding: "5px 0",
            alignItems: "center",
          }}
        >
          <Upload
            listType="picture-card"
            fileList={record.image}
            onChange={({ fileList }) => handleImageChange(fileList, record)}
            maxCount={4}
            showUploadList={{ showRemoveIcon: true }}
          >
            {record.image.length < 4 && (
              <Button icon={<UploadOutlined />}>Tải lên</Button>
            )}
          </Upload>
        </div>
      ),
    },
  ]}
  pagination={{ pageSize: 5 }}
  style={{ borderRadius: "0", marginTop: "20px" }}
/>

</TabPane>


      </Tabs>
    </main>
  );
};

export default ProductsAndVariants;
