import React from "react";
import { sanPham2 } from "@/assets/img";
import instanceClient from "@/configs/client";
import { PlusOutlined } from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Form, Image, message, Upload } from "antd";
import TextArea from "antd/es/input/TextArea";
import { UploadFile, UploadProps } from "antd/es/upload";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { uploadToCloudinary } from "@/configs/cloudinary";

interface HoanHang {
  li_do_hoan_hang: string;
  hinh_anh_hoan_tra: string;
  ma_don_hang?: string;
}
const HoanTien = () => {
  const { slug } = useParams();
  // console.log("Slug:", slug);

  const { data, error, isError } = useQuery({
    queryKey: ["CHITIETDONHANG", slug],
    queryFn: async () => {
      if (!slug) throw new Error("Slug không hợp lệ.");
      try {
        // console.log(slug);

        const response = await instanceClient.get(`don-hang/${slug}`);
        if (response.status !== 200) {
          throw new Error("Lỗi khi lấy thông tin chi tiết đơn hàng.");
        }
        return response.data;
      } catch (error) {
        console.error("Lỗi khi gọi API:", error);
        throw new Error("Lỗi khi lấy thông tin chi tiết đơn hàng.");
      }
    },
  });
  const [form] = Form.useForm();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  // console.log(fileList);
  const getBase64 = (file: any): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as any);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) =>
    setFileList(newFileList);


  // const onFinish: any["onFinish"] = (values: any) => {
  //   const feature_image = fileList
  //     .filter((file) => file.status === "done")
  //     .map((file) => file.response?.secure_url);
  //   // mutate({ ...values, feature_image });
  //   console.log(values);
  //   console.log(feature_image[0]);
  //   // mutate(values);
  // };
  const onFinish = async (values: any) => {
    console.log(values);
    const data: HoanHang = {
      li_do_hoan_hang: values.description,
      hinh_anh_hoan_tra: "",
      ma_don_hang: slug,
    };
    if (fileList.length > 0) {
      // Nếu có ảnh, lấy URL của ảnh đã upload
      const uploadPromises = await uploadToCloudinary(
        fileList[0].originFileObj as File
      );

      // console.log(uploadPromises);

      data.hinh_anh_hoan_tra = uploadPromises; // Ghép các URL ảnh lại với nhau
    }
    // console.log(data);
    mutate(data as any);
  };


  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  const navigate = useNavigate();
  const { mutate } = useMutation({
    mutationKey: ["hoanTien"],
    mutationFn: async (data) => {
      const response = await instanceClient.post(
        `don-hang/hoan-hang/${slug}`,
        data
      );
      navigate("/mypro/myorder");
      return response.data;
    },
    onSuccess: () => {
      message.success("Hoàn tiền thành công!");
    },
    onError: (error: any) => {
      message.error("Hoàn tiền thất bại!");
      console.error(error);
    },
  });

  return (
    <div>
      {" "}
      <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75 z-50 ">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full space-y-4 overflow-y-auto h-auto">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Yêu cầu Trả hàng /Hoàn tiền
          </h2>
          <p className="text-sm text-gray-600">
            Vui lòng chọn lý do hủy. Với lý do này, bạn sẽ hủy tất cả sản phẩm
            trong đơn hàng và không thể thay đổi sau đó.
          </p>

          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            className="space-y-4"
          >
            <div className="grid grid-cols-3 gap-2">
              {" "}
              {data?.data?.chi_tiet_cua_don_hang?.map(
                (item: any, index: any) => (
                  <>
                    <div className="relative w-32 col-span-1" key={index}>
                      <img
                        src={item?.anh_bien_the[0] ?? ""}
                        alt="sdfsdf"
                        className="w-32 h-36 rounded-md"
                      />
                      <span className="absolute bottom-0 bg-slate-500 w-full opacity-80 py-2 text-white text-center">
                        đ {(item?.thanh_tien ?? 0).toLocaleString("vi-VN")}
                      </span>
                    </div>
                  </>
                )
              )}
            </div>
            <div className="flex justify-between items-center border-b border-gray-300 pb-2">
              <button className="text-gray-800 font-semibold">Phương án</button>
              <button className="text-gray-800 font-semibold">
                Trả hàng và Hoàn tiền
              </button>
            </div>
            <div className="py-2 ">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-800">
                  Số tiền hoàn lại
                </span>
                <span className="text-gray-800 font-semibold text-xl">
                  ₫
                  {data?.data?.tong_thanh_tien_san_pham.toLocaleString("vi-VN")}
                </span>
              </div>
            </div>
            {/* Refund Method */}
            <div className="py-2 ">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-800">
                  Hoàn tiền vào
                </span>
                <span className="text-gray-800 font-semibold">
                  Số dư TK Ví GLOW
                </span>
              </div>
            </div>
            <div className="py-4 border-t border-gray-300">
              <Form.Item
                label="Mô tả sản phẩm"
                name="description"
                rules={[
                  {
                    required: true,
                    message: "Tên sản phẩm bắt buộc phải nhập!",
                  },
                ]}
              >
                <TextArea rows={5} placeholder="Nhập mô tả sản phẩm" />
              </Form.Item>
              <Form.Item
                className=""
                label="Hình ảnh minh chứng"
                name="feature_image"
              >
                <Upload
                  action="https://api.cloudinary.com/v1_1/dpypwbeis/image/upload"
                  data={{ upload_preset: "ml_default" }}
                  listType="picture-card"
                  fileList={fileList}
                  onPreview={handlePreview}
                  onChange={handleChange}
                >
                  {fileList.length >= 1 ? null : uploadButton}
                </Upload>
                {previewImage && (
                  <Image
                    wrapperStyle={{ display: "none" }}
                    preview={{
                      visible: previewOpen,
                      onVisibleChange: (visible) => setPreviewOpen(visible),
                      afterOpenChange: (visible) =>
                        !visible && setPreviewImage(""),
                    }}
                    src={previewImage}
                  />
                )}{" "}
              </Form.Item>{" "}
              <p className="mt-2 text-xs text-gray-500">
                Hãy đăng tải hình ảnh (dưới 10MB/ảnh), video (dưới 100MB/video)
                thấy rõ tình trạng sản phẩm nhận được, còn nguyên seal, tem,
                hộp.
              </p>
            </div>
            {/* Submit Button */}
            <div className="flex justify-between items-center pt-4  border-gray-200">
              <Link
                to="/mypro/myorder"
                className="text-gray-600 hover:text-gray-800 text-sm font-medium focus:outline-none"
              >
                KHÔNG PHẢI BÂY GIỜ
              </Link>

              <Button
                type="primary"
                size="middle"
                htmlType="submit"
                className="bg-gray-600 hover:bg-gray-800 text-white font-semibold py-2 px-6 rounded-md shadow-lg transition-all"
              >
                Gửi yêu cầu
              </Button>
            </div>{" "}
          </Form>
        </div>
      </div>
    </div>
  );
};

export default HoanTien;
