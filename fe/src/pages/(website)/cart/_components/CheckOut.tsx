import { products1, products2 } from "@/assets/img";
import React from "react";

const CheckOut = () => {
  return (
    <section className="container">
      <div className="  lg:mx-12 mx-6 lg:my-[84px] my-[42px]">
        <h1 className="h1cart">Checkout</h1>
        <div className="grid lg:grid-cols-12 gap-4 px-0 justify-center">
          <div className="lg:col-span-8 col-span-6 md:px-0 px-3">
            <table>
              <thead>
                <tr className="*:font-normal text-left border-hrBlack *:pb-5 border-b">
                  <th>Products</th>
                  <th className="px-2">Price</th>
                  <th className="lg:text-center hidden lg:block">Quantity</th>
                  <th>Subtotal</th>
                  <th />
                </tr>
              </thead>
              <tbody className="*:border-hrBlack *:border-b">
                <tr className="*:py-8">
                  <td>
                    <div className="flex gap-5 px-2 xl:w-[352px] sm:w-[392px] md:w-[309px]">
                      <img
                        src="../assets/images/checkout/sanpham1.png"
                        alt=""
                        className="w-12 h-12"
                      />
                      <div className="px-1">
                        <h3 className="font-bold">Product Name NameName</h3>
                        <p>
                          Size: <span>S</span>
                        </p>
                        <div className="lg:hidden flex mt-2">
                          <button className="pl-3 border border-r-0 border-blackL rounded-s-lg text-sm">
                            <i className="fa-solid fa-minus" />
                          </button>
                          <input
                            type="number"
                            id="numberInput"
                            defaultValue={1}
                            className="w-9 h-7 border-y focus:ring-0 focus:outline-none text-center border-blackL"
                          />
                          <button className="pr-3 border border-l-0 border-blackL rounded-e-lg text-sm">
                            <i className="fa-solid fa-plus" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="xl:w-24 sm:w-15 w-10 px-5">$50.00</td>
                  <td className="hidden lg:block">
                    <div className="border rounded-lg border-black xl:mx-5">
                      <button className="py-1 pl-3">
                        <i className="fa-solid fa-minus" />
                      </button>
                      <input
                        type="number"
                        id="numberInput"
                        defaultValue={1}
                        className="w-9 h-10 border-0 focus:ring-0 focus:outline-none text-center"
                      />
                      <button className="py-1 pr-3">
                        <i className="fa-solid fa-plus" />
                      </button>
                    </div>
                  </td>
                  <td className="xl:w-24 sm:w-15 w-10">$50.00</td>
                  <td className="px-1">
                    <button>
                      <i
                        className="fa-regular fa-trash-can"
                        style={{ color: "#db5151" }}
                      />
                    </button>
                  </td>
                </tr>
                <tr className="*:py-8">
                  <td>
                    <div className="flex gap-5 px-2 xl:w-[352px] sm:w-[392px] md:w-[309px]">
                      <img
                        src="../assets/images/checkout/sanpham1.png"
                        className="w-12 h-12"
                      />
                      <div className="px-1">
                        <h3 className="font-bold">Product Name NameName</h3>
                        <p>
                          Size: <span>S</span>
                        </p>
                        <div className="lg:hidden flex mt-2">
                          <button className="pl-3 border border-r-0 border-blackL rounded-s-lg text-sm">
                            <i className="fa-solid fa-minus" />
                          </button>
                          <input
                            type="number"
                            id="numberInput"
                            defaultValue={1}
                            className="w-9 h-7 border-y focus:ring-0 focus:outline-none text-center border-blackL"
                          />
                          <button className="pr-3 border border-l-0 border-blackL rounded-e-lg text-sm">
                            <i className="fa-solid fa-plus" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="xl:w-24 sm:w-15 w-10 px-5">$50.00</td>
                  <td className="hidden lg:block">
                    <div className="border rounded-lg border-black xl:mx-5">
                      <button className="py-1 pl-3">
                        <i className="fa-solid fa-minus" />
                      </button>
                      <input
                        type="number"
                        id="numberInput"
                        defaultValue={1}
                        className="w-9 h-10 border-0 focus:ring-0 focus:outline-none text-center"
                      />
                      <button className="py-1 pr-3">
                        <i className="fa-solid fa-plus" />
                      </button>
                    </div>
                  </td>
                  <td className="xl:w-24 sm:w-15 w-10">$50.00</td>
                  <td className="px-1">
                    <button>
                      <i
                        className="fa-regular fa-trash-can"
                        style={{ color: "#db5151" }}
                      />
                    </button>
                  </td>
                </tr>
                <tr className="*:py-8">
                  <td>
                    <div className="flex gap-5 px-2 xl:w-[352px] sm:w-[392px] md:w-[309px]">
                      <img
                        src="../assets/images/checkout/sanpham1.png"
                        className="w-12 h-12"
                      />
                      <div className="px-1">
                        <h3 className="font-bold">Product Name NameName</h3>
                        <p>
                          Size: <span>S</span>
                        </p>
                        <div className="lg:hidden flex mt-2">
                          <button className="pl-3 border border-r-0 border-blackL rounded-s-lg text-sm">
                            <i className="fa-solid fa-minus" />
                          </button>
                          <input
                            type="number"
                            id="numberInput"
                            defaultValue={1}
                            className="w-9 h-7 border-y focus:ring-0 focus:outline-none text-center border-blackL"
                          />
                          <button className="pr-3 border border-l-0 border-blackL rounded-e-lg text-sm">
                            <i className="fa-solid fa-plus" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="xl:w-24 sm:w-15 w-10 px-5">$50.00</td>
                  <td className="hidden lg:block">
                    <div className="border rounded-lg border-black xl:mx-5">
                      <button className="py-1 pl-3">
                        <i className="fa-solid fa-minus" />
                      </button>
                      <input
                        type="number"
                        id="numberInput"
                        defaultValue={1}
                        className="w-9 h-10 border-0 focus:ring-0 focus:outline-none text-center"
                      />
                      <button className="py-1 pr-3">
                        <i className="fa-solid fa-plus" />
                      </button>
                    </div>
                  </td>
                  <td className="xl:w-24 sm:w-15 w-10">$50.00</td>
                  <td className="px-1">
                    <button>
                      <i
                        className="fa-regular fa-trash-can"
                        style={{ color: "#db5151" }}
                      />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="lg:col-span-4 col-span-6">
            <div className="border px-4 py-1 lg:w-[359px] rounded-md">
              <div className="flex justify-between font-bold border-hrBlack border-b py-4">
                <h4>Subtotal</h4>
                <span className="px-2">$200.00</span>
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
                  <span className="px-2">$5.00</span>
                </div>
              </div>
              <div className="flex justify-between font-bold mb-8">
                <h4>Grand Total</h4>
                <span>$205.00</span>
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
