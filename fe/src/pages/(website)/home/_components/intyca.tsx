import React from "react";

const Intyca = () => {
  return (
    <div>
      {" "}
      <div className="pt-[63px] mx-auto lg:w-[1200px] mb:w-[342px] grid lg:grid-cols-[379px_379px_379px] lg:gap-y-0 mb:gap-y-6 lg:justify-between">
        {/* item */}
        <div>
          <div className="flex flex-col lg:gap-y-[34px] mb:gap-y-[26px] border rounded-xl lg:p-8 mb:p-6">
            <div className="w-full lg:h-[240px] mb:h-[164px] border-none bg-[#F2F6F4] grid place-items-center">
              <img src="../Images/indica.png" alt="" />
            </div>
            <div className="flex flex-col gap-y-[18px]">
              <strong className="lg:text-[32px] mb:text-2xl lg:tracking-[-2px] mb:tracking-[-1.3px]">
                Indica
              </strong>
              <p className="text-[14px] text-[#717378] leading-[21px] lg:tracking-0 tracking-[-0.06px]">
                This type of cannabis is commonly taken by those who want to
                sink into a state of total relaxation in every limb. This
                reduces stress overall and can take your worries and fatigue
                away. Because of its relaxing effects, it is suggested to use
                this type of cannabis at night. It is particularly recommended
                for people who have trouble sleeping, be it due to insomnia,
                pain or other associated sleep issues.
              </p>
            </div>
            <a className="lg:text-base text-[#17AF26] mb:text-sm underline tracking-[-0.5px] tracking-[0.1px]">
              Shop Indica
            </a>
          </div>
        </div>
        {/* item */}
        <div>
          <div className="flex flex-col lg:gap-y-[33px] mb:gap-y-6 border rounded-xl lg:p-8 mb:p-6">
            <div className="w-full lg:h-[240px] h-[164px] border-none bg-[#F2F6F4] grid place-items-center">
              <img src="../Images/sativa.png" alt="" />
            </div>
            <div className="flex flex-col gap-y-[17px] lg:mt-0.5">
              <strong className="lg:text-[32px] mb:text-2xl lg:tracking-[-2px] mb:tracking-[-1px]">
                Sativa
              </strong>
              <p className="text-[14px] text-[#717378] leading-[21px]">
                Contrary to the deep all-body relaxation that comes with the use
                of indica strains, sativas are known for increasing the feeling
                of creativity, enhancing focus and lessening anxiety. This is
                more of a mind-centered high in terms of how and where you will
                feel the effects. Given its stimulating nature, it is
                recommended to use this during the day.
              </p>
            </div>
            <a className="lg:text-base text-[#17AF26] mb:text-sm underline tracking-[-0.5px]">
              Shop Indica
            </a>
          </div>
        </div>
        {/* item */}
        <div>
          <div className="flex flex-col lg:gap-y-[33px] mb:gap-y-[26px] border rounded-xl lg:p-8 mb:p-6">
            <div className="w-full lg:h-[240px] h-[164px] border-none bg-[#F2F6F4] grid place-items-center">
              <img src="../Images/hybrids.png" alt="" />
            </div>
            <div className="flex flex-col gap-y-[17px] lg:mt-0.5">
              <strong className="lg:text-[32px] mb:text-2xl lg:tracking-[-2px] tracking-[-1px]">
                Hybrids
              </strong>
              <p className="text-[14px] tracking-[-0.01px] text-[#717378] leading-[21px]">
                Hybrid strains are just that - they combine the head-focused
                high effects of sativas with the bodily relaxation of indicas.
                This is ideal for people who really want to sooth any fatigue
                and worries while also clearing the mind ready to focus fresh on
                something new. Hybrids are expertly tailored to result in
                strains with specific effects. Useful strain vocabulary to
                familiarize yourself with when it comes to hybrids includes
                sativa-dominant (full, bodily relaxation), indica-dominant
                (boosting creativity, increasing mood and lessening anxiety) and
                balanced (the best of both worlds).
              </p>
            </div>
            <a className="lg:text-base text-[#17AF26] mb:text-sm underline tracking-[-0.5px]">
              Shop Indica
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Intyca;
