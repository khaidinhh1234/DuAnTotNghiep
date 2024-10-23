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
                    src={img}
                    alt="Sản phẩm"
                    className="w-20 h-24 rounded-md mb-5"
                  />
                  <span
                    className={`text-xs px-3 py-1 rounded-sm ${status == "Hoàn tất đơn hàng" ? "delivered" : "inprocrass"}`}
                  >
                    {status}
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
                  <span className="">Sản phẩm của bạn đã {status}</span>
                </div>
              </div>{" "}
            </div>
            <div className={`text-center py-8 font-bold md:block  hidden`}>
              <p>{price.toLocaleString("vi-VN")} đ</p>
            </div>
          </div>
          {chi_tiet_don_hangs && chi_tiet_don_hangs.length >= 2 && (
            <div className="text-center font-bold ml-20 mt-3">
              <button>
                <i className="fa-solid fa-share"></i> Xem thêm ...
              </button>
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
          <button
            className={`${
              status === "Hoàn tất đơn hàng"
                ? "bg-black hover:bg-black/50"
                : "bg-[#FF7262] hover:bg-[#e9b2ac]"
            } shadow-lg shadow-slate-600/50 text-white w-[146px] text-sm py-3 rounded-lg`}
          >
            {status === "Hoàn tất đơn hàng" ? "Đánh giá" : "Hủy Đơn Hàng"}
          </button>
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
  // console.log(donhang);
  const chi_tiet_don_hangs = donhang?.map((item: any) => {
    return item?.chi_tiet_don_hangs[0]; // Trả về chi tiết của từng đơn hàng
  });

  const chitiet = chi_tiet_don_hangs[0];
  // console.log(chitiet);
  return (
    <div className="lg:col-span-9 col-span-8 lg:pl-9">
      {donhang?.map((item: any, index: number) => (
        <ProductItem
          status={item?.trang_thai_don_hang}
          price={chitiet?.thanh_tien}
          img={
            "https://res.cloudinary.com/dcvu7e7ps/image/upload/v1729223981/ao-khoac-nu-SKN7004-DEN_1_jjbtoe.webp"
          }
          name="Váy In Họa Tiết Moana Hồng"
          size={chitiet?.bien_the_san_pham?.kich_thuoc_bien_the?.kich_thuoc}
          gender={
            chitiet?.bien_the_san_pham?.kich_thuoc_bien_the?.loai_kich_thuoc
          }
          mau={chitiet?.bien_the_san_pham?.mau_bien_the?.ten_mau_sac}
          quantity={chitiet?.so_luong}
          key={index}
          chi_tiet_don_hangs={item?.chi_tiet_don_hangs}
          tong_tien={item?.tong_tien_don_hang}
          ma_don_hang={item?.ma_don_hang}
        />
      ))}
      <ProductItem
        status="đang được xử lý"
        price={8000000}
        img={
          "https://res.cloudinary.com/dcvu7e7ps/image/upload/v1729223981/ao-khoac-nu-SKN7004-DEN_1_jjbtoe.webp"
        }
        name="Váy In Họa Tiết Moana Hồng"
        size="M"
        mau="Đỏ"
        quantity={1}
      />
    </div>
  );
};

export default ProductList;
