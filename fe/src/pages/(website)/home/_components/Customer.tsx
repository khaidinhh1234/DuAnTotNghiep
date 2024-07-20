// import { ellipse } from '@/assets/img'
import React from "react";

const Customer = () => {
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
          <div className="flex flex-cols-12 mx-4">
            {/* <!-- Review 1 --> */}
            <div className="swiper feedblack">
              <div className="swiper-wrapper">
                <div className="swiper-slide">
                  <div className="col-span-4 bg-white p-6 rounded-xl shadow-sm shadow-slate-300/50 w-[362px] h-[265px] mx-4 mb-8">
                    <div className="flex mb-1">
                      <span className="text-yellow-500 text-4xl">★★★★★</span>
                    </div>

                    <p className="text-gray-600 font-medium mb-5 w-[310px]">
                      It is a long established fact that a reader will be
                      distracted by the readable content of a page when looking
                      at its layout. The point of using Lorem Ipsum.
                    </p>
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <img
                          src={""}
                          alt="Leslie Alexander"
                          className="w-14 h-14 rounded-full"
                        />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-xl font-bold">Leslie Alexander</h3>
                        <p className="text-gray-600">Model</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="swiper-slide">
                  <div className="col-span-4 bg-white p-6 rounded-xl shadow-sm shadow-slate-300/50 w-[362px] h-[265px] flex-1 mx-4 mb-8">
                    <div className="flex mb-1">
                      <span className="text-yellow-500 text-4xl">★★★★★</span>
                    </div>

                    <p className="text-gray-600 font-medium mb-5 w-[310px]">
                      It is a long established fact that a reader will be
                      distracted by the readable content of a page when looking
                      at its layout. The point of using Lorem Ipsum.
                    </p>
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <img
                          src="../assets/images/Homepage/Ellipse 958.png"
                          alt="Leslie Alexander"
                          className="w-14 h-14 rounded-full"
                        />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-xl font-bold">Leslie Alexander</h3>
                        <p className="text-gray-600">Model</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="swiper-slide">
                  <div className="col-span-4 bg-white p-6 rounded-xl shadow-sm shadow-slate-300/50 w-[362px] h-[265px] flex-1 mx-4 mb-8">
                    <div className="flex mb-1">
                      <span className="text-yellow-500 text-4xl">★★★★★</span>
                    </div>

                    <p className="text-gray-600 font-medium mb-5 w-[310px]">
                      It is a long established fact that a reader will be
                      distracted by the readable content of a page when looking
                      at its layout. The point of using Lorem Ipsum.
                    </p>
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <img
                          src="../assets/images/Homepage/Ellipse 958.png"
                          alt="Leslie Alexander"
                          className="w-14 h-14 rounded-full"
                        />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-xl font-bold">Leslie Alexander</h3>
                        <p className="text-gray-600">Model</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="swiper-slide">
                  <div className="col-span-4 bg-white p-6 rounded-xl shadow-sm shadow-slate-300/50 w-full flex-1 mx-4 mb-8">
                    <div className="flex mb-1">
                      <span className="text-yellow-500 text-4xl">★★★★★</span>
                    </div>

                    <p className="text-gray-600 font-medium mb-5">
                      It is a long established fact that a reader will be
                      distracted by the readable content of a page when looking
                      at its layout. The point of using Lorem Ipsum.
                    </p>
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <img
                          src="../assets/images/Homepage/Ellipse 958.png"
                          alt="Leslie Alexander"
                          className="w-14 h-14 rounded-full"
                        />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-xl font-bold">Leslie Alexander</h3>
                        <p className="text-gray-600">Model</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="swiper-button-next"></div>
              <div className="swiper-button-prev"></div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Customer;
