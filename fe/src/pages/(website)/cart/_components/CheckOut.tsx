import React, { useState } from "react";
import { useLocalStorage } from "@/components/hook/useStoratge";
import instanceClient from "@/configs/client";
import { useQuery } from "@tanstack/react-query";

const CheckOut = () => {
  const [user] = useLocalStorage("user" as any, {});
  const access_token = user.access_token || localStorage.getItem("access_token");

  const [selectedProducts, setSelectedProducts] = useState<number[]>([]); // Lưu trữ các sản phẩm được chọn

  const { data } = useQuery({
    queryKey: ["cart", access_token],
    queryFn: async () => {
      try {
        const response = await instanceClient.get(`/gio-hang`, {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });
        return response.data;
      } catch (error) {
        throw new Error("Error fetching cart data");
      }
    },
  });

  const handleCheckboxChange = (id: number) => {
    setSelectedProducts((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((productId) => productId !== id)
        : [...prevSelected, id]
    );
  };

  const grandTotal =
    data?.san_pham_giam_gia
      ?.filter((product: any) => selectedProducts.includes(product.id)) // Chỉ tính tổng cho sản phẩm đã chọn
      .reduce(
        (total: number, product: { gia_hien_tai: number; so_luong: number }) => {
          return total + product.gia_hien_tai * product.so_luong;
        },
        0
      ) || 0;

  return (
    <section className="container mx-auto">
      <div className="lg:mx-16 mx-4 lg:my-16 my-8">
        <h1 className="text-3xl font-bold mb-6">Giỏ hàng</h1>

        {/* Thông báo */}
        {/* <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <p className="font-bold text-green-600">
            Chúc mừng! Đơn hàng của bạn được{" "}
            <span className="text-green-700">Miễn phí vận chuyển</span>
          </p>
          <div className="bg-green-100 rounded-full h-2 mt-3">
            <div className="bg-green-500 h-full w-full"></div>
          </div>
        </div> */}

        {/* Khuyến mãi */}
        {/* <div className="flex items-center justify-between bg-red-100 text-red-600 px-6 py-4 rounded-lg mb-8">
          <span className="font-bold">
            🔥 Khuyến mại trong giỏ hàng của bạn chỉ còn trong 9 phút 59 giây
            trước khi hết khuyến mãi
          </span>
        </div> */}

        <div className="grid lg:grid-cols-12 gap-6 justify-center">
          {/* Sản phẩm */}
          <div className="lg:col-span-8 col-span-12">
            {/* Danh mục giảm giá */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h2 className="font-bold text-xl mb-4">Đang được giảm giá</h2>
              {data?.san_pham_giam_gia.map((product: any) => (
                <div
                  key={product.id}
                  className="flex justify-between items-center border-b py-4"
                >
                  <div className="flex items-center gap-6">
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(product.id)}
                      onChange={() => handleCheckboxChange(product.id)}
                      className="form-checkbox h-5 w-5 text-yellow-500"
                    />
                    <img
                      src={product.hinh_anh}
                      alt="Ảnh sản phẩm"
                      className="w-20 h-20 object-cover rounded-md"
                    />
                    <div>
                      <h3 className="font-semibold">{product.ten_san_pham}</h3>
                      <p className="text-sm text-gray-500">
                        {product.mau_sac}, {product.kich_thuoc}
                      </p>
                      <p className="text-red-500 font-bold">{product.gia_khuyen_mai} ₫</p>
                      <p className="text-gray-400 line-through">{product.gia_cu} ₫</p>
                      <p className="text-sm text-red-500">Đã tiết kiệm: {product.tiet_kiem} ₫</p>
                    </div>
                  </div>
                  <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                    <button className="px-4 py-2 text-gray-500 hover:text-black transition-colors">
                      −
                    </button>
                    <input
                      type="text"
                      value={product.so_luong}
                      className="w-12 text-center border-none outline-none"
                      readOnly
                    />
                    <button className="px-4 py-2 text-gray-500 hover:text-black transition-colors">
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Danh mục sản phẩm nguyên giá */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="font-bold text-xl mb-4">Sản phẩm nguyên giá</h2>
              {data?.san_pham_nguyen_gia.map((product: any) => (
                <div
                  key={product.id}
                  className="flex justify-between items-center border-b py-4"
                >
                  <div className="flex items-center gap-6">
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(product.id)}
                      onChange={() => handleCheckboxChange(product.id)}
                      className="form-checkbox h-5 w-5 text-yellow-500"
                    />
                    <img
                      src={product.hinh_anh}
                      alt="Ảnh sản phẩm"
                      className="w-20 h-20 object-cover rounded-md"
                    />
                    <div>
                      <h3 className="font-semibold">{product.ten_san_pham}</h3>
                      <p className="text-sm text-gray-500">
                        {product.mau_sac}, {product.kich_thuoc}
                      </p>
                      <p className="text-black font-bold">{product.gia_ban} ₫</p>
                    </div>
                  </div>
                  <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                    <button className="px-4 py-2 text-gray-500 hover:text-black transition-colors">
                      −
                    </button>
                    <input
                      type="text"
                      value={product.so_luong}
                      className="w-12 text-center border-none outline-none"
                      readOnly
                    />
                    <button className="px-4 py-2 text-gray-500 hover:text-black transition-colors">
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chi tiết đơn hàng */}
          <div className="lg:col-span-4 col-span-12">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="font-bold text-xl mb-4">Chi tiết đơn hàng</h2>
              <div className="flex justify-between mb-3">
                <span className="text-gray-600">Tổng giá trị sản phẩm</span>
                <span>{grandTotal} ₫</span>
              </div>
              <div className="flex justify-between mb-3">
                <span className="text-gray-600">Giảm giá</span>
                <span>-49.900 ₫</span>
              </div>
              <div className="flex justify-between mb-3">
                <span className="text-gray-600">Vận chuyển</span>
                <span>20.000 ₫</span>
              </div>
              <div className="flex justify-between mb-4">
                <span className="text-gray-600">Giảm giá vận chuyển</span>
                <span>−20.000 ₫</span>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between">
                  <span className="font-bold">Tổng cộng</span>
                  <span className="font-bold">{grandTotal} ₫</span>
                </div>
              </div>
            </div>
            <button className="w-full bg-yellow-500 text-white font-semibold py-2 rounded-lg mt-4">
              Tiến hành thanh toán
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CheckOut;
