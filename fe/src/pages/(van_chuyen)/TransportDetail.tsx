import instance from "@/configs/admin";
import { uploadToCloudinary } from "@/configs/cloudinary";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Image, message, Modal } from "antd";
import { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";

const TransportDetail = ({ record }: any) => {
  const [modalWidth, setModalWidth] = useState(400);

  useEffect(() => {
    const updateWidth = () => {
      setModalWidth(window.innerWidth >= 768 ? 1200 : 400);
    };

    // Gọi hàm khi component mount
    updateWidth();

    // Lắng nghe sự thay đổi của kích thước màn hình
    window.addEventListener("resize", updateWidth);

    // Xóa lắng nghe khi component unmount
    return () => window.removeEventListener("resize", updateWidth);
  }, []);
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const id = record?.id;
  const { data } = useQuery({
    queryKey: ["vanchuyen", id],
    queryFn: async () => {
      const response = await instance.get(`/vanchuyen/${id}`);
      return response.data;
    },
    // enabled: !!id,
  });

  const vanChuyenData = data?.data?.van_chuyen;
  const products = data?.data?.van_chuyen?.don_hang?.chi_tiets?.map(
    (item: any) => {
      return {
        ...item,
      };
    }
  );
  const thongtin = data?.data?.thong_tin;
  // console.log(thongtin);
  const donhang = data?.data?.van_chuyen?.don_hang;

  const vanchuyen = data?.data?.van_chuyen;
  console.log(vanchuyen);
  // const webcam = data?.data?.anh_xac_thuc;
  // console.log(webcam);
  const handleCancel = () => {
    setOpen(false);
  };
  const { mutateAsync: mutate } = useMutation({
    mutationFn: async ({
      id,
      action,
      imageUrl,
      failedAttempts,
      notes,
    }: any) => {
      try {
        let response;
        const shipperXacNhan = failedAttempts >= 3 ? "2" : "1";
        if (action === "Xác nhận giao hàng") {
          response = await instance.put(
            `/vanchuyen/xac-nhan-van-chuyen/${id}`,
            {
              anh_xac_thuc: imageUrl,
              shipper_xac_nhan: shipperXacNhan,
              ghi_chu: notes,
              id: [id],
              failedAttempts,
            }
          );
        } else {
          response = await instance.put("/vanchuyen/trang-thai-van-chuyen", {
            trang_thai_van_chuyen: action,
            id: [id],
            ghi_chu: notes,
          });
        }
        return response.data;
      } catch (error) {
        message.error("Lỗi xảy ra");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vanchuyen"] });
    },
  });
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isWebcamVisible, setIsWebcamVisible] = useState<boolean>(() => {
    return JSON.parse(localStorage.getItem("isWebcamVisible") || "false");
  });
  const [isImageSaved, setIsImageSaved] = useState(false);
  const [failedAttemptsNotes, setFailedAttemptsNotes] = useState<string[]>([]);
  // const [note, setNote] = useState(""); // Để lưu ghi chú
  const [notes, setNotes] = useState(() => {
    const savedNotes = localStorage.getItem("deliveryNotes");
    return savedNotes ? JSON.parse(savedNotes) : [];
  });
  const [currentNote, setCurrentNote] = useState(""); // Để lưu ghi chú hiện tại
  const [isFailureNoteVisible, setIsFailureNoteVisible] = useState(false);
  const [isDeliveryConfirmed, setIsDeliveryConfirmed] = useState(false);
  const [filteredData, setFilteredData] = useState<any[]>([]);

  // const [noteCount, setNoteCount] = useState(0);
  const [isSuccessDeliveryOpen, setIsSuccessDeliveryOpen] = useState(false);
  const [isFailureDeliveryOpen, setIsFailureDeliveryOpen] = useState(false);
  const [isDeliveryButtonsVisible, setIsDeliveryButtonsVisible] =
    useState(true);
  // Thay đổi label của nút dựa trên số lần gửi ghi chú
  const [buttonLabel, setButtonLabel] = useState("Gửi ghi chú");
  const [noteSubmissionCount, setNoteSubmissionCount] = useState(0);

  const toggleSuccessDelivery = () => {
    setIsSuccessDeliveryOpen(!isSuccessDeliveryOpen);
    setIsDeliveryButtonsVisible(false); // Ẩn các nút sau khi nhấn
    setIsFailureDeliveryOpen(false);
  };

  const toggleFailureDelivery = () => {
    setIsFailureDeliveryOpen(!isFailureDeliveryOpen);
    // setIsDeliveryButtonsVisible(false);
    setIsSuccessDeliveryOpen(false);
  };
  const webcamRef = useRef<Webcam>(null);

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user",
  };

  useEffect(() => {
    localStorage.setItem("isWebcamVisible", JSON.stringify(isWebcamVisible));
  }, [isWebcamVisible]);

  useEffect(() => {
    if (record.trang_thai_van_chuyen === "Đang giao hàng" && !isImageSaved) {
      setIsWebcamVisible(true);
    } else {
      setIsWebcamVisible(false);
    }
  }, [record.trang_thai_van_chuyen, isImageSaved]);

  const capturePhoto = () => {
    if (record.trang_thai_van_chuyen !== "Đang giao hàng") {
      message.error("Chỉ có thể chụp ảnh khi đang ở trạng thái đang giao hàng");
      return;
    }

    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setUrl(imageSrc);
    } else {
      message.error("Webcam không khả dụng");
    }
  };

  const removePhoto = () => {
    setUrl(null);
    message.success("Xóa ảnh thành công");
  };
  const handleSave = async () => {
    try {
      setLoading(true);

      if (!url) {
        message.error("Vui lòng chụp ảnh trước khi xác nhận");
        setLoading(false);
        return;
      }

      const fetchResponse = await fetch(url);
      const blob = await fetchResponse.blob();
      const file = new File([blob], "photo.jpg", { type: "image/jpeg" });

      const imageUrl = await uploadToCloudinary(file);
      if (!imageUrl) {
        message.error("Lỗi khi tải ảnh lên");
        setLoading(false);
        return;
      }

      await mutate({
        id: record.id,
        action: "Xác nhận giao hàng",
        imageUrl,
        failedAttempts: record.failedAttempts + 1,
        notes: failedAttemptsNotes,
      });

      setIsImageSaved(true);
      setUrl(null);
      setIsWebcamVisible(false);

      // Đánh dấu trạng thái giao hàng thành công
      setIsDeliveryConfirmed(true);
    } catch (error) {
      message.error("Lỗi khi xác nhận giao hàng");
    } finally {
      setLoading(false);
    }
  };

  const [isDeliveryFailed, setIsDeliveryFailed] = useState(false);
  const handleSendNote = async () => {
    try {
      setLoading(true);

      if (!currentNote) {
        message.error("Vui lòng nhập ghi chú trước khi gửi");
        setLoading(false);
        return;
      }

      const newNote = currentNote.trim();
      const updatedNotes = [...notes, newNote];
      setNotes(updatedNotes);
      setCurrentNote("");

      const ghiChuCapNhat = updatedNotes.reduce((acc, note, index) => {
        acc[`lan${index + 1}`] = note;
        return acc;
      }, {});

      const response = await instance.put(
        `/vanchuyen/xac-nhan-van-chuyen/${record.id}`,
        {
          ghi_chu: ghiChuCapNhat,
          shipper_xac_nhan: "2", // 2: Giao hàng thất bại
        }
      );

      if (response?.data?.status) {
        message.success(
          response?.data?.message || "Ghi chú đã được gửi thành công"
        );

        const newNoteCount = noteSubmissionCount + 1; // Tăng số lần gửi ghi chú
        setNoteSubmissionCount(newNoteCount);

        // Ẩn phần ghi chú nếu đã gửi đủ 3 lần
        if (newNoteCount >= 3) {
          setButtonLabel("Xác nhận giao hàng thất bại");
          setIsDeliveryFailed(true); // Cập nhật trạng thái
        }

        queryClient.invalidateQueries({ queryKey: ["vanchuyen"] });
      } else {
        message.error(response?.data?.message || "Có lỗi xảy ra");
      }
    } catch (error) {
      console.error("Lỗi khi gửi ghi chú:", error);
      message.error("Lỗi khi gửi ghi chú");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {" "}
      <p onClick={() => setOpen(true)}>
        <div className="relative">
          <div className="relative flex flex-col md:flex-row justify-between md:items-center">
            <h1 className="text-base md:text-lg">
              Mã Vận chuyển:{" "}
              <span>
                {vanChuyenData ? vanChuyenData.ma_van_chuyen : "Loading..."}
              </span>{" "}
              <br />
              Ngày tạo:{" "}
              <span>
                {vanChuyenData
                  ? new Date(vanChuyenData.ngay_tao).toLocaleDateString("vi-VN")
                  : "Loading..."}
              </span>
            </h1>

            <div className="mt-2 md:mt-0 text-left md:text-right">
              {" "}
              {/* Thêm khoảng cách khi chuyển xuống dưới ở mobile */}
              <div>
                <span
                  className={`font-bold
          ${vanchuyen?.trang_thai_van_chuyen === "Chờ xử lý" ? "text-yellow-500" : ""}
          ${vanchuyen?.trang_thai_van_chuyen === "Đang giao hàng" ? "text-blue-500" : ""}
          ${vanchuyen?.trang_thai_van_chuyen === "Giao hàng thành công" ? "text-green-500" : ""}
          ${vanchuyen?.trang_thai_van_chuyen === "Giao hàng thất bại" ? "text-red-500" : ""}
        `}
                >
                  {vanchuyen
                    ? vanchuyen.trang_thai_van_chuyen
                    : "Không có dữ liệu"}
                </span>
              </div>
              <p className="text-xs md:text-lg text-gray-800">
                Tổng số tiền ({data?.data?.tong_so_luong} sản phẩm):{" "}
                {data?.data?.tong_thanh_tien_san_pham.toLocaleString("vi-VN")}
              </p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-start space-y-4 md:space-x-4 mb-4">
            <div className="w-full md:w-3/4">
              {products ? (
                products.map((product: any) => (
                  <div key={product.id} className="flex mb-4 border-b pb-4">
                    <img
                      src={product?.bien_the_san_pham?.san_pham?.anh_san_pham}
                      alt="Product Image"
                      className="w-20 h-20 md:w-24 md:h-28 object-cover rounded mr-4"
                    />
                    <div className="flex flex-col justify-between w-full">
                      <h3 className="text-sm md:text-lg font-semibold truncate-title hover:text-red-500 cursor-pointer">
                        {product?.bien_the_san_pham?.san_pham?.ten_san_pham ||
                          "Unknown Product"}
                      </h3>
                      <div className="text-xs md:text-base text-gray-500 mt-1">
                        Size:{" "}
                        <span>
                          {product?.bien_the_san_pham?.kich_thuoc_bien_the
                            ?.kich_thuoc || "N/A"}
                        </span>
                        , Màu:{" "}
                        <span>
                          {product?.bien_the_san_pham?.mau_bien_the
                            ?.ten_mau_sac || "N/A"}
                        </span>
                      </div>

                      <span className="text-xs md:text-lg text-gray-500 mt-1">
                        x{product.so_luong}
                      </span>

                      <div className="flex items-end mt-2">
                        <span className="text-xs md:text-base text-gray-500 line-through mr-1">
                          ₫
                          {product?.bien_the_san_pham?.gia_ban?.toLocaleString(
                            "vi-VN"
                          ) || "0"}
                        </span>
                        <span className="text-base md:text-xl font-semibold text-red-500">
                          ₫
                          {product?.bien_the_san_pham?.gia_khuyen_mai?.toLocaleString(
                            "vi-VN"
                          ) || "0"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p>Loading...</p>
              )}
            </div>
          </div>
        </div>
      </p>
      <Modal
        centered
        open={open}
        width={modalWidth}
        className=" "
        okText="Đồng ý"
        footer={null}
        onCancel={handleCancel}
      >
        <div className="p-4 bg-white min-h-screen   ">
          {/* Header */}
          <div className="flex items-center space-x-2 text-lg font-semibold text-gray-700">
            <span>Thông tin đơn hàng</span>
          </div>
          <div className="bg-white rounded-md shadow-md p-4 mt-4">
            <div>
              <p className="text-gray-700 font-semibold">
                Thông tin vận chuyển
              </p>
              <p className="text-gray-500 text-sm">
                Glow clothing Express: SPXVN042195340009
              </p>
            </div>
            {/* Address Info */}
            <div className="bg-white rounded-md shadow-md p-4 mt-4">
              <p className="text-gray-700 font-semibold">Địa chỉ nhận hàng</p>
              <p className="text-gray-500 text-sm">
                {record.van_chuyen?.don_hang?.ten_nguoi_dat_hang
                  ? `${record.van_chuyen.don_hang.ten_nguoi_dat_hang} - ${record.van_chuyen.don_hang.so_dien_thoai_nguoi_dat_hang || ""}`
                  : `${thongtin?.ten_nguoi_dat_hang || ""} (+${thongtin?.so_dien_thoai_nguoi_dat_hang || ""})`}
              </p>
              <p className="text-gray-500 text-sm">
                Địa chỉ:{" "}
                {record.van_chuyen?.don_hang?.dia_chi_nguoi_dat_hang
                  ? record.van_chuyen?.don_hang.dia_chi_nguoi_dat_hang
                  : thongtin?.dia_chi_nguoi_dat_hang}
              </p>{" "}
              <p className="text-gray-500 text-sm">
                Ghi chú :{" "}
                {record?.van_chuyen?.don_hang.ghi_chu
                  ? record.van_chuyen?.don_hang.ghi_chu
                  : donhang?.ghi_chu || "Không có ghi chú"}
              </p>
            </div>
          </div>
          {/* Product Info */}
          <div className="bg-white rounded-md shadow-md p-4 mt-4 relative">
            <p className="text-gray-700 font-semibold mb-2 text-base">
              Mã đơn hàng:{" "}
              <span>{donhang ? donhang.ma_don_hang : "Không có dữ liệu"}</span>
            </p>
            <div className="flex items-start space-x-4 mb-2 border-b pb-5">
              <div>
                {products ? (
                  products.map((product: any) => (
                    <div
                      key={product.id}
                      className="flex flex-col sm:flex-row mb-4 border-b pb-4"
                    >
                      <img
                        src={product?.bien_the_san_pham?.san_pham?.anh_san_pham}
                        alt="Product Image"
                        className="w-20 h-20 sm:w-24 sm:h-28 object-cover rounded mr-4"
                      />
                      <div className="flex flex-col justify-between w-full">
                        <h3 className="text-sm sm:text-lg font-semibold truncate hover:text-red-500 cursor-pointer">
                          {product?.bien_the_san_pham?.san_pham?.ten_san_pham ||
                            "Unknown Product"}
                        </h3>
                        <div className="text-xs sm:text-base text-gray-500 mt-1">
                          Size:{" "}
                          <span>
                            {product?.bien_the_san_pham?.kich_thuoc_bien_the
                              ?.kich_thuoc || "N/A"}
                          </span>
                          , Màu:{" "}
                          <span>
                            {product?.bien_the_san_pham?.mau_bien_the
                              ?.ten_mau_sac || "N/A"}
                          </span>
                        </div>
                        <span className="text-xs sm:text-lg text-gray-500 mt-1">
                          x{product.so_luong}
                        </span>
                        <div className="flex items-end mt-2">
                          <span className="text-xs sm:text-base text-gray-500 line-through mr-1">
                            ₫
                            {product?.bien_the_san_pham?.gia_ban?.toLocaleString(
                              "vi-VN"
                            ) || "0"}
                          </span>
                          <span className="text-base sm:text-xl font-semibold text-red-500">
                            ₫
                            {product?.bien_the_san_pham?.gia_khuyen_mai?.toLocaleString(
                              "vi-VN"
                            ) || "0"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>Loading...</p>
                )}
              </div>

              {/* Thành tiền and Tổng tiền COD in the bottom right corner */}
              <div className="absolute bottom-4 right-4 text-right">
                <p className="md:text-lg text-gray-700">
                  Thành tiền:{" "}
                  <span className="font-semibold text-red-500">
                    {vanchuyen?.tien_cod
                      ? vanchuyen.tien_cod.toLocaleString("vn-VN")
                      : "0"}{" "}
                    ₫
                  </span>
                </p>
                <p className="md:text-lg font-bold text-gray-700 mt-1">
                  Tổng tiền COD:{" "}
                  <span className="font-bold text-red-500">
                    {vanchuyen?.tien_cod
                      ? vanchuyen.tien_cod.toLocaleString("vn-VN")
                      : "0"}{" "}
                    ₫
                  </span>
                </p>
              </div>
            </div>
          </div>
          {/* trang th */}
          <div className="flex justify-between mt-4">
            <div className="flex flex-col gap-2 w-full">
              {/* Nút Giao hàng */}
              {record.trang_thai_van_chuyen === "Chờ xử lý" ||
              record.trang_thai_van_chuyen === "Chờ lấy hàng" ? (
                <button
                  className="w-full py-2 border bg-blue-600 rounded-lg text-white hover:bg-blue-700"
                  onClick={() => {
                    setIsWebcamVisible(true);
                    mutate({ id: record.id, action: "Đang giao hàng" });
                  }}
                >
                  Giao hàng
                </button>
              ) : record.trang_thai_van_chuyen === "Đang giao hàng" &&
                isDeliveryButtonsVisible ? (
                <div className="flex gap-2">
                  {/* Nút Giao hàng thất bại */}
                  <button
                    className="w-1/2 py-2 border bg-red-500 rounded-lg text-white hover:bg-red-600"
                    onClick={() => {
                      setIsFailureNoteVisible(true);
                      toggleFailureDelivery();
                    }}
                  >
                    Giao hàng thất bại
                  </button>
                  {/* Nút Giao hàng thành công */}
                  <button
                    className="w-1/2 py-2 border bg-green-500 rounded-lg text-white hover:bg-green-600"
                    onClick={() => {
                      toggleSuccessDelivery();
                      setIsFailureNoteVisible(false);
                    }}
                  >
                    Giao hàng thành công
                  </button>
                </div>
              ) : null}

              {/* Phần hiển thị khi chọn Giao hàng thành công */}
              {isSuccessDeliveryOpen && (
                <div className="flex flex-col gap-2 mt-4">
                  {isWebcamVisible && !isImageSaved && (
                    <div className="relative mx-auto mt-6">
                      {url ? (
                        <div className="relative">
                          <img
                            src={url}
                            alt="Ảnh chụp"
                            className="w-60 rounded-lg"
                          />
                          <div className="absolute bottom-[-30px] inset-x-0 flex justify-center items-center">
                            <button
                              onClick={removePhoto}
                              className="px-4 opacity-70 py-3 rounded-full text-3xl bg-white/80 backdrop-blur-sm"
                              title="Xóa ảnh"
                            >
                              <i className="fa-regular fa-trash-can"></i>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="relative">
                          <Webcam
                            ref={webcamRef}
                            screenshotFormat="image/jpeg"
                            videoConstraints={videoConstraints}
                            className="w-60 rounded-lg"
                            audio={false}
                          />
                          <div className="absolute bottom-[-30px] inset-x-0 flex justify-center items-center">
                            <button
                              onClick={capturePhoto}
                              className="px-4 opacity-70 py-3 rounded-full text-3xl bg-white/80 backdrop-blur-sm"
                              title="Chụp ảnh"
                            >
                              <i className="fa-regular fa-camera"></i>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  {!isDeliveryConfirmed && ( // Chỉ hiển thị nút nếu chưa xác nhận
                    <button
                      className="w-full py-2 border bg-purple-500 rounded-lg text-white hover:bg-purple-400 mt-7"
                      onClick={handleSave}
                      disabled={loading || isImageSaved}
                    >
                      {loading
                        ? "Đang xử lý..."
                        : "Xác nhận giao hàng thành công"}
                    </button>
                  )}
                </div>
              )}
              {/* Phần hiển thị khi chọn Giao hàng thất bại */}
              {isFailureNoteVisible && !isDeliveryFailed && (
                <div className="flex flex-col mt-4">
                  <textarea
                    value={currentNote}
                    onChange={(e) => setCurrentNote(e.target.value)}
                    placeholder="Nhập ghi chú tại đây"
                    className="w-full border rounded-lg p-2"
                  />
                  <button
                    className="w-full py-2 border bg-blue-500 rounded-lg text-white hover:bg-blue-700 font-semibold mt-2"
                    onClick={handleSendNote}
                    disabled={loading}
                  >
                    {buttonLabel}
                  </button>
                  {notes.length > 0 && (
                    <div className="mt-4">
                      <h3 className="font-semibold">Danh sách ghi chú:</h3>
                      <ul className="list-disc pl-5">
                        {notes.map((note: any, index: number) => (
                          <li key={index} className="mt-1">
                            {note}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
              {/* Kết quả sau khi giao hàng */}
              {record.trang_thai_van_chuyen === "Giao hàng thành công" && (
                <div className="mt-4 text-center">
                  <div className="text-green-600 font-semibold">
                    ✅ Giao hàng thành công!
                  </div>
                  {/* Hiển thị ảnh xác thực */}
                  {record.anh_xac_thuc && (
                    <div className="mt-2">
                      <Image
                        src={record.anh_xac_thuc}
                        alt="Ảnh xác thực"
                        style={{
                          width: "100%",
                          maxHeight: "24rem",
                          objectFit: "contain",
                          border: "1px solid #ddd",
                          borderRadius: "0.5rem",
                        }}
                        preview={{
                          mask: <span>Xem ảnh</span>,
                        }}
                      />
                    </div>
                  )}
                </div>
              )}
              {/* Kết quả sau khi thất bại */}
              {record.trang_thai_van_chuyen === "Giao hàng thất bại" && (
                <div className="mt-4 text-center">
                  <div className="mt-4 text-center text-red-600 font-semibold">
                    ❌ Giao hàng thất bại!
                  </div>
                  {record.ghi_chu && (
                    <div className="mt-4">
                      <h4 className="text-lg font-bold">Lịch sử giao hàng:</h4>
                      <ul className="mt-2 list-disc list-inside text-left text-gray-700">
                        <li>
                          <span className="font-medium">{record.ghi_chu}</span>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TransportDetail;
