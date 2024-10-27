// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { useState } from "react";
// import { A11y, Navigation, Pagination, Scrollbar } from "swiper/modules";
// import Banner from "./_component/banner";

// import { Swiper, SwiperSlide } from "swiper/react";

// // Import Swiper styles
// import "swiper/css";
// import "swiper/css/navigation";
// import "swiper/css/pagination";
// import "swiper/css/scrollbar";
// const Voucher = () => {
//   // const vourcher = [
//   //   {
//   //     title: "From 77K",
//   //     content: "Voucher",
//   //   },
//   // ];
//   const [activeTab, setActiveTab] = useState("account");

//   console.log(activeTab);
//   return (
//     <div>
//       <div>
//         <main>
//           <section className="container">
//             <div className="lg:mx-14 mx-6 lg:my-[40px] my-[42px]">
//               <span>Home</span>
//               <i className="fa-light fa-chevron-right px-2" />
//               <span>Khuyễn mãi</span>
//             </div>
//           </section>
//           <Banner />
//           <section>
//             <div className="container">
//               <div className="my-5 md:mx-14">
//                 <span className="text-2xl font-bold text-red-500">
//                   Khuyến mãi hôm nay
//                 </span>
//               </div>
//               <div className="my-5 md:mx-14">
//                 <span className="text-2xl text-black font-bold">
//                   7.7 Sản phẩm chiến dịch
//                 </span>
//               </div>
//               <div className="md:mx-14 grid grid-cols-12 gap-7 mb-20">
//                 <div className="mx-auto bg-gradient-to-l from-pink-200 to-pink-700 col-span-12 lg:col-span-4 md:col-span-6 md:w-80 w-96  text-center  shadow-fuchsia-700-500/50 shadow-2xl">
//                   <div className=" px-6  pt-5 ">
//                     <div className="flex gap-2 justify-center">
//                       {" "}
//                       <img
//                         src="../assets/images/vocher/voucher1.jpg"
//                         alt=""
//                         className="w-32 h-24 hover:scale-110 transition duration-300 ease-in-out transform"
//                       />
//                       <img
//                         src="../assets/images/vocher/voucher2.jpg"
//                         alt=""
//                         className="w-32 h-24 hover:scale-110 transition duration-300 ease-in-out transform"
//                       />
//                     </div>
//                   </div>{" "}
//                   <div className="mt-2 py-5 w-80 bg-white rounded-ss-[50px] rounded-se-[50px] shadow-orange-300 shadow-2xl mx-auto">
//                     <h3 className="font-normal text-3xl mb-1">Hot Deals</h3>
//                     <p className="text-red-400">Sale Up To 90%</p>
//                   </div>
//                 </div>
//                 <div className="mx-auto bg-gradient-to-l from-pink-200 to-pink-700 col-span-12 lg:col-span-4 md:col-span-6 md:w-80 w-96  text-center  shadow-fuchsia-700-500/50 shadow-2xl">
//                   <div className=" px-6  pt-5 ">
//                     <div className="flex gap-2 justify-center">
//                       {" "}
//                       <img
//                         src="../assets/images/vocher/voucher1.jpg"
//                         alt=""
//                         className="w-32 h-24 hover:scale-110 transition duration-300 ease-in-out transform"
//                       />
//                       <img
//                         src="../assets/images/vocher/voucher2.jpg"
//                         alt=""
//                         className="w-32 h-24 hover:scale-110 transition duration-300 ease-in-out transform"
//                       />
//                     </div>
//                   </div>{" "}
//                   <div className="mt-2 py-5 w-80 bg-white rounded-ss-[50px] rounded-se-[50px] shadow-orange-300 shadow-2xl mx-auto">
//                     <h3 className="font-normal text-3xl mb-1">Hot Deals</h3>
//                     <p className="text-red-400">Sale Up To 90%</p>
//                   </div>
//                 </div>{" "}
//                 <div className="mx-auto bg-gradient-to-l from-pink-200 to-pink-700 col-span-12 lg:col-span-4 md:col-span-6 md:w-80 w-96  text-center  shadow-fuchsia-700-500/50 shadow-2xl">
//                   <div className=" px-6  pt-5 ">
//                     <div className="flex gap-2 justify-center">
//                       {" "}
//                       <img
//                         src="../assets/images/vocher/voucher1.jpg"
//                         alt=""
//                         className="w-32 h-24 hover:scale-110 transition duration-300 ease-in-out transform"
//                       />
//                       <img
//                         src="../assets/images/vocher/voucher2.jpg"
//                         alt=""
//                         className="w-32 h-24 hover:scale-110 transition duration-300 ease-in-out transform"
//                       />
//                     </div>
//                   </div>{" "}
//                   <div className="mt-2 py-5 w-80 bg-white rounded-ss-[50px] rounded-se-[50px] shadow-orange-300 shadow-2xl mx-auto">
//                     <h3 className="font-normal text-3xl mb-1">Hot Deals</h3>
//                     <p className="text-red-400">Sale Up To 90%</p>
//                   </div>
//                 </div>{" "}
//                 <div className="mx-auto bg-gradient-to-l from-pink-200 to-pink-700 col-span-12 lg:col-span-4 md:col-span-6 md:w-80 w-96  text-center  shadow-fuchsia-700-500/50 shadow-2xl">
//                   <div className=" px-6  pt-5 ">
//                     <div className="flex gap-2 justify-center">
//                       {" "}
//                       <img
//                         src="../assets/images/vocher/voucher1.jpg"
//                         alt=""
//                         className="w-32 h-24 hover:scale-110 transition duration-300 ease-in-out transform"
//                       />
//                       <img
//                         src="../assets/images/vocher/voucher2.jpg"
//                         alt=""
//                         className="w-32 h-24 hover:scale-110 transition duration-300 ease-in-out transform"
//                       />
//                     </div>
//                   </div>{" "}
//                   <div className="mt-2 py-5 w-80 bg-white rounded-ss-[50px] rounded-se-[50px] shadow-orange-300 shadow-2xl mx-auto">
//                     <h3 className="font-normal text-3xl mb-1">Hot Deals</h3>
//                     <p className="text-red-400">Sale Up To 90%</p>
//                   </div>
//                 </div>{" "}
//                 <div className="mx-auto bg-gradient-to-l from-pink-200 to-pink-700 col-span-12 lg:col-span-4 md:col-span-6 md:w-80 w-96  text-center  shadow-fuchsia-700-500/50 shadow-2xl">
//                   <div className=" px-6  pt-5 ">
//                     <div className="flex gap-2 justify-center">
//                       {" "}
//                       <img
//                         src="../assets/images/vocher/voucher1.jpg"
//                         alt=""
//                         className="w-32 h-24 hover:scale-110 transition duration-300 ease-in-out transform"
//                       />
//                       <img
//                         src="../assets/images/vocher/voucher2.jpg"
//                         alt=""
//                         className="w-32 h-24 hover:scale-110 transition duration-300 ease-in-out transform"
//                       />
//                     </div>
//                   </div>{" "}
//                   <div className="mt-2 py-5 w-80 bg-white rounded-ss-[50px] rounded-se-[50px] shadow-orange-300 shadow-2xl mx-auto">
//                     <h3 className="font-normal text-3xl mb-1">Hot Deals</h3>
//                     <p className="text-red-400">Sale Up To 90%</p>
//                   </div>
//                 </div>
//                 <div className="mx-auto bg-gradient-to-l from-pink-200 to-pink-700 col-span-12 lg:col-span-4 md:col-span-6 md:w-80 w-96  text-center  shadow-fuchsia-700-500/50 shadow-2xl">
//                   <div className=" px-6  pt-5 ">
//                     <div className="flex gap-2 justify-center">
//                       {" "}
//                       <img
//                         src="../assets/images/vocher/voucher1.jpg"
//                         alt=""
//                         className="w-32 h-24 hover:scale-110 transition duration-300 ease-in-out transform"
//                       />
//                       <img
//                         src="../assets/images/vocher/voucher2.jpg"
//                         alt=""
//                         className="w-32 h-24 hover:scale-110 transition duration-300 ease-in-out transform"
//                       />
//                     </div>
//                   </div>{" "}
//                   <div className="mt-2 py-5 w-80 bg-white rounded-ss-[50px] rounded-se-[50px] shadow-orange-300 shadow-2xl mx-auto">
//                     <h3 className="font-normal text-3xl mb-1">Hot Deals</h3>
//                     <p className="text-red-400">Sale Up To 90%</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </section>
//           <section>
//             <div className="container">
//               <div className="my-5 md:mx-14">
//                 <span className="text-2xl text-black font-bold">
//                   COLLECT MORE VOUCHER
//                 </span>
//               </div>

//               <Tabs defaultValue="account" className="">
//                 <TabsList className="mb-10">
//                   <TabsTrigger
//                     value="account"
//                     onClick={() => setActiveTab("account")}
//                   >
//                     {" "}
//                     {/* <a href="#"> */}
//                     <div
//                       className={`bg-neutral-200/50 md:w-[200px] w-[130px] p-3 md:px-12 px-5 rounded-md text-center hover:bg-white hover:text-pink-500 border hover:border-pink-500  ${activeTab == "account" ? "border-pink-500 text-pink-500 border bg-white" : ""}`}
//                     >
//                       <p className="font-bold md:text-xl">From 77K</p>
//                       <p className="font-medium">Voucher</p>
//                     </div>
//                     {/* </a> */}
//                   </TabsTrigger>
//                   <TabsTrigger
//                     value="password"
//                     onClick={() => setActiveTab("password")}
//                   >
//                     <div
//                       className={`bg-neutral-200/50 md:w-[200px] w-[130px] p-3 md:px-12 px-5 rounded-md text-center hover:bg-white hover:text-pink-500 border hover:border-pink-500  ${activeTab == "password" ? "border-pink-500 text-pink-500 border bg-white" : ""}`}
//                     >
//                       <p className="font-bold md:text-xl">From 87K</p>
//                       <p className="font-medium">Voucher</p>
//                     </div>
//                     {/* </a> */}
//                   </TabsTrigger>
//                 </TabsList>
//                 <TabsContent value="account">
//                   <div className="md:w-full w-[400px] mb-9 mx-auto ">
//                     <Swiper
//                       // install Swiper modules
//                       modules={[Navigation, Pagination, Scrollbar, A11y]}
//                       spaceBetween={50}
//                       slidesPerView={3}
//                       navigation
//                       breakpoints={{
//                         0: {
//                           slidesPerView: 1.2,
//                           spaceBetween: 10,
//                         },
//                         768: {
//                           slidesPerView: 2,
//                           spaceBetween: 20,
//                         },

//                         1024: {
//                           slidesPerView: 2.5,
//                           spaceBetween: 30,
//                         },
//                         1124: {
//                           slidesPerView: 3,
//                           spaceBetween: 30,
//                         },
//                       }}
//                       onSwiper={(swiper) => console.log(swiper)}
//                       onSlideChange={() => console.log("slide change")}
//                     >
//                       <SwiperSlide>
//                         {" "}
//                         <div className="col-span-12 md:col-span-4 py-2 px-4 relative md:w-[390px] w-[300px] border rounded-2xl bg-slate-100  ">
//                           <div className="w-[390px] md:h-[200px] h-[160px]">
//                             <img
//                               src="../assets/images/vocher/voucher.png"
//                               alt=""
//                             />
//                           </div>
//                           <div className="absolute top-7     left-5 grid grid-cols-6 ">
//                             <div className="md:w-[125px] col-span-2 text-center">
//                               <div className="border border-pink-400 w-12 h-12 flex justify-center items-center md:mx-10 mx-5 mb-3">
//                                 <img
//                                   src="../assets/images/Logo.svg "
//                                   alt=""
//                                   className="w-10 h-10 px-1"
//                                 />
//                               </div>
//                               <h3 className="md:text-xl  text-base font-bold h-10 text-[#fe4960]">
//                                 Nệm Thuần Việt
//                               </h3>
//                             </div>
//                             <div className="col-span-4 px-4 text-[#fe4960]">
//                               <h5 className="font-bold md:text-3xl text-xl">
//                                 $80.00
//                               </h5>
//                               <p className="md:text-xl  text-base">
//                                 Min. spend <span>$120.00</span>
//                               </p>
//                               <p className="md:text-xl  text-base">
//                                 Valid till <span> 10 Jul, 11:59PM </span>
//                               </p>
//                               <div className="flex justify-between items-center">
//                                 <a
//                                   href="#"
//                                   className="bg-pink-200 rounded-lg px-2 mr-1 text-xs"
//                                 >
//                                   T&amp;C
//                                 </a>
//                                 <button className="bg-gradient-to-r from-orange-600 to-pink-500 px-7 py-1 rounded-lg font-bold md:text-2xl text-white">
//                                   Collect
//                                 </button>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       </SwiperSlide>
//                       <SwiperSlide>
//                         {" "}
//                         <div className="col-span-12 md:col-span-4 py-2 px-4 relative md:w-[390px] w-[300px] border rounded-2xl bg-slate-100  ">
//                           <div className="w-[390px] md:h-[200px] h-[160px]">
//                             <img
//                               src="../assets/images/vocher/voucher.png"
//                               alt=""
//                             />
//                           </div>
//                           <div className="absolute top-7     left-5 grid grid-cols-6 ">
//                             <div className="md:w-[125px] col-span-2 text-center">
//                               <div className="border border-pink-400 w-12 h-12 flex justify-center items-center md:mx-10 mx-5 mb-3">
//                                 <img
//                                   src="../assets/images/Logo.svg "
//                                   alt=""
//                                   className="w-10 h-10 px-1"
//                                 />
//                               </div>
//                               <h3 className="md:text-xl  text-base font-bold h-10 text-[#fe4960]">
//                                 Nệm Thuần Việt
//                               </h3>
//                             </div>
//                             <div className="col-span-4 px-4 text-[#fe4960]">
//                               <h5 className="font-bold md:text-3xl text-xl">
//                                 $80.00
//                               </h5>
//                               <p className="md:text-xl  text-base">
//                                 Min. spend <span>$120.00</span>
//                               </p>
//                               <p className="md:text-xl  text-base">
//                                 Valid till <span> 10 Jul, 11:59PM </span>
//                               </p>
//                               <div className="flex justify-between items-center">
//                                 <a
//                                   href="#"
//                                   className="bg-pink-200 rounded-lg px-2 mr-1 text-xs"
//                                 >
//                                   T&amp;C
//                                 </a>
//                                 <button className="bg-gradient-to-r from-orange-600 to-pink-500 px-7 py-1 rounded-lg font-bold md:text-2xl text-white">
//                                   Collect
//                                 </button>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       </SwiperSlide>{" "}
//                       <SwiperSlide>
//                         {" "}
//                         <div className="col-span-12 md:col-span-4 py-2 px-4 relative md:w-[390px] w-[300px] border rounded-2xl bg-slate-100  ">
//                           <div className="w-[390px] md:h-[200px] h-[160px]">
//                             <img
//                               src="../assets/images/vocher/voucher.png"
//                               // alt=""
//                             />
//                           </div>
//                           <div className="absolute top-7     left-5 grid grid-cols-6 ">
//                             <div className="md:w-[125px] col-span-2 text-center">
//                               <div className="border border-pink-400 w-12 h-12 flex justify-center items-center md:mx-10 mx-5 mb-3">
//                                 <img
//                                   src="../assets/images/Logo.svg "
//                                   alt=""
//                                   className="w-10 h-10 px-1"
//                                 />
//                               </div>
//                               <h3 className="md:text-xl  text-base font-bold h-10 text-[#fe4960]">
//                                 Nệm Thuần Việt
//                               </h3>
//                             </div>
//                             <div className="col-span-4 px-4 text-[#fe4960]">
//                               <h5 className="font-bold md:text-3xl text-xl">
//                                 $80.00
//                               </h5>
//                               <p className="md:text-xl  text-base">
//                                 Min. spend <span>$120.00</span>
//                               </p>
//                               <p className="md:text-xl  text-base">
//                                 Valid till <span> 10 Jul, 11:59PM </span>
//                               </p>
//                               <div className="flex justify-between items-center">
//                                 <a
//                                   href="#"
//                                   className="bg-pink-200 rounded-lg px-2 mr-1 text-xs"
//                                 >
//                                   T&amp;C
//                                 </a>
//                                 <button className="bg-gradient-to-r from-orange-600 to-pink-500 px-7 py-1 rounded-lg font-bold md:text-2xl text-white">
//                                   Collect
//                                 </button>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       </SwiperSlide>{" "}
//                       <SwiperSlide>
//                         {" "}
//                         <div className="col-span-12 md:col-span-4 py-2 px-4 relative md:w-[390px] w-[300px] border rounded-2xl bg-slate-100  ">
//                           <div className="w-[390px] md:h-[200px] h-[160px]">
//                             <img
//                               src="../assets/images/vocher/voucher.png"
//                               // alt=""
//                             />
//                           </div>
//                           <div className="absolute top-7     left-5 grid grid-cols-6 ">
//                             <div className="md:w-[125px] col-span-2 text-center">
//                               <div className="border border-pink-400 w-12 h-12 flex justify-center items-center md:mx-10 mx-5 mb-3">
//                                 <img
//                                   src="../assets/images/Logo.svg "
//                                   // alt=""
//                                   className="w-10 h-10 px-1"
//                                 />
//                               </div>
//                               <h3 className="md:text-xl  text-base font-bold h-10 text-[#fe4960]">
//                                 Nệm Thuần Việt
//                               </h3>
//                             </div>
//                             <div className="col-span-4 px-4 text-[#fe4960]">
//                               <h5 className="font-bold md:text-3xl text-xl">
//                                 $80.00
//                               </h5>
//                               <p className="md:text-xl  text-base">
//                                 Min. spend <span>$120.00</span>
//                               </p>
//                               <p className="md:text-xl  text-base">
//                                 Valid till <span> 10 Jul, 11:59PM </span>
//                               </p>
//                               <div className="flex justify-between items-center">
//                                 <a
//                                   href="#"
//                                   className="bg-pink-200 rounded-lg px-2 mr-1 text-xs"
//                                 >
//                                   T&amp;C
//                                 </a>
//                                 <button className="bg-gradient-to-r from-orange-600 to-pink-500 px-7 py-1 rounded-lg font-bold md:text-2xl text-white">
//                                   Collect
//                                 </button>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       </SwiperSlide>{" "}
//                       <SwiperSlide>
//                         {" "}
//                         <div className="col-span-12 md:col-span-4 py-2 px-4 relative md:w-[390px] w-[300px] border rounded-2xl bg-slate-100  ">
//                           <div className="w-[390px] md:h-[200px] h-[160px]">
//                             <img
//                               src="../assets/images/vocher/voucher.png"
//                               alt=""
//                             />
//                           </div>
//                           <div className="absolute top-7     left-5 grid grid-cols-6 ">
//                             <div className="md:w-[125px] col-span-2 text-center">
//                               <div className="border border-pink-400 w-12 h-12 flex justify-center items-center md:mx-10 mx-5 mb-3">
//                                 <img
//                                   src="../assets/images/Logo.svg "
//                                   // alt=""
//                                   className="w-10 h-10 px-1"
//                                 />
//                               </div>
//                               <h3 className="md:text-xl  text-base font-bold h-10 text-[#fe4960]">
//                                 Nệm Thuần Việt
//                               </h3>
//                             </div>
//                             <div className="col-span-4 px-4 text-[#fe4960]">
//                               <h5 className="font-bold md:text-3xl text-xl">
//                                 $80.00
//                               </h5>
//                               <p className="md:text-xl  text-base">
//                                 Min. spend <span>$120.00</span>
//                               </p>
//                               <p className="md:text-xl  text-base">
//                                 Valid till <span> 10 Jul, 11:59PM </span>
//                               </p>
//                               <div className="flex justify-between items-center">
//                                 <a
//                                   href="#"
//                                   className="bg-pink-200 rounded-lg px-2 mr-1 text-xs"
//                                 >
//                                   T&amp;C
//                                 </a>
//                                 <button className="bg-gradient-to-r from-orange-600 to-pink-500 px-7 py-1 rounded-lg font-bold md:text-2xl text-white">
//                                   Collect
//                                 </button>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       </SwiperSlide>
//                     </Swiper>
//                   </div>
//                 </TabsContent>
//                 <TabsContent value="password">
//                   <div className="md:w-full w-[400px] mb-9 mx-auto ">
//                     <Swiper
//                       // install Swiper modules
//                       modules={[Navigation, Pagination, Scrollbar, A11y]}
//                       spaceBetween={50}
//                       slidesPerView={3}
//                       navigation
//                       breakpoints={{
//                         0: {
//                           slidesPerView: 1.2,
//                           spaceBetween: 10,
//                         },
//                         768: {
//                           slidesPerView: 2,
//                           spaceBetween: 20,
//                         },

//                         1024: {
//                           slidesPerView: 2.5,
//                           spaceBetween: 30,
//                         },
//                         1124: {
//                           slidesPerView: 3,
//                           spaceBetween: 30,
//                         },
//                       }}
//                       onSwiper={(swiper) => console.log(swiper)}
//                       onSlideChange={() => console.log("slide change")}
//                     >
//                       <SwiperSlide>
//                         {" "}
//                         <div className="col-span-12 md:col-span-4 py-2 px-4 relative md:w-[390px] w-[300px] border rounded-2xl bg-slate-100  ">
//                           <div className="w-[390px] md:h-[200px] h-[160px]">
//                             <img
//                               src="../assets/images/vocher/voucher.png"
//                               // alt=""
//                             />
//                           </div>
//                           <div className="absolute top-7     left-5 grid grid-cols-6 ">
//                             <div className="md:w-[125px] col-span-2 text-center">
//                               <div className="border border-pink-400 w-12 h-12 flex justify-center items-center md:mx-10 mx-5 mb-3">
//                                 <img
//                                   src="../assets/images/Logo.svg "
//                                   alt=""
//                                   className="w-10 h-10 px-1"
//                                 />
//                               </div>
//                               <h3 className="md:text-xl  text-base font-bold h-10 text-[#fe4960]">
//                                 Việt Nam
//                               </h3>
//                             </div>
//                             <div className="col-span-4 px-4 text-[#fe4960]">
//                               <h5 className="font-bold md:text-3xl text-xl">
//                                 $80.00
//                               </h5>
//                               <p className="md:text-xl  text-base">
//                                 Min. spend <span>$120.00</span>
//                               </p>
//                               <p className="md:text-xl  text-base">
//                                 Valid till <span> 10 Jul, 11:59PM </span>
//                               </p>
//                               <div className="flex justify-between items-center">
//                                 <a
//                                   href="#"
//                                   className="bg-pink-200 rounded-lg px-2 mr-1 text-xs"
//                                 >
//                                   T&amp;C
//                                 </a>
//                                 <button className="bg-gradient-to-r from-orange-600 to-pink-500 px-7 py-1 rounded-lg font-bold md:text-2xl text-white">
//                                   Collect
//                                 </button>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       </SwiperSlide>
//                       <SwiperSlide>
//                         {" "}
//                         <div className="col-span-12 md:col-span-4 py-2 px-4 relative md:w-[390px] w-[300px] border rounded-2xl bg-slate-100  ">
//                           <div className="w-[390px] md:h-[200px] h-[160px]">
//                             <img
//                               src="../assets/images/vocher/voucher.png"
//                               // alt=""
//                             />
//                           </div>
//                           <div className="absolute top-7     left-5 grid grid-cols-6 ">
//                             <div className="md:w-[125px] col-span-2 text-center">
//                               <div className="border border-pink-400 w-12 h-12 flex justify-center items-center md:mx-10 mx-5 mb-3">
//                                 <img
//                                   src="../assets/images/Logo.svg "
//                                   // alt=""
//                                   className="w-10 h-10 px-1"
//                                 />
//                               </div>
//                               <h3 className="md:text-xl  text-base font-bold h-10 text-[#fe4960]">
//                                 Nệm Thuần Việt
//                               </h3>
//                             </div>
//                             <div className="col-span-4 px-4 text-[#fe4960]">
//                               <h5 className="font-bold md:text-3xl text-xl">
//                                 $80.00
//                               </h5>
//                               <p className="md:text-xl  text-base">
//                                 Min. spend <span>$120.00</span>
//                               </p>
//                               <p className="md:text-xl  text-base">
//                                 Valid till <span> 10 Jul, 11:59PM </span>
//                               </p>
//                               <div className="flex justify-between items-center">
//                                 <a
//                                   href="#"
//                                   className="bg-pink-200 rounded-lg px-2 mr-1 text-xs"
//                                 >
//                                   T&amp;C
//                                 </a>
//                                 <button className="bg-gradient-to-r from-orange-600 to-pink-500 px-7 py-1 rounded-lg font-bold md:text-2xl text-white">
//                                   Collect
//                                 </button>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       </SwiperSlide>{" "}
//                       <SwiperSlide>
//                         {" "}
//                         <div className="col-span-12 md:col-span-4 py-2 px-4 relative md:w-[390px] w-[300px] border rounded-2xl bg-slate-100  ">
//                           <div className="w-[390px] md:h-[200px] h-[160px]">
//                             <img
//                               src="../assets/images/vocher/voucher.png"
//                               // alt=""
//                             />
//                           </div>
//                           <div className="absolute top-7     left-5 grid grid-cols-6 ">
//                             <div className="md:w-[125px] col-span-2 text-center">
//                               <div className="border border-pink-400 w-12 h-12 flex justify-center items-center md:mx-10 mx-5 mb-3">
//                                 <img
//                                   src="../assets/images/Logo.svg "
//                                   // alt=""
//                                   className="w-10 h-10 px-1"
//                                 />
//                               </div>
//                               <h3 className="md:text-xl  text-base font-bold h-10 text-[#fe4960]">
//                                 Nệm Thuần Việt
//                               </h3>
//                             </div>
//                             <div className="col-span-4 px-4 text-[#fe4960]">
//                               <h5 className="font-bold md:text-3xl text-xl">
//                                 $80.00
//                               </h5>
//                               <p className="md:text-xl  text-base">
//                                 Min. spend <span>$120.00</span>
//                               </p>
//                               <p className="md:text-xl  text-base">
//                                 Valid till <span> 10 Jul, 11:59PM </span>
//                               </p>
//                               <div className="flex justify-between items-center">
//                                 <a
//                                   href="#"
//                                   className="bg-pink-200 rounded-lg px-2 mr-1 text-xs"
//                                 >
//                                   T&amp;C
//                                 </a>
//                                 <button className="bg-gradient-to-r from-orange-600 to-pink-500 px-7 py-1 rounded-lg font-bold md:text-2xl text-white">
//                                   Collect
//                                 </button>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       </SwiperSlide>{" "}
//                       <SwiperSlide>
//                         {" "}
//                         <div className="col-span-12 md:col-span-4 py-2 px-4 relative md:w-[390px] w-[300px] border rounded-2xl bg-slate-100  ">
//                           <div className="w-[390px] md:h-[200px] h-[160px]">
//                             <img
//                               src="../assets/images/vocher/voucher.png"
//                               alt=""
//                             />
//                           </div>
//                           <div className="absolute top-7     left-5 grid grid-cols-6 ">
//                             <div className="md:w-[125px] col-span-2 text-center">
//                               <div className="border border-pink-400 w-12 h-12 flex justify-center items-center md:mx-10 mx-5 mb-3">
//                                 <img
//                                   src="../assets/images/Logo.svg "
//                                   // alt=""
//                                   className="w-10 h-10 px-1"
//                                 />
//                               </div>
//                               <h3 className="md:text-xl  text-base font-bold h-10 text-[#fe4960]">
//                                 Nệm Thuần Việt
//                               </h3>
//                             </div>
//                             <div className="col-span-4 px-4 text-[#fe4960]">
//                               <h5 className="font-bold md:text-3xl text-xl">
//                                 $80.00
//                               </h5>
//                               <p className="md:text-xl  text-base">
//                                 Min. spend <span>$120.00</span>
//                               </p>
//                               <p className="md:text-xl  text-base">
//                                 Valid till <span> 10 Jul, 11:59PM </span>
//                               </p>
//                               <div className="flex justify-between items-center">
//                                 <a
//                                   href="#"
//                                   className="bg-pink-200 rounded-lg px-2 mr-1 text-xs"
//                                 >
//                                   T&amp;C
//                                 </a>
//                                 <button className="bg-gradient-to-r from-orange-600 to-pink-500 px-7 py-1 rounded-lg font-bold md:text-2xl text-white">
//                                   Collect
//                                 </button>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       </SwiperSlide>{" "}
//                       <SwiperSlide>
//                         {" "}
//                         <div className="col-span-12 md:col-span-4 py-2 px-4 relative md:w-[390px] w-[300px] border rounded-2xl bg-slate-100  ">
//                           <div className="w-[390px] md:h-[200px] h-[160px]">
//                             <img
//                               src="../assets/images/vocher/voucher.png"
//                               // alt=""
//                             />
//                           </div>
//                           <div className="absolute top-7     left-5 grid grid-cols-6 ">
//                             <div className="md:w-[125px] col-span-2 text-center">
//                               <div className="border border-pink-400 w-12 h-12 flex justify-center items-center md:mx-10 mx-5 mb-3">
//                                 <img
//                                   src="../assets/images/Logo.svg "
//                                   // alt=""
//                                   className="w-10 h-10 px-1"
//                                 />
//                               </div>
//                               <h3 className="md:text-xl  text-base font-bold h-10 text-[#fe4960]">
//                                 Nệm Thuần Việt
//                               </h3>
//                             </div>
//                             <div className="col-span-4 px-4 text-[#fe4960]">
//                               <h5 className="font-bold md:text-3xl text-xl">
//                                 $80.00
//                               </h5>
//                               <p className="md:text-xl  text-base">
//                                 Min. spend <span>$120.00</span>
//                               </p>
//                               <p className="md:text-xl  text-base">
//                                 Valid till <span> 10 Jul, 11:59PM </span>
//                               </p>
//                               <div className="flex justify-between items-center">
//                                 <a
//                                   href="#"
//                                   className="bg-pink-200 rounded-lg px-2 mr-1 text-xs"
//                                 >
//                                   T&amp;C
//                                 </a>
//                                 <button className="bg-gradient-to-r from-orange-600 to-pink-500 px-7 py-1 rounded-lg font-bold md:text-2xl text-white">
//                                   Collect
//                                 </button>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       </SwiperSlide>
//                     </Swiper>
//                   </div>
//                 </TabsContent>
//               </Tabs>
//             </div>
//           </section>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default Voucher;
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { A11y, Navigation, Pagination, Scrollbar } from "swiper/modules";
import Banner from "./_component/banner";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

const Voucher = () => {
  const [activeTab, setActiveTab] = useState("account");

  const hotDeals = Array(6).fill({
    images: ["voucher1.jpg", "voucher2.jpg"],
    title: "Hot Deals",
    discount: "90%"
  });

  const voucherSlides = Array(5).fill({
    logo: "../assets/images/Logo.svg",
    brand: "Nệm Thuần Việt",
    amount: "$80.00",
    minSpend: "$120.00",
    validTill: "10 Jul, 11:59PM"
  });

  return (
    <div className="bg-gray-50 min-h-screen">
      <main>
        <section className="container py-6">
          <div className="flex items-center gap-2 text-gray-600 px-4">
            <span className="hover:text-pink-500 cursor-pointer">Home</span>
            <i className="fa-light fa-chevron-right text-sm" />
            <span className="text-pink-500">Khuyến mãi</span>
          </div>
        </section>

        <Banner />

        <section className="container py-10">
          <div className="space-y-8 px-4">
            <h2 className="text-3xl font-bold text-red-500">
              Khuyến mãi hôm nay
            </h2>
            
            <h3 className="text-2xl font-bold text-gray-800">
              7.7 Sản phẩm chiến dịch
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {hotDeals.map((deal, index) => (
                <div key={index} className="bg-gradient-to-br from-pink-100 via-pink-300 to-pink-500 rounded-2xl shadow-xl transform hover:scale-[1.02] transition-all duration-300">
                  <div className="p-6">
                    <div className="flex gap-4 justify-center">
                      {deal.images.map((img, i) => (
                        <img 
                          key={i}
                          src={`../assets/images/vocher/${img}`}
                          alt={`Voucher ${i + 1}`}
                          className="w-32 h-24 object-cover rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
                        />
                      ))}
                    </div>
                  </div>

                  <div className="bg-white rounded-t-[50px] p-8 text-center">
                    <h3 className="text-3xl font-semibold mb-2">{deal.title}</h3>
                    <p className="text-red-500 font-medium">Sale Up To {deal.discount}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="container py-10">
          <div className="px-4">
            <h2 className="text-3xl font-bold text-gray-800 mb-10">
              COLLECT MORE VOUCHER
            </h2>

            <Tabs defaultValue="account" className="space-y-8">
              <TabsList className="flex gap-4 mb-10">
                {["account", "password"].map((tab, index) => (
                  <TabsTrigger
                    key={tab}
                    value={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`
                      px-8 py-4 rounded-xl transition-all duration-300
                      ${activeTab === tab 
                        ? "bg-white text-pink-500 border-2 border-pink-500 shadow-lg" 
                        : "bg-gray-100 hover:bg-white hover:text-pink-500"}
                    `}
                  >
                    <div className="text-center">
                      <p className="font-bold text-xl">From {index === 0 ? "77K" : "87K"}</p>
                      <p className="font-medium">Voucher</p>
                    </div>
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value="account">
                <Swiper
                  modules={[Navigation, Pagination, Scrollbar, A11y]}
                  spaceBetween={30}
                  navigation
                  pagination={{ clickable: true }}
                  breakpoints={{
                    640: { slidesPerView: 1.2 },
                    768: { slidesPerView: 2 },
                    1024: { slidesPerView: 2.5 },
                    1280: { slidesPerView: 3 }
                  }}
                  className="pb-12"
                >
                  {voucherSlides.map((slide, index) => (
                    <SwiperSlide key={index}>
                      <div className="bg-gray-50 rounded-xl border p-6 relative">
                        <div className="grid grid-cols-6 gap-4">
                          <div className="col-span-2 text-center">
                            <div className="border-2 border-pink-400 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4">
                              <img
                                src={slide.logo}
                                alt="Logo"
                                className="w-12 h-12 p-2"
                              />
                            </div>
                            <h3 className="text-xl font-bold text-pink-500">
                              {slide.brand}
                            </h3>
                          </div>

                          <div className="col-span-4 space-y-4 text-pink-500">
                            <h5 className="text-3xl font-bold">{slide.amount}</h5>
                            <p className="text-lg">
                              Min. spend <span className="font-medium">{slide.minSpend}</span>
                            </p>
                            <p className="text-lg">
                              Valid till <span className="font-medium">{slide.validTill}</span>
                            </p>
                            <div className="flex items-center justify-between">
                              <button className="bg-pink-100 px-4 py-1 rounded-lg text-sm">
                                T&C
                              </button>
                              <button className="bg-gradient-to-r from-orange-500 to-pink-500 px-8 py-2 rounded-lg text-white font-bold text-xl hover:shadow-lg transition-shadow">
                                Collect
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </TabsContent>

              <TabsContent value="password">
                {/* Similar Swiper content for password tab */}
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Voucher;
