import React from "react";

const Weed = () => {
  return (
    <div>
      <div className="w-full bg-[#F4F4F4] lg:pb-[300px] lg:pt-16 mb:pt-[50px] mb:pb-[236.5px] flex justify-center lg:mt-[100px]">
        <div className="lg:w-[1200px] mb:w-[342px] pt-20">
          <div className="lg:mb-8 mb:mb-6 flex justify-between items-center">
            <strong className="lg:text-[32px] mb:text-2xl lg:tracking-[-1.7px] tracking-[-1.05px]">
              WEED EDUCATION
            </strong>
            <a className="text-base text-[#17AF26]  underline lg:tracking-[-0.5px] tracking-[-0.8px]">
              Show All
            </a>
          </div>
          <div className="w-full lg:pt-[66px] lg:-mt-0.5 mb:mt-14 lg:gap-y-0 gap-y-[23px] border-t grid lg:grid-cols-[379px_379px_379px] lg:justify-between *:rounded-xl">
            {/* item */}
            <div className="flex flex-col">
              <img
                className="w-full h-[240px] border-none bg-[#F2F6F4]"
                src="../Images/web_edu_1.png"
                alt=""
              />
              <div>
                <span className="block text-sm text-[#717378] font-light mt-6">
                  January 24, 2023
                </span>
                <h4 className="text-[24px] text-[#1A1E26] -tracking-[0.5px] font-medium mt-2.5 mb-2">
                  12 Mistakes To Avoid When Buying Cannabis Online
                </h4>
                <p className="text-[16px] leading-[24px] text-[#717378] mb-8">
                  Buying cannabis online can be a great way to get your hands on
                  the products you need without leaving the comfort of your
                  home. But …
                </p>
                <a href="" className="text-[#17AF26] underline">
                  Read More
                </a>
              </div>
            </div>
            {/* item */}
            <div className="flex flex-col">
              <img
                className="w-full border-none h-[240px] bg-[#F2F6F4]"
                src="../Images/web_edu_2.png"
                alt=""
              />
              <div>
                <span className="block text-sm text-[#717378] font-light mt-6">
                  January 24, 2023
                </span>
                <h4 className="text-[24px] text-[#1A1E26] -tracking-[0.5px] font-medium mt-2.5 mb-2">
                  How To Store Cannabis and <br className="hidden lg:block" />{" "}
                  Keep it Fresh and Potent?
                </h4>
                <p className="text-[16px] leading-[24px] text-[#717378] mb-8">
                  Cannabis packaging has advanced dramatically in recent years,
                  whether your state has a medicinal marijuana programme, legal
                  adult-use weed, or both. Most ...
                </p>
                <a href="" className="text-[#17AF26] underline">
                  Read More
                </a>
              </div>
            </div>
            {/* item */}
            <div className="flex flex-col">
              <img
                className="w-full border-none h-[240px] bg-[#F2F6F4]"
                src="../Images/web_edu_3.png"
                alt=""
              />
              <div>
                <span className="block text-sm text-[#717378] font-light mt-6">
                  January 19, 2023
                </span>
                <h4 className="text-[24px] text-[#1A1E26] -tracking-[0.5px] font-medium mt-2.5 mb-2">
                  The Ultimate Guide to Checking the Quality of Cannabis - 10
                  Industry Leading Tips
                </h4>
                <p className="text-[16px] leading-[24px] text-[#717378] mb-8">
                  Quality cannabis is a term used to describe cannabis products
                  that meet specific standards of excellence. It is essential to
                  understand what quality cannabis means, …
                </p>
                <a href="" className="text-[#17AF26] underline">
                  Read More
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Weed;
