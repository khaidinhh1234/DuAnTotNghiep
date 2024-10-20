// import { product, products1, products2, sanPham2 } from "@/assets/img";
// import { Image } from "antd";
// import { useState } from "react";
// import {
//   Autoplay,
//   FreeMode,
//   Navigation,
//   Pagination,
//   Thumbs,
// } from "swiper/modules";
// import { Swiper, SwiperSlide } from "swiper/react";

// const ProductDetail = () => {
//   const [activeTab, setActiveTab] = useState("descriptions"); // State to manage active tab
//   const [thumbsSwiper, setThumbsSwiper] = useState(null);
//   const [previewOpen, setPreviewOpen] = useState(false);
//   const [previewImage, setPreviewImage] = useState("");
//   const [selectedColor, setSelectedColor] = useState(null);
//   const [selectedSize, setSelectedSize] = useState<string | null>(null);
//   const [isHeart, setIsHeart] = useState(false);

//   const handleColorClick = (color: any) => {
//     setSelectedColor(color);
//   };

//   const colors = [
//     "bg-red-500",
//     "bg-blue-500",
//     "bg-purple-500",
//     "bg-black",
//     "bg-yellow-500",
//     "bg-green-500",
//   ];
//   const handleSizeClick = (size: string) => {
//     setSelectedSize(size);
//   };

//   const sizes = ["S", "M", "L", "XL", "XXL"];

//   const handleClickHeart = () => {
//     setIsHeart(!isHeart);
//   };
//   const handlePreview = (imageUrl: string) => {
//     setPreviewImage(imageUrl);
//     setPreviewOpen(true);
//   };

//   const images = [product, products1, products2, sanPham2];

//   return (
//     <>
//       <section>
//         <div className="container">
//           <div className="mx-14 flex mt-[70px] mb-9">
//             <p className="pr-2">Home</p>
//             &gt;
//             <p className="px-2">Shop</p>
//             &gt;
//             <p className="px-2">All Products</p>
//           </div>
//         </div>
//       </section>
//       <section>
//         <div className="container pb-11">
//           <div className="md:px-14 px-5 pt-3 grid grid-cols-12 gap-3 w-[100%] justify-center">
//             <div className="lg:col-span-6 col-span-12 mb-6 ">
//               <div className="bg-[#FAFAFB] xl:w-[555px] xl:h-[535px] lg:w-[455px] lg:h-[455px] md:h-[555px] md:w-[655px] w-[405px] h-[325px] inline-flex justify-center items-center mb-5 rounded-2xl shadow shadow-zinc-300/60">
//                 <Swiper
//                   style={
//                     {
//                       "--swiper-navigation-color": "#000000",
//                       "--swiper-pagination-color": "#000000",
//                     } as React.CSSProperties
//                   }
//                   centeredSlides={true}
//                   autoplay={{
//                     delay: 2500,
//                     disableOnInteraction: false,
//                   }}
//                   pagination={{
//                     clickable: true,
//                   }}
//                   navigation={true}
//                   thumbs={thumbsSwiper ? { swiper: thumbsSwiper } : undefined}
//                   modules={[Autoplay, Pagination, Navigation, Thumbs, FreeMode]}
//                   className="mySwiper2 w-[555px] swiper-with-hover"
//                   loop={true}
//                   spaceBetween={10}
//                 >
//                   {images.map((image, index) => (
//                     <SwiperSlide key={index}>
//                       <img
//                         src={image}
//                         alt=""
//                         onClick={() => handlePreview(image)}
//                         style={{ cursor: "pointer" }}
//                       />
//                     </SwiperSlide>
//                   ))}
//                 </Swiper>
//               </div>
//               <div className="w-[500px] mx-auto">
//                 <Swiper
//                   onSwiper={(swiperInstance) =>
//                     setThumbsSwiper(swiperInstance as any)
//                   }
//                   loop={true}
//                   spaceBetween={31}
//                   slidesPerView={4}
//                   freeMode={true}
//                   watchSlidesProgress={true}
//                   modules={[FreeMode, Navigation, Thumbs]}
//                   className="mySwiper1"
//                 >
//                   {images.map((image, index) => (
//                     <SwiperSlide key={index}>
//                       <div className="md:w-[100px] md:h-[100px] w-[62px] h-[60px] bg-[#F4F4F4] rounded-2xl px-1 border border-[#F4F4F4] flex justify-center items-center">
//                         <img src={image} alt="" style={{ cursor: "pointer" }} />
//                       </div>
//                     </SwiperSlide>
//                   ))}
//                 </Swiper>
//               </div>
//             </div>
//             <div className="lg:col-span-6 col-span-12 px-4 w-[100%] ">
//               <div className="product_detail_name">
//                 <div className="flex justify-between mb-2">
//                   <h3 className=" font-bold text-3xl ">YK Disney</h3>
//                   <div>
//                     <a className="bg-[#3CD139]/10 text-sm px-2 py-1 text-[#3CD139] rounded-sm">
//                       In Stock
//                     </a>
//                   </div>
//                 </div>
//                 <h4 className="mb-3 text-2xl font-normal">
//                   Áo đẹp thoáng mát co giãn{" "}
//                 </h4>
//                 <div className="stars_reviews d-flex mb-3">
//                   <span>
//                     <i className="fa-solid fa-star  text-yellow-400 text-xl" />
//                     <i className="fa-solid fa-star text-yellow-400 text-xl" />
//                     <i className="fa-solid fa-star text-yellow-400 text-xl" />
//                     <i className="fa-solid fa-star text-yellow-400 text-xl" />
//                     <i className="fa-solid fa-star text-yellow-400 text-xl" />
//                   </span>
//                   <span className="px-2 text-[#A4A1AA]">
//                     5.0 <span className="px-[2px]">(122 Reviews)</span>
//                   </span>
//                 </div>
//               </div>
//               <div className=" mb-5 text-xl font-medium">
//                 $80.00 <del className="text-[#A4A1AA]">$100.00</del>
//               </div>
//               <p className="description mb-4 font-medium">
//                 To use these apps, you will need to open the app and then take a
//                 picture of the image. The app will then process the image and
//                 return the extracted text.
//               </p>
//               <div className="mb-4">
//                 <h3 className="  text-gray-900 mb-2 font-bold text-lg">
//                   Color{" "}
//                 </h3>
//                 {/* <div className="flex space-x-2">
//                   <button className="w-9 h-9 bg-red-500 rounded-md border-2 border-transparent hover:border-blackL" />
//                   <button className="w-9 h-9 bg-blue-500 rounded-md border-2 border-transparent hover:border-blackL" />
//                   <button className="w-9 h-9 bg-purple-500 rounded-md border-2 border-transparent hover:border-blackL" />
//                   <button className="w-9 h-9 bg-black rounded-md border-2 border-transparent hover:border-blackL" />
//                   <button className="w-9 h-9 bg-yellow-500 rounded-md border-2 border-transparent hover:border-blackL" />
//                   <button className="w-9 h-9 bg-green-500 rounded-md border-2 border-transparent hover:border-blackL" />
//                 </div> */}
//                 <div className="flex space-x-2">
//                   {colors.map((color, index) => (
//                     <button
//                       key={index}
//                       className={`w-9 h-9 rounded-md border-2 ${
//                         selectedColor === color ? "border-black" : ""
//                       } ${selectedColor === color ? color : `${color} opacity-100`}`}
//                       onClick={() => handleColorClick(color)}
//                     />
//                   ))}
//                 </div>
//               </div>
//               <div className=" items-center mt-4 mb-3">
//                 <h3 className=" mr-4 font-bold text-lg">Size </h3>
//                 <div className="flex mt-3">
//                   {sizes.map((size) => (
//                     <button
//                       key={size}
//                       onClick={() => handleSizeClick(size)}
//                       className={`w-10 h-10 rounded-md border border-blackL text-blackL hover:bg-blackL hover:text-white mr-2 ${
//                         selectedSize === size ? "bg-blackL text-white" : ""
//                       }`}
//                     >
//                       {size}
//                     </button>
//                   ))}
//                 </div>
//               </div>
//               <div className="mt-12 flex gap-5">
//                 <div className="border rounded-lg border-black xl:w-32 xl:h-14  ld:w-24 lg:h-10  md:w-32 md:h-14  w-24 h-10 flex justify-center items-center shadow-lg shadow-slate-400/50">
//                   <button className="py-2 pr-2">
//                     <i className="fa-solid fa-minus" />
//                   </button>
//                   <input
//                     type="number"
//                     id="numberInput"
//                     defaultValue={1}
//                     min={1}
//                     maxLength={2}
//                     className="xl:w-10 xl:h-10 lg:w-5 lg:h-5 md:w-10 md:h-10  w-5 h-5 border-0 focus:ring-0 focus:outline-none text-center"
//                   />
//                   <button className="py-2 pl-2">
//                     <i className="fa-solid fa-plus" />
//                   </button>
//                 </div>
//                 <button className="btn-black xl:w-[340px] w-[250px] lg:w-[250px] md:w-[340px] xl:h-14 lg:h-10  md:h-14 h-10 rounded-lg">
//                   Add to Cart
//                 </button>
//                 <button
//                   onClick={handleClickHeart}
//                   className={`border border-black xl:w-16 lg:w-11 md:w-16 w-11 xl:h-14 lg:h-10 md:h-14 h-10 rounded-lg flex items-center justify-center shadow-lg shadow-slate-400/50 ${
//                     isHeart ? "bg-red-600" : ""
//                   }`}
//                 >
//                   <i
//                     className={`fa-regular fa-heart text-2xl ${isHeart ? "text-white" : "text-red-600"}`}
//                   />
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       <div className="max-w-6xl mx-auto p-8">
//         <div className="flex space-x-8 border-b pb-2 mb-4">
//           <button
//             className={`font-medium ${activeTab === "descriptions" ? "text-black border-b-2 border-black pb-2" : "text-gray-700"}`}
//             onClick={() => setActiveTab("descriptions")}
//           >
//             Descriptions
//           </button>
//           <button
//             className={`font-medium ${activeTab === "additionalInfo" ? "text-black border-b-2 border-black pb-2" : "text-gray-700"}`}
//             onClick={() => setActiveTab("additionalInfo")}
//           >
//             Additional Information
//           </button>
//           <button
//             className={`font-medium ${activeTab === "reviews" ? "text-black border-b-2 border-black pb-2" : "text-gray-700"}`}
//             onClick={() => setActiveTab("reviews")}
//           >
//             Reviews
//           </button>
//         </div>

//         {activeTab === "descriptions" && (
//           <div className="mb-4">
//             <p className="description mb-4 font-medium">
//               <div id="descriptions" data-content className="py-4 h-auto">
//                 <p className="text-gray-600">
//                   <span>+</span>
//                   It is a long established fact that a reader will be distracted
//                   by the readable content of a page when looking at its layout.
//                   The point of using Lorem Ipsum is that it has a more-or-less
//                   normal distribution of letters, as opposed to using 'Content
//                   here, content here', making it look like readable English.
//                   Many desktop publishing packages and web page editors now use
//                   Lorem Ipsum as their default model text, and a search for
//                   'lorem ipsum' will uncover many web sites still in their
//                   infancy.
//                 </p>
//                 <p className="mt-4 text-gray-600">
//                   Various versions have evolved over the years, sometimes by
//                   accident, sometimes on purpose (injected humour and the like).
//                 </p>
//               </div>
//               <div id="additional-info" data-content className="p-4 hidden">
//                 <p className="text-gray-600">
//                   This is the additional information tab content. Add any
//                   relevant information about the product here.
//                 </p>
//               </div>
//               <div id="reviews" data-content className="p-4 hidden">
//                 <p className="text-gray-600">
//                   This is the reviews tab content. Display customer reviews and
//                   ratings here.
//                 </p>
//               </div>{" "}
//             </p>
//           </div>
//         )}

//         {activeTab === "additionalInfo" && (
//           <div className="mb-4">
//             <h3 className="text-gray-900 mb-2 font-bold text-lg">Color</h3>
//             <div className="flex space-x-2">
//               {/* Color buttons here */}
//               <h1>Đỏ,</h1>
//               <h1>Xanh dương,</h1>
//               <h1>Tím,</h1>
//               <h1>Đen,</h1>
//               <h1>cam,</h1>
//             </div>
//             <h3 className="mt-4 mb-2 font-bold text-lg">Size</h3>
//             <div className="flex space-x-2">
//               {/* Size buttons here */}
//               <h1>S,</h1>
//               <h1>L,</h1>
//               <h1>XL,</h1>
//               <h1>XXL,</h1>
//             </div>
//           </div>
//         )}

//         {activeTab === "reviews" && (
//           <div>
//             <h2 className="text-xl font-semibold mb-4">Customer Reviews</h2>
//             {/* <div className="space-y-6">
//             <h2 className="text-xl font-semibold mb-4">Customer Reviews</h2> */}

//             <div className="space-y-6">
//               {/* Review Item */}
//               <div className="border p-4 rounded-lg">
//                 <div className="flex items-center space-x-4 mb-2">
//                   <div className="w-12 h-12 rounded-full overflow-hidden">
//                     <img
//                       src="https://i.pravatar.cc/100"
//                       alt="Mark Williams"
//                       className="w-full h-full object-cover"
//                     />
//                   </div>
//                   <div>
//                     <h4 className="font-medium">Mark Williams</h4>
//                     <div className="flex items-center">
//                       <span className="text-yellow-500 text-xl">★★★★★</span>
//                       <span className="ml-2 text-sm text-gray-500">
//                         Jan 05, 2023
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//                 <p className="text-gray-700 font-medium mb-2">
//                   Excellent Product, I Love It 😍
//                 </p>
//                 <p className="text-gray-600">
//                   It is a long established fact that a reader will be distracted
//                   by the readable content of a page when looking at its layout.
//                 </p>
//               </div>

//               {/* Another Review Item */}
//               <div className="border p-4 rounded-lg">
//                 <div className="flex items-center space-x-4 mb-2">
//                   <div className="w-12 h-12 rounded-full overflow-hidden">
//                     <img
//                       src="https://i.pravatar.cc/100?img=2"
//                       alt="Alexa Johnson"
//                       className="w-full h-full object-cover"
//                     />
//                   </div>
//                   <div>
//                     <h4 className="font-medium">Alexa Johnson</h4>
//                     <div className="flex items-center">
//                       <span className="text-yellow-500 text-xl">★★★★★</span>
//                       <span className="ml-2 text-sm text-gray-500">
//                         Jan 06, 2023
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//                 <p className="text-gray-700 font-medium mb-2">
//                   My Daughter is very much happy with this product
//                 </p>
//                 <p className="text-gray-600">
//                   It is a long established fact that a reader will be distracted
//                   by the readable content of a page when looking at its layout.
//                 </p>
//               </div>
//               {/* </div> */}

//               {/* Add Review Form */}
//               <h3 className="text-lg font-semibold mt-8 mb-4">
//                 Add your Review
//               </h3>
//               <form className="space-y-4">
//                 <div>
//                   <label className="block font-medium">Your Rating</label>
//                   <div className="flex space-x-2 text-yellow-500 text-xl">
//                     {[...Array(5)].map((_, i) => (
//                       <button key={i} type="button">
//                         ★
//                       </button>
//                     ))}
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block font-medium">Name</label>
//                   <input
//                     type="text"
//                     className="w-full border p-2 rounded"
//                     placeholder="Enter Your Name"
//                   />
//                 </div>

//                 <div>
//                   <label className="block font-medium">Email Address</label>
//                   <input
//                     type="email"
//                     className="w-full border p-2 rounded"
//                     placeholder="Enter Your Email"
//                   />
//                 </div>

//                 <div>
//                   <label className="block font-medium">Your Review</label>
//                   <textarea
//                     className="w-full border p-2 rounded"
//                     placeholder="Enter Your Review"
//                   ></textarea>
//                 </div>

//                 <button
//                   type="submit"
//                   className="bg-black text-white px-4 py-2 rounded"
//                 >
//                   Submit
//                 </button>
//               </form>
//             </div>
//             {/* <h3 className="text-lg font-semibold mt-8 mb-4">Add your Review</h3> */}
//             <form className="space-y-4">{/* Review form here */}</form>
//           </div>
//         )}
//       </div>
//       <div className="container mx-14 pb-10">
//         <h2 className="mx-14 text-4xl font-medium tracking-[1px] mb-12">
//           Related Products
//         </h2>
//         <div className="mx-14 lg:flex lg:gap-7 h-[500px]">
//           <div className="swiper mySwiper">
//             <div className="swiper-wrapper">
//               <div className="swiper-slide">
//                 <div className="xl:col-span-3 lg:col-span-4 col-span-12 md:col-span-6 mb-2 w-[264px] mx-auto">
//                   <div className="product-card hover:bg-zinc-100">
//                     <div className="w-full h-[332px] relative">
//                       <a href="#">
//                         <i className="fa-regular fa-star text-lg bg-white px-[13px] py-[14px] rounded-full absolute top-5 right-6 btn invisible opacity-0 transition-opacity duration-300 hover:bg-black hover:text-white" />
//                       </a>
//                       <a href="#">
//                         <i className="fa-solid fa-arrow-right-arrow-left text-lg bg-white px-4 py-[14px] rounded-full absolute top-[70px] right-6 btn invisible opacity-0 transition-opacity duration-300 hover:bg-black hover:text-white" />
//                       </a>
//                       <a href="#">
//                         <i className="fa-regular fa-eye text-lg bg-white px-[13px] py-[14px] rounded-full absolute top-[121px] right-6 btn invisible opacity-0 transition-opacity duration-300 hover:bg-black hover:text-white" />
//                       </a>
//                       <img
//                         src={product}
//                         alt=""
//                         className="w-[285px] h-[320px]"
//                       />
//                       <button className="hover:bg-blackL hover:text-white absolute px-[75px] py-3 left-4 rounded-lg bottom-5 bg-white invisible opacity-30 transition-opacity btn duration-300">
//                         Add to Cart
//                       </button>
//                     </div>
//                     <div className="bg-white pt-4">
//                       <a href="#">
//                         <h5 className="font-bold text-lg">Allen Solly</h5>
//                       </a>
//                       <p className="my-1 font-normal ">
//                         Women Texttured Handheld Bag
//                       </p>
//                       <p className="font-medium text-lg">
//                         $80.00
//                         <span className="text-black/20 line-through px-1">
//                           $100.00
//                         </span>
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               {/* Add more related product slides as needed */}
//             </div>
//           </div>
//         </div>
//       </div>
//       <section>
//         <div className="container">
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4  gap-14 mt-12 mb-24">
//             <div className="mx-auto">
//               <i className="fa-regular fa-box text-3xl" />
//               <h3 className="font-bold text-xl mt-3 mb-2">Free Shipping</h3>
//               <p>Free shipping for order above $150</p>
//             </div>
//             <div className="mx-auto">
//               <i className="fa-regular fa-circle-dollar text-3xl" />
//               <h3 className="font-bold text-xl mt-3 mb-2">Money Guarantee</h3>
//               <p>Within 30 days for an exchange</p>
//             </div>
//           </div>
//         </div>
//       </section>

//       {previewImage && (
//         <Image
//           wrapperStyle={{ display: "none" }}
//           preview={{
//             visible: previewOpen,
//             onVisibleChange: (visible) => setPreviewOpen(visible),
//             afterOpenChange: (visible) => !visible && setPreviewImage(""),
//           }}
//           src={previewImage}
//         />
//       )}
//     </>
//   );
// };

// export default ProductDetail;

// import { useState, useEffect, useMemo } from "react";
// import { useParams } from "react-router-dom";
// import { useQuery } from "@tanstack/react-query";
// import instance from "@/configs/client";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Autoplay, FreeMode, Navigation, Pagination, Thumbs } from "swiper/modules";
// import { Image, Rate } from "antd";

// interface ProductData {
//   id: number;
//   ten_san_pham: string;
//   anh_san_pham: string;
//   mo_ta_ngan: string;
//   noi_dung: string;
//   gia_tot: number;
//   danh_muc: {
//     ten_danh_muc: string;
//   };
//   danh_gias: Array<{
//     so_sao_san_pham: number;
//     chat_luong_san_pham: string;
//     user: {
//       ho: string;
//       ten: string;
//       anh_nguoi_dung: string;
//     };
//     created_at: string;
//   }>;
//   bien_the_san_pham: Array<{
//     gia_ban: number;
//     gia_khuyen_mai: number;
//     mau_bien_the: {
//       ten_mau_sac: string;
//       ma_mau_sac: string;
//     };
//     kich_thuoc_bien_the: {
//       kich_thuoc: string;
//     };
//     anh_bien_the: Array<{
//       duong_dan_anh: string;
//     }>;
//   }>;
// }

// const fetchProduct = async (id: string) => {
//   const response = await instance.get(`/chi-tiet-san-pham/${id}`);
//   return response.data.data;
// };

// const ProductDetail = () => {
//   const { id } = useParams<{ id: string }>();
//   const [thumbsSwiper, setThumbsSwiper] = useState(null);
//   const [previewOpen, setPreviewOpen] = useState(false);
//   const [previewImage, setPreviewImage] = useState("");
//   const [selectedColor, setSelectedColor] = useState<string | null>(null);
//   const [selectedSize, setSelectedSize] = useState<string | null>(null);
//   const [currentImages, setCurrentImages] = useState<string[]>([]);
//   const [selectedVariant, setSelectedVariant] = useState<ProductData['bien_the_san_pham'][0] | null>(null);

//   const { data: product, isLoading, isError } = useQuery<ProductData>({
//     queryKey: ['product', id],
//     queryFn: () => fetchProduct(id!),
//   });
//   const formatCurrency = (amount: number) => {
//     return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
//   };
//   useEffect(() => {
//     if (product) {
//       const defaultVariant = product.bien_the_san_pham[0];
//       setSelectedColor(defaultVariant.mau_bien_the.ma_mau_sac);
//       setSelectedSize(defaultVariant.kich_thuoc_bien_the.kich_thuoc);
//       setCurrentImages(defaultVariant.anh_bien_the.map(img => img.duong_dan_anh));
//       setSelectedVariant(defaultVariant);
//     }
//   }, [product]);

//   if (isLoading) return <div>Loading...</div>;
//   if (isError) return <div>Error fetching product</div>;

//   const handleColorClick = (color: string) => {
//     setSelectedColor(color);
//     updateVariant(color, selectedSize);
//   };

//   const handleSizeClick = (size: string) => {
//     setSelectedSize(size);
//     updateVariant(selectedColor, size);
//   };

//   const updateVariant = (color: string | null, size: string | null) => {
//     if (color && size && product) {
//       const variant = product.bien_the_san_pham.find(
//         v => v.mau_bien_the.ma_mau_sac === color && v.kich_thuoc_bien_the.kich_thuoc === size
//       );
//       if (variant) {
//         setSelectedVariant(variant);
//         setCurrentImages(variant.anh_bien_the.map(img => img.duong_dan_anh));
//       }
//     }
//   };

//   const handlePreview = (imageUrl: string) => {
//     setPreviewImage(imageUrl);
//     setPreviewOpen(true);
//   };

//   const averageRating = useMemo(() => {
//     if (product && product.danh_gias.length > 0) {
//       const totalStars = product.danh_gias.reduce((sum, review) => sum + review.so_sao_san_pham, 0);
//       return totalStars / product.danh_gias.length;
//     }
//     return 0;
//   }, [product]);
//   return (
//     <>
//       <section>
//         <div className="container">
//               <div className="mx-14 flex mt-[70px] mb-9">
//         <p className="pr-2">Home</p>
//             &gt;
//             <p className="px-2">Shop</p>
//             &gt;
//             <p className="px-2">{product?.danh_muc?.ten_danh_muc}</p>
//           </div>
//         </div>
//       </section>
// <br /> <br /> <br />
//       <section>
//         <div className="container pb-11">
//           <div className="md:px-14 px-5 pt-3 grid grid-cols-12 gap-3 w-[100%] justify-center">
//             <div className="lg:col-span-6 col-span-12 mb-6">
//               <div className="bg-[#FAFAFB] xl:w-[555px] xl:h-[535px] lg:w-[455px] lg:h-[455px] md:h-[555px] md:w-[655px] w-[405px] h-[325px] inline-flex justify-center items-center mb-5 rounded-2xl shadow shadow-zinc-300/60">
//                 <Swiper
//                   style={{
//                     "--swiper-navigation-color": "#000000",
//                     "--swiper-pagination-color": "#000000",
//                   } as React.CSSProperties}
//                   centeredSlides={true}
//                   autoplay={{
//                     delay: 2500,
//                     disableOnInteraction: false,
//                   }}
//                   pagination={{
//                     clickable: true,
//                   }}
//                   navigation={true}
//                   thumbs={thumbsSwiper ? { swiper: thumbsSwiper } : undefined}
//                   modules={[Autoplay, Pagination, Navigation, Thumbs, FreeMode]}
//                   className="mySwiper2 w-[555px] swiper-with-hover"
//                   loop={true}
//                   spaceBetween={10}
//                 >
//                   {currentImages.map((image, index) => (
//                     <SwiperSlide key={index}>
//                       <img
//                         src={image}
//                         alt=""
//                         onClick={() => handlePreview(image)}
//                         style={{ cursor: "pointer" }}
//                       />
//                     </SwiperSlide>
//                   ))}
//                 </Swiper>
//               </div>
//               <div className="w-[500px] mx-auto">
//                 <Swiper
//                   onSwiper={(swiperInstance) =>
//                     setThumbsSwiper(swiperInstance as any)
//                   }
//                   loop={true}
//                   spaceBetween={31}
//                   slidesPerView={4}
//                   freeMode={true}
//                   watchSlidesProgress={true}
//                   modules={[FreeMode, Navigation, Thumbs]}
//                   className="mySwiper1"
//                 >
//                   {currentImages.map((image, index) => (
//                     <SwiperSlide key={`thumb-${index}`}>
//                       <div className="md:w-[100px] md:h-[100px] w-[62px] h-[60px] bg-[#F4F4F4] rounded-2xl px-1 border border-[#F4F4F4] flex justify-center items-center">
//                         <img src={image} alt=""   style={{ 
//       cursor: "pointer", 
//       width: '100%', 
//       height: '100%', 
//       objectFit: 'cover', 
//       borderRadius: 'inherit' 
//     }}   />
//                       </div>
//                     </SwiperSlide>
//                   ))}
//                 </Swiper>
//               </div>
//             </div>
//             <div className="lg:col-span-6 col-span-12 px-4 w-[100%]">
//               <div className="product_detail_name">
//                 <div className="flex justify-between mb-2">
//                   <h3 className="font-bold text-3xl">{product.ten_san_pham}</h3>
//                   <div>
//                     <a className="bg-[#3CD139]/10 text-sm px-2 py-1 text-[#3CD139] rounded-sm">
//                       In Stock
//                     </a>
//                   </div>
//                 </div>
//                 <h4 className="mb-3 text-2xl font-normal">{product.mo_ta_ngan}</h4>
//                 <div className="stars_reviews flex items-center mb-3">
//                     <Rate disabled value={averageRating} allowHalf />
//                     <span className="px-2 text-[#A4A1AA]">
//                       {averageRating.toFixed(1)} <span className="px-[2px]">({product.danh_gias.length} Đánh giá)</span>
//                     </span>
//                   </div>
//               </div>
//               <div className="mb-5 text-xl font-medium">
//                   {formatCurrency(selectedVariant?.gia_ban || 0)}
//                   {selectedVariant?.gia_khuyen_mai > 0 && (
//                     <del className="text-[#A4A1AA] ml-2">
//                       {formatCurrency(selectedVariant.gia_khuyen_mai)}
//                     </del>
//                   )}
//                 </div>
//               {/* <p className="description mb-4 font-medium">{product.noi_dung}</p> */}
//               <div className="mb-4">
//                 <h3 className="text-gray-900 mb-2 font-bold text-lg">Color</h3>
//                 <div className="flex space-x-2">
//                   {Array.from(new Set(product.bien_the_san_pham.map(v => v.mau_bien_the.ma_mau_sac))).map((color, index) => (
//                     <button
//                       key={index}
//                       className={`w-9 h-9 rounded-md border-2 ${
//                         selectedColor === color ? "border-black" : ""
//                       }`}
//                       style={{ backgroundColor: color }}
//                       onClick={() => handleColorClick(color)}
//                     />
//                   ))}
//                 </div>
//               </div>
//               <div className="items-center mt-4 mb-3">
//                 <h3 className="mr-4 font-bold text-lg">Size</h3>
//                 <div className="flex mt-3">
//                   {Array.from(new Set(product.bien_the_san_pham.map(v => v.kich_thuoc_bien_the.kich_thuoc))).map((size, index) => (
//                     <button
//                       key={index}
//                       onClick={() => handleSizeClick(size)}
//                       className={`w-10 h-10 rounded-md border border-blackL text-blackL hover:bg-blackL hover:text-white mr-2 ${
//                         selectedSize === size ? "bg-blackL text-white" : ""
//                       }`}
//                     >
//                       {size}
//                     </button>
//                   ))}
//                 </div>
//               </div>
//               {/* Add to cart and wishlist buttons */}
//             </div>
//           </div>
//         </div>
//       </section>

//       {product && (
//         <section className="mt-10">
//           <h2 className="text-2xl font-bold mb-4">Đánh giá của khách hàng</h2>
//           {product.danh_gias.map((review, index) => (
//             <div key={index} className="mb-4 p-4 border rounded">
//               <div className="flex items-center mb-2">
//                 <img
//                   src={review.user.anh_nguoi_dung}
//                   alt={`${review.user.ho} ${review.user.ten}`}
//                   className="w-10 h-10 rounded-full mr-3"
//                 />
//                 <div>
//                   <p className="font-semibold">{`${review.user.ho} ${review.user.ten}`}</p>
//                   <p className="text-sm text-gray-500">{new Date(review.created_at).toLocaleDateString('vi-VN')}</p>
//                 </div>
//               </div>
//               <Rate disabled defaultValue={review.so_sao_san_pham} />
//               <p className="mt-2">{review.chat_luong_san_pham}</p>
//             </div>
//           ))}
//         </section>
//       )}


//       {previewImage && (
//         <Image
//           wrapperStyle={{ display: "none" }}
//           preview={{
//             visible: previewOpen,
//             onVisibleChange: (visible) => setPreviewOpen(visible),
//             afterOpenChange: (visible) => !visible && setPreviewImage(""),
//           }}
//           src={previewImage}
//         />
//       )}
//     </>
//   );
// };

// export default ProductDetail;
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import instance from "@/configs/client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode, Navigation, Pagination, Thumbs } from "swiper/modules";
import { Button, Image, Rate } from "antd";
import { message } from 'antd';
import SizeGuideModal from "./SizeGuide";
import { EyeOutlined } from "@ant-design/icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp as farThumbsUp } from '@fortawesome/free-regular-svg-icons';
import { faThumbsUp as fasThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { toast } from "react-toastify";
import instanceClient from "@/configs/client";
import { useLocalStorage } from "@/components/hook/useStoratge";
interface ProductData {
  id: number;
  ten_san_pham: string;
  anh_san_pham: string;
  mo_ta_ngan: string;
  noi_dung: string;
  gia_tot: number;
  ma_san_pham: string;
  so_luong: number
  danh_muc: {
    ten_danh_muc: string;
  };
  danh_gias: Array<{
    id: number
    so_sao_san_pham: number;
    chat_luong_san_pham: string;
    user: {
      ho: string;
      ten: string;
      anh_nguoi_dung: string;
      anh_danh_gia: string;
    };
    created_at: string;
    anh_danh_gia?: string;
    huu_ich: boolean;
    phan_hoi: string;
    mo_ta: string;
    trang_thai_danh_gia_nguoi_dung: boolean;
    danh_gia_huu_ich_count: number;
  }>;
  bien_the_san_pham: Array<{
    gia_ban: number;
    gia_khuyen_mai: number;
    gia_khuyen_mai_tam_thoi: number;
    so_luong_bien_the: number;
    mau_bien_the: {
      ten_mau_sac: string;
      ma_mau_sac: string;
    };
    kich_thuoc_bien_the: {
      kich_thuoc: string;
    };
    anh_bien_the: Array<{
      duong_dan_anh: string;
    }>;
  }>;
}
interface RelatedProduct {
  id: number;
  ten_san_pham: string;
  anh_san_pham: string;
  mo_ta_ngan: string;
  gia_ban: string;
  gia_goc: string;
}

const fetchProduct = async (id: string) => {
  const response = await instance.get(`/chi-tiet-san-pham/${id}`);
  return response.data.data;
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

const fetchRelatedProducts = async (productId: number) => {
  const response = await instance.get(`/danh-sach-san-pham-cung-loai/${productId}`);
  return response.data;
};
const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [currentImages, setCurrentImages] = useState<string[]>([]);
  const [isHeart, setIsHeart] = useState(false);
  const [activeTab, setActiveTab] = useState("descriptions");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [user] = useLocalStorage("user" as any, {});
  const access_token = user.access_token || localStorage.getItem("access_token");


  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken');
    if (storedToken) {
      setToken(storedToken);
      instance.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
    }
  }, []);
  const queryClient = useQueryClient();

  const { data: product, isLoading, isError } = useQuery<ProductData>({
    queryKey: ['product', id],
    queryFn: () => fetchProduct(id!),


  });

  const { data: relatedProducts } = useQuery<{ data: RelatedProduct[] }>({
    queryKey: ['relatedProducts', id],
    queryFn: () => fetchRelatedProducts(Number(id)),
    enabled: !!product,
  });

  const likeMutation = useMutation({
    mutationFn: ({ reviewId, isLiked }: { reviewId: number; isLiked: boolean }) => {
      if (!token) {
        throw new Error('Bạn cần đăng nhập để thực hiện hành động này');
      }
      return isLiked
        ? instance.delete(`/danh-gia/${reviewId}/unlike`)
        : instance.post(`/danh-gia/${reviewId}/like`);
    },
    onSuccess: (data: any, variables: { reviewId: number; isLiked: boolean }) => {
      queryClient.setQueryData<ProductData>(['product', id], (oldProduct) => {
        if (!oldProduct) return oldProduct;
        return {
          ...oldProduct,
          danh_gias: oldProduct.danh_gias.map((review) =>
            review.id === variables.reviewId
              ? {
                ...review,
                trang_thai_danh_gia_nguoi_dung: !variables.isLiked,
                danh_gia_huu_ich_count: variables.isLiked
                  ? review.danh_gia_huu_ich_count - 1
                  : review.danh_gia_huu_ich_count + 1,
              }
              : review
          ),
        };
      });
    },
    onError: (error) => {
      message.error(error.message || 'Có lỗi xảy ra khi thực hiện hành động');
    }
  });

  const [quantity, setQuantity] = useState<number>(product?.so_luong || 1);

// tăng số lượng
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
    setQuantity((prev) => prev + 1); // Cập nhật số lượng hiển thị
    queryClient.invalidateQueries({ queryKey: ["cart", access_token] });
  },
  onError: (error: any) => {
    toast.error(error.message || 'Có lỗi xảy ra khi tăng số lượng sản phẩm.');
  },
});

// giảm số lượng
const { mutate: decreaseQuantity } = useMutation({
  mutationFn: async ({ productId, currentQuantity }: { productId: string; currentQuantity: number }) => {
    await instanceClient.put(`/gio-hang/giam-so-luong/${productId}`, 
      { so_luong: currentQuantity - 1 },
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
  },
  onSuccess: () => {
    setQuantity((prev) => prev - 1); // Cập nhật số lượng hiển thị
    queryClient.invalidateQueries({ queryKey: ["cart", access_token] });
  },
  onError: (error: any) => {
    toast.error(error.message || 'Có lỗi xảy ra khi giảm số lượng sản phẩm.');
  },
});


  const handleReviewLike = useCallback((reviewId: number, isLiked: boolean) => {
    if (!token) {
      toast.warning('Bạn cần đăng nhập để thực hiện hành động này');
      return;
    }
    likeMutation.mutate({ reviewId, isLiked });
  }, [likeMutation, token]);



  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };
  const selectedVariant = useMemo(() => {
    if (!product || !selectedColor || !selectedSize) return null;
    return product.bien_the_san_pham.find(
      v => v.mau_bien_the.ma_mau_sac === selectedColor && v.kich_thuoc_bien_the.kich_thuoc === selectedSize
    );
  }, [product, selectedColor, selectedSize]);

  const averageRating = useMemo(() => {
    if (!product || product.danh_gias.length === 0) return 0;
    const totalStars = product.danh_gias.reduce((sum, review) => sum + review.so_sao_san_pham, 0);
    return totalStars / product.danh_gias.length;
  }, [product]);

  const displayPrice = useMemo(() => {
    if (!selectedVariant) return null;
    const { gia_ban, gia_khuyen_mai, gia_khuyen_mai_tam_thoi } = selectedVariant;
    if (gia_khuyen_mai_tam_thoi > 0) {
      return {
        currentPrice: formatCurrency(gia_khuyen_mai_tam_thoi),
        originalPrice: formatCurrency(gia_ban)
      };
    } else if (gia_khuyen_mai > 0) {
      return {
        currentPrice: formatCurrency(gia_khuyen_mai),
        originalPrice: formatCurrency(gia_ban)
      };
    } else {
      return {
        currentPrice: formatCurrency(gia_ban),
        originalPrice: null
      };
    }
  }, [selectedVariant]);

  useEffect(() => {
    if (product) {
      const defaultVariant = product.bien_the_san_pham[0];
      setSelectedColor(defaultVariant.mau_bien_the.ma_mau_sac);
      setSelectedSize(defaultVariant.kich_thuoc_bien_the.kich_thuoc);
      setCurrentImages(defaultVariant.anh_bien_the.map(img => img.duong_dan_anh));
    }
  }, [product]);

  const handleColorClick = (color: string) => {
    setSelectedColor(color);
    updateImages(color, selectedSize);
  };

  const handleSizeClick = (size: string) => {
    setSelectedSize(size);
    updateImages(selectedColor, size);
  };

  const updateImages = (color: string | null, size: string | null) => {
    if (color && size && product) {
      const variant = product.bien_the_san_pham.find(
        v => v.mau_bien_the.ma_mau_sac === color && v.kich_thuoc_bien_the.kich_thuoc === size
      );
      if (variant) {
        setCurrentImages(variant.anh_bien_the.map(img => img.duong_dan_anh));
      }
    }
  };

  const handlePreview = (imageUrl: string) => {
    setPreviewImage(imageUrl);
    setPreviewOpen(true);
  };
  const handleClickHeart = () => {
    setIsHeart(!isHeart);
  };
  const handleCopy = () => {
    if (product?.ma_san_pham) {
      navigator.clipboard.writeText(product.ma_san_pham)
        .then(() => {
          message.success('Đã sao chép vào clipboard!');
        })
        .catch(err => {
          message.error('Không thể sao chép: ' + err);
        });
    }
  };

  const toggleDescription = () => {
    setIsDescriptionExpanded(!isDescriptionExpanded);
  };
  if (isLoading) return <div>Đang tải...</div>;
  if (isError) return <div>Có lỗi khi tải thông tin sản phẩm</div>;

  return (
    <>
      <section>
        <div className="container">
          <div className="mx-14 flex mt-[70px] mb-9">
            <p className="pr-2">Trang chủ</p>
            &gt;
            <p className="px-2">Cửa hàng</p>
            &gt;
            <p className="px-2">{product?.danh_muc.ten_danh_muc}</p>
          </div>
        </div>
      </section>

      {product && (
        <section>
          <div className="container pb-11">
            <div className="md:px-14 px-5 pt-3 grid grid-cols-12 gap-3 w-[100%] justify-center">
              <div className="lg:col-span-6 col-span-12 mb-6">
                {/* <div className="bg-[#FAFAFB] xl:w-[555px] xl:h-[535px] lg:w-[455px] lg:h-[455px] md:h-[555px] md:w-[655px] w-[405px] h-[325px] inline-flex justify-center items-center mb-5 rounded-2xl shadow shadow-zinc-300/60"> */}
                <div className="mt-8 xl:w-[555px] xl:h-[535px] lg:w-[455px] lg:h-[455px] md:h-[555px] md:w-[655px] w-[405px] h-[325px] inline-flex justify-center items-center mb-5 rounded-2xl">

                  <Swiper
                    style={{
                      "--swiper-navigation-color": "#000000",
                      "--swiper-pagination-color": "#000000",
                    } as React.CSSProperties}
                    centeredSlides={true}
                    autoplay={{
                      delay: 2500,
                      disableOnInteraction: false,
                    }}
                    pagination={{
                      clickable: true,
                    }}
                    navigation={true}
                    thumbs={thumbsSwiper ? { swiper: thumbsSwiper } : undefined}
                    modules={[Autoplay, Pagination, Navigation, Thumbs, FreeMode]}
                    className="mySwiper2 w-[500px] swiper-with-hover"
                    loop={true}
                    spaceBetween={10}
                  >
                    {currentImages.map((image, index) => (
                      <SwiperSlide key={index}>
                        <img
                          src={image}
                          alt=""
                          onClick={() => handlePreview(image)}
                          style={{
                            top: '300px',
                            cursor: "pointer",
                            width: '665px',
                            height: 'auto',
                            objectFit: 'cover',
                          }} />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
                <div className=" mt-2 w-[500px] mx-auto">
                  <Swiper
                    onSwiper={(swiperInstance) =>
                      setThumbsSwiper(swiperInstance as any)
                    }
                    loop={true}
                    spaceBetween={31}
                    slidesPerView={4}
                    freeMode={true}
                    watchSlidesProgress={true}
                    modules={[FreeMode, Navigation, Thumbs]}
                    className="mySwiper1"
                  >
                    {currentImages.map((image, index) => (
                      <SwiperSlide key={`thumb-${index}`}>
                        <div className="  md:w-[100px] md:h-[100px] w-[62px] h-[60px] bg-[#F4F4F4] rounded-2xl px-1 border border-[#F4F4F4] flex justify-center items-center">
                          <img src={image} alt="" style={{
                            cursor: "pointer",
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            borderRadius: 'inherit'
                          }} />
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              </div>
              <div className="lg:col-span-6 col-span-12 px-4 w-[100%]">
                <div className="product_detail_name">
                  <div className="flex justify-between">
                    <h3 className="font-bold text-2xl">{product?.ten_san_pham}</h3>
                    {selectedVariant && (
                      <div className="mt-2">
                        <a
                          className={` text-sm px-2 py-1 rounded-sm ${selectedVariant?.so_luong_bien_the > 0
                            ? "bg-[#3CD139]/10 text-[#3CD139]"
                            : "bg-red-500 text-white"
                            }`}
                        >
                          {selectedVariant?.so_luong_bien_the > 0
                            ? `Còn hàng ${selectedVariant?.so_luong_bien_the}`
                            : "Hết hàng"}
                        </a>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center">
                    <h4 className="mb-3 text-lg font-normal">Mã: {product?.ma_san_pham}</h4>
                    <button
                      onClick={handleCopy}
                      className="py-2 px-3 rounded flex items-center "
                    >
                      <i className="fa-regular fa-copy" style={{ fontSize: '1rem', marginBottom: '14px' }}></i> {/* Điều chỉnh kích thước và khoảng cách */}
                    </button>


                    <div className="stars_reviews flex mt-1">
                      <Rate disabled value={averageRating} allowHalf />
                      <span className="px-2 text-[#A4A1AA] mt-1">
                        {averageRating.toFixed(1)} <span className="px-[2px]">({product?.danh_gias.length})</span>
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <EyeOutlined style={{ fontSize: '24px' }} />
                    <span className="font-bold text-base">{product?.luot_xem}</span>
                    <span>Người đã xem sản phẩm này</span>
                  </div>


                  <h4 className="mb-3 text-2xl font-normal">{product?.mo_ta_ngan}</h4>

                </div>
                <div className="mb-5 text-xl font-medium">
                  {displayPrice && (
                    <>
                      <span className="text-red-600 font-bold">{displayPrice.currentPrice}</span>
                      {displayPrice.originalPrice && (
                        <del className="text-[#A4A1AA] ml-2 text-sm">
                          {displayPrice.originalPrice}
                        </del>
                      )}
                    </>
                  )}
                </div>
                {/* <p className="description mb-4 font-medium">{product.noi_dung}</p> */}
                <div className="mb-4">
                  <h3 className="text-gray-900 mb-2 font-bold text-lg">Màu sắc</h3>
                  <div className="flex space-x-2">
                    {Array.from(new Set(product.bien_the_san_pham.map(v => v.mau_bien_the.ma_mau_sac))).map((color, index) => (
                      <button
                        key={index}
                        className={`w-9 h-9 rounded-md border-2 ${selectedColor === color ? "border-black" : ""
                          }`}
                        style={{ backgroundColor: color }}
                        onClick={() => handleColorClick(color)}
                      />
                    ))}
                  </div>
                </div>
                <div className="items-center mt-4 mb-3">
                  <div className="flex justify-between items-center">
                    <h3 className="mr-4 font-bold text-lg">Kích thước</h3>
                    <p
                      onClick={toggleModal}
                      className="flex items-center text-sky-600 hover:text-sky-500 cursor-pointer"
                    >
                      <i className="fa-solid fa-pen-ruler mr-2"></i>Bảng kích thước
                    </p>

                    {/* Modal Component */}
                    <SizeGuideModal isOpen={isModalOpen} onClose={toggleModal} />
                  </div>

                  <div className="flex mt-3">
                    {Array.from(new Set(product.bien_the_san_pham.map(v => v.kich_thuoc_bien_the.kich_thuoc))).map((size, index) => (
                      <button
                        key={index}

                        onClick={() => handleSizeClick(size)}
                        className={`w-10 h-10 rounded-md border border-blackL text-blackL hover:bg-blackL hover:text-white mr-2 ${selectedSize === size ? "bg-blackL text-white" : ""
                          }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-12 flex gap-5">
                  <div className="border rounded-lg border-black xl:w-32 xl:h-14 ld:w-24 lg:h-10 md:w-32 md:h-14 w-24 h-10 flex justify-center items-center shadow-lg shadow-slate-400/50">
                    <button
                      onClick={() => {
                        if (quantity > 1) {
                          decreaseQuantity({ productId: product.id.toString(), currentQuantity: quantity });
                        }
                      }}
                      className="py-2 pr-2"
                      disabled={quantity <= 1} // Ngăn không cho số lượng giảm dưới 1
                    >
                      <i className="fa-solid fa-minus" />
                    </button>

                    <input
                      type="number"
                      value={quantity} // Liên kết giá trị với state
                      readOnly
                      className="xl:w-10 xl:h-10 lg:w-5 lg:h-5 md:w-10 md:h-10 w-5 h-5 border-0 focus:ring-0 focus:outline-none text-center"
                    />

                    <button
                      onClick={() => increaseQuantity({ productId: product.id.toString(), currentQuantity: quantity })}
                      className="py-2 pl-2"
                    >
                      <i className="fa-solid fa-plus" />
                    </button>
                  </div>

                  <button className="btn-black xl:w-[340px] w-[250px] lg:w-[250px] md:w-[340px] xl:h-14 lg:h-10  md:h-14 h-10 rounded-lg">
                    Thêm vào giỏ hàng
                  </button>
                  <button
                    onClick={handleClickHeart}
                    className={`border border-black xl:w-16 lg:w-11 md:w-16 w-11 xl:h-14 lg:h-10 md:h-14 h-10 rounded-lg flex items-center justify-center shadow-lg shadow-slate-400/50 ${isHeart ? "bg-red-600" : ""
                      }`}
                  >
                    <i
                      className={`fa-regular fa-heart text-2xl ${isHeart ? "text-white" : "text-red-600"}`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

      )}
      <div className="max-w-6xl mx-auto p-8">
        <div className="flex space-x-8 border-b pb-2 mb-4">
          <button
            className={`font-medium ${activeTab === "descriptions" ? "text-black border-b-2 border-black pb-2" : "text-gray-700"}`}
            onClick={() => setActiveTab("descriptions")}
          >
            Chi tiết sản phẩm
          </button>
          <button
            className={`font-medium ${activeTab === "additionalInfo" ? "text-black border-b-2 border-black pb-2" : "text-gray-700"}`}
            onClick={() => setActiveTab("additionalInfo")}
          >
            Thông tin bổ sung
          </button>
          <button
            className={`font-medium ${activeTab === "reviews" ? "text-black border-b-2 border-black pb-2" : "text-gray-700"}`}
            onClick={() => setActiveTab("reviews")}
          >
            Đánh giá          </button>
        </div>

        {activeTab === "descriptions" && (
          <div className="mb-4">
            <div
              className={`description mb-4 text-sm px-5 whitespace-pre-wrap ${isDescriptionExpanded ? "" : "line-clamp-3"
                }`}
              dangerouslySetInnerHTML={{ __html: product?.noi_dung || "" }}
            />
            <div className="flex justify-center">
              <Button onClick={toggleDescription} className="mb-4">
                {isDescriptionExpanded ? "Thu gọn" : "Xem thêm"}
              </Button>
            </div>
          </div>
        )}
        {activeTab === "additionalInfo" && (
          <div className="mb-4">
            <h3 className="text-gray-900 mb-2 font-bold text-lg">Màu</h3>
            <div className="flex flex-wrap gap-2">
              {product?.bien_the_san_pham
                .map(variant => variant.mau_bien_the.ten_mau_sac)
                .filter((color, index, self) => self.indexOf(color) === index)
                .map((color, index) => (
                  <span key={index} className="px-2 py-1 bg-gray-100 rounded">
                    {color}
                  </span>
                ))}
            </div>
            <h3 className="mt-4 mb-2 font-bold text-lg">Kíchthước</h3>
            <div className="flex flex-wrap gap-2">
              {product?.bien_the_san_pham
                .map(variant => variant.kich_thuoc_bien_the.kich_thuoc)
                .filter((size, index, self) => self.indexOf(size) === index)
                .map((size, index) => (
                  <span key={index} className="px-2 py-1 bg-gray-100 rounded">
                    {size}
                  </span>
                ))}
            </div>
          </div>
        )}


        {activeTab === "reviews" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Customer Reviews</h2>

            {activeTab === "reviews" && product && (
              <div className="space-y-6">
                {product.danh_gias.map((review) => (
                  <div key={review.id} className="border p-4 rounded-lg shadow-sm">
                    <div className="flex items-center space-x-4 mb-3">
                      <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                        <img
                          src={review.user.anh_nguoi_dung || "https://i.pravatar.cc/100"}
                          alt={`${review.user.ho} ${review.user.ten}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-medium">{`${review.user.ho} ${review.user.ten}`}</h4>
                        <div className="flex items-center justify-between">
                          <span className="text-yellow-500 text-sm">
                            {"★".repeat(review.so_sao_san_pham)}
                            {"☆".repeat(5 - review.so_sao_san_pham)}
                          </span>
                          <span className="ml-1 text-xs text-gray-500">
                            {new Date(review.created_at).toLocaleString()}
                          </span>
                          <div className="flex-1 text-xs text-gray-600 border-l border-gray-300 pl-1 ml-1">
                            <span className="">Phân loại hàng:</span> {review.bien_the_san_pham.mau_bien_the.ten_mau_sac},{review.bien_the_san_pham.kich_thuoc_bien_the.kich_thuoc}
                          </div>
                        </div>

                      </div>

                    </div>
                    <p className="text-gray-600 text-sm mb-3">
                      <span>Đúng với mô tả:</span> <span className="font-bold">{review.mo_ta}</span>
                    </p>


                    <p className="text-gray-600  text-sm mb-2">
                      <span className="font-bold"> {review.chat_luong_san_pham}</span>
                    </p>

                    {review.anh_danh_gia && (
                      <div className="flex flex-wrap gap-2">
                        {review.anh_danh_gia.split(',').map((img: string, index: number) => (
                          <div key={index} className="w-[72px] h-[72px] overflow-hidden rounded-lg">
                            <img
                              src={img.trim()}
                              alt={`Review Image ${index + 1}`}
                              className="w-full h-full object-cover"
                              onClick={() => review.anh_danh_gia && handlePreview(review.anh_danh_gia)}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                    {review.phan_hoi && (
                      <div className="mt-2 pl-4 border-l-2 border-gray-300">
                        <p className="text-gray-600 italic text-sm">Phản hồi: {review.phan_hoi}</p>
                      </div>
                    )}
                    <div className="mt-2 flex items-center space-x-4">

                      <button
                        className={`like-button flex items-center space-x-2 ${likeMutation.isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={() => handleReviewLike(review.id, review.trang_thai_danh_gia_nguoi_dung)}
                        disabled={likeMutation.isLoading}
                      >
                        <FontAwesomeIcon
                          icon={review.trang_thai_danh_gia_nguoi_dung ? fasThumbsUp : farThumbsUp}
                          className={review.trang_thai_danh_gia_nguoi_dung ? 'text-blue-500' : 'text-gray-500'}
                        />
                        <span>
                          {likeMutation.isLoading ? (
                            'Đang xử lý...'
                          ) : (
                            <>
                              {review.trang_thai_danh_gia_nguoi_dung ? 'Đã thích' : 'Hữu ích'} ({review.danh_gia_huu_ich_count})
                            </>
                          )}
                        </span>
                      </button>


                    </div>
                  </div>
                ))}
              </div>
            )}
            {/* 
            <div className="space-y-6">
              <h3 className="text-lg font-semibold mt-8 mb-4">
                Add your Review
              </h3>
              <form className="space-y-4">
                <div>
                  <label className="block font-medium">Your Rating</label>
                  <div className="flex space-x-2 text-yellow-500 text-xl">
                    {[...Array(5)].map((_, i) => (
                      <button key={i} type="button">
                        ★
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-medium">Name</label>
                  <input
                    type="text"
                    className="w-full border p-2 rounded"
                    placeholder="Enter Your Name"
                  />
                </div>

                <div>
                  <label className="block font-medium">Email Address</label>
                  <input
                    type="email"
                    className="w-full border p-2 rounded"
                    placeholder="Enter Your Email"
                  />
                </div>

                <div>
                  <label className="block font-medium">Your Review</label>
                  <textarea
                    className="w-full border p-2 rounded"
                    placeholder="Enter Your Review"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="bg-black text-white px-4 py-2 rounded"
                >
                  Submit
                </button>
              </form>
            </div> */}
            <form className="space-y-4">{/* Review form here */}</form>
          </div>
        )}
      </div>

      <div className="container mx-14 pb-10">
        <h2 className="mx-14 text-4xl font-medium tracking-[1px] mb-12">
          Sản phẩm cùng loại        </h2>
        <div className="mx-14 lg:flex lg:gap-7 h-[500px]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {relatedProducts?.data.map((product) => (
              <div key={product.id} className="xl:col-span-1 lg:col-span-1 col-span-1 md:col-span-1 mb-2 w-[264px] mx-auto">
                <div className="product-card hover:bg-zinc-100">
                  <div className="w-full h-[332px] relative">
                    <a href="#">
                      <i className="fa-regular fa-star text-lg bg-white px-[13px] py-[14px] rounded-full absolute top-5 right-6 btn invisible opacity-0 transition-opacity duration-300 hover:bg-black hover:text-white" />
                    </a>
                    <a href="#">
                      <i className="fa-solid fa-arrow-right-arrow-left text-lg bg-white px-4 py-[14px] rounded-full absolute top-[70px] right-6 btn invisible opacity-0 transition-opacity duration-300 hover:bg-black hover:text-white" />
                    </a>
                    <a href="#">
                      <i className="fa-regular fa-eye text-lg bg-white px-[13px] py-[14px] rounded-full absolute top-[121px] right-6 btn invisible opacity-0 transition-opacity duration-300 hover:bg-black hover:text-white" />
                    </a>
                    <img
                      src={product.anh_san_pham}
                      alt={product.ten_san_pham}
                      className="w-[285px] h-[320px] object-cover"
                    />
                    <button className="hover:bg-blackL hover:text-white absolute px-[75px] py-3 left-4 rounded-lg bottom-5 bg-white invisible opacity-30 transition-opacity btn duration-300">
                      Add to Cart
                    </button>
                  </div>
                  <div className="bg-white pt-4">
                    <a href="#">
                      <h5 className="font-bold text-lg">{product.ten_san_pham}</h5>
                    </a>
                    <p className="my-1 font-normal">
                      {product.mo_ta_ngan}
                    </p>
                    <p className="font-medium text-lg">
                      {product.gia_ban}
                      <span className="text-black/20 line-through px-1">
                        {product.gia_goc}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <section>
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-10 mt-12 mb-24">
            <div className="flex items-center border-r border-gray-200 pr-6">
              <div className="border border-red-100 bg-red-50 rounded-full p-3 mr-4">
                <i className="fa-solid fa-hand-holding-dollar text-2xl text-red-400" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Thanh toán khi nhận hàng (COD)</h3>
                <p className="text-gray-500">Giao hàng toàn quốc.</p>
              </div>
            </div>
            <div className="flex items-center border-r border-gray-200 pr-6">
              <div className="border border-red-100 bg-red-50 rounded-full p-3 mr-4">
                <i className="fa-solid fa-truck-fast text-2xl text-red-400" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Miễn phí giao hàng</h3>
                <p className="text-gray-500">Với đơn hàng trên 599.000 ₫.</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="border border-red-100 bg-red-50 rounded-full p-3 mr-4">
                <i className="fa-solid fa-box-open text-2xl text-red-400" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Đổi hàng miễn phí</h3>
                <p className="text-gray-500">Trong 30 ngày kể từ ngày mua.</p>
              </div>
            </div>
          </div>
        </div>
      </section>


      {previewImage && (
        <Image
          style={{ display: 'none' }}
          preview={{
            visible: previewOpen,
            src: previewImage,
            onVisibleChange: (visible) => {
              setPreviewOpen(visible);
              if (!visible) {
                setPreviewImage('');
              }
            },
          }}
        />
      )}
    </>
  );
};

export default ProductDetail;
