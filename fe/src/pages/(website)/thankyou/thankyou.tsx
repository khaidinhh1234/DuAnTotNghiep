import instanceClient from "@/configs/client";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

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
  const { data } = useQuery({
    queryKey: ["checkbill"],
    queryFn: async () => {
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
    },
  });
  console.log(data);
  return (
    <div className="container">
      {/* Header Section */}
      <header className="bg-black text-white p-4 text-center mt-10">
        <h2 className="text-lg font-bold">
          {Number(resultCode) !== 0
            ? "🔔Đặt hàng thất bại"
            : "🔔Đặt hàng thành công"}
        </h2>
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
        {/* <div className="grid grid-cols-9 justify-center lg:gap-20 gap-14 mx-auto">
          {isError ? (
            <p className="text-red-500">Lỗi khi lấy thông tin sản phẩm</p>
          ) : products && products.length !== 0 ? (
            products?.map((product, index) => (
              <div
                className="xl:col-span-3 lg:col-span-4 col-span-12 md:col-span-6 lg:w-[300px] w-[350px] mx-auto lg:mx-0"
                key={index}
              >
                <div className="product-card hover:bg-zinc-100 rounded-md shadow-lg shadow-black/10">
                  <div className="relative lg:w-full w-[350px] lg:h-[385px] h-[400px]">
                    <a href="#">
                      <i className="z-10 fa-solid fa-arrow-right-arrow-left text-lg bg-white hover:bg-black hover:text-white w-11 h-11 flex items-center justify-center absolute top-[63px] right-6 btn invisible opacity-0 transition-opacity duration-300 rounded-full" />
                    </a>
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
                      {product?.mau_sac_va_anh?.map((item, indexs) => (
                        <button
                          key={indexs}
                          className="w-7 h-7 rounded-full border mr-1"
                          style={{ backgroundColor: item?.ma_mau_sac }}
                        />
                      ))}
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
        </div> */}
      </section>
    </div>
  );
};

export default ThankYouPage;
