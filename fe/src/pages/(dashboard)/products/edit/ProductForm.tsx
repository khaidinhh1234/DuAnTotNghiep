import React, { useEffect } from "react";
import { Form, Input, Select, Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { UploadFile } from "antd/es/upload/interface";
import { Category, Tag, ProductFormData } from "@/common/types/product";
import { Editor } from "@tinymce/tinymce-react";
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
  initialValues,
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
      style={{ maxWidth: "100%" }}
      className="mx-10 my-5"
      autoComplete="off"
      onValuesChange={onValuesChange}
      initialValues={initialValues}
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
        <Form.Item
          label="Danh mục sản phẩm"
          name="danh_muc_id"
          rules={[{ required: true, message: "Vui lòng chọn danh mục" }]}
        >
          <Select placeholder="Vui lòng chọn danh mục" className="w-full">
            {categoriesData &&
              categoriesData.map((category) => (
                <Option key={category.id} value={category.id}>
                  {category.ten_danh_muc}
                </Option>
              ))}
          </Select>
        </Form.Item>
      </div>

      <div className="grid grid-cols-2 gap-5">
        <Form.Item
          label="Mô tả ngắn"
          name="mo_ta_ngan"
          rules={[
            { required: true, message: "Mô tả ngắn bắt buộc phải nhập!" },
          ]}
        >
          <TextArea rows={5} placeholder="Nhập mô tả sản phẩm" />
        </Form.Item>
        <Form.Item
          label="Nội dung"
          name="noi_dung"
          rules={[
            {
              required: true,
              message: "Nội dung sản phẩm bắt buộc phải nhập!",
            },
          ]}
        >
          <TextArea rows={5} placeholder="Nhập nội dung sản phẩm" />
        </Form.Item>
      </div>

      <div className="grid grid-cols-2 gap-5">
        <Form.Item label="Chọn tags" name="tags">
          <Select mode="multiple" className="w-full" placeholder="Chọn tags">
            {tagsData &&
              tagsData.map((tag) => (
                <Option key={tag.id} value={tag.id}>
                  {tag.ten_the}
                </Option>
              ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Mã sản phẩm"
          name="ma_san_pham"
          rules={[
            { required: true, message: "Mã sản phẩm bắt buộc phải nhập!" },
          ]}
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
            beforeUpload={() => false}
            onPreview={() => {}}
          >
            <Button icon={<UploadOutlined />}>Upload</Button>
          </Upload>
        </Form.Item>
      </div>

      <div className="grid grid-cols-1 gap-5">
        <Form.Item
          label="Nội dung"
          name="noi_dung"
          rules={[
            {
              required: true,
              message: "Nội dung tin tức bắt buộc phải nhập!",
            },
          ]}
        >
          <Editor
            apiKey="4co2z7i0ky0nmudlm5lsoetsvp6g3u4110d77s2cq143a9in"
            init={{
              plugins: [
                "anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount",
                "checklist mediaembed casechange export formatpainter pageembed a11ychecker tinymcespellchecker permanentpen powerpaste advtable advcode editimage advtemplate ai mentions tinycomments tableofcontents footnotes mergetags autocorrect typography inlinecss markdown",
              ],
              toolbar:
                "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat",
              tinycomments_mode: "embedded",
              tinycomments_author: "Author name",
              mergetags_list: [
                { value: "First.Name", title: "First Name" },
                { value: "Email", title: "Email" },
              ],
              setup: (editor: any) => {
                editor.on("Change", () => {
                  form.setFieldsValue({ noi_dung: editor.getContent() });
                });
              },
            }}
            initialValue={
              initialValues?.noi_dung || "Chào mừng bạn đến với Glow clothing!"
            }
          />
        </Form.Item>
      </div>
    </Form>
  );
};

export default ProductForm;
