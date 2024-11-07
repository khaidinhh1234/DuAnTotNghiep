import instanceClient from "@/configs/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import View from "../_component/View";
import { useState } from "react";
import { message } from "antd";

const ThankYouPage1 = () => {
  const queryParams = new URLSearchParams(window.location.search);
  const resultCode = parseInt(queryParams.get("resultCode") ?? "0", 10);

  const orderId = queryParams.get("orderId");
  const partnerCode = queryParams.get("partnerCode");
  const amount = parseInt(queryParams.get("amount") ?? "0", 10);
  const requestId = queryParams.get("requestId");
  const orderInfo = queryParams.get("orderInfo");
  const orderType = queryParams.get("orderType");
  const transId = queryParams.get("transId");
  const payType = queryParams.get("payType");
  const signature = queryParams.get("signature");
  const datas = {
    resultCode: resultCode,
    partnerCode: partnerCode,
    orderId: orderId,
    amount: amount,
    requestId: requestId,
    orderInfo: orderInfo,
    orderType: orderType,
    transId: transId,
    payType: payType,
    signature: signature,
  };
  console.log(datas);
  const { data } = useQuery({
    queryKey: ["checkbill"],
    queryFn: async () => {
      if (resultCode === 0) {
        const response = await instanceClient.post(`check-trang-thai`, {
          orderId: orderId,
          resultCode: resultCode,
        });
        const lichsu = await instanceClient.post(
          `luu-thanh-toan-vao-momo`,
          datas
        );
        toast.success("Đặt hàng thành công");
        return response.data;
      }
      if (resultCode !== 0) {
        const response = await instanceClient.post(`check-trang-thai`, {
          orderId: orderId,
          resultCode: resultCode,
        });
        toast.error("Đặt hàng thất bại");
        return response.data;
      }
    },
  });
  
  return (
    <div className="container">
      {/* Header Section */}
      <header className=" bg-gradient-to-r from-gray-900 via-gray-500 to-gray-900 text-white rounded-lg p-10 text-center mt-12  mx-auto shadow-2xl transform transition-all duration-500 ease-out hover:scale-105">
        <h2 className="text-3xl font-extrabold flex items-center justify-center mb-6 tracking-wide">
          {resultCode !== 0 ? (
            <div className="flex items-center justify-center">
              <span className="text-yellow-400 mr-3 animate-bounce">🔔</span>
              <p className="mt-5">Đặt hàng thất bại</p>
            </div>
          ) : resultCode === 1006 ? (
            <div className="flex items-center justify-center">
              <span className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-green-400 text-green-400 mr-3">
                ✔
              </span>
              <p className="mt-5">Thanh toán thất bại</p>
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <span className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-green-400 text-green-400 mr-3">
                ✔
              </span>
              <p className="mt-5">Đặt hàng thành công</p>
            </div>
          )}
        </h2>
        <p className="text-base mb-8 max-w-xl mx-auto leading-relaxed">
          Cùng Shopee bảo vệ quyền lợi của bạn - Thường xuyên kiểm tra tin nhắn
          từ Người bán tại Glow Chat / Chi nhắn & thanh toán khi đơn mua ở trạng
          thái "Đang giao hàng".
        </p>
        <div className="flex justify-center space-x-8">
          <Link to="/">
            <button className="bg-white text-gray-900 font-semibold py-3 px-8 rounded-xl shadow-md hover:shadow-lg transition-transform transform hover:-translate-y-1 active:scale-95 duration-300 ease-in-out">
              Trang chủ
            </button>
          </Link>
          <Link to={`/mypro/myorder/${orderId}`}>
            <button className="bg-white text-gray-900 font-semibold py-3 px-8 rounded-xl shadow-md hover:shadow-lg transition-transform transform hover:-translate-y-1 active:scale-95 duration-300 ease-in-out">
              Đơn mua
            </button>{" "}
          </Link>
        </div>
      </header>

      <section>
        {/* <!-- End Main --> */}
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-14 mt-12 mb-24">
            <div className="mx-auto">
              <i className="fa-regular fa-box text-3xl"></i>
              <h3 className="font-bold text-xl mt-3 mb-2">
                Miễn phí vận chuyển
              </h3>
              <p>Miễn phí vận chuyển cho đơn hàng trên $150</p>
            </div>
            <div className="mx-auto">
              <i className="fa-regular fa-circle-dollar text-3xl"></i>
              <h3 className="font-bold text-xl mt-3 mb-2">Đảm bảo hoàn tiền</h3>
              <p>Trong vòng 30 ngày để đổi hàng</p>
            </div>
            <div className="mx-auto">
              <i className="fa-regular fa-headphones text-3xl"></i>
              <h3 className="font-bold text-xl mt-3 mb-2">Hỗ trợ trực tuyến</h3>
              <p>24 giờ một ngày, 7 ngày một tuần</p>
            </div>
            <div className="mx-auto">
              <i className="fa-light fa-credit-card text-3xl"></i>
              <h3 className="font-bold text-xl mt-3 mb-2">
                Thanh toán linh hoạt
              </h3>
              <p>Thanh toán bằng nhiều thẻ tín dụng</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ThankYouPage1;
