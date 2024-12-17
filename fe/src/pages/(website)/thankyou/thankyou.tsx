import instanceClient from "@/configs/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import View from "../_component/View";
import { useState } from "react";
import { message } from "antd";
import Product from "../_component/Product";
import Method from "../_component/Method";

const ThankYouPage = () => {
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
  const orderid = orderId ? orderId.split("-")[0] : "";
  useQuery({
    queryKey: ["checkbill"],
    queryFn: async () => {
      if (resultCode === 0) {
        const response = await instanceClient.post(`check-trang-thai`, {
          orderId: orderId,
          resultCode: resultCode,
        });
        await instanceClient.post(`luu-thanh-toan-vao-momo`, datas);
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
  const [hoveredProductId, setHoveredProductId] = useState<number | null>(null);
  const [hoveredVariantIndex, setHoveredVariantIndex] = useState<number | null>(
    null
  );
  const handleMouseEnter = (productId: number, variantIndex: any) => {
    setHoveredProductId(productId);
    setHoveredVariantIndex(variantIndex);
  };
  // const queryclient = useQueryClient();
  // const { mutate, isPending } = useMutation({
  //   mutationFn: async (id: any) => {
  //     try {
  //       const response = await instanceClient.post(`sanpham/yeuthich/${id}`);

  //       if (
  //         response.data.mess === "Sản phẩm đã được xóa khỏi danh sách yêu thích"
  //       ) {
  //         message.success("Xóa sản phẩm yêu thích thành công");
  //       }
  //       if (
  //         response.data.mess === "Sản phẩm đã được thêm vào danh sách yêu thích"
  //       ) {
  //         message.success("Thêm sản phẩm yêu thích thành công");
  //       }

  //       return response.data;
  //     } catch (error) {
  //       message.error("Xóa sản phẩm yêu thích thất bại");
  //       // console.error("API error", error); // Thêm log lỗi API
  //       throw new Error("Xóa sản phẩm yêu thích thất bại");
  //     }
  //   },
  //   onSuccess: () => {
  //     queryclient.invalidateQueries({
  //       queryKey: ["suggestedProducts"],
  //     });
  //   },
  // });
  // console.log(data);
  const { data: sanpham, isError } = useQuery({
    queryKey: ["suggestedProducts"],
    queryFn: async () => {
      const response = await instanceClient.get("lay-tat-ca-san-pham");
      return response.data;
    },
  });
  const products = sanpham?.data;
  return (
    <div className="container">
      {/* Header Section */}
      <header className=" bg-gradient-to-r from-gray-900 via-gray-500 to-gray-900 text-white rounded-lg p-10 text-center mt-12  mx-auto shadow-2xl transform transition-all duration-500 ease-out hover:scale-105">
        <h2 className="text-3xl font-extrabold flex items-center justify-center mb-6 tracking-wide">
          {resultCode == 0 ? (
            <div className="flex items-center justify-center">
              <span className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-green-400 text-green-400 mr-3">
                ✔
              </span>
              <p className="mt-5">Đặt hàng thành công</p>
            </div>
          ) : resultCode === 1006 ? (
            <div className="flex items-center justify-center">
              <span className="text-yellow-400 mr-3 animate-bounce">🔔</span>
              <p className="mt-5">Thanh toán thất bại</p>
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <span className="text-yellow-400 mr-3 animate-bounce">🔔</span>
              <p className="mt-5">Đặt hàng thất bại</p>
            </div>
          )}
        </h2>
        <p className="text-base mb-8 max-w-xl mx-auto leading-relaxed">
          Cùng GlowClowthingGlowClowthing bảo vệ quyền lợi của bạn - Thường xuyên kiểm tra tin nhắn
          từ Người bán tại Glow Chat / Chi nhắn & thanh toán khi đơn mua ở trạng
          thái "Đang giao hàng".
        </p>
        <div className="flex justify-center space-x-8">
          <Link to="/">
            <button className="bg-white text-gray-900 font-semibold py-3 px-8 rounded-xl shadow-md hover:shadow-lg transition-transform transform hover:-translate-y-1 active:scale-95 duration-300 ease-in-out">
              Trang chủ
            </button>
          </Link>
          <Link to={`/mypro/myorder/${orderid}`}>
            <button className="bg-white text-gray-900 font-semibold py-3 px-8 rounded-xl shadow-md hover:shadow-lg transition-transform transform hover:-translate-y-1 active:scale-95 duration-300 ease-in-out">
              Đơn mua
            </button>{" "}
          </Link>
        </div>
      </header>

      {/* Spinner Section */}

      {/* Suggested Products Section */}
      <section className="mt-6 ">
        <h3 className="text-gray-700 font-bold my-5 text-3xl ">
          Có thể bạn cũng thích
        </h3>
        <div className="grid grid-cols-12 justify-center lg:gap-5 gap-14 mx-auto my-10">
          {isError ? (
            <p className="text-red-500">Lỗi khi lấy thông tin sản phẩm</p>
          ) : products && products.length !== 0 ? (
            products?.slice(0, 8).map((product: any, index: any) => (
              <div
                className="xl:col-span-3 lg:col-span-4 col-span-12 md:col-span-6 lg:w-[290px] w-[350px] mx-auto lg:mx-0"
                key={index}
              >
                <Product
                  product={product}
                  handleMouseEnter={handleMouseEnter}
                  hoveredProductId={hoveredProductId}
                  hoveredVariantIndex={hoveredVariantIndex}
                  index={index}
                />
              </div>
            ))
          ) : (
            <div className="w-full flex flex-col items-center justify-center col-span-12">
              <img
                src="https://res.cloudinary.com/dcvu7e7ps/image/upload/v1729832531/m5xu2paczoiy6rmlu4vm.png"
                alt="No products"
                className="w-[500px] mb-4"
              />
              <span className="text-center font-bold text-2xl text-yellow-500">
                Không có sản phẩm nào
              </span>
            </div>
          )}
        </div>
      </section>
      <Method />
    </div>
  );
};

export default ThankYouPage;
