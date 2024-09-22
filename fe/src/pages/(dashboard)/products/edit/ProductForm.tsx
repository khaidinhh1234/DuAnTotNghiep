
import React, { useEffect } from "react";
import { Form, Input, Select, Upload, Button, Checkbox } from "antd";
import { UploadOutlined } from '@ant-design/icons';
import { UploadFile } from "antd/es/upload/interface";
import { Category, Tag, ProductFormData } from "@/common/types/product";

const { Option } = Select;
const { TextArea } = Input;

export interface ProductFormProps {
  form: any; 
  fileList: UploadFile[];
  setFileList: React.Dispatch<React.SetStateAction<UploadFile[]>>;
  categoriesData: Category[];
  tagsData: Tag[];
  onValuesChange: (changedValues: any, allValues: any) => void;
  initialValues?: ProductFormData;
}

const ProductForm = ({ 
  form, 
  fileList, 
  setFileList, 
  categoriesData, 
  tagsData,
  onValuesChange,
  initialValues
}: ProductFormProps) => {
  useEffect(() => {
    if (initialValues) {
      console.log("Setting initial values in ProductForm:", initialValues);
      form.setFieldsValue(initialValues);
    }
  }, [initialValues, form]);

  return (
    <Form
      form={form}
      name="product"
      layout="vertical"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 24 }}
      style={{ maxWidth: 1000 }}
      className="mx-10 my-5"
      autoComplete="off"
      onValuesChange={onValuesChange}
      initialValues={initialValues}
    >
      <div className="grid grid-cols-2 gap-5">
        <Form.Item
          label="Tên sản phẩm"
          name="ten_san_pham"
          // rules={[{ required: true, message: "Tên sản phẩm bắt buộc phải nhập!" }]}
        >
          <Input placeholder="Nhập tên sản phẩm" />
        </Form.Item>
        <Form.Item 
          label="Danh mục sản phẩm" 
          name="danh_muc_id"
          // rules={[{ required: true, message: 'Vui lòng chọn danh mục' }]}
        >
          <Select placeholder="Vui lòng chọn danh mục" className="w-full">
            {categoriesData && categoriesData.map((category) => (
              <Option key={category.id} value={category.id}>{category.ten_danh_muc}</Option>
            ))}
          </Select>
        </Form.Item>
      </div>

      <div className="grid grid-cols-2 gap-5">
        <Form.Item
          label="Mô tả ngắn"
          name="mo_ta_ngan"
          // rules={[{ required: true, message: "Mô tả ngắn bắt buộc phải nhập!" }]}
        >
          <TextArea rows={5} placeholder="Nhập mô tả sản phẩm" />
        </Form.Item>
        <Form.Item
          label="Nội dung"
          name="noi_dung"
          // rules={[{ required: true, message: "Nội dung sản phẩm bắt buộc phải nhập!" }]}
        >
          <TextArea rows={5} placeholder="Nhập nội dung sản phẩm" />
        </Form.Item>
      </div>

      <div className="grid grid-cols-2 gap-5">
        <Form.Item label="Chọn tags" name="tags">
          <Select mode="multiple" className="w-full" placeholder="Chọn tags">
            {tagsData && tagsData.map((tag) => (
              <Option key={tag.id} value={tag.id}>{tag.ten_the}</Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="Mã sản phẩm"
          name="ma_san_pham"
          rules={[{ required: true, message: "Mã sản phẩm bắt buộc phải nhập!" }]}
        >
          <Input placeholder="Nhập mã sản phẩm" />
        </Form.Item>
      </div>

      <div className="grid grid-cols-2 gap-5">
        <Form.Item
          label="Ảnh nổi bật"
          name="anh_san_pham"
          rules={[{ required: true, message: "Ảnh sản phẩm là bắt buộc!" }]}
        >
          <Upload
            listType="picture"
            fileList={fileList}
            onChange={({ fileList }) => setFileList(fileList)}
            // beforeUpload={() => false}
            onPreview={() => {}}
          >
            <Button icon={<UploadOutlined />}>Upload</Button>
          </Upload>
        </Form.Item>
        {/* <Form.Item label="Sản phẩm nổi bật" name="featured" valuePropName="checked">
          <Checkbox />
        </Form.Item> */}
      </div>
    </Form>
  );
};

export default ProductForm;
