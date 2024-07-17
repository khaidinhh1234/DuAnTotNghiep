import React from 'react'

const CheckOut = () => {
  return (
    <section>
        <div class="lg:mx-12 mx-6 lg:my-[84px] my-[42px]">
          <h1 class="h1cart">Checkout</h1>
          <div class="grid lg:grid-cols-12 gap-4 px-0 justify-center">
            <div class="lg:col-span-8 col-span-6 md:px-0 px-3">
              <table>
                <thead>
                  <tr
                    class="*:font-normal text-left border-hrBlack *:pb-5 border-b"
                  >
                    <th>Products</th>
                    <th class="px-2">Price</th>
                    <th class="lg:text-center hidden lg:block">Quantity</th>
                    <th>Subtotal</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody class="*:border-hrBlack *:border-b">
                  <tr class="*:py-8">
                    <td>
                      <div
                        class="flex gap-5 px-2 xl:w-[352px] sm:w-[392px] md:w-[309px]"
                      >
                        <img
                          src="../assets/images/checkout/sanpham1.png"
                          alt=""
                          class="w-12 h-12"
                        />
                        <div class="px-1">
                          <h3 class="font-bold">Product Name NameName</h3>
                          <p>Size: <span>S</span></p>
                          <div class="lg:hidden flex mt-2">
                            <button
                              class="pl-3 border border-r-0 border-blackL rounded-s-lg text-sm"
                            >
                              <i class="fa-solid fa-minus"></i>
                            </button>
                            <input
                              type="number"
                              id="numberInput"
                              value="1"
                              class="w-9 h-7 border-y focus:ring-0 focus:outline-none text-center border-blackL"
                            />
                            <button
                              class="pr-3 border border-l-0 border-blackL rounded-e-lg text-sm"
                            >
                              <i class="fa-solid fa-plus"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td class="xl:w-24 sm:w-15 w-10 px-5">$50.00</td>
                    <td class="hidden lg:block">
                      <div class="border rounded-lg border-black xl:mx-5">
                        <button class="py-1 pl-3">
                          <i class="fa-solid fa-minus"></i>
                        </button>
                        <input
                          type="number"
                          id="numberInput"
                          value="1"
                          class="w-9 h-10 border-0 focus:ring-0 focus:outline-none text-center"
                        />
                        <button class="py-1 pr-3">
                          <i class="fa-solid fa-plus"></i>
                        </button>
                      </div>
                    </td>
                    <td class="xl:w-24 sm:w-15 w-10">$50.00</td>
                    <td class="px-1">
                      <button>
                        <i
                          class="fa-regular fa-trash-can"
                          style="color: #db5151"
                        ></i>
                      </button>
                    </td>
                  </tr>
                  <tr class="*:py-8">
                    <td>
                      <div
                        class="flex gap-5 px-2 xl:w-[352px] sm:w-[392px] md:w-[309px]"
                      >
                        <img
                          src="../assets/images/checkout/sanpham1.png"
                          alt=""
                          class="w-12 h-12"
                        />
                        <div class="px-1">
                          <h3 class="font-bold">Product Name NameName</h3>
                          <p>Size: <span>S</span></p>
                          <div class="lg:hidden flex mt-2">
                            <button
                              class="pl-3 border border-r-0 border-blackL rounded-s-lg text-sm"
                            >
                              <i class="fa-solid fa-minus"></i>
                            </button>
                            <input
                              type="number"
                              id="numberInput"
                              value="1"
                              class="w-9 h-7 border-y focus:ring-0 focus:outline-none text-center border-blackL"
                            />
                            <button
                              class="pr-3 border border-l-0 border-blackL rounded-e-lg text-sm"
                            >
                              <i class="fa-solid fa-plus"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td class="xl:w-24 sm:w-15 w-10 px-5">$50.00</td>
                    <td class="hidden lg:block">
                      <div class="border rounded-lg border-black xl:mx-5">
                        <button class="py-1 pl-3">
                          <i class="fa-solid fa-minus"></i>
                        </button>
                        <input
                          type="number"
                          id="numberInput"
                          value="1"
                          class="w-9 h-10 border-0 focus:ring-0 focus:outline-none text-center"
                        />
                        <button class="py-1 pr-3">
                          <i class="fa-solid fa-plus"></i>
                        </button>
                      </div>
                    </td>
                    <td class="xl:w-24 sm:w-15 w-10">$50.00</td>
                    <td class="px-1">
                      <button>
                        <i
                          class="fa-regular fa-trash-can"
                          style="color: #db5151"
                        ></i>
                      </button>
                    </td>
                  </tr>
                  <tr class="*:py-8">
                    <td>
                      <div
                        class="flex gap-5 px-2 xl:w-[352px] sm:w-[392px] md:w-[309px]"
                      >
                        <img
                          src="../assets/images/checkout/sanpham1.png"
                          alt=""
                          class="w-12 h-12"
                        />
                        <div class="px-1">
                          <h3 class="font-bold">Product Name NameName</h3>
                          <p>Size: <span>S</span></p>
                          <div class="lg:hidden flex mt-2">
                            <button
                              class="pl-3 border border-r-0 border-blackL rounded-s-lg text-sm"
                            >
                              <i class="fa-solid fa-minus"></i>
                            </button>
                            <input
                              type="number"
                              id="numberInput"
                              value="1"
                              class="w-9 h-7 border-y focus:ring-0 focus:outline-none text-center border-blackL"
                            />
                            <button
                              class="pr-3 border border-l-0 border-blackL rounded-e-lg text-sm"
                            >
                              <i class="fa-solid fa-plus"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td class="xl:w-24 sm:w-15 w-10 px-5">$50.00</td>
                    <td class="hidden lg:block">
                      <div class="border rounded-lg border-black xl:mx-5">
                        <button class="py-1 pl-3">
                          <i class="fa-solid fa-minus"></i>
                        </button>
                        <input
                          type="number"
                          id="numberInput"
                          value="1"
                          class="w-9 h-10 border-0 focus:ring-0 focus:outline-none text-center"
                        />
                        <button class="py-1 pr-3">
                          <i class="fa-solid fa-plus"></i>
                        </button>
                      </div>
                    </td>
                    <td class="xl:w-24 sm:w-15 w-10">$50.00</td>
                    <td class="px-1">
                      <button>
                        <i
                          class="fa-regular fa-trash-can"
                          style="color: #db5151"
                        ></i>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="lg:col-span-4 col-span-6">
              <div class="border px-4 py-1 lg:w-[359px] rounded-md">
                <div
                  class="flex justify-between font-bold border-hrBlack border-b py-4"
                >
                  <h4>Subtotal</h4>
                  <span class="px-2">$200.00</span>
                </div>
                <div class="py-4">
                  <label class="text-xs">Enter Discount Code</label><br />

                  <div class="flex">
                    <input
                      type="text"
                      placeholder="FLAT50"
                      class="lg:w-[218px] w-[300px] h-[56px] px-4 rounded-s-lg focus:outline-none border border-l-2 border-t-2 border-blackL border-r-0"
                    />
                    <button
                      class="bg-black hover:bg-stone-700 w-[101px] h-[55px] border border-black rounded-r-lg text-white"
                    >
                      Apply
                    </button>
                  </div>

                  <div
                    class="py-4 flex justify-between font-medium border-b border-hrBlack"
                  >
                    <p>Delivery Charge</p>
                    <span class="px-2">$5.00</span>
                  </div>
                </div>
                <div class="flex justify-between font-bold mb-8">
                  <h4>Grand Total</h4>
                  <span>$205.00</span>
                </div>
                <div class="flex justify-center">
                  <a href="shippingaddress.html"
                    ><button
                      class="btn-black rounded-lg mb-4 w-[320px] h-[56px]"
                    >
                      Proceed to Checkout
                    </button></a
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
    </section>
  )
}

export default CheckOut