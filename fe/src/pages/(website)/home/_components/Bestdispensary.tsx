import React from "react";

const Bestdispensary = () => {
  return (
    <div>
      {" "}
      <div className="w-full text-center lg:py-[120px] mb:pt-16 mb:pb-[42px]">
        <div className="lg:w-[948px] mx-auto mb:w-[342px]">
          <strong className="lg:text-[64px] mb:text-[32px] lg:leading-[70px] mb:leading-[38.5px] lg:tracking-[-4.8px] mb:tracking-[-1.8px]">
            BEST DISPENSARY TO BUY WEED ONLINE IN CANADA
          </strong>
        </div>
        {/* menu service */}
        <div className="w-full flex justify-center lg:my-[62px] mb:mt-8">
          <div
            className="lg:grid hidden_scroll_x lg:grid-cols-[378.67px_378.67px_378.67px] mb:flex mb:w-[342px] lg:w-auto mb:overflow-x-auto lg:ml-0 mb:flex-nowrap *:mb:px-[20px] 
    *:whitespace-nowrap *:lg:px-0 md:gap-x-[32px] grid-flow-row \
    mb:gap-x-[16px] *:mb:h-[40px] *:sm:h-[48px] *:lg:text-base *:mb:text-sm *:rounded-[100px] *:bg-[#F2F6F4"
          >
            <button className="border border-[#05422C] bg-[#F2F6F4]">
              Best Sellers
            </button>
            <button className="border border-[#F4F4F4]">
              Bundles &amp; Promotions
            </button>
            <button className="border border-[#F4F4F4]">On Sale</button>
          </div>
        </div>
        {/* products best seler  */}
        <div className="w-full relative flex sm:flex-row mb:flex-col mb:items-center justify-center lg:my-16 mb:my-[22px] mb:overflow-x-auto hidden_scroll_x">
          <div className="lg:w-[1440px] flex justify-end *:lg:h-[568px] *:sm:h-[350px] overflow-hidden">
            <div
              className="grid sm:gap-x-[32px] mb:w-[342px] sm:w-[95vw] mb:gap-y-10 sm:gap-y-0 sm:grid-cols-[379px_auto] mb:flex-col items-center 
lg:w-[1348px] rounded-xl lg:translate-x-[28px]"
            >
              {/* banner */}
              <div
                className="sm:w-full mb:w-[342px] md:mt-0 mb:mt-[18px] lg:rounded-xl mb:rounded-2xl lg:h-full sm:h-[350px] mb:h-[395px] border bg-[#05422C] flex flex-col 
    items-center justify-center gap-y-6"
              >
                <img
                  src="../Images/img_product.png"
                  className="lg:w-[213px] lg:h-[213px] mb:w-[151px] mb:h-[151px]"
                  alt=""
                />
                <div className="h-[163px] flex flex-col justify-between">
                  <strong className="text-white text-xl font-medium">
                    Shop our Best Sellers
                  </strong>
                  <p className="w-[216px] text-[14px] leading-[21px] opacity-60 text-white font-light -translate-y-[5px]">
                    Lorem ipsum dolor sit amet consectetur. Ullamcorper ipsum
                    varius lorem blandit lectus magnis feugiat.{" "}
                  </p>
                  <a className="text-[#17AF26] text-sm underline" href="">
                    View All
                  </a>
                </div>
              </div>
              {/* product desktop */}
              <div className="mb:hidden sm:block h-full overflow-x-auto hidden_scroll_x">
                <div className="grid grid-flow-col auto-cols-[291px] *:w-full h-full gap-x-[32px] h-[568px]">
                  {/* item 1 */}
                  <div className="flex flex-col justify-between overflow-hidden h-full rounded-xl">
                    {/* img */}
                    <div className="relative group w-full h-[240px] bg-[#F4F4F4] rounded-xl grid place-items-center">
                      <img
                        className="w-[164px] h-[164px]"
                        src="../Images/product_5.png"
                        alt=""
                      />
                      <button className="absolute scale-0 group-hover:scale-100 group-hover:translate-y-0 -translate-y-[200%] duration-200 z-[2] lg:w-[152px] mb:w-[136px] lg:h-[64px]  mb:h-[48px] rounded-[100px] border-none bg-[#1A1E2630] text-sm text-white backdrop-blur-md">
                        Out Of Stock
                      </button>
                      <section className="hidden absolute top-0 left-0 bg-[#F2BC1B] px-3 py-1.5 text-white">
                        $60 ounce
                      </section>
                    </div>
                    {/* about */}
                    <div className="w-full h-[304px] flex flex-col justify-between items-center">
                      <strong className="uppercase font-light text-center text-[#9D9EA2]">
                        flower
                      </strong>
                      <strong className="text-lg line-clamp-2 font-normal text-[#1A1E26] my-1">
                        2 Oz Deal Watermelon Zkittles + Purple Gushers
                      </strong>
                      <section className="w-[163px] h-[21px] *:text-sm flex justify-between items-start">
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
                        |
                        <div className="flex gap-x-2">
                          <strong>135</strong>
                          <span className="text-[#C8C9CB]">Reviews</span>
                        </div>
                      </section>
                      <section className="bg-[#F2F6F4] w-[92px] h-[28px] lg:-translate-y-1 text-xs rounded grid place-items-center my-3">
                        Sativa 100%
                      </section>
                      <div className="flex my-2 lg:-translate-y-1.5">
                        <span className="text-[#EB2606]">$ 80.00</span>
                        <span>/ gram</span>
                      </div>
                      <div className="flex *:text-xs *:py-[7px] *:px-[10px] gap-x-2 my-3 *:border *:rounded lg:-translate-y-1.5">
                        <button>28g</button>
                        <button>1/2lb</button>
                        <button>1/4lb</button>
                      </div>
                      <button className="bg-[#17AF26] w-[128px] h-[40px] grid place-items-center rounded-[100px] text-sm text-white">
                        Add to Cart
                      </button>
                    </div>
                  </div>
                  {/* item 1 */}
                  <div className="flex flex-col justify-between overflow-hidden h-full rounded-xl">
                    {/* img */}
                    <div className="relative group w-full h-[240px] bg-[#F4F4F4] rounded-xl grid place-items-center">
                      <img
                        className="w-[164px] h-[164px]"
                        src="../Images/img_product.png"
                        alt=""
                      />
                      <button className="absolute scale-0 group-hover:scale-100 group-hover:translate-y-0 -translate-y-[200%] duration-200 z-[2] lg:w-[152px] mb:w-[136px] lg:h-[64px]  mb:h-[48px] rounded-[100px] border-none bg-[#1A1E2630] text-sm text-white backdrop-blur-md">
                        Out Of Stock
                      </button>
                      <section className="hidden absolute top-0 left-0 bg-[#F2BC1B] px-3 py-1.5 text-white">
                        $60 ounce
                      </section>
                    </div>
                    {/* about */}
                    <div className="w-full h-[304px] flex flex-col justify-between items-center">
                      <strong className="uppercase font-light text-center text-[#9D9EA2]">
                        CONCENTRATES
                      </strong>
                      <strong className="text-lg line-clamp-2 font-normal text-[#1A1E26] my-1">
                        Mix And Match Shatter/Budder 28g (4 X 7G)
                      </strong>
                      <section className="w-[163px] h-[21px] *:text-sm flex justify-between items-start">
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
                        |
                        <div className="flex gap-x-2">
                          <strong>135</strong>
                          <span className="text-[#C8C9CB]">Reviews</span>
                        </div>
                      </section>
                      <section className="bg-[#F2F6F4] w-[92px] h-[28px] lg:-translate-y-1 text-xs rounded grid place-items-center my-3">
                        Sativa 100%
                      </section>
                      <div className="flex my-2 lg:-translate-y-1.5">
                        <span className="text-[#EB2606]">$ 80.00</span>
                        <span>/ gram</span>
                      </div>
                      <div className="flex *:text-xs *:py-[7px] *:px-[10px] gap-x-2 my-3 *:border *:rounded lg:-translate-y-1.5">
                        <button>28g</button>
                        <button>1/2lb</button>
                        <button>1/4lb</button>
                      </div>
                      <button className="bg-[#17AF26] w-[128px] h-[40px] grid place-items-center rounded-[100px] text-sm text-white">
                        Add to Cart
                      </button>
                    </div>
                  </div>
                  {/* item 2 */}
                  <div className="flex flex-col justify-between overflow-hidden h-full rounded-xl">
                    {/* img */}
                    <div className="relative group w-full h-[240px] bg-[#F4F4F4] rounded-xl grid place-items-center">
                      <img
                        className="w-[164px] h-[164px]"
                        src="../Images/product_5.png"
                        alt=""
                      />
                      <button className="absolute scale-0 group-hover:scale-100 group-hover:translate-y-0 -translate-y-[200%] duration-200 z-[2] lg:w-[152px] mb:w-[136px] lg:h-[64px]  mb:h-[48px] rounded-[100px] border-none bg-[#1A1E2630] text-sm text-white backdrop-blur-md">
                        Out Of Stock
                      </button>
                      <section className="absolute top-0 left-0 bg-[#F2BC1B] px-3 py-1.5 text-white">
                        $60 ounce
                      </section>
                    </div>
                    {/* about */}
                    <div className="w-full h-[304px] flex flex-col justify-between items-center">
                      <strong className="uppercase font-light text-center text-[#9D9EA2]">
                        flower
                      </strong>
                      <strong className="text-lg line-clamp-2 font-normal text-[#1A1E26] my-1">
                        2 Oz Deal Ahi Tuna + Master <br />
                        Tuna
                      </strong>
                      <section className="w-[163px] h-[21px] *:text-sm flex justify-between items-start">
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
                        |
                        <div className="flex gap-x-2">
                          <strong>135</strong>
                          <span className="text-[#C8C9CB]">Reviews</span>
                        </div>
                      </section>
                      <section className="bg-[#F2F6F4] w-[92px] h-[28px] lg:-translate-y-1 text-xs rounded grid place-items-center my-3">
                        Sativa 100%
                      </section>
                      <div className="flex my-2 lg:-translate-y-1.5">
                        <span className="text-[#EB2606]">$ 80.00</span>
                        <span>/ gram</span>
                      </div>
                      <div className="flex *:text-xs *:py-[7px] *:px-[10px] gap-x-2 my-3 *:border *:rounded lg:-translate-y-1.5">
                        <button>28g</button>
                        <button>1/2lb</button>
                        <button>1/4lb</button>
                      </div>
                      <button className="bg-[#17AF26] w-[128px] h-[40px] grid place-items-center rounded-[100px] text-sm text-white">
                        Add to Cart
                      </button>
                    </div>
                  </div>
                  {/* item 3 */}
                  <div className="flex flex-col justify-between overflow-hidden h-full rounded-xl">
                    {/* img */}
                    <div className="relative group w-full h-[240px] bg-[#F4F4F4] rounded-xl grid place-items-center">
                      <img
                        className="w-[164px] h-[164px]"
                        src="../Images/product_5.png"
                        alt=""
                      />
                      <button className="absolute scale-0 group-hover:scale-100 group-hover:translate-y-0 -translate-y-[200%] duration-200 z-[2] lg:w-[152px] mb:w-[136px] lg:h-[64px]  mb:h-[48px] rounded-[100px] border-none bg-[#1A1E2630] text-sm text-white backdrop-blur-md">
                        Out Of Stock
                      </button>
                      <section className="absolute top-0 left-0 bg-[#F2BC1B] px-3 py-1.5 text-white">
                        $60 ounce
                      </section>
                    </div>
                    {/* about */}
                    <div className="w-full h-[304px] flex flex-col justify-between items-center">
                      <strong className="uppercase font-light text-center text-[#9D9EA2]">
                        flower
                      </strong>
                      <strong className="text-lg font-normal line-clamp-2 text-[#1A1E26] my-1">
                        2 Oz Deal Watermelon Zkittles + Purple Gushers
                      </strong>
                      <section className="w-[163px] h-[21px] *:text-sm flex justify-between items-start">
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
                        |
                        <div className="flex gap-x-2">
                          <strong>135</strong>
                          <span className="text-[#C8C9CB]">Reviews</span>
                        </div>
                      </section>
                      <section className="bg-[#F2F6F4] w-[92px] h-[28px] lg:-translate-y-1 text-xs rounded grid place-items-center my-3">
                        Sativa 100%
                      </section>
                      <div className="flex my-2 lg:-translate-y-1.5">
                        <span className="text-[#EB2606]">$ 80.00</span>
                        <span>/ gram</span>
                      </div>
                      <div className="flex *:text-xs *:py-[7px] *:px-[10px] gap-x-2 my-3 *:border *:rounded lg:-translate-y-1.5">
                        <button>28g</button>
                        <button>1/2lb</button>
                        <button>1/4lb</button>
                      </div>
                      <button className="bg-[#17AF26] w-[128px] h-[40px] grid place-items-center rounded-[100px] text-sm text-white">
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* products mobile */}
          <div className="sm:hidden w-full custome_scroll_x_center_item snap-x mt-8 h-full h-[568px] overflow-x-auto hidden_scroll_x">
            <div className="grid grid-flow-col auto-cols-[291px] *:w-full h-full gap-x-6 h-[568px]">
              {/* item 1 */}
              <div className="flex snap-center flex-col overflow-hidden gap-y-6 h-full rounded-xl">
                {/* img */}
                <div className="w-full h-[240px] bg-[#F4F4F4] rounded-xl grid place-items-center *:w-[164px] *:h-[164px]">
                  <img src="../Images/img_product.png" alt="" />
                </div>
                {/* about */}
                <div className="w-full h-[304px] flex flex-col justify-between items-center">
                  <strong className="uppercase font-light text-center text-[#9D9EA2]">
                    flower
                  </strong>
                  <strong className="text-[18px] leading-[27px] font-normal text-[#1A1E26] my-1">
                    Mix And Match Shatter/Budder 28g (4 X 7G)
                  </strong>
                  <section className="w-[163px] h-[21px] mt-1 *:text-sm flex justify-between items-start">
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
                    |
                    <div className="flex gap-x-2">
                      <strong>135</strong>
                      <span className="text-[#C8C9CB]">Reviews</span>
                    </div>
                  </section>
                  <section className="bg-[#F2F6F4] w-[92px] -translate-y-1.5 h-[28px] text-xs rounded grid place-items-center my-3">
                    Sativa 100%
                  </section>
                  <div className="flex -translate-y-1.5 my-2">
                    <span className="text-[#EB2606]">$ 80.00</span>
                    <span>/ gram</span>
                  </div>
                  <div className="flex *:text-xs *:py-[7px] -translate-y-2 *:px-[10px] gap-x-2 my-3 *:border *:rounded">
                    <button>28g</button>
                    <button>1/2lb</button>
                    <button>1/4lb</button>
                  </div>
                  <button className="bg-[#17AF26] w-[118px] h-[40px] grid place-items-center rounded-[100px] text-xs text-white">
                    Add to Cart
                  </button>
                </div>
              </div>
              {/* item 1 */}
              <div className="flex snap-center flex-col overflow-hidden gap-y-6 h-full rounded-xl">
                {/* img */}
                <div className="w-full h-[240px] bg-[#F4F4F4] rounded-xl grid place-items-center *:w-[164px] *:h-[164px]">
                  <img src="../Images/img_product.png" alt="" />
                </div>
                {/* about */}
                <div className="w-full h-[304px] flex flex-col justify-between items-center">
                  <strong className="uppercase font-light text-center text-[#9D9EA2]">
                    flower
                  </strong>
                  <strong className="text-[18px] leading-[27px] font-normal text-[#1A1E26] my-1">
                    Mix And Match Shatter/Budder 28g (4 X 7G)
                  </strong>
                  <section className="w-[163px] h-[21px] mt-1 *:text-sm flex justify-between items-start">
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
                    |
                    <div className="flex gap-x-2">
                      <strong>135</strong>
                      <span className="text-[#C8C9CB]">Reviews</span>
                    </div>
                  </section>
                  <section className="bg-[#F2F6F4] w-[92px] -translate-y-1.5 h-[28px] text-xs rounded grid place-items-center my-3">
                    Sativa 100%
                  </section>
                  <div className="flex -translate-y-1.5 my-2">
                    <span className="text-[#EB2606]">$ 80.00</span>
                    <span>/ gram</span>
                  </div>
                  <div className="flex *:text-xs *:py-[7px] -translate-y-2 *:px-[10px] gap-x-2 my-3 *:border *:rounded">
                    <button>28g</button>
                    <button>1/2lb</button>
                    <button>1/4lb</button>
                  </div>
                  <button className="bg-[#17AF26] w-[118px] h-[40px] grid place-items-center rounded-[100px] text-xs text-white">
                    Add to Cart
                  </button>
                </div>
              </div>
              {/* item 2 */}
              <div className="flex snap-center flex-col overflow-hidden gap-y-6 h-full rounded-xl">
                {/* img */}
                <div className="w-full h-[240px] bg-[#F4F4F4] rounded-xl grid place-items-center *:w-[164px] *:h-[164px]">
                  <img src="../Images/img_product.png" alt="" />
                </div>
                {/* about */}
                <div className="w-full h-[304px] flex flex-col justify-between items-center">
                  <strong className="uppercase font-light text-center text-[#9D9EA2]">
                    flower
                  </strong>
                  <strong className="text-[18px] leading-[27px] font-normal text-[#1A1E26] my-1">
                    Mix And Match Shatter/Budder 28g (4 X 7G)
                  </strong>
                  <section className="w-[163px] h-[21px] mt-1 *:text-sm flex justify-between items-start">
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
                    |
                    <div className="flex gap-x-2">
                      <strong>135</strong>
                      <span className="text-[#C8C9CB]">Reviews</span>
                    </div>
                  </section>
                  <section className="bg-[#F2F6F4] w-[92px] -translate-y-1.5 h-[28px] text-xs rounded grid place-items-center my-3">
                    Sativa 100%
                  </section>
                  <div className="flex -translate-y-1.5 my-2">
                    <span className="text-[#EB2606]">$ 80.00</span>
                    <span>/ gram</span>
                  </div>
                  <div className="flex *:text-xs *:py-[7px] -translate-y-2 *:px-[10px] gap-x-2 my-3 *:border *:rounded">
                    <button>28g</button>
                    <button>1/2lb</button>
                    <button>1/4lb</button>
                  </div>
                  <button className="bg-[#17AF26] w-[118px] h-[40px] grid place-items-center rounded-[100px] text-xs text-white">
                    Add to Cart
                  </button>
                </div>
              </div>
              {/* item 3 */}
              <div className="flex snap-center flex-col overflow-hidden gap-y-6 h-full rounded-xl">
                {/* img */}
                <div className="w-full h-[240px] bg-[#F4F4F4] rounded-xl grid place-items-center *:w-[164px] *:h-[164px]">
                  <img src="../Images/img_product.png" alt="" />
                </div>
                {/* about */}
                <div className="w-full h-[304px] flex flex-col justify-between items-center">
                  <strong className="uppercase font-light text-center text-[#9D9EA2]">
                    flower
                  </strong>
                  <strong className="text-[18px] leading-[27px] font-normal text-[#1A1E26] my-1">
                    Mix And Match Shatter/Budder 28g (4 X 7G)
                  </strong>
                  <section className="w-[163px] h-[21px] mt-1 *:text-sm flex justify-between items-start">
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
                    |
                    <div className="flex gap-x-2">
                      <strong>135</strong>
                      <span className="text-[#C8C9CB]">Reviews</span>
                    </div>
                  </section>
                  <section className="bg-[#F2F6F4] w-[92px] -translate-y-1.5 h-[28px] text-xs rounded grid place-items-center my-3">
                    Sativa 100%
                  </section>
                  <div className="flex -translate-y-1.5 my-2">
                    <span className="text-[#EB2606]">$ 80.00</span>
                    <span>/ gram</span>
                  </div>
                  <div className="flex *:text-xs *:py-[7px] -translate-y-2 *:px-[10px] gap-x-2 my-3 *:border *:rounded">
                    <button>28g</button>
                    <button>1/2lb</button>
                    <button>1/4lb</button>
                  </div>
                  <button className="bg-[#17AF26] w-[118px] h-[40px] grid place-items-center rounded-[100px] text-xs text-white">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* back, next */}
          <div className="absolute lg:w-[52%] mb:w-[76%] lg:top-1/2 mb:top-[62.2%] lg:left-1/2 lg:-translate-x-[24%] mb:top-[20%] lg:-translate-y-[270%] flex justify-between *:shadow-2xl *:w-9 *:h-9 *:grid *:place-items-center *:rounded-[50%] *:bg-white">
            <button className="hover:scale-105">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={20}
                height={20}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-chevron-left"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>
            <button className="hover:scale-105">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={20}
                height={20}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-chevron-right"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>
        {/* ---- */}
      </div>
    </div>
  );
};

export default Bestdispensary;
