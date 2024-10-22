import { banner1 } from "@/assets/img";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { Autoplay, EffectFade, Navigation, Pagination } from "swiper/modules";

const Banner = ({ banner }: any) => {
  // const mau = banner?.[0]?.noi_dung?.mau_tieu_de_chinh;
  // console.log(banner);
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
              {banner?.map((item: any, index: number) => (
                <SwiperSlide className="relative" key={index}>
                  <img
                    src={item?.duong_dan_anh || banner1}
                    alt={item?.duong_dan_anh || banner1}
                    className="md:w-full lg:h-[700px] object-cover bg-center bg-no-repeat"
                  />
                  <div className="absolute top-[200px] w-[1150px] text-start left-20">
                    <div className="mb-4">
                      <p
                        style={{
                          color: item?.noi_dung?.mau_tieu_de_chinh ?? "#ffffff",
                        }}
                        className="text-md lg:text-6xl font-bold lg:mb-5 tracking-[1px]"
                      >
                        {item?.noi_dung?.tieu_de_chinh ?? "Beyond Builder"}
                      </p>
                      <p
                        style={{
                          color: item?.noi_dung?.mau_tieu_de_phu ?? "#ffffff",
                        }}
                        className="font-semibold text-xl lg:text-4xl lg:mb-7"
                      >
                        {item?.noi_dung?.tieu_de_phu || "Beyond Builder"}
                      </p>
                      <p
                        style={{
                          color:
                            item?.noi_dung?.mau_van_ban_quang_cao ?? "#ffffff",
                        }}
                        className="text-xs lg:text-3xl font-medium uppercase"
                      >
                        {item?.noi_dung?.van_ban_quang_cao || "upto 40% off"}
                      </p>
                    </div>
                    {item?.noi_dung?.tieu_de_nut && (
                      <div>
                        <button
                          style={{
                            backgroundColor: item?.noi_dung?.mau_nut,
                            color: item?.noi_dung?.mau_tieu_de_nut,
                          }}
                          onMouseEnter={(e: any) => {
                            e.target.style.backgroundColor =
                              item?.noi_dung?.mau_nut;
                            e.target.style.color =
                              item?.noi_dung?.mau_tieu_de_nut;
                            e.target.style.opacity = "0.9";
                          }}
                          onMouseLeave={(e: any) => {
                            e.target.style.opacity = "1";
                            e.target.style.backgroundColor =
                              item?.noi_dung?.mau_nut;
                            e.target.style.color =
                              item?.noi_dung?.mau_tieu_de_nut;
                          }}
                          className={`lg:px-8  px-2  py-[6px] lg:py-4 text-[8px] lg:text-xl  rounded-sm lg:rounded-lg shadow-2xl shadow-slate-500/50 hover:bg-white hover:text-black font-medium`}
                        >
                          {item?.noi_dung?.tieu_de_nut}
                          <i className="fa-solid fa-arrow-right ml-3"></i>
                        </button>
                      </div>
                    )}
                  </div>
                </SwiperSlide>
              ))}
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
