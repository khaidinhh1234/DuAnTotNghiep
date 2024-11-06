import { sanPham2 } from "@/assets/img";
import { Link } from "react-router-dom";

// Component hiển thị thông tin sản phẩm
const ProductItem = ({
  status,
  price,
  img,
  name,
  size,
  mau,
  quantity,
  gender,
  chi_tiet_don_hangs,
  tong_tien,
  ma_don_hang,
  pricesale,
  trang_thai_thanh_toan,
}: any) => {
  // console.log(chi_tiet_don_hangs);
  // console.log(status);
  return (
    <>
      <div className="py-6 grid grid-cols-7  border-b border-hrBlack">
        <div className="col-span-5 ">
          <div className="flex justify-between ">
            <div className="grid justify-between">
              <div className="flex gap-5 items-center ">
                <div className=" rounded-md text-center">
                  {" "}
                  <img
                    src={img ?? sanPham2}
                    alt={img ?? sanPham2}
                    className="w-36 h-40 lg:w-20 lg:h-24 rounded-md mb-5"
                  />
                  <span
                    className={`text-xs px-2 py-1 rounded-sm ${
                      status == "Chờ xác nhận"
                        ? "inprocrass"
                        : status == "Đã xác nhận"
                          ? "bg-orange-100 text-orange-500 rounded-md"
                          : status == "Đang xử lý"
                            ? "bg-blue-100 text-blue-500 rounded-md"
                            : status == "Đang giao hàng"
                              ? "bg-violet-100 text-violet-500 rounded-md"
                              : status == "Chờ khách hàng xác nhận"
                                ? "bg-yellow-100 text-yellow-500 rounded-md"
                                : status == "Hoàn tất đơn hàng"
                                  ? "delivered"
                                  : status == "Đơn hàng bị từ chối nhân"
                                    ? "bg-red-100 text-red-500 rounded-md"
                                    : "bg-red-100 text-red-500 rounded-md"
                    }`}
                  >
                    {status === "Đang xử lý"
                      ? "Chờ lấy hàng"
                      : status == "Chờ khách hàng xác nhận"
                        ? "Giao thành công"
                        : status == "Đơn hàng bị từ chối nhân"
                          ? "Hoàn hàng"
                          : status}
                  </span>
                </div>
                <div className="px-1">
                  <h3 className="font-bold my-1">{name}</h3>
                  <p className={`font-bold  block md:hidden`}>
                    {" "}
                    <p>
                      {" "}
                      <span className="text-gray-400 line-through text-base">
                        {price.toLocaleString("vi-VN")} đ{" "}
                      </span>
                      {pricesale.toLocaleString("vi-VN")} đ
                    </p>
                  </p>
                  <p className="mb-2">
                    Size:{" "}
                    <span>
                      {size} {gender && ` / ${gender}`}
                    </span>
                    , Màu: <span>{mau}</span>
                  </p>
                  <p className="mb-10">Số lượng: {quantity}</p>{" "}
                  <span className="">
                    Sản phẩm của bạn{" "}
                    {status === "Đang xử lý"
                      ? "đang chờ lấy hàng"
                      : status == "Chờ khách hàng xác nhận"
                        ? "đã giao thành công"
                        : status == "Đơn hàng bị từ chối nhân"
                          ? "đã từ chối nhận"
                          : status}
                  </span>
                </div>
              </div>{" "}
            </div>
            <div
              className={`text-center py-8 font-bold md:block  hidden text-lg`}
            >
              <p>
                {" "}
                <span className="text-gray-400 line-through text-base">
                  {price.toLocaleString("vi-VN")} đ{" "}
                </span>
                {pricesale.toLocaleString("vi-VN")} đ
              </p>
            </div>
          </div>
          {chi_tiet_don_hangs && chi_tiet_don_hangs.length >= 2 && (
            <div className="text-center font-bold ml-20 mt-3">
              <Link to={`/mypro/myorder/${ma_don_hang}`}>
                <i className="fa-solid fa-share"></i> Xem thêm ...
              </Link>
            </div>
          )}
        </div>
        <div className="hidden sm:block col-span-2 text-end">
          <Link to={`/mypro/myorder/${ma_don_hang}`}>
            <button className="hover:bg-blackL hover:text-white shadow font-medium shadow-black/50 text-sm py-3 px-6 mb-2 rounded-lg">
              Xem Đơn Hàng
            </button>
          </Link>
          <br />
          {(status === "Chờ xác nhận" ||
            status === "Đã xác nhận" ||
            status === "Hoàn tất đơn hàng" ||
            status === "Chờ khách hàng xác nhận") && (
            <button
              className={`${
                status === "Hoàn tất đơn hàng" ||
                status === "Chờ khách hàng xác nhận"
                  ? "bg-black hover:bg-black/50"
                  : "bg-[#FF7262] hover:bg-[#e9b2ac]"
              } shadow-md shadow-slate-600/50 text-white w-[146px] text-sm py-3 rounded-lg mb-2`}
            >
              {status === "Hoàn tất đơn hàng"
                ? "Đánh giá"
                : status === "Chờ khách hàng xác nhận"
                  ? "Đã nhận hàng"
                  : "Hủy Đơn Hàng"}
            </button>
          )}{" "}
          {trang_thai_thanh_toan == "Chưa thanh toán" && (
            <button className="shadow-md shadow-slate-600/50  hover:text-white  bg-[#FF7262] hover:bg-[#e9b2ac] font-medium  text-sm py-3 px-6 mb-2 rounded-lg text-white">
              Tiếp tục thanh toán
            </button>
          )}
        </div>
        <div className="col-span-7 border-t mt-2 py-3 lg:flex lg:justify-between">
          {" "}
          <div>
            <span
              className={`${trang_thai_thanh_toan == "Đã thanh toán" ? "text-green-500 " : " text-red-600"} font-semibold text-base lg:text-lg `}
            >
              {" "}
              <span className="text-black font-medium text-xs lg:text-lg">
                {" "}
                Trạng thái thanh toán:
              </span>
              {trang_thai_thanh_toan ?? "Thanh toán thất bại"}
            </span>
          </div>
          <div>
            Thành tiền:{" "}
            <span className="text-red-600 font-semibold text-2xl">
              {" "}
              ₫{(tong_tien ?? 0).toLocaleString("vi-VN")}
            </span>
          </div>
        </div>{" "}
        <div className="block sm:hidden col-span-2 text-end w-[450px]">
          <Link to={`/mypro/myorder/${ma_don_hang}`}>
            <button className="hover:bg-blackL hover:text-white shadow font-medium shadow-black/50 text-sm py-3 px-6 mb-2 rounded-lg w-[100%]">
              Xem Đơn Hàng
            </button>
          </Link>
          <br />
          {(status === "Chờ xác nhận" ||
            status === "Đã xác nhận" ||
            status === "Hoàn tất đơn hàng" ||
            status === "Chờ khách hàng xác nhận") && (
            <button
              className={`${
                status === "Hoàn tất đơn hàng" ||
                status === "Chờ khách hàng xác nhận"
                  ? "bg-black hover:bg-black/50"
                  : "bg-[#FF7262] hover:bg-[#e9b2ac]"
              } shadow-md shadow-slate-600/50 text-white  text-sm py-3 rounded-lg mb-2 w-[50%]`}
            >
              {status === "Hoàn tất đơn hàng"
                ? "Đánh giá"
                : status === "Chờ khách hàng xác nhận"
                  ? "Đã nhận hàng"
                  : "Hủy Đơn Hàng"}
            </button>
          )}{" "}
          {trang_thai_thanh_toan == "Chưa thanh toán" && (
            <button className="shadow-md shadow-slate-600/50 w-[49%]  hover:text-white  bg-[#FF7262] hover:bg-[#e9b2ac] font-medium  text-sm py-3 px-6 mb-2 rounded-lg text-white">
              Tiếp tục thanh toán
            </button>
          )}
        </div>
      </div>
    </>
  );
};

// Component hiển thị danh sách sản phẩm
const ProductList = ({ donhang }: any) => {
  const don_hang = donhang;
  console.log(don_hang);
  return (
    <>
      <div className="flex flex-row lg:justify-between lg:items-center">
        <h2 className="text-lg md:text-2xl font-bold text-black-500 mx-4">
          Đơn hàng của bạn
        </h2>
        <Link
          to="/mypro/lichsu"
          className="hover:text-blue-500 underline cursor-pointer pt-2 text-sm md:text-base"
        >
          Lịch sử giao dịch
        </Link>
      </div>

      <div className="lg:col-span-9 col-span-8 lg:pl-4 h-full">
        <form>
          {don_hang && don_hang.length ? (
            don_hang.map((item, index) => (
              <ProductItem
                key={index}
                status={item.trang_thai_don_hang || "Đang xử lý"}
                pricesale={
                  item.chi_tiets[0]?.bien_the_san_pham
                    ?.gia_khuyen_mai_tam_thoi ||
                  item.chi_tiets[0]?.bien_the_san_pham?.gia_khuyen_mai ||
                  item.chi_tiets[0]?.bien_the_san_pham?.gia_ban ||
                  0
                }
                price={item.chi_tiets[0]?.bien_the_san_pham?.gia_ban || 0}
                img={
                  item.chi_tiets[0]?.bien_the_san_pham?.anh_bien_the[0]
                    ?.duong_dan_anh
                }
                name={
                  item.chi_tiets[0]?.bien_the_san_pham?.san_pham?.ten_san_pham
                }
                size={
                  item.chi_tiets[0]?.bien_the_san_pham?.kich_thuoc_bien_the
                    ?.kich_thuoc || "M"
                }
                gender={
                  item.chi_tiets[0]?.bien_the_san_pham?.kich_thuoc_bien_the
                    ?.loai_kich_thuoc || ""
                }
                mau={
                  item.chi_tiets[0]?.bien_the_san_pham?.mau_bien_the
                    ?.ten_mau_sac || "Đen"
                }
                trang_thai_thanh_toan={
                  item.trang_thai_thanh_toan || "thanh toán thất bại"
                }
                quantity={item.chi_tiets[0]?.so_luong || 1}
                chi_tiet_don_hangs={item.chi_tiets || []}
                tong_tien={item.tong_tien_don_hang || 0}
                ma_don_hang={item.ma_don_hang || ""}
              />
            ))
          ) : (
            <div className="col-span-9 h-[430px] flex items-center justify-center">
              <img
                src="https://res.cloudinary.com/dcvu7e7ps/image/upload/v1730026893/cach-huy-don-hang-tren-shopee-04-removebg-preview_2_db7yq1.png"
                alt="No orders"
                className="w-1/2 h-full mx-auto"
              />
            </div>
          )}
        </form>
      </div>
    </>
  );
};

export default ProductList;
