import React, { useState } from "react";
// Import Swiper React components
import { Swiper as SwiperReact, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// import required modules
import {
  Autoplay,
  Pagination,
  Navigation,
  FreeMode,
  Thumbs,
} from "swiper/modules";

// Định nghĩa kiểu cho Swiper
import type { Swiper as SwiperType } from "swiper";
import { product, products2 } from "@/assets/img";

export default function Test() {
  // Sử dụng kiểu SwiperType hoặc null
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);

  return (
    <>
      <section>
        <div className=" container pb-11">
          <div className="md:px-14 px-5 pt-3 grid grid-cols-12  gap-3  w-[100%]  justify-center">
            <div className="lg:col-span-6 col-span-12  mb-6 ">
              <div className=" bg-[#FAFAFB] xl:w-[555px] xl:h-[535px] lg:w-[455px] lg:h-[455px]  md:h-[555px]  md:w-[655px]  w-[405px] h-[325px] inline-flex justify-center items-center mb-5 rounded-2xl shadow shadow-zinc-300/60 ">
                <SwiperReact
                  style={{
                    "--swiper-navigation-color": "#000000",
                    "--swiper-pagination-color": "#000000",
                  }}
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
                  className="mySwiper2 w-[555px]"
                  loop={true}
                  spaceBetween={10}
                >
                  <SwiperSlide>
                    <img
                      src="https://product.hstatic.net/200000423303/product/bong_cai_xanh_baby_huu_co_e7962ebc7b5c45b686bbbdb1d411c673_large.jpeg"
                      alt=""
                    />
                  </SwiperSlide>
                  <SwiperSlide>
                    <img
                      src="https://product.hstatic.net/200000423303/product/dia-chi-mua-bong-atiso_3af178ba4a734d178a33a2e7ef454a4b_large.png"
                      alt=""
                    />
                  </SwiperSlide>
                  <SwiperSlide>
                    <img
                      src="https://product.hstatic.net/200000423303/product/dot_rau_lang_organic_db894f83890b41e18e21186e994179d6_large.jpeg"
                      alt=""
                    />
                  </SwiperSlide>
                  <SwiperSlide>
                    <img
                      src="https://product.hstatic.net/200000423303/product/ca-chua-bee-cherry-huu-co_2afe5b08b1f242809cac54171701fff4_large.jpg"
                      alt=""
                    />
                  </SwiperSlide>
                </SwiperReact>
                {/* <img
                  src={product}
                  alt=""
                  className="xl:h-[590px] lg:w-[530px] lg:h-[500px] md:w-[540px] md:h-[600px] w-[320px] h-[400px]"
                /> */}
              </div>
              <div className=" w-[500px]">
                <SwiperReact
                  onSwiper={(swiperInstance: SwiperType) =>
                    setThumbsSwiper(swiperInstance)
                  }
                  loop={true}
                  spaceBetween={31}
                  slidesPerView={4}
                  freeMode={true}
                  watchSlidesProgress={true}
                  modules={[FreeMode, Navigation, Thumbs]}
                  className="mySwiper1"
                >
                  <SwiperSlide className="swiper-slide-first">
                    <div className="md:w-[100px] md:h-[100px] w-[62px] h-[60px]  rounded-2xl px-1 border border-[#F4F4F4] hover:border-slate-400 flex justify-center items-center">
                      <img
                        src={products2}
                        alt=""
                        className="md:w-[92px] md:h-[100px] [42px] h-[50px]"
                      />
                    </div>
                  </SwiperSlide>
                  <SwiperSlide>
                    <div className="md:w-[100px] md:h-[100px] w-[62px] h-[60px] bg-[#F4F4F4] rounded-2xl px-1 border border-[#F4F4F4] hover:border-slate-400 flex justify-center items-center">
                      <img
                        src={products2}
                        alt=""
                        className="md:w-[92px] md:h-[100px] [42px] h-[50px]"
                      />
                    </div>
                  </SwiperSlide>
                  <SwiperSlide>
                    <div className="md:w-[100px] md:h-[100px] w-[62px] h-[60px] bg-[#F4F4F4] rounded-2xl px-1 border border-[#F4F4F4] hover:border-slate-400 flex justify-center items-center">
                      <img
                        src={products2}
                        alt=""
                        className="md:w-[92px] md:h-[100px] [42px] h-[50px]"
                      />
                    </div>
                  </SwiperSlide>
                  <SwiperSlide>
                    <div className="md:w-[100px] md:h-[100px] w-[62px] h-[60px] bg-[#F4F4F4] rounded-2xl px-1 border border-[#F4F4F4] hover:border-slate-400 flex justify-center items-center">
                      <img
                        src={products2}
                        alt=""
                        className="md:w-[92px] md:h-[100px] [42px] h-[50px]"
                      />
                    </div>
                  </SwiperSlide>
                </SwiperReact>
              </div>
            </div>
            <div className="lg:col-span-6 col-span-12 px-4 w-[100%] ">
              <div className="product_detail_name">
                <div className="flex justify-between mb-2">
                  <h3 className=" font-bold text-3xl ">YK Disney</h3>
                  <div>
                    <a className="bg-[#3CD139]/10 text-sm px-2 py-1 text-[#3CD139] rounded-sm">
                      In Stock
                    </a>
                  </div>
                </div>
                <h4 className="mb-3 text-2xl font-normal">
                  Áo đẹp thoáng mát co giãn{" "}
                </h4>
                <div className="stars_reviews d-flex mb-3">
                  <span>
                    <i className="fa-solid fa-star  text-yellow-400 text-xl" />
                    <i className="fa-solid fa-star text-yellow-400 text-xl" />
                    <i className="fa-solid fa-star text-yellow-400 text-xl" />
                    <i className="fa-solid fa-star text-yellow-400 text-xl" />
                    <i className="fa-solid fa-star text-yellow-400 text-xl" />
                  </span>
                  <span className="px-2 text-[#A4A1AA]">
                    5.0 <span className="px-[2px]">(122 Reviews)</span>
                  </span>
                </div>
              </div>
              <div className=" mb-5 text-xl font-medium">
                $80.00 <del className="text-[#A4A1AA]">$100.00</del>
              </div>
              <p className="description mb-4 font-medium">
                To use these apps, you will need to open the app and then take a
                picture of the image. The app will then process the image and
                return the extracted text.
              </p>
              <div className="mb-4">
                <h3 className="  text-gray-900 mb-2 font-bold text-lg">
                  Color{" "}
                </h3>
                <div className="flex space-x-2">
                  <button className="w-9 h-9 bg-red-500 rounded-md border-2 border-transparent hover:border-blackL" />
                  <button className="w-9 h-9 bg-blue-500 rounded-md border-2 border-transparent hover:border-blackL" />
                  <button className="w-9 h-9 bg-purple-500 rounded-md border-2 border-transparent hover:border-blackL" />
                  <button className="w-9 h-9 bg-black rounded-md border-2 border-transparent hover:border-blackL" />
                  <button className="w-9 h-9 bg-yellow-500 rounded-md border-2 border-transparent hover:border-blackL" />
                  <button className="w-9 h-9 bg-green-500 rounded-md border-2 border-transparent hover:border-blackL" />
                </div>
              </div>
              <div className=" items-center mt-4 mb-3">
                <h3 className=" mr-4 font-bold text-lg">Size </h3>
                <div className="flex mt-3">
                  <button className="w-10 h-10  rounded-md border border-blackL text-blackL hover:bg-blackL hover:text-white mr-2">
                    S
                  </button>
                  <button className="w-10 h-10  rounded-md border border-blackL text-blackL hover:bg-blackL hover:text-white ml-2 mr-2">
                    M
                  </button>
                  <button className="w-10 h-10  rounded-md border border-blackL text-blackL hover:bg-blackL hover:text-white ml-2 mr-2">
                    L
                  </button>
                  <button className="w-10 h-10  rounded-md border border-blackL text-blackL hover:bg-blackL hover:text-white ml-2 mr-2">
                    XL
                  </button>
                  <button className="w-10 h-10  rounded-md border border-blackL text-blackL hover:bg-blackL hover:text-white ml-2 mr-2">
                    XXL
                  </button>
                </div>
              </div>
              <div className="mt-12 flex gap-5">
                <div className="border rounded-lg border-black xl:w-32 xl:h-14  ld:w-24 lg:h-10  md:w-32 md:h-14  w-24 h-10 flex justify-center items-center shadow-lg shadow-slate-400/50">
                  <button className="py-2 pr-2">
                    <i className="fa-solid fa-minus" />
                  </button>
                  <input
                    type="number"
                    id="numberInput"
                    defaultValue={1}
                    min={1}
                    maxLength={2}
                    className="xl:w-10 xl:h-10 lg:w-5 lg:h-5 md:w-10 md:h-10  w-5 h-5 border-0 focus:ring-0 focus:outline-none text-center"
                  />
                  <button className="py-2 pl-2">
                    <i className="fa-solid fa-plus" />
                  </button>
                </div>
                <button className="btn-black xl:w-[340px] w-[250px] lg:w-[250px] md:w-[340px] xl:h-14 lg:h-10  md:h-14 h-10 rounded-lg">
                  Add to Cart
                </button>
                <button className="border border-black xl:w-16 lg:w-11 md:w-16 w-11  xl:h-14  lg:h-10 md:h-14  h-10 rounded-lg flex items-center justify-center  shadow-lg shadow-slate-400/50">
                  <i
                    className="fa-regular fa-heart text-2xl"
                    style={{ color: "#ff1100" }}
                  />{" "}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
