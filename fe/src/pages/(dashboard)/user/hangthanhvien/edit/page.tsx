import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  InputNumber,
  Upload,
  Button,
  Typography,
  message,
  Modal,
} from "antd";
import { UploadOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { uploadToCloudinary } from "@/configs/cloudinary";
import instance from "@/configs/admin";

const { Title } = Typography;

const MemberRankEdit = () => {
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState("");
  const [previewVisible, setPreviewVisible] = useState(false);
  const nav = useNavigate();
  const { id } = useParams();

  const {
    data: response,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["tag", id],
    queryFn: async () => {
      try {
        const response = await instance.get(`/hangthanhvien/${id}`);
        return response.data;
      } catch (error) {
        console.error("Error fetching member rank:", error);
        throw new Error("Error fetching member rank");
      }
    },
  });

  useEffect(() => {
    if (response && response.data) {
      console.log("Setting form values:", response.data);
      form.setFieldsValue({
        rankName: response.data.ten_hang_thanh_vien,
        minSpend: response.data.chi_tieu_toi_thieu,
        maxSpend: response.data.chi_tieu_toi_da,
      });
      setImageUrl(response.data.anh_hang_thanh_vien);
    }
  }, [response, form]);

  const { mutate } = useMutation({
    mutationFn: async (data) => {
      const response = await instance.put(`/hangthanhvien/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      message.success("Cập nhật hạng thành viên thành công");
      nav("/admin/users/rank");
    },
    onError: (error) => {
      message.error(
        error.message || "Có lỗi xảy ra khi cập nhật hạng thành viên"
      );
    },
  });

  const onFinish = (values: any) => {
    const data = {
      ten_hang_thanh_vien: values.rankName,
      chi_tieu_toi_thieu: values.minSpend,
      chi_tieu_toi_da: values.maxSpend,
      anh_hang_thanh_vien: imageUrl,
    };
    mutate(data as any);
  };

  const validateUpload = (file: any) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("Chỉ chấp nhận file JPG/PNG!");
      return false;
    }
    const isLt1MB = file.size / 1024 / 1024 < 1;
    if (!isLt1MB) {
      message.error("Dung lượng phải nhỏ hơn 1MB!");
      return false;
    }
    return true;
  };

  const handleChange = async (info: any) => {
    if (info.file.status === "done") {
      try {
        const url = await uploadToCloudinary(info.file.originFileObj);
        if (url) {
          setImageUrl(url);
          form.setFieldsValue({ anh_hang_thanh_vien: url });
        }
      } catch (error) {
        console.error("Error uploading to Cloudinary:", error);
        message.error("Lỗi khi tải ảnh lên");
      }
    }
  };

  const handlePreview = () => {
    setPreviewVisible(true);
  };

  const handleDelete = () => {
    setImageUrl("");
    form.setFieldsValue({ anh_hang_thanh_vien: "" });
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading data</div>;

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="md:text-base">
          Quản trị / Danh mục /
          <span className="font-semibold px-px"> Hạng thành viên</span>
        </h1>
      </div>

      <div className="flex items-center justify-between">
        <h1 className="font-semibold md:text-3xl">Chỉnh sửa hạng thành viên</h1>
        <div>
          <Link to="/admin/users/rank" className="mr-1">
            <Button className="ml-auto bg-black text-white rounded-lg py-1">
              Quay lại
            </Button>
          </Link>
        </div>
      </div>

      <div className="max-w-2xl ml-5 mt-6 p-6 bg-white shadow-md rounded-lg">
        <Title level={3} className="mb-4">
          Chỉnh sửa hạng thành viên
        </Title>
        <hr />
        <br />
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          className="space-y-4"
        >
          <Form.Item
            name="rankName"
            label="Tên hạng thành viên"
            rules={[
              { required: true, message: "Vui lòng nhập tên hạng thành viên" },
            ]}
          >
            <Input placeholder="Diamond" />
          </Form.Item>

          <Form.Item
            name="anh_hang_thanh_vien"
            label="Hình cho hạng thành viên"
            valuePropName="file"
          >
            <Upload
              accept="image/png,image/jpeg"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              beforeUpload={validateUpload}
              onChange={handleChange}
              customRequest={({ onSuccess }) => {
                if (onSuccess) {
                  setTimeout(() => onSuccess("ok"), 0);
                }
              }}
            >
              {imageUrl ? (
                <div className="relative group">
                  <img src={imageUrl} alt="avatar" style={{ width: "100%" }} />
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <EyeOutlined
                      className="text-white text-2xl mx-2 cursor-pointer"
                      onClick={handlePreview}
                    />
                    <DeleteOutlined
                      className="text-white text-2xl mx-2 cursor-pointer"
                      onClick={handleDelete}
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <UploadOutlined />
                  <div style={{ marginTop: 8 }}>Tải lên</div>
                </div>
              )}
            </Upload>
          </Form.Item>
          <p className="text-xs text-gray-500 mt-1">
            Dung lượng &lt; 1MB. Kích thước 500x500 pixels. Định dạng: png,
            jpeg.
          </p>

          <div className="flex space-x-4">
            <Form.Item
              name="minSpend"
              label="Chi tiêu tối thiểu (VND)"
              rules={[
                { required: true, message: "Vui lòng nhập chi tiêu tối thiểu" },
              ]}
              className="flex-1"
            >
              <InputNumber
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value: any) => value.replace(/\$\s?|(,*)/g, "")}
                addonAfter="VND"
                className="w-full"
              />
            </Form.Item>

            <Form.Item
              name="maxSpend"
              label="Chi tiêu tối đa (VND)"
              rules={[
                { required: true, message: "Vui lòng nhập chi tiêu tối đa" },
              ]}
              className="flex-1"
            >
              <InputNumber
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value: any) => value.replace(/\$\s?|(,*)/g, "")}
                addonAfter="VND"
                className="w-full"
              />
            </Form.Item>
          </div>
          <div className="flex justify-start space-x-1 mt-6">
            <Button
              type="primary"
              size="middle"
              htmlType="submit"
              className="px-8 py-3 bg-black text-white rounded-lg"
            >
              Cập nhật
            </Button>
          </div>
        </Form>
      </div>

      <Modal
        visible={previewVisible}
        footer={null}
        onCancel={() => setPreviewVisible(false)}
      >
        <img alt="preview" style={{ width: "100%" }} src={imageUrl} />
      </Modal>
    </main>
  );
};

export default MemberRankEdit;
