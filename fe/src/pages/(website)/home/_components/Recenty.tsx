import Products from "@/components/products";

const Recenty = () => {
  return (
    <div>
      {" "}
      <div className="lg:w-[1200px] mx-auto sm:w-[95vw] mb:w-[342px] flex flex-col lg:mt-[20.5px] lg:pt-24 mb:pt-[39px]">
        <strong className="lg:text-[64px] mb:text-[32px] lg:leading-[70px] mb:leading-[40px] lg:tracking-[-4.5px] mb:tracking-[-1.8px]">
          RECENTLY ADDED
        </strong>
        {/* menu */}
        <div className="relative flex mb:flex-col md:flex-row md:items-center mb:gap-y-6 md:gap-y-0 lg:gap-x-[40px] lg:mt-16 mb:my-6">
          <span className="lg:text-2xl mb:text-base lg:tracking-[-0.5px]">
            Filter by Interest
          </span>
          <ul className="*:md:h-[48px] overflow-x-scroll hidden_scroll_x *:border flex whitespace-nowrap *:grid *:place-items-center lg:text-base mb:text-sm *:px-5 *:py-2 *:rounded-[100px] lg:gap-x-[24px] mb:gap-x-4 *:cursor-pointer *:duration-200">
            <li className="hover:text-[#05422C] hover:bg-[#F2F6F4] bg-[#F2F6F4] text-[#05422C] hover:border-black border-black">
              Flowers
            </li>
            <li className="hover:text-[#05422C] hover:bg-[#F2F6F4] hover:border-black">
              Mushrooms
            </li>
            <li className="hover:text-[#05422C] hover:bg-[#F2F6F4] hover:border-black">
              Concentrate
            </li>
            <li className="hover:text-[#05422C] hover:bg-[#F2F6F4] hover:border-black">
              Edibles
            </li>
            <li className="hover:text-[#05422C] hover:bg-[#F2F6F4] hover:border-black">
              Shop All Weed
            </li>
          </ul>
          <a className="lg:text-base absolute right-0 text-[#17AF26] mb:text-sm underline">
            Show All
          </a>
        </div>
        <Products />
      </div>
    </div>
  );
};

export default Recenty;
