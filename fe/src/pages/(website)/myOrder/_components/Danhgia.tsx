import instanceClient from "@/configs/client";
import { uploadToCloudinary } from "@/configs/cloudinary";
import { UploadOutlined } from "@ant-design/icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { GetProp, UploadProps } from "antd";
import { Button, Form, Input, message, Modal, Rate, Upload } from "antd";
import { RcFile, UploadFile } from "antd/es/upload";
import { useEffect, useState } from "react";

const Danhgia = ({ setDanhgia, slug }: any) => {
  const [reviewText, setReviewText] = useState("");
  const customIcons = ["😞", "😐", "😊", "😃", "😍"]; // Custom icons for rating
  const desc = ["Tệ", "Không tốt", "Bình thường", "Tốt", "Tuyệt vời"]; // Descriptions for each rating
  const [rate, setRate] = useState(5);
  const [rateMessage, setRateMessage] = useState("");

  // Check rate and set message

  //Img
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [form] = Form.useForm();
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");

  const validateUpload = (file: RcFile): boolean => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("Chỉ chấp nhận file JPG/PNG!");
    }
    const isLt1MB = file.size / 1024 / 1024 < 1;
    if (!isLt1MB) {
      message.error("Dung lượng phải nhỏ hơn 1MB!");
    }
    return isJpgOrPng && isLt1MB;
  };

  const handleChange: UploadProps["onChange"] = (info) => {
    let newFileList = [...info.fileList];

    // Nếu có file upload thành công, cập nhật URL
    newFileList = newFileList.map((file) => {
      if (file.response) {
        file.url = file.response.url; // Cập nhật URL từ response
      }
      return file;
    });

    setFileList(newFileList);
  };

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewVisible(true);
    setPreviewTitle(
      file.name || file.url!.substring(file.url!.lastIndexOf("/") + 1)
    );
  };

  const handleCancel = () => setPreviewVisible(false);

  const uploadProps: UploadProps = {
    beforeUpload: validateUpload,
    onChange: handleChange,
    onPreview: handlePreview,
    fileList: fileList,
    maxCount: 4,
    listType: "picture-card",
    accept: "image/png,image/jpeg",
    customRequest: ({ onSuccess }) => {
      setTimeout(() => {
        if (onSuccess) {
          onSuccess("ok");
        }
      }, 0);
    },
  };

  const getBase64 = (file: RcFile): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  const queryClient = useQueryClient();
  const { mutate: mutateDanhgia } = useMutation({
    mutationFn: async (data: any) => {
      try {
        const response = await instanceClient.post(`danhgia`, data);
        if (response.status === 200) {
          message.success("Đánh giá thành công");
          setDanhgia(false);
        }
      } catch (error) {
        message.error("Đánh giá thất bại");
        throw new Error("Error during review creation");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["MyOrder_LISTas"],
      });
    },
  });
  const onFinish = async (values: any) => {
    const data = {
      ma_don_hang: slug,
      anh_danh_gia: [] as string[], // Khởi tạo mảng chứa các URL ảnh
      chat_luong_san_pham: rateMessage,
      mo_ta: values.mo_ta,
      so_sao_san_pham: values.so_sao_san_pham,
      so_sao_dich_vu_van_chuyen: values.so_sao_dich_vu_van_chuyen,
    };

    if (fileList.length > 0) {
      // Nếu có ảnh, lấy URL của ảnh đã upload
      const uploadPromises = fileList.map((file) =>
        uploadToCloudinary(file.originFileObj as RcFile)
      );
      const uploadedUrls = await Promise.all(uploadPromises);
      console.log(uploadedUrls);

      data.anh_danh_gia = uploadedUrls; // Ghép các URL ảnh lại với nhau
    }

    console.log(rateMessage);
    // Xử lý gửi dữ liệu, có thể gọi API hoặc lưu vào state tùy theo yêu cầu
    mutateDanhgia(data);
  };
  useEffect(() => {
    if (rate == 1) {
      setRateMessage("Tệ");
    } else if (rate == 2) {
      setRateMessage("Không tốt");
    } else if (rate == 3) {
      setRateMessage("Bình thường");
    } else if (rate == 4) {
      setRateMessage("Tốt");
    } else if (rate == 5) {
      setRateMessage("Tuyệt vời");
    }
  }, [rate]);
  return (
    <div>
      {" "}
      <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75 z-50">
        <div className="p-6 bg-white rounded-lg shadow-lg  max-w-lg w-full mx-auto">
          {/* Header */}
          <Form layout="vertical" onFinish={onFinish} form={form}>
            <div className="flex justify-between items-start mb-4">
              <h1 onClick={() => setDanhgia(false)}>
                <i className="fa-solid fa-chevron-down fa-rotate-90 text-xl cursor-pointer"></i>
              </h1>
              <h2 className="text-xl font-semibold">Đánh giá sản phẩm</h2>

              <Form.Item>
                <Button
                  htmlType="submit"
                  className="text-xl font-semibold text-orange-600 cursor-pointer border-none"
                >
                  Gửi
                </Button>
              </Form.Item>
            </div>

            {/* Product Info */}

            {/* Rating */}
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Chất lượng sản phẩm</h3>
              <Form.Item>
                <div className="flex items-start space-x-2 my-2">
                  <Rate
                    defaultValue={5}
                    character={({ index = 0 }) => (
                      <span
                        className={`text-2xl ${
                          rate > index ? "opacity-100" : "opacity-50"
                        }`}
                      >
                        {customIcons[index]}
                      </span>
                    )}
                    value={rate}
                    tooltips={desc}
                    onChange={(value) => setRate(value)}
                  />
                  {rate ? (
                    <span className="ml-2 text-xl text-gray-600 flex-shrink-0">
                      {desc[rate - 1]}
                    </span>
                  ) : null}
                </div>
              </Form.Item>{" "}
            </div>

            {/* Image/Video Upload */}
            <Form.Item
              name="rankImage"
              label="Hình cho hạng thành viên"
              valuePropName="fileList"
              getValueFromEvent={(e) => {
                if (Array.isArray(e)) {
                  return e;
                }
                return e && e.fileList;
              }}
            >
              <Upload {...uploadProps}>
                {fileList.length < 4 && (
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

            {/* Additional Review Section */}
            <div className="border border-red-500 p-4 my-4">
              <h4 className="text-sm font-semibold text-red-500 mb-1">
                Mục đánh giá bổ sung dành cho Người mua
              </h4>
              <h4 className="text-sm font-semibold text-black mb-1">
                Chất liệu sản phẩm : VD tốt, đẹp
              </h4>
              <h4 className="text-sm font-semibold text-black mb-1">
                Công dụng:VD Mặc đẹp, chất lượng tốt
              </h4>
            </div>

            {/* Review Text Area */}

            <Form.Item
              label="Đánh giá bổ sung"
              name="mo_ta"
              rules={[
                { required: true, message: "Vui lòng nhập đánh giá bổ sung!" },
              ]}
            >
              <Input.TextArea
                placeholder="Chia sẻ cảm nhận về sản phẩm (Tối đa 200 ký tự)"
                maxLength={200}
                rows={3}
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
              />
            </Form.Item>
            {/* Toggle Username Display */}

            {/* Additional Ratings */}
            <div className="">
              <div className="flex justify-between items-start">
                <span className="text-lg font-medium">
                  Dịch vụ của người bán
                </span>
                <div className="flex space-x-1">
                  <Form.Item name={"so_sao_san_pham"}>
                    <Rate defaultValue={5} />
                  </Form.Item>
                </div>
              </div>
              <div className="flex justify-between items-start">
                <span className=" text-lg font-medium">Dịch vụ vận chuyển</span>

                <Form.Item name="so_sao_dich_vu_van_chuyen">
                  <Rate defaultValue={5} />
                </Form.Item>
              </div>{" "}
            </div>
          </Form>
        </div>
      </div>
      <Modal
        visible={previewVisible}
        title={previewTitle}
        footer={null}
        onCancel={handleCancel}
      >
        <img alt="example" style={{ width: "100%" }} src={previewImage} />
      </Modal>
    </div>
  );
};

export default Danhgia;
