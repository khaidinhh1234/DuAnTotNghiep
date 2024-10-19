// import { sanPham2 } from "@/assets/img";

import { Link } from "react-router-dom";
import View from "./View";

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
                {" "}
                <div className="product-card hover:bg-zinc-100 rounded-md shadow-lg shadow-black/10">
                  <div className="relative lg:w-full w-[350px] lg:h-[385px] h-[400px]">
                    <a href="#">
                      <i className="z-20 fa-regular fa-heart text-xl pt-1 bg-white hover:bg-black hover:text-white w-11 h-11 flex items-center justify-center absolute top-3 right-6 btn invisible opacity-0 transition-opacity duration-300 rounded-full" />
                    </a>
                    <a href="#">
                      <i className="z-20 fa-solid fa-arrow-right-arrow-left text-lg bg-white hover:bg-black hover:text-white w-11 h-11 flex items-center justify-center absolute top-[63px] right-6 btn invisible opacity-0 transition-opacity duration-300 rounded-full" />
                    </a>

                    <View id={product.id} />
                    <Link to={`/product-detail/${product.id}`}>
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
                      </div>{" "}
                    </Link>
                    {/* <button className="hover:bg-blackL hover:text-white absolute lg:px-[65px]  px-[90px] py-3 left-4 rounded-lg bottom-5 bg-white invisible opacity-30 transition-opacity btn duration-300">
                      Thêm vào giỏ hàng
                    </button> */}
                  </div>
                  <Link to={`/product-detail/${product.id}`}>
                    {" "}
                    <div className="bg-slate-50 pt-4 px-4 rounded-md pb-2">
                      <h5 className=" text-base truncate w-60 font-medium">
                        {product?.ten_san_pham}
                      </h5>

                      <p className="font-semibold text-lg">
                        {product?.gia_thap_nhat === product?.gia_cao_nhat ? (
                          <>
                            {(product?.gia_cao_nhat ?? 0).toLocaleString(
                              "vi-VN"
                            )}{" "}
                            đ
                          </>
                        ) : (
                          <>
                            {(product?.gia_thap_nhat ?? 0).toLocaleString(
                              "vi-VN"
                            )}{" "}
                            đ
                            <i className="fa-solid fa-minus text-sm mx-1 text-slate-500"></i>
                            {(product?.gia_cao_nhat ?? 0).toLocaleString(
                              "vi-VN"
                            )}{" "}
                            đ
                          </>
                        )}
                      </p>

                      <p className="font-bold text-lg flex items-center">
                        {" "}
                        {product?.bien_the?.map((item: any, index: any) => (
                          <button
                            key={index}
                            className="w-7 h-7 rounded-full border-1 inline-block mr-1"
                            style={{
                              backgroundColor: item?.ma_mau_sac,
                            }}
                          />
                        ))}
                      </p>
                    </div>{" "}
                  </Link>
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
