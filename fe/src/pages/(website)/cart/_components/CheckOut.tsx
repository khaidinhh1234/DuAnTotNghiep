import { useLocalStorage } from "@/components/hook/useStoratge";
import instanceClient from "@/configs/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "antd";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Subtotal from "../../ShipingAdrres/_components/subtotail";

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

  // const [selectAllDiscounted, setSelectAllDiscounted] = useState(false);
  // const [selectAllRegular, setSelectAllRegular] = useState(false);
  
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
  const { mutate: increaseQuantity } = useMutation({
    mutationFn: async ({
      productId,
      currentQuantity,
    }: {
      productId: string;
      currentQuantity: number;
    }) => {
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
    // Thực hiện cập nhật lạc quan (optimistic update)
    onMutate: ({ productId, currentQuantity }) => {
      const previousCartData = queryClient.getQueryData(["cart", access_token]);
      queryClient.setQueryData(["cart", access_token], (oldData: { san_pham_giam_gia: any[], san_pham_nguyen_gia: any[] }) => {
        const updatedProducts = oldData.san_pham_giam_gia.map((product: any) => {
          if (product.id === productId) {
            return { ...product, so_luong: currentQuantity + 1 };
          }
          return product;
        });
        
        const updatedOriginalProducts = oldData.san_pham_nguyen_gia.map(product => {
          if (product.id === productId) {
            return { ...product, so_luong: currentQuantity + 1 };
          }
          return product;
        });
  
        return { 
          ...oldData, 
          san_pham_giam_gia: updatedProducts,
          san_pham_nguyen_gia: updatedOriginalProducts
        };
      });
      return { previousCartData };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart", access_token] });
    },
    onError: (error: any, _, context) => {
      if (context?.previousCartData) {
        if (context?.previousCartData) {
          if (context?.previousCartData) {
            queryClient.setQueryData(["cart", access_token], context.previousCartData);
          }
        }
      }
      toast.error("Thao tác quá nhanh, vui lòng chậm lại");
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
      if (currentQuantity <= 1) {
        toast.error("Không thể giảm số lượng xuống dưới 1.");
        return;
      } else {
        await instanceClient.put(
          `/gio-hang/giam-so-luong/${productId}`,
          { so_luong: currentQuantity - 1 },
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          }
        );
      }
    },
    // Thực hiện cập nhật lạc quan (optimistic update)
    onMutate: ({ productId, currentQuantity }) => {
      const previousCartData = queryClient.getQueryData(["cart", access_token]);
      queryClient.setQueryData(["cart", access_token], (oldData: { san_pham_giam_gia: any[], san_pham_nguyen_gia: any[] }) => {
        const updatedProducts = oldData.san_pham_giam_gia.map(product => {
          if (product.id === productId) {
            return { ...product, so_luong: currentQuantity - 1 };
          }
          return product;
        });
        
        const updatedOriginalProducts = oldData.san_pham_nguyen_gia.map(product => {
          if (product.id === productId) {
            return { ...product, so_luong: currentQuantity - 1 };
          }
          return product;
        });
  
        return { 
          ...oldData, 
          san_pham_giam_gia: updatedProducts,
          san_pham_nguyen_gia: updatedOriginalProducts
        };
      });
  
      // Trả về dữ liệu cũ để có thể khôi phục
      return { previousCartData };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart", access_token] });
    },
    onError: (error: any, { productId, currentQuantity }, context) => {
      queryClient.setQueryData(["cart", access_token], context.previousCartData);
      toast.error("Thao tác quá nhanh, vui lòng chậm lại");
    },
  });
  
  
  const { mutate: Delete } = useMutation({
    mutationFn: async (productId) => {
      await instanceClient.delete(`/gio-hang/${productId}`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart", access_token] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Có lỗi xảy ra khi xóa sản phẩm.");
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
  const shippingFee = 20000;
  const discountShipping = 20000;
  const finalTotal = totalSelectedPrice - discountShipping + shippingFee;
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
 // Xử lý khi chọn tất cả
 const handleSelectAll = (isChecked: boolean) => {
  if (isChecked) {
    const allProductIds = [
      ...data?.san_pham_giam_gia.map((product: any) => product.id),
      ...data?.san_pham_nguyen_gia.map((product: any) => product.id),
    ];
    setSelectedProducts(allProductIds);
    localStorage.setItem('selectedProducts', JSON.stringify(allProductIds));

    // Gọi SelectedProduct với tất cả ID
    SelectedProduct({ gioHangIds: allProductIds, isChecked: true });
  } else {
    const allProductIds = [
      ...data?.san_pham_giam_gia.map((product: any) => product.id),
      ...data?.san_pham_nguyen_gia.map((product: any) => product.id),
    ];
    setSelectedProducts([]); // Cập nhật trạng thái không chọn
    localStorage.setItem('selectedProducts', JSON.stringify([]));

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
      await instanceClient.post(
        `/gio-hang/chon-san-pham`,
        { gio_hang_ids: gioHangIds, chon: isChecked ? 1 : 0 },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
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
  return (
    <section className="container">
      <div className="lg:mx-12 mx-6 lg:my-[84px] my-[42px]">
        <h1 className="h1cart">Giỏ hàng</h1>
        <div className="grid lg:grid-cols-12 gap-4 px-0 justify-center">
          <div className="lg:col-span-8 col-span-6 md:px-0 px-3">
            <table className="min-w-full  ">
              <thead>
                <tr className="text-left border-b border-gray-200">
                  <th className="px-4 py-2">
                    <input
                      type="checkbox"
                      className="w-5 h-5 text-indigo-600 bg-white border-gray-300 rounded focus:ring-indigo-500 focus:ring-2 cursor-pointer"
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      title="Select all products"
                    />
                  </th>
                  <th className="font-semibold text-gray-700 px-4 py-2">
                    Sản phẩm
                  </th>
                  <th className="font-semibold text-gray-700 px-4 py-2">Giá</th>
                  <th className="lg:text-center hidden lg:table-cell font-semibold text-gray-700 px-4 py-2">
                    Số lượng
                  </th>
                  <th className="font-semibold text-gray-700 px-4 py-2">
                    Tổng tiền
                  </th>
                  {/* <th className="font-semibold text-gray-700 px-4 py-2">Xóa</th> */}
                </tr>
              </thead>
              <tbody>
                {data?.san_pham_giam_gia?.length === 0 &&
                data?.san_pham_nguyen_gia?.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8">
                      <div className="flex flex-col items-center justify-center">
                        <img
                          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4G_QUeNpzKi5F8stqZB8TnaKax58iEnOuVA&s"
                          alt="No products"
                          className="w-[800px] h-[200px] md:w-[800px] md:h-[400px] object-cover"
                        />
                        <Link
                          to="/shop"
                          className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-md shadow hover:bg-blue-600 transition duration-200"
                        >
                          Quay lại cửa hàng
                        </Link>
                      </div>
                    </td>
                  </tr>
                ) : (
                  <>
                    {/* Sản phẩm giảm giá */}
                    {data?.san_pham_giam_gia?.map((product: any) => (
                      <tr
                        key={product.id}
                        className="border-b border-gray-200 hover:bg-gray-100"
                      >
                        <td className="px-4 py-2">
                          <input
                            type="checkbox"
                            className="w-5 h-5 text-indigo-600 bg-white border-gray-300 rounded focus:ring-indigo-500 focus:ring-2 cursor-pointer"
                            checked={selectedProducts.includes(product.id)}
                            // checked={product.chon == 1}
                            onChange={() => handleSelectProduct(product.id)}
                            title="Select discount product"
                          />
                        </td>
                        {/* Thông tin sản phẩm */}
                        <td className="px-4 py-2">
                          <div className="flex items-center gap-4">
                            <img
                              src={product.hinh_anh}
                              alt={product.ten_san_pham}
                              className="w-12 h-12 object-cover"
                            />
                            <div>
                              <h3 className="font-semibold text-gray-700">
                                {product.ten_san_pham}
                              </h3>
                              <p className="text-gray-500">
                                {product.mau_sac}, {product.kich_thuoc}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-2">
                          {formatCurrency(product.gia_hien_tai)}
                        </td>
                        <td className="hidden lg:block px-4 py-2">
                          <div className="flex items-center justify-center border rounded-lg">
                            <button
                              onClick={() =>
                                decreaseQuantity({
                                  productId: product.id,
                                  currentQuantity: product.so_luong,
                                })
                              }
                              className="py-1 px-3 rounded-l-lg"
                              title="Decrease quantity"
                            >
                              <i className="fa-solid fa-minus" />
                            </button>
                            <input
                              value={product.so_luong}
                              className="w-7 h-10 text-center"
                              placeholder="Quantity"
                              min="0"
                              title="Product Quantity"
                            />
                            <button
                              onClick={() =>
                                increaseQuantity({
                                  productId: product.id,
                                  currentQuantity: product.so_luong,
                                })
                              }
                              className="py-1 px-3 rounded-r-lg"
                              title="Increase quantity"
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
                            checked={selectedProducts.includes(product.id)}
                            // checked={product.chon == 1}
                            onChange={() => handleSelectProduct(product.id)}
                            title="Select regular price product"
                          />
                        </td>
                        {/* Thông tin sản phẩm */}
                        <td className="px-4 py-2">
                          <div className="flex items-center gap-4">
                            <img
                              src={product.hinh_anh}
                              alt={product.ten_san_pham}
                              className="w-12 h-12 object-cover"
                            />
                            <div>
                              <h3 className="font-semibold text-gray-700">
                                {product.ten_san_pham}
                              </h3>
                              <p className="text-gray-500">
                                {product.mau_sac}, {product.kich_thuoc}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-2">
                          {formatCurrency(product.gia_hien_tai)}
                        </td>
                        <td className="hidden lg:block px-4 py-2">
                          <div className="flex items-center justify-center border rounded-lg">
                            <button
                              onClick={() =>
                                decreaseQuantity({
                                  productId: product.id,
                                  currentQuantity: product.so_luong,
                                })
                              }
                              className="py-1 px-3 rounded-l-lg"
                              title="Decrease quantity"
                            >
                              <i className="fa-solid fa-minus" />
                            </button>
                            <input
                              value={product.so_luong}
                              className="w-7 h-10 text-center"
                              placeholder="Quantity"
                              min="0"
                              title="Product Quantity"
                            />
                            <button
                              onClick={() =>
                                increaseQuantity({
                                  productId: product.id,
                                  currentQuantity: product.so_luong,
                                })
                              }
                              className="py-1 px-3 rounded-r-lg"
                              title="Increase quantity"
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
                  </>
                )}
              </tbody>
            </table>
          </div>

          {/* CHI TIẾT */}
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
                <div className=" flex justify-between font-medium border-hrBlack">
                  <p>Tiết kiệm</p>
                  <span className="px-2 text-red-500">
                    - {finalTotal > 0 ? shippingFee.toLocaleString("vn-VN") : 0}{" "}
                    ₫
                  </span>
                </div>

                <div className="flex justify-between font-medium mb-0 border-hrBlack">
                  <p>Phí giao hàng</p>
                  <span className="px-2">
                    {finalTotal > 0 ? shippingFee.toLocaleString("vn-VN") : 0} ₫
                  </span>
                </div>
                <div className="flex justify-between font-medium border-b border-hrBlack">
                  <p>Giảm giá vận chuyển</p>\
                  <span className="px-2 text-red-500">
                    - {finalTotal > 0 ? shippingFee.toLocaleString("vn-VN") : 0}
                    ₫
                  </span>
                </div>
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
                    disabled={
                      !data?.san_pham_giam_gia.length &&
                      !data?.san_pham_nguyen_gia.length
                    }
                  >
                    Mua hàng ({data?.tong_so_luong})
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          {/* <Subtotal/> */}
        </div>
      </div>
    </section>
  );
};

export default CheckOut;
