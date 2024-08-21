import { sanPham3 } from "@/assets/img";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
const Categories = () => {
  const categories = [
    {
      name: "Kids",
      image: sanPham3,
    },
    {
      name: "Cart",
      image: sanPham3,
    },
    {
      name: "Gift",
      image: sanPham3,
    },
    {
      name: "Rings",
      image: sanPham3,
    },
    {
      name: "Bracelets",
      image: sanPham3,
    },
  ];
  return (
    <>
      <section>
        {/* <!-- Shop by categories --> */}
        <div className="md:container md:mb-28  mb-16  container-mobile">
          <div className="md:mb-14 mb-8 mx-2 md:mx-0">
            <h1 className="md:text-4xl text-3xl font-semibold tracking-[1px]">
              Danh Mục
            </h1>
          </div>

          <Swiper
            spaceBetween={100}
            slidesPerView={4}
            breakpoints={{
              0: {
                slidesPerView: 1.5,
                spaceBetween: 30,
              },

              640: {
                slidesPerView: 2,
                spaceBetween: 30,
              },
              840: {
                slidesPerView: 2.5,
                spaceBetween: 30,
              },
              1024: {
                slidesPerView: 3,
              },
              1124: {
                slidesPerView: 3.5,
              },
              1154: {
                slidesPerView: 4,
              },
            }}
            onSlideChange={() => console.log("slide change")}
            onSwiper={(swiper) => console.log(swiper)}
            className="grid grid-flow-col lg:auto-cols-[100px]  md:auto-cols-[50px]  auto-cols-[40px] gap-x-[12px] lg:gap-x-[22px] "
          >
            {categories.map((category, index) => (
              <SwiperSlide style={{ width: "300px" }} key={index}>
                <div className="">
                  <div className="w-[300px] h-[400px] bg-neutral-200/70 relative">
                    <h1 className="text-neutral-300 absolute pt-5  truncate flex items-center justify-center px-6 text-7xl font-bold text-center z-0 ">
                      {category.name.substring(0, 7)}
                    </h1>
                    <img
                      src={category.image}
                      alt=""
                      className="absolute top-0 left-0 w-full h-full object-cover z-10"
                    />
                    <button className="hover:bg-black hover:text-white bg-white text-center w-[270px] py-[13px] absolute bottom-6 left-4 rounded-lg  text-base z-20 font-semibold">
                      {category.name} <span>Wear</span>
                    </button>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>
    </>
  );
};

export default Categories;
