import React from 'react';
import {sanPham2} from '@/assets/img'
const ShoppingCart = () => {
  return (
    <div className="absolute top-24 right-60 w-85 bg-white shadow-lg p-6 rounded-lg z-10">
      <h2 className="text-lg font-semibold mb-4">Bạn có 3 sản phẩm trong giỏ hàng</h2>

      {/* Cart items */}
      <div className="space-y-14">
        {/* CartItem 1 */}
        <div className="flex items-center">
          <img
            src={sanPham2}
            alt="Váy hồng Moana in hình cho bé gái"
            className="w-14 h-14 object-cover mr-4"
          />
          <div className="flex-grow">
            <h3 className="text-sm font-medium hover:text-[#FF7262]">
              Váy hồng Moana in hình cho bé gái
            </h3>
            <p className="text-sm text-gray-500 font-bold">1 x $80.00</p>
            <p className="text-xs text-gray-500">Kích thước: S</p>
          </div>
          <button className="text-red-500 hover:text-red-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        {/* CartItem 2 */}
        <div className="flex items-center">
          <img
            src={sanPham2}
            alt="Túi xách tay cho nữ"
            className="w-14 h-14 object-cover mr-4"
          />
          <div className="flex-grow">
            <h3 className="text-sm font-medium hover:text-[#FF7262]">
              Túi xách tay cho nữ
            </h3>
            <p className="text-sm text-gray-500 font-bold">1 x $80.00</p>
            <p className="text-xs text-gray-500">Kích thước: Thông thường</p>
          </div>
          <button className="text-red-500 hover:text-red-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        {/* CartItem 3 */}
        <div className="flex items-center">
          <img
            src={sanPham2}
            alt="Áo sơ mi cotton may sẵn"
            className="w-14 h-14 object-cover mr-4"
          />
          <div className="flex-grow">
            <h3 className="text-sm font-medium hover:text-[#FF7262]">
              Áo sơ mi cotton may sẵn
            </h3>
            <p className="text-sm text-gray-500 font-bold">1 x $40.00</p>
            <p className="text-xs text-gray-500">Kích thước: M</p>
          </div>
          <button className="text-red-500 hover:text-red-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Subtotal */}
      <div className="flex justify-between items-center mt-4 pt-4 border-t">
        <span className="font-semibold">Tổng</span>
        <span className="font-semibold">$200.00</span>
      </div>

      {/* Buttons */}
      <button className="w-full bg-white text-black border border-gray-300 py-2 px-6 rounded mt-4 hover:bg-black hover:text-white">
        Xem giỏ hàng
      </button>
      <button className="w-full bg-black text-white py-2 px-6 rounded mt-2 hover:bg-white hover:text-black border border-gray-300">
        Thanh toán
      </button>
    </div>
  );
};

export default ShoppingCart;
