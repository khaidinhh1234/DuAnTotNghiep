import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import type { GetProp, UploadProps } from "antd";
import { Flex, message, Rate, Upload } from "antd";
import { useState } from "react";

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const getBase64 = (img: FileType, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result as string));
  reader.readAsDataURL(img);
};

const beforeUpload = (file: FileType) => {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("You can only upload JPG/PNG file!");
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("Image must smaller than 2MB!");
  }
  return isJpgOrPng && isLt2M;
};
const Danhgia = () => {
  const [rate, setRate] = useState(3);
  const [reviewText, setReviewText] = useState("");
  const [qualityRating, setQualityRating] = useState(0);
  const [toggleUsername, setToggleUsername] = useState(true);
  const customIcons = ["😞", "😐", "😊", "😃", "😍"]; // Custom icons for rating
  const desc = ["Tệ", "Không tốt", "Bình thường", "Tốt", "Tuyệt vời"]; // Descriptions for each rating
  //Img
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>();

  const handleChange: UploadProps["onChange"] = (info) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }
    if (info.file.status === "done") {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj as FileType, (url) => {
        setLoading(false);
        setImageUrl(url);
      });
    }
  };

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  return (
    <div>
      {" "}
      <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75 z-50">
        <div className="p-6 bg-white rounded-lg shadow-lg  max-w-lg w-full mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Đánh giá sản phẩm</h2>
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
                onChange={setRate}
              />
              {rate ? (
                <span className="ml-2 text-xl text-gray-600 flex-shrink-0">
                  {desc[rate - 1]}
                </span>
              ) : null}
            </div>
          </div>

          {/* Image/Video Upload */}
          <Flex gap="middle" wrap>
            <Upload
              name="avatar"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
              beforeUpload={beforeUpload}
              onChange={handleChange}
            >
              {imageUrl ? (
                <img src={imageUrl} alt="avatar" style={{ width: "100%" }} />
              ) : (
                uploadButton
              )}
            </Upload>
          </Flex>
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
          <textarea
            placeholder="Hãy chia sẻ cảm nhận về sản phẩm (Tối đa 200 ký tự)"
            className="w-full border border-gray-300 p-2 rounded-lg mb-4"
            rows={3}
            maxLength={200}
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
          />

          {/* Toggle Username Display */}

          {/* Additional Ratings */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Dịch vụ của người bán</span>
              <div className="flex space-x-1">
                <Rate onChange={(value) => console.log(value)} />
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span>Dịch vụ vận chuyển</span>
              <div className="flex space-x-1">
                <Rate onChange={(value) => console.log(value)} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Danhgia;
