import { sanPham2 } from "@/assets/img";
import { useState } from "react";
import { Link } from "react-router-dom";
import ProductsList from "./ProductsList";
import { useQuery } from "@tanstack/react-query";
import instanceClient from "@/configs/client";

const ProductCategories = ({ handleWishlist, isPending }: any) => {
  const [showcate, setShowcate] = useState(true);
  const [showcolor, setShowcolor] = useState(false);
  const [showprice, setShowprice] = useState(false);
  const [showsize, setShowsize] = useState(false);
  const { data } = useQuery({
    queryKey: ["PRODUCTSSHOP_KEYS"],
    queryFn: async () => {
      try {
        const response = await instanceClient.get("san-pham-all");
        if (response.data.status_code !== 200) {
          throw new Error("Error fetching product");
        }
        return response.data;
      } catch (error) {
        throw new Error("Lỗi khi lấy thông tin");
      }
    },
  });
  const products = data?.data || [];
  // console.log(products);
  return (
    <div>
      {" "}
      <section>
        <div className="container">
          <div className="flex flex-wrap items-start w-full">
            {/* <!-- Sidebar Filters --> */}
            <button className="lg:hidden w-0.5/4 py-3 px-1 pl-4 mb-4 lg:mb-0">
              <i className="fa-solid fa-layer-group text-2xl hover:text-black text-gray-500"></i>
            </button>
            <div className="lg:block hidden w-1/5 py-4  mb-4 lg:mb-0">
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
                        <input type="checkbox" className="mr-2" /> Trang Phục
                        Mùa Đông
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
            <div className="sm:w-4/5 w-3/4 px-5">
              <ProductsList
                products={products}
                Wishlist={handleWishlist}
                isPending={isPending}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductCategories;
