import instance from "@/configs/admin";
import { uploadToCloudinary } from "@/configs/cloudinary";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, message, Modal } from "antd";
import { useRef, useState } from "react";
import Webcam from "react-webcam";
interface Transport {
  don_hang: any;
  id: number;
  created_at: string;
  don_hang_id: number;
  shipper_id: number
  ma_van_chuyen: string;
  trang_thai_van_chuyen: string;
  cod: number;
  tien_cod: number;
  anh_xac_thuc: string;
  khach_hang_xac_nhan: string
  shipper_xac_nhan: number
}
const DetailTransport = ({ record }: any) => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const [isDeliveryConfirmed, setIsDeliveryConfirmed] = useState(false);
  // 
  const [url, setUrl] = useState<string | null>(null); // URL ảnh đã chụp
  const [loading, setLoading] = useState(false); // Trạng thái đang xử lý
  const [isImageSaved, setIsImageSaved] = useState(false); // Trạng thái đã lưu ảnh
  const [isWebcamVisible, setIsWebcamVisible] = useState(false); // Hiển thị webcam
  const webcamRef = useRef<Webcam>(null);

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: 'user',
  };

  // Hàm chụp ảnh bằng webcam
  const capturePhoto = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setUrl(imageSrc); // Hiển thị ảnh đã chụp
    }
  };

  // Hàm để xác nhận giao hàng
  const handleSave = async () => {
    try {
      setLoading(true);
      let imageUrl = null;

      // Chỉ chụp ảnh nếu url đã có giá trị
      if (url) {
        const response = await fetch(url);
        const blob = await response.blob();
        const file = new File([blob], "photo.jpg", { type: "image/jpeg" });
        imageUrl = await uploadToCloudinary(file); // Tải ảnh lên Cloudinary
      } else {
        alert('Vui lòng chụp ảnh trước khi xác nhận giao hàng.');
        return;
      }

      // Gọi mutate để xác nhận giao hàng
      const response: any = await mutate({
        id: record.id,
        action: "Xác nhận giao hàng",
        imageUrl: imageUrl,
        shipper_xac_nhan: 1 
      });

      console.log('API Response:', response); 

      if (response && response.status) {
        alert('Đã lưu ảnh và xác nhận giao hàng thành công!');
        setIsDeliveryConfirmed(true);
      } else {
        alert('Có lỗi xảy ra trong quá trình xác nhận giao hàng.');
      }

    } catch (error) {
      console.error('Có lỗi xảy ra:', error);
      alert('Lỗi khi lưu ảnh hoặc xác nhận đơn hàng!');
    } finally {
      setLoading(false);
    }
  };



  const formatDate = (dateString: any) => {
    if (!dateString) return "";

    const date = new Date(dateString);

    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();

    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  const id = record?.don_hang?.id
  const { data } = useQuery({
    queryKey: ["SHIPPER"],
    queryFn: async () => {
      const response = await instance.get(`/vanchuyen/${id}`);
      return response.data;
    },
  })
  const products = data?.data?.van_chuyen?.don_hang?.chi_tiets?.map((item: any) => {
    return {
      ...item,
    };
  });
  const thongtin = data?.data?.thong_tin;

  const handleCancel = () => {
    setOpen(false);
  };

  const { mutate } = useMutation({
    mutationFn: async ({ id, action, imageUrl }: any) => {
      try {
        let response;

        if (action === "Xác nhận giao hàng") {
          response = await instance.put(`/vanchuyen/xac-nhan-van-chuyen/${id}`, {
            anh_xac_thuc: imageUrl,
            shipper_xac_nhan: 1, 
          });
        } else {
          // Gọi đến endpoint cập nhật trạng thái đơn hàng
          response = await instance.put("/vanchuyen/trang-thai-van-chuyen", {
            trang_thai_van_chuyen: action,
            id: [id],
          });
        }

        const error = response.data.message;

        message.open({
          type: error === "Cập nhật trạng thái đơn hàng thành công" ? "success" : "info",
          content: error,
        });

        return response.data;

      } catch (error) {
        message.open({
          type: "error",
          content: "Không thể cập nhật trạng thái đơn hàng!",
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["vanchuyen"],
      });
    },
  });
  return (
    <div>
      {" "}
      <Button onClick={() => setOpen(true)}>Xem chi tiết </Button>
      <Modal
        centered
        open={open}
        width={1200}
        className=" "
        okText="Đồng ý"
        footer={null}
        onCancel={handleCancel}
      >
        <h1 className="text-3xl font-bold">Chi tiết vận chuyển </h1>
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-9">
            {" "}
            <div className="py-1 px-5 border bg-slate-100 rounded-md flex justify-between items-center">
              <div className="">
                <h4 className="text-lg font-bold">
                  Đơn Hàng:
                  <span className="text-blue-500">{record?.ma_don_hang}</span>
                </h4>
                <p className="text-base">
                  Ngày tạo:{" "}
                  <span className="font-medium">
                    {formatDate(record?.created_at)}
                  </span>
                </p>{" "}
              </div>{" "}
              <div
                className={`font-bold text-[15px] ${record.trang_thai_van_chuyen === "Chờ xử lý"
                  ? "text-yellow-400" // Chờ xác nhận: màu vàng nhạt
                  : record.trang_thai_van_chuyen === "Đang giao hàng"
                    ? "text-purple-500" // Đang giao hàng: màu tím
                    : record.trang_thai_van_chuyen ===
                      "Đã giao hàng thành công"
                      ? "text-green-500" // Đã giao hàng thành công: màu xanh lá
                      : ` `
                  }`}
              >
                <div
                  className={`${record.trang_thai_van_chuyen === "Chờ xử lý"
                    ? "bg-blue-400" // Chờ xác nhận: màu vàng nhạt
                    : record.trang_thai_van_chuyen === "Đang giao hàng"
                      ? "bg-purple-500" // Đang giao hàng: màu tím
                      : record.trang_thai_van_chuyen ===
                        "Giao hàng thành công"
                        ? "bg-green-500" // Đã giao hàng thành công: màu xanh lá
                        : "bg-red-500" // Các trạng thái khác: màu đỏ
                    } text-white px-2 py-1 font-bold rounded-lg`}
                >
                  {record.trang_thai_van_chuyen === "Chờ xử lý"
                    ? "Chờ xử lý" // Chờ xác nhận: màu vàng nhạt
                    : record.trang_thai_van_chuyen === "Đang giao hàng"
                      ? "Đang giao hàng" // Đang giao hàng: màu tím
                      : record.trang_thai_van_chuyen ===
                        "Giao hàng thành công"
                        ? "Giao hàng thành công"
                        : ``}
                </div>
              </div>
            </div>
            <div className="bg-slate-100 border px-5  my-5">
              <h1 className="text-lg font-bold mt-5 ">Tất Cả Sản Phẩm</h1>{" "}
              <hr />
              <div className="my-5">
                <table>
                  <thead>
                    <tr className="*:px-12 *:text-base">
                      <th className=" w-[30%]"></th>

                      <th className="w-[15%]">Số Lượng</th>
                      <th className="w-[20%]">Giá</th>
                      <th className="w-[35%]">Thành Tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products?.map((item: any, index: number) => (
                      <tr key={index} className="my-5">
                        <td>
                          <div className="flex gap-5 items-center  w-[50%] my-2">
                            <img
                              src={
                                item?.bien_the_san_pham?.san_pham?.anh_san_pham
                              }
                              alt={""}
                              className="w-20 h-20"
                            />
                            <div>
                              <h1 className=" font-bold truncate w-40">
                                {
                                  item?.bien_the_san_pham?.san_pham
                                    ?.ten_san_pham
                                }
                              </h1>
                              <div className="flex gap-2">
                                <p className="text-base">
                                  Màu :{" "}
                                  <span>
                                    {" "}
                                    {
                                      item?.bien_the_san_pham?.mau_bien_the
                                        ?.ten_mau_sac
                                    }
                                  </span>
                                </p>
                                <p className="text-base">
                                  Size :{" "}
                                  <span>
                                    {" "}
                                    {
                                      item?.bien_the_san_pham
                                        ?.kich_thuoc_bien_the?.kich_thuoc
                                    }
                                  </span>
                                </p>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="text-center w-30 font-semibold  w-[20%]">
                          {" "}
                          {item?.so_luong}
                        </td>
                        <td className="text-center w-[20%] font-semibold  ">
                          {(item?.gia).toLocaleString()} VNĐ
                        </td>
                        <td className="text-center w-[35%] font-semibold">
                          {(item?.thanh_tien).toLocaleString()} VNĐ
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="grid grid-cols-2 gap-5 my-5">
                  <div>
                    <div className="flex justify-between">
                      <p>Lấy hàng</p> <span> Hà Nội</span>
                    </div>
                    <div className="flex justify-between">
                      <p>Mã Vận chuyển</p> <span> 100023874</span>
                    </div>
                    <div className="flex justify-between">
                      <p>Nhà vận chuyển</p> <span> Hà Nội</span>
                    </div>
                  </div>{" "}
                  <div>
                    <div className="flex justify-between">
                      <p>Trạng thái vận chuyển</p>{" "}
                      <span
                        className={`   ${record.trang_thai_van_chuyen == "Chờ xử lý"
                          ? "bg-blue-500"
                          : record.trang_thai_van_chuyen == "Đang giao hàng"
                            ? "bg-purple-500"
                            : record.trang_thai_van_chuyen ==
                              "Giao hàng thành công"
                              ? "bg-green-500"

                              : record}
                        } text-white px-2 font-bold rounded-lg h-6`}
                      >
                        {" "}
                        {record.trang_thai_van_chuyen == "Chờ xử lý"
                          ? "Chờ xử lý"
                          : record.trang_thai_van_chuyen == "Giao hang"
                            ? "Đang giao hàng"
                            : record.trang_thai_van_chuyen == "Đang giao hàng"
                              ? "Đang giao hàng"
                              : record.trang_thai_van_chuyen ==
                                "Giao hàng thành công"
                                ? "Giao hàng thành công"
                                : ""}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <p>Tổng khối lượng</p> <span> 0.00kg</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-5">
              <h1 className="text-xl font-bold mt-5">Đã nhận hàng</h1>
              <div className="grid grid-cols-1 gap-5 w-full">
                <div className="flex justify-between">
                  <h1 className="text-lg font-semibold">
                    Số lượng sản phẩm :{" "}
                  </h1>
                  <p className="text-base font-semibold">
                    <span>{data?.data?.tong_so_luong}</span> sản phẩm
                  </p>
                </div>
                <div className="flex justify-between">
                  <h1 className="text-lg font-semibold">Tổng tiền hàng</h1>
                  <p className="text-base font-semibold">
                    <span>
                      {data?.data?.tong_thanh_tien_san_pham.toLocaleString(
                        "vi-VN"
                      )
                      }
                    </span>{" "}
                    VNĐ
                  </p>
                </div>
                <div className="flex justify-between">
                  <h1 className="text-lg font-semibold">Giảm giá</h1>
                  <p className="text-base font-semibold">
                    -{" "}
                    <span>
                      {data?.data?.van_chuyen?.don_hang?.so_tien_giam_gia
                        ? data?.data?.van_chuyen?.don_hang?.so_tien_giam_gia.toLocaleString(
                          "vi-VN"
                        )
                        : 0}{" "}
                      VNĐ
                    </span>
                  </p>
                </div>
                <div className="flex justify-between">
                  <h1 className="text-lg font-semibold">Vận chuyển</h1>
                  <p className="text-base font-semibold">
                    <span>20.000</span> VNĐ
                  </p>
                </div>
                <div className="flex justify-between">
                  <h1 className="text-lg font-semibold">
                    Tổng giá trị đơn hàng <br />
                  </h1>
                  <p className="text-lg font-bold">
                    {" "}
                    {(record?.tien_cod + 20000).toLocaleString(
                      "vi-VN"
                    )}{" "}
                    VNĐ
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-3  ">
            <div className=" bg-slate-100 p-5 border rounded-lg">
              <h5 className="text-blue-800 text-lg">Xác nhận đơn hàng </h5>
              <hr />
              <p> Vui lòng xác nhận đơn hàng đã nhận hàng</p>
              <div className="flex flex-col gap-2">
                {isWebcamVisible && (
                  <div className="relative mx-auto mt-6">
                    {url ? null : (
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
                          >
                            <i className="fa-regular fa-camera"></i>
                          </button>
                        </div>
                      </div>
                    )}

                    {url && (
                      <div>
                        <img src={url} alt="Ảnh chụp" className="w-60 rounded-lg" />
                      </div>
                    )}

                    {url && !isDeliveryConfirmed && ( 
                      <div className="relative flex justify-center mt-3">
                        <button
                          onClick={() => setUrl(null)} 
                          className="absolute -top-10 px-4 opacity-70 py-3 rounded-full text-3xl bg-white/80 backdrop-blur-sm"
                        >
                          <i className="fa-regular fa-trash"></i>
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {record.trang_thai_van_chuyen === "Chờ xử lý" ? (
                  <button
                    className="w-full py-2 border bg-blue-600 rounded-lg text-white hover:bg-blue-700"
                    onClick={() => {
                      setIsWebcamVisible(true);
                      mutate({ id: record.id, action: "Đang giao hàng" });
                    }}
                  >
                    Giao hàng
                  </button>
                ) : record.trang_thai_van_chuyen === "Đang giao hàng" ? (
                  <>
                    <button
                      className="w-full py-2 border bg-purple-500 rounded-lg text-white hover:bg-purple-400 mt-7"
                      onClick={handleSave}
                      disabled={loading || isImageSaved} 
                    >
                      {loading ? 'Đang xử lý...' : 'Xác nhận giao hàng'}
                    </button>

                    <button
                      className="w-full py-2 border bg-red-500 rounded-lg text-white hover:bg-red-700 font-semibold"
                      onClick={() => mutate({ id: record.id, action: "Hủy hàng" })}
                    >
                      Giao hàng thất bại
                    </button>
                  </>
                ) : null}
              </div>
            </div>{" "}
            <div className=" bg-slate-100 p-5 border rounded-lg my-2">
              <h5 className="text-blue-800 text-lg">Thông tin khách hàng</h5>
              <hr />
              <h5 className="text-blue-600 my-2">
                {record.van_chuyen?.don_hang.ten_nguoi_dat_hang
                  ? record.van_chuyen?.don_hang.ten_nguoi_dat_hang
                  : thongtin?.ho + " " + thongtin?.ten}
              </h5>
              <hr />
              <h5 className="text-blue-800 text-lg my-2">Người liên hệ</h5>
              <h5 className="text-black my-2">
                {" "}
                {record.van_chuyen?.don_hang.ten_nguoi_dat_hang
                  ? record.van_chuyen?.don_hang.ten_nguoi_dat_hang
                  : thongtin?.ho + " " + thongtin?.ten}
              </h5>
              <p className="text-blue-800 font-semibold">
                Số điện thoại :
                <span className="text-black font-medium">
                  {record.van_chuyen?.don_hang.so_dien_thoai_nguoi_dat_hang
                    ? record.van_chuyen?.don_hang.so_dien_thoai_nguoi_dat_hang
                    : thongtin?.so_dien_thoai}
                </span>
              </p>
              <h5 className="text-blue-800">
                Địa chỉ Giao hàng: <br />
                <span className="text-black">
                  {record?.van_chuyen?.don_hang.dia_chi_nguoi_dat_hang
                    ? record?.van_chuyen?.don_hang.dia_chi_nguoi_dat_hang
                    : thongtin?.dia_chi}
                </span>
              </h5>
              <p className="text-blue-800 font-semibold">
                Ghi chú của khách hàng : <br />
                <span className="text-black">
                  {record?.van_chuyen?.don_hang.ghi_chu ? record?.van_chuyen?.don_hang.ghi_chu : "Không có ghi chú"}
                </span>
              </p>
            </div> {" "}
            {/* shipper */}
            <div className="col-span-3">
              <div className="bg-slate-100 p-5 border rounded-lg my-2">
                <h5 className="text-blue-800 text-lg">Thông tin nhân viên giao hàng</h5>
                <hr />
                <p className="text-blue-800 text-lg my-2">Nhân viên giao hàng:</p>
                {/* <span className="text-black my-2">{shipperName}</span> */}
                <p className="text-blue-800 font-semibold">
                  Số điện thoại:
                  {/* <span className="text-black font-medium">{shipperPhone}</span> */}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DetailTransport;
