import {
  banner1,
  banner3,
  banner4,
  banner5,
  banner6,
  message,
} from "@/assets/img";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";

const Banner = () => {
  return (
    <div>
      {" "}
      <section className="mt-10 mb-20 ">
        <div className="flex  justify-center ">
          <div className="mx-auto w-full  ">
            <Swiper
              spaceBetween={0}
              centeredSlides={true}
              autoplay={{
                delay: 2000,
                disableOnInteraction: false,
              }}
              speed={2000}
              modules={[Autoplay, Pagination, Navigation, EffectFade]}
              className="mySwiper "
            >
              <SwiperSlide className="relative">
                <img
                  src={banner1}
                  alt=""
                  className="md:w-full h-auto object-cover"
                />

                <div className="absolute  top-[270px] left-64">
                  <div className="mb-16">
                    <p className="font-semibold text-4xl text-black mb-7">
                      Beyond Builder
                    </p>
                    <p className="text-blackL text-6xl  font-bold mb-5 tracking-[1px]">
                      {" "}
                      Beyond Builder
                    </p>
                    <p className="text-blackL text-3xl  font-medium text uppercase">
                      {" "}
                      upto 40% off
                    </p>
                  </div>
                  <div>
                    <button className="px-8 py-4 bg-blackL text-white rounded-lg shadow-2xl shadow-slate-500/50 hover:bg-white hover:text-black font-medium">
                      Shop Now<i className="fa-solid fa-arrow-right ml-3"></i>
                    </button>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <img
                  src={banner3}
                  alt=""
                  className="w-full h-auto object-cover"
                />{" "}
                <div className="absolute  top-[270px] left-64">
                  <div className="mb-16">
                    <p className="font-semibold text-4xl text-black mb-7">
                      Beyond Builder
                    </p>
                    <p className="text-blackL text-6xl  font-bold mb-5 tracking-[1px]">
                      {" "}
                      Beyond Builder
                    </p>
                    <p className="text-blackL text-3xl  font-medium text uppercase">
                      {" "}
                      upto 40% off
                    </p>
                  </div>
                  <div>
                    <button className="px-8 py-4 bg-blackL text-white rounded-lg shadow-2xl shadow-slate-500/50 hover:bg-white hover:text-black font-medium">
                      Shop Now<i className="fa-solid fa-arrow-right ml-3"></i>
                    </button>
                  </div>
                </div>
              </SwiperSlide>{" "}
              <SwiperSlide>
                <img
                  src={banner4}
                  alt=""
                  className="w-full h-auto object-cover"
                />{" "}
                <div className="absolute  top-[270px] left-64">
                  <div className="mb-16">
                    <p className="font-semibold text-4xl text-black mb-7">
                      Beyond Builder
                    </p>
                    <p className="text-blackL text-6xl  font-bold mb-5 tracking-[1px]">
                      {" "}
                      Beyond Builder
                    </p>
                    <p className="text-blackL text-3xl  font-medium text uppercase">
                      {" "}
                      upto 40% off
                    </p>
                  </div>
                  <div>
                    <button className="px-8 py-4 bg-blackL text-white rounded-lg shadow-2xl shadow-slate-500/50 hover:bg-white hover:text-black font-medium">
                      Shop Now<i className="fa-solid fa-arrow-right ml-3"></i>
                    </button>
                  </div>
                </div>
              </SwiperSlide>{" "}
              <SwiperSlide>
                <img
                  src={banner5}
                  alt=""
                  className="w-full h-auto object-cover"
                />{" "}
                <div className="absolute  top-[270px] left-64">
                  <div className="mb-16">
                    <p className="font-semibold text-4xl text-black mb-7">
                      Beyond Builder
                    </p>
                    <p className="text-blackL text-6xl  font-bold mb-5 tracking-[1px]">
                      {" "}
                      Beyond Builder
                    </p>
                    <p className="text-blackL text-3xl  font-medium text uppercase">
                      {" "}
                      upto 40% off
                    </p>
                  </div>
                  <div>
                    <button className="px-8 py-4 bg-blackL text-white rounded-lg shadow-2xl shadow-slate-500/50 hover:bg-white hover:text-black font-medium">
                      Shop Now<i className="fa-solid fa-arrow-right ml-3"></i>
                    </button>
                  </div>
                </div>
              </SwiperSlide>{" "}
              <SwiperSlide>
                <img
                  src={banner6}
                  alt=""
                  className="w-full h-auto object-cover"
                />{" "}
                <div className="absolute  top-[270px] left-64">
                  <div className="mb-16">
                    <p className="font-semibold text-4xl text-black mb-7">
                      Beyond Builder
                    </p>
                    <p className="text-blackL text-6xl  font-bold mb-5 tracking-[1px]">
                      {" "}
                      Beyond Builder
                    </p>
                    <p className="text-blackL text-3xl  font-medium text uppercase">
                      {" "}
                      upto 40% off
                    </p>
                  </div>
                  <div>
                    <button className="px-8 py-4 bg-blackL text-white rounded-lg shadow-2xl shadow-slate-500/50 hover:bg-white hover:text-black font-medium">
                      Shop Now<i className="fa-solid fa-arrow-right ml-3"></i>
                    </button>
                  </div>
                </div>
              </SwiperSlide>
            </Swiper>
          </div>
          {/* <div className="fixed bottom-10 right-10 z-20">
            <p className="text-xl font-semibold text-white">
              <a href="">
                <img
                  src={message}
                  alt=""
                  className="w-24 h-18 fa-bounce cursor-pointer"
                />
              </a>
            </p>
          </div> */}
        </div>
      </section>
    </div>
  );
};

export default Banner;
