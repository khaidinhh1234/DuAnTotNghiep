import { useLocalStorage } from "@/components/hook/useStoratge";
import instanceClient from "@/configs/client";
import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Button, Popconfirm } from "antd";
import { FastForward, Star } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const CheckOut = () => {
  const nav = useNavigate();
  const queryClient = useQueryClient();
  const [user] = useLocalStorage("user" as any, {});
  const access_token =
    user.access_token || localStorage.getItem("access_token");
  const [selectedProducts, setSelectedProducts] = useState<string[]>(() => {
    const savedSelectedProducts = localStorage.getItem("selectedProducts");
    return savedSelectedProducts ? JSON.parse(savedSelectedProducts) : [];
  });
  const [fadeEffect, setFadeEffect] = useState<{ [key: string]: boolean }>({});
  const [isProcessing, setIsProcessing] = useState<Record<string, boolean>>({});
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
  console.log("data", data);
  const { mutate: increaseQuantity } = useMutation({
    mutationFn: async ({
      productId,
      currentQuantity,
    }: {
      productId: string;
      currentQuantity: number;
    }) => {
      setIsProcessing((prev) => ({ ...prev, [productId]: true })); // Khóa hành động
      await instanceClient.put(
        `/gio-hang/tang-so-luong/${productId}`,
        { so_luong: currentQuantity + 1 },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
    },
    onSuccess: (_, { productId }) => {
      setFadeEffect((prev) => ({ ...prev, [productId]: true }));
      setTimeout(() => {
        setFadeEffect((prev) => ({ ...prev, [productId]: false }));
        setIsProcessing((prev) => ({ ...prev, [productId]: false }));
      }, 500);

      queryClient.invalidateQueries({ queryKey: ["cart", access_token] });
    },
    onError: (_, { productId }) => {
      setIsProcessing((prev) => ({ ...prev, [productId]: false }));
      toast.error("Error: " + JSON.stringify);
    },
  });

  const { mutate: decreaseQuantity } = useMutation({
    mutationFn: async ({
      productId,
      currentQuantity,
    }: {
      productId: string;
      currentQuantity: number;
    }) => {
      setIsProcessing((prev) => ({ ...prev, [productId]: true }));
      await instanceClient.put(
        `/gio-hang/giam-so-luong/${productId}`,
        { so_luong: currentQuantity - 1 },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
    },
    onSuccess: (_, { productId }) => {
      setFadeEffect((prev) => ({ ...prev, [productId]: true }));
      setTimeout(() => {
        setFadeEffect((prev) => ({ ...prev, [productId]: false }));
        setIsProcessing((prev) => ({ ...prev, [productId]: false }));
      }, 500);

      queryClient.invalidateQueries({ queryKey: ["cart", access_token] });
    },
    onError: (_, { productId }) => {
      setIsProcessing((prev) => ({ ...prev, [productId]: false }));
      toast.error("Có lỗi xảy ra khi giảm số lượng.");
    },
  });

  const { mutate: Delete } = useMutation({
    mutationFn: async (productId: string) => {
      await instanceClient.delete(`/gio-hang/${productId}`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart", access_token] });
      toast.success("Xóa sản phẩm thành công.");
    },
    onError: (error: any) => {
      toast.error(error.message || "Có lỗi xảy ra khi xóa sản phẩm.");
    },
  });
  // tiet kiem
  const totalSavings = useMemo(() => {
    return data?.san_pham_giam_gia
      .filter((product: any) => selectedProducts.includes(product.id))
      .reduce((sum: number, product: any) => sum + product.tiet_kiem, 0);
  }, [data, selectedProducts]);
  // tong sanpham
  const tongSoLuong = useMemo(() => {
    return (
      data?.san_pham_giam_gia
        .filter((product: any) => selectedProducts.includes(product.id))
        .reduce((sum: number, product: any) => sum + product.so_luong, 0) +
      data?.san_pham_nguyen_gia
        .filter((product: any) => selectedProducts.includes(product.id))
        .reduce((sum: number, product: any) => sum + product.so_luong, 0)
    );
  }, [data, selectedProducts]);

  // Tính tổng tiền
  const totalSelectedPrice = selectedProducts.reduce((total, productId) => {
    const productInDiscounts = data?.san_pham_giam_gia.find(
      (product: any) => product.id === productId
    );
    const productInRegular = data?.san_pham_nguyen_gia.find(
      (product: { id: number }) => product.id === Number(productId)
    );

    // Đặt mặc định là 1 nếu không tìm thấy số lượng
    const quantity =
      productInDiscounts?.so_luong || productInRegular?.so_luong || 1;

    if (productInDiscounts) {
      return total + productInDiscounts.gia_hien_tai * quantity;
    }

    if (productInRegular) {
      return total + productInRegular.gia_hien_tai * quantity;
    }

    return total; // Nếu không có sản phẩm nào, trả về tổng không thay đổi
  }, 0);
  // Tính tổng tiền cuối cùng (bao gồm phí giao hàng)
  const shippingFee = totalSelectedPrice > 498000 ? 0 : 20000;
  const finalTotal = totalSelectedPrice + shippingFee;
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const handleCheckout = () => {
    if (
      !data?.san_pham_giam_gia.length &&
      !data?.san_pham_nguyen_gia.length &&
      !data?.san_pham_het_hang.length
    ) {
      toast.error(
        "Giỏ hàng của bạn đang trống. Vui lòng thêm sản phẩm vào giỏ hàng trước khi thanh toán."
      );
      return;
    }
    // Kiểm tra xem có sản phẩm nào được chọn hay không
    if (!selectedProducts.length) {
      toast.error("Vui lòng chọn ít nhất một sản phẩm để thanh toán.");
      return;
    }
    nav("/shippingAddressPage");
  };
  const handleRemoveProduct = (productId: string) => {
    Delete(productId);
  };

  // Xử lý khi chọn tất cả
  const handleSelectAll = (isChecked: boolean) => {
    if (isChecked) {
      const allProductIds = [
        ...data?.san_pham_giam_gia.map((product: any) => product.id),
        ...data?.san_pham_nguyen_gia.map((product: any) => product.id),
      ];
      setSelectedProducts(allProductIds);
      localStorage.setItem("selectedProducts", JSON.stringify(allProductIds));
      // Gọi SelectedProduct với tất cả ID
      SelectedProduct({ gioHangIds: allProductIds, isChecked: true });
    } else {
      const allProductIds = [
        ...data?.san_pham_giam_gia.map((product: any) => product.id),
        ...data?.san_pham_nguyen_gia.map((product: any) => product.id),
      ];
      setSelectedProducts([]); // Cập nhật trạng thái không chọn
      localStorage.setItem("selectedProducts", JSON.stringify([]));
      // Gọi SelectedProduct với tất cả ID và trạng thái không chọn
      SelectedProduct({ gioHangIds: allProductIds, isChecked: false });
    }
  };

  // chọn sản phẩm
  const { mutate: SelectedProduct } = useMutation({
    mutationFn: async ({
      gioHangIds,
      isChecked,
    }: {
      gioHangIds: string[];
      isChecked: boolean;
    }) => {
      try {
        await instanceClient.post(
          `/gio-hang/chon-san-pham`,
          { gio_hang_ids: gioHangIds, chon: isChecked ? 1 : 0 },
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          }
        );
      } catch (error) {}
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart", access_token] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Có lỗi xảy ra khi chọn sản phẩm.");
    },
  });

  const handleSelectProduct = (productId: string) => {
    const isChecked = selectedProducts.includes(productId);
    // Cập nhật trạng thái selectedProducts
    const updatedSelectedProducts = isChecked
      ? selectedProducts.filter((id) => id !== productId) // Bỏ chọn sản phẩm
      : [...selectedProducts, productId]; // Chọn sản phẩm
    setSelectedProducts(updatedSelectedProducts);
    console.log("check:", isChecked);
    // Gọi SelectedProduct với danh sách mới và trạng thái đã chọn ngược lại
    SelectedProduct({ gioHangIds: [productId], isChecked: !isChecked });
    localStorage.setItem(
      "selectedProducts",
      JSON.stringify(updatedSelectedProducts)
    );
  };
  useEffect(() => {
    // Retrieve saved selection from localStorage on component mount
    const savedSelectedProducts = localStorage.getItem("selectedProducts");
    if (savedSelectedProducts) {
      setSelectedProducts(JSON.parse(savedSelectedProducts));
    }
  }, []);

  // Tải sản phẩm từ localStorage khi component khởi tạo
  useEffect(() => {
    const storedProducts = localStorage.getItem("selectedProducts");
    if (storedProducts) {
      setSelectedProducts(JSON.parse(storedProducts));
    }
  }, []);

  // Lưu sản phẩm vào localStorage khi có sự thay đổi
  useEffect(() => {
    localStorage.setItem("selectedProducts", JSON.stringify(selectedProducts));
  }, [selectedProducts]);
  //
  useEffect(() => {
    if (data) {
      const preSelectedProducts = [
        ...(data.san_pham_giam_gia?.filter((p: any) => p.chon === 1) || []).map(
          (p: any) => p.id
        ),
        ...(
          data.san_pham_nguyen_gia?.filter((p: any) => p.chon === 1) || []
        ).map((p: any) => p.id),
      ];

      if (preSelectedProducts.length > 0) {
        setSelectedProducts((prev) =>
          Array.from(new Set([...prev, ...preSelectedProducts]))
        );
      }
    }
  }, [data]);
  // nhập ôố lượng
  const [quantity, setQuantity] = useState<number>(1);
  const { mutate: updateQuantity } = useMutation({
    mutationFn: async ({
      productId,
      newQuantity,
    }: {
      productId: string;
      newQuantity: number;
    }) => {
      try {
        const response = await instanceClient.put(
          `/gio-hang/update/${productId}`,
          {
            so_luong: newQuantity,
          }
        );
        return response.data;
      } catch (error) {
        // throw error.response?.data?.message || "Đã có lỗi xảy ra!";
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["cart", access_token] });
      // toast.success(data.message);
    },
    onError: (error) => {
      toast.error("Số lượng trong kho đã hết");
    },
  });

  const handleChangeQuantity = (event: any, product: any) => {
    const newQuantity = Number(event.target.value);

    if (newQuantity < 1 || newQuantity > product.so_luong_bien_the) {
      toast.error("Số lượng không hợp lệ!");
      return;
    }

    setQuantity(newQuantity);

    setIsProcessing((prev) => ({ ...prev, [product.id]: true }));
    updateQuantity(
      { productId: product.id, newQuantity },
      {
        onSettled: () => {
          setIsProcessing((prev) => ({ ...prev, [product.id]: false }));
        },
      }
    );
  };
  return (
    <>
      {data?.san_pham_giam_gia?.length === 0 &&
      data?.san_pham_nguyen_gia?.length === 0 &&
      data?.san_pham_het_hang?.length === 0 ? (
        <div className="flex flex-col items-center justify-center pt-32 pb-20">
          <img
            src="https://m.yodycdn.com/web/prod/_next/static/media/cart-empty.250eba9c.svg"
            alt="No products"
            className="w-[600px] h-[200px] md:w-[500px] md:h-[400px] object-cover"
          />
          <Link
            to="/shop/nam"
            className="px-20 py-4 mt-4 btn-black rounded-lg mb-4 w-[320px] h-[56px] font-semibold transition duration-200"
          >
            Quay lại cửa hàng
          </Link>
        </div>
      ) : (
        <section className="container">
          <div className="lg:mx-12 mx-4 lg:my-[84px] my-[42px]">
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold mb-6">
              Giỏ hàng
            </h1>
            <div className="grid lg:grid-cols-12 gap-4 justify-center">
              <div className="lg:col-span-8 col-span-12 px-3 md:px-6">
                <div className="bg-white shadow-md rounded-lg p-4 md:p-6 mb-8 w-full max-w-full">
                  <p className="font-bold text-black">
                    {totalSelectedPrice >= 500000 ? (
                      <>
                        Chúc mừng! Đơn hàng của bạn được{" "}
                        <span className="text-black">Miễn phí vận chuyển</span>
                      </>
                    ) : (
                      <>
                        Thêm{" "}
                        <span className="text-red-500">
                          {formatCurrency(500000 - totalSelectedPrice)}
                        </span>{" "}
                        để được{" "}
                        <span className="text-black">Miễn phí vận chuyển</span>
                      </>
                    )}
                  </p>

                  {/* Progress bar */}
                  <div className="relative bg-gray-100 rounded-full h-2 mt-3">
                    <div
                      className={`h-full ${
                        totalSelectedPrice >= 500000
                          ? "bg-green-500"
                          : "bg-yellow-400"
                      }`}
                      style={{
                        width: `${Math.min(
                          (totalSelectedPrice / 500000) * 100,
                          100
                        )}%`,
                      }}
                    >
                      <div
                        className="absolute top-0 flex items-center justify-center"
                        style={{
                          left: `${Math.min(
                            (totalSelectedPrice / 500000) * 100,
                            100
                          )}%`,
                          transform: "translate(-50%, -50%)",
                          zIndex: 10,
                        }}
                      >
                        <div
                          className={`w-6 h-6 md:w-8 md:h-8 rounded-full ${
                            totalSelectedPrice >= 500000
                              ? "bg-green-200"
                              : "bg-yellow-200"
                          } flex items-center justify-center`}
                        >
                          <Star
                            className={`text-${
                              totalSelectedPrice >= 500000 ? "green" : "yellow"
                            }-500`}
                            size={14}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <table className="min-w-full  ">
                  <thead>
                    <tr className="text-left border-b border-gray-200">
                      <th className="px-4 py-2">
                        <input
                          type="checkbox"
                          checked={[
                            ...(data?.san_pham_giam_gia ?? []),
                            ...(data?.san_pham_nguyen_gia ?? []),
                          ].every((product) => product.chon === 1)}
                          className="w-5 h-5 text-indigo-600 bg-white border-gray-300 rounded focus:ring-indigo-500 focus:ring-2 cursor-pointer"
                          onChange={(e) => handleSelectAll(e.target.checked)}
                          title="Select all products"
                        />
                      </th>

                      <th className="font-semibold text-gray-700 px-4 py-2">
                        Sản phẩm
                      </th>
                      <th className="lg:text-center hidden lg:table-cell font-semibold text-gray-700 px-4 py-2">
                        Số lượng
                      </th>
                      <th className="font-semibold text-gray-700 px-4 py-2">
                        Tổng tiền
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <>
                      {/* Sản phẩm giảm giá */}
                      {data?.san_pham_giam_gia?.map((product: any) => (
                        <tr
                          key={product.id}
                          className={`p-4  rounded-md ${fadeEffect[product.id] ? "opacity-50 transition-opacity duration-300" : ""}`}
                        >
                          <td className="px-4 py-2">
                            <input
                              type="checkbox"
                              className="w-5 h-5 text-indigo-600 bg-white border-gray-300 rounded focus:ring-indigo-500 focus:ring-2 cursor-pointer"
                              checked={
                                product.chon === 1 ||
                                selectedProducts.includes(product.id)
                              }
                              onChange={() => handleSelectProduct(product.id)}
                              title="Select discount product"
                            />
                          </td>
                          {/* Thông tin sản phẩm */}
                          <td className="px-4 py-2">
                            <div className="flex items-start gap-4">
                              <img
                                src={product.hinh_anh}
                                alt={product.ten_san_pham}
                                className="w-32 h-40 object-cover rounded-md"
                              />
                              <div>
                                <h3 className="font-semibold text-gray-700">
                                  {product.ten_san_pham}
                                </h3>
                                <p className="text-gray-500">
                                  {product.mau_sac}, {product.kich_thuoc}
                                </p>
                                <div className="flex items-center">
                                  <p className="text-red-500 font-bold mr-2">
                                    {product.gia_hien_tai.toLocaleString()} ₫
                                  </p>
                                  <p className="text-gray-400 line-through">
                                    {product.gia_cu.toLocaleString()} ₫
                                  </p>
                                </div>
                                <p
                                  className="text-xs text-red-500 relative inline-block font-semibold tracking-wide"
                                  style={{
                                    padding: "2px 10px",
                                    border: "2px solid red",
                                    clipPath: "inset(0 10px)",
                                    borderRadius: "16px",
                                  }}
                                >
                                  Đã tiết kiệm{" "}
                                  {product.tiet_kiem.toLocaleString()} ₫
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="hidden lg:table-cell px-4 py-2 text-center align-middle">
                            <div className="flex items-center justify-center border rounded-lg mx-auto w-fit">
                              {product.so_luong === 1 ? (
                                <Popconfirm
                                  title="Bạn có muốn xóa sản phẩm này khỏi giỏ hàng không?"
                                  onConfirm={() =>
                                    handleRemoveProduct(product.id)
                                  }
                                  okText="Có"
                                  cancelText="Không"
                                >
                                  <button
                                    className="py-1 px-3 rounded-l-lg"
                                    title="Decrease quantity"
                                  >
                                    <i className="fa-solid fa-minus" />
                                  </button>
                                </Popconfirm>
                              ) : (
                                <button
                                  onClick={() => {
                                    if (!isProcessing[product.id]) {
                                      decreaseQuantity({
                                        productId: product.id,
                                        currentQuantity: product.quantity,
                                      });
                                    }
                                  }}
                                  className="py-1 px-3 rounded-l-lg"
                                  title="Decrease quantity"
                                  disabled={
                                    isProcessing[product.id] ||
                                    product.quantity <= 1 ||
                                    fadeEffect[product.id]
                                  }
                                >
                                  <i className="fa-solid fa-minus" />
                                </button>
                              )}
                              <input
                                type="number"
                                value={product.so_luong}
                                onChange={(event) =>
                                  handleChangeQuantity(event, product)
                                }
                                placeholder="Quantity"
                                min="1"
                                max={product.so_luong_bien_the}
                                title="Product Quantity"
                                disabled={isProcessing[product.id]}
                                className="xl:w-10 xl:h-10 lg:w-5 lg:h-5 md:w-10 md:h-10  w-5 h-5 border-0 focus:ring-0 focus:outline-none text-center text-lg font-semibold appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                              />
                              <button
                                onClick={() => {
                                  // Kiểm tra nếu số lượng sản phẩm hiện tại đã đạt đến số lượng tối đa của biến thể
                                  if (
                                    product.so_luong >=
                                    product.so_luong_bien_the
                                  ) {
                                    toast.error(
                                      "Sản phẩm đã đạt đến số lượng tồn kho tối đa."
                                    );
                                    return; // Dừng lại nếu đạt giới hạn
                                  }

                                  // Gọi hàm tăng số lượng nếu còn tồn kho
                                  if (!isProcessing[product.id]) {
                                    increaseQuantity({
                                      productId: product.id,
                                      currentQuantity: product.so_luong,
                                    });
                                  }
                                }}
                                className="py-1 px-3 rounded-r-lg"
                                title="Increase quantity"
                                disabled={
                                  product.so_luong >=
                                    product.so_luong_bien_the ||
                                  fadeEffect[product.id] ||
                                  isProcessing[product.id]
                                } // Vô hiệu hóa nút nếu đạt giới hạn
                              >
                                <i className="fa-solid fa-plus" />
                              </button>
                            </div>
                          </td>

                          <td className="px-4 py-2">
                            {formatCurrency(
                              product.gia_hien_tai * product.so_luong
                            )}
                          </td>
                          <td className="px-4 py-2">
                            <button
                              onClick={() => Delete(product.id)}
                              className="text-red-600 hover:text-red-800"
                              title="Remove product"
                            >
                              <i className="fa-regular fa-trash-can" />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {/* End sản phẩm giảm giá */}
                      {/* Sản phẩm nguyên giá */}
                      {data?.san_pham_nguyen_gia?.map((product: any) => (
                        <tr
                          key={product.id}
                          className="border-b border-gray-200 hover:bg-gray-100"
                        >
                          <td className="px-4 py-2">
                            <input
                              type="checkbox"
                              className="w-5 h-5 text-indigo-600 bg-white border-gray-300 rounded focus:ring-indigo-500 focus:ring-2 cursor-pointer"
                              checked={
                                product.chon === 1 ||
                                selectedProducts.includes(product.id)
                              }
                              onChange={() => handleSelectProduct(product.id)}
                              title="Select regular price product"
                            />
                          </td>
                          {/* Thông tin sản phẩm */}
                          <td className="px-4 py-2">
                            <div className="flex items-start gap-4">
                              <img
                                src={product.hinh_anh}
                                alt={product.ten_san_pham}
                                className="w-32 h-40 object-cover rounded-md"
                              />
                              <div>
                                <h3 className="font-semibold text-gray-700">
                                  {product.ten_san_pham}
                                </h3>
                                <p className="text-gray-500">
                                  {product.mau_sac}, {product.kich_thuoc}
                                </p>
                                <p className="text-gray-700 font-semibold mt-1">
                                  {formatCurrency(product.gia_hien_tai)}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="hidden lg:table-cell px-4 py-2 text-center align-middle">
                            <div className="flex items-center justify-center border rounded-lg mx-auto w-fit">
                              {product.so_luong === 1 ? (
                                <Popconfirm
                                  title="Bạn có muốn xóa sản phẩm này khỏi giỏ hàng không?"
                                  onConfirm={() =>
                                    handleRemoveProduct(product.id)
                                  }
                                  okText="Có"
                                  cancelText="Không"
                                >
                                  <button
                                    className="py-1 px-3 rounded-l-lg"
                                    title="Decrease quantity"
                                  >
                                    <i className="fa-solid fa-minus" />
                                  </button>
                                </Popconfirm>
                              ) : (
                                <button
                                  onClick={() => {
                                    if (!isProcessing[product.id]) {
                                      decreaseQuantity({
                                        productId: product.id,
                                        currentQuantity: product.quantity,
                                      });
                                    }
                                  }}
                                  className="py-1 px-3 rounded-l-lg"
                                  title="Decrease quantity"
                                  disabled={
                                    isProcessing[product.id] ||
                                    product.quantity <= 1 ||
                                    fadeEffect[product.id]
                                  }
                                >
                                  <i className="fa-solid fa-minus" />
                                </button>
                              )}
                              <input
                                type="number"
                                value={product.so_luong}
                                onChange={(event) =>
                                  handleChangeQuantity(event, product)
                                }
                                placeholder="Quantity"
                                min="1"
                                max={product.so_luong_bien_the}
                                title="Product Quantity"
                                disabled={isProcessing[product.id]}
                                className="xl:w-10 xl:h-10 lg:w-5 lg:h-5 md:w-10 md:h-10  w-5 h-5 border-0 focus:ring-0 focus:outline-none text-center text-lg font-semibold appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                              />
                              <button
                                onClick={() => {
                                  // Kiểm tra nếu số lượng sản phẩm hiện tại đã đạt đến số lượng tối đa của biến thể
                                  if (
                                    product.so_luong >=
                                    product.so_luong_bien_the
                                  ) {
                                    toast.error(
                                      "Sản phẩm đã đạt đến số lượng tồn kho tối đa."
                                    );
                                    return; // Dừng lại nếu đạt giới hạn
                                  }
                                  // Gọi hàm tăng số lượng nếu còn tồn kho
                                  if (!isProcessing[product.id]) {
                                    increaseQuantity({
                                      productId: product.id,
                                      currentQuantity: product.so_luong,
                                    });
                                  }
                                }}
                                className="py-1 px-3 rounded-r-lg"
                                title="Increase quantity"
                                disabled={
                                  product.so_luong >=
                                    product.so_luong_bien_the ||
                                  fadeEffect[product.id] ||
                                  isProcessing[product.id]
                                } // Vô hiệu hóa nút nếu đạt giới hạn
                              >
                                <i className="fa-solid fa-plus" />
                              </button>
                            </div>
                          </td>
                          <td className="px-4 py-2">
                            {formatCurrency(
                              product.gia_hien_tai * product.so_luong
                            )}
                          </td>
                          <td className="px-4 py-2">
                            <button
                              onClick={() => Delete(product.id)}
                              className="text-red-600 hover:text-red-800"
                              title="Remove product"
                            >
                              <i className="fa-regular fa-trash-can" />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {/* End sản phẩm nguyên giá */}
                      {data?.san_pham_het_hang?.map((product: any) => (
                        <tr
                          key={product.id}
                          className={`border-b border-gray-200 hover:bg-gray-100 ${
                            product.het_hang
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                        >
                          {/* Checkbox */}
                          <td className="px-4 py-2">
                            <input
                              type="checkbox"
                              className="w-5 h-5 text-indigo-600 bg-white border-gray-300 rounded focus:ring-indigo-500 focus:ring-2 cursor-pointer"
                              disabled={product.het_hang}
                              onChange={() => handleSelectProduct(product.id)}
                              title={
                                product.het_hang
                                  ? "Sản phẩm đã hết hàng"
                                  : "Select product"
                              }
                            />
                          </td>

                          {/* Thông tin sản phẩm */}
                          <td className="px-4 py-2">
                            <div className="flex items-start gap-4">
                              {/* Ảnh sản phẩm */}
                              <div className="relative">
                                <img
                                  src={product.hinh_anh}
                                  alt={product.ten_san_pham}
                                  className="w-32 h-40 object-cover rounded-md"
                                />
                                {/* Hiển thị chữ 'Hết hàng' */}
                                {product.het_hang === 1 && (
                                  <p className="absolute bottom-0 left-0 right-0 text-center text-red-600 font-semibold bg-white bg-opacity-75">
                                    Hết hàng
                                  </p>
                                )}
                              </div>

                              {/* Thông tin sản phẩm */}
                              <div>
                                <h3 className="font-semibold text-gray-700">
                                  {product.ten_san_pham}
                                </h3>
                                <p className="text-gray-500">
                                  {product.mau_sac}, {product.kich_thuoc}
                                </p>
                                <p className="text-gray-700 font-semibold mt-1">
                                  {formatCurrency(product.gia_hien_tai)}
                                </p>
                              </div>
                            </div>
                          </td>
                          {/* Điều chỉnh số lượng */}
                          <td className="hidden lg:table-cell px-4 py-2 text-center align-middle">
                            <div className="flex items-center justify-center border rounded-lg mx-auto w-fit">
                              <button
                                onClick={() => {
                                  if (
                                    !product.het_hang &&
                                    !isProcessing[product.id]
                                  ) {
                                    decreaseQuantity({
                                      productId: product.id,
                                      currentQuantity: product.so_luong,
                                    });
                                  }
                                }}
                                className="py-1 px-3 rounded-l-lg"
                                title={
                                  product.het_hang
                                    ? "Không thể giảm, sản phẩm hết hàng"
                                    : "Decrease quantity"
                                }
                                disabled={
                                  product.het_hang ||
                                  isProcessing[product.id] ||
                                  product.so_luong <= 1
                                }
                              >
                                <i className="fa-solid fa-minus" />
                              </button>
                              <input
                                value={product.so_luong}
                                className="w-7 h-10 text-center"
                                readOnly
                                title={
                                  product.het_hang
                                    ? "Sản phẩm hết hàng"
                                    : "Product Quantity"
                                }
                              />
                              <button
                                onClick={() => {
                                  if (
                                    !product.het_hang &&
                                    !isProcessing[product.id]
                                  ) {
                                    increaseQuantity({
                                      productId: product.id,
                                      currentQuantity: product.so_luong,
                                    });
                                  }
                                }}
                                className="py-1 px-3 rounded-r-lg"
                                title={
                                  product.het_hang
                                    ? "Không thể tăng, sản phẩm hết hàng"
                                    : "Increase quantity"
                                }
                                disabled={
                                  product.het_hang ||
                                  product.so_luong >= product.kho_hang ||
                                  isProcessing[product.id]
                                }
                              >
                                <i className="fa-solid fa-plus" />
                              </button>
                            </div>
                          </td>

                          {/* Giá tổng */}
                          <td className="px-4 py-2">
                            {formatCurrency(
                              product.gia_hien_tai * product.so_luong
                            )}
                          </td>

                          {/* Xóa sản phẩm */}
                          <td className="px-4 py-2">
                            <button
                              onClick={() => Delete(product.id)}
                              className="text-red-600 hover:text-red-800"
                              title="Remove product"
                            >
                              <i className="fa-regular fa-trash-can" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </>
                  </tbody>
                </table>
              </div>

              {/* CHI TIẾT */}
              <div className="lg:col-span-4 col-span-6">
                <div className="border px-4 py-1 lg:w-[359px] rounded-md">
                  <h1 className="text-xl font-bold mt-4">Chi tiết đơn hàng</h1>
                  {selectedProducts.length === 0 ? (
                    <div className="text-center my-4">
                      <img
                        src="https://m.yodycdn.com/web/prod/_next/static/media/cart-empty.250eba9c.svg"
                        alt="Empty cart"
                        className="mx-auto my-4"
                      />
                      <p className="text-gray-500 mb-4">
                        Vui lòng chọn các sản phẩm trong giỏ hàng trước khi
                        thanh toán.
                      </p>
                      <Button
                        disabled
                        className="bg-gray-300 cursor-not-allowed rounded-lg mb-4 w-[320px] h-[56px] font-semibold"
                      >
                        Mua hàng
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <div className="flex justify-between font-bold border-b border-hrBlack">
                        <h4>Tổng giá trị sản phẩm</h4>
                        <span className="px-2">
                          {totalSelectedPrice.toLocaleString("vn-VN")} ₫
                        </span>
                      </div>
                      <div className="py-4">
                        <div className="flex justify-between font-medium">
                          <p>Tiết kiệm</p>
                          <span className="px-2 text-red-500">
                            {totalSavings
                              ? totalSavings.toLocaleString("vn-VN")
                              : "0"}{" "}
                            ₫
                          </span>
                        </div>

                        <div className="flex justify-between font-medium mb-0">
                          <p>Phí giao hàng</p>
                          <span className="px-2">{formatCurrency(20000)}</span>
                        </div>
                        {totalSelectedPrice > 498000 && (
                          <div className="flex justify-between font-medium border-b border-hrBlack">
                            <p>Giảm giá vận chuyển</p>
                            <span className="px-2 text-red-500">
                              - {formatCurrency(20000)}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex justify-between font-bold mb-8">
                        <h4>Tổng cộng</h4>
                        <span>{formatCurrency(finalTotal)}</span>
                      </div>
                      <div className="flex justify-center">
                        <Link to="/shippingAddressPage">
                          <Button
                            onClick={handleCheckout}
                            className="btn-black rounded-lg mb-4 w-[320px] h-[56px] font-semibold"
                          >
                            Mua hàng ({tongSoLuong})
                          </Button>
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default CheckOut;
