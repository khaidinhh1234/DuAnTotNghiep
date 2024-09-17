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

import { Tabs, Button, Form, Select, Radio, Input, Table, Upload, Modal } from "antd";
import { useState } from "react";
import { Loading3QuartersOutlined, UploadOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import TextArea from "antd/es/input/TextArea";
import Checkbox from "antd/es/checkbox/Checkbox";
import { DateTime } from 'luxon';

const { TabPane } = Tabs;
const { Option } = Select;

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
  const [variants, setVariants] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalType, setModalType] = useState(null);

  const handleSelectAll = (type) => {
    form.setFieldsValue({ [type]: type === "sizes" ? sizes : colors });
  };

  const handleAddItem = (type, newItem, setItem) => {
    if (newItem && !itemList.includes(newItem)) {
      setItem([...itemList, newItem]);
      setNewItem("");
    }
  };

  const handleSaveVariants = () => {
    const selectedSizes = form.getFieldValue("sizes");
    const selectedColors = form.getFieldValue("colors");

    const newVariants = selectedSizes.flatMap((size) =>
      selectedColors.map((color) => ({
        size,
        color,
        quantity: "",
        price: "",
        salePrice: "",
        startDate: "",
        endDate: "",
        image: [],
      }))
    );

    setVariants(newVariants);
  };

  const handleUpdateVariant = (record, field, value) => {
    const formattedValue = (field === "startDate" || field === "endDate") 
      ? DateTime.fromISO(value).toISO() 
      : value;

    setVariants((prevVariants) =>
      prevVariants.map((variant) =>
        variant === record ? { ...variant, [field]: formattedValue } : variant
      )
    );
  };

  const handleImageChange = (fileList, record) => {
    setVariants((prevVariants) =>
      prevVariants.map((variant) =>
        variant === record ? { ...variant, image: fileList } : variant
      )
    );
  };

  const handleUpload = ({ fileList }) => setFileList(fileList);

  const handleSubmit = (values) => console.log("Form values: ", values);

  const showModal = (type) => {
    setModalType(type);
    setIsModalVisible(true);
  };

  const handleOk = () => setIsModalVisible(false);
  const handleCancel = () => setIsModalVisible(false);

  const renderInput = (record, field, placeholder) => (
    <Input
      placeholder={placeholder}
      onChange={(e) => handleUpdateVariant(record, field, e.target.value)}
    />
  );

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
                <Button className="ml-auto bg-black text-white rounded-lg py-1">Quay lại</Button>
              </Link>
            </div>
          </div>
          <div>
            <div style={{ padding: 24, minHeight: 360 }}>
              <div className="bg-white px-4 rounded-xl py-5 shadow-lg max-w-6xl mx-10">
                <Form
                  name="product"
                  layout="vertical"
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 24 }}
                  style={{ maxWidth: 1000 }}
                  className="mx-10 my-5"
                  autoComplete="off"
                  onFinish={handleSubmit}
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
                        fileList={fileList}
                        onChange={handleUpload}
                        beforeUpload={() => false}
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
                onChange={(e) => showModal(e.target.value)}
                optionType="button"
                buttonStyle="solid"
              />
            </div>
          </div>

          <div className="bg-white px-4 py-5 max-w-6xl mx-[calc(10px-10px)] shadow-lg border-none w-[calc(100%+40px)]">
            <Form layout="vertical" form={form} className="mx-10 my-5" autoComplete="off">
              <Table
                dataSource={variants}
                columns={[
                  {
                    title: "Màu",
                    dataIndex: "color",
                    key: "color",
                    render: (color) => (
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div
                          style={{
                            backgroundColor: colorMapping[color],
                            border: "1px solid black",
                            width: "20px",
                            height: "20px",
                          }}
                        />
                        {color}
                      </div>
                    ),
                  },
                  { title: "Size", dataIndex: "size", key: "size" },
                  { title: "Số lượng", dataIndex: "quantity", key: "quantity", render: (text, record) => renderInput(record, "quantity", "Nhập số lượng") },
                  { title: "Giá bán", dataIndex: "price", key: "price", render: (text, record) => renderInput(record, "price", "Nhập giá bán") },
                  { title: "Giá giảm", dataIndex: "salePrice", key: "salePrice", render: (text, record) => renderInput(record, "salePrice", "Nhập giá giảm") },
                  {
                    title: "Ngày bắt đầu",
                    dataIndex: "startDate",
                    key: "startDate",
                    render: (text, record) => (
                      <Input
                        type="date"
                        onChange={(e) => handleUpdateVariant(record, "startDate", e.target.value)}
                      />
                    ),
                  },
                  {
                    title: "Ngày kết thúc",
                    dataIndex: "endDate",
                    key: "endDate",
                    render: (text, record) => (
                      <Input
                        type="date"
                        onChange={(e) => handleUpdateVariant(record, "endDate", e.target.value)}
                      />
                    ),
                  },
                  {
                    title: "Hình ảnh",
                    dataIndex: "image",
                    key: "image",
                    render: (text, record) => (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        <Upload
                          className="custom-upload"
                          listType="picture-card"
                          fileList={record.image}
                          onChange={({ fileList }) => {
                            if (fileList.length <= 4) handleImageChange(fileList, record);
                          }}
                          beforeUpload={() => false}
                          itemRender={(originNode, file) => (
                            <div style={{ width: '80px', height: '80px', overflow: 'hidden', margin: '4px' }}>
                              {originNode}
                            </div>
                          )}
                        >
                          {record.image.length < 4 && <Button icon={<UploadOutlined />}>Upload</Button>}
                        </Upload>
                      </div>
                    ),
                  }
                ]}
                pagination={{ pageSize: 5 }}
              />
              <Button onClick={handleSaveVariants}>Lưu biến thể</Button>
            </Form>
          </div>
        </TabPane>
      </Tabs>

      <Modal
        title={modalType === "size" ? "Chọn size" : "Chọn màu"}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form layout="vertical" form={form}>
          {modalType === "size" ? (
            <>
              <Form.Item label="Size" name="sizes">
                <Select mode="multiple" placeholder="Chọn size">
                  {sizes.map((size) => (
                    <Option key={size} value={size}>
                      {size}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Button onClick={() => handleSelectAll("sizes")}>Chọn tất cả size</Button>
              <Input
                value={newSize}
                onChange={(e) => setNewSize(e.target.value)}
                placeholder="Thêm size mới"
              />
              <Button onClick={() => handleAddItem("sizes", newSize, setNewSize)}>Thêm Size</Button>
            </>
          ) : (
            <>
              <Form.Item label="Màu sắc" name="colors">
                <Select mode="multiple" placeholder="Chọn màu">
                  {colors.map((color) => (
                    <Option key={color} value={color}>
                      {color}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Button onClick={() => handleSelectAll("colors")}>Chọn tất cả màu</Button>
              <Input
                value={newColor}
                onChange={(e) => setNewColor(e.target.value)}
                placeholder="Thêm màu mới"
              />
              <Button onClick={() => handleAddItem("colors", newColor, setNewColor)}>Thêm Màu</Button>
            </>
          )}
        </Form>
      </Modal>
    </main>
  );
};

export default ProductsAndVariants;
