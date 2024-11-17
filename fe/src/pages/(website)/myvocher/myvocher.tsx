import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import instanceClient from "@/configs/client";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { useState } from "react";
import VoucherDetail from "../vourcher/_component/vourcherDeatil";
import { Pagination } from "antd";

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
  trang_thai: number;
  ap_dung_vi: number;
  trang_thai_su_dung: string;
}

export interface VoucherResponse {
  data: Voucher[];
  status: number;
  message: string;
}

const getVouchers = async () => {
  const response = await instanceClient.get("/ma-khuyen-mai");
  return response.data;
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

const MyVoucher = () => {
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;
  const queryClient = useQueryClient();

  const { data: vouchersData } = useQuery({
    queryKey: ["vouchers"],
    queryFn: getVouchers,
  });

  const activeVouchers =
    vouchersData?.data.filter(
      (voucher: Voucher) =>
        voucher.trang_thai === 1 && voucher.da_thu_thap === 1
    ) || [];

  const totalVouchers = activeVouchers.length;
  const indexOfLastVoucher = currentPage * pageSize;
  const indexOfFirstVoucher = indexOfLastVoucher - pageSize;
  const currentVouchers = activeVouchers.slice(
    indexOfFirstVoucher,
    indexOfLastVoucher
  );

  const [savedVouchers, setSavedVouchers] = useState<string[]>(() => {
    return activeVouchers
      .filter((v: Voucher) => v.da_thu_thap === 1)
      .map((v: Voucher) => v.ma_code);
  });

  const saveMutation = useMutation({
    mutationFn: (maCode: string) => {
      try {
        return instanceClient.post(`/thu-thap-ma-khuyen-mai/${maCode}`);
      } catch (error: any) {
        throw new Error("Lưu mã thất bại");
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

  return (
    <div className="">
      <main>
        <section className="container">
          <div className="space-y-6 ">
            <h2 className="text-2xl font-bold text-black-500">
              Vocher của bạn
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentVouchers && currentVouchers.length !== 0 ? (
                currentVouchers.map((voucher: Voucher) => (
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
                      <div className="bg-red-100 text-red-500 font-bold text-xs px-2 py-0.5 rounded-l-full shadow-md relative">
                        x {voucher.so_luong - voucher.so_luong_da_su_dung}
                      </div>
                      <div
                        className="absolute -bottom-1 -right-0 w-1 h-1 bg-[#fe9f8c]"
                        style={{ clipPath: "polygon(0 0, 100% 0, 0 100%)" }}
                      ></div>
                    </div>

                    <div className="absolute -top-2 right-28 w-3 h-3 bg-gray-100 rounded-full md:block hidden"></div>
                    <div className="absolute top-4 right-[7.25rem] bottom-4 border-r border-dashed border-gray-300 md:block hidden"></div>
                    <div className="absolute -bottom-2 right-28 w-3 h-3 bg-gray-100 rounded-full md:block hidden"></div>

                    <div className="flex-grow">
                      <h2 className="text-base font-semibold">
                        {voucher.loai === "tien_mat"
                          ? `Giảm: ${formatCurrency(voucher.giam_gia)}`
                          : `Giảm: ${voucher.giam_gia}%`}
                      </h2>
                      <p className="text-xs text-gray-600 max-w-[180px] break-words">
                        {voucher.loai === "tien_mat"
                          ? `Giảm: ${formatCurrency(voucher.giam_gia)}`
                          : `Giảm: ${voucher.giam_gia}%`}
                        cho đơn từ {formatCurrency(voucher.chi_tieu_toi_thieu)}
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
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-1">
                        <p className="text-red-500 text-xs">
                          Còn {calculateDaysLeft(voucher.ngay_ket_thuc)} ngày
                        </p>
                        <a
                          onClick={(e) => {
                            e.preventDefault();
                            setSelectedVoucher(voucher);
                          }}
                          className="text-gray-700 text-xs font-bold cursor-pointer"
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
                        } text-white font-semibold py-2 px-4 rounded whitespace-nowrap`}
                      >
                        {voucher.da_thu_thap === 1
                          ? "Đã lưu"
                          : voucher.trang_thai_su_dung === "Đã sử dụng"
                            ? "Đã dùng"
                            : "Lưu mã"}
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-9 h-[430px] ">
                  <img
                    src="https://res.cloudinary.com/dcvu7e7ps/image/upload/v1730217496/Screenshot_2024-10-29_225706_vwmhq1.png"
                    alt="No orders"
                    className="w-[50%] h-[80%] mx-auto"
                  />
                </div>
              )}
            </div>

            {totalVouchers > 6 && (
              <div className="flex justify-center mt-6">
                <Pagination
                  current={currentPage}
                  onChange={(page) => setCurrentPage(page)}
                  pageSize={pageSize}
                  total={totalVouchers}
                  showSizeChanger={false}
                />
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
    </div>
  );
};

export default MyVoucher;
