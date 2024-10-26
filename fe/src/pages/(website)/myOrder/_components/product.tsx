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
}: any) => {
  console.log(chi_tiet_don_hangs);
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
                    src={img}
                    alt="Sản phẩm"
                    className="w-20 h-24 rounded-md mb-5"
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
                  <p className={`font-bold  block md:hidden`}>Giá: ${price}</p>
                  <p className="mb-2">
                    Size:{" "}
                    <span>
                      {size} {gender && ` / ${gender}`}
                    </span>
                    , Màu: <span>{mau}</span>
                  </p>
                  <p className="mb-10">Số lượng: {quantity}</p>{" "}
                  <span className="">
                    Sản phẩm của bạn đã{" "}
                    {status === "Đang xử lý"
                      ? "Chờ lấy hàng"
                      : status == "Chờ khách hàng xác nhận"
                        ? "Giao thành công"
                        : status == "Đơn hàng bị từ chối nhân"
                          ? "từ chối nhân"
                          : status}
                  </span>
                </div>
              </div>{" "}
            </div>
            <div className={`text-center py-8 font-bold md:block  hidden`}>
              <p>
                {" "}
                {/* <span className="text-gray-400 line-through">
                  {price.toLocaleString("vi-VN")} đ{" "}
                </span> */}
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
              } shadow-lg shadow-slate-600/50 text-white w-[146px] text-sm py-3 rounded-lg`}
            >
              {status === "Hoàn tất đơn hàng"
                ? "Đánh giá"
                : status === "Chờ khách hàng xác nhận"
                  ? "Đã nhận hàng"
                  : "Hủy Đơn Hàng"}
            </button>
          )}
        </div>
        <div className="col-span-7 text-end border-t mt-2 py-3">
          {" "}
          Thành tiền:{" "}
          <span className="text-red-600 font-semibold text-2xl">
            {" "}
            ₫{(tong_tien ?? 0).toLocaleString("vi-VN")}
          </span>
        </div>
      </div>{" "}
    </>
  );
};

// Component hiển thị danh sách sản phẩm
const ProductList = ({ donhang }: any) => {
  const don_hang = donhang.don_hang;
  // console.log(don_hang);
  const chi_tiet_don_hangs = don_hang?.map((item: any) => {
    return item?.chi_tiets[0]; // Trả về chi tiết của từng đơn hàng
  });

  const chitiet = chi_tiet_don_hangs[0];
  // console.log(chitiet);
  return (
    <div className="lg:col-span-9 col-span-8 lg:pl-9">
      {don_hang?.map((item: any, index: number) => (
        <ProductItem
          status={item?.trang_thai_don_hang ?? "Đang xử lý"}
          pricesale={chitiet?.thanh_tien ?? 0}
          price={chitiet?.gia ?? 0}
          img={chitiet?.bien_the_san_pham?.san_pham?.anh_san_pham ?? sanPham2}
          name="Váy In Họa Tiết Moana Hồng"
          size={
            chitiet?.bien_the_san_pham?.kich_thuoc_bien_the?.kich_thuoc ?? "M"
          }
          gender={
            chitiet?.bien_the_san_pham?.kich_thuoc_bien_the?.loai_kich_thuoc ??
            ""
          }
          mau={chitiet?.bien_the_san_pham?.mau_bien_the?.ten_mau_sac ?? "Đen"}
          quantity={chitiet?.so_luong ?? 1}
          key={index}
          chi_tiet_don_hangs={item?.chi_tiets ?? []}
          tong_tien={item?.tong_tien_don_hang ?? 0}
          ma_don_hang={item?.ma_don_hang ?? ""}
        />
      ))}
    </div>
  );
};

export default ProductList;
