// import { sanPham2 } from "@/assets/img";
import instanceClient from "@/configs/client";
import { useQuery } from "@tanstack/react-query";

import { Link } from "react-router-dom";

const Bestseller = () => {
  const { data } = useQuery({
    queryKey: ["PRODUCTS_KEY"],
    queryFn: async () => {
      const response = await instanceClient.get("trangchu");
      if (response.data.status_code !== 200) {
        throw new Error("Error fetching product");
      }
      return response.data;
    },
  });
  const products = data?.danh_sach_san_pham_moi || [];
  // console.log(products);
  // const products = [
  //   {
  //     name: "Allen Solly",
  //     description: "Women Texttured Handheld Bag",
  //     price: 10000,
  //     discount: 80,
  //     image: sanPham2,
  //   },
  //   {
  //     name: "San Frissco",
  //     description: " Women Texttured Handheld Bag",
  //     price: 20000,
  //     discount: 150000,
  //     image: sanPham2,
  //   },
  //   {
  //     name: "Allen Solly",
  //     description: "xfg",
  //     price: 1000000,
  //     discount: 8000,
  //     image: sanPham2,
  //   },
  //   {
  //     name: "Allen Solly",
  //     description: "",
  //     price: 100000,
  //     discount: 80000,
  //     image: sanPham2,
  //   },
  //   {
  //     name: "Allen Solly",
  //     description: "",
  //     price: 10000,
  //     discount: 80000,
  //     image: sanPham2,
  //   },
  // ];
  return (
    <>
      <section>
        {/* <!-- Our Bestseller --> */}
        <div className="container mb-28">
          <div className="flex justify-center mb-5">
            <h1 className="md:text-4xl text-3xl font-semibold tracking-[1px]">
              Sản Phẩm Bán Chạy
            </h1>
          </div>

          <div className="grid grid-cols-12 justify-center gap-7">
            {" "}
            {products?.slice(0, 4).map((product: any, index: any) => (
              <div
                className="xl:col-span-3 lg:col-span-4 col-span-12 md:col-span-6 mb-2 w-[300px]"
                key={index}
              >
                <div className="product-card hover:bg-zinc-100 rounded-md shadow-lg shadow-black/50">
                  <div className="relative w-full h-[385px] ">
                    <a href="#">
                      <i className="fa-regular fa-star text-lg bg-white hover:bg-black hover:text-white w-12 h-12 flex items-center justify-center absolute top-3 right-6 btn invisible opacity-0 transition-opacity duration-300 rounded-full" />
                    </a>
                    <a href="#">
                      <i className="fa-solid fa-arrow-right-arrow-left text-lg bg-white hover:bg-black hover:text-white w-12 h-12 flex items-center justify-center absolute top-[63px] right-6 btn invisible opacity-0 transition-opacity duration-300 rounded-full" />
                    </a>
                    <Link to={`/product-detail/${product.id}`}>
                      <i className="fa-regular fa-eye text-lg bg-white hover:bg-black hover:text-white w-12 h-12 flex items-center justify-center absolute top-[115px] right-6 btn invisible opacity-0 transition-opacity duration-300 rounded-full" />
                    </Link>
                    <img
                      src={product?.anh_san_pham}
                      alt=""
                      className="w-[300px] h-[380px] rounded-t-md"
                    />
                    <button className="hover:bg-blackL hover:text-white absolute px-[65px] py-3 left-4 rounded-lg bottom-5 bg-white invisible opacity-30 transition-opacity btn duration-300">
                      Thêm vào giỏ hàng
                    </button>
                  </div>
                  <div className="bg-slate-50 pt-4 px-4 rounded-md pb-2">
                    <a href="#">
                      <h5 className=" text-base truncate w-60">
                        {product?.ten_san_pham}
                      </h5>
                    </a>
                    {/* <p className="my-1 font-normal text-lg w-60 truncate">
                      {product?.mo_ta_ngan}
                    </p> */}
                    <p className="font-medium text-base">
                      {product?.bien_the_san_pham?.gia_ban} VNĐ
                      <span className="text-black/20 line-through px-1">
                        {product.discount} VNĐ
                      </span>
                    </p>
                    <div></div>
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
