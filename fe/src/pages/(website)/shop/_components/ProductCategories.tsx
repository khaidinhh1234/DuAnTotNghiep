import { sanPham2 } from "@/assets/img";
import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";

const ProductCategories = () => {
  const [showcate, setShowcate] = useState(true);
  const [showcolor, setShowcolor] = useState(false);
  const [showprice, setShowprice] = useState(false);
  const [showsize, setShowsize] = useState(false);

  return (
    <div>
      {" "}
      <section>
        <div className="container">
          <div className="flex flex-wrap sm:mx-10 items-start w-full">
            {/* <!-- Sidebar Filters --> */}
            <button className="lg:hidden w-0.5/4 py-3 px-1 pl-4 mb-4 lg:mb-0">
              <i className="fa-solid fa-layer-group text-2xl hover:text-black text-gray-500"></i>
            </button>
            <div className="lg:block hidden w-1/4 py-4 px-5 mb-4 lg:mb-0">
              {/* <!-- Product Categories --> */}
              <div className="mb-5">
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => setShowcate(!showcate)}
                >
                  <h2 className="font-bold mb-2 text-lg">Danh mục sản phẩm</h2>
                  <button className="mr-3">
                    {showcate ? (
                      <i className="fa-solid fa-chevron-up"></i>
                    ) : (
                      <i className="fa-solid fa-chevron-down"></i>
                    )}
                  </button>
                </div>
                {showcate ? (
                  <div className="mt-7">
                    <div className="flex justify-between items-center my-4">
                      <label className="flex">
                        <input type="checkbox" className="mr-2" /> Nam
                      </label>
                      <i className="fa-solid fa-plus mr-3"></i>
                    </div>
                    <div className="flex justify-between items-center my-4">
                      <label className="flex">
                        <input type="checkbox" className="mr-2" /> Nữ
                      </label>
                      <i className="fa-solid fa-plus mr-3"></i>
                    </div>
                    <div className="flex justify-between items-center my-4">
                      <label className="flex">
                        <input type="checkbox" className="mr-2" /> Trẻ em
                      </label>
                      <i className="fa-solid fa-plus mr-3"></i>
                    </div>
                    <div className="flex justify-between items-center my-4">
                      <label className="flex">
                        <input type="checkbox" className="mr-2" /> Túi Xách
                      </label>
                    </div>
                    <div className="flex justify-between items-center my-4">
                      <label className="flex">
                        <input type="checkbox" className="mr-2" /> Thắt lưng
                      </label>
                    </div>
                    <div className="flex justify-between items-center my-4">
                      <label className="flex">
                        <input type="checkbox" className="mr-2" /> Ví
                      </label>
                    </div>
                    <div className="flex justify-between items-center my-4">
                      <label className="flex">
                        <input type="checkbox" className="mr-2" /> Đồng Hồ
                      </label>
                    </div>
                    <div className="flex justify-between items-center my-4">
                      <label className="flex">
                        <input type="checkbox" className="mr-2" /> Phụ Kiện
                      </label>
                    </div>
                    <div className="flex justify-between items-center my-4">
                      <label className="flex">
                        <input type="checkbox" className="mr-2" /> Trang Phục Mùa Đông
                      </label>
                    </div>
                  </div>
                ) : null}
              </div>

              {/* <!-- Filter by Price --> */}
              <div className="mb-5">
                <div
                  className=" flex justify-between items-center cursor-pointer"
                  onClick={() => setShowprice(!showprice)}
                >
                  <h2 className="font-bold text-lg mb-2">Lọc Theo Giá</h2>
                  <button className="mr-3">
                    {showprice ? (
                      <i className="fa-solid fa-chevron-up"></i>
                    ) : (
                      <i className="fa-solid fa-chevron-down"></i>
                    )}
                  </button>
                </div>

                {showprice ? (
                  <div>
                    <p className="my-4 font-medium">Price: 1$ - 2000$</p>
                    <div className="w-2/3">
                      <div className="range-container">
                        <div className="range-slider"></div>
                        <input
                          type="range"
                          min="0"
                          max="2000"
                          value="0"
                          className="range-input"
                          id="range1"
                        />
                        <input
                          type="range"
                          min="0"
                          max="2000"
                          value="2000"
                          className="range-input"
                          id="range2"
                        />
                      </div>
                    </div>{" "}
                  </div>
                ) : null}
              </div>

              {/* <!-- Filter by Color --> */}
              <div className="mb-5">
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => setShowcolor(!showcolor)}
                >
                  <h2 className="font-bold text-lg mb-2">Lọc Theo Màu Sắc</h2>
                  <button className="mr-3">
                    {showcolor ? (
                      <i className="fa-solid fa-chevron-up"></i>
                    ) : (
                      <i className="fa-solid fa-chevron-down"></i>
                    )}
                  </button>
                </div>
                {showcolor ? (
                  <div className="flex flex-col mb-12">
                    <div className="flex justify-between items-center mt-3">
                      <div className="flex items-center font-semibold">
                        <span className="w-6 h-6  bg-red-500 inline-block mr-2 rounded-[4px]"></span>
                        <span>Red</span>
                      </div>
                      <span className="px-3"> (10)</span>
                    </div>
                    <div className="flex justify-between items-center mt-3">
                      <div className="flex items-center font-semibold">
                        <span className="w-6 h-6 bg-blue-500 inline-block mr-2 rounded-[4px]"></span>
                        <span>Blue </span>
                      </div>
                      <span className="px-3"> (14)</span>
                    </div>
                    <div className="flex justify-between items-center mt-3">
                      <div className="flex items-center font-semibold">
                        <span className="w-6 h-6 bg-orange-500 inline-block mr-2 rounded-[4px]"></span>
                        <span>Orange </span>
                      </div>
                      <span className="px-3"> (8)</span>
                    </div>
                    <div className="flex justify-between items-center mt-3">
                      <div className="flex items-center font-semibold">
                        <span className="w-6 h-6 bg-black inline-block mr-2 rounded-[4px]"></span>
                        <span>Black </span>
                      </div>
                      <span className="px-3"> (9)</span>
                    </div>
                    <div className="flex justify-between items-center mt-3">
                      <div className="flex items-center font-semibold">
                        <span className="w-6 h-6 bg-green-500 inline-block mr-2 rounded-[4px]"></span>
                        <span>Green </span>
                      </div>
                      <span className="px-3"> (4)</span>
                    </div>
                    <div className="flex justify-between items-center mt-3">
                      <div className="flex items-center font-semibold">
                        <span className="w-6 h-6 bg-yellow-500 inline-block mr-2 rounded-[4px]"></span>
                        <span>Yellow </span>
                      </div>
                      <span className="px-3"> (2)</span>
                    </div>
                  </div>
                ) : null}
              </div>

              {/* <!-- Filter by Size --> */}
              <div className="mb-4 mr-3">
                <div
                  className="flex justify-between items-center"
                  onClick={() => setShowsize(!showsize)}
                >
                  <h2 className="font-bold text-lg mb-2">Lọc Theo Kích Cỡ</h2>
                  {showsize ? (
                    <i className="fa-solid fa-chevron-up"></i>
                  ) : (
                    <i className="fa-solid fa-chevron-down"></i>
                  )}
                </div>
                {showsize ? (
                  <div>
                    <div className="flex justify-between items-center my-4 ">
                      <label className="flex font-normal">
                        <input type="checkbox" className="mr-2" /> S
                      </label>
                      <span>(6)</span>
                    </div>
                    <div className="flex justify-between items-center my-4">
                      <label className="flex font-normal">
                        <input type="checkbox" className="mr-2" /> M
                      </label>
                      <span>(20)</span>
                    </div>
                    <div className="flex justify-between items-center my-4">
                      <label className="flex font-normal">
                        <input type="checkbox" className="mr-2" /> L
                      </label>
                      <span>(7)</span>
                    </div>
                    <div className="flex justify-between items-center my-4">
                      <label className="flex font-normal">
                        <input type="checkbox" className="mr-2" /> XL
                      </label>
                      <span>(16)</span>
                    </div>
                    <div className="flex justify-between items-center my-4">
                      <label className="flex font-normal">
                        <input type="checkbox" className="mr-2" /> XXL
                      </label>
                      <span>(10)</span>
                    </div>
                    <div className="flex justify-between items-center my-4">
                      <label className="flex font-normal">
                        <input type="checkbox" className="mr-2" /> XXXL
                      </label>
                      <span>(2)</span>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
            {/* <!-- Product Listings --> */}
            <div className="sm:w-3/4 w-3/4 px-5">
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
                  Short by latest{" "}
                  <i className="fa-solid fa-chevron-down pl-1"></i>
                </div>
              </div>
              <section className="">
                <div className="container">
                  <div className="grid grid-cols-12 justify-center lg:gap-7 gap-14">
                    <div className="xl:col-span-4 lg:col-span-6 col-span-12 sm:col-span-6 mb-2 sm:w-[264px] w-[300px] mx-auto">
                      <div className="product-card hover:bg-zinc-100 relative group">
                        <div className="w-full sm:h-[332px] h-[400px] relative">
                          <a href="#">
                            <i className="fa-regular fa-star text-lg bg-white hover:bg-black hover:text-white w-12 h-12 flex items-center justify-center absolute top-5 right-6 btn invisible opacity-0 transition-opacity duration-300 rounded-full" />
                          </a>
                          <a href="#">
                            <i className="fa-solid fa-arrow-right-arrow-left text-lg bg-white hover:bg-black hover:text-white w-12 h-12 flex items-center justify-center absolute top-[70px] right-6 btn invisible opacity-0 transition-opacity duration-300 rounded-full" />
                          </a>
                          <Link to="#">
                            <i className="fa-regular fa-eye text-lg bg-white hover:bg-black hover:text-white w-12 h-12 flex items-center justify-center absolute top-[121px] right-6 btn invisible opacity-0 transition-opacity duration-300 rounded-full" />
                          </Link>
                          <img
                            src={sanPham2}
                            alt=""
                            className="sm:w-[270px] w-[300px] sm:h-[370px] h-[400px] ml-2"
                          />
                          <button className="hover:bg-blackL hover:text-white absolute sm:px-[75px] px-[93px] py-3 left-4 rounded-lg bottom-5 bg-white opacity-30 transition-opacity duration-300 group-hover:opacity-100">
                            Add to Cart
                          </button>
                        </div>
                        <div className="bg-white pt-4">
                          <a href="#">
                            <h5 className="font-bold sm:text-lg text-xl">
                              Allen Solly
                            </h5>
                          </a>
                          <p className="my-1 font-normal">
                            Women Texttured Handheld Bag
                          </p>
                          <p className="font-medium">
                            $80.00
                            <span className="text-black/20 line-through px-1">
                              $100.00
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="xl:col-span-4 lg:col-span-6 col-span-12 sm:col-span-6 mb-2 sm:w-[264px] w-[300px] mx-auto">
                      <div className="product-card hover:bg-zinc-100 relative group">
                        <div className="w-full sm:h-[332px] h-[400px] relative">
                          <a href="#">
                            <i className="fa-regular fa-star text-lg bg-white hover:bg-black hover:text-white w-12 h-12 flex items-center justify-center absolute top-5 right-6 btn invisible opacity-0 transition-opacity duration-300 rounded-full" />
                          </a>
                          <a href="#">
                            <i className="fa-solid fa-arrow-right-arrow-left text-lg bg-white hover:bg-black hover:text-white w-12 h-12 flex items-center justify-center absolute top-[70px] right-6 btn invisible opacity-0 transition-opacity duration-300 rounded-full" />
                          </a>
                          <Link to="#">
                            <i className="fa-regular fa-eye text-lg bg-white hover:bg-black hover:text-white w-12 h-12 flex items-center justify-center absolute top-[121px] right-6 btn invisible opacity-0 transition-opacity duration-300 rounded-full" />
                          </Link>
                          <img
                            src={sanPham2}
                            alt=""
                            className="sm:w-[270px] w-[300px] sm:h-[370px] h-[400px] ml-2"
                          />
                          <button className="hover:bg-blackL hover:text-white absolute sm:px-[75px] px-[93px] py-3 left-4 rounded-lg bottom-5 bg-white opacity-30 transition-opacity duration-300 group-hover:opacity-100">
                            Add to Cart
                          </button>
                        </div>
                        <div className="bg-white pt-4">
                          <a href="#">
                            <h5 className="font-bold sm:text-lg text-xl">
                              Allen Solly
                            </h5>
                          </a>
                          <p className="my-1 font-normal">
                            Women Texttured Handheld Bag
                          </p>
                          <p className="font-medium">
                            $80.00
                            <span className="text-black/20 line-through px-1">
                              $100.00
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="xl:col-span-4 lg:col-span-6 col-span-12 sm:col-span-6 mb-2 sm:w-[264px] w-[300px] mx-auto">
                      <div className="product-card hover:bg-zinc-100 relative group">
                        <div className="w-full sm:h-[332px] h-[400px] relative">
                          <a href="#">
                            <i className="fa-regular fa-star text-lg bg-white hover:bg-black hover:text-white w-12 h-12 flex items-center justify-center absolute top-5 right-6 btn invisible opacity-0 transition-opacity duration-300 rounded-full" />
                          </a>
                          <a href="#">
                            <i className="fa-solid fa-arrow-right-arrow-left text-lg bg-white hover:bg-black hover:text-white w-12 h-12 flex items-center justify-center absolute top-[70px] right-6 btn invisible opacity-0 transition-opacity duration-300 rounded-full" />
                          </a>
                          <Link to="#">
                            <i className="fa-regular fa-eye text-lg bg-white hover:bg-black hover:text-white w-12 h-12 flex items-center justify-center absolute top-[121px] right-6 btn invisible opacity-0 transition-opacity duration-300 rounded-full" />
                          </Link>
                          <img
                            src={sanPham2}
                            alt=""
                            className="sm:w-[270px] w-[300px] sm:h-[370px] h-[400px] ml-2"
                          />
                          <button className="hover:bg-blackL hover:text-white absolute sm:px-[75px] px-[93px] py-3 left-4 rounded-lg bottom-5 bg-white opacity-30 transition-opacity duration-300 group-hover:opacity-100">
                            Add to Cart
                          </button>
                        </div>
                        <div className="bg-white pt-4">
                          <a href="#">
                            <h5 className="font-bold sm:text-lg text-xl">
                              Allen Solly
                            </h5>
                          </a>
                          <p className="my-1 font-normal">
                            Women Texttured Handheld Bag
                          </p>
                          <p className="font-medium">
                            $80.00
                            <span className="text-black/20 line-through px-1">
                              $100.00
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="xl:col-span-4 lg:col-span-6 col-span-12 sm:col-span-6 mb-2 sm:w-[264px] w-[300px] mx-auto">
                      <div className="product-card hover:bg-zinc-100 relative group">
                        <div className="w-full sm:h-[332px] h-[400px] relative">
                          <a href="#">
                            <i className="fa-regular fa-star text-lg bg-white hover:bg-black hover:text-white w-12 h-12 flex items-center justify-center absolute top-5 right-6 btn invisible opacity-0 transition-opacity duration-300 rounded-full" />
                          </a>
                          <a href="#">
                            <i className="fa-solid fa-arrow-right-arrow-left text-lg bg-white hover:bg-black hover:text-white w-12 h-12 flex items-center justify-center absolute top-[70px] right-6 btn invisible opacity-0 transition-opacity duration-300 rounded-full" />
                          </a>
                          <Link to="#">
                            <i className="fa-regular fa-eye text-lg bg-white hover:bg-black hover:text-white w-12 h-12 flex items-center justify-center absolute top-[121px] right-6 btn invisible opacity-0 transition-opacity duration-300 rounded-full" />
                          </Link>
                          <img
                            src={sanPham2}
                            alt=""
                            className="sm:w-[270px] w-[300px] sm:h-[370px] h-[400px] ml-2"
                          />
                          <button className="hover:bg-blackL hover:text-white absolute sm:px-[75px] px-[93px] py-3 left-4 rounded-lg bottom-5 bg-white opacity-30 transition-opacity duration-300 group-hover:opacity-100">
                            Add to Cart
                          </button>
                        </div>
                        <div className="bg-white pt-4">
                          <a href="#">
                            <h5 className="font-bold sm:text-lg text-xl">
                              Allen Solly
                            </h5>
                          </a>
                          <p className="my-1 font-normal">
                            Women Texttured Handheld Bag
                          </p>
                          <p className="font-medium">
                            $80.00
                            <span className="text-black/20 line-through px-1">
                              $100.00
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="xl:col-span-4 lg:col-span-6 col-span-12 sm:col-span-6 mb-2 sm:w-[264px] w-[300px] mx-auto">
                      <div className="product-card hover:bg-zinc-100 relative group">
                        <div className="w-full sm:h-[332px] h-[400px] relative">
                          <a href="#">
                            <i className="fa-regular fa-star text-lg bg-white hover:bg-black hover:text-white w-12 h-12 flex items-center justify-center absolute top-5 right-6 btn invisible opacity-0 transition-opacity duration-300 rounded-full" />
                          </a>
                          <a href="#">
                            <i className="fa-solid fa-arrow-right-arrow-left text-lg bg-white hover:bg-black hover:text-white w-12 h-12 flex items-center justify-center absolute top-[70px] right-6 btn invisible opacity-0 transition-opacity duration-300 rounded-full" />
                          </a>
                          <Link to="#">
                            <i className="fa-regular fa-eye text-lg bg-white hover:bg-black hover:text-white w-12 h-12 flex items-center justify-center absolute top-[121px] right-6 btn invisible opacity-0 transition-opacity duration-300 rounded-full" />
                          </Link>
                          <img
                            src={sanPham2}
                            alt=""
                            className="sm:w-[270px] w-[300px] sm:h-[370px] h-[400px] ml-2"
                          />
                          <button className="hover:bg-blackL hover:text-white absolute sm:px-[75px] px-[93px] py-3 left-4 rounded-lg bottom-5 bg-white opacity-30 transition-opacity duration-300 group-hover:opacity-100">
                            Add to Cart
                          </button>
                        </div>
                        <div className="bg-white pt-4">
                          <a href="#">
                            <h5 className="font-bold sm:text-lg text-xl">
                              Allen Solly
                            </h5>
                          </a>
                          <p className="my-1 font-normal">
                            Women Texttured Handheld Bag
                          </p>
                          <p className="font-medium">
                            $80.00
                            <span className="text-black/20 line-through px-1">
                              $100.00
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="xl:col-span-4 lg:col-span-6 col-span-12 sm:col-span-6 mb-2 sm:w-[264px] w-[300px] mx-auto">
                      <div className="product-card hover:bg-zinc-100 relative group">
                        <div className="w-full sm:h-[332px] h-[400px] relative">
                          <a href="#">
                            <i className="fa-regular fa-star text-lg bg-white hover:bg-black hover:text-white w-12 h-12 flex items-center justify-center absolute top-5 right-6 btn invisible opacity-0 transition-opacity duration-300 rounded-full" />
                          </a>
                          <a href="#">
                            <i className="fa-solid fa-arrow-right-arrow-left text-lg bg-white hover:bg-black hover:text-white w-12 h-12 flex items-center justify-center absolute top-[70px] right-6 btn invisible opacity-0 transition-opacity duration-300 rounded-full" />
                          </a>
                          <Link to="#">
                            <i className="fa-regular fa-eye text-lg bg-white hover:bg-black hover:text-white w-12 h-12 flex items-center justify-center absolute top-[121px] right-6 btn invisible opacity-0 transition-opacity duration-300 rounded-full" />
                          </Link>
                          <img
                            src={sanPham2}
                            alt=""
                            className="sm:w-[270px] w-[300px] sm:h-[370px] h-[400px] ml-2"
                          />
                          <button className="hover:bg-blackL hover:text-white absolute sm:px-[75px] px-[93px] py-3 left-4 rounded-lg bottom-5 bg-white opacity-30 transition-opacity duration-300 group-hover:opacity-100">
                            Add to Cart
                          </button>
                        </div>
                        <div className="bg-white pt-4">
                          <a href="#">
                            <h5 className="font-bold sm:text-lg text-xl">
                              Allen Solly
                            </h5>
                          </a>
                          <p className="my-1 font-normal">
                            Women Texttured Handheld Bag
                          </p>
                          <p className="font-medium">
                            $80.00
                            <span className="text-black/20 line-through px-1">
                              $100.00
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="xl:col-span-4 lg:col-span-6 col-span-12 sm:col-span-6 mb-2 sm:w-[264px] w-[300px] mx-auto">
                      <div className="product-card hover:bg-zinc-100 relative group">
                        <div className="w-full sm:h-[332px] h-[400px] relative">
                          <a href="#">
                            <i className="fa-regular fa-star text-lg bg-white hover:bg-black hover:text-white w-12 h-12 flex items-center justify-center absolute top-5 right-6 btn invisible opacity-0 transition-opacity duration-300 rounded-full" />
                          </a>
                          <a href="#">
                            <i className="fa-solid fa-arrow-right-arrow-left text-lg bg-white hover:bg-black hover:text-white w-12 h-12 flex items-center justify-center absolute top-[70px] right-6 btn invisible opacity-0 transition-opacity duration-300 rounded-full" />
                          </a>
                          <Link to="#">
                            <i className="fa-regular fa-eye text-lg bg-white hover:bg-black hover:text-white w-12 h-12 flex items-center justify-center absolute top-[121px] right-6 btn invisible opacity-0 transition-opacity duration-300 rounded-full" />
                          </Link>
                          <img
                            src={sanPham2}
                            alt=""
                            className="sm:w-[270px] w-[300px] sm:h-[370px] h-[400px] ml-2"
                          />
                          <button className="hover:bg-blackL hover:text-white absolute sm:px-[75px] px-[93px] py-3 left-4 rounded-lg bottom-5 bg-white opacity-30 transition-opacity duration-300 group-hover:opacity-100">
                            Add to Cart
                          </button>
                        </div>
                        <div className="bg-white pt-4">
                          <a href="#">
                            <h5 className="font-bold sm:text-lg text-xl">
                              Allen Solly
                            </h5>
                          </a>
                          <p className="my-1 font-normal">
                            Women Texttured Handheld Bag
                          </p>
                          <p className="font-medium">
                            $80.00
                            <span className="text-black/20 line-through px-1">
                              $100.00
                            </span>
                          </p>
                        </div>
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
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductCategories;
