import { banner2 } from "@/assets/img";
// import React from 'react'

const DealsOfTheMonth = ({ chuong_trinh_uu_dai }: any) => {
  console.log(chuong_trinh_uu_dai);
  return (
    <>
      <section className="bg-white">
        <div className="max-w-7xl mx-auto f px-6 mb-32">
          <div className="lg:grid grid-cols-2 mb-5 gap-5">
            <div className="col-span-1 ">
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
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default DealsOfTheMonth;
