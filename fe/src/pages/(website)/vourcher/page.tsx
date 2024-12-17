import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Banner from "./_component/banner";
import instanceClient from "@/configs/client";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { useState } from "react";
import VoucherDetail from "./_component/vourcherDeatil";
import Method from "../_component/Method";
import { message } from "antd";

export interface Voucher {
  id: number;
  ma_code: string;
  loai: "tien_mat" | "phan_tram";
  giam_gia: number;
  chi_tieu_toi_thieu: number;
  so_luong: number;
  ngay_bat_dau: string;
  ngay_ket_thuc: string;
  mo_ta: string;
  ap_dung: string;
  da_thu_thap: number;
  so_luong_da_su_dung: any;
  ap_dung_vi: number;
  trang_thai_su_dung: string;
  giam_toi_da: number;
}

export interface VoucherResponse {
  data: Voucher[];
  status: number;
  message: string;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

const Voucher = () => {
  const [lengthss, setLengthss] = useState(6);
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);
  const queryClient = useQueryClient();

  const { data: vouchersData, isLoading } = useQuery({
    queryKey: ["vouchers"],
    queryFn: async () => {
      const response = await instanceClient.get("/ma-khuyen-mai");
      return response.data;
    },
  });
  const reversedData = vouchersData?.data?.slice().reverse();
  const [savedVouchers, setSavedVouchers] = useState<string[]>(() => {
    return (
      reversedData
        ?.filter((v: Voucher) => v.da_thu_thap === 1)
        ?.map((v: Voucher) => v.ma_code) || []
    );
  });

  const saveMutation = useMutation({
    mutationFn: (maCode: string) => {
      try {
        return instanceClient.post(`/thu-thap-ma-khuyen-mai/${maCode}`);
      } catch (error: any) {
        message.error(error.response.data.message);
        throw new Error("Xóa sản phẩm yêu thích thất bại");
      }
    },
    onSuccess: (_, maCode) => {
      setSavedVouchers((prev) => [...prev, maCode]);
      queryClient.invalidateQueries({ queryKey: ["vouchers"] });
    },
  });

  const handleSaveVoucher = (maCode: string) => {
    saveMutation.mutate(maCode);
  };

  const calculateDaysLeft = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // if (isLoading)
  //   return (
  //     <div className="flex items-center justify-center min-h-screen">
  //       <svg
  //         className="w-24 h-24"
  //         width={240}
  //         height={240}
  //         viewBox="0 0 240 240"
  //       >
  //         <circle
  //           className="pl__ring pl__ring--a"
  //           cx={120}
  //           cy={120}
  //           r={105}
  //           fill="none"
  //           stroke="#f42f25"
  //           strokeWidth={20}
  //           strokeDasharray="0 660"
  //           strokeDashoffset={-330}
  //           strokeLinecap="round"
  //         />
  //         <circle
  //           className="pl__ring pl__ring--b"
  //           cx={120}
  //           cy={120}
  //           r={35}
  //           fill="none"
  //           stroke="#f49725"
  //           strokeWidth={20}
  //           strokeDasharray="0 220"
  //           strokeDashoffset={-110}
  //           strokeLinecap="round"
  //         />
  //         <circle
  //           className="pl__ring pl__ring--c"
  //           cx={85}
  //           cy={120}
  //           r={70}
  //           fill="none"
  //           stroke="#255ff4"
  //           strokeWidth={20}
  //           strokeDasharray="0 440"
  //           strokeLinecap="round"
  //         />
  //         <circle
  //           className="pl__ring pl__ring--d"
  //           cx={155}
  //           cy={120}
  //           r={70}
  //           fill="none"
  //           stroke="#f42582"
  //           strokeWidth={20}
  //           strokeDasharray="0 440"
  //           strokeLinecap="round"
  //         />
  //       </svg>
  //     </div>
  //   );
  return (
    <div className="bg-gray-50 min-h-screen">
      <main>
        <section className="container py-6 mt-10">
          <div className="flex items-center gap-2 text-gray-600 px-4">
            <a href="/">
              <span className="hover:text-pink-500 cursor-pointer">
                Trang chủ{" "}
              </span>
            </a>
            <i className="fa-light fa-chevron-right text-sm" />
            <span className="text-pink-500">Khuyến mãi</span>
          </div>
        </section>

        <Banner />

        <section className="container py-10">
          <div className="space-y-8 px-4">
            <h2 className="text-3xl font-bold text-black-500">Tất cả ưu đãi</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reversedData && reversedData.length > 0 ? (
                <>
                  {reversedData
                    ?.slice(0, lengthss)

                    .map((voucher: Voucher) => (
                      <div
                        key={voucher.id}
                        className={`flex items-center border border-gray-200 rounded-lg p-4 shadow-md w-full min-h-[150px] relative ${
                          voucher.ap_dung_vi ? "bg-[#fff]" : "bg-white"
                        }`}
                      >
                        {voucher.trang_thai_su_dung === "Đã sử dụng" && (
                          <div className="absolute top-0 right-0 bg-gray-500 text-white px-3 py-1 rounded-bl-lg">
                            Đã sử dụng
                          </div>
                        )}

                        <div className="absolute top-2 -right-1 flex items-center">
                          <div className="bg-red-100 text-red-500 font-bold text-sm px-2 py-1 rounded-l-full shadow-md relative">
                            x {voucher.so_luong - voucher.so_luong_da_su_dung}
                          </div>
                          <div
                            className="absolute -bottom-1 -right-0 w-1 h-1 bg-[#fe9f8c]"
                            style={{ clipPath: "polygon(0 0, 100% 0, 0 100%)" }}
                          ></div>
                        </div>

                        <div className="absolute -top-2 right-36 w-4 h-4 bg-gray-100 rounded-full md:block hidden"></div>
                        <div className="absolute top-4 right-[9.50rem] bottom-4 border-r border-dashed border-gray-300 md:block hidden"></div>
                        <div className="absolute -bottom-2 right-36 w-4 h-4 bg-gray-100 rounded-full md:block hidden"></div>

                        <div className="flex-grow">
                          <h2 className="text-lg font-semibold">
                            {voucher.loai === "tien_mat"
                              ? `Giảm: ${formatCurrency(voucher.giam_gia)}`
                              : `Giảm: ${voucher.giam_gia}%`}
                          </h2>
                          <p className="text-sm text-gray-600 max-w-[200px] break-words">
                            {voucher.loai === "tien_mat"
                              ? `Giảm ${Number(voucher.giam_gia).toLocaleString()}đ`
                              : `Giảm ${voucher.giam_gia}% ${
                                  voucher.giam_toi_da
                                    ? `(tối đa ${Number(voucher.giam_toi_da).toLocaleString()}đ)`
                                    : ""
                                }`}{" "}
                            cho đơn từ{" "}
                            {Number(
                              voucher.chi_tieu_toi_thieu
                            ).toLocaleString()}
                            đ
                          </p>

                          <div
                            className={`${
                              voucher.ap_dung_vi
                                ? "bg-[#ee4d2d] text-[#fff]"
                                : "bg-[#cfebee] text-[#63b1bc]"
                            } px-2 py-1 rounded mt-2 inline-block`}
                          >
                            {voucher.ma_code}
                          </div>

                          <div className="flex flex-col sm:flex-row sm:items-center gap-[60px] mt-2">
                            <p className="text-red-500 text-sm">
                              Còn {calculateDaysLeft(voucher.ngay_ket_thuc)}{" "}
                              ngày
                            </p>
                            <a
                              onClick={(e) => {
                                e.preventDefault();
                                setSelectedVoucher(voucher);
                              }}
                              className="text-gray-700 text-sm font-bold -mt-[14px] cursor-pointer"
                            >
                              Điều kiện
                            </a>
                          </div>
                        </div>

                        <div className="flex-shrink-0">
                          <button
                            onClick={() => handleSaveVoucher(voucher.ma_code)}
                            disabled={
                              voucher.da_thu_thap === 1 ||
                              voucher.trang_thai_su_dung === "Đã sử dụng"
                            }
                            className={`${
                              voucher.da_thu_thap === 1 ||
                              voucher.trang_thai_su_dung === "Đã sử dụng"
                                ? "bg-gray-400"
                                : voucher.ap_dung_vi
                                  ? "bg-[#ee4d2d]"
                                  : "bg-[#63b1bc]"
                            } text-white font-semibold py-2 px-8 rounded whitespace-nowrap`}
                          >
                            {voucher.da_thu_thap === 1
                              ? "Đã lưu"
                              : voucher.trang_thai_su_dung === "Đã sử dụng"
                                ? "Đã dùng"
                                : "Lưu mã"}
                          </button>
                        </div>
                      </div>
                    ))}
                </>
              ) : (
                <div className="col-span-9 h-[230px] ">
                  <img
                    src="https://res.cloudinary.com/dcvu7e7ps/image/upload/v1730479480/lxx7oavd87pqchbcwiwc.png"
                    alt="Không ưu đãi "
                    className="w-[35%] h-[85%] mx-auto"
                  />
                </div>
              )}
            </div>{" "}
            {lengthss < reversedData?.length && (
              <div
                className="flex justify-center mt-10"
                onClick={() => setLengthss(lengthss + 6)}
              >
                <button className="px-10 py-3 mt-4 btn-black rounded-lg mb-4 font-semibold transition duration-200">
                  Xem thêm
                </button>
              </div>
            )}
          </div>
        </section>
      </main>

      <VoucherDetail
        isOpen={!!selectedVoucher}
        onClose={() => setSelectedVoucher(null)}
        voucher={selectedVoucher}
        onSave={handleSaveVoucher}
        isSaved={
          selectedVoucher
            ? savedVouchers.includes(selectedVoucher.ma_code)
            : false
        }
      />
      <Method />
    </div>
  );
};

export default Voucher;
