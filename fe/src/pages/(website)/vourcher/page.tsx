import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Banner from "./_component/banner";
import instanceClient from "@/configs/client";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { useState } from "react";
import VoucherDetail from "./_component/vourcherDeatil";
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
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);
  const queryClient = useQueryClient();

  const { data: vouchersData } = useQuery({
    queryKey: ["vouchers"],
    queryFn: async () => {
      const response = await instanceClient.get("/ma-khuyen-mai");
      return response.data;
    },
  });
  console.log("vouchersData", vouchersData);
  const [savedVouchers, setSavedVouchers] = useState<string[]>(() => {
    return (
      vouchersData?.data
        .filter((v: Voucher) => v.da_thu_thap === 1)
        .map((v: Voucher) => v.ma_code) || []
    );
  });
  console.log("savedVouchers", savedVouchers);
  const saveMutation = useMutation({
    mutationFn: (maCode: string) => {
      return instanceClient.post(`/thu-thap-ma-khuyen-mai/${maCode}`);
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
            {vouchersData?.data && vouchersData.data.length > 0 ? (
  vouchersData.data.map((voucher: Voucher) => (
                  <div
                    key={voucher.id}
                    className="flex items-center bg-white border border-gray-200 rounded-lg p-4 shadow-md w-full min-h-[150px] relative"
                  >
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
                          ? `Giảm: ${formatCurrency(voucher.giam_gia)}`
                          : `Giảm: ${voucher.giam_gia}%`}
                        cho đơn từ {formatCurrency(voucher.chi_tieu_toi_thieu)}
                      </p>

                      <div className="bg-[#cfebee] text-[#63b1bc] px-2 py-1 rounded mt-2 inline-block">
                        {voucher.ma_code}
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-[60px] mt-2">
                        <p className="text-red-500 text-sm">
                          Còn {calculateDaysLeft(voucher.ngay_ket_thuc)} ngày
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
                        disabled={voucher.da_thu_thap === 1}
                        className={`${
                          voucher.da_thu_thap === 1
                            ? "bg-gray-400"
                            : "bg-[#63b1bc]"
                        } text-white font-semibold py-2 px-8 rounded whitespace-nowrap`}
                      >
                        {voucher.da_thu_thap === 1 ? "Đã lưu" : "Lưu mã"}
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-9 h-[230px] ">
                  <img
                    src="https://res.cloudinary.com/dcvu7e7ps/image/upload/v1730479480/lxx7oavd87pqchbcwiwc.png"
                    alt="Không ưu đãi "
                    className="w-[35%] h-[85%] mx-auto"
                  />
                </div>
              )}
            </div>
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
    </div>
  );
};

export default Voucher;
