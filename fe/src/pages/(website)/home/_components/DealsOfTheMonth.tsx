import { Link } from "react-router-dom";
// import React from 'react'

const DealsOfTheMonth = ({ chuong_trinh_uu_dai }: any) => {
  // console.log(chuong_trinh_uu_dai);
  return (
    <>
      <section className="bg-white">
        <div className="max-w-7xl mx-auto f  mb-32">
          <div className="grid justify-center items-center">
            <h1 className="text-4xl font-semibold  mb-5">
              Chương Trình Ưu Đãi
            </h1>
          </div>
          <div className="lg:grid grid-cols-2 mb-5 gap-5">
            {chuong_trinh_uu_dai?.slice(0, 4).map((item: any, index: any) => {
              const isLastItemOdd =
                index === chuong_trinh_uu_dai.length - 1 &&
                chuong_trinh_uu_dai.length % 2 !== 0;

              return (
                <div
                  key={index}
                  className={`${isLastItemOdd ? "col-span-2" : "col-span-1"}`}
                >
                  <Link to={`/deal/${item?.id}`}>
                    <img
                      src={item?.duong_dan_anh}
                      alt="Deal Image"
                      className="w-full lg:h-[500px] object-contain mb-1 px-5 lg:px-auto"
                    />
                  </Link>
                </div>
              );
            })}

            {/* <div className="col-span-1 ">
              <img
                src={banner2}
                alt="Deal Image"
                className="w-full  object-cover mb-5"
              />
            </div>
            <div className="col-span-1">
              <img
                src={banner2}
                alt="Deal Image"
                className="w-full  object-cover mb-5"
              />
            </div> */}
          </div>
        </div>
      </section>
    </>
  );
};

export default DealsOfTheMonth;
