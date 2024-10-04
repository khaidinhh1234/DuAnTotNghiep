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

// const Detail = () => {
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

// <section>
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
//       <div className="flex space-x-8 border-b pb-2 mb-4">
     
//         </div>
//         <div>
//             <h2 className="text-xl font-semibold mb-4">Customer Reviews</h2>

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
//             </div>
//           </div>
//         </div>
    

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

// export default Detail;
// import { product, products1, products2, sanPham2 } from "@/assets/img";
// import { Image, Modal } from "antd";
// import { useState } from "react";
// import {
//   Autoplay,
//   FreeMode,
//   Navigation,
//   Pagination,
//   Thumbs,
// } from "swiper/modules";
// import { Swiper, SwiperSlide } from "swiper/react";

// const Detail = () => {
//   const [thumbsSwiper, setThumbsSwiper] = useState(null);
//   const [previewOpen, setPreviewOpen] = useState(false);
//   const [previewImage, setPreviewImage] = useState("");
//   const [selectedColor, setSelectedColor] = useState(null);
//   const [selectedSize, setSelectedSize] = useState<string | null>(null);
//   const [isHeart, setIsHeart] = useState(false);
//   const [open, setOpen] = useState(false);
//   const handleCancel = () => {
//     setOpen(false);
//   };
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
//     <div>
//       {" "}
//     <Button onClick={() => setOpen(true)}>Xem chi tiết </Button>
//     <Modal
//       centered
//       open={open}
//       width={1200}
//       className=" "
//       okText="Đồng ý"
//       footer={null}
//       onCancel={handleCancel}
//     >
//     <div className="max-w-6xl mx-auto my-8 p-6 border rounded-lg shadow-lg">
//       <section className="mb-8">
//         <div className="container pb-8">
//           <div className="md:px-8 px-4 pt-3 grid grid-cols-12 gap-3 w-full justify-center">
//             <div className="lg:col-span-6 col-span-12 mb-6">
//               <div className="bg-[#FAFAFB] w-full h-[400px] inline-flex justify-center items-center mb-4 rounded-2xl shadow shadow-zinc-300/60">
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
//                   className="mySwiper2 w-full swiper-with-hover"
//                   loop={true}
//                   spaceBetween={10}
//                 >
//                   {images.map((image, index) => (
//                     <SwiperSlide key={index}>
//                       <img
//                         src={image}
//                         alt=""
//                         onClick={() => handlePreview(image)}
//                         style={{ cursor: "pointer", maxHeight: "100%", width: "auto" }}
//                       />
//                     </SwiperSlide>
//                   ))}
//                 </Swiper>
//               </div>
//               <div className="w-full mx-auto">
//                 <Swiper
//                   onSwiper={(swiperInstance) =>
//                     setThumbsSwiper(swiperInstance as any)
//                   }
//                   loop={true}
//                   spaceBetween={16}
//                   slidesPerView={4}
//                   freeMode={true}
//                   watchSlidesProgress={true}
//                   modules={[FreeMode, Navigation, Thumbs]}
//                   className="mySwiper1"
//                 >
//                   {images.map((image, index) => (
//                     <SwiperSlide key={index}>
//                       <div className="w-[80px] h-[80px] bg-[#F4F4F4] rounded-lg px-1 border border-[#F4F4F4] flex justify-center items-center">
//                         <img src={image} alt="" style={{ cursor: "pointer", maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
//                       </div>
//                     </SwiperSlide>
//                   ))}
//                 </Swiper>
//               </div>
//             </div>
//             <div className="lg:col-span-6 col-span-12 px-4 w-full">
//               <div className="product_detail_name">
//                 <div className="flex justify-between mb-2">
//                   <h3 className="font-bold text-2xl">YK Disney</h3>
//                   <div>
//                     <a className="bg-[#3CD139]/10 text-xs px-2 py-1 text-[#3CD139] rounded-sm">
//                       In Stock
//                     </a>
//                   </div>
//                 </div>
//                 <h4 className="mb-3 text-xl font-normal">
//                   Áo đẹp thoáng mát co giãn
//                 </h4>
//                 <div className="stars_reviews flex mb-3">
//                   <span>
//                     <i className="fa-solid fa-star text-yellow-400 text-lg" />
//                     <i className="fa-solid fa-star text-yellow-400 text-lg" />
//                     <i className="fa-solid fa-star text-yellow-400 text-lg" />
//                     <i className="fa-solid fa-star text-yellow-400 text-lg" />
//                     <i className="fa-solid fa-star text-yellow-400 text-lg" />
//                   </span>
//                   <span className="px-2 text-[#A4A1AA] text-sm">
//                     5.0 <span className="px-[2px]">(122 Reviews)</span>
//                   </span>
//                 </div>
//               </div>
//               <div className="mb-4 text-lg font-medium">
//                 $80.00 <del className="text-[#A4A1AA]">$100.00</del>
//               </div>
//               <p className="description mb-4 text-sm">
//                 To use these apps, you will need to open the app and then take a
//                 picture of the image. The app will then process the image and
//                 return the extracted text.
//               </p>
//               <div className="mb-4">
//                 <h3 className="text-gray-900 mb-2 font-bold">Color</h3>
//                 <div className="flex space-x-2">
//                   {colors.map((color, index) => (
//                     <button
//                       key={index}
//                       className={`w-7 h-7 rounded-md border-2 ${
//                         selectedColor === color ? "border-black" : ""
//                       } ${selectedColor === color ? color : `${color} opacity-100`}`}
//                       onClick={() => handleColorClick(color)}
//                     />
//                   ))}
//                 </div>
//               </div>
//               <div className="items-center mt-4 mb-3">
//                 <h3 className="mr-4 font-bold">Size</h3>
//                 <div className="flex mt-3">
//                   {sizes.map((size) => (
//                     <button
//                       key={size}
//                       onClick={() => handleSizeClick(size)}
//                       className={`w-8 h-8 rounded-md border border-blackL text-blackL hover:bg-blackL hover:text-white mr-2 ${
//                         selectedSize === size ? "bg-blackL text-white" : ""
//                       }`}
//                     >
//                       {size}
//                     </button>
//                   ))}
//                 </div>
//               </div>
//               <div className="mt-8 flex gap-3">
//                 <div className="border rounded-lg border-black w-24 h-10 flex justify-center items-center shadow-md">
//                   <button className="py-1 pr-2">
//                     <i className="fa-solid fa-minus" />
//                   </button>
//                   <input
//                     type="number"
//                     id="numberInput"
//                     defaultValue={1}
//                     min={1}
//                     maxLength={2}
//                     className="w-8 h-8 border-0 focus:ring-0 focus:outline-none text-center"
//                   />
//                   <button className="py-1 pl-2">
//                     <i className="fa-solid fa-plus" />
//                   </button>
//                 </div>
//                 <button className="btn-black w-[200px] h-10 rounded-lg text-sm">
//                   Add to Cart
//                 </button>
//                 <button
//                   onClick={handleClickHeart}
//                   className={`border border-black w-10 h-10 rounded-lg flex items-center justify-center shadow-md ${
//                     isHeart ? "bg-red-600" : ""
//                   }`}
//                 >
//                   <i
//                     className={`fa-regular fa-heart text-xl ${isHeart ? "text-white" : "text-red-600"}`}
//                   />
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>
//       <div className="border-t pt-6">
//         <div className="flex space-x-6 border-b pb-2 mb-4">
//           {/* Add any tabs or additional content here */}
//         </div>
//         <div>
//           <h2 className="text-lg font-semibold mb-4">Customer Reviews</h2>
//           <div className="space-y-4">
//             {/* Review Item */}
//             <div className="border p-3 rounded-lg">
//               <div className="flex items-center space-x-3 mb-2">
//                 <div className="w-10 h-10 rounded-full overflow-hidden">
//                   <img
//                     src="https://i.pravatar.cc/100"
//                     alt="Mark Williams"
//                     className="w-full h-full object-cover"
//                   />
//                 </div>
//                 <div>
//                   <h4 className="font-medium text-sm">Mark Williams</h4>
//                   <div className="flex items-center">
//                     <span className="text-yellow-500 text-sm">★★★★★</span>
//                     <span className="ml-2 text-xs text-gray-500">
//                       Jan 05, 2023
//                     </span>
//                   </div>
//                 </div>
//               </div>
//               <p className="text-gray-700 font-medium mb-1 text-sm">
//                 Excellent Product, I Love It 😍
//               </p>
//               <p className="text-gray-600 text-xs">
//                 It is a long established fact that a reader will be distracted
//                 by the readable content of a page when looking at its layout.
//               </p>
//             </div>
//             {/* Another Review Item */}
//             <div className="border p-3 rounded-lg">
//               <div className="flex items-center space-x-3 mb-2">
//                 <div className="w-10 h-10 rounded-full overflow-hidden">
//                   <img
//                     src="https://i.pravatar.cc/100?img=2"
//                     alt="Alexa Johnson"
//                     className="w-full h-full object-cover"
//                   />
//                 </div>
//                 <div>
//                   <h4 className="font-medium text-sm">Alexa Johnson</h4>
//                   <div className="flex items-center">
//                     <span className="text-yellow-500 text-sm">★★★★★</span>
//                     <span className="ml-2 text-xs text-gray-500">
//                       Jan 06, 2023
//                     </span>
//                   </div>
//                 </div>
//               </div>
//               <p className="text-gray-700 font-medium mb-1 text-sm">
//                 My Daughter is very much happy with this product
//               </p>
//               <p className="text-gray-600 text-xs">
//                 It is a long established fact that a reader will be distracted
//                 by the readable content of a page when looking at its layout.
//               </p>
//             </div>   
//           </div>
//         </div>
//       </div>
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
//     </div>
//     </Modal>
//     </div>
//   );
// };

// export default Detail;
// import { product, products1, products2, sanPham2 } from "@/assets/img";
// import { EyeOutlined } from "@ant-design/icons";
// import { Image, Modal, Button } from "antd";
// import { useState } from "react";
// import {
//   Autoplay,
//   FreeMode,
//   Navigation,
//   Pagination,
//   Thumbs,
// } from "swiper/modules";
// import { Swiper, SwiperSlide } from "swiper/react";

// const Detail = () => {
//   const [thumbsSwiper, setThumbsSwiper] = useState(null);
//   const [previewOpen, setPreviewOpen] = useState(false);
//   const [previewImage, setPreviewImage] = useState("");
//   const [selectedColor, setSelectedColor] = useState(null);
//   const [selectedSize, setSelectedSize] = useState<string | null>(null);
//   const [isHeart, setIsHeart] = useState(false);
//   const [open, setOpen] = useState(false);

//   const handleCancel = () => {
//     setOpen(false);
//   };

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
//     <div>
//       <Button onClick={() => setOpen(true)}><EyeOutlined /></Button>
//       <Modal
//         centered
//         open={open}
//         width={1200}
//         className=""
//         okText="Đồng ý"
//         footer={null}
//         onCancel={handleCancel}
//       >
//         <div className="max-w-6xl mx-auto my-8 p-6 border rounded-lg shadow-lg">
//         <section className="mb-8">
//          <div className="container pb-8">
//            <div className="md:px-8 px-4 pt-3 grid grid-cols-12 gap-3 w-full justify-center">
//             <div className="lg:col-span-6 col-span-12 mb-6">
//                <div className="bg-[#FAFAFB] w-full h-[400px] inline-flex justify-center items-center mb-4 rounded-2xl shadow shadow-zinc-300/60">
//                  <Swiper
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
//                   className="mySwiper2 w-full swiper-with-hover"
//                   loop={true}
//                   spaceBetween={10}
//                 >
//                   {images.map((image, index) => (
//                     <SwiperSlide key={index}>
//                       <img
//                         src={image}
//                         alt=""
//                         onClick={() => handlePreview(image)}
//                         style={{ cursor: "pointer", maxHeight: "100%", width: "auto" }}
//                       />
//                     </SwiperSlide>
//                   ))}
//                 </Swiper>
//               </div>
//               <div className="w-full mx-auto">
//                 <Swiper
//                   onSwiper={(swiperInstance) =>
//                     setThumbsSwiper(swiperInstance as any)
//                   }
//                   loop={true}
//                   spaceBetween={16}
//                   slidesPerView={4}
//                   freeMode={true}
//                   watchSlidesProgress={true}
//                   modules={[FreeMode, Navigation, Thumbs]}
//                   className="mySwiper1"
//                 >
//                   {images.map((image, index) => (
//                     <SwiperSlide key={index}>
//                       <div className="w-[80px] h-[80px] bg-[#F4F4F4] rounded-lg px-1 border border-[#F4F4F4] flex justify-center items-center">
//                         <img src={image} alt="" style={{ cursor: "pointer", maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
//                       </div>
//                     </SwiperSlide>
//                   ))}
//                 </Swiper>
//               </div>
//             </div>
//             <div className="lg:col-span-6 col-span-12 px-4 w-full">
//               <div className="product_detail_name">
//                 <div className="flex justify-between mb-2">
//                   <h3 className="font-bold text-2xl">YK Disney</h3>
//                   <div>
//                     <a className="bg-[#3CD139]/10 text-xs px-2 py-1 text-[#3CD139] rounded-sm">
//                       In Stock
//                     </a>
//                   </div>
//                 </div>
//                 <h4 className="mb-3 text-xl font-normal">
//                   Áo đẹp thoáng mát co giãn
//                 </h4>
//                 <div className="stars_reviews flex mb-3">
//                   <span>
//                     <i className="fa-solid fa-star text-yellow-400 text-lg" />
//                     <i className="fa-solid fa-star text-yellow-400 text-lg" />
//                     <i className="fa-solid fa-star text-yellow-400 text-lg" />
//                     <i className="fa-solid fa-star text-yellow-400 text-lg" />
//                     <i className="fa-solid fa-star text-yellow-400 text-lg" />
//                   </span>
//                   <span className="px-2 text-[#A4A1AA] text-sm">
//                     5.0 <span className="px-[2px]">(122 Reviews)</span>
//                   </span>
//                 </div>
//               </div>
//               <div className="mb-4 text-lg font-medium">
//                 $80.00 <del className="text-[#A4A1AA]">$100.00</del>
//               </div>
//               <p className="description mb-4 text-sm">
//                 To use these apps, you will need to open the app and then take a
//                 picture of the image. The app will then process the image and
//                 return the extracted text.
//               </p>
//               <div className="mb-4">
//                 <h3 className="text-gray-900 mb-2 font-bold">Color</h3>
//                 <div className="flex space-x-2">
//                   {colors.map((color, index) => (
//                     <button
//                       key={index}
//                       className={`w-7 h-7 rounded-md border-2 ${
//                         selectedColor === color ? "border-black" : ""
//                       } ${selectedColor === color ? color : `${color} opacity-100`}`}
//                       onClick={() => handleColorClick(color)}
//                     />
//                   ))}
//                 </div>
//               </div>
//               <div className="items-center mt-4 mb-3">
//                 <h3 className="mr-4 font-bold">Size</h3>
//                 <div className="flex mt-3">
//                   {sizes.map((size) => (
//                     <button
//                       key={size}
//                       onClick={() => handleSizeClick(size)}
//                       className={`w-8 h-8 rounded-md border border-blackL text-blackL hover:bg-blackL hover:text-white mr-2 ${
//                         selectedSize === size ? "bg-blackL text-white" : ""
//                       }`}
//                     >
//                       {size}
//                     </button>
//                   ))}
//                 </div>
//               </div>
//               <div className="mt-8 flex gap-3">
//                 <div className="border rounded-lg border-black w-24 h-10 flex justify-center items-center shadow-md">
//                   <button className="py-1 pr-2">
//                     <i className="fa-solid fa-minus" />
//                   </button>
//                   <input
//                     type="number"
//                     id="numberInput"
//                     defaultValue={1}
//                     min={1}
//                     maxLength={2}
//                     className="w-8 h-8 border-0 focus:ring-0 focus:outline-none text-center"
//                   />
//                   <button className="py-1 pl-2">
//                     <i className="fa-solid fa-plus" />
//                   </button>
//                 </div>
//                 <button className="btn-black w-[200px] h-10 rounded-lg text-sm">
//                   Add to Cart
//                 </button>
//                 <button
//                   onClick={handleClickHeart}
//                   className={`border border-black w-10 h-10 rounded-lg flex items-center justify-center shadow-md ${
//                     isHeart ? "bg-red-600" : ""
//                   }`}
//                 >
//                   <i
//                     className={`fa-regular fa-heart text-xl ${isHeart ? "text-white" : "text-red-600"}`}
//                   />
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>
//       <div className="border-t pt-6">
//         <div className="flex space-x-6 border-b pb-2 mb-4">
//           {/* Add any tabs or additional content here */}
//         </div>
//         <div>
//           <h2 className="text-lg font-semibold mb-4">Customer Reviews</h2>
//           <div className="space-y-4">
//             {/* Review Item */}
//             <div className="border p-3 rounded-lg">
//               <div className="flex items-center space-x-3 mb-2">
//                 <div className="w-10 h-10 rounded-full overflow-hidden">
//                   <img
//                     src="https://i.pravatar.cc/100"
//                     alt="Mark Williams"
//                     className="w-full h-full object-cover"
//                   />
//                 </div>
//                 <div>
//                   <h4 className="font-medium text-sm">Mark Williams</h4>
//                   <div className="flex items-center">
//                     <span className="text-yellow-500 text-sm">★★★★★</span>
//                     <span className="ml-2 text-xs text-gray-500">
//                       Jan 05, 2023
//                     </span>
//                   </div>
//                 </div>
//               </div>
//               <p className="text-gray-700 font-medium mb-1 text-sm">
//                 Excellent Product, I Love It 😍
//               </p>
//               <p className="text-gray-600 text-xs">
//                 It is a long established fact that a reader will be distracted
//                 by the readable content of a page when looking at its layout.
//               </p>
//             </div>
//             {/* Another Review Item */}
//             <div className="border p-3 rounded-lg">
//               <div className="flex items-center space-x-3 mb-2">
//                 <div className="w-10 h-10 rounded-full overflow-hidden">
//                   <img
//                     src="https://i.pravatar.cc/100?img=2"
//                     alt="Alexa Johnson"
//                     className="w-full h-full object-cover"
//                   />
//                 </div>
//                 <div>
//                   <h4 className="font-medium text-sm">Alexa Johnson</h4>
//                   <div className="flex items-center">
//                     <span className="text-yellow-500 text-sm">★★★★★</span>
//                     <span className="ml-2 text-xs text-gray-500">
//                       Jan 06, 2023
//                     </span>
//                   </div>
//                 </div>
//               </div>
//               <p className="text-gray-700 font-medium mb-1 text-sm">
//                 My Daughter is very much happy with this product
//               </p>
//               <p className="text-gray-600 text-xs">
//                 It is a long established fact that a reader will be distracted
//                 by the readable content of a page when looking at its layout.
//               </p>
//             </div>   
//           </div>
//         </div>
//       </div>
//         </div>
//       </Modal>
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
//     </div>
//   );
// };

// export default Detail;
// import React, { useState } from 'react';
// import { useQuery } from '@tanstack/react-query';
// import { Swiper, SwiperSlide } from 'swiper/react';
// import { FreeMode, Navigation, Thumbs } from 'swiper/modules';
// import type { Swiper as SwiperType } from 'swiper';
// import instance from '@/configs/admin';

// // Import Swiper styles
// import 'swiper/css';
// import 'swiper/css/free-mode';
// import 'swiper/css/navigation';
// import 'swiper/css/thumbs';
// import { Button, Modal } from 'antd';
// import { EyeOutlined } from '@ant-design/icons';

// interface ProductDetailProps {
//   item: {
//     id: number;
//   };
// }

// interface ProductVariant {
//   id: number;
//   gia_ban: number;
//   gia_khuyen_mai?: number;
//   mau_bien_the: {
//     ma_mau_sac: string;
//   };
//   kich_thuoc_bien_the: {
//     kich_thuoc: string;
//   };
//   anh_bien_the: Array<{ duong_dan_anh: string }>;
// }

// interface Product {
//   id: number;
//   ten_san_pham: string;
//   mo_ta_ngan: string;
//   noi_dung: string;
//   anh_san_pham: string;
//   bien_the_san_pham: ProductVariant[];
// }

// const ProductDetail: React.FC<ProductDetailProps> = ({ item }) => {
//   const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
//   const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
//   const [open, setOpen] = useState(false);

//   const handleCancel = () => {
//     setOpen(false);
//   };

//   const { data, isLoading, error } = useQuery<{ data: Product }>({
//     queryKey: ["PRODUCT_DETAIL", item.id],
//     queryFn: async () => {
//       const response = await instance.get(`/sanpham/${item.id}`);
//       return response.data;
//     },
//   });

//   if (isLoading) return <div>Loading...</div>;
//   if (error) return <div>Error: {(error as Error).message}</div>;
//   if (!data || !data.data) return <div>No product data available</div>;

//   const product = data.data;

//   const handleVariantSelect = (variant: ProductVariant) => {
//     setSelectedVariant(variant);
//   };

//   const mainImage = product.anh_san_pham;
//   const variantImages = selectedVariant ? selectedVariant.anh_bien_the.map(img => img.duong_dan_anh) : [];
//   const allImages = [mainImage, ...variantImages].filter(Boolean);

//   return (
//     <div>
//           <Button onClick={() => setOpen(true)}><EyeOutlined /></Button>
//            <Modal
//             centered
//             open={open}
//             width={1200}
//             className=""
//             okText="Đồng ý"
//             footer={null}
//             onCancel={handleCancel}
//           >
//     <div className="container mx-auto px-4 py-8">
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//         <div>
//           {allImages.length > 0 && (
//             <>
//               <Swiper
//                 style={{
//                   '--swiper-navigation-color': '#fff',
//                   '--swiper-pagination-color': '#fff',
//                 } as React.CSSProperties}
//                 spaceBetween={10}
//                 navigation={true}
//                 thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
//                 modules={[FreeMode, Navigation, Thumbs]}
//                 className="mb-4"
//               >
//                 {allImages.map((image, index) => (
//                   <SwiperSlide key={index}>
//                     <img src={image} alt={`Product ${index + 1}`} className="w-full" />
//                   </SwiperSlide>
//                 ))}
//               </Swiper>
//               <Swiper
//                 onSwiper={setThumbsSwiper}
//                 spaceBetween={10}
//                 slidesPerView={4}
//                 freeMode={true}
//                 watchSlidesProgress={true}
//                 modules={[FreeMode, Navigation, Thumbs]}
//                 className="thumbs-swiper"
//               >
//                 {allImages.map((image, index) => (
//                   <SwiperSlide key={index}>
//                     <img src={image} alt={`Thumbnail ${index + 1}`} className="w-full" />
//                   </SwiperSlide>
//                 ))}
//               </Swiper>
//             </>
//           )}
//         </div>
//         <div>
//           <h1 className="text-3xl font-bold mb-4">{product.ten_san_pham}</h1>
//           <p className="text-gray-600 mb-4">{product.mo_ta_ngan}</p>
//           <div className="mb-4">
//             <h2 className="text-xl font-semibold mb-2">Color Options</h2>
//             <div className="flex space-x-2">
//               {product.bien_the_san_pham.map((variant) => (
//                 <button
//                   key={variant.id}
//                   onClick={() => handleVariantSelect(variant)}
//                   className={`w-8 h-8 rounded-full border-2 ${
//                     selectedVariant === variant ? 'border-black' : 'border-gray-300'
//                   }`}
//                   style={{ backgroundColor: variant.mau_bien_the.ma_mau_sac }}
//                 />
//               ))}
//             </div>
//           </div>
//           <div className="mb-4">
//             <h2 className="text-xl font-semibold mb-2">Size Options</h2>
//             <div className="flex space-x-2">
//               {product.bien_the_san_pham.map((variant) => (
//                 <button
//                   key={variant.id}
//                   onClick={() => handleVariantSelect(variant)}
//                   className={`px-3 py-1 border rounded ${
//                     selectedVariant === variant
//                       ? 'bg-black text-white'
//                       : 'border-gray-300'
//                   }`}
//                 >
//                   {variant.kich_thuoc_bien_the.kich_thuoc}
//                 </button>
//               ))}
//             </div>
//           </div>
//           {selectedVariant && (
//             <div className="mb-4">
//               <p className="text-2xl font-bold">
//                 ${selectedVariant.gia_ban.toFixed(2)}
//                 {selectedVariant.gia_khuyen_mai && (
//                   <span className="text-red-500 ml-2 text-lg line-through">
//                     ${selectedVariant.gia_khuyen_mai.toFixed(2)}
//                   </span>
//                 )}
//               </p>
//             </div>
//           )}
//           <button className="bg-black text-white px-6 py-2 rounded">
//             Add to Cart
//           </button>
//         </div>
//       </div>
//       <div className="mt-8">
//         <h2 className="text-2xl font-bold mb-4">Product Description</h2>
//         <div dangerouslySetInnerHTML={{ __html: product.noi_dung }} />
//       </div>
//     </div>
//     </Modal>
//     </div>

//   );
// };

// export default ProductDetail;
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, FreeMode, Navigation, Pagination, Thumbs } from "swiper/modules";
import type { Swiper as SwiperType } from 'swiper';
import instance from '@/configs/admin';
import { Button, Modal, Image } from 'antd';
import { EyeOutlined } from '@ant-design/icons';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';

interface ProductDetailProps {
  item: {
    id: number;
  };
}

interface ProductVariant {
  id: number;
  gia_ban: number;
  gia_khuyen_mai?: number;
  mau_bien_the: {
    ma_mau_sac: string;
    ten_mau: string;
  };
  kich_thuoc_bien_the: {
    kich_thuoc: string;
  };
  anh_bien_the: Array<{ duong_dan_anh: string }>;
}

interface Product {
  id: number;
  ten_san_pham: string;
  mo_ta_ngan: string;
  noi_dung: string;
  anh_san_pham: string;
  bien_the_san_pham: ProductVariant[];
}

const ProductDetail: React.FC<ProductDetailProps> = ({ item }) => {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [isHeart, setIsHeart] = useState(false);

  const { data, isLoading, error } = useQuery<{ data: Product }>({
    queryKey: ["PRODUCT_DETAIL", item.id],
    queryFn: async () => {
      const response = await instance.get(`/sanpham/${item.id}`);
      return response.data;
    },
  });

  useEffect(() => {
    if (data && data.data.bien_the_san_pham.length > 0) {
      setSelectedColor(data.data.bien_the_san_pham[0].mau_bien_the.ma_mau_sac);
      setSelectedSize(data.data.bien_the_san_pham[0].kich_thuoc_bien_the.kich_thuoc);
    }
  }, [data]);

  const handleCancel = () => {
    setOpen(false);
  };

  const handlePreview = (imageUrl: string) => {
    setPreviewImage(imageUrl);
    setPreviewOpen(true);
  };

  const handleClickHeart = () => {
    setIsHeart(!isHeart);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {(error as Error).message}</div>;
  if (!data || !data.data) return <div>No product data available</div>;

  const product = data.data;

  const uniqueColors = Array.from(new Set(product.bien_the_san_pham.map(variant => variant.mau_bien_the.ma_mau_sac)));
  const sizesForSelectedColor = product.bien_the_san_pham
    .filter(variant => variant.mau_bien_the.ma_mau_sac === selectedColor)
    .map(variant => variant.kich_thuoc_bien_the.kich_thuoc);

  const selectedVariant = product.bien_the_san_pham.find(
    variant => variant.mau_bien_the.ma_mau_sac === selectedColor && variant.kich_thuoc_bien_the.kich_thuoc === selectedSize
  );

  const variantImages = selectedVariant ? selectedVariant.anh_bien_the.map(img => img.duong_dan_anh) : [];
  const allImages = [product.anh_san_pham, ...variantImages].filter(Boolean);

  return (
    <div>
      <Button onClick={() => setOpen(true)}><EyeOutlined /></Button>
      <Modal
        centered
        open={open}
        width={1200}
        className=""
        okText="Đồng ý"
        footer={null}
        onCancel={handleCancel}
      >
        <div className="max-w-6xl mx-auto my-8 p-6 border rounded-lg shadow-lg">
          <section className="mb-8">
            <div className="container pb-8">
              <div className="md:px-8 px-4 pt-3 grid grid-cols-12 gap-3 w-full justify-center">
                <div className="lg:col-span-6 col-span-12 mb-6">
                  <div className="bg-[#FAFAFB] w-full h-[400px] inline-flex justify-center items-center mb-4 rounded-2xl shadow shadow-zinc-300/60">
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
                      className="mySwiper2 w-full swiper-with-hover"
                      loop={true}
                      spaceBetween={10}
                    >
                      {allImages.map((image, index) => (
                        <SwiperSlide key={index}>
                          <img
                            src={image}
                            alt=""
                            onClick={() => handlePreview(image)}
                            style={{ cursor: "pointer", maxHeight: "100%", width: "auto" }}
                          />
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </div>
                  <div className="w-full mx-auto">
                    <Swiper
                      onSwiper={(swiperInstance) =>
                        setThumbsSwiper(swiperInstance as any)
                      }
                      loop={true}
                      spaceBetween={16}
                      slidesPerView={4}
                      freeMode={true}
                      watchSlidesProgress={true}
                      modules={[FreeMode, Navigation, Thumbs]}
                      className="mySwiper1"
                    >
                      {allImages.map((image, index) => (
                        <SwiperSlide key={index}>
                          <div className="w-[80px] h-[80px] bg-[#F4F4F4] rounded-lg px-1 border border-[#F4F4F4] flex justify-center items-center">
                            <img src={image} alt="" style={{ cursor: "pointer", maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
                          </div>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </div>
                </div>
                <div className="lg:col-span-6 col-span-12 px-4 w-full">
                  <div className="product_detail_name">
                    <div className="flex justify-between mb-2">
                      <h3 className="font-bold text-2xl">{product.ten_san_pham}</h3>
                      <div>
                        <a className="bg-[#3CD139]/10 text-xs px-2 py-1 text-[#3CD139] rounded-sm">
                          In Stock
                        </a>
                      </div>
                    </div>
                    <h4 className="mb-3 text-xl font-normal">
                      {product.mo_ta_ngan}
                    </h4>
                    <div className="stars_reviews flex mb-3">
                      <span>
                        <i className="fa-solid fa-star text-yellow-400 text-lg" />
                        <i className="fa-solid fa-star text-yellow-400 text-lg" />
                        <i className="fa-solid fa-star text-yellow-400 text-lg" />
                        <i className="fa-solid fa-star text-yellow-400 text-lg" />
                        <i className="fa-solid fa-star text-yellow-400 text-lg" />
                      </span>
                      <span className="px-2 text-[#A4A1AA] text-sm">
                        5.0 <span className="px-[2px]">(122 Reviews)</span>
                      </span>
                    </div>
                  </div>
                  {selectedVariant && (
                    <div className="mb-4 text-lg font-medium">
                      ${selectedVariant.gia_ban.toFixed(2)}
                      {selectedVariant.gia_khuyen_mai && (
                        <del className="text-[#A4A1AA] ml-2">${selectedVariant.gia_khuyen_mai.toFixed(2)}</del>
                      )}
                    </div>
                  )}
                  <p className="description mb-4 text-sm">
                    {product.noi_dung}
                  </p>
                  <div className="mb-4">
                    <h3 className="text-gray-900 mb-2 font-bold">Color</h3>
                    <div className="flex space-x-2">
                      {uniqueColors.map((color, index) => (
                        <button
                          key={index}
                          className={`w-7 h-7 rounded-md border-2 ${
                            selectedColor === color ? "border-black" : ""
                          }`}
                          style={{ backgroundColor: color }}
                          onClick={() => setSelectedColor(color)}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="items-center mt-4 mb-3">
                    <h3 className="mr-4 font-bold">Size</h3>
                    <div className="flex mt-3">
                      {sizesForSelectedColor.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`w-8 h-8 rounded-md border border-blackL text-blackL hover:bg-blackL hover:text-white mr-2 ${
                            selectedSize === size ? "bg-blackL text-white" : ""
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="mt-8 flex gap-3">
                    <div className="border rounded-lg border-black w-24 h-10 flex justify-center items-center shadow-md">
                      <button className="py-1 pr-2">
                        <i className="fa-solid fa-minus" />
                      </button>
                      <input
                        type="number"
                        id="numberInput"
                        defaultValue={1}
                        min={1}
                        maxLength={2}
                        className="w-8 h-8 border-0 focus:ring-0 focus:outline-none text-center"
                      />
                      <button className="py-1 pl-2">
                        <i className="fa-solid fa-plus" />
                      </button>
                    </div>
                    <button className="btn-black w-[200px] h-10 rounded-lg text-sm">
                      Add to Cart
                    </button>
                    <button
                      onClick={handleClickHeart}
                      className={`border border-black w-10 h-10 rounded-lg flex items-center justify-center shadow-md ${
                        isHeart ? "bg-red-600" : ""
                      }`}
                    >
                      <i
                        className={`fa-regular fa-heart text-xl ${isHeart ? "text-white" : "text-red-600"}`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <div className="border-t pt-6">
            <div className="flex space-x-6 border-b pb-2 mb-4">
              {/* Add any tabs or additional content here */}
            </div>
            <div>
              <h2 className="text-lg font-semibold mb-4">Customer Reviews</h2>
              <div className="space-y-4">
                {/* Review Item */}
                <div className="border p-3 rounded-lg">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-10 h-10 rounded-full overflow-hidden">
                      <img
                        src="https://i.pravatar.cc/100"
                        alt="Mark Williams"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">Mark Williams</h4>
                      <div className="flex items-center">
                        <span className="text-yellow-500 text-sm">★★★★★</span>
                        <span className="ml-2 text-xs text-gray-500">
                          Jan 05, 2023
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 font-medium mb-1 text-sm">
                    Excellent Product, I Love It 😍
                  </p>
                  <p className="text-gray-600 text-xs">
                    It is a long established fact that a reader will be distracted
                    by the readable content of a page when looking at its layout.
                  </p>
                </div>
                {/* Another Review Item */}
                <div className="border p-3 rounded-lg">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-10 h-10 rounded-full overflow-hidden">
                      <img
                        src="https://i.pravatar.cc/100?img=2"
                        alt="Alexa Johnson"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">Alexa Johnson</h4>
                      <div className="flex items-center">
                        <span className="text-yellow-500 text-sm">★★★★★</span>
                        <span className="ml-2 text-xs text-gray-500">
                          Jan 06, 2023
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 font-medium mb-1 text-sm">
                    My Daughter is very much happy with this product
                  </p>
                  <p className="text-gray-600 text-xs">
                    It is a long established fact that a reader will be distracted
                    by the readable content of a page when looking at its layout.
                  </p>
                </div>   
              </div>
            </div>
          </div>
        </div>
      </Modal>
      <Image
        style={{ display: 'none' }}
        src={previewImage}
        preview={{
          visible: previewOpen,
          onVisibleChange: (visible) => {
            setPreviewOpen(visible);
          },
        }}
      />
    </div>
  );
};

export default ProductDetail;
