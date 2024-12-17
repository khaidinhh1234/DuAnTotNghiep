import instance from "@/configs/admin";
import { uploadToCloudinary } from "@/configs/cloudinary";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Image, message, Modal } from "antd";
import { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
interface Transport {
  don_hang: any;
  id: number;
  created_at: string;
  don_hang_id: number;
  shipper_id: number;
  ma_van_chuyen: string;
  trang_thai_van_chuyen: string;
  cod: number;
  tien_cod: number;
  anh_xac_thuc: string;
  khach_hang_xac_nhan: string;
  shipper_xac_nhan: string;
  so_lan_giao: string;
  ghi_chu: string;
}
const DetailTransport = ({ record }: any) => {
  const [visibleProducts, setVisibleProducts] = useState(2);
  const handleLoadMore = () => {
    setVisibleProducts(products.length);
  };

  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  //
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isWebcamVisible, setIsWebcamVisible] = useState<boolean>(() =>
    JSON.parse(localStorage.getItem("isWebcamVisible") || "false")
  );
  const [isImageSaved, setIsImageSaved] = useState(false);
  const [notes, setNotes] = useState<{
    lan1?: string;
    lan2?: string;
    lan3?: string;
  }>({});
  const [isConfirmFailureVisible, setIsConfirmFailureVisible] = useState(false);
  const [note, setNote] = useState("");
  const [showNoteInput, setShowNoteInput] = useState(false);
  const webcamRef = useRef<Webcam>(null);

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user",
  };

  // Lưu trạng thái webcam vào localStorage
  useEffect(() => {
    localStorage.setItem("isWebcamVisible", JSON.stringify(isWebcamVisible));
  }, [isWebcamVisible]);

  // Hiện webcam chỉ khi trạng thái là "Đang giao hàng" và chưa lưu ảnh
  useEffect(() => {
    if (record.trang_thai_van_chuyen === "Đang giao hàng" && !isImageSaved) {
      setIsWebcamVisible(true);
    } else {
      setIsWebcamVisible(false);
    }
  }, [record.trang_thai_van_chuyen, isImageSaved]);
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

  // const id = record?.id;
  // console.log(id)
  const { data } = useQuery({
    queryKey: ["VANCHUYEN", record?.id],
    queryFn: async () => {
      try {
        const response = await instance.get(`/vanchuyen/${record?.id}`);
        return response.data;
      } catch (error) {
        throw new Error(error as any);
      }
    },
  });
  console.log("data:", data)
  const products = data?.data?.van_chuyen?.don_hang?.chi_tiets?.map(
    (item: any) => {
      return {
        ...item,
      };
    }
  ) || [];
  console.log(products);
  const vanchuyenData = data?.data?.van_chuyen?.don_hang;
  const shipper = data?.data?.van_chuyen?.shipper;
  const mavanchuyen = data?.data?.van_chuyen?.ma_van_chuyen;
  // console.log("vanchuyenData", data);
  const thongtin = data?.data?.thong_tin;
  const handleCancel = () => {
    setOpen(false);
  };
  const tong = data?.data;


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
                  Đơn Vận Chuyển:{" "}
                  <span className="text-blue-500">{record?.ma_van_chuyen}</span>
                </h4>
                <p className="text-base">
                  Ngày tạo:{" "}
                  <span className="font-medium">
                    {formatDate(record?.created_at)}
                  </span>
                </p>{" "}
              </div>{" "}
              {/* <div
                className={`font-bold text-[15px] ${
                  record.trang_thai_van_chuyen === "chờ xử lý"
                    ? "text-yellow-400" // Chờ xác nhận: màu vàng nhạt
                    : record.trang_thai_van_chuyen === "Đang giao hàng"
                      ? "text-purple-500" // Đang giao hàng: màu tím
                      : record.trang_thai_van_chuyen ===
                          "Đã giao hàng thành công"
                        ? "text-green-500" // Đã giao hàng thành công: màu xanh lá
                        : record.trang_thai_van_chuyen === "Giao hàng thất bại"
                          ? "text-red-500" // Giao hàng thất bại: màu đ��
                          : `text-red-500`
                }`}
              > */}
              <div

                className={`${record.trang_thai_van_chuyen === "Chờ xử lý"
                    ? "bg-blue-500" // Chờ xác nhận: màu vàng nhạt
                    : record.trang_thai_van_chuyen === "Đang giao hàng"
                      ? "bg-purple-500" // Đang giao hàng: màu tím
                      : record.trang_thai_van_chuyen === "Giao hàng thành công"
                        ? "bg-green-500" // Đã giao hàng thành công: màu xanh lá
                        : record.trang_thai_van_chuyen === "Giao hàng thất bại"
                          ? "bg-red-500" // Giao hàng thất bại: màu đ��
                          : "bg-red-500"
                  } text-white px-2 py-1 font-bold rounded-lg`}

              >
                {record.trang_thai_van_chuyen === "chờ xử lý"
                  ? "Chờ xử lý" // Chờ xác nhận: màu vàng nhạt
                  : record.trang_thai_van_chuyen === "Đang giao hàng"
                    ? "Đang giao hàng" // Đang giao hàng: màu tím
                    : record.trang_thai_van_chuyen === "Giao hàng thành công"
                      ? "Giao hàng thành công"
                      : record.trang_thai_van_chuyen === "Giao hàng thất bại"
                        ? "Giao hàng thất bại"
                        : record.trang_thai_van_chuyen}
              </div>
              {/* </div> */}
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
                    {products && products.length > 0 ? (
                      products.slice(0, visibleProducts).map((item: any, index: number) => (
                        <tr key={index} className="my-5">
                          <td>
                            <div className="flex gap-5 items-center  w-[50%] my-2">
                              <img
                                src={
                                  item?.bien_the_san_pham?.anh_bien_the?.length > 0
                                    ? item?.bien_the_san_pham?.anh_bien_the[0]?.duong_dan_anh
                                    : ""
                                }
                                alt={item?.bien_the_san_pham?.san_pham?.ten_san_pham || "Ảnh sản phẩm"}
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
                                        item?.bien_the_san_pham
                                          ?.mau_bien_the?.ten_mau_sac
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
                            {item?.gia?.toLocaleString()} VNĐ
                          </td>
                          <td className="text-center w-[35%] font-semibold">
                            {item?.thanh_tien?.toLocaleString()} VNĐ
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4}>Không có sản phẩm</td>
                      </tr>
                    )}
                    {visibleProducts < products.length && (
                      <div className="flex  ">
                        <div
                          onClick={handleLoadMore}
                          className="font-bold"
                        >
                          <i className="fa-solid fa-share"></i> Xem thêm ...
                        </div>
                      </div>
                    )}
                  </tbody>
                </table>
                <div className="grid grid-cols-2 gap-5 my-5">
                  <div>
                    <div className="flex justify-between">
                      <p>Lấy hàng</p>{" "}
                      <span className="font-bold"> Glow Clothing</span>
                    </div>
                    <div className="flex justify-between">
                      <p>Mã Vận chuyển</p> <span> {mavanchuyen}</span>
                    </div>
                    <div className="flex justify-between font-bold">
                      <p>Nhà vận chuyển</p> <span> Glow Express</span>
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
                              : record.trang_thai_van_chuyen ==
                                "Giao hàng thất bại"
                                ? "bg-red-500"
                                : "bg-red-500"
                          }
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
                                : record.trang_thai_van_chuyen ==
                                  "Giao hàng thất bại"
                                  ? "Giao hàng thất bại"
                                  : record.trang_thai_van_chuyen}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      {/* <p>Tổng khối lượng</p> <span> 0.00kg</span> */}
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
                    <span>{tong?.tong_so_luong}</span> sản phẩm
                  </p>
                </div>
                <div className="flex justify-between">
                  <h1 className="text-lg font-semibold">Tổng tiền hàng</h1>
                  <p className="text-base font-semibold">
                    <span>
                      {tong?.tong_thanh_tien_san_pham?.toLocaleString("vi-VN")}
                    </span>{" "}
                    VNĐ
                  </p>
                </div>
                <div className="flex justify-between">
                  <h1 className="text-lg font-semibold">Giảm giá</h1>
                  <p className="text-base font-semibold">
                    -{" "}
                    <span>
                      {tong?.van_chuyen?.don_hang?.so_tien_giam_gia
                        ? tong?.van_chuyen?.don_hang?.so_tien_giam_gia?.toLocaleString(
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
                    <span>
                      {tong?.tien_ship !== 0
                        ? tong?.tien_ship?.toLocaleString("vi-VN") + " VNĐ"
                        : "Miễn phí ship"}
                    </span>{" "}
                  </p>
                </div>
                <div className="flex justify-between">
                  <h1 className="text-lg font-semibold">
                    Tổng giá trị đơn hàng <br />
                  </h1>
                  <p className="text-lg font-bold">
                    {" "}
                    {tong?.tong_tien?.toLocaleString("vi-VN") ?? 0} VNĐ
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
                {record.trang_thai_van_chuyen === "Chờ xử lý" ? (
                  <span className="w-full py-1 px-2 text-base font-medium text-blue-500 border-b-2 border-blue-500 hover:text-blue-600 hover:border-blue-600 transition-all duration-300 ease-in-out cursor-default text-center ">
                    Chờ lấy hàng
                  </span>
                ) : record.trang_thai_van_chuyen === "Đang giao hàng" ? (
                  <span className="w-full py-1 px-2 text-base font-medium text-purple-500 border-b-2 border-purple-500 hover:text-purple-600 hover:border-purple-600 transition-all duration-300 ease-in-out cursor-default text-center">
                    Đang giao hàng
                  </span>
                ) : record.trang_thai_van_chuyen === "Giao hàng thành công" ? (
                  <span className="w-full py-1 px-2 text-base font-medium text-green-500 border-b-2 border-green-500 hover:text-green-600 hover:border-green-600 transition-all duration-300 ease-in-out cursor-default text-center">
                    Giao hàng thành công
                  </span>
                ) : record.trang_thai_van_chuyen === "Giao hàng thất bại" ? (
                  <span className="w-full py-1 px-2 text-base font-medium text-red-500 border-b-2 border-red-500 hover:text-red-600 hover:border-red-600 transition-all duration-300 ease-in-out cursor-default text-center">
                    Giao hàng thất bại
                  </span>
                ) : null}
                {/* Kết quả sau khi giao hàng */}
                {record.trang_thai_van_chuyen === "Giao hàng thành công" && (
                  <div className="mt-4 text-center">
                    {/* <div className="text-green-600 font-semibold">
                    ✅ Giao hàng thành công!
                  </div> */}
                    {/* Hiển thị ảnh xác thực */}
                    {record.anh_xac_thuc && (
                      <div className="mt-2">
                        <Image
                          src={record.anh_xac_thuc}
                          alt="Ảnh xác thực"
                          style={{
                            maxHeight: "16rem",
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
                    {/* <div className="mt-4 text-center text-red-600 font-semibold">
                    ❌ Giao hàng thất bại!
                  </div> */}
                    {record.ghi_chu && (
                      <div className="mt-4">
                        <h4 className="text-lg font-bold">
                          Lịch sử giao hàng:
                        </h4>
                        <ul className="mt-2 list-disc list-inside text-left text-gray-700">
                          <li>
                            <span className="font-medium">
                              {record.ghi_chu}
                            </span>
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>{" "}
            <div className=" bg-slate-100 p-5 border rounded-lg my-2">
              <h5 className="text-blue-800 text-lg">Thông tin khách hàng</h5>
              <hr />
              <h5 className="text-blue-600 my-2">
                {record.van_chuyen?.don_hang.ten_nguoi_dat_hang
                  ? record.van_chuyen?.don_hang.ten_nguoi_dat_hang
                  : thongtin?.ten_nguoi_dat_hang}
              </h5>
              <hr />
              <h5 className="text-blue-800 text-lg my-2">Người liên hệ</h5>
              <h5 className="text-black my-2">
                {" "}
                {record.van_chuyen?.don_hang.ten_nguoi_dat_hang
                  ? record.van_chuyen?.don_hang.ten_nguoi_dat_hang
                  : thongtin?.ten_nguoi_dat_hang}
              </h5>
              <p className="text-blue-800 font-semibold">
                Số điện thoại :
                <span className="text-black font-medium">
                  {record.van_chuyen?.don_hang.so_dien_thoai_nguoi_dat_hang
                    ? record.van_chuyen?.don_hang.so_dien_thoai_nguoi_dat_hang
                    : thongtin?.so_dien_thoai_nguoi_dat_hang}
                </span>
              </p>
              <h5 className="text-blue-800">
                Địa chỉ Giao hàng: <br />
                <span className="text-black">
                  {record?.van_chuyen?.don_hang.dia_chi_nguoi_dat_hang
                    ? record?.van_chuyen?.don_hang.dia_chi_nguoi_dat_hang
                    : thongtin?.dia_chi_nguoi_dat_hang}
                </span>
              </h5>
              <p className="text-blue-800 font-semibold">
                Ghi chú của khách hàng : <br />
                <span className="text-black">
                  {record?.van_chuyen?.don_hang.ghi_chu
                    ? record?.van_chuyen?.don_hang.ghi_chu
                    : vanchuyenData?.ghi_chu}
                </span>
              </p>
            </div>{" "}
            {/* shipper */}
            <div className="col-span-3">
              <div className="bg-slate-100 p-5 border rounded-lg my-2">
                <h5 className="text-blue-800 text-lg">
                  Thông tin nhân viên giao hàng
                </h5>
                <hr />
                {shipper && (
                  <>
                    <p className="text-blue-800 text-lg my-2">
                      Nhân viên giao hàng: {shipper.ho} {shipper.ten}
                    </p>
                    <p className="text-blue-800 font-semibold">
                      Số điện thoại: {shipper.so_dien_thoai}
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DetailTransport;
