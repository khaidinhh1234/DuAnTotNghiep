// import { ellipse } from '@/assets/img'
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import { avata, ellipse } from "@/assets/img";

const Customer = () => {
  const reviews = [
    {
      title: "Tokyo",
      content:
        "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum.",
      name: "Leslie Alexander",
      avata: { ellipse },
    },
  ];
  return (
    <>
      <section className="bg-gray-100 py-12">
        {/* <!-- What our Customer say's --> */}

        <div className="container">
          <div className="mb-14">
            <h1 className="text-4xl font-semibold pl-9">
              Đánh giá của khách hàng
            </h1>
          </div>

          {/* <!-- Reviews Grid --> */}
          <div className=" mx-4">
            {/* <!-- Review 1 --> */}
            {/* <div className="swiper feedblack"> */}
            {/* <div className="swiper-wrapper">
                <div className="swiper-slide"> */}
            <Swiper
              spaceBetween={50}
              slidesPerView={3}
              breakpoints={{
                0: {
                  slidesPerView: 1.2,
                  spaceBetween: 30,
                },
                550: {
                  slidesPerView: 1.3,
                  spaceBetween: 30,
                },
                640: {
                  slidesPerView: 1.5,
                  spaceBetween: 30,
                },
                780: {
                  slidesPerView: 2,
                  spaceBetween: 30,
                },
                1024: {
                  slidesPerView: 2.5,
                },
                1154: {
                  slidesPerView: 3,
                },
              }}
              onSlideChange={() => console.log("slide change")}
              onSwiper={(swiper) => console.log(swiper)}
            >
              <SwiperSlide>
                {" "}
                <div className="col-span-4 bg-white p-6 rounded-xl shadow-sm shadow-slate-300/50 w-[362px] h-[265px] mx-4 mb-8">
                  <div className="flex mb-1">
                    <span className="text-yellow-500 text-4xl">★★★★★</span>
                  </div>

                  <p className="text-gray-600 font-medium mb-5 w-[330px] text-start">
                    It is a long established fact that a reader will be
                    distracted by the readable content of a page when looking at
                    its layout. The point of using Lorem Ipsum.
                  </p>
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <img
                        src={ellipse}
                        alt="Leslie Alexander"
                        className="w-14 h-14 rounded-full"
                      />
                    </div>
                    <div className="ml-4 text-start">
                      <h3 className="text-xl font-bold">Leslie Alexander</h3>
                      <p className="text-gray-600">Model</p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                {" "}
                <div className="col-span-4 bg-white p-6 rounded-xl shadow-sm shadow-slate-300/50 w-[362px] h-[265px] mx-4 mb-8">
                  <div className="flex mb-1">
                    <span className="text-yellow-500 text-4xl">★★★★★</span>
                  </div>

                  <p className="text-gray-600 font-medium mb-5 w-[330px] text-start">
                    It is a long established fact that a reader will be
                    distracted by the readable content of a page when looking at
                    its layout. The point of using Lorem Ipsum.
                  </p>
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <img
                        src={ellipse}
                        alt="Leslie Alexander"
                        className="w-14 h-14 rounded-full"
                      />
                    </div>
                    <div className="ml-4 text-start">
                      <h3 className="text-xl font-bold">Leslie Alexander</h3>
                      <p className="text-gray-600">Model</p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                {" "}
                <div className="col-span-4 bg-white p-6 rounded-xl shadow-sm shadow-slate-300/50 w-[362px] h-[265px] mx-4 mb-8">
                  <div className="flex mb-1">
                    <span className="text-yellow-500 text-4xl">★★★★★</span>
                  </div>

                  <p className="text-gray-600 font-medium mb-5 w-[330px] text-start">
                    It is a long established fact that a reader will be
                    distracted by the readable content of a page when looking at
                    its layout. The point of using Lorem Ipsum.
                  </p>
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <img
                        src={ellipse}
                        alt="Leslie Alexander"
                        className="w-14 h-14 rounded-full"
                      />
                    </div>
                    <div className="ml-4 text-start">
                      <h3 className="text-xl font-bold">Leslie Alexander</h3>
                      <p className="text-gray-600">Model</p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                {" "}
                <div className="col-span-4 bg-white p-6 rounded-xl shadow-sm shadow-slate-300/50 w-[362px] h-[265px] mx-4 mb-8">
                  <div className="flex mb-1">
                    <span className="text-yellow-500 text-4xl">★★★★★</span>
                  </div>

                  <p className="text-gray-600 font-medium mb-5 w-[330px] text-start">
                    It is a long established fact that a reader will be
                    distracted by the readable content of a page when looking at
                    its layout. The point of using Lorem Ipsum.
                  </p>
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <img
                        src={ellipse}
                        alt="Leslie Alexander"
                        className="w-14 h-14 rounded-full"
                      />
                    </div>
                    <div className="ml-4 text-start">
                      <h3 className="text-xl font-bold">Leslie Alexander</h3>
                      <p className="text-gray-600">Model</p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                {" "}
                <div className="col-span-4 bg-white p-6 rounded-xl shadow-sm shadow-slate-300/50 w-[362px] h-[265px] mx-4 mb-8">
                  <div className="flex mb-1">
                    <span className="text-yellow-500 text-4xl">★★★★★</span>
                  </div>

                  <p className="text-gray-600 font-medium mb-5 w-[330px] text-start">
                    It is a long established fact that a reader will be
                    distracted by the readable content of a page when looking at
                    its layout. The point of using Lorem Ipsum.
                  </p>
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <img
                        src={ellipse}
                        alt="Leslie Alexander"
                        className="w-14 h-14 rounded-full"
                      />
                    </div>
                    <div className="ml-4 text-start">
                      <h3 className="text-xl font-bold">Leslie Alexander</h3>
                      <p className="text-gray-600">Model</p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                {" "}
                <div className="col-span-4 bg-white p-6 rounded-xl shadow-sm shadow-slate-300/50 w-[362px] h-[265px] mx-4 mb-8">
                  <div className="flex mb-1">
                    <span className="text-yellow-500 text-4xl">★★★★★</span>
                  </div>

                  <p className="text-gray-600 font-medium mb-5 w-[330px] text-start">
                    It is a long established fact that a reader will be
                    distracted by the readable content of a page when looking at
                    its layout. The point of using Lorem Ipsum.
                  </p>
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <img
                        src={ellipse}
                        alt="Leslie Alexander"
                        className="w-14 h-14 rounded-full"
                      />
                    </div>
                    <div className="ml-4 text-start">
                      <h3 className="text-xl font-bold">Leslie Alexander</h3>
                      <p className="text-gray-600">Model</p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                {" "}
                <div className="col-span-4 bg-white p-6 rounded-xl shadow-sm shadow-slate-300/50 w-[362px] h-[265px] mx-4 mb-8">
                  <div className="flex mb-1">
                    <span className="text-yellow-500 text-4xl">★★★★★</span>
                  </div>

                  <p className="text-gray-600 font-medium mb-5 w-[330px] text-start">
                    It is a long established fact that a reader will be
                    distracted by the readable content of a page when looking at
                    its layout. The point of using Lorem Ipsum.
                  </p>
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <img
                        src={ellipse}
                        alt="Leslie Alexander"
                        className="w-14 h-14 rounded-full"
                      />
                    </div>
                    <div className="ml-4 text-start">
                      <h3 className="text-xl font-bold">Leslie Alexander</h3>
                      <p className="text-gray-600">Model</p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            </Swiper>
          </div>
        </div>
      </section>
    </>
  );
};

export default Customer;
