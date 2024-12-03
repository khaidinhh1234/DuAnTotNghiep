import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Checkbox } from "antd";
import instanceClient from "@/configs/client";
import { Link } from "react-router-dom";

const NapTien: React.FC = () => {
  const queryClient = useQueryClient();
  const [amount, setAmount] = useState<string>("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<string>("");

  const depositMutation = useMutation({
    mutationFn: async (data: { so_tien: number }) => {
      const depositResponse = await instanceClient.post("/nap-tien", data);
      const paymentData = {
        phuong_thuc_thanh_toan: selectedPaymentMethod,
        amount: data.so_tien,
        ma_giao_dich: depositResponse?.data?.data.ma_giao_dich,
      };

      const momoResponse = await instanceClient.post(
        "/payment/momo",
        paymentData
      );
      return momoResponse.data;
    },
    onSuccess: (response) => {
      if (response.payUrl) {
        window.location.href = response.payUrl;
      }
      queryClient.invalidateQueries({ queryKey: ["walletData"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Có lỗi xảy ra");
    },
  });

  const handleQuickAmountSelect = (value: string) => {
    const numberValue = Number(value.replace(/\./g, ""));
    setAmount(numberValue.toString());
  };

  const clearAmount = () => {
    setAmount("");
  };

  const handleSubmit = () => {
    const numberAmount = Number(amount);
    if (numberAmount < 50000) {
      toast.error("Số tiền nạp tối thiểu là 50.000₫");
      return;
    } else if (numberAmount > 10000000) {
      toast.error("Số tiền nạp tối thiểu là 10.000.000₫");
      return;
    }
    depositMutation.mutate({
      so_tien: numberAmount,
    });
  };

  const formatAmount = (value: string) => {
    return Number(value).toLocaleString("vi-VN");
  };

  const handleAmountChange = (e: any) => {
    const value = e.target.value.replace(/\D/g, ""); // Loại bỏ các ký tự không phải số
    setAmount(value);
  };
  const [isFocused, setIsFocused] = useState(false);
  const handleBlur = () => {
    setIsFocused(false); // Mất tiêu điểm
  };

  const handleFocus = () => {
    setIsFocused(true); // Khi vào tiêu điểm
  };
  return (
    <div className="w-full max-w-[860px] mx-auto bg-white p-4 rounded-lg shadow-md overflow-hidden">
      <div className="flex items-center mb-2">
        <Link to="/mypro/wallet">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </Link>
        <h2 className="flex-grow text-center text-xl font-semibold">
          Nạp tiền
        </h2>
      </div>

      <div className="mb-2">
        <label className="block text-gray-600 mb-1 text-base">
          Nhập số tiền (đ)
        </label>
        <div className="flex items-center border border-gray-300 rounded-lg p-2">
          <span className="text-lg font-medium text-gray-500">đ</span>
          <input
            type="text"
            value={
              isFocused
                ? amount // Hiển thị giá trị thô khi focus
                : amount
                  ? new Intl.NumberFormat("vi-VN").format(Number(amount)) // Định dạng khi mất focus
                  : ""
            }
            onChange={handleAmountChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className="flex-1 text-right text-xl font-bold text-black outline-none"
          />
          <button onClick={clearAmount} className="text-gray-500 text-lg">
            ✕
          </button>
        </div>
      </div>

      <div className="flex justify-between mb-2">
        {["100.000", "200.000", "500.000"].map((value) => (
          <button
            key={value}
            onClick={() => handleQuickAmountSelect(value)}
            className={`flex-1 mx-1 py-2 rounded-lg text-base font-semibold ${
              amount === value.replace(/\./g, "")
                ? "border-2 border-red-500 text-red-500"
                : "border border-gray-300 text-gray-700"
            }`}
          >
            {value}
          </button>
        ))}
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center border border-gray-200 rounded-lg p-2">
          <img
            src="https://res.cloudinary.com/dpundwxg1/image/upload/v1730777845/Remove-bg.ai_1730777674094_yxs3kc.png"
            alt="MoMo ATM"
            className="w-12 h-12"
          />
          <div className="ml-6">
            <p className="text-gray-700 text-sm -mb-1">
              Phương thức thanh toán
            </p>
            <p className="font-semibold text-base -mb-1">Thanh toán ATM MoMo</p>
          </div>
          <Checkbox
            onChange={() => setSelectedPaymentMethod("Momo_ATM")}
            checked={selectedPaymentMethod === "Momo_ATM"}
            className="ml-auto"
          />
        </div>

        <div className="flex items-center border border-gray-200 rounded-lg p-2">
          <img
            src="https://res.cloudinary.com/dpundwxg1/image/upload/v1730777845/Remove-bg.ai_1730777674094_yxs3kc.png"
            alt="MoMo QR"
            className="w-12 h-12"
          />
          <div className="ml-6">
            <p className="text-gray-700 text-sm -mb-1">
              Phương thức thanh toán
            </p>
            <p className="font-semibold text-base -mb-1">Thanh toán Momo QR</p>
          </div>
          <Checkbox
            onChange={() => setSelectedPaymentMethod("Momo_QR")}
            checked={selectedPaymentMethod === "Momo_QR"}
            className="ml-auto"
          />
        </div>
      </div>

      <div className="border-t border-gray-200 pt-2 mb-2">
        <p className="flex justify-between text-gray-700 text-base">
          <span>Nạp tiền</span>
          <span>đ{formatAmount(amount)}</span>
        </p>
        <p className="flex justify-between text-xl font-semibold text-red-500 mt-1">
          <span>Tổng thanh toán</span>
          <span>đ{formatAmount(amount)}</span>
        </p>
      </div>

      <button
        onClick={handleSubmit}
        className="w-full bg-red-500 text-white text-lg font-semibold py-2 rounded-lg mt-5"
      >
        Nạp tiền ngay
      </button>
    </div>
  );
};

export default NapTien;
