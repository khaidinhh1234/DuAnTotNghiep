import instance from "@/configs/admin";
import { uploadToCloudinary } from "@/configs/cloudinary";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Image, message, Modal } from "antd";
import { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";

const TransportDetail = ({ record }: any) => {
  console.log("record:", record)
  const [modalWidth, setModalWidth] = useState(400);

  useEffect(() => {
    const updateWidth = () => {
      setModalWidth(window.innerWidth >= 768 ? 1200 : 400); // `1200px` khi md trở lên, `400px` cho màn hình nhỏ
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
    queryKey: ["SHIPPER", id],
    queryFn: async () => {
      const response = await instance.get(`/vanchuyen/${id}`);
      return response.data;
    },
    enabled: !!id,
  });

  console.log(data);
  const vanChuyenData = data?.data?.van_chuyen;
  console.log(vanChuyenData);
  const products = data?.data?.van_chuyen?.don_hang?.chi_tiets?.map((item: any) => {
    return {
      ...item,
    };
  });
  const thongtin = data?.data?.thong_tin
  console.log(thongtin)
  const donhang = data?.data?.van_chuyen?.don_hang;

  const vanchuyen = data?.data?.van_chuyen

  const webcam = data?.data?.anh_xac_thuc
  console.log(webcam)
  const handleCancel = () => {
    setOpen(false);
  };
  const { mutateAsync: mutate } = useMutation({
    mutationFn: async ({ id, action, imageUrl, failedAttempts, notes }: any) => {
      try {
        let response;
        const shipperXacNhan = failedAttempts >= 3 ? "2" : "1";
        if (action === "Xác nhận giao hàng") {
          response = await instance.put(`/vanchuyen/xac-nhan-van-chuyen/${id}`, {
            anh_xac_thuc: imageUrl,
            shipper_xac_nhan: shipperXacNhan,
            ghi_chu: notes,
            id: [id],
            failedAttempts,
          });
        } else {
          response = await instance.put("/vanchuyen/trang-thai-van-chuyen", {
            trang_thai_van_chuyen: action,
            id: [id],
            // ghi_chu: notes,
          });
        }
        // const error = response.data.message;
        return response.data;
        // if (error) {
        //     message.success(error);
        // } else {
        //     message.success("Cập nhật thành công");
        // }
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
    const savedNotes = localStorage.getItem('deliveryNotes');
    return savedNotes ? JSON.parse(savedNotes) : [];
  });
  const [currentNote, setCurrentNote] = useState(""); // Để lưu ghi chú hiện tại
  const [isFailureNoteVisible, setIsFailureNoteVisible] = useState(false);

  // const [noteCount, setNoteCount] = useState(0);
  const [isSuccessDeliveryOpen, setIsSuccessDeliveryOpen] = useState(false);
  const [isFailureDeliveryOpen, setIsFailureDeliveryOpen] = useState(false);
  const [isDeliveryButtonsVisible, setIsDeliveryButtonsVisible] = useState(true);
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
    } catch (error) {
      message.error("Lỗi khi xác nhận giao hàng");
    } finally {
      setLoading(false);
    }
  };

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
      // localStorage.setItem('deliveryNotes', JSON.stringify(updatedNotes));
      setCurrentNote("");

      // Gửi ghi chú lên server
      const ghiChuCapNhat = updatedNotes.map((note, index) => ({
        [`lan${index + 1}`]: note
      }));
      const response = await instance.put(`/vanchuyen/xac-nhan-van-chuyen/${record.id}`, {
        ghi_chu: ghiChuCapNhat,
        shipper_xac_nhan: "2",
      });

      if (response.data.status) {
        message.success("Ghi chú đã được gửi thành công");
        setNoteSubmissionCount(noteSubmissionCount + 1); // Tăng số lần gửi ghi chú

        // Kiểm tra nếu đã gửi 2 lần
        if (noteSubmissionCount + 1 === 2) {
          setButtonLabel("Xác nhận giao hàng thất bại");
        }
      } else {
        message.error(response.data.message || "Có lỗi xảy ra");
      }
    } catch (error) {
      console.error("Lỗi khi gửi ghi chú:", error);
      message.error("Lỗi khi gửi ghi chú");
    } finally {
      setLoading(false);
    }
  }
  return (
    <div>
      {" "}
      <p onClick={() => setOpen(true)}>
        <div className="relative">
          <div>
            <h1 className="text-lg">
              Mã Vận chuyển: <span>{vanChuyenData ? vanChuyenData.ma_van_chuyen : "Loading..."}</span>
            </h1>
          </div>
          <div className="flex items-start space-x-4 mb-2">
            <div>
              {products ? (
                products.map((product: any) => (
                  <div key={product.id} className="flex mb-4 border-b pb-4">
                    <img
                      src={product?.bien_the_san_pham?.san_pham?.anh_san_pham}
                      alt="Product Image"
                      className="md:w-24 md:h-28 w-20 h-20 object-cover rounded mr-4"
                    />

                    <div className="flex flex-col justify-between w-full">
                      {/* Product Name */}
                      <h3 className="md:text-lg text-sm font-semibold truncate hover:text-red-500 cursor-pointer">
                        {product?.bien_the_san_pham?.san_pham?.ten_san_pham || "Unknown Product"}
                      </h3>

                      {/* Product Details (Size and Color) */}
                      <div className="md:text-base text-xs text-gray-500 mt-1">
                        Size: <span>{product?.bien_the_san_pham?.kich_thuoc_bien_the?.kich_thuoc || "N/A"}</span>,
                        Màu: <span>{product?.bien_the_san_pham?.mau_bien_the?.ten_mau_sac || "N/A"}</span>
                      </div>

                      {/* Quantity */}
                      <span className="md:text-lg text-xs text-gray-500 mt-1">
                        x{product.so_luong}
                      </span>

                      {/* Product Pricing */}
                      <div className="flex items-end mt-2">
                        <span className="md:text-base text-xs text-gray-500 line-through mr-1">
                          ₫{product?.bien_the_san_pham?.gia_ban?.toLocaleString("vi-VN") || "0"}
                        </span>
                        <span className="md:text-xl text-base font-semibold text-red-500">
                          ₫{product?.bien_the_san_pham?.gia_khuyen_mai?.toLocaleString("vi-VN") || "0"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p>Loading...</p>
              )}
            </div>
            <div className="absolute bottom-0 right-0 flex flex-col justify-center items-end space-y-2 p-4 ">
              <div>
                <span
                  className={`
                    font-bold
      ${vanchuyen?.trang_thai_van_chuyen === 'Chờ xử lý' ? 'text-yellow-500' : ''}
      ${vanchuyen?.trang_thai_van_chuyen === 'Đang giao hàng' ? 'text-blue-500' : ''}
      ${vanchuyen?.trang_thai_van_chuyen === 'Giao hàng thành công' ? 'text-green-500' : ''}
      ${vanchuyen?.trang_thai_van_chuyen === 'Giao hàng thất bại' ? 'text-red-500' : ''}
    `}
                >
                  {vanchuyen ? vanchuyen.trang_thai_van_chuyen : "Không có dữ liệu"}
                </span>
              </div>

              <p className="md:text-lg text-xs text-gray-800">
                Tổng số tiền ({data?.data?.tong_so_luong} sản phẩm): {" "}
                {data?.data?.tong_thanh_tien_san_pham.toLocaleString("vi-VN")}
              </p>
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
          {/* Order Status */}
          {/* <div className="bg-teal-600 text-hite rounded-t-md px-3 pt-3 pb-1 mt-4">
            <p className="text-lg font-semibold text-white">
              Đơn hàng đã hoàn thành
            </p>
          </div> */}
          {/* Shipping Info */}
          <div className="bg-white rounded-md shadow-md p-4 mt-4">
            <div>
              <p className="text-gray-700 font-semibold">Thông tin vận chuyển</p>
              <p className="text-gray-500 text-sm">
                Glow clothing Express: SPXVN042195340009
              </p>
            </div>
            {/* Address Info */}
            <div className="bg-white rounded-md shadow-md p-4 mt-4">
              <p className="text-gray-700 font-semibold">Địa chỉ nhận hàng</p>
              <p className="text-gray-500 text-sm">
                {record.van_chuyen?.don_hang?.ten_nguoi_dat_hang
                  ? `${record.van_chuyen.don_hang.ten_nguoi_dat_hang} - ${record.van_chuyen.don_hang.so_dien_thoai_nguoi_dat_hang || ''}`
                  : `${thongtin?.ho + " " + thongtin?.ten || ''} (+${thongtin?.so_dien_thoai || ''})`}
              </p>

              <p className="text-gray-500 text-sm">
                {record.van_chuyen?.don_hang?.dia_chi_nguoi_dat_hang
                  ? record.van_chuyen?.don_hang.dia_chi_nguoi_dat_hang
                  : thongtin?.dia_chi_nguoi_dat_hang
                }
              </p>{" "}
              <p className="text-gray-500 text-sm">
                ghi chú : {record?.van_chuyen?.don_hang.ghi_chu
                  ? record.van_chuyen?.don_hang.ghi_chu
                  : "không có ghi chú"
                }
              </p>
            </div>
          </div>
          {/* Product Info */}
          <div className="bg-white rounded-md shadow-md p-4 mt-4 relative">
            <p className="text-gray-700 font-semibold mb-2 text-base">
              Mã đơn hàng: <span>{donhang ? donhang.ma_don_hang : "Không có dữ liệu"}</span>
            </p>
            <div className="flex items-start space-x-4 mb-2 border-b pb-5">
              <div>
                {products ? (
                  products.map((product: any) => (
                    <div key={product.id} className="flex mb-4 border-b pb-4">
                      <img
                        src={product?.bien_the_san_pham?.san_pham?.anh_san_pham}
                        alt="Product Image"
                        className="md:w-24 md:h-28 w-20 h-20 object-cover rounded mr-4"
                      />
                      <div className="flex flex-col justify-between w-full">
                        <h3 className="md:text-lg text-sm font-semibold truncate hover:text-red-500 cursor-pointer">
                          {product?.bien_the_san_pham?.san_pham?.ten_san_pham || "Unknown Product"}
                        </h3>
                        <div className="md:text-base text-xs text-gray-500 mt-1">
                          Size: <span>{product?.bien_the_san_pham?.kich_thuoc_bien_the?.kich_thuoc || "N/A"}</span>, Màu:{" "}
                          <span>{product?.bien_the_san_pham?.mau_bien_the?.ten_mau_sac || "N/A"}</span>
                        </div>
                        <span className="md:text-lg text-xs text-gray-500 mt-1">x{product.so_luong}</span>
                        <div className="flex items-end mt-2">
                          <span className="md:text-base text-xs text-gray-500 line-through mr-1">
                            ₫{product?.bien_the_san_pham?.gia_ban?.toLocaleString("vi-VN") || "0"}
                          </span>
                          <span className="md:text-xl text-base font-semibold text-red-500">
                            ₫{product?.bien_the_san_pham?.gia_khuyen_mai?.toLocaleString("vi-VN") || "0"}
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
                    {vanchuyen?.tien_cod ? vanchuyen.tien_cod.toLocaleString("vn-VN") : "0"} ₫
                  </span>
                </p>
                <p className="md:text-lg font-bold text-gray-700 mt-1">
                  Tổng tiền COD:{" "}
                  <span className="font-bold text-red-500">
                    {vanchuyen?.tien_cod ? vanchuyen.tien_cod.toLocaleString("vn-VN") : "0"} ₫
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between mt-4">
            <div className="flex flex-col gap-2 w-full">
              {/* Nút Giao hàng */}
              {record.trang_thai_van_chuyen === "Chờ xử lý" || record.trang_thai_van_chuyen === "Chờ lấy hàng" ? (
                <button
                  className="w-full py-2 border bg-blue-600 rounded-lg text-white hover:bg-blue-700"
                  onClick={() => {
                    setIsWebcamVisible(true);
                    mutate({ id: record.id, action: "Đang giao hàng" });
                  }}
                >
                  Giao hàng
                </button>
              ) : record.trang_thai_van_chuyen === "Đang giao hàng" && isDeliveryButtonsVisible ? (
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
                          <img src={url} alt="Ảnh chụp" className="w-60 rounded-lg" />
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
                  <button
                    className="w-full py-2 border bg-purple-500 rounded-lg text-white hover:bg-purple-400 mt-7"
                    onClick={handleSave}
                    disabled={loading || isImageSaved}
                  >
                    {loading ? "Đang xử lý..." : "Xác nhận giao hàng thành công"}
                  </button>
                  {isImageSaved && (
                    <Image
                      src={webcam}
                      alt="Ảnh xác thực"
                      className="w-60 rounded-lg"
                      preview={true}
                    />
                  )}
                </div>
              )}

              {/* Phần hiển thị khi chọn Giao hàng thất bại */}
              {isFailureNoteVisible && (
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
                        {notes.map((note, index) => (
                          <li key={index} className="mt-1">{note}</li>
                        ))}
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
