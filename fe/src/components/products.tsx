import { IProduct } from "@/common/types/product";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const Products = () => {
  const {
    data: products,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ["PRODUCT_KEY"],
    queryFn: async () => {
      const { data } = await axios.get("http://localhost:8080/api/v1/products");

      return data;
    },
  });
  if (isLoading)
    return (
      <div>
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin ease-linear rounded-full w-10 h-10 border-t-2 border-b-2 border-purple-500" />
          <div className="animate-spin ease-linear rounded-full w-10 h-10 border-t-2 border-b-2 border-red-500 ml-3" />
          <div className="animate-spin ease-linear rounded-full w-10 h-10 border-t-2 border-b-2 border-blue-500 ml-3" />
        </div>
      </div>
    );
  if (isError) return <div>Error</div>;
  return (
    <div>
      {" "}
      <div className="grid lg:py-16 lg:mt-[30px] lg:grid-cols-[276px_276px_276px_276px] mb:grid-cols-[159px_159px] border-t justify-between lg:gap-y-8 mb:gap-y-[29px] mb:pt-10">
        {/* item 1 */}
        {products?.map((product: IProduct, i: number) => (
          <div
            key={i}
            className="grid grid-cols-[100%] lg:auto-rows-[240px_auto] mb:auto-rows-[160px_auto] lg:gap-y-6 mb:gap-y-[27px] overflow-hidden h-full rounded-xl"
          >
            <div className="relative group w-full lg:h-[240px] mb:h-[160px] bg-[#F4F4F4] rounded-xl grid place-items-center">
              <img
                className="lg:w-[164px] mb:w-[120px] lg:h-[164px] mb:h-[120px]"
                src={String(
                  product.feature_image
                    ? product.feature_image
                    : "https://blog.teamtreehouse.com/wp-content/uploads/2015/05/InternetSlowdown_Day.gif"
                )}
                alt=""
              />
              <button
                className="absolute scale-0 group-hover:scale-100 group-hover:translate-y-0 -translate-y-[200%] duration-200 z-[2] lg:w-[152px] mb:w-[136px] lg:h-[64px]  
mb:h-[48px] rounded-[100px] border-none bg-[#1A1E2630] text-sm text-white backdrop-blur-md"
              >
                Out Of Stock
              </button>
              <section className=" absolute top-0 left-0 bg-[#F2BC1B] px-3 py-1.5 text-white">
                ${product.sale_price} ounce
              </section>
            </div>
            {/* about */}
            <div className="w-full flex flex-col justify-between gap-y-4 items-center">
              <div className="flex flex-col gap-y-2 items-center">
                <strong className="uppercase font-light lg:text-sm mb:text-xs text-center text-[#9D9EA2]">
                  CONCENTRATES
                </strong>
                <strong className="lg:text-lg text-center mb:text-base font-normal text-[#1A1E26]">
                  {product.name}
                </strong>
                <section className="lg:w-[163px] mb:w-[131px] h-[21px] mb:translate-y-0.5 lg:translate-y-0 *:lg:text-sm *:mb:text-xs flex justify-between items-start">
                  <div className="flex items-start">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={16}
                      height={16}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-star"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                    <strong>4.6/5</strong>
                  </div>
                  <div className="flex gap-x-2">
                    <strong>135</strong>
                    <span className="text-[#C8C9CB]">Reviews</span>
                  </div>
                </section>
                <section className="bg-[#F2F6F4] -translate-y-[2px] w-[92px] h-[28px] text-xs rounded grid place-items-center">
                  Sativa 100%
                </section>
              </div>
              <div className="flex flex-col gap-y-2 items-center lg:translate-y-0 mb:-translate-y-[2.5px]">
                <div className="flex mb:text-sm lg:text-base lg:mb-3 mb:mb-2.5">
                  <span className=" text-[#EB2606]">
                    $ {product.regular_price}
                  </span>
                  <span>/ gram</span>
                </div>
                <div className="flex *:text-xs *:mb:px-2 *:lg:py-[7px] mb:translate-y-0.5 lg:translate-y-0 *:mb:py-1 *:lg:px-[10px] gap-x-2 *:border *:rounded">
                  <button>28g</button>
                  <button>1/2lb</button>
                  <button>1/4lb</button>
                </div>
                <button className="bg-[#17AF26] lg:w-[128px] mb:w-[118px] lg:mt-[11px] mb:mt-[14.5px] h-[40px] grid place-items-center rounded-[100px] lg:text-sm mb:text-xs text-white">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
