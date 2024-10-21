import { useState } from "react";
import { useLocalStorage } from "@/components/hook/useStoratge";
import instanceClient from "@/configs/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

const CheckOut = () => {
  const queryClient = useQueryClient();
  const [user] = useLocalStorage("user" as any, {});
  const access_token = user.access_token || localStorage.getItem("access_token");

  const [selectedProducts, setSelectedProducts] = useState<number[]>([]); // Lưu trữ các sản phẩm được chọn
  const [selectAllDiscounted, setSelectAllDiscounted] = useState(false);
  const [selectAllRegular, setSelectAllRegular] = useState(false);
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
    mutationFn: async ({ productId, currentQuantity }: { productId: string; currentQuantity: number }) => {
      await instanceClient.put(`/gio-hang/tang-so-luong/${productId}`,
        { so_luong: currentQuantity + 1 },
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
      toast.error("Thao tác quá nhanh vui lòng chậm lại");
    },
  });
  const { mutate: decreaseQuantity } = useMutation({
    mutationFn: async ({ productId, currentQuantity }: { productId: string; currentQuantity: number }) => {
      if (currentQuantity === 1) {
        // Xóa sản phẩm khi số lượng giảm về 0
        await instanceClient.delete(`/gio-hang/${productId}`, {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });
      } else {
        // Giảm số lượng sản phẩm
        await instanceClient.put(`/gio-hang/giam-so-luong/${productId}`, { so_luong: currentQuantity - 1 },
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          }
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart", access_token] });
    },
    onError: (error: any) => {
      toast.error("Thao tác quá nhanh vui lòng chậm lại");
    },
  });

  const { mutate: Delete } = useMutation({
    mutationFn: async (productId) => {
      await instanceClient.delete(`/gio-hang/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart", access_token] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Có lỗi xảy ra khi xóa sản phẩm.');
    },
  })
  const handleCheckboxChange = (id: number) => {
    setSelectedProducts((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((productId) => productId !== id)
        : [...prevSelected, id]
    );
  };
  const handleSelectAllDiscounted = () => {
    if (selectAllDiscounted) {
      // Bỏ chọn tất cả sản phẩm đang giảm giá
      setSelectedProducts((prevSelected) =>
        prevSelected.filter((productId) =>
          !data?.san_pham_giam_gia.map((product: any) => product.id).includes(productId)
        )
      );
    } else {
      // Chọn tất cả sản phẩm đang giảm giá
      const allDiscountedIds = data?.san_pham_giam_gia.map((product: any) => product.id) || [];
      setSelectedProducts((prevSelected) => [...new Set([...prevSelected, ...allDiscountedIds])]);
    }
    setSelectAllDiscounted(!selectAllDiscounted);
  };

  const handleSelectAllRegular = () => {
    if (selectAllRegular) {
      // Bỏ chọn tất cả sản phẩm nguyên giá
      setSelectedProducts((prevSelected) =>
        prevSelected.filter((productId) =>
          !data?.san_pham_nguyen_gia.map((product: any) => product.id).includes(productId)
        )
      );
    } else {
      // Chọn tất cả sản phẩm nguyên giá
      const allRegularIds = data?.san_pham_nguyen_gia.map((product: any) => product.id) || [];
      setSelectedProducts((prevSelected) => [...new Set([...prevSelected, ...allRegularIds])]);
    }
    setSelectAllRegular(!selectAllRegular);
  };
  const totalSelectedPrice = selectedProducts.reduce((total, productId) => {
    const productInDiscounts = data?.san_pham_giam_gia.find((product: any) => product.id === productId);
    const productInRegular = data?.san_pham_nguyen_gia.find((product: { id: number }) => product.id === productId);

    const quantity = productInDiscounts?.so_luong || productInRegular?.so_luong || 0;
    console.log("đâsd", quantity);
    if (productInDiscounts) {
      return total + (productInDiscounts.gia_hien_tai * quantity);
    }

    if (productInRegular) {
      return total + (productInRegular.gia_hien_tai * quantity);
    }

    return total;
  }, 0);
  console.log(totalSelectedPrice)
  // Tính tổng tiền cuối cùng (bao gồm phí giao hàng)
  const shippingFee = 20000; // Phí giao hàng là 20,000 VND
  const discountShipping = 20000; // Giảm giá phí giao hàng
  const finalTotal = totalSelectedPrice - discountShipping + shippingFee;
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <section className="container">

      <div className="lg:mx-12 mx-6 lg:my-[84px] my-[42px]">

        <h1 className="h1cart">Checkout</h1>
        <div className="grid lg:grid-cols-12 gap-4 px-0 justify-center">
          <div className="lg:col-span-8 col-span-6 md:px-0 px-3">
            <table>
              <thead>
                <tr className="*:font-normal text-left border-hrBlack *:pb-5 border-b">
                  {/* <th>
                    <input
                      type="checkbox"
                      checked={selectAllDiscounted}
                      onChange={handleSelectAllDiscounted}
                      title="Select all discounted products"
                    />
                  </th> */}
                  <th className="font-bold">Sản phẩm</th>
                  <th className="px-2 font-bold">Giá</th>
                  <th className="lg:text-center hidden lg:block font-bold">Số lượng</th>
                  <th className="font-bold">Tổng tiền</th>
                </tr>
              </thead>

              <tbody className="*:border-hrBlack *:border-b">
                {data?.san_pham_giam_gia?.length === 0 && data?.san_pham_nguyen_gia?.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-8">
                      <div className="flex justify-center items-center flex-col">
                        <img
                          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4G_QUeNpzKi5F8stqZB8TnaKax58iEnOuVA&s"
                          alt="No products"
                          className="w-[800px] h-[200px] md:w-[800px] md:h-[400px] object-cover"
                        />
                        <p className="mt-4 text-lg font-semibold">Không có sản phẩm trong giỏ hàng</p>
                      </div>
                    </td>
                  </tr>
                )}
                {data?.san_pham_giam_gia?.map((product: any) => (
                  <tr key={product.id} className="*:py-8">
                    <td>
                      <div className="flex gap-5 px-2 xl:w-[352px] sm:w-[392px] md:w-[309px]">
                        <img
                          src={product.hinh_anh}
                          alt=""
                          className="w-12 h-12"
                        />
                        <div className="px-1">
                          <h3 className="font-bold ">{product.ten_san_pham}</h3>
                          <p>
                            {product.mau_sac}, {product.kich_thuoc}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="xl:w-24 sm:w-15 w-10 px-5">
                      {formatCurrency(product.gia_hien_tai)}
                    </td>

                    <td className="hidden lg:block">
                      <div className="border rounded-lg border-black xl:mx-5">
                        <button
                          onClick={() => decreaseQuantity({ productId: product.id, currentQuantity: product.so_luong })}
                          className="py-1 pl-3"
                          title="Decrease quantity">
                          <i className="fa-solid fa-minus" />
                        </button>
                        <input
                          type="number"
                          id="numberInput"
                          value={product.so_luong}
                          className="w-9 h-10 border-0 focus:ring-0 focus:outline-none text-center"
                          placeholder="Quantity"
                        />
                        <button
                          onClick={() => increaseQuantity({ productId: product.id, currentQuantity: product.so_luong })}
                          className="py-1 pr-3"
                          title="Increase quantity">

                          <i className="fa-solid fa-plus" />
                        </button>
                      </div>
                    </td>
                    <td className="xl:w-24 sm:w-15 w-10">{formatCurrency(product.gia_hien_tai * product.so_luong)}</td>
                    <td className="px-1">
                      <button
                        onClick={() => Delete(product.id)}
                        title="Remove product">
                        <i
                          className="fa-regular fa-trash-can"
                          style={{ color: "#db5151" }}
                        />
                      </button>
                    </td>
                  </tr>
                ))}
                {data?.san_pham_nguyen_gia?.map((product: any) => (
                  <tr key={product.id} className="*:py-8">
                    <td>
                      <div className="flex gap-5 px-2 xl:w-[352px] sm:w-[392px] md:w-[309px]">
                        <img
                          src={product.hinh_anh}
                          alt=""
                          className="w-12 h-12"
                        />
                        <div className="px-1">
                          <h3 className="font-bold">{product.ten_san_pham}</h3>
                          <p>
                            {product.mau_sac}, {product.kich_thuoc}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="xl:w-24 sm:w-15 w-10 px-5">
                      {formatCurrency(product.gia_hien_tai)}
                    </td>

                    <td className="hidden lg:block">
                      <div className="border rounded-lg border-black xl:mx-5">
                        <button
                          onClick={() => decreaseQuantity({ productId: product.id, currentQuantity: product.so_luong })}
                          className="py-1 pl-3"
                          title="Decrease quantity">
                          <i className="fa-solid fa-minus" />
                        </button>
                        <input
                          type="number"
                          id="numberInput"
                          value={product.so_luong}
                          className="w-9 h-10 border-0 focus:ring-0 focus:outline-none text-center"
                          placeholder="Quantity"
                        />
                        <button
                          onClick={() => increaseQuantity({ productId: product.id, currentQuantity: product.so_luong })}
                          className="py-1 pr-3"
                          title="Increase quantity">

                          <i className="fa-solid fa-plus" />
                        </button>
                      </div>
                    </td>
                    <td className="xl:w-24 sm:w-15 w-10">{formatCurrency(product.gia_hien_tai * product.so_luong)}</td>
                    <td>
                      <button
                        onClick={() => Delete(product.id)}
                        title="Remove product">
                        <i
                          className="fa-regular fa-trash-can"
                          style={{ color: "#db5151" }}
                        />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* CHI TIẾT */}
          <div className="lg:col-span-4 col-span-6">
            <div className="border px-4 py-1 lg:w-[359px] rounded-md">
              <div className="flex justify-between font-bold border-hrBlack border-b py-4">
                <h4>Tổng tiền sản phẩm</h4>
                <span className="px-2">{formatCurrency(totalSelectedPrice)}</span>
              </div>

              <div className="py-4">
                <label className="text-xs">Nhập mã giảm giá</label>
                <div className="flex mt-1">
                  <input
                    type="text"
                    placeholder="FLAT50"
                    className="lg:w-[218px] w-[300px] h-[56px] px-4 rounded-s-lg focus:outline-none border border-l-2 border-t-2 border-blackL border-r-0"
                  />
                  <button className="bg-black hover:bg-stone-700 w-[101px] h-[55px] border border-black rounded-r-lg text-white">
                    Áp dụng
                  </button>
                </div>

                <div className="py-4 flex justify-between font-medium border-b border-hrBlack">
                  <p>Phí giao hàng</p>
                  <span className="px-2">{formatCurrency(finalTotal)}</span>
                </div>
              </div>

              <div className="flex justify-between font-bold mb-8">
                <h4>Tổng cộng</h4>
                <span>{formatCurrency(totalSelectedPrice + 5.00)}</span>
              </div>

              <div className="flex justify-center">
                <a href="shippingaddress.html">
                  <button className="btn-black rounded-lg mb-4 w-[320px] h-[56px]">
                    Tiến hành thanh toán
                  </button>
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default CheckOut;
