// // // import { SearchOutlined } from "@ant-design/icons";
// // // import { Input, Modal, message } from "antd";
// // // import { useEffect, useState, useCallback } from "react";
// // // import { Link } from "react-router-dom";
// // // import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// // // import instanceClient from "@/configs/client";
// // // import View from "./View";
// // // import debounce from "lodash/debounce";

// // // interface SearchResult {
// // //   id: number;
// // //   danh_muc_id: number;
// // //   ten_san_pham: string;
// // //   anh_san_pham: string;
// // //   ma_san_pham: string;
// // //   duong_dan: string;
// // //   mo_ta_ngan: string;
// // //   noi_dung: string;
// // //   luot_xem: number;
// // //   trang_thai: number;
// // //   gia_tot: number;
// // //   hang_moi: number;
// // //   created_at: string;
// // //   updated_at: string;
// // //   deleted_at: null;
// // //   yeu_thich?: boolean;
// // //   gia_thap_nhat?: number;
// // //   gia_cao_nhat?: number;
// // //   mau_sac_va_anh?: Array<{
// // //     ma_mau_sac: string;
// // //     hinh_anh: string;
// // //   }>;
// // // }

// // // const Search = () => {
// // //   const queryClient = useQueryClient();
// // //   const [isModalVisible, setIsModalVisible] = useState(false);
// // //   const [searchValue, setSearchValue] = useState("");
// // //   const [searchHistory, setSearchHistory] = useState<string[]>([]);
// // //   const [hoveredProductId, setHoveredProductId] = useState<number | null>(null);
// // //   const [hoveredVariantIndex, setHoveredVariantIndex] = useState<number | null>(
// // //     null
// // //   );

// // //   const handleMouseEnter = (productId: number, variantIndex: number) => {
// // //     setHoveredProductId(productId);
// // //     setHoveredVariantIndex(variantIndex);
// // //   };

// // //   const { data: searchResults, refetch } = useQuery({
// // //     queryKey: ["search", searchValue],
// // //     queryFn: async () => {
// // //       if (!searchValue.trim()) return [];
// // //       const response = await instanceClient.get(
// // //         `/tim-kiem-goi-y?query=${encodeURIComponent(searchValue)}`
// // //       );
// // //       return response.data;
// // //     },
// // //     enabled: false,
// // //   });

// // //   useEffect(() => {
// // //     const savedHistory = localStorage.getItem("searchHistory");
// // //     if (savedHistory) {
// // //       setSearchHistory(JSON.parse(savedHistory));
// // //     }
// // //   }, []);

// // //   const handleSearch = async (value: string) => {
// // //     setSearchValue(value);
// // //     if (value.trim()) {
// // //       const results = await refetch();
// // //       if (results.data?.length > 0 && !searchHistory.includes(value.trim())) {
// // //         const newHistory = [value.trim(), ...searchHistory.slice(0, 9)];
// // //         setSearchHistory(newHistory);
// // //         localStorage.setItem("searchHistory", JSON.stringify(newHistory));
// // //       }
// // //     }
// // //   };
// // //   const debouncedSearch = useCallback(
// // //     debounce((value: string) => handleSearch(value), 300),
// // //     [searchHistory]
// // //   );
// // //   const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
// // //     const value = e.target.value;
// // //     setSearchValue(value);
// // //     debouncedSearch(value);
// // //   };

// // //   const clearHistory = () => {
// // //     setSearchHistory([]);
// // //     localStorage.removeItem("searchHistory");
// // //   };

// // //   const renderProductCard = (product: SearchResult) => (
// // //     <div className="container">
// // //       <div
// // //         className="xl:col-span-3 lg:col-span-4 col-span-12 md:col-span-6 mb-2 w-[250px] mx-auto lg:mx-0"
// // //         key={product.id}
// // //       >
// // //         <div className="product-card hover:bg-zinc-100 rounded-md shadow-lg shadow-black/10">
// // //           <div className="relative w-full h-[300px] ">
// // //             {/* {isPending ? (
// // //               <span>
// // //                 <i className="z-10 fa-sharp-duotone fa-solid fa-loader fa-spin-pulse text-xl pt-1 bg-white hover:bg-black hover:text-white w-9 h-9 flex items-center justify-center absolute top-3 right-6 btn invisible opacity-0 transition-opacity duration-300 rounded-full" />
// // //               </span>
// // //             ) : (
// // //               <span onClick={() => mutate(product.id)}>
// // //                 <i className={`${product.yeu_thich ? "text-red-500" : "text-black hover:text-white"} z-10 fa-solid fa-heart text-xl pt-1 bg-white hover:bg-black w-9 h-9 flex items-center justify-center absolute top-3 right-6 btn invisible opacity-0 transition-opacity duration-300 rounded-full`} />
// // //               </span>
// // //             )} */}

// // //             <Link
// // //               to={`/product-detail/${product.duong_dan}`}
// // //               onClick={() => setIsModalVisible(false)}
// // //             >
// // //               <div className="relative ">
// // //                 <img
// // //                   src={
// // //                     hoveredProductId === product.id &&
// // //                     hoveredVariantIndex !== null
// // //                       ? product.mau_sac_va_anh?.[hoveredVariantIndex].hinh_anh
// // //                       : product.anh_san_pham
// // //                   }
// // //                   alt=""
// // //                   className="w-full h-[300px] object-cover rounded-t-md"
// // //                 />
// // //                 {product.hang_moi === 1 && (
// // //                   <span className="absolute top-3 left-4 bg-red-500 text-white px-2 py-[2px] rounded-md text-sm font-bold">
// // //                     Mới
// // //                   </span>
// // //                 )}
// // //               </div>
// // //               {/* <div className="w-12 h-12 text-xs">
// // //                 <View id={product?.duong_dan} ID={product?.id} />
// // //               </div> */}
// // //             </Link>
// // //           </div>

// // //           <div className="bg-slate-50 pt-3 px-3 rounded-md pb-5">
// // //             <Link
// // //               to={`/product-detail/${product.duong_dan}`}
// // //               onClick={() => setIsModalVisible(false)}
// // //             >
// // //               {" "}
// // //               <h5 className="text-lg truncate w-full font-medium hover:text-red-500 text-black">
// // //                 {product.ten_san_pham}
// // //               </h5>
// // //             </Link>

// // //             <p className="font-semibold text-base">
// // //               {product.gia_thap_nhat === product.gia_cao_nhat ? (
// // //                 `${(product.gia_cao_nhat ?? 0).toLocaleString("vi-VN")} đ`
// // //               ) : (
// // //                 <>
// // //                   {`${(product.gia_thap_nhat ?? 0).toLocaleString("vi-VN")} đ`}
// // //                   <i className="fa-solid fa-minus text-xs mx-1 text-slate-500"></i>
// // //                   {`${(product.gia_cao_nhat ?? 0).toLocaleString("vi-VN")} đ`}
// // //                 </>
// // //               )}
// // //             </p>

// // //             <div className="font-bold text-base flex items-center m ">
// // //               {product.mau_sac_va_anh?.map((item, index) => (
// // //                 <button
// // //                   key={index}
// // //                   className={`w-6 h-6 rounded-full border mr-1 ${
// // //                     hoveredProductId === product.id &&
// // //                     hoveredVariantIndex === index
// // //                       ? "border-black"
// // //                       : "border-gray-300 hover:border-black"
// // //                   }`}
// // //                   style={{ backgroundColor: item.ma_mau_sac }}
// // //                   onMouseEnter={() => handleMouseEnter(product.id, index)}
// // //                 />
// // //               ))}
// // //             </div>
// // //           </div>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // //   const renderSearchResults = () => {
// // //     return (
// // //       <>
// // //         {(!searchResults || searchResults.length === 0) &&
// // //           searchHistory.length > 0 && (
// // //             <div className="p-4">
// // //               <div className="flex justify-between items-center mb-3">
// // //                 <h3 className="text-lg font-medium">Lịch sử tìm kiếm</h3>
// // //                 <button
// // //                   onClick={clearHistory}
// // //                   className="text-red-500 text-sm hover:text-red-600"
// // //                 >
// // //                   Xóa lịch sử
// // //                 </button>
// // //               </div>
// // //               <div className="flex flex-wrap gap-2">
// // //                 {searchHistory.map((term, index) => (
// // //                   <button
// // //                     key={index}
// // //                     onClick={() => handleSearch(term)}
// // //                     className="bg-gray-100 hover:bg-gray-200 rounded-full px-4 py-1 text-sm"
// // //                   >
// // //                     {term}
// // //                   </button>
// // //                 ))}
// // //               </div>
// // //             </div>
// // //           )}

// // //         {searchValue && (
// // //           <div className="mb-4">
// // //             <h2 className="text-xl font-medium">
// // //               {searchResults && searchResults.length > 0
// // //                 ? `Kết quả tìm kiếm cho "${searchValue}"`
// // //                 : `Không tìm thấy kết quả cho "${searchValue}"`}
// // //             </h2>
// // //           </div>
// // //         )}

// // //         {!searchResults || searchResults.length === 0 ? (
// // //           <div className="text-center py-8 text-gray-500">
// // //             Không tìm thấy sản phẩm phù hợp
// // //           </div>
// // //         ) : (
// // //           <>
// // //             <div className="grid grid-cols-4 justify-center gap-4">
// // //               {searchResults.slice(0, 4).map(renderProductCard)}
// // //             </div>

// // //             {searchResults.length > 0 && (
// // //               <div className="text-center mt-6">
// // //                 <Link
// // //                   to={`/search-results?query=${encodeURIComponent(searchValue)}`}
// // //                   className="inline-block px-6 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
// // //                   onClick={() => setIsModalVisible(false)}
// // //                 >
// // //                   Xem tất cả ({searchResults.length} sản phẩm)
// // //                 </Link>
// // //               </div>
// // //             )}
// // //           </>
// // //         )}
// // //       </>
// // //     );
// // //   };

// // //   return (
// // //     <div className="relative">
// // //       <SearchOutlined
// // //         className="text-xl cursor-pointer"
// // //         onClick={() => setIsModalVisible(true)}
// // //       />

// // //       <Modal
// // //         open={isModalVisible}
// // //         onCancel={() => {
// // //           setIsModalVisible(false);
// // //           setSearchValue("");
// // //         }}
// // //         footer={null}
// // //         width={1200}
// // //         title="Tìm kiếm sản phẩm"
// // //         className="search-modal"
// // //       >
// // //         <div className="space-y-4">
// // //           <Input
// // //             placeholder="Tìm kiếm"
// // //             size="large"
// // //             value={searchValue}
// // //             onChange={onSearchChange}
// // //             style={{
// // //               borderRadius: "9999px",
// // //               padding: "8px 16px",
// // //               border: "1px solid #cfe8ea",
// // //               outline: "none",
// // //             }}
// // //           />

// // //           {!searchValue && searchHistory.length > 0 && (
// // //             <div className="p-4">
// // //               <div className="flex justify-between items-center mb-3">
// // //                 <h3 className="text-lg font-medium">Lịch sử tìm kiếm</h3>
// // //                 <button
// // //                   onClick={clearHistory}
// // //                   className="text-red-500 text-sm hover:text-red-600"
// // //                 >
// // //                   Xóa lịch sử
// // //                 </button>
// // //               </div>
// // //               <div className="flex flex-wrap gap-2">
// // //                 {searchHistory.map((term, index) => (
// // //                   <button
// // //                     key={index}
// // //                     onClick={() => handleSearch(term)}
// // //                     className="bg-gray-100 hover:bg-gray-200 rounded-full px-4 py-1 text-sm"
// // //                   >
// // //                     {term}
// // //                   </button>
// // //                 ))}
// // //               </div>
// // //             </div>
// // //           )}

// // //           {searchValue && renderSearchResults()}
// // //         </div>
// // //       </Modal>
// // //     </div>
// // //   );
// // // };

// // // export default Search;
// // import { SearchOutlined } from "@ant-design/icons";
// // import { Input, Modal,  } from "antd";
// // import { useEffect, useState, useCallback } from "react";
// // import { Link } from "react-router-dom";
// // import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// // import instanceClient from "@/configs/client";
// // import debounce from "lodash/debounce";
// // import { logo } from "@/assets/img";

// // // import './../../../index1.css';
// // interface SearchResult {
// //   id: number;
// //   danh_muc_id: number;
// //   ten_san_pham: string;
// //   anh_san_pham: string;
// //   ma_san_pham: string;
// //   duong_dan: string;
// //   mo_ta_ngan: string;
// //   noi_dung: string;
// //   luot_xem: number;
// //   trang_thai: number;
// //   gia_tot: number;
// //   hang_moi: number;
// //   created_at: string;
// //   updated_at: string;
// //   deleted_at: null;
// //   yeu_thich?: boolean;
// //   gia_thap_nhat?: number;
// //   gia_cao_nhat?: number;
// //   mau_sac_va_anh?: Array<{
// //     ma_mau_sac: string;
// //     hinh_anh: string;
// //   }>;
// // }

// // const Search = () => {
// //   const queryClient = useQueryClient();
// //   const [isModalVisible, setIsModalVisible] = useState(false);
// //   const [searchValue, setSearchValue] = useState("");
// //   const [searchHistory, setSearchHistory] = useState<string[]>([]);
// //   const [hoveredProductId, setHoveredProductId] = useState<number | null>(null);
// //   const [hoveredVariantIndex, setHoveredVariantIndex] = useState<number | null>(
// //     null
// //   );

// //   const handleMouseEnter = (productId: number, variantIndex: number) => {
// //     setHoveredProductId(productId);
// //     setHoveredVariantIndex(variantIndex);
// //   };

// //   const { data: searchResults, refetch } = useQuery({
// //     queryKey: ["search", searchValue],
// //     queryFn: async () => {
// //       if (!searchValue.trim()) return [];
// //       const response = await instanceClient.get(
// //         `/tim-kiem-goi-y?query=${encodeURIComponent(searchValue)}`
// //       );
// //       return response.data;
// //     },
// //     enabled: false,
// //   });

// //   useEffect(() => {
// //     const savedHistory = localStorage.getItem("searchHistory");
// //     if (savedHistory) {
// //       setSearchHistory(JSON.parse(savedHistory));
// //     }
// //   }, []);

// //   const handleSearch = async (value: string) => {
// //     setSearchValue(value);
// //     if (value.trim()) {
// //       const results = await refetch();
// //       if (results.data?.length > 0 && !searchHistory.includes(value.trim())) {
// //         const newHistory = [value.trim(), ...searchHistory.slice(0, 9)];
// //         setSearchHistory(newHistory);
// //         localStorage.setItem("searchHistory", JSON.stringify(newHistory));
// //       }
// //     }
// //   };
// //   const debouncedSearch = useCallback(
// //     debounce((value: string) => handleSearch(value), 300),
// //     [searchHistory]
// //   );
// //   const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
// //     const value = e.target.value;
// //     setSearchValue(value);
// //     debouncedSearch(value);
// //   };

// //   const clearHistory = () => {
// //     setSearchHistory([]);
// //     localStorage.removeItem("searchHistory");
// //   };

// //   const renderProductCard = (product: SearchResult) => (
// //     <div className="container">
// //       <div
// //         className="xl:col-span-3 lg:col-span-4 col-span-12 md:col-span-6 mb-2 w-[250px] mx-auto lg:mx-0"
// //         key={product.id}
// //       >
// //         <div className="product-card hover:bg-zinc-100 rounded-md shadow-lg shadow-black/10">
// //           <div className="relative w-full h-[300px] ">
// //             <Link
// //               to={`/product-detail/${product.duong_dan}`}
// //               onClick={() => setIsModalVisible(false)}
// //             >
// //               <div className="relative ">
// //                 <img
// //                   src={
// //                     hoveredProductId === product.id &&
// //                     hoveredVariantIndex !== null
// //                       ? product.mau_sac_va_anh?.[hoveredVariantIndex].hinh_anh
// //                       : product.anh_san_pham
// //                   }
// //                   alt=""
// //                   className="w-full h-[300px] object-cover rounded-t-md"
// //                 />
// //                 {product.hang_moi === 1 && (
// //                   <span className="absolute top-3 left-4 bg-red-500 text-white px-2 py-[2px] rounded-md text-sm font-bold">
// //                     Mới
// //                   </span>
// //                 )}
// //               </div>
// //               {/* <div className="w-12 h-12 text-xs">
// //                 <View id={product?.duong_dan} ID={product?.id} />
// //               </div> */}
// //             </Link>
// //           </div>

// //           <div className="bg-slate-50 pt-3 px-3 rounded-md pb-5">
// //             <Link
// //               to={`/product-detail/${product.duong_dan}`}
// //               onClick={() => setIsModalVisible(false)}
// //             >
// //               {" "}
// //               <h5 className="text-lg truncate w-full font-medium hover:text-red-500 text-black">
// //                 {product.ten_san_pham}
// //               </h5>
// //             </Link>

// //             <p className="font-semibold text-base">
// //               {product.gia_thap_nhat === product.gia_cao_nhat ? (
// //                 `${(product.gia_cao_nhat ?? 0).toLocaleString("vi-VN")} đ`
// //               ) : (
// //                 <>
// //                   {`${(product.gia_thap_nhat ?? 0).toLocaleString("vi-VN")} đ`}
// //                   <i className="fa-solid fa-minus text-xs mx-1 text-slate-500"></i>
// //                   {`${(product.gia_cao_nhat ?? 0).toLocaleString("vi-VN")} đ`}
// //                 </>
// //               )}
// //             </p>

// //             <div className="font-bold text-base flex items-center m ">
// //               {product.mau_sac_va_anh?.map((item, index) => (
// //                 <button
// //                   key={index}
// //                   className={`w-6 h-6 rounded-full border mr-1 ${
// //                     hoveredProductId === product.id &&
// //                     hoveredVariantIndex === index
// //                       ? "border-black"
// //                       : "border-gray-300 hover:border-black"
// //                   }`}
// //                   style={{ backgroundColor: item.ma_mau_sac }}
// //                   onMouseEnter={() => handleMouseEnter(product.id, index)}
// //                 />
// //               ))}
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// //   const renderSearchResults = () => {
// //     return (
// //       <>
// //         {(!searchResults || searchResults.length === 0) &&
// //           searchHistory.length > 0 && (
// //             <div className="p-4">
// //               <div className="flex justify-between items-center mb-3">
// //                 <h3 className="text-lg font-medium">Lịch sử tìm kiếm</h3>
// //                 <button
// //                   onClick={clearHistory}
// //                   className="text-red-500 text-sm hover:text-red-600"
// //                 >
// //                   Xóa lịch sử
// //                 </button>
// //               </div>
// //               <div className="flex flex-wrap gap-2">
// //                 {searchHistory.map((term, index) => (
// //                   <button
// //                     key={index}
// //                     onClick={() => handleSearch(term)}
// //                     className="bg-gray-100 hover:bg-gray-200 rounded-full px-4 py-1 text-sm"
// //                   >
// //                     {term}
// //                   </button>
// //                 ))}
// //               </div>
// //             </div>
// //           )}

// //         {searchValue && (
// //           <div className="mb-4">
// //             <h2 className="text-xl font-medium">
// //               {searchResults && searchResults.length > 0
// //                 ? `Kết quả tìm kiếm cho "${searchValue}"`
// //                 : `Không tìm thấy kết quả cho "${searchValue}"`}
// //             </h2>
// //           </div>
// //         )}

// //         {!searchResults || searchResults.length === 0 ? (
// //           <div className="text-center py-8 text-gray-500">
// //             Không tìm thấy sản phẩm phù hợp
// //           </div>
// //         ) : (
// //           <>
// //             <div className="grid grid-cols-4 justify-center gap-4">
// //               {searchResults.slice(0, 4).map(renderProductCard)}
// //             </div>

// //             {searchResults.length > 0 && (
// //               <div className="text-center mt-6">
// //                 <Link
// //                   to={`/search-results?query=${encodeURIComponent(searchValue)}`}
// //                   className="inline-block px-6 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
// //                   onClick={() => setIsModalVisible(false)}
// //                 >
// //                   Xem tất cả ({searchResults.length} sản phẩm)
// //                 </Link>
// //               </div>
// //             )}
// //           </>
// //         )}
// //       </>
// //     );
// //   };

// //   return (
// //     <div className="relative">
// //  <div
// //   className="flex items-center px-5 py-2 rounded-full bg-gray-100 border border-gray-300 cursor-pointer hover:bg-gray-200"
// //   onClick={() => setIsModalVisible(true)}
// // >
// //   <SearchOutlined className="text-2xl mr-3" />
// //   <span className="text-gray-500 text-lg">Tìm kiếm</span>
// // </div>
// // <Modal
// //   open={isModalVisible}
// //   onCancel={() => {
// //     setIsModalVisible(false);
// //     setSearchValue("");
// //   }}
// //   footer={null}
// //   width="100vw"
// //   className="search-modal"
// //   modalRender={(modal) => (
// //     <div style={{ marginTop: "-90px", padding: "0" }}>
// //       {modal}
// //     </div>
// //   )}
// //   closeIcon={
// //     <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
// //       <span className="text-gray-600">&times;</span>
// //     </div>
// //   }
// // >      <div className="space-y-4">

// //   <div className="relative w-full flex justify-center">
// //     <img
// //      src={logo}
// //                     alt="Logo"
// //       style={{
// //         position: "absolute",
// //         left: "100px",  
// //         top: "50%",
// //         transform: "translateY(-50%)",
// //         width: "120px",  
// //         height: "35px",
// //       }}
// //     />

// //     <Input
// //       placeholder="Tìm kiếm"
// //       size="large"
// //       value={searchValue}
// //       onChange={onSearchChange}
// //       style={{
// //         flex: 1,
// //         borderRadius: "9999px",
// //         padding: "15px 20px",
// //         border: "2px solid #cfe8ea",
// //         outline: "none",
// //         maxWidth: "600px", 
// //       }}
// //     />
// //     </div>
// //           {!searchValue && searchHistory.length > 0 && (
// //             <div className="p-4">
// //               <div className="flex justify-between items-center mb-3">
// //                 <h3 className="text-lg font-medium">Lịch sử tìm kiếm</h3>
// //                 <button
// //                   onClick={clearHistory}
// //                   className="text-red-500 text-sm hover:text-red-600"
// //                 >
// //                   Xóa lịch sử
// //                 </button>
// //               </div>
// //               <div className="flex flex-wrap gap-2">
// //                 {searchHistory.map((term, index) => (
// //                   <button
// //                     key={index}
// //                     onClick={() => handleSearch(term)}
// //                     className="bg-gray-100 hover:bg-gray-200 rounded-full px-4 py-1 text-sm"
// //                   >
// //                     {term}
// //                   </button>
// //                 ))}
// //               </div>
// //             </div>
// //           )}

// //           {searchValue && renderSearchResults()}
// //         </div>
// //       </Modal>
// //     </div>
// //   );
// // };

// // export default Search;
// import { SearchOutlined } from "@ant-design/icons";
// import { Input, Modal } from "antd";
// import { useEffect, useState, useCallback } from "react";
// import { Link } from "react-router-dom";
// import { useQuery } from "@tanstack/react-query";
// import instanceClient from "@/configs/client";
// import debounce from "lodash/debounce";
// import { logo } from "@/assets/img";

// interface SearchResponse {
//   status: boolean;
//   status_code: number;
//   message: string;
//   data: SearchResult[];
//   lich_su_tim_kiem: {
//     tim_kiem: string;
//   }[];
// }

// interface SearchResult {
//   id: number;
//   ten_san_pham: string;
//   duong_dan: string;
//   anh_san_pham: string;
//   hang_moi: number;
//   gia_tot: number;
//   gia_thap_nhat: number;
//   gia_cao_nhat: number;
//   mau_sac_va_anh: {
//     ma_mau_sac: string;
//     ten_mau_sac: string;
//     hinh_anh: string;
//   }[];
//   yeu_thich: boolean;
// }

// const Search = () => {
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [searchValue, setSearchValue] = useState("");
//   const [searchHistory, setSearchHistory] = useState<string[]>([]);
//   const [hoveredProductId, setHoveredProductId] = useState<number | null>(null);
//   const [hoveredVariantIndex, setHoveredVariantIndex] = useState<number | null>(null);

//   const { data: searchResponse, refetch } = useQuery<SearchResponse>({
//     queryKey: ["search", searchValue],
//     queryFn: async () => {
//       if (!searchValue.trim()) return null;
//       const response = await instanceClient.get(
//         `/tim-kiem-goi-y?query=${encodeURIComponent(searchValue)}`
//       );
//       return response.data;
//     },
//     enabled: false,
//   });

//   useEffect(() => {
//     if (searchResponse?.lich_su_tim_kiem) {
//       const history = searchResponse.lich_su_tim_kiem.map(item => item.tim_kiem);
//       setSearchHistory(history);
//     }
//   }, [searchResponse]);

//   const handleMouseEnter = (productId: number, variantIndex: number) => {
//     setHoveredProductId(productId);
//     setHoveredVariantIndex(variantIndex);
//   };

//   const handleSearch = async (value: string) => {
//     setSearchValue(value);
//     if (value.trim()) {
//       await refetch();
//     }
//   };

//   const debouncedSearch = useCallback(
//     debounce((value: string) => handleSearch(value), 300),
//     [searchHistory]
//   );

//   const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const value = e.target.value;
//     setSearchValue(value);
//     debouncedSearch(value);
//   };

//   const clearHistory = () => {
//     setSearchHistory([]);
//     localStorage.removeItem("searchHistory");
//   };

//   const renderProductCard = (product: SearchResult) => (
//     <div className="container" key={product.id}>
//       <div className="xl:col-span-3 lg:col-span-4 col-span-12 md:col-span-6 mb-2 w-[250px] mx-auto lg:mx-0">
//         <div className="product-card hover:bg-zinc-100 rounded-md shadow-lg shadow-black/10">
//           <div className="relative w-full h-[300px]">
//             <Link
//               to={`/product-detail/${product.duong_dan}`}
//               onClick={() => setIsModalVisible(false)}
//             >
//               <div className="relative">
//                 <img
//                   src={
//                     hoveredProductId === product.id && hoveredVariantIndex !== null
//                       ? product.mau_sac_va_anh[hoveredVariantIndex].hinh_anh
//                       : product.anh_san_pham
//                   }
//                   alt={product.ten_san_pham}
//                   className="w-full h-[300px] object-cover rounded-t-md"
//                 />
//                 {product.hang_moi === 1 && (
//                   <span className="absolute top-3 left-4 bg-red-500 text-white px-2 py-[2px] rounded-md text-sm font-bold">
//                     Mới
//                   </span>
//                 )}
//               </div>
//             </Link>
//           </div>

//           <div className="bg-slate-50 pt-3 px-3 rounded-md pb-5">
//             <Link
//               to={`/product-detail/${product.duong_dan}`}
//               onClick={() => setIsModalVisible(false)}
//             >
//               <h5 className="text-lg truncate w-full font-medium hover:text-red-500 text-black">
//                 {product.ten_san_pham}
//               </h5>
//             </Link>

//             <p className="font-semibold text-base">
//               {product.gia_thap_nhat === product.gia_cao_nhat
//                 ? `${product.gia_cao_nhat.toLocaleString("vi-VN")} đ`
//                 : (
//                   <>
//                     {`${product.gia_thap_nhat.toLocaleString("vi-VN")} đ`}
//                     <i className="fa-solid fa-minus text-xs mx-1 text-slate-500"></i>
//                     {`${product.gia_cao_nhat.toLocaleString("vi-VN")} đ`}
//                   </>
//                 )}
//             </p>

//             <div className="font-bold text-base flex items-center">
//               {product.mau_sac_va_anh?.map((item, index) => (
//                 <button
//                   key={index}
//                   className={`w-6 h-6 rounded-full border mr-1 ${
//                     hoveredProductId === product.id && hoveredVariantIndex === index
//                       ? "border-black"
//                       : "border-gray-300 hover:border-black"
//                   }`}
//                   style={{ backgroundColor: item.ma_mau_sac }}
//                   onMouseEnter={() => handleMouseEnter(product.id, index)}
//                 />
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   const renderSearchResults = () => (
//     <>
// {(!searchResponse?.data || searchResponse.data.length === 0) && searchHistory.length > 0 && (
//  <div className="p-4 flex flex-col items-center">
//  <div className="flex items-center space-x-2 mb-3">
//    <h3 className="text-gray-600 font-medium mr-96">Tìm kiếm gần đây</h3>
//    <button
//      onClick={clearHistory}
//      className="text-gray-400 hover:text-gray-600"
//    >
//      <i className="far fa-trash-alt text-lg"></i>
//    </button>
//  </div>
//  <div className="flex flex-wrap justify-center gap-2 w-[500px]">
//    {searchHistory.map((term, index) => (
//      <div key={index} className="relative group">
//        <button
//          onClick={() => handleSearch(term)}
//          className="border border-gray-300 text-gray-600 rounded-full px-4 py-1 text-sm hover:bg-gray-200 transition"
//        >
//          {term}
//        </button>
//        <button
//          onClick={() => removeSearchTerm(index)}
//          className="absolute top-0 right-0 -mt-1 -mr-1 text-gray-500 hover:text-gray-700 text-xs p-1 rounded-full bg-white opacity-0 group-hover:opacity-100 transition-opacity"
//        >
//          <i className="fas fa-times"></i>
//        </button>
//      </div>
//    ))}
//  </div>
// </div>
// )}


//       {searchValue && (
//         <div className="mb-4">
//           <h2 className="text-xl font-medium">
//             {searchResponse?.data && searchResponse.data.length > 0
//               ? `Kết quả tìm kiếm cho "${searchValue}"`
//               : `Không tìm thấy kết quả cho "${searchValue}"`}
//           </h2>
//         </div>
//       )}

//       {!searchResponse?.data || searchResponse.data.length === 0 ? (
//         <div className="text-center py-8 text-gray-500">
//           Không tìm thấy sản phẩm phù hợp
//         </div>
//       ) : (
//         <>
//           <div className="grid grid-cols-4 justify-center gap-4">
//             {searchResponse.data.slice(0, 4).map(renderProductCard)}
//           </div>

//           {searchResponse.data.length > 0 && (
//             <div className="text-center mt-6">
//               <Link
//                 to={`/search-results?query=${encodeURIComponent(searchValue)}`}
//                 className="inline-block px-6 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
//                 onClick={() => setIsModalVisible(false)}
//               >
//                 Xem tất cả ({searchResponse.data.length} sản phẩm)
//               </Link>
//             </div>
//           )}
//         </>
//       )}
//     </>
//   );

//   return (
//     <div className="relative">
//       <div
//         className="flex items-center px-5 py-2 rounded-full bg-gray-100 border border-gray-300 cursor-pointer hover:bg-gray-200"
//         onClick={() => setIsModalVisible(true)}
//       >
//         <SearchOutlined className="text-2xl mr-3" />
//         <span className="text-gray-500 text-lg">Tìm kiếm</span>
//       </div>

//       <Modal
//         open={isModalVisible}
//         onCancel={() => {
//           setIsModalVisible(false);
//           setSearchValue("");
//         }}
//         footer={null}
//         width="100vw"
//         className="search-modal"
//         modalRender={(modal) => (
//           <div style={{ marginTop: "-90px", padding: "0" }}>
//             {modal}
//           </div>
//         )}
//         closeIcon={
//           <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
//             <span className="text-gray-600">&times;</span>
//           </div>
//         }
//       >
//         <div className="space-y-4">
//           <div className="relative w-full flex justify-center">
//             <img
//               src={logo}
//               alt="Logo"
//               style={{
//                 position: "absolute",
//                 left: "100px",
//                 top: "50%",
//                 transform: "translateY(-50%)",
//                 width: "120px",
//                 height: "35px",
//               }}
//             />

//             <Input
//               placeholder="Tìm kiếm"
//               size="large"
//               value={searchValue}
//               onChange={onSearchChange}
//               style={{
//                 flex: 1,
//                 borderRadius: "9999px",
//                 padding: "15px 20px",
//                 border: "2px solid #cfe8ea",
//                 outline: "none",
//                 maxWidth: "600px",
//               }}
//             />

//           </div>
// {!searchValue && searchHistory.length > 0 && (
//   <div className="p-4 flex flex-col items-center">
//     <div className="flex items-center space-x-2 mb-3">
//       <h3 className="text-gray-600 font-medium mr-96">Tìm kiếm gần đây</h3>
//       <button
//         onClick={clearHistory}
//         className="text-gray-400 hover:text-gray-600"
//       >
//         <i className="far fa-trash-alt text-lg"></i>
//       </button>
//     </div>
//     <div className="flex flex-wrap justify-center gap-2 w-[500px]">
//       {searchHistory.map((term, index) => (
//         <div key={index} className="relative group">
//           <button
//             onClick={() => handleSearch(term)}
//             className="border border-gray-300 text-gray-600 rounded-full px-4 py-1 text-sm hover:bg-gray-200 transition"
//           >
//             {term}
//           </button>
//           <button
//             onClick={() => removeSearchTerm(index)}
//             className="absolute top-0 right-0 -mt-1 -mr-1 text-gray-500 hover:text-gray-700 text-xs p-1 rounded-full bg-white opacity-0 group-hover:opacity-100 transition-opacity"
//           >
//             <i className="fas fa-times"></i>
//           </button>
//         </div>
//       ))}
//     </div>
//   </div>
// )}


//             {searchValue && renderSearchResults()}

//         </div>
//       </Modal>
//     </div>
//   );
// };

// export default Search;
import { SearchOutlined } from "@ant-design/icons";
import { Input, Modal } from "antd";
import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import instanceClient from "@/configs/client";
import debounce from "lodash/debounce";
import { logo } from "@/assets/img";

interface SearchResponse {
  status: boolean;
  status_code: number;
  message: string;
  data: SearchResult[];
  lich_su_tim_kiem: {
    tim_kiem: string;
  }[];
}

interface SearchResult {
  id: number;
  ten_san_pham: string;
  duong_dan: string;
  anh_san_pham: string;
  hang_moi: number;
  gia_tot: number;
  gia_thap_nhat: number;
  gia_cao_nhat: number;
  mau_sac_va_anh: {
    ma_mau_sac: string;
    ten_mau_sac: string;
    hinh_anh: string;
  }[];
  yeu_thich: boolean;
}

const Search = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [hoveredProductId, setHoveredProductId] = useState<number | null>(null);
  const [hoveredVariantIndex, setHoveredVariantIndex] = useState<number | null>(null);

  const { data: searchResponse, refetch } = useQuery<SearchResponse>({
    queryKey: ["search", searchValue],
    queryFn: async () => {
      if (!searchValue.trim()) return null;
      const response = await instanceClient.get(
        `/tim-kiem-goi-y?query=${encodeURIComponent(searchValue)}`
      );
      return response.data;
    },
    enabled: false,
  });

  useEffect(() => {
    if (searchResponse?.lich_su_tim_kiem) {
      const history = searchResponse.lich_su_tim_kiem.map(item => item.tim_kiem);
      setSearchHistory(history);
    }
  }, [searchResponse]);

  const removeSearchTerm = async (id: number) => {
    try {
      await instanceClient.delete(`/tim-kiem-goi-y/xoa/${id}`);
      const updatedHistory = searchHistory.filter((_, index) => index !== id);
      setSearchHistory(updatedHistory);
    } catch (error) {
      console.error("Error removing search term:", error);
    }
  };

  const clearHistory = async () => {
    try {
      await instanceClient.delete('/tim-kiem-goi-y/xoa-toan-bo');
      setSearchHistory([]);
    } catch (error) {
      console.error("Error clearing search history:", error);
    }
  };

  const handleMouseEnter = (productId: number, variantIndex: number) => {
    setHoveredProductId(productId);
    setHoveredVariantIndex(variantIndex);
  };

  const handleSearch = async (value: string) => {
    setSearchValue(value);
    if (value.trim()) {
      await refetch();
    }
  };

  const debouncedSearch = useCallback(
    debounce((value: string) => handleSearch(value), 300),
    [searchHistory]
  );

  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    debouncedSearch(value);
  };

  const renderProductCard = (product: SearchResult) => (
    <div className="container" key={product.id}>
      <div className="xl:col-span-3 lg:col-span-4 col-span-12 md:col-span-6 mb-2 w-[250px] mx-auto lg:mx-0">
        <div className="product-card hover:bg-zinc-100 rounded-md shadow-lg shadow-black/10">
          <div className="relative w-full h-[300px]">
            <Link
              to={`/product-detail/${product.duong_dan}`}
              onClick={() => setIsModalVisible(false)}
            >
              <div className="relative">
                <img
                  src={
                    hoveredProductId === product.id && hoveredVariantIndex !== null
                      ? product.mau_sac_va_anh[hoveredVariantIndex].hinh_anh
                      : product.anh_san_pham
                  }
                  alt={product.ten_san_pham}
                  className="w-full h-[300px] object-cover rounded-t-md"
                />
                {product.hang_moi === 1 && (
                  <span className="absolute top-3 left-4 bg-red-500 text-white px-2 py-[2px] rounded-md text-sm font-bold">
                    Mới
                  </span>
                )}
              </div>
            </Link>
          </div>

          <div className="bg-slate-50 pt-3 px-3 rounded-md pb-5">
            <Link
              to={`/product-detail/${product.duong_dan}`}
              onClick={() => setIsModalVisible(false)}
            >
              <h5 className="text-lg truncate w-full font-medium hover:text-red-500 text-black">
                {product.ten_san_pham}
              </h5>
            </Link>

            <p className="font-semibold text-base">
              {product.gia_thap_nhat === product.gia_cao_nhat
                ? `${product.gia_cao_nhat.toLocaleString("vi-VN")} đ`
                : (
                  <>
                    {`${product.gia_thap_nhat.toLocaleString("vi-VN")} đ`}
                    <i className="fa-solid fa-minus text-xs mx-1 text-slate-500"></i>
                    {`${product.gia_cao_nhat.toLocaleString("vi-VN")} đ`}
                  </>
                )}
            </p>

            <div className="font-bold text-base flex items-center">
              {product.mau_sac_va_anh?.map((item, index) => (
                <button
                  key={index}
                  className={`w-6 h-6 rounded-full border mr-1 ${hoveredProductId === product.id && hoveredVariantIndex === index
                      ? "border-black"
                      : "border-gray-300 hover:border-black"
                    }`}
                  style={{ backgroundColor: item.ma_mau_sac }}
                  onMouseEnter={() => handleMouseEnter(product.id, index)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );


  const renderSearchResults = () => (
    <>
      {(!searchResponse?.data || searchResponse.data.length === 0) && searchHistory.length > 0 && (
        <div className="p-4 flex flex-col items-center">
          <div className="flex items-center space-x-2 mb-3">
            <h3 className="text-gray-600 font-medium mr-96">Tìm kiếm gần đây</h3>
            <button
              onClick={clearHistory}
              className="text-gray-400 hover:text-gray-600"
            >
              <i className="far fa-trash-alt text-lg"></i>
            </button>
          </div>
          <div className="flex flex-wrap justify-center gap-2 w-[500px]">
            {searchHistory.map((term, index) => (
              <div key={index} className="relative group">
                <button
                  onClick={() => handleSearch(term)}
                  className="border border-gray-300 text-gray-600 rounded-full px-4 py-1 text-sm hover:bg-gray-200 transition"
                >
                  {term}
                </button>
                <button
                  onClick={() => removeSearchTerm(index)}
                  className="absolute top-0 right-0 -mt-1 -mr-1 text-gray-500 hover:text-gray-700 text-xs p-1 rounded-full bg-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      {searchValue && (
        <div className="mb-4 px-24">
          <h2 className="text-xl font-medium">
            {searchResponse?.data && searchResponse.data.length > 0
              ? `Kết quả tìm kiếm cho "${searchValue}"`
              : `Không tìm thấy kết quả cho "${searchValue}"`}
          </h2>
        </div>
      )}

      {!searchResponse?.data || searchResponse.data.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          {`          Không tìm thấy sản phẩm phù hợp
 "${searchValue}"`}
        </div>
      ) : (
        <>
          {/* <div className="grid grid-cols-7 justify-center gap-4">
            {searchResponse.data.slice(0, 4).map(renderProductCard)}
          </div> */}
<div className="grid grid-cols-6 justify-center gap-4">
  {searchResponse.data.slice(0, 6).map((item, index) => (
    <div key={index} className="px-20">
      {renderProductCard(item)}
    </div>
  ))}
</div>

          {searchResponse.data.length > 0 && (
            <div className="text-center mt-6">
              <Link
                to={`/search-results?query=${encodeURIComponent(searchValue)}`}
                className="inline-block px-6 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
                onClick={() => setIsModalVisible(false)}
              >
                Xem tất cả ({searchResponse.data.length} sản phẩm)
              </Link>
            </div>
          )}
        </>
      )}
    </>
  );

  return (
    <div className="relative">
      <div
        className="flex items-center px-5 py-2 rounded-full bg-gray-100 border border-gray-300 cursor-pointer hover:bg-gray-200"
        onClick={() => setIsModalVisible(true)}
      >
        <SearchOutlined className="text-2xl mr-3" />
        <span className="text-gray-500 text-lg">Tìm kiếm</span>
      </div>

      <Modal
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setSearchValue("");
        }}
        footer={null}
        width="100vw"
        className="search-modal"
        modalRender={(modal) => (
          <div style={{ marginTop: "-90px", padding: "0" }}>
            {modal}
          </div>
        )}
        closeIcon={
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
            <span className="text-gray-600">&times;</span>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="relative w-full flex justify-center">
            <img
              src={logo}
              alt="Logo"
              style={{
                position: "absolute",
                left: "100px",
                top: "50%",
                transform: "translateY(-50%)",
                width: "120px",
                height: "35px",
              }}
            />

            <Input
              placeholder="Tìm kiếm"
              size="large"
              value={searchValue}
              onChange={onSearchChange}
              style={{
                flex: 1,
                borderRadius: "9999px",
                padding: "15px 20px",
                border: "2px solid #cfe8ea",
                outline: "none",
                maxWidth: "600px",
              }}
            />
          </div>

          {!searchValue && searchHistory.length > 0 && (
            <div className="p-4 flex flex-col items-center">
              <div className="flex items-center space-x-2 mb-3">
                <h3 className="text-gray-600 font-medium mr-96">Tìm kiếm gần đây</h3>
                <button
                  onClick={clearHistory}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <i className="far fa-trash-alt text-lg"></i>
                </button>
              </div>
              <div className="flex flex-wrap justify-center gap-2 w-[500px]">
                {searchHistory.map((term, index) => (
                  <div key={index} className="relative group">
                    <button
                      onClick={() => handleSearch(term)}
                      className="border border-gray-300 text-gray-600 rounded-full px-4 py-1 text-sm hover:bg-gray-200 transition"
                    >
                      {term}
                    </button>
                    <button
                      onClick={() => removeSearchTerm(index)}
                      className="absolute top-0 right-0 -mt-1 -mr-1 text-gray-500 hover:text-gray-700 text-xs p-1 rounded-full bg-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {searchValue && renderSearchResults()}
        </div>
      </Modal>
    </div>
  );
};

export default Search;
