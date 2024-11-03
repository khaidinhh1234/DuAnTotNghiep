// import React, { useEffect, useState } from 'react';
// import { useLocation } from 'react-router-dom';
// import instanceClient from '@/configs/client';

// const SearchResultsPage = () => {
//   const location = useLocation();
//   const [searchResults, setSearchResults] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Lấy query từ URL
//   const query = new URLSearchParams(location.search).get('query') || '';

//   useEffect(() => {
//     const fetchSearchResults = async () => {
//       setLoading(true);
//       setError(null);

//       if (query.trim()) {
//         try {
//           const response = await instanceClient.get(`/tim-kiem-goi-y?query=${encodeURIComponent(query)}`);
//           console.log("API Response:", response.data); // Kiểm tra dữ liệu trả về từ API
//           setSearchResults(response.data);
//         } catch (error) {
//           console.error("Lỗi khi tìm kiếm:", error);
//           setError("Không thể lấy dữ liệu.");
//         } finally {
//           setLoading(false);
//         }
//       } else {
//         setLoading(false);
//       }
//     };

//     fetchSearchResults();
//   }, [query]);

//   if (loading) return <div>Đang tải...</div>;
//   if (error) return <div>{error}</div>;

//   return (
//     <div>
//    <div className="container">
//   {products.map((product) => (
//     <div
//       className="xl:col-span-3 lg:col-span-4 col-span-12 md:col-span-6 mb-2 w-[250px] mx-auto lg:mx-0"
//       key={product.id}
//     >
//       <div className="product-card hover:bg-zinc-100 rounded-md shadow-lg shadow-black/10">
//         <div className="relative w-full h-[300px]">
//           {isPending ? (
//             <span>
//               <i className="z-10 fa-sharp-duotone fa-solid fa-loader fa-spin-pulse text-xl pt-1 bg-white hover:bg-black hover:text-white w-9 h-9 flex items-center justify-center absolute top-3 right-6 btn" />
//             </span>
//           ) : (
//             <span onClick={() => handleWishlist(product.id)}>
//               <i
//                 className={`${product.yeu_thich ? "text-red-500" : "text-black hover:text-white"} z-10 fa-solid fa-heart text-xl pt-1 bg-white hover:bg-black w-9 h-9 flex items-center justify-center absolute top-3 right-6 btn`}
//               />
//             </span>
//           )}
//           <Link
//             to={`/product-detail/${product.duong_dan}`}
//             onClick={() => setIsModalVisible(false)}
//           >
//             <div className="relative">
//               <img
//                 src={
//                   hoveredProductId === product.id && hoveredVariantIndex !== null
//                     ? product.mau_sac_va_anh?.[hoveredVariantIndex].hinh_anh
//                     : product.anh_san_pham
//                 }
//                 alt={product.ten_san_pham}
//                 className="w-full h-[300px] object-cover rounded-t-md"
//               />
//               {product.hang_moi === 1 && (
//                 <span className="absolute top-3 left-4 bg-red-500 text-white px-2 py-[2px] rounded-md text-sm font-bold">
//                   Mới
//                 </span>
//               )}
//             </div>
//             <div className="w-12 h-12 text-xs">
//               <View id={product?.duong_dan} ID={product?.id} />
//             </div>
//           </Link>
//         </div>
//         <div className="bg-slate-50 pt-3 px-3 rounded-md pb-2">
//           <Link
//             to={`/product-detail/${product.duong_dan}`}
//             onClick={() => setIsModalVisible(false)}
//           >
//             <h5 className="text-sm truncate w-full font-medium hover:text-red-500">
//               {product.ten_san_pham}
//             </h5>
//           </Link>
//           <p className="font-semibold text-base">
//             {product.gia_thap_nhat === product.gia_cao_nhat ? (
//               `${(product.gia_cao_nhat ?? 0).toLocaleString("vi-VN")} đ`
//             ) : (
//               <>
//                 {`${(product.gia_thap_nhat ?? 0).toLocaleString("vi-VN")} đ`}
//                 <i className="fa-solid fa-minus text-xs mx-1 text-slate-500"></i>
//                 {`${(product.gia_cao_nhat ?? 0).toLocaleString("vi-VN")} đ`}
//               </>
//             )}
//           </p>
//           <div className="font-bold text-base flex items-center">
//             {product.mau_sac_va_anh?.map((item, index) => (
//               <button
//                 key={index}
//                 className={`w-6 h-6 rounded-full border mr-1 ${
//                   hoveredProductId === product.id && hoveredVariantIndex === index
//                     ? "border-black"
//                     : "border-gray-300 hover:border-black"
//                 }`}
//                 style={{ backgroundColor: item.ma_mau_sac }}
//                 onMouseEnter={() => handleMouseEnter(product.id, index)}
//               />
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   ))}
// </div>

//     </div>
//   );
// };

// export default SearchResultsPage;
import { PaginationProps, Pagination } from "antd";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import View from "../../(website)/_component/View";
import instanceClient from "@/configs/client";

const SearchResultsPage = ({ Wishlist, isPending }: any) => {
  const location = useLocation();
  const [hoveredProductId, setHoveredProductId] = useState<number | null>(null);
  const [hoveredVariantIndex, setHoveredVariantIndex] = useState<number | null>(
    null
  );
  const [products, setProducts] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get query from URL
  const query = new URLSearchParams(location.search).get("query") || "";

  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true);
      setError(null);

      if (query.trim()) {
        try {
          const response = await instanceClient.get(
            `/tim-kiem-goi-y?query=${encodeURIComponent(query)}`
          );
          setProducts(response.data);
        } catch (err) {
          setError("Không thể lấy dữ liệu.");
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  const handleMouseEnter = (productId: number, variantIndex: number) => {
    setHoveredProductId(productId);
    setHoveredVariantIndex(variantIndex);
  };

  const handleWishlist = (id: number) => {
    Wishlist(id);
  };

  const itemRender: PaginationProps["itemRender"] = (
    _,
    type,
    originalElement
  ) => {
    if (type === "prev") return <a>Trước</a>;
    if (type === "next") return <a>Tiếp</a>;
    return originalElement;
  };

  const onChange = (page: number, newPageSize: number) => {
    setCurrentPage(page);
    setPageSize(newPageSize);
  };

  // Calculate displayed products
  const startIndex = (currentPage - 1) * pageSize;
  const displayedProducts = products.slice(startIndex, startIndex + pageSize);

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>{error}</div>;

  return (
    <>
      <div className="mt-10"></div>
      <section>
        <div className="container">
          {" "}
          <h1 className="font-bold text-xl text-gray-600">
            Kết quả tìm kiếm cho
          </h1>
          <h2 className="font-bold text-xl text-gray-600">{query}</h2>
          <p className="text-gray-700 font-bold text-xl mt-10">
            {products.length} sản phẩm
          </p>
          <div className="grid grid-cols-12 justify-center lg:gap-20 gap-14 mx-auto">
            {displayedProducts.length > 0 ? (
              displayedProducts.map((product: any) => (
                <div
                  className="xl:col-span-3 lg:col-span-4 col-span-12 md:col-span-6 lg:w-[300px] w-[350px] mx-auto lg:mx-0"
                  key={product.id}
                >
                  <div className="product-card hover:bg-zinc-100 rounded-md shadow-lg shadow-black/10">
                    <div className="relative lg:w-full w-[350px] lg:h-[385px] h-[400px]">
                      {isPending ? (
                        <span>
                          <i className="z-20 fa-sharp-duotone fa-solid fa-loader fa-spin-pulse text-xl pt-1 bg-white hover:bg-black hover:text-white w-11 h-11 flex items-center justify-center absolute top-3 right-6 btn invisible opacity-0 transition-opacity duration-300 rounded-full" />
                        </span>
                      ) : (
                        <span onClick={() => handleWishlist(product.id)}>
                          <i
                            className={`z-10 fa-solid fa-heart text-xl pt-1 bg-white hover:bg-black hover:text-white w-11 h-11 flex items-center justify-center absolute top-3 right-6 btn invisible opacity-0 transition-opacity duration-300 rounded-full ${product.yeu_thich ? "text-red-500" : ""}`}
                          />
                        </span>
                      )}
                      <Link to={`/product-detail/${product?.duong_dan}`}>
                        <div className="relative">
                          <img
                            src={
                              hoveredProductId === product.id &&
                              hoveredVariantIndex !== null
                                ? product.mau_sac_va_anh[hoveredVariantIndex]
                                    .hinh_anh
                                : product.anh_san_pham
                            }
                            alt=""
                            className="lg:w-[300px] w-[500px] lg:h-[380px] h-[400px] rounded-t-md"
                          />
                          {product.hang_moi === 1 && (
                            <span className="absolute top-3 left-4 bg-red-500 text-white px-2 py-[2px] rounded-md text-sm font-bold">
                              Mới
                            </span>
                          )}
                        </div>
                      </Link>
                      <View id={product?.duong_dan} ID={product?.id} />
                    </div>
                    <div className="bg-slate-50 pt-4 px-4 rounded-md pb-2">
                      <h5 className="text-base truncate w-60 font-medium">
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
                        {product?.mau_sac_va_anh?.map(
                          (item: any, index: number) => (
                            <button
                              key={index}
                              className={`w-7 h-7 rounded-full border mr-1 ${
                                hoveredProductId === product?.id &&
                                hoveredVariantIndex === index
                                  ? "border-black"
                                  : "border-gray-300 hover:border-black"
                              }`}
                              style={{ backgroundColor: item?.ma_mau_sac }}
                              onMouseEnter={() =>
                                handleMouseEnter(product?.id, index)
                              }
                            />
                          )
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="w-full flex flex-col items-center justify-center col-span-12">
                <img
                  src="https://res.cloudinary.com/dcvu7e7ps/image/upload/v1729832531/m5xu2paczoiy6rmlu4vm.png"
                  alt="No products"
                  className="w-[500px] mb-4"
                />
                <span className="text-center font-bold text-2xl text-yellow-500">
                  Không có sản phẩm nào
                </span>
              </div>
            )}
          </div>
          <div className="flex justify-end mt-10">
            <Pagination
              total={products.length}
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

export default SearchResultsPage;
