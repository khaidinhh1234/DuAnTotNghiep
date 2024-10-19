import React from "react";
import { Link } from "react-router-dom";
import { sanPham2 } from "@/assets/img";
const ProductsList = () => {
  return (
    <>
      <div className="flex justify-between sm:items-center items-start mb-4">
        <div className="sm:flex items-center mt-2">
          <div className="flex space-x-2">
            <button className="text-2xl rounded">
              <i className="fa-light fa-grid-2"></i>
            </button>
            <button className="text-2xl px-3 rounded">
              <i className="fa-light fa-line-height"></i>
            </button>
          </div>
          <div>
            <p className="text-gray-700">
              Showing
              <span className="font-medium">1</span>
              to
              <span className="font-medium">10</span>
              of
              <span className="font-medium">97</span>
              results
            </p>
          </div>
        </div>
        <div className="w-0.5/4 sm:text-base text-sm flex items-center">
          Short by latest <i className="fa-solid fa-chevron-down pl-1"></i>
        </div>
      </div>
      <section className="">
        <div className="container">
          <div className="grid grid-cols-12 justify-center lg:gap-7 gap-14">
            <div
              className="xl:col-span-3 lg:col-span-4 col-span-12 md:col-span-6 mb-2 lg:w-[300px] w-[350px] mx-auto lg:mx-0"
              //   key={index}
            >
              {" "}
              <div className="product-card hover:bg-zinc-100 rounded-md shadow-lg shadow-black/10">
                <div className="relative lg:w-full w-[350px] lg:h-[385px] h-[400px]">
                  <a href="#">
                    <i className="z-20 fa-regular fa-heart text-xl pt-1 bg-white hover:bg-black hover:text-white w-11 h-11 flex items-center justify-center absolute top-3 right-6 btn invisible opacity-0 transition-opacity duration-300 rounded-full" />
                  </a>
                  <a href="#">
                    <i className="z-20 fa-solid fa-arrow-right-arrow-left text-lg bg-white hover:bg-black hover:text-white w-11 h-11 flex items-center justify-center absolute top-[63px] right-6 btn invisible opacity-0 transition-opacity duration-300 rounded-full" />
                  </a>
                  {/* <View id={product.id} /> */}
                  {/* <Link to={`/product-detail/${product.id}`}> */}
                  <div className="relative">
                    <img
                      // src={product?.anh_san_pham}
                      src={sanPham2}
                      alt=""
                      className="lg:w-[300px] w-[500px] lg:h-[380px] h-[400px] rounded-t-md"
                    />
                    {/* {product?.gia_tot == 1 && ( */}
                    <span className="absolute top-3 right-3 bg-red-500 text-white px-3 py-[2px] rounded-lg font-bold">
                      new
                    </span>
                    {/* )} */}
                  </div>{" "}
                  {/* </Link> */}
                  {/* <button className="hover:bg-blackL hover:text-white absolute lg:px-[65px]  px-[90px] py-3 left-4 rounded-lg bottom-5 bg-white invisible opacity-30 transition-opacity btn duration-300">
                      Thêm vào giỏ hàng
                    </button> */}
                </div>
                {/* <Link to={`/product-detail/${product.id}`}> */}{" "}
                <div className="bg-slate-50 pt-4 px-4 rounded-md pb-2">
                  <h5 className=" text-base truncate w-60 font-medium">
                    {/* {product?.ten_san_pham} */}sdgfdfhgfh
                  </h5>

                  <p className="font-semibold text-lg">
                    {/* {(product?.gia_thap_nhat).toLocaleString("vi-VN") ?? 0}{" "} */}
                    sdfsdgsdg đ
                    <i className="fa-solid fa-minus text-sm mx-1 text-slate-500"></i>
                    {/* {(product?.gia_thap_nhat).toLocaleString("vi-VN") ?? 0}{" "} */}
                    sdfsdgfsdfg đ
                  </p>

                  <p className="font-bold text-lg flex items-center">
                    {" "}
                    {/* {product?.bien_the?.map((item: any, index: any) => (
                          <button
                            key={index}
                            className="w-7 h-7 rounded-full border-1 inline-block mr-1"
                            style={{
                              backgroundColor: item?.ma_mau_sac,
                            }}
                          />
                        ))} */}
                  </p>
                </div>{" "}
                {/* </Link> */}
              </div>
            </div>
          </div>

          {/* <!-- Pagination --> */}
          <div className="flex justify-end mt-8">
            <div className="flex items-center justify-between border-gray-200 bg-white px-4 py-3 sm:px-6">
              <div className="flex flex-1 justify-between sm:hidden">
                <a
                  href="#"
                  className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Previous
                </a>
                <a
                  href="#"
                  className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Next
                </a>
              </div>
              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                  <nav
                    className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                    aria-label="Pagination"
                  >
                    <a
                      href="#"
                      className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                    >
                      <span className="sr-only">Previous</span>
                      <svg
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </a>
                    {/* <!-- Current: "z-10 bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600", Default: "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0" --> */}
                    <a
                      href="#"
                      aria-current="page"
                      className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                    >
                      1
                    </a>
                    <a
                      href="#"
                      className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                    >
                      2
                    </a>
                    <a
                      href="#"
                      className="relative hidden items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 md:inline-flex"
                    >
                      3
                    </a>
                    <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0">
                      ...
                    </span>
                    <a
                      href="#"
                      className="relative hidden items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 md:inline-flex"
                    >
                      8
                    </a>
                    <a
                      href="#"
                      className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                    >
                      9
                    </a>
                    <a
                      href="#"
                      className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                    >
                      10
                    </a>
                    <a
                      href="#"
                      className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                    >
                      <span className="sr-only">Next</span>
                      <svg
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </a>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ProductsList;
