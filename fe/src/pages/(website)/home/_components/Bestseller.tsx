import { sanPham2 } from "@/assets/img";
import React from "react";

const Bestseller = () => {
  const products = [
    {
      name: "Allen Solly",
      description: "Women Texttured Handheld Bag",
      price: 10000,
      discount: 80,
      image: sanPham2,
    },
    {
      name: "San Frissco",
      description: " Women Texttured Handheld Bag",
      price: 20000,
      discount: 150000,
      image: sanPham2,
    },
    {
      name: "Allen Solly",
      description: "xfg",
      price: 1000000,
      discount: 8000,
      image: sanPham2,
    },
    {
      name: "Allen Solly",
      description: "",
      price: 100000,
      discount: 80000,
      image: sanPham2,
    },
    {
      name: "Allen Solly",
      description: "",
      price: 10000,
      discount: 80000,
      image: sanPham2,
    },
  ];
  return (
    <>
      <section>
        {/* <!-- Our Bestseller --> */}
        <div className="container mb-28">
          <div className="flex justify-center mb-5">
            <h1 className="text-4xl font-semibold tracking-[1px]">
              Sản Phẩm Bán Chạy
            </h1>
          </div>

          <div className="grid grid-cols-12 justify-center gap-7">
            {" "}
            {products.map((product, index) => (
              <div
                className="xl:col-span-3 lg:col-span-4 col-span-12 md:col-span-6 mb-2 w-[300px] mx-auto"
                key={index}
              >
                <div className="product-card hover:bg-zinc-100">
                  <div className="relative w-full h-[400px] ">
                    <a href="#">
                      <i className="fa-regular fa-star text-lg bg-white hover:bg-black hover:text-white w-12 h-12 flex items-center justify-center absolute top-5 right-6 btn invisible opacity-0 transition-opacity duration-300 rounded-full" />
                    </a>
                    <a href="#">
                      <i className="fa-solid fa-arrow-right-arrow-left text-lg bg-white hover:bg-black hover:text-white w-12 h-12 flex items-center justify-center absolute top-[70px] right-6 btn invisible opacity-0 transition-opacity duration-300 rounded-full" />
                    </a>
                    <a href="#">
                      <i className="fa-regular fa-eye text-lg bg-white hover:bg-black hover:text-white w-12 h-12 flex items-center justify-center absolute top-[121px] right-6 btn invisible opacity-0 transition-opacity duration-300 rounded-full" />
                    </a>
                    <img
                      src={sanPham2}
                      alt=""
                      className="w-[280px] h-[370px] ml-2"
                    />
                    <button className="hover:bg-blackL hover:text-white absolute px-[90px] py-3 left-4 rounded-lg bottom-5 bg-white invisible opacity-30 transition-opacity btn duration-300">
                      Add to Cart
                    </button>
                  </div>
                  <div className="bg-white pt-4">
                    <a href="#">
                      <h5 className="font-bold text-xl">{product.name}</h5>
                    </a>
                    <p className="my-1 font-normal text-lg">
                      {product.description}
                    </p>
                    <p className="font-medium text-lg">
                      {product.price.toLocaleString("vn-VN")} VNĐ
                      <span className="text-black/20 line-through px-1">
                        {product.discount.toLocaleString("vn-VN")} VNĐ
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Bestseller;
