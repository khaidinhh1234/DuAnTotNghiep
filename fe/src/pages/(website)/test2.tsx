import React from "react";

const Test2 = () => {
  return (
    <div>
      {/* Overlay */}
      <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
        {/* Popup container */}
        <div className="bg-white rounded-lg shadow-lg w-96 p-5">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Mã ưu đãi</h2>
            <button className="text-gray-500 hover:text-gray-700 text-2xl">
              ×
            </button>
          </div>
          {/* Input mã ưu đãi */}
          <div className="flex items-center mb-4">
            <input
              type="text"
              placeholder="Nhập mã ưu đãi"
              className="border border-gray-300 rounded-md px-4 py-2 w-full mr-2"
            />
            <button className="bg-gray-200 text-gray-500 px-4 py-2 rounded-md hover:bg-gray-300">
              Sử dụng
            </button>
          </div>
          {/* Voucher List */}
          <div className="space-y-4">
            {/* Voucher Item 1 */}
            <div className="border rounded-md p-4 flex justify-between items-center">
              <div>
                <span className="bg-teal-500 text-white text-sm px-2 py-1 rounded">
                  Lựa chọn tốt nhất
                </span>
                <h3 className="text-lg font-semibold mt-2">Voucher 50K</h3>
                <p className="text-sm text-gray-500">
                  Giảm 50k cho đơn từ 999k
                </p>
                <div className="font-mono bg-gray-100 text-gray-700 px-2 py-1 rounded mt-2">
                  GIAM50
                </div>
                <p className="text-sm text-red-500 mt-1">
                  Sắp hết hạn: Còn 2 ngày
                </p>
              </div>
              <div className="text-teal-500">
                <button className="text-sm font-semibold">Điều kiện</button>
                <span className="text-2xl ml-4">✔️</span>
              </div>
            </div>
            {/* Voucher Item 2 */}
            <div className="border rounded-md p-4 flex justify-between items-center">
              <div>
                <span className="bg-teal-500 text-white text-sm px-2 py-1 rounded">
                  Ưu đãi riêng bạn
                </span>
                <h3 className="text-lg font-semibold mt-2">Voucher FREESHIP</h3>
                <p className="text-sm text-gray-500">
                  FREESHIP cho đơn từ 199k
                </p>
                <div className="font-mono bg-gray-100 text-gray-700 px-2 py-1 rounded mt-2">
                  FREESHIP
                </div>
                <p className="text-sm text-red-500 mt-1">
                  Sắp hết hạn: Còn 2 ngày
                </p>
              </div>
              <div className="text-teal-500">
                <button className="text-sm font-semibold">Điều kiện</button>
                <span className="text-2xl ml-4">✔️</span>
              </div>
            </div>
          </div>
          {/* Continue button */}
          <div className="mt-5">
            <button className="bg-red-500 text-white w-full py-3 rounded-lg font-semibold hover:bg-red-600">
              Tiếp tục
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Test2;
