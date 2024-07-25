import { sanPham2 } from '@/assets/img'
import React from 'react'

const Bestseller = () => {
  return (
    <>
      <section>
        {/* <!-- Our Bestseller --> */}
        <div className="container mb-28">
          <div className="flex justify-center mb-5">
            <h1 className="text-4xl font-medium tracking-[1px]">Sản Phẩm Bán Chạy</h1>
          </div>

          <div className="grid grid-cols-12 justify-center gap-7">
            <div
              className="xl:col-span-3 lg:col-span-4 col-span-12 md:col-span-6 mb-2 w-[300px] mx-auto"
            >
              <div className="product-card hover:bg-zinc-100">
                <div className="relative w-full h-[400px] ">
                  <a href="#">
                    <i
                      className="fa-regular fa-star text-lg bg-white w-12 h-12 flex items-center justify-center absolute top-5 right-6 btn invisible opacity-0 transition-opacity duration-300 rounded-full"
                    />
                  </a>
                  <a href="#">
                    <i
                      className="fa-solid fa-arrow-right-arrow-left text-lg bg-white w-12 h-12 flex items-center justify-center absolute top-[70px] right-6 btn invisible opacity-0 transition-opacity duration-300 rounded-full"
                    />
                  </a>
                  <a href="#">
                    <i
                      className="fa-regular fa-eye text-lg bg-white w-12 h-12 flex items-center justify-center absolute top-[121px] right-6 btn invisible opacity-0 transition-opacity duration-300 rounded-full"
                    />
                  </a>
                  <img
                    src={sanPham2}
                    alt=""
                    className="w-[280px] h-[370px] ml-2"
                  />
                  <button
                    className="hover:bg-blackL hover:text-white absolute px-[90px] py-3 left-4 rounded-lg bottom-5 bg-white invisible opacity-30 transition-opacity btn duration-300"
                  >
                    Add to Cart
                  </button>
                </div>
                <div className="bg-white pt-4">
                  <a href="#"><h5 className="font-bold text-xl">Allen Solly</h5></a>
                  <p className="my-1 font-normal text-lg">
                    Women Texttured Handheld Bag
                  </p>
                  <p className="font-medium text-lg">
                    $80.00
                    <span className="text-black/20 line-through px-1">$100.00</span>
                  </p>
                </div>
              </div>
            </div>
            <div
              className="xl:col-span-3 lg:col-span-4 md:col-span-6 col-span-12 mb-2 w-[300px] mx-auto"
            >
              <div className="product-card hover:bg-zinc-100">
                <div className=" relative w-full h-[400px] ">
                  <a href="#">
                    <i
                      className="fa-regular fa-star text-lg bg-white w-12 h-12 flex items-center justify-center absolute top-5 right-6 btn invisible opacity-0 transition-opacity duration-300 rounded-full"
                    />
                  </a>
                  <a href="#">
                    <i
                      className="fa-solid fa-arrow-right-arrow-left text-lg bg-white w-12 h-12 flex items-center justify-center absolute top-[70px] right-6 btn invisible opacity-0 transition-opacity duration-300 rounded-full"
                    />
                  </a>
                  <a href="#">
                    <i
                      className="fa-regular fa-eye text-lg bg-white w-12 h-12 flex items-center justify-center absolute top-[121px] right-6 btn invisible opacity-0 transition-opacity duration-300 rounded-full"
                    />
                  </a>
                  <img
                    src={sanPham2}
                    alt=""
                    className="w-[280px] h-[370px] ml-2"
                  />
                  <button
                    className="hover:bg-blackL hover:text-white absolute px-[90px] py-3 left-4 rounded-lg bottom-5 bg-white invisible opacity-30 transition-opacity btn duration-300"
                  >
                    Add to Cart
                  </button>
                </div>
                <div className="bg-white pt-4">
                  <a href="#"><h5 className="font-bold text-xl">Allen Solly</h5></a>
                  <p className="my-1 font-normal text-lg">
                    Women Texttured Handheld Bag
                  </p>
                  <p className="font-medium text-lg">
                    $80.00
                    <span className="text-black/20 line-through px-1">$100.00</span>
                  </p>
                </div>
              </div>
            </div>
            <div
              className="xl:col-span-3 lg:col-span-4 md:col-span-6 col-span-12 mb-2 w-[300px] mx-auto"
            >
              <div className="product-card hover:bg-zinc-100">
                <div className="w-full h-[400px] relative">
                  <a href="#">
                    <i
                      className="fa-regular fa-star text-lg bg-white w-12 h-12 flex items-center justify-center absolute top-5 right-6 btn invisible opacity-0 transition-opacity duration-300 rounded-full"
                    />
                  </a>
                  <a href="#">
                    <i
                      className="fa-solid fa-arrow-right-arrow-left text-lg bg-white w-12 h-12 flex items-center justify-center absolute top-[70px] right-6 btn invisible opacity-0 transition-opacity duration-300 rounded-full"
                    />
                  </a>
                  <a href="#">
                    <i
                      className="fa-regular fa-eye text-lg bg-white w-12 h-12 flex items-center justify-center absolute top-[121px] right-6 btn invisible opacity-0 transition-opacity duration-300 rounded-full"
                    />
                  </a>
                  <img
                    src={sanPham2}
                    alt=""
                    className="w-[280px] h-[370px] ml-2"
                  />
                  <button
                    className="hover:bg-blackL hover:text-white absolute px-[90px] py-3 left-4 rounded-lg bottom-5 bg-white invisible opacity-30 transition-opacity btn duration-300"
                  >
                    Add to Cart
                  </button>
                </div>
                <div className="bg-white pt-4">
                  <a href="#"><h5 className="font-bold text-xl">Allen Solly</h5></a>
                  <p className="my-1 font-normal text-lg">
                    Women Texttured Handheld Bag
                  </p>
                  <p className="font-medium text-lg">
                    $80.00
                    <span className="text-black/20 line-through px-1">$100.00</span>
                  </p>
                </div>
              </div>
            </div>
            <div
              className="xl:col-span-3 lg:col-span-4 md:col-span-6 col-span-12 mb-2 w-[300px] mx-auto"
            >
              <div className="product-card hover:bg-zinc-100">
                <div className="w-full h-[400px] relative">
                  <a href="#">
                    <i
                      className="fa-regular fa-star text-lg bg-white w-12 h-12 flex items-center justify-center absolute top-5 right-6 btn invisible opacity-0 transition-opacity duration-300 rounded-full"
                    />
                  </a>
                  <a href="#">
                    <i
                      className="fa-solid fa-arrow-right-arrow-left text-lg bg-white w-12 h-12 flex items-center justify-center absolute top-[70px] right-6 btn invisible opacity-0 transition-opacity duration-300 rounded-full"
                    />
                  </a>
                  <a href="#">
                    <i
                      className="fa-regular fa-eye text-lg bg-white w-12 h-12 flex items-center justify-center absolute top-[121px] right-6 btn invisible opacity-0 transition-opacity duration-300 rounded-full"
                    />
                  </a>
                  <img
                    src={sanPham2}
                    alt=""
                    className="w-[280px] h-[370px] ml-2"
                  />
                  <button
                    className="hover:bg-blackL hover:text-white absolute px-[90px] py-3 left-4 rounded-lg bottom-5 bg-white invisible opacity-30 transition-opacity btn duration-300"
                  >
                    Add to Cart
                  </button>
                </div>
                <div className="bg-white pt-4">
                  <a href="#"><h5 className="font-bold text-xl">Allen Solly</h5></a>
                  <p className="my-1 font-normal text-lg">
                    Women Texttured Handheld Bag
                  </p>
                  <p className="font-medium text-lg">
                    $80.00
                    <span className="text-black/20 line-through px-1">$100.00</span>
                  </p>
                </div>
              </div>
            </div>
            <div
              className="xl:col-span-3 lg:col-span-4 md:col-span-6 col-span-12 mb-2 w-[300px] mx-auto"
            >
              <div className="product-card hover:bg-zinc-100">
                <div className="w-full h-[400px] relative">
                  <a href="#">
                    <i
                      className="fa-regular fa-star text-lg bg-white w-12 h-12 flex items-center justify-center absolute top-5 right-6 btn invisible opacity-0 transition-opacity duration-300 rounded-full"
                    />
                  </a>
                  <a href="#">
                    <i
                      className="fa-solid fa-arrow-right-arrow-left text-lg bg-white w-12 h-12 flex items-center justify-center absolute top-[70px] right-6 btn invisible opacity-0 transition-opacity duration-300 rounded-full"
                    />
                  </a>
                  <a href="#">
                    <i
                      className="fa-regular fa-eye text-lg bg-white w-12 h-12 flex items-center justify-center absolute top-[121px] right-6 btn invisible opacity-0 transition-opacity duration-300 rounded-full"
                    />
                  </a>
                  <img
                    src={sanPham2}
                    alt=""
                    className="w-[280px] h-[370px] ml-2"
                  />
                  <button
                    className="hover:bg-blackL hover:text-white absolute px-[90px] py-3 left-4 rounded-lg bottom-5 bg-white invisible opacity-30 transition-opacity btn duration-300"
                  >
                    Add to Cart
                  </button>
                </div>
                <div className="bg-white pt-4">
                  <a href="#"><h5 className="font-bold text-xl">Allen Solly</h5></a>
                  <p className="my-1 font-normal text-lg">
                    Women Texttured Handheld Bag
                  </p>
                  <p className="font-medium text-lg">
                    $80.00
                    <span className="text-black/20 line-through px-1">$100.00</span>
                  </p>
                </div>
              </div>
            </div>
            <div
              className="xl:col-span-3 lg:col-span-4 md:col-span-6 col-span-12 mb-2 w-[300px] mx-auto"
            >
              <div className="product-card hover:bg-zinc-100">
                <div className="w-full h-[400px] relative">
                  <a href="#">
                    <i
                      className="fa-regular fa-star text-lg bg-white w-12 h-12 flex items-center justify-center absolute top-5 right-6 btn invisible opacity-0 transition-opacity duration-300 rounded-full"
                    />
                  </a>
                  <a href="#">
                    <i
                      className="fa-solid fa-arrow-right-arrow-left text-lg bg-white w-12 h-12 flex items-center justify-center absolute top-[70px] right-6 btn invisible opacity-0 transition-opacity duration-300 rounded-full"
                    />
                  </a>
                  <a href="#">
                    <i
                      className="fa-regular fa-eye text-lg bg-white w-12 h-12 flex items-center justify-center absolute top-[121px] right-6 btn invisible opacity-0 transition-opacity duration-300 rounded-full"
                    />
                  </a>
                  <img
                    src={sanPham2}
                    alt=""
                    className="w-[280px] h-[370px] ml-2"
                  />
                  <button
                    className="hover:bg-blackL hover:text-white absolute px-[90px] py-3 left-4 rounded-lg bottom-5 bg-white invisible opacity-30 transition-opacity btn duration-300"
                  >
                    Add to Cart
                  </button>
                </div>
                <div className="bg-white pt-4">
                  <a href="#"><h5 className="font-bold text-xl">Allen Solly</h5></a>
                  <p className="my-1 font-normal text-lg">
                    Women Texttured Handheld Bag
                  </p>
                  <p className="font-medium text-lg">
                    $80.00
                    <span className="text-black/20 line-through px-1">$100.00</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Bestseller