
import React, { useState, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
// import { useNavigate } from "react-router-dom";
import { Checkbox } from 'antd';
import instanceClient from "@/configs/client";
import { Link } from "react-router-dom";

const NapTien: React.FC = () => {
  // const navigate = useNavigate();
  const [amount, setAmount] = useState<string>("");
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [showForgotPinModal, setShowForgotPinModal] = useState(false);
  const [pins, setPins] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("");
  const depositMutation = useMutation({
    mutationFn: async (data: {
      so_tien: number,
      ma_xac_minh: string,
    }) => {
      const depositResponse = await instanceClient.post('/nap-tien', data);
      console.log(depositResponse);
      const paymentData = {
        phuong_thuc_thanh_toan: selectedPaymentMethod,
        amount: data.so_tien,
        ma_giao_dich: depositResponse?.data?.data.ma_giao_dich
      };
      console.log(paymentData);

      const momoResponse = await instanceClient.post('/payment/momo', paymentData);
      return momoResponse.data;
    },
    onSuccess: (response) => {
      if (response.payUrl) {
        window.location.href = response.payUrl;
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
      resetPins();

    }
  });
  const forgotPinMutation = useMutation({
    mutationFn: () => instanceClient.get('/quen-ma-xac-minh').then(res => res.data),
    onSuccess: () => {
      toast.success('Yêu cầu lấy lại mã PIN đã được gửi đến email của bạn');
      setShowForgotPinModal(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
    }
  });

  const handleQuickAmountSelect = (value: string) => {
    const numberValue = Number(value.replace(/\./g, ''));
    setAmount(numberValue.toString());
  };

  const clearAmount = () => {
    setAmount("");
  };
  const handleInitialSubmit = () => {
    const numberAmount = Number(amount);
    if (numberAmount < 50000) {
      toast.error('Số tiền nạp tối thiểu là 50.000₫');
      return;
    }
    setShowVerificationModal(true);
  };
  const resetPins = () => {
    setPins(['', '', '', '', '', '']);
  };
  const handlePinChange = (index: number, value: string) => {
    const newPins = [...pins];
    newPins[index] = value;
    setPins(newPins);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleFinalSubmit = () => {
    const verificationCode = pins.join('');
    depositMutation.mutate({
      so_tien: Number(amount),
      ma_xac_minh: verificationCode
    });
  };
  const formatAmount = (value: string) => {
    return Number(value).toLocaleString('vi-VN');
  };
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setAmount(value);
  };
  return (
    <div className="w-full max-w-[860px] mx-auto bg-white p-4 rounded-lg shadow-md overflow-hidden">
      <div className="flex items-center mb-2">
      <Link to="/mypro/wallet">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
    </svg>
  </Link>
        <h2 className="flex-grow text-center text-xl font-semibold">Nạp tiền</h2>
      </div>


      <div className="mb-2">
        <label className="block text-gray-600 mb-1 text-base">Nhập số tiền (đ)</label>
        <div className="flex items-center border border-gray-300 rounded-lg p-2">
          <span className="text-lg font-medium text-gray-500">đ</span>
          <input
            type="text"
            value={amount ? Number(amount).toLocaleString('vi-VN') : ''}
            onChange={handleAmountChange}
            className="flex-1 text-right text-xl font-bold text-black outline-none"
          />
          <button onClick={clearAmount} className="text-gray-500 text-lg">✕</button>
        </div>
      </div>

      <div className="flex justify-between mb-2">
        {["100.000", "200.000", "500.000"].map((value) => (
          <button
            key={value}
            onClick={() => handleQuickAmountSelect(value)}
            className={`flex-1 mx-1 py-2 rounded-lg text-base font-semibold ${amount === value ? "border-2 border-red-500 text-red-500" : "border border-gray-300 text-gray-700"
              }`}
          >
            {value}
          </button>
        ))}
      </div>

      {/* Bank Selection Section */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center border border-gray-200 rounded-lg p-2">
          <img src="https://res.cloudinary.com/dpundwxg1/image/upload/v1730777845/Remove-bg.ai_1730777674094_yxs3kc.png" alt="MoMo ATM" className="w-12 h-12" />
          <div className="ml-6">
            <p className="text-gray-700 text-sm -mb-1">Phương thức thanh toán</p>
            <p className="font-semibold text-base -mb-1">Thanh toán ATM MoMo</p>
          </div>
          <Checkbox
            onChange={() => setSelectedPaymentMethod("Momo_ATM")}
            checked={selectedPaymentMethod === "Momo_ATM"}
            className="ml-auto"
          />        </div>

        <div className="flex items-center border border-gray-200 rounded-lg p-2">
          <img src="https://res.cloudinary.com/dpundwxg1/image/upload/v1730777845/Remove-bg.ai_1730777674094_yxs3kc.png" alt="MoMo QR" className="w-12 h-12" />
          <div className="ml-6">
            <p className="text-gray-700 text-sm -mb-1">Phương thức thanh toán</p>
            <p className="font-semibold text-base -mb-1">Thanh toán Momo QR</p>
          </div>
          <Checkbox
            onChange={() => setSelectedPaymentMethod("Momo_QR")}
            checked={selectedPaymentMethod === "Momo_QR"}
            className="ml-auto"
          />        </div>
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
        onClick={handleInitialSubmit}
        className="w-full bg-red-500 text-white text-lg font-semibold py-2 rounded-lg mt-5"
      >
        Nạp tiền ngay
      </button>

      {/* Verification Modal */}
      {showVerificationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h2 className="text-xl font-semibold mb-4">Xác nhận mật khẩu ví</h2>
            <p className="text-gray-600 mb-6">Vui lòng nhập mật khẩu ví gồm 6 chữ số</p>

            <div className="mb-6">
              <div className="flex justify-between space-x-2">
                {pins.map((pin, index) => (
                  <input
                    key={index}
                    type="password"
                    maxLength={1}
                    value={pin}
                    ref={(el) => (inputRefs.current[index] = el)}
                    onChange={(e) => handlePinChange(index, e.target.value)}
                    className="w-10 h-10 text-center text-2xl border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ))}
              </div>
              <button
                onClick={() => setShowForgotPinModal(true)}
                className="text-blue-600 hover:text-blue-800 text-sm mt-4 block"
              >
                Quên mật khẩu?
              </button>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowVerificationModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Hủy
              </button>
              <button
                onClick={handleFinalSubmit}
                disabled={pins.some(pin => !pin)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Forgot PIN Modal */}
      {showForgotPinModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h2 className="text-xl font-semibold mb-4">Xác nhận quên mật khẩu</h2>
            <p className="text-gray-600 mb-6">
              Bạn có chắc chắn muốn lấy lại mật khẩu ví? Chúng tôi sẽ gửi mã đến email của bạn.
            </p>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowForgotPinModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Hủy
              </button>
              <button
                onClick={() => forgotPinMutation.mutate()}
                disabled={forgotPinMutation.isPending}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NapTien;
