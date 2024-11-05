import instance from "@/configs/admin";
import { uploadToCloudinary } from "@/configs/cloudinary";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Image, message, Modal } from "antd";
import { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";

const DetailTS = ({ record }: any) => {
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
  const handleCancel = () => {
    setOpen(false);
  };
  // const id = record?.id;
  // const { data } = useQuery({
  //   queryKey: ["SHIPPER"],
  //   queryFn: async () => {
  //     const response = await instance.get(`/vanchuyen/${id}`);
  //     return response.data;
  //   },
  // });

  // const products = data?.data?.van_chuyen?.don_hang?.chi_tiets?.map(
  //   (item: any) => {
  //     return {
  //       ...item,
  //     };
  //   }
  // );
  // const thongtin = data?.data?.thong_tin;
  // // console.log(thongtin)
  // const shipper = data?.data?.van_chuyen?.shipper;
  // // console.log(shipper)
  // const webcam = data?.data?.anh_xac_thuc;
  // console.log(webcam);
  // const handleCancel = () => {
  //   setOpen(false);
  // };
  // const { mutateAsync: mutate } = useMutation({
  //   mutationFn: async ({
  //     id,
  //     action,
  //     imageUrl,
  //     failedAttempts,
  //     notes,
  //   }: any) => {
  //     try {
  //       let response;
  //       const shipperXacNhan = failedAttempts >= 3 ? "2" : "1";
  //       if (action === "Xác nhận giao hàng") {
  //         response = await instance.put(
  //           `/vanchuyen/xac-nhan-van-chuyen/${id}`,
  //           {
  //             anh_xac_thuc: imageUrl,
  //             shipper_xac_nhan: shipperXacNhan,
  //             ghi_chu: notes,
  //             id: [id],
  //             failedAttempts,
  //           }
  //         );
  //       } else {
  //         response = await instance.put("/vanchuyen/trang-thai-van-chuyen", {
  //           trang_thai_van_chuyen: action,
  //           id: [id],
  //           // ghi_chu: notes,
  //         });
  //       }
  //       // const error = response.data.message;
  //       return response.data;
  //       // if (error) {
  //       //     message.success(error);
  //       // } else {
  //       //     message.success("Cập nhật thành công");
  //       // }
  //     } catch (error) {
  //       message.error("Lỗi xảy ra");
  //     }
  //   },
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ["vanchuyen"] });
  //   },
  // });

  // const [url, setUrl] = useState<string | null>(null);
  // const [loading, setLoading] = useState(false);
  // const [isWebcamVisible, setIsWebcamVisible] = useState<boolean>(() => {
  //   return JSON.parse(localStorage.getItem("isWebcamVisible") || "false");
  // });
  // const [isImageSaved, setIsImageSaved] = useState(false);
  // const [failedAttemptsNotes, setFailedAttemptsNotes] = useState<string[]>([]);
  // // const [note, setNote] = useState(""); // Để lưu ghi chú
  // const [notes, setNotes] = useState(() => {
  //   const savedNotes = localStorage.getItem("deliveryNotes");
  //   return savedNotes ? JSON.parse(savedNotes) : [];
  // });
  // const [currentNote, setCurrentNote] = useState(""); // Để lưu ghi chú hiện tại
  // const [isFailureNoteVisible, setIsFailureNoteVisible] = useState(false);

  // // const [noteCount, setNoteCount] = useState(0);
  // const [isSuccessDeliveryOpen, setIsSuccessDeliveryOpen] = useState(false);
  // const [isFailureDeliveryOpen, setIsFailureDeliveryOpen] = useState(false);
  // const [isDeliveryButtonsVisible, setIsDeliveryButtonsVisible] =
  //   useState(true);
  // // Thay đổi label của nút dựa trên số lần gửi ghi chú
  // const [buttonLabel, setButtonLabel] = useState("Gửi ghi chú");
  // const [noteSubmissionCount, setNoteSubmissionCount] = useState(0);

  // const toggleSuccessDelivery = () => {
  //   setIsSuccessDeliveryOpen(!isSuccessDeliveryOpen);
  //   setIsDeliveryButtonsVisible(false); // Ẩn các nút sau khi nhấn
  //   setIsFailureDeliveryOpen(false);
  // };

  // const toggleFailureDelivery = () => {
  //   setIsFailureDeliveryOpen(!isFailureDeliveryOpen);
  //   // setIsDeliveryButtonsVisible(false);
  //   setIsSuccessDeliveryOpen(false);
  // };
  // const webcamRef = useRef<Webcam>(null);

  // const videoConstraints = {
  //   width: 1280,
  //   height: 720,
  //   facingMode: "user",
  // };

  // useEffect(() => {
  //   localStorage.setItem("isWebcamVisible", JSON.stringify(isWebcamVisible));
  // }, [isWebcamVisible]);

  // useEffect(() => {
  //   if (record.trang_thai_van_chuyen === "Đang giao hàng" && !isImageSaved) {
  //     setIsWebcamVisible(true);
  //   } else {
  //     setIsWebcamVisible(false);
  //   }
  // }, [record.trang_thai_van_chuyen, isImageSaved]);

  // const capturePhoto = () => {
  //   if (record.trang_thai_van_chuyen !== "Đang giao hàng") {
  //     message.error("Chỉ có thể chụp ảnh khi đang ở trạng thái đang giao hàng");
  //     return;
  //   }

  //   if (webcamRef.current) {
  //     const imageSrc = webcamRef.current.getScreenshot();
  //     setUrl(imageSrc);
  //   } else {
  //     message.error("Webcam không khả dụng");
  //   }
  // };

  // const removePhoto = () => {
  //   setUrl(null);
  //   message.success("Xóa ảnh thành công");
  // };
  // const handleSave = async () => {
  //   try {
  //     setLoading(true);
  //     if (!url) {
  //       message.error("Vui lòng chụp ảnh trước khi xác nhận");
  //       setLoading(false);
  //       return;
  //     }

  //     const fetchResponse = await fetch(url);
  //     const blob = await fetchResponse.blob();
  //     const file = new File([blob], "photo.jpg", { type: "image/jpeg" });

  //     const imageUrl = await uploadToCloudinary(file);
  //     if (!imageUrl) {
  //       message.error("Lỗi khi tải ảnh lên");
  //       setLoading(false);
  //       return;
  //     }

  //     await mutate({
  //       id: record.id,
  //       action: "Xác nhận giao hàng",
  //       imageUrl,
  //       failedAttempts: record.failedAttempts + 1,
  //       notes: failedAttemptsNotes,
  //     });

  //     setIsImageSaved(true);
  //     setUrl(null);
  //     setIsWebcamVisible(false);
  //   } catch (error) {
  //     message.error("Lỗi khi xác nhận giao hàng");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const handleSendNote = async () => {
  //   try {
  //     setLoading(true);
  //     if (!currentNote) {
  //       message.error("Vui lòng nhập ghi chú trước khi gửi");
  //       setLoading(false);
  //       return;
  //     }

  //     const newNote = currentNote.trim();
  //     const updatedNotes = [...notes, newNote];
  //     setNotes(updatedNotes);
  //     // localStorage.setItem('deliveryNotes', JSON.stringify(updatedNotes));
  //     setCurrentNote("");

  //     // Gửi ghi chú lên server
  //     const ghiChuCapNhat = updatedNotes.map((note, index) => ({
  //       [`lan${index + 1}`]: note,
  //     }));
  //     const response = await instance.put(
  //       `/vanchuyen/xac-nhan-van-chuyen/${record.id}`,
  //       {
  //         ghi_chu: ghiChuCapNhat,
  //         shipper_xac_nhan: "2",
  //       }
  //     );

  //     if (response.data.status) {
  //       message.success("Ghi chú đã được gửi thành công");
  //       setNoteSubmissionCount(noteSubmissionCount + 1); // Tăng số lần gửi ghi chú

  //       // Kiểm tra nếu đã gửi 2 lần
  //       if (noteSubmissionCount + 1 === 2) {
  //         setButtonLabel("Xác nhận giao hàng thất bại");
  //       }
  //     } else {
  //       message.error(response.data.message || "Có lỗi xảy ra");
  //     }
  //   } catch (error) {
  //     console.error("Lỗi khi gửi ghi chú:", error);
  //     message.error("Lỗi khi gửi ghi chú");
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  // const formatDate = (dateString: any) => {
  //   if (!dateString) return "";
  //   const data = new Date(dateString);
  //   const day = data.getDate().toString().padStart(2, "0");
  //   const month = (data.getMonth() + 1).toString().padStart(2, "0");
  //   const year = data.getFullYear();

  //   const hours = data.getHours().toString().padStart(2, "0");
  //   const minutes = data.getMinutes().toString().padStart(2, "0");

  //   return `${day}/${month}/${year} ${hours}:${minutes}`;
  // };
  return (
    <div>
      {" "}
      <p onClick={() => setOpen(true)}>
        {" "}
        <div>
          <div>
            <h1 className="text-lg">
              Mã Vận chuyển : <span>VC-HJDBHV7587dfg</span>
            </h1>
          </div>
          <div className="flex items-start space-x-4 mb-2">
            <img
              src="https://res.cloudinary.com/dcvu7e7ps/image/upload/v1729223981/ao-khoac-nu-SKN7004-DEN_1_jjbtoe.webp"
              alt="Product Image"
              className="md:w-24 md:h-28 w-20 h-20 object-cover rounded"
            />
            <div>
              {/* <DetailTS /> */}
              <h3 className="md:text-lg  text-sm font-semibold md:w-full w-64 truncate hover:text-red-500 cursor-pointer ">
                SHOP PT - PHỤ KIỆN CÔNG NGHỆ fsd dg dfg fdg fdxg
              </h3>{" "}
              <div className="flex md:justify-start justify-between items-center">
                {" "}
                <span className="md:text-base  text-xs text-gray-500">
                  Size: <span>XL</span>, Màu: <span>đỏ</span>
                </span>
                <span className="md:text-lg  text-xs text-gray-500 mx-2">
                  x1
                </span>
              </div>{" "}
              <div className="flex items-end md:justify-start justify-end ">
                <span className="md:text-xl text-base font-semibold text-red-500 ml-1 ">
                  <span className="md:text-base text-xs text-gray-500 line-through">
                    ₫1.050.000
                  </span>{" "}
                  ₫825.000
                </span>
              </div>
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
          <div className="bg-green-600 text-white rounded-md p-3 mt-4">
            <p className="text-sm font-semibold">Đơn hàng đã hoàn thành</p>
          </div>
          {/* Shipping Info */}
          <div className="bg-white rounded-md shadow-md p-4 mt-4">
            <p className="text-gray-700 font-semibold">Thông tin vận chuyển</p>
            <p className="text-gray-500 text-sm">
              SPX Express: SPXVN042195340009
            </p>
            <div className="flex items-center space-x-2 mt-2">
              <svg
                className="w-5 h-5 text-green-500"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M5 13l4 4L19 7" />
              </svg>
              <p className="text-green-500 font-semibold">
                Giao hàng thành công
              </p>
            </div>
            <p className="text-gray-500 text-sm">12-09-2024 18:20</p>
          </div>
          {/* Address Info */}
          <div className="bg-white rounded-md shadow-md p-4 mt-4">
            <p className="text-gray-700 font-semibold">Địa chỉ nhận hàng</p>
            <p className="text-gray-500 text-sm">
              Nguyễn đình khải (+84) 974 943 593
            </p>
            <p className="text-gray-500 text-sm">
              Đường đê mới Long Châu xã phùng châu...
            </p>
          </div>
          {/* Product Info */}
          <div className="bg-white rounded-md shadow-md p-4 mt-4">
            <div className="flex items-center justify-between">
              <p className="text-red-500 bg-red-100 px-2 py-1 rounded text-xs">
                Yêu thích
              </p>
              <p className="font-semibold text-gray-700">
                SHOP PT - PHỤ KIỆN CÔNG NGHỆ
              </p>
            </div>
            <div className="flex mt-2">
              <img
                src="path_to_image.jpg"
                alt="Product Image"
                className="w-16 h-16 object-cover rounded mr-4"
              />
              <div className="flex-1">
                <p className="text-gray-700 font-semibold">
                  COMBO Giá Treo Màn Hình NB-F160 17...
                </p>
                <p className="text-xs text-gray-500">F160 + FP2</p>
                <span className="px-2 py-1 border border-red-500 text-red-500 rounded text-xs">
                  Trả hàng miễn phí
                </span>
                <p className="text-sm text-gray-400 line-through mt-2">
                  ₫1.050.000
                </p>
                <p className="text-red-500 font-semibold">₫825.000</p>
              </div>
            </div>
            <p className="text-right text-gray-700 mt-2">
              Thành tiền:{" "}
              <span className="font-semibold text-red-500">₫724.300</span>
            </p>
          </div>
          {/* Support Section */}
          <div className="bg-white rounded-md shadow-md p-4 mt-4">
            <p className="text-gray-700 font-semibold">Bạn cần hỗ trợ?</p>
            <ul className="mt-2 space-y-2 text-gray-500">
              <li className="flex items-center space-x-2">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 11H5v2h14v-2z" />
                </svg>
                <span>Gửi yêu cầu Trả hàng/Hoàn tiền</span>
              </li>
              <li className="flex items-center space-x-2">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M9 21V8H4l8-8 8 8h-5v13H9z" />
                </svg>
                <span>Liên hệ Shop</span>
              </li>
              <li className="flex items-center space-x-2">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M3 17h18v2H3v-2zm0-5h18v2H3v-2zm0-5h18v2H3V7z" />
                </svg>
                <span>Trung tâm Hỗ trợ</span>
              </li>
            </ul>
          </div>
          {/* Action Buttons */}
          <div className="flex justify-between mt-4">
            <button className="w-full py-2 text-center bg-gray-100 text-gray-700 font-semibold rounded-md mr-2">
              Xem Đánh giá
            </button>
            <button className="w-full py-2 text-center bg-red-500 text-white font-semibold rounded-md ml-2">
              Mua lại
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DetailTS;
