import React from "react";
import { Form, Input, Select, Upload, Button, Checkbox } from "antd";
import { SyncOutlined, UploadOutlined } from "@ant-design/icons";
import { UploadFile } from "antd/es/upload/interface";
import { Category, Tag } from "@/common/types/product";
const { Option } = Select;
const { TextArea } = Input;
import { Editor } from "@tinymce/tinymce-react";

export interface ProductFormProps {
  form: any;
  fileList: UploadFile[];
  setFileList: React.Dispatch<React.SetStateAction<UploadFile[]>>;
  categoriesData: Category[];
  tagsData: Tag[];
  onValuesChange: (changedValues: any, allValues: any) => void;
  productCode: string;
  onGenerateCode: () => void;

  setData: any;
}

const ProductForm: React.FC<ProductFormProps> = ({
  form,
  fileList,
  setFileList,
  categoriesData,
  tagsData,
  onValuesChange,
  productCode,
  setData,
  onGenerateCode,
}) => (
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
  >
    <div className="grid grid-cols-2 gap-5">
      <Form.Item
        label="Tên sản phẩm"
        name="ten_san_pham"
        rules={[
          { required: true, message: "Tên sản phẩm bắt buộc phải nhập!" },
          {
            pattern: /^[^\s]+(\s+[^\s]+)*$/,
            message: "Vui lòng không chứa ký tự trắng!",
          },
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

    <div className="grid grid-cols-1 gap-5">
      <Form.Item
        label="Mô tả ngắn"
        name="mo_ta_ngan"
        rules={[
          { required: true, message: "Mô tả ngắn bắt buộc phải nhập!" },
          {
            pattern: /^[^\s]+(\s+[^\s]+)*$/,
            message: "Vui lòng không chứa ký tự trắng!",
          },
        ]}
      >
        <TextArea rows={5} placeholder="Nhập mô tả sản phẩm" />
      </Form.Item>
    </div>

    <div className="grid grid-cols-2 gap-5">
      {/* <Form.Item label="Chọn tags" name="tags">
        <Select mode="multiple" className="w-full" placeholder="Chọn tags">
          {tagsData &&
            tagsData.map((tag) => (
              <Option key={tag.id} value={tag.id}>
                {tag.ten_the}
              </Option>
            ))}
        </Select>
      </Form.Item> */}
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
        rules={[{ required: true, message: "Mã sản phẩm bắt buộc phải nhập!" }]}
        initialValue={productCode}
      >
        <Input
          className="border-none focus:ring-0"
          readOnly
          addonAfter={
            <Button
              icon={<SyncOutlined spin />}
              onClick={(e) => {
                e.preventDefault();
                onGenerateCode();
              }}
            />
          }
        />
      </Form.Item>
    </div>

    <div className="grid grid-cols-2 gap-5">
      <Form.Item
        label="Ảnh nổi bật"
        name="feature_image"
        rules={[{ required: true, message: "Ảnh nổi bật bắt buộc phải nhập!" }]}
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
      <Form.Item
        label="Sản phẩm nổi bật"
        name="featured"
        valuePropName="checked"
      >
        <Checkbox />
      </Form.Item>
    </div>
    <div className="grid grid-cols-1 gap-5">
      <Form.Item
        label="Nội dung"
        name="noi_dung"
        rules={[
          { required: true, message: "Nội dung sản phẩm bắt buộc phải nhập!" },
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
            setup: (editor) => {
              editor.on("Change", () => {
                const content = editor.getContent();
                // console.log("Editor content:", content); // Một chuỗi HTML hoặc JSON đã được stringify
                setData(content);
                // value = { content };
                form.setFieldsValue({
                  noi_dung: String(content),
                  // Chuyển đổi đối tượng thành chuỗi JSON nếu cần
                });
              });
            },
          }}
        />
        {/* <TextArea rows={5} placeholder="Nhập nội dung sản phẩm" /> */}
      </Form.Item>
    </div>
  </Form>
);

export default ProductForm;
