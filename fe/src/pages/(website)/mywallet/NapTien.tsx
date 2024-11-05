import React, { useState } from "react";
import { Checkbox } from 'antd';
import type { CheckboxProps } from 'antd';

const onChange: CheckboxProps['onChange'] = (e) => {
  console.log(`checked = ${e.target.checked}`);
};
const NapTien: React.FC = () => {
  const [amount, setAmount] = useState("100.000");

  const handleAmountChange = (value: string) => {
    setAmount(value);
  };

  const handleQuickAmountSelect = (value: string) => {
    setAmount(value);
  };

  const clearAmount = () => {
    setAmount("");
  };

  return (
    <div className="w-full max-w-[860px] mx-auto bg-white p-4 rounded-lg shadow-md overflow-hidden">
      {/* Tiêu đề */}
      <h2 className="text-center text-xl font-semibold mb-2">Nạp tiền</h2>

      {/* Nhập số tiền */}
      <div className="mb-2">
        <label className="block text-gray-600 mb-1 text-base">Nhập số tiền (đ)</label>
        <div className="flex items-center border border-gray-300 rounded-lg p-2">
          <span className="text-lg font-medium text-gray-500">đ</span>
          <input
            type="text"
            value={amount}
            onChange={(e) => handleAmountChange(e.target.value)}
            className="flex-1 text-right text-xl font-bold text-black outline-none"
          />
          <button onClick={clearAmount} className="text-gray-500 text-lg">✕</button>
        </div>
      </div>

      {/* Số dư ví hiện tại */}
      <p className="text-gray-500 mb-2 text-sm">Số dư Ví hiện tại: đ1.290</p>

      {/* Các lựa chọn số tiền */}
      <div className="flex justify-between mb-2">
        <button
          onClick={() => handleQuickAmountSelect("100.000")}
          className={`flex-1 mx-1 py-2 rounded-lg text-base font-semibold ${
            amount === "100.000" ? "border-2 border-red-500 text-red-500" : "border border-gray-300 text-gray-700"
          }`}
        >
          100.000
        </button>
        <button
          onClick={() => handleQuickAmountSelect("200.000")}
          className={`flex-1 mx-1 py-2 rounded-lg text-base font-semibold ${
            amount === "200.000" ? "border-2 border-red-500 text-red-500" : "border border-gray-300 text-gray-700"
          }`}
        >
          200.000
        </button>
        <button
          onClick={() => handleQuickAmountSelect("500.000")}
          className={`flex-1 mx-1 py-2 rounded-lg text-base font-semibold ${
            amount === "500.000" ? "border-2 border-red-500 text-red-500" : "border border-gray-300 text-gray-700"
          }`}
        >
          500.000
        </button>
      </div>

      {/* Phương thức thanh toán */}
      <div className="flex items-center border border-gray-200 rounded-lg p-2 mb-2">
      <img src="https://res.cloudinary.com/dpundwxg1/image/upload/v1730777845/Remove-bg.ai_1730777674094_yxs3kc.png" alt="Star" className="w-12 h-12" />
      <div className="ml-6">
          <p className="text-gray-700 text-sm -mb-1">Phương thức thanh toán</p>
          <p className="font-semibold text-base -mb-1">Thanh toán AtM MoMo</p>
        </div>
        <button className="ml-auto text-gray-500 text-lg">
        <Checkbox onChange={onChange}></Checkbox>
</button>
      </div>
      <div className="flex items-center border border-gray-200 rounded-lg p-2 mb-2">
      <img src="https://res.cloudinary.com/dpundwxg1/image/upload/v1730777845/Remove-bg.ai_1730777674094_yxs3kc.png" alt="Star" className="w-12 h-12" />
      <div className="ml-6">
          <p className="text-gray-700 text-sm -mb-1">Phương thức thanh toán</p>
          <p className="font-semibold text-base -mb-1">Thanh toán Momo Qr</p>
        </div>
        <button className="ml-auto text-gray-500 text-lg">
        <Checkbox onChange={onChange}></Checkbox>
</button>
      </div>
      {/* Thông tin thanh toán */}
      <div className="border-t border-gray-200 pt-2 mb-2">
        <p className="flex justify-between text-gray-700 text-base">
          <span>Nạp tiền</span>
          <span>đ{amount}</span>
        </p>
        <p className="flex justify-between text-xl font-semibold text-red-500 mt-1">
          <span>Tổng thanh toán</span>
          <span>đ{amount}</span>
        </p>
      </div>

      {/* Lưu ý */}
      <p className="text-xs text-gray-500 mb-2">
        Nhấn "Nạp tiền ngay", bạn đã đồng ý tuân theo{" "}
        <a href="#" className="text-blue-500">Điều khoản sử dụng</a> và{" "}
        <a href="#" className="text-blue-500">Chính sách bảo mật</a>.
      </p>

      {/* Nút xác nhận */}
      <button className="w-full bg-red-500 text-white text-lg font-semibold py-2 rounded-lg mt-10">Nạp tiền ngay</button>
    </div>
  );
};

export default NapTien;
