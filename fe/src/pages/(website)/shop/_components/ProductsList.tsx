import type { PaginationProps } from "antd";
import { Pagination } from "antd";
import { useState } from "react";
import { Link } from "react-router-dom";
import View from "../../_component/View";
const ProductsList = ({ products, Wishlist, isPending }: any) => {
  const [hoveredProductId, setHoveredProductId] = useState<number | null>(null);
  const [hoveredVariantIndex, setHoveredVariantIndex] = useState<number | null>(
    null
  );
  const handleMouseEnter = (productId: number, variantIndex: any) => {
    setHoveredProductId(productId);
    setHoveredVariantIndex(variantIndex);
  };
  console.log(products);
  const handleWishlist = (id: any) => {
    Wishlist(id) as any;
  };
  const itemRender: PaginationProps["itemRender"] = (
    _,
    type,
    originalElement
  ) => {
    if (type === "prev") {
      return <a>Trước</a>;
    }
    if (type === "next") {
      return <a>Tiếp</a>;
    }

    return originalElement;
  };
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12); // Số lượng sản phẩm mỗi trang

  const onChange = (page: number, pageSize: number) => {
    setCurrentPage(page);
    setPageSize(pageSize);
    console.log(`Page: ${page}, PageSize: ${pageSize}`);
    // Thực hiện xử lý dữ liệu dựa trên trang và số lượng sản phẩm mỗi trang
  };
  return (
    <>
      <div className="flex justify-between sm:items-center items-start mb-4">
        <div className="sm:flex items-center mt-2">
          <div className="mx-5">
            <p className="text-gray-700">17 sản phẩm</p>
          </div>
        </div>
        <div className="w-0.5/4 sm:text-base text-sm flex items-center">
          Short by latest <i className="fa-solid fa-chevron-down pl-1"></i>
        </div>
      </div>
      <section className="">
        <div className="container">
          <div className="grid grid-cols-9 justify-center lg:gap-20 gap-14">
            {products &&
              products?.map((product: any, index: any) => (
                <div
                  className="xl:col-span-3 lg:col-span-4 col-span-12 md:col-span-6  lg:w-[300px] w-[350px] mx-auto lg:mx-0"
                  key={index}
                >
                  {" "}
                  <div className="product-card hover:bg-zinc-100 rounded-md shadow-lg shadow-black/10">
                    <div className="relative lg:w-full w-[350px] lg:h-[385px] h-[400px]">
                      {isPending ? (
                        <span>
                          <i className="z-20 fa-sharp-duotone fa-solid fa-loader fa-spin-pulse text-xl pt-1 bg-white hover:bg-black hover:text-white w-11 h-11 flex items-center justify-center absolute top-3 right-6 btn invisible opacity-0 transition-opacity duration-300 rounded-full" />
                        </span>
                      ) : (
                        <span onClick={() => handleWishlist(product.id)}>
                          <i className="z-20 fa-solid fa-heart text-xl pt-1 bg-white hover:bg-black hover:text-white w-11 h-11 flex items-center justify-center absolute top-3 right-6 btn invisible opacity-0 transition-opacity duration-300 rounded-full" />
                        </span>
                      )}
                      <a href="#">
                        <i className="z-20 fa-solid fa-arrow-right-arrow-left text-lg bg-white hover:bg-black hover:text-white w-11 h-11 flex items-center justify-center absolute top-[63px] right-6 btn invisible opacity-0 transition-opacity duration-300 rounded-full" />
                      </a>
                      <View id={product.duong_dan} />
                      <Link to={`/product-detail/${product.duong_dan}`}>
                        <div className="relative">
                          <img
                            src={
                              hoveredProductId === product.id &&
                              hoveredVariantIndex !== null
                                ? product.mau_sac_va_anh[hoveredVariantIndex]
                                    .hinh_anh
                                : product.anh_san_pham
                            }
                            // src={sanPham2}
                            alt=""
                            className="lg:w-[300px] w-[500px] lg:h-[380px] h-[400px] rounded-t-md"
                          />
                          {/* {product?.gia_tot == 1 && ( */}
                          {/* <span className="absolute top-3 right-3 bg-red-500 text-white px-3 py-[2px] rounded-lg font-bold">
                            new
                          </span> */}
                          {/* )} */}
                        </div>{" "}
                      </Link>
                      <View id={product?.duong_dan} />
                    </div>
                    <Link to={`/product-detail/${product.id}`}>
                      <div className="bg-slate-50 pt-4 px-4 rounded-md pb-2">
                        <h5 className=" text-base truncate w-60 font-medium">
                          {product?.ten_san_pham}
                        </h5>
                        <p className="font-semibold text-lg">
                          {product?.gia_thap_nhat === product?.gia_cao_nhat ? (
                            <>
                              {(product?.gia_cao_nhat ?? 0).toLocaleString(
                                "vi-VN"
                              )}{" "}
                              đ
                            </>
                          ) : (
                            <>
                              {(product?.gia_thap_nhat ?? 0).toLocaleString(
                                "vi-VN"
                              )}{" "}
                              đ
                              <i className="fa-solid fa-minus text-sm mx-1 text-slate-500"></i>
                              {(product?.gia_cao_nhat ?? 0).toLocaleString(
                                "vi-VN"
                              )}{" "}
                              đ
                            </>
                          )}
                        </p>

                        <p className="font-bold text-lg flex items-center">
                          {" "}
                          {product?.mau_sac_va_anh?.map(
                            (item: any, indexs: any) => (
                              <button
                                key={indexs}
                                className={`w-7 h-7 rounded-full border mr-1 
                             ${
                               hoveredProductId === product?.id &&
                               hoveredVariantIndex === indexs
                                 ? "border-black"
                                 : "border-gray-300 hover:border-black"
                             }`}
                                style={{
                                  backgroundColor: item?.ma_mau_sac,
                                }}
                                onMouseEnter={() =>
                                  handleMouseEnter(product?.id, indexs)
                                }
                              />
                            )
                          )}
                        </p>
                      </div>{" "}
                    </Link>
                  </div>
                </div>
              ))}
          </div>

          {/* <!-- Pagination --> */}
          <div className="flex justify-end mt-10">
            <Pagination
              total={100}
              current={currentPage}
              pageSize={pageSize}
              itemRender={itemRender}
              onChange={onChange}
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default ProductsList;
