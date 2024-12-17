import { useEffect, useState } from "react";
import Voucheruser from "./voucheruser";

const Subtotal = ({ tong_tien, Macode, trangthai, isPending }: any) => {
  console.log("tong_tien", tong_tien);
  const [giamgiatoida, setGiamgiatoida] = useState<number | null>(null);
  const [selectedDiscount, setSelectedDiscount] = useState<number | null>(null);
  const ap = trangthai === "Ví tiền" ? 1 : 0;
  useEffect(() => {
    if (selectedDiscount === null) return;
  }, [selectedDiscount]);
  const handleSelectVoucher = (data: number | any) => {
    setSelectedDiscount(data.giam_gia);
    setGiamgiatoida(data.giam_toi_da);
    Macode(data.index);
  };
  const giamgia =
    (selectedDiscount ?? 0) > 100
      ? (selectedDiscount ?? 0)
      : tong_tien?.tong_gia_tri_san_pham * ((selectedDiscount ?? 0) / 100) >
          (Number(giamgiatoida) ?? 0)
        ? (Number(giamgiatoida) ?? 0)
        : tong_tien?.tong_gia_tri_san_pham * ((selectedDiscount ?? 0) / 100);
  // console.log("giamgia", giamgia);
  // console.log("tong_tien", giamgiatoida);
  return (
    <div className="lg:col-span-4 col-span-6">
      <div className="border px-4 py-1 lg:w-[359px] rounded-md">
        <h1 className="text-xl font-bold mt-4">Chi tiết đơn hàng</h1>
        <div className="flex justify-between font-bold border-hrBlack border-b ">
          <h4>Tổng giá trị sản phẩm</h4>
          <span className="px-2">
            {(tong_tien?.tong_gia_tri_san_pham ?? 0)?.toLocaleString("vn-VN")} ₫
          </span>
        </div>
        <div className="py-4">
          <label className="text-xs ">Nhập mã giảm giá</label>
          <br />
          <div className=" border-y border-black/20 mt-2">
            {/* <input
              type="text"
              placeholder="FLAT50"
              className="lg:w-[218px] w-[300px] h-[56px] px-4 rounded-s-lg focus:outline-none border border-l-2 border-t-2 border-blackL border-r-0"
            /> */}

            <Voucheruser onSelectVoucher={handleSelectVoucher} ap={ap} />
          </div>
          <div className="py-4">
            {selectedDiscount && (
              <div className=" flex justify-between font-medium border-hrBlack">
                <p>
                  Giảm giá{" "}
                  {(selectedDiscount ?? 0) > 100
                    ? selectedDiscount.toLocaleString() + "₫"
                    : selectedDiscount + "%"}
                </p>
                <span className="px-2 text-red-500">
                  {" "}
                  - {giamgia.toLocaleString()}₫
                </span>
              </div>
            )}
            <div className=" flex justify-between font-medium border-hrBlack">
              <p>Tiết kiệm</p>
              <span className="px-2 text-red-500">
                {" "}
                - {(tong_tien?.tong_tiet_kiem ?? 0).toLocaleString("vi-VN")}₫
              </span>
            </div>
            <div className=" flex justify-between font-medium border-hrBlack">
              <p>Phí giao hàng</p>
              <span className="px-2">
                {(tong_tien?.van_chuyen ?? 0).toLocaleString("vi-VN")}₫
              </span>
            </div>
            <div className=" flex justify-between font-medium border-hrBlack">
              <p>Giảm giá vận chuyển</p>
              <span className="px-2 text-red-500">
                {" "}
                {(tong_tien?.giam_gia_van_chuyen ?? 0).toLocaleString("vi-VN")}₫
              </span>
            </div>
          </div>
          <div className="flex justify-between font-bold ">
            <h4>Tổng cộng</h4>
            <span>
              {(tong_tien?.tong_thanh_toan - giamgia).toLocaleString("vi-VN")} ₫
            </span>
          </div>
        </div>
        <div className="flex justify-end text-red-500 mb-8">
          <span>
            Bạn đã tiết kiệm được{" "}
            {(
              tong_tien?.tiet_kiem +
              giamgia +
              tong_tien?.giam_gia_van_chuyen
            ).toLocaleString("vi-VN")}
            ₫
          </span>
        </div>
        {/* <a href="/shippingAddressPage"> */}
        <button
          type="submit"
          className=" block btn-black px-10 w-[320px] my-4 mx-auto py-4 rounded-lg text-md font-medium"
        >
          {isPending ? "Đang xử lý..." : "Đặt hàng ngay"}
        </button>
        {/* </a> */}
      </div>
    </div>
  );
};
export default Subtotal;
