import { CameraOutlined } from "@ant-design/icons";
import { Avatar, Button, Radio, DatePicker, Upload, message, Form } from "antd";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { RadioChangeEvent } from "antd";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { uploadToCloudinary } from "@/configs/cloudinary";
import dayjs from "dayjs";
import instanceClient from "@/configs/client";
import { toast } from "react-toastify";

interface ProfileFormData {
  ho: string;
  ten: string;
  ngay_sinh: string;
  gioi_tinh: string;
  so_dien_thoai: string;
  email: string;
  dia_chi: string;
  anh_nguoi_dung: string;
}

const MyProfilePage = () => {
  const [form] = Form.useForm();
  const [avatarImage, setAvatarImage] = useState<string>("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [gender, setGender] = useState<string>("male");
  const queryClient = useQueryClient();
  const nav = useNavigate();

  const { data } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const response = await instanceClient.post("/cap-nhat-thong-tin");
      return response.data;
    },
  });

  const userProfile = data?.data?.user;

  useEffect(() => {
    if (userProfile) {
      form.setFieldsValue({
        ho: userProfile.ho,
        ten: userProfile.ten,
        ngay_sinh: userProfile.ngay_sinh ? dayjs(userProfile.ngay_sinh) : null,
        gioi_tinh: userProfile.gioi_tinh,
        so_dien_thoai: userProfile.so_dien_thoai,
        email: userProfile.email,
        dia_chi: userProfile.dia_chi,
      });
      setAvatarImage(userProfile.anh_nguoi_dung);
    }
  }, [userProfile]);

  const updateProfileMutation = useMutation({
    mutationFn: async (formData: ProfileFormData) => {
      let imageUrl = avatarImage;
      if (avatarFile) {
        imageUrl = await uploadToCloudinary(avatarFile);
      }

      const updatedData = {
        ...formData,
        anh_nguoi_dung: imageUrl,
        ngay_sinh: dayjs(formData.ngay_sinh).format("YYYY-MM-DD"),
      };

      const response = await instanceClient.post(
        "/cap-nhat-thong-tin",
        updatedData
      );
      nav("/mypro/myprofile");
      return response.data;
    },
    onSuccess: () => {
      message.success("Cập nhật thông tin thành công");
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: () => {
      toast.error("Có lỗi xảy ra khi cập nhật thông tin");
    },
  });

  const handleAvatarChange = (info: any) => {
    if (info.file && info.file.originFileObj) {
      const file = info.file.originFileObj;
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Kích thước ảnh không được vượt quá 2MB");
        return;
      }
      if (!["image/jpeg", "image/png", "image/gif"].includes(file.type)) {
        toast.error("Chỉ chấp nhận file ảnh định dạng JPG, PNG hoặc GIF");
        return;
      }
      setAvatarFile(file);
      setAvatarImage(URL.createObjectURL(file));
    }
  };

  const onGenderChange = (e: RadioChangeEvent) => {
    setGender(e.target.value);
  };

  const handleSubmit = (values: ProfileFormData) => {
    console.log(values);
    updateProfileMutation.mutate(values);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white rounded-2xl shadow-md">
      <div className="flex justify-between items-center mb-8">
        <div className="relative">
          <Avatar
            src={avatarImage || userProfile?.anh_nguoi_dung}
            size={100}
            className="border-4 border-white shadow-lg"
          />
          <Upload
            showUploadList={false}
            onChange={handleAvatarChange}
            className="absolute bottom-0 right-0"
            accept="image/jpeg,image/png,image/gif"
          >
            <Button
              type="primary"
              shape="circle"
              icon={<CameraOutlined />}
              className="bg-blue-500 hover:bg-blue-600 border-2 border-white shadow-md"
            />
          </Upload>
        </div>
        <Link
          to="/mypro/myProfile"
          className="btn-black items-center md:px-8 md:py-3 px-4 py-2 flex whitespace-nowrap rounded-lg hover:text-black"
        >
          <span>Quay lại</span>{" "}
          <i className="fa-sharp-duotone fa-regular fa-arrow-right-from-bracket mx-2"></i>
        </Link>
      </div>

      <Form
        form={form}
        onFinish={handleSubmit}
        layout="vertical"
        className="space-y-6"
        initialValues={{
          ho: "",
          ten: "",
          ngay_sinh: null,
          gioi_tinh: "",
          so_dien_thoai: "",
          email: "",
          dia_chi: "",
        }}
      >
        <div className="grid md:grid-cols-2 gap-6">
          <Form.Item
            name="ten"
            label="Tên"
            rules={[{ required: true, message: "Vui lòng nhập tên" }]}
          >
            <input className="w-full h-[52px] px-4 rounded-xl border-2 border-gray-200" />
          </Form.Item>

          <Form.Item
            name="ho"
            label="Họ"
            rules={[{ required: true, message: "Vui lòng nhập họ" }]}
          >
            <input className="w-full h-[52px] px-4 rounded-xl border-2 border-gray-200" />
          </Form.Item>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Form.Item
            name="ngay_sinh"
            label="Ngày sinh"
            rules={[{ required: true, message: "Vui lòng chọn ngày sinh" }]}
          >
            <DatePicker
              className="w-full h-[52px] rounded-xl border-2 border-gray-200"
              format="DD/MM/YYYY"
            />
          </Form.Item>

          <Form.Item
            name="gioi_tinh"
            label="Giới tính"
            rules={[{ required: true, message: "Vui lòng chọn giới tính" }]}
          >
            <Radio.Group
              onChange={onGenderChange}
              className="flex gap-8 px-4 pb-3 bg-gray-50 rounded-xl border-2 border-gray-200"
            >
              <Radio value="1" className="flex flex-row items-end flex-nowrap">
                Nam
              </Radio>
              <Radio value="2" className="flex flex-row items-end flex-nowrap">
                Nữ
              </Radio>
              <Radio value="3" className="flex flex-row items-end flex-nowrap">
                Khác
              </Radio>
            </Radio.Group>
          </Form.Item>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Form.Item
            name="so_dien_thoai"
            label="Số Điện Thoại"
            rules={[
              { required: true, message: "Vui lòng nhập số điện thoại" },
              {
                pattern: /^[0-9]{10,11}$/,
                message: "Số điện thoại phải có 10-11 chữ số",
              },
            ]}
          >
            <input
              type="tel"
              className="w-full h-[52px] px-4 rounded-xl border-2 border-gray-200"
            />
          </Form.Item>

          <Form.Item
            name="email"
            label="Địa Chỉ Email"
            rules={[
              { required: true, message: "Vui lòng nhập email" },
              { type: "email", message: "Email không hợp lệ" },
            ]}
          >
            <input
              type="email"
              className="w-full h-[52px] px-4 rounded-xl border-2 border-gray-200"
              readOnly
            />
          </Form.Item>
        </div>

        <Form.Item
          name="dia_chi"
          label="Địa Chỉ"
          rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}
        >
          <input className="w-full h-[52px] px-4 rounded-xl border-2 border-gray-200" />
        </Form.Item>

        <div className="flex justify-end mt-6">
          <Button
            type="primary"
            htmlType="submit"
            loading={updateProfileMutation.isPending}
            className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-2 h-[52px] rounded-xl"
          >
            Lưu thay đổi
          </Button>
        </div>
      </Form>

      <style>{`
        .ant-picker {
          height: 52px;
          border-radius: 12px;
          border: 2px solid #e5e7eb;
        }
        .ant-picker:hover {
          border-color: #3b82f6;
        }
        .ant-picker-focused {
          border-color: #3b82f6;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
        }
      `}</style>
    </div>
  );
};

export default MyProfilePage;
