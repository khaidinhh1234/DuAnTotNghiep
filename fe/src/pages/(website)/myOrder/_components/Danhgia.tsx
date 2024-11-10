import { uploadToCloudinary } from "@/configs/cloudinary";
import { UploadOutlined } from "@ant-design/icons";
import type { GetProp, UploadProps } from "antd";
import { Button, Form, Input, message, Modal, Rate, Upload } from "antd";
import { RcFile, UploadFile } from "antd/es/upload";
import { useState } from "react";

const Danhgia = ({ setDanhgia }: any) => {
  const [rate, setRate] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const customIcons = ["😞", "😐", "😊", "😃", "😍"]; // Custom icons for rating
  const desc = ["Tệ", "Không tốt", "Bình thường", "Tốt", "Tuyệt vời"]; // Descriptions for each rating
  //Img
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [form] = Form.useForm();
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [loading, setLoading] = useState(false);
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
    newFileList = newFileList.slice(-1);
    newFileList = newFileList.map((file) => {
      if (file.response) {
        file.url = file.response.url;
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
    maxCount: 1,
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

  const onFinish = (values: any) => {
    if (fileList.length > 0 && fileList[0].originFileObj) {
      const cloudinaryUrl = uploadToCloudinary(fileList[0].originFileObj);

      console.log("Form submitted:", { ...values, rate: cloudinaryUrl });
    }

    // setDanhgia(false);
  };
  return (
    <div>
      {" "}
      <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75 z-50">
        <div className="p-6 bg-white rounded-lg shadow-lg  max-w-lg w-full mx-auto">
          {/* Header */}
          <Form layout="vertical" onFinish={onFinish} form={form}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Đánh giá sản phẩm</h2>
              <h2
                className="text-xl font-semibold text-orange-600 cursor-pointer"
                onClick={() => setDanhgia(false)}
              >
                Gửi
              </h2>
            </div>

            {/* Product Info */}
            <div className="mb-4">
              <p className="text-sm text-gray-700">
                Xem Hướng dẫn đánh giá chuẩn để nhận đến{" "}
              </p>
            </div>

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
                {fileList.length === 0 && (
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
              name="additionalReview"
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
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Dịch vụ của người bán</span>
                <div className="flex space-x-1">
                  <Form.Item name={"vsd"}>
                    <Rate
                      onChange={(value) =>
                        console.log("Seller service:", value)
                      }
                    />
                  </Form.Item>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span>Dịch vụ vận chuyển</span>
                <div className="flex space-x-1">
                  <Form.Item name={"hrty"}>
                    <Rate
                      onChange={(value) =>
                        console.log("Shipping service:", value)
                      }
                    />
                  </Form.Item>
                </div>
              </div>{" "}
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Gửi đánh giá
                </Button>
              </Form.Item>
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
