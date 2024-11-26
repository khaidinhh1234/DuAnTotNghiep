import instanceClient from "@/configs/client";
import { SmileOutlined, TruckOutlined, UserOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Rate, Steps } from "antd";
import { Link, useParams } from "react-router-dom";
import Danhgia from "../myOrder/_components/Danhgia";
import { useState } from "react";
import { useLocalStorage } from "@/components/hook/useStoratge";

const MyOrderdetail = () => {
  const [user] = useLocalStorage("user" as any, {});
  const member = user?.user;

  const { slug } = useParams();
  // console.log("Slug:", slug);
  const [danhgia, setDanhgia] = useState<boolean>(false);
  const [view, setView] = useState<boolean>(false);
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

  if (isError) {
    console.log("Error:", error.message);
  }

  const handleDanhgia = () => {
    setDanhgia(true);
  };
  // console.log("Data:", data);
  const chitiet = data?.data;
  console.log("Chi tiết đơn hàng:", chitiet?.danh_gia?.length);
  // console.log(chitiet);
  // const chitietsanpham = data?.data?.don_hang;
  const thongtin = data?.data?.thong_tin;
  // console.log(thongtin);
  const donhang = data?.data?.don_hang;
  // console.log(donhang);
  const phoneNumber =
    donhang?.so_dien_thoai_nguoi_dat_hang ?? thongtin?.so_dien_thoai;
  const formattedPhoneNumber = phoneNumber?.replace(/^0/, "(+84)");
  // console.log(formattedPhoneNumber);
  const current =
    donhang?.trang_thai_don_hang === "Hoàn tất đơn hàng"
      ? 4
      : donhang?.trang_thai_don_hang === "Chờ khách hàng xác nhận"
        ? 3
        : donhang?.trang_thai_don_hang === "Đang giao hàng"
          ? 2
          : donhang?.trang_thai_don_hang === "Đang xử lý" ||
              donhang?.trang_thai_don_hang === "Đã xác nhận"
            ? 1
            : donhang?.trang_thai_don_hang === "Chờ xử lý"
              ? 0
              : 0;
  const items = [
    {
      title: "Đơn hàng đã đặt",

      icon:
        current >= 0 ? (
          <i className="fa-solid fa-memo-circle-check"></i>
        ) : (
          <i className="fa-solid fa-memo-circle-check opacity-50"></i>
        ),
    },
    {
      title: "Đã xác nhận ",

      icon:
        current >= 1 ? (
          <i className="fa-solid fa-money-check-dollar "></i>
        ) : (
          <i className="fa-solid fa-money-check-dollar opacity-50"></i>
        ),
    },
    {
      title: "Đã giao cho ĐVVC",

      icon:
        current >= 2 ? (
          <TruckOutlined />
        ) : (
          <TruckOutlined className="opacity-50" />
        ),
    },
    {
      title: "Đã nhận được hàng",

      icon:
        current >= 3 ? (
          <i className="fa-solid fa-box-check"></i>
        ) : (
          <i className="fa-solid fa-box-check opacity-50"></i>
        ),
    },
    {
      title: "Đánh Giá Đơn hàng",

      icon:
        current >= 4 ? (
          <SmileOutlined className="text-blue-500" />
        ) : (
          <SmileOutlined className="opacity-50" />
        ),
    },
  ];

  return (
    <div className=" ">
      {danhgia && (
        <>
          <Danhgia setDanhgia={setDanhgia} slug={slug} />
        </>
      )}
      {view && (
        <div className="fixed inset-0 pt-96 overflow-y-auto flex items-center justify-center bg-gray-500 bg-opacity-75 z-50 ">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full space-y-4 overflow-y-auto h-auto">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Đánh giá của bạn
            </h2>
            <div className="">
              {donhang?.chi_tiets &&
                donhang?.chi_tiets?.map((item: any, index: number) => (
                  <div className="flex justify-between mb-1" key={index}>
                    <div className="flex gap-5 items-center ">
                      <div className=" rounded-md text-center">
                        {" "}
                        <img
                          src={
                            item?.bien_the_san_pham?.anh_bien_the[0]
                              ?.duong_dan_anh
                          }
                          alt="Sản phẩm"
                          className="w-20 h-24 rounded-md mb-5"
                        />
                      </div>
                      <div className="px-1">
                        <h3 className="font-bold my-1">
                          {item?.bien_the_san_pham?.san_pham?.ten_san_pham}
                        </h3>
                        <p className={`font-bold  block md:hidden`}>
                          Giá: ${item?.thanh_tien.toLocaleString("vi-VN")}
                        </p>
                        <p className="mb-2">
                          Size:
                          <span>
                            {
                              item?.bien_the_san_pham?.kich_thuoc_bien_the
                                ?.kich_thuoc
                            }{" "}
                            {item?.bien_the_san_pham?.kich_thuoc_bien_the
                              ?.loai_kich_thuoc &&
                              ` / ${
                                item?.bien_the_san_pham?.kich_thuoc_bien_the
                                  ?.loai_kich_thuoc
                              }`}
                          </span>
                          , Màu:{" "}
                          <span>
                            {item?.bien_the_san_pham?.mau_bien_the?.ten_mau_sac}
                          </span>
                        </p>
                        <p className="mb-10">Số lượng: {item?.so_luong}</p>{" "}
                      </div>
                    </div>{" "}
                    <div
                      className={`text-center py-8 font-bold md:block  hidden mr-5`}
                    >
                      <p>
                        {" "}
                        <span className="text-gray-400 line-through mx-2">
                          {item?.bien_the_san_pham?.gia_khuyen_mai &&
                            (item?.bien_the_san_pham?.gia_ban).toLocaleString(
                              "vi-VN"
                            ) + "đ"}
                        </span>
                        {(item?.bien_the_san_pham?.gia_khuyen_mai_tam_thoi !==
                        null
                          ? item?.bien_the_san_pham?.gia_khuyen_mai_tam_thoi
                          : item?.bien_the_san_pham?.gia_khuyen_mai !== null
                            ? item?.bien_the_san_pham?.gia_khuyen_mai
                            : item?.bien_the_san_pham?.gia_ban
                        ).toLocaleString("vi-VN")}{" "}
                        đ
                      </p>
                    </div>
                  </div>
                ))}

              <div className="mx-5">
                {chitiet?.danh_gia
                  ?.slice(0, 1)
                  .map((item: any, index: number) => (
                    <div className="border-b border-gray-300 py-5" key={index}>
                      <div className="flex  items-start gap-5">
                        <div>
                          <img
                            src={`${member?.anh_nguoi_dung}??https://res.cloudinary.com/dpundwxg1/image/upload/v1729485508/Avatar-trang-den_apceuv.png`}
                            alt=""
                            className="w-11 h-11 rounded-full"
                          />
                        </div>
                        <div>
                          <h1 className=" text-base font-semibold">
                            {member?.ho + " " + member?.ten}
                          </h1>

                          <Rate disabled defaultValue={item?.so_sao_san_pham} />

                          <h1 className="text-black/60 font-medium">
                            Chất lượng sản phẩm:{" "}
                            <span className="text-black">
                              {item?.chat_luong_san_pham}
                            </span>
                          </h1>
                          <h1 className="text-black font-semibold">
                            {item?.mo_ta}
                          </h1>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
              <div className="flex justify-end mt-5 ">
                <button
                  className="text-black font-semibold px-16 py-2 border"
                  onClick={() => setView(false)}
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="flex justify-between items-center border px-5 pt-4 pb-1">
        <Link to={"/mypro/myorder"}>
          <h1>
            <i className="fa-solid fa-chevron-down fa-rotate-90"></i>TRỞ LẠI
          </h1>
        </Link>
        <div className="flex gap-5 ">
          <h1>MÃ ĐƠN HÀNG.{slug}</h1>{" "}
          <h1
            className={`border-l-2 pl-5  font-semibold ${
              donhang?.trang_thai_don_hang == "Chờ xác nhận"
                ? "text-orange-300"
                : donhang?.trang_thai_don_hang == "Đã xác nhận"
                  ? " text-orange-500 "
                  : donhang?.trang_thai_don_hang == "Đang xử lý"
                    ? " text-blue-500 "
                    : donhang?.trang_thai_don_hang == "Đang giao hàng"
                      ? " text-violet-500 "
                      : donhang?.trang_thai_don_hang ==
                          "Chờ khách hàng xác nhận"
                        ? " text-yellow-500 "
                        : donhang?.trang_thai_don_hang == "Hoàn tất đơn hàng"
                          ? " text-green-500 "
                          : donhang?.trang_thai_don_hang ==
                              "Đơn hàng bị từ chối nhân"
                            ? " text-red-500 "
                            : " text-red-500 "
            }`}
          >
            {donhang?.trang_thai_don_hang == "Chờ khách hàng xác nhận"
              ? "Giao thành công"
              : donhang?.trang_thai_don_hang == "Đang xử lý"
                ? "Chờ lấy hàng"
                : donhang?.trang_thai_don_hang}
          </h1>
          {chitiet?.danh_gia?.length <= 0 ? (
            (donhang?.trang_thai_don_hang == "Chờ khách hàng xác nhận" ||
              donhang?.trang_thai_don_hang == "Hoàn tất đơn hàng") && (
              <button
                className="border-l-2 px-2 text-red-500 font-semibold cursor-pointer "
                onClick={() => handleDanhgia()}
              >
                Đánh giá
              </button>
            )
          ) : (
            <button
              className="border-l-2 px-2 text-red-500 font-semibold cursor-pointer "
              onClick={() => setView(true)}
            >
              Xem Đánh giá
            </button>
          )}
        </div>
      </div>
      <div className="border-x  px-5 py-4">
        {donhang?.trang_thai_don_hang !== "Đơn hàng bị từ chối nhân" && (
          <>
            {donhang?.trang_thai_don_hang !== "Hủy hàng" &&
              donhang?.trang_thai_don_hang !== "Hoàn hàng" && (
                <Steps
                  current={current}
                  labelPlacement="vertical"
                  items={items}
                />
              )}
            {(donhang?.trang_thai_don_hang === "Hủy hàng" ||
              donhang?.trang_thai_don_hang === "Hoàn hàng") && (
              <Steps
                progressDot
                current={2}
                items={[
                  { title: "Gửi yêu cầu" },
                  { title: "Được chấp nhận" },
                  {
                    title:
                      donhang?.trang_thai_don_hang === "Hủy hàng"
                        ? "Hoàn tất thủ tục"
                        : "Đã hoàn tiền",
                  },
                ]}
              />
            )}
          </>
        )}
        {donhang?.trang_thai_don_hang === "Đơn hàng bị từ chối nhân" ? (
          <div className="text-xl uppercase text-red-500">
            Khách hàng từ chối nhận
          </div>
        ) : (
          ""
        )}
      </div>
      <div className="border p-5">
        <div className="py-6 grid grid-cols-7  border-b border-hrBlack">
          <div className="col-span-7 ">
            {donhang?.chi_tiets &&
              donhang?.chi_tiets?.map((item: any, index: number) => (
                <div className="flex justify-between mb-1" key={index}>
                  <div className="flex gap-5 items-center ">
                    <div className=" rounded-md text-center">
                      {" "}
                      <img
                        src={
                          item?.bien_the_san_pham?.anh_bien_the[0]
                            ?.duong_dan_anh
                        }
                        alt="Sản phẩm"
                        className="w-20 h-24 rounded-md mb-5"
                      />
                    </div>
                    <div className="px-1">
                      <h3 className="font-bold my-1">
                        {item?.bien_the_san_pham?.san_pham?.ten_san_pham}
                      </h3>
                      <p className={`font-bold  block md:hidden`}>
                        Giá: ${item?.thanh_tien.toLocaleString("vi-VN")}
                      </p>
                      <p className="mb-2">
                        Size:
                        <span>
                          {
                            item?.bien_the_san_pham?.kich_thuoc_bien_the
                              ?.kich_thuoc
                          }{" "}
                          {item?.bien_the_san_pham?.kich_thuoc_bien_the
                            ?.loai_kich_thuoc &&
                            ` / ${
                              item?.bien_the_san_pham?.kich_thuoc_bien_the
                                ?.loai_kich_thuoc
                            }`}
                        </span>
                        , Màu:{" "}
                        <span>
                          {item?.bien_the_san_pham?.mau_bien_the?.ten_mau_sac}
                        </span>
                      </p>
                      <p className="mb-10">Số lượng: {item?.so_luong}</p>{" "}
                    </div>
                  </div>{" "}
                  <div
                    className={`text-center py-8 font-bold md:block  hidden mr-5`}
                  >
                    <p>
                      {" "}
                      <span className="text-gray-400 line-through mx-2">
                        {item?.bien_the_san_pham?.gia_khuyen_mai &&
                          (item?.bien_the_san_pham?.gia_ban).toLocaleString(
                            "vi-VN"
                          ) + "đ"}
                      </span>
                      {(item?.bien_the_san_pham?.gia_khuyen_mai_tam_thoi !==
                      null
                        ? item?.bien_the_san_pham?.gia_khuyen_mai_tam_thoi
                        : item?.bien_the_san_pham?.gia_khuyen_mai !== null
                          ? item?.bien_the_san_pham?.gia_khuyen_mai
                          : item?.bien_the_san_pham?.gia_ban
                      ).toLocaleString("vi-VN")}{" "}
                      đ
                    </p>
                  </div>
                </div>
              ))}
            {/* {chi_tiet_don_hangs && chi_tiet_don_hangs.length >= 2 && ( */}
            <div className="text-start font-bold  mb-0  ">
              <span
                className={`text-xs px-2 py-1 rounded-sm ${
                  donhang?.trang_thai_don_hang == "Chờ xác nhận"
                    ? "inprocrass"
                    : donhang?.trang_thai_don_hang == "Đã xác nhận"
                      ? "bg-orange-100 text-orange-500 rounded-md"
                      : donhang?.trang_thai_don_hang == "Đang xử lý"
                        ? "bg-blue-100 text-blue-500 rounded-md"
                        : donhang?.trang_thai_don_hang == "Đang giao hàng"
                          ? "bg-violet-100 text-violet-500 rounded-md"
                          : donhang?.trang_thai_don_hang ==
                              "Chờ khách hàng xác nhận"
                            ? "bg-yellow-100 text-yellow-500 rounded-md"
                            : donhang?.trang_thai_don_hang ==
                                "Hoàn tất đơn hàng"
                              ? "delivered"
                              : donhang?.trang_thai_don_hang ==
                                  "Đơn hàng bị từ chối nhân"
                                ? "bg-red-100 text-red-500 rounded-md"
                                : "bg-red-100 text-red-500 rounded-md"
                }`}
              >
                {donhang?.trang_thai_don_hang === "Đang xử lý"
                  ? "Chờ lấy hàng"
                  : donhang?.trang_thai_don_hang == "Chờ khách hàng xác nhận"
                    ? "Giao thành công"
                    : donhang?.trang_thai_don_hang == "Đơn hàng bị từ chối nhân"
                      ? "Hoàn hàng"
                      : donhang?.trang_thai_don_hang}
              </span>
              <span className="px-10 font-medium">
                Sản phẩm của bạn đã{" "}
                {donhang?.trang_thai_don_hang === "Đang xử lý"
                  ? "Chờ lấy hàng"
                  : donhang?.trang_thai_don_hang == "Chờ khách hàng xác nhận"
                    ? "Giao thành công"
                    : donhang?.trang_thai_don_hang == "Đơn hàng bị từ chối nhân"
                      ? "từ chối nhân"
                      : donhang?.trang_thai_don_hang}
              </span>
            </div>
            {/* )} */}
          </div>

          {/* <div className="col-span-7 text-end border-t mt-2 py-3">
            {" "}
            Thành tiền:{" "}
            <span className="text-red-600 font-semibold text-2xl">
              {" "}
              ₫{(11111).toLocaleString("vi-VN")}
            </span>
          </div> */}
        </div>{" "}
        <div className="grid grid-cols-2 mt-5">
          <div>
            <h1 className="text-xl font-semibold">
              Địa chỉ nhận hàng{" "}
              {(donhang?.trang_thai_don_hang === "Hoàn tất đơn hàng" ||
                donhang?.trang_thai_don_hang === "Chờ khách hàng xác nhận") &&
                chitiet?.anh_xac_thuc && (
                  <Link
                    to={
                      chitiet?.anh_xac_thuc
                        ? chitiet?.anh_xac_thuc
                        : "https://res.cloudinary.com/dpypwbeis/image/upload/v1731121361/ewrlhy9lsbiq1gxhgcsl.jpg"
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 text-sm underline cursor-pointer"
                  >
                    Xem ảnh giao hàng
                  </Link>
                )}
            </h1>

            <p>
              <UserOutlined />{" "}
              {donhang?.ten_nguoi_dat_hang ??
                (thongtin?.ho && thongtin?.ten
                  ? `${thongtin.ho} ${thongtin.ten}`
                  : "Không có thông tin")}
            </p>
            <p>
              <i className="fa-solid fa-phone mr-1"></i>
              {formattedPhoneNumber ?? "Không có sdt thông tin"}
            </p>
            <p>
              <i className="fa-solid fa-map-marker-alt"></i>{" "}
              {donhang?.dia_chi_nguoi_dat_hang ??
                thongtin?.dia_chi ??
                "Không có địa chỉ"}
            </p>
          </div>
          <div className="border-l px-5 flex justify-between">
            {/* <h1>THÔNG TIN ĐƠN HÀNG</h1> */}
            <div className="text-end">
              {" "}
              <p>Tổng tiền hàng</p>
              <p>Tiết kiệm</p>
              <p>Phí vận chuyển</p>
              <p>Voucher từ GLOW</p>
              <p>Thành tiền</p>
            </div>
            <div className="text-right">
              {" "}
              <p>
                ₫
                {(chitiet?.tong_thanh_tien_san_pham ?? 0).toLocaleString(
                  "vn-VN"
                )}
              </p>
              <p>₫{(chitiet?.tiet_kiem ?? 0).toLocaleString("vn-VN")}</p>
              <p>
                {(chitiet?.tien_ship != 0
                  ? (chitiet?.tien_ship ?? "Miễn Phí Ship")
                  : "Miễn Phí Ship"
                ).toLocaleString("vn-VN")}{" "}
              </p>
              <p>
                {" "}
                ₫{(chitiet?.so_tien_giam_gia ?? 0).toLocaleString("vn-VN")}
              </p>
              <p className="text-red-600 font-semibold text-2xl">
                {(chitiet?.tong_thanh_tien_san_pham ?? 0).toLocaleString(
                  "vi-VN"
                )}{" "}
                đ
              </p>
            </div>
          </div>
        </div>{" "}
        {donhang?.trang_thai_don_hang !== "Hủy hàng" &&
        donhang?.trang_thai_don_hang !== "Hoàn hàng" &&
        donhang?.trang_thai_don_hang !== "Đơn hàng bị từ chối nhân" ? (
          <div className="flex items-center justify-between">
            <div className="text-start border-t pt-4">
              Trạng thái thanh toán :{" "}
              <span
                className={`ml-5 font-bold ${
                  donhang?.trang_thai_thanh_toan === "Chưa thanh toán"
                    ? "text-red-500"
                    : donhang?.trang_thai_thanh_toan === "Đã thanh toán"
                      ? "text-green-500"
                      : "text-black"
                }`}
              >
                {donhang?.trang_thai_thanh_toan}
              </span>
            </div>{" "}
            <div className="text-end border-t pt-4">
              Phương thức Thanh toán :
              <span className="ml-10">
                {donhang?.phuong_thuc_thanh_toan === "Momo_ATM"
                  ? "Thanh toán MoMo ATM"
                  : donhang?.phuong_thuc_thanh_toan === "Momo_QR"
                    ? "Thanh toán MoMo QR"
                    : donhang?.phuong_thuc_thanh_toan}
              </span>
            </div>{" "}
          </div>
        ) : (
          <div className="flex items-center justify-between">
            {" "}
            <div className="text-start border-t pt-4 w-96 ">
              Lý do
              <span className="ml-10 pb-2 ">
                {(donhang?.li_do_huy_hang || donhang?.li_do_hoan_hang) ??
                  "Lí do khác"}
              </span>
            </div>{" "}
            <div className="text-end border-t pt-4">
              Trạng thái thanh toán :{" "}
              <span className="ml-5">{donhang?.trang_thai_thanh_toan}</span>
            </div>{" "}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrderdetail;
