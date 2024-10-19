// import { ellipse } from '@/assets/img'
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import { ellipse } from "@/assets/img";
import "swiper/css";
import { Rate } from "antd";

const Customer = ({ danhgia }: any) => {
  // console.log(danhgia);
  const maskEmail = (email: string, visibleChars: number = 2): string => {
    const [name, domain] = email.split("@");
    const maskedName =
      name.slice(0, visibleChars) + "*".repeat(name.length - visibleChars);
    return `${maskedName}@${domain}`;
  };

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
          <div className=" ">
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
              // onSlideChange={() => console.log("slide change")}
              // onSwiper={(swiper) => console.log(swiper)}
            >
              {danhgia?.map((item: any, index: any) => (
                <SwiperSlide key={index} className="rounded-xl p-5  ">
                  {" "}
                  <div className="col-span-4 bg-white lg:px-2  py-2 shadow-slate-300/50 lg:w-[302px] w-[350px] h-[265px] mx-4 mb-8 ">
                    <div>
                      {" "}
                      <div className="flex mb-1">
                        <Rate
                          disabled
                          defaultValue={item?.so_sao_san_pham}
                          className="text-2xl"
                        />
                      </div>
                      <p className="text-gray-600 font-medium mb-5 w-[330px] text-start">
                        {item?.mo_ta}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <img
                          src={item?.user?.anh_nguoi_dung ?? ellipse}
                          alt={item?.user?.anh_nguoi_dung}
                          className="w-14 h-14 rounded-full"
                        />
                      </div>
                      <div className="ml-4 text-start mt-2">
                        <h3 className="text-xl font-bold">
                          {item?.user?.ho + " " + item?.user.ten}
                        </h3>
                        <p className="text-gray-600">
                          {maskEmail(item?.user?.email)}
                        </p>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </section>
    </>
  );
};

export default Customer;
