import instanceClient from "@/configs/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import View from "../_component/View";
import { useState } from "react";
import { message } from "antd";

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
  const [hoveredProductId, setHoveredProductId] = useState<number | null>(null);
  const [hoveredVariantIndex, setHoveredVariantIndex] = useState<number | null>(
    null
  );
  const handleMouseEnter = (productId: number, variantIndex: any) => {
    setHoveredProductId(productId);
    setHoveredVariantIndex(variantIndex);
  };
  const queryclient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: async (id: any) => {
      try {
        const response = await instanceClient.post(`sanpham/yeuthich/${id}`);

        if (
          response.data.mess === "Sản phẩm đã được xóa khỏi danh sách yêu thích"
        ) {
          message.success("Xóa sản phẩm yêu thích thành công");
        }
        if (
          response.data.mess === "Sản phẩm đã được thêm vào danh sách yêu thích"
        ) {
          message.success("Thêm sản phẩm yêu thích thành công");
        }

        return response.data;
      } catch (error) {
        message.error("Xóa sản phẩm yêu thích thất bại");
        console.error("API error", error); // Thêm log lỗi API
        throw new Error("Xóa sản phẩm yêu thích thất bại");
      }
    },
    onSuccess: () => {
      queryclient.invalidateQueries({
        queryKey: ["suggestedProducts"],
      });
    },
  });
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

      {/* Spinner Section */}

      {/* Suggested Products Section */}
      <section className="mt-6 px-4">
        <h3 className="text-gray-700 font-bold my-5 text-3xl ">
          Có thể bạn cũng thích
        </h3>
        <div className="grid grid-cols-12 justify-center lg:gap-20 gap-14 mx-auto my-10">
          {isError ? (
            <p className="text-red-500">Lỗi khi lấy thông tin sản phẩm</p>
          ) : products && products.length !== 0 ? (
            products?.slice(0, 8).map((product: any, index: any) => (
              <div
                className="xl:col-span-3 lg:col-span-4 col-span-12 md:col-span-6 lg:w-[300px] w-[350px] mx-auto lg:mx-0"
                key={index}
              >
                <div className="product-card hover:bg-zinc-100 rounded-md shadow-lg shadow-black/10">
                  <div className="relative lg:w-full w-[350px] lg:h-[385px] h-[400px]">
                    {isPending ? (
                      <span>
                        <i className="z-10 fa-sharp-duotone fa-solid fa-loader fa-spin-pulse text-xl pt-1 bg-white hover:bg-black hover:text-white w-11 h-11 flex items-center justify-center absolute top-3 right-6 btn invisible opacity-0 transition-opacity duration-300 rounded-full" />
                      </span>
                    ) : (
                      <span onClick={() => mutate(product?.id)}>
                        <i
                          className={`${product?.trang_thai_yeu_thich ? "text-red-500" : "text-black hover:text-white"} z-10 fa-solid fa-heart text-xl pt-1 bg-white hover:bg-black  w-11 h-11 flex items-center justify-center absolute top-3 right-6 btn invisible opacity-0 transition-opacity duration-300 rounded-full`}
                        />
                      </span>
                    )}
                    <a href="#">
                      <i className="z-10 fa-solid fa-arrow-right-arrow-left text-lg bg-white hover:bg-black hover:text-white w-11 h-11 flex items-center justify-center absolute top-[63px] right-6 btn invisible opacity-0 transition-opacity duration-300 rounded-full" />
                    </a>{" "}
                    <Link to={`/product-detail/${product.duong_dan}`}>
                      <div className="relative">
                        <img
                          src={
                            hoveredProductId === product.id &&
                            hoveredVariantIndex !== null
                              ? product.mau_sac_va_anh[hoveredVariantIndex]
                                  .hinh_anh
                              : product.anh_san_pham
                          }
                          alt=""
                          className="lg:w-[300px] w-[500px] lg:h-[380px] h-[400px] rounded-t-md"
                        />
                        {product?.hang_moi == 1 && (
                          <span className="absolute top-3 left-4 bg-red-500 text-white px-3 py-[2px] rounded-md font-bold">
                            Mới
                          </span>
                        )}
                      </div>{" "}
                    </Link>
                    <View id={product?.duong_dan} ID={product?.id} />
                  </div>
                  <div className="bg-slate-50 pt-4 px-4 rounded-md pb-2">
                    <h5 className="text-base truncate w-60 font-medium">
                      {product?.ten_san_pham}
                    </h5>
                    <p className="font-semibold text-lg">
                      {product?.gia_thap_nhat === product?.gia_cao_nhat ? (
                        <>
                          {(product?.gia_cao_nhat ?? 0).toLocaleString("vi-VN")}{" "}
                          đ
                        </>
                      ) : (
                        <>
                          {(product?.gia_thap_nhat ?? 0).toLocaleString(
                            "vi-VN"
                          )}{" "}
                          đ
                          <i className="fa-solid fa-minus text-sm mx-1 text-slate-500"></i>
                          {(product?.gia_cao_nhat ?? 0).toLocaleString("vi-VN")}{" "}
                          đ
                        </>
                      )}
                    </p>
                    <p className="font-bold text-lg flex items-center">
                      {product?.mau_sac_va_anh?.map(
                        (item: any, indexs: any) => (
                          <button
                            key={indexs}
                            className={`w-7 h-7 rounded-full border mr-1 
                             ${
                               hoveredProductId === product?.id &&
                               hoveredVariantIndex === indexs
                                 ? "border-black"
                                 : "border-gray-300 hover:border-black"
                             }`}
                            style={{
                              backgroundColor: item?.ma_mau_sac,
                            }}
                            onMouseEnter={() =>
                              handleMouseEnter(product?.id, indexs)
                            }
                          />
                        )
                      )}
                    </p>
                  </div>
                </div>
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
    </div>
  );
};

export default ThankYouPage;
