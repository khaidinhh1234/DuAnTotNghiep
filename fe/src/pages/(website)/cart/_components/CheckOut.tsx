import useCart from "@/components/hook/useCart";

const CheckOut = () => {
  const { data, updateCart, calculateTotal } = useCart();
  const shippingFee = 25000;
  const totalAmount = calculateTotal() + shippingFee;

  return (
    <section className="container">
      <div className="lg:mx-12 mx-6 lg:my-[84px] my-[42px]">
        <h1 className="h1cart">Checkout</h1>
        <div className="grid lg:grid-cols-12 gap-4 px-0 justify-center">
          <div className="lg:col-span-8 col-span-6 md:px-0 px-3">
            <table>
              <thead>
                <tr className="*:font-normal text-left border-hrBlack *:pb-5 border-b">
                  <th>Sản phẩm</th>
                  <th className="px-2">Giá</th>
                  <th className="lg:text-center hidden lg:block">Số lượng</th>
                  <th>Tổng tiền</th>
                  <th />
                </tr>
              </thead>
              <tbody className="*:border-hrBlack *:border-b">
                {data?.san_pham?.map((product, index) => (
                  <tr key={product.id} className="*:py-8">
                    <td>
                      <div className="flex gap-5 px-2 xl:w-[352px] sm:w-[392px] md:w-[309px]">
                        <img
                          src="../assets/images/checkout/sanpham1.png"
                          alt=""
                          className="w-12 h-12"
                        />
                        <div className="px-1">
                          <h3 className="font-bold">{product.ten_san_pham}</h3>
                          <p>
                            Size: <span>S</span>
                          </p>
                          <div className="lg:hidden flex mt-2">
                            <button
                              onClick={() => updateCart({ action: "DECREASE", productId: product.id, quantity: product.quantity })}
                              className="pl-3 border border-r-0 border-blackL rounded-s-lg text-sm"
                            >
                              <i className="fa-solid fa-minus" />
                            </button>
                            <input
                              type="number"
                              id="numberInput"
                              value={product.quantity}
                              readOnly
                              className="w-9 h-7 border-y focus:ring-0 focus:outline-none text-center border-blackL"
                            />
                            <button
                              onClick={() => updateCart({ action: "INCREASE", productId: product.id, quantity: product.quantity })}
                              className="pr-3 border border-l-0 border-blackL rounded-e-lg text-sm"
                            >
                              <i className="fa-solid fa-plus" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="xl:w-24 sm:w-15 w-10 px-5">${product.price.toFixed(2)}</td>
                    <td className="hidden lg:block">
                      <div className="border rounded-lg border-black xl:mx-5">
                        <button
                          onClick={() => updateCart({ action: "DECREASE", productId: product.id, quantity: product.quantity })}
                          className="py-1 pl-3"
                        >
                          <i className="fa-solid fa-minus" />
                        </button>
                        <input
                          type="number"
                          id="numberInput"
                          value={product.quantity}
                          readOnly
                          className="w-9 h-10 border-0 focus:ring-0 focus:outline-none text-center"
                        />
                        <button
                          onClick={() => updateCart({ action: "INCREASE", productId: product.id, quantity: product.quantity })}
                          className="py-1 pr-3"
                        >
                          <i className="fa-solid fa-plus" />
                        </button>
                      </div>
                    </td>
                    <td className="xl:w-24 sm:w-15 w-10">${(product.price * product.quantity).toFixed(2)}</td>
                    <td className="px-1">
                      <button onClick={() => updateCart({ action: "REMOVE", productId: product.id })}>
                        <i className="fa-regular fa-trash-can" style={{ color: "#db5151" }} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Tổng tiền */}
          <div className="lg:col-span-4 col-span-6">
            <div className="border px-4 py-1 lg:w-[359px] rounded-md">
              <div className="flex justify-between font-bold border-hrBlack border-b py-4">
                <h4>Subtotal</h4>
                <span className="px-2">${calculateTotal().toFixed(2)}</span>
              </div>
              <div className="py-4">
                <label className="text-xs">Enter Discount Code</label>
                <br />
                <div className="flex">
                  <input
                    type="text"
                    placeholder="FLAT50"
                    className="lg:w-[218px] w-[300px] h-[56px] px-4 rounded-s-lg focus:outline-none border border-l-2 border-t-2 border-blackL border-r-0"
                  />
                  <button className="bg-black hover:bg-stone-700 w-[101px] h-[55px] border border-black rounded-r-lg text-white">
                    Apply
                  </button>
                </div>
                <div className="py-4 flex justify-between font-medium border-b border-hrBlack">
                  <p>Delivery Charge</p>
                  <span className="px-2">${shippingFee.toFixed(2)}</span>
                </div>
              </div>
              <div className="flex justify-between font-bold mb-8">
                <h4>Grand Total</h4>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-center">
                <a href="shippingaddress.html">
                  <button className="btn-black rounded-lg mb-4 w-[320px] h-[56px]">
                    Proceed to Checkout
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
