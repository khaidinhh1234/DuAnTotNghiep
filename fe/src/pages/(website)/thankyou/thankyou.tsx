import React from "react";

const ThankYouPage = () => {
  return (
    <div className="container">
      {/* Header Section */}
      <header className="bg-black text-white p-4 text-center mt-10">
        <h2 className="text-lg font-bold">🔔Đặt hàng thành công</h2>
        <p className="text-sm mt-2">
          Cùng Shopee bảo vệ quyền lợi của bạn - Thường xuyên kiểm tra tin nhắn
          từ Người bán tại Glow Chat / Chi nhắn &amp; thanh toán khi đơn mua ở
          trạng thái "Đang giao hàng".
        </p>
        <div className="mt-4 flex justify-center space-x-4">
          <button className="bg-opacity-20 bg-white  text-white font-bold py-2 px-10 rounded border hover:bg-opacity-100 hover:text-black">
            Trang chủ
          </button>
          <button className="bg-opacity-20 bg-white  text-white font-bold py-2 px-10 rounded border hover:bg-opacity-100 hover:text-black">
            Đơn mua
          </button>
        </div>
      </header>
      {/* Spinner Section */}

      {/* Suggested Products Section */}
      <section className="mt-6 px-4">
        <h3 className="text-gray-700 font-bold mb-4">Có thể bạn cũng thích</h3>
        <div className="grid grid-cols-2 gap-4">
          {/* Product Card */}
          <div className="bg-white p-4 rounded shadow">
            <img
              src="https://via.placeholder.com/100"
              alt="Product 1"
              className="w-full rounded"
            />
            <div className="mt-2">
              <p className="text-red-500 text-xs font-bold">Yêu thích</p>
              <p className="text-gray-700 font-bold mt-1">50% GIẢM</p>
            </div>
          </div>
          {/* Product Card */}
          <div className="bg-white p-4 rounded shadow">
            <img
              src="https://via.placeholder.com/100"
              alt="Product 2"
              className="w-full rounded"
            />
            <div className="mt-2">
              <p className="text-red-500 text-xs font-bold">Yêu thích</p>
              <p className="text-gray-700 font-bold mt-1">38% GIẢM</p>
            </div>
          </div>
          {/* More products if needed */}
        </div>
      </section>
    </div>
  );
};

export default ThankYouPage;
