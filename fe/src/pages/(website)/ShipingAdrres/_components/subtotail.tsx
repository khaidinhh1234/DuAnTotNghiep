import { useLocalStorage } from "@/components/hook/useStoratge";
import instanceClient from "@/configs/client";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Subtotal = () => {
  const nav = useNavigate()
  const [user] = useLocalStorage("user" as any, {});
  const access_token =
    user.access_token || localStorage.getItem("access_token");
  const [selectedProducts, setSelectedProducts] = useState<string[]>(() => {
    const savedSelectedProducts = localStorage.getItem("selectedProducts");
    return savedSelectedProducts ? JSON.parse(savedSelectedProducts) : [];
  });

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
  // Tính tổng tiền

  const totalSelectedPrice = selectedProducts.reduce((total, productId) => {
    const productInDiscounts = data?.san_pham_giam_gia.find(
      (product: any) => product.id === productId
    );
    const productInRegular = data?.san_pham_nguyen_gia.find(
      (product: { id: number }) => product.id === Number(productId)
    );
    const quantity =
      productInDiscounts?.so_luong || productInRegular?.so_luong || 0;
    console.log("đâsd", quantity);
    if (productInDiscounts) {
      return total + productInDiscounts.gia_hien_tai * quantity;
    }

    if (productInRegular) {
      return total + productInRegular.gia_hien_tai * quantity;
    }

    return total;
  }, 0);
  console.log(totalSelectedPrice);
  // Tính tổng tiền cuối cùng (bao gồm phí giao hàng)
  const shippingFee = totalSelectedPrice > 500000 ? 0 : 20000;
  const finalTotal = totalSelectedPrice + shippingFee;
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };


  const handleCheckout = () => {
    if (!data?.san_pham_giam_gia.length && !data?.san_pham_nguyen_gia.length) {
      toast.error("Giỏ hàng của bạn đang trống. Vui lòng thêm sản phẩm vào giỏ hàng trước khi thanh toán.");
      return;
    }

    // Kiểm tra xem có sản phẩm nào được chọn hay không
    if (!selectedProducts.length) {
      toast.error("Vui lòng chọn ít nhất một sản phẩm để thanh toán.");
      return;
    }

    // Tính toán chi tiết giỏ hàng
    const cartDetails = selectedProducts.map((productId) => {
      const productInDiscounts = data?.san_pham_giam_gia.find((product: any) => product.id === productId);
      const productInRegular = data?.san_pham_nguyen_gia.find((product: { id: number }) => product.id === Number(productId));
      const product = productInDiscounts || productInRegular;

      // Nếu sản phẩm không tồn tại trong cả hai danh sách
      if (!product) {
        return {
          id: productId,
          name: "Sản phẩm không tồn tại",
          quantity: 0,
          price: 0,
          total: 0,
          kich_thuoc: "",
          mau_sac: "",
          hinh_anh: ""
        };
      }

      const quantity = product?.so_luong || 1;
      const price = product?.gia_hien_tai || 0;

      return {
        id: productId,
        name: product?.ten_san_pham || "Sản phẩm không xác định",
        quantity,
        price,
        total: price * quantity,
        kich_thuoc: product?.kich_thuoc || "Kích thước không xác định",
        mau_sac: product?.mau_sac || "Màu sắc không xác định",
        hinh_anh: product?.hinh_anh || "Hình ảnh không sác định"
      };
    });

    // Tính tổng giá trị giỏ hàng
    const cartTotal = {
      totalSelectedPrice: totalSelectedPrice,
      shippingFee: finalTotal > 0 ? shippingFee : 0,
      discount: finalTotal > 0 ? shippingFee : 0,
      finalTotal: finalTotal,
      details: cartDetails,
    };

    // Lưu cartTotal vào localStorage
    localStorage.setItem("cartTotal", JSON.stringify(cartTotal));

    nav("/shippingAddressPage");
  };

  return (
    <div className="lg:col-span-4 col-span-6">
      <div className="border px-4 py-1 lg:w-[359px] rounded-md">
        <h1 className="text-xl font-bold mt-4">Chi tiết đơn hàng</h1>
        <div className="flex justify-between font-bold border-hrBlack border-b ">
          <h4>Tổng giá trị sản phẩm</h4>
          <span className="px-2">
            {totalSelectedPrice.toLocaleString("vn-VN")} ₫
          </span>
        </div>
        <div className="py-4">
          <label className="text-xs">Nhập mã giảm giá</label>
          <br />
          <div className="flex">
            <input
              type="text"
              placeholder="FLAT50"
              className="lg:w-[218px] w-[300px] h-[56px] px-4 rounded-s-lg focus:outline-none border border-l-2 border-t-2 border-blackL border-r-0"
            />
            <button className="bg-black hover:bg-stone-700 w-[101px] h-[55px] border border-black rounded-r-lg text-white">
              Áp dụng
            </button>
          </div>
          <div className="py-4">
            {data?.san_pham_giam_gia.map((product: any) => (
              <div key={product.id} className=" flex justify-between font-medium border-hrBlack">
                <p>Tiết kiệm</p>
                <span className="px-2 text-red-500">
                  {product.tiet_kiem} ₫
                </span>
              </div>
            ))}
            <div className="flex justify-between font-medium mb-0 border-hrBlack">
              <p>Phí giao hàng</p>
              <span className="px-2">
                {formatCurrency(20000)}
              </span>
            </div>
            {totalSelectedPrice > 500000 && (
              <div className="flex justify-between font-medium border-b border-hrBlack">
                <p>Giảm giá vận chuyển</p>
                <span className="px-2 text-red-500">
                  - {formatCurrency(20000)}
                </span>
              </div>
            )}
          </div>
          <div className="flex justify-between font-bold ">
            <h4>Tổng cộng</h4>
            <span>{formatCurrency(finalTotal)}</span>
          </div>
        </div>
        <div className="flex justify-end text-red-500 mb-8">
          <span>Bạn đã tiết kiệm được 469.100 đ</span>
        </div>
        <a href="/payment">
          <button
            type="submit"
            className=" block btn-black px-10 w-[320px] my-4 mx-auto py-4 rounded-lg text-md font-medium"
          >
            Thanh toán đơn hàng ({data?.tong_so_luong})
          </button>
        </a>
      </div>
    </div>
  )
}
export default Subtotal;
