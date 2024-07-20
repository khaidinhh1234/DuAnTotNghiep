import React from 'react';

const OrderPlaceSuccessfully = () => {
  return (
    <div className="bg-gray-100 flex items-center justify-center min-h-screen">
      <div
        className="fixed inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('../assets/images/lognin/04 Enter OTP.png')",
          filter: 'blur(8px)',
        }}
      ></div>
      <div className="fixed inset-0 bg-black opacity-50"></div>
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-4 sm:p-6 max-w-sm w-full text-center relative z-10">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="bg-[#A9A9A9] rounded-full p-4 ">
              <i className="fas fa-shopping-bag text-xl sm:text-2xl text-gray-800"></i>
            </div>
          </div>
          <h2 className="text-lg sm:text-xl font-bold mt-4 sm:mt-6 mb-2 sm:mb-3">
            Đơn hàng của bạn đã được xác nhận
          </h2>
          <p className="text-gray-600 text-sm sm:text-base mb-4 sm:mb-5">
            Cảm ơn bạn đã mua sắm! Đơn hàng của bạn chưa được giao, 
            nhưng chúng tôi sẽ gửi email cho bạn khi đơn hàng đã được gửi đi.
          </p>
          <button className="bg-gray-900 text-white w-full py-2 rounded-md mb-2 sm:mb-3 text-sm sm:text-base">
            Xem Đơn Hàng
          </button>
          <button className="border border-gray-300 text-gray-700 w-full py-2 rounded-md flex items-center justify-center text-sm sm:text-base">
            <i className="fas fa-arrow-left mr-1 sm:mr-2"></i>
            Trở về Trang Chủ
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderPlaceSuccessfully;
