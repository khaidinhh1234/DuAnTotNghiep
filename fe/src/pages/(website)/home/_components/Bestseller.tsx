import { sanPham2 } from "@/assets/img";
import instance from "@/configs/client";
import { useQuery } from "@tanstack/react-query";

import { Link } from "react-router-dom";

const Bestseller = ({ products }: any) => {
  // const { data } = useQuery({
  //   queryKey: ["PRODUCTS_KEYS"],
  //   queryFn: async () => {
  //     const response = await instance.get("trangchu");
  //     if (response.data.status_code !== 200) {
  //       throw new Error("Error fetching product");
  //     }
  //     return response.data;
  //   },
  // });
  // // console.log(data);
  // const products = data?.danh_sach_san_pham_moi || [];
  // console.log(products);

  return (
    <>
      <section>
        {/* <!-- Our Bestseller --> */}
        <div className="container mb-28">
          <div className="flex justify-center mb-5">
            <h1 className="md:text-4xl text-3xl font-semibold tracking-[1px]">
              Sản Phẩm Mới Nhất
            </h1>
          </div>

          <div className="grid grid-cols-12 justify-center gap-7">
            {" "}
            {products?.slice(0, 4).map((product: any, index: any) => (
              <div
                className="xl:col-span-3 lg:col-span-4 col-span-12 md:col-span-6 mb-2 lg:w-[300px] w-[350px] mx-auto lg:mx-0"
                key={index}
              >
                <div className="product-card hover:bg-zinc-100 rounded-md shadow-lg shadow-black/10">
                  <div className="relative lg:w-full w-[350px] lg:h-[385px] h-[400px]">
                    <a href="#">
                      <i className="z-20 fa-regular fa-heart text-xl pt-1 bg-white hover:bg-black hover:text-white w-11 h-11 flex items-center justify-center absolute top-3 right-6 btn invisible opacity-0 transition-opacity duration-300 rounded-full" />
                    </a>
                    <a href="#">
                      <i className="z-20 fa-solid fa-arrow-right-arrow-left text-lg bg-white hover:bg-black hover:text-white w-11 h-11 flex items-center justify-center absolute top-[63px] right-6 btn invisible opacity-0 transition-opacity duration-300 rounded-full" />
                    </a>
                    <Link to={`/product-detail/${product.id}`}>
                      <i className="z-20 fa-regular fa-eye text-lg bg-white hover:bg-black hover:text-white w-11 h-11 flex items-center justify-center absolute top-[115px] right-6 btn invisible opacity-0 transition-opacity duration-300 rounded-full" />
                    </Link>
                    <div className="relative">
                      <img
                        src={product?.anh_san_pham}
                        alt=""
                        className="lg:w-[300px] w-[500px] lg:h-[380px] h-[400px] rounded-t-md"
                      />
                      {product?.gia_tot == 1 && (
                        <span className="absolute top-3 right-3 bg-red-500 text-white px-3 py-[2px] rounded-lg font-bold">
                          new
                        </span>
                      )}
                    </div>
                    <button className="hover:bg-blackL hover:text-white absolute lg:px-[65px]  px-[90px] py-3 left-4 rounded-lg bottom-5 bg-white invisible opacity-30 transition-opacity btn duration-300">
                      Thêm vào giỏ hàng
                    </button>
                  </div>
                  <div className="bg-slate-50 pt-4 px-4 rounded-md pb-2">
                    <a href="#">
                      <h5 className=" text-base truncate w-60 font-medium">
                        {product?.ten_san_pham}
                      </h5>
                    </a>
                    <p className="font-semibold text-lg">
                      {(product?.bien_the_san_pham[0].gia_khuyen_mai).toLocaleString(
                        "vi-VN"
                      ) ?? 0}{" "}
                      đ
                      <span className="text-black/20 line-through pl-3 text-[16px]">
                        {(product?.bien_the_san_pham[0]?.gia_ban).toLocaleString(
                          "vi-VN"
                        ) ?? 0}{" "}
                        đ
                      </span>
                    </p>

                    <p className="font-bold text-lg flex items-center">
                      {" "}
                      {product?.bien_the_san_pham?.map(
                        (item: any, index: any) => (
                          <button
                            key={index}
                            className="w-7 h-7 rounded-full border-1 inline-block mr-1"
                            style={{
                              backgroundColor: item?.mau_bien_the?.ma_mau_sac,
                            }}
                          />
                        )
                      )}
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
