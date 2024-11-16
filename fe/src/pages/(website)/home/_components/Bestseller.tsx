// import { sanPham2 } from "@/assets/img";

import instanceClient from "@/configs/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import { useState } from "react";
import { Link } from "react-router-dom";
import View from "../../_component/View";
import { debounce } from "lodash/debounce";
import useDebounce from "@/components/hook/useDebounce";

const Bestseller = ({ products }: any) => {
  const [hoveredProductId, setHoveredProductId] = useState<number | null>(null);
  const [hoveredVariantIndex, setHoveredVariantIndex] = useState<number | null>(
    null
  );

  const handleMouseEnter = (productId: number, variantIndex: any) => {
    setHoveredProductId(productId);
    setHoveredVariantIndex(variantIndex);
  };
  const queryclient = useQueryClient();
  const debounceFn = useDebounce({ value: products, time: 1000 });
  const { mutate, isPending } = useMutation({
    mutationFn: async (id: any) => {
      try {
        const response = await instanceClient.post(`sanpham/yeuthich/${id}`);

        if (
          response.data.mess === "Sản phẩm đã được xóa khỏi danh sách yêu thích"
        ) {
          message.success("Xóa sản phẩm yêu thích thành công");
        }
        if (
          response.data.mess === "Sản phẩm đã được thêm vào danh sách yêu thích"
        ) {
          message.success("Thêm sản phẩm yêu thích thành công");
        }

        return response.data;
      } catch (error: any) {
        message.error(error?.response?.data?.mess);
        // throw new Error("Xóa sản phẩm yêu thích thất bại");
      }
    },
    onSuccess: () => {
      queryclient.invalidateQueries({
        queryKey: ["TRANG_CHU_CLIENT"],
      });
    },
  });
  return (
    <>
      <section>
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
                    {isPending ? (
                      <span>
                        <i className="z-10 fa-sharp-duotone fa-solid fa-loader fa-spin-pulse text-xl pt-1 bg-white hover:bg-black hover:text-white w-11 h-11 flex items-center justify-center absolute top-3 right-6 btn invisible opacity-0 transition-opacity duration-300 rounded-full" />
                      </span>
                    ) : (
                      <span onClick={() => mutate(product?.id)}>
                        <i
                          className={`${product?.yeu_thich ? "text-red-500" : "text-black hover:text-white"} z-10 fa-solid fa-heart text-xl pt-1 bg-white hover:bg-black  w-11 h-11 flex items-center justify-center absolute top-3 right-6 btn invisible opacity-0 transition-opacity duration-300 rounded-full`}
                        />
                      </span>
                    )}

                    <Link to={`/product-detail/${product.duong_dan}`}>
                      <div className="relative">
                        <img
                          src={
                            hoveredProductId === product.id &&
                            hoveredVariantIndex !== null
                              ? product.mau_sac_va_anh[hoveredVariantIndex]
                                  .hinh_anh
                              : product.anh_san_pham
                          }
                          alt=""
                          className="lg:w-[300px] w-[500px] lg:h-[380px] h-[400px] rounded-t-md"
                        />
                        {product?.hang_moi == 1 && (
                          <span className="absolute top-3 left-4 bg-red-500 text-white px-3 py-[2px] rounded-md font-bold">
                            Mới
                          </span>
                        )}
                      </div>{" "}
                    </Link>
                    <View id={product?.duong_dan} ID={product?.id} />
                  </div>
                  <div className="bg-slate-50 pt-4 px-4 rounded-md pb-2">
                    <Link to={`/product-detail/${product.duong_dan}`}>
                      {" "}
                      <h5 className=" text-base truncate w-60 font-medium hover:text-red-500">
                        {product?.ten_san_pham}
                      </h5>{" "}
                    </Link>

                    <p className="font-semibold text-lg">
                      {product?.gia_thap_nhat === product?.gia_cao_nhat ? (
                        <>
                          {(product?.gia_cao_nhat ?? 0).toLocaleString("vi-VN")}{" "}
                          đ
                        </>
                      ) : (
                        <>
                          {(product?.gia_thap_nhat ?? 0).toLocaleString(
                            "vi-VN"
                          )}{" "}
                          đ
                          <i className="fa-solid fa-minus text-sm mx-1 text-slate-500"></i>
                          {(product?.gia_cao_nhat ?? 0).toLocaleString("vi-VN")}{" "}
                          đ
                        </>
                      )}
                    </p>

                    <p className="font-bold text-lg flex items-center">
                      {product?.mau_sac_va_anh?.map(
                        (item: any, indexs: any) => (
                          <button
                            key={indexs}
                            className={`w-7 h-7 rounded-full border mr-1 
                             ${
                               hoveredProductId === product?.id &&
                               hoveredVariantIndex === indexs
                                 ? "border-black"
                                 : "border-gray-300 hover:border-black"
                             }`}
                            style={{
                              backgroundColor: item?.ma_mau_sac,
                            }}
                            onMouseEnter={() =>
                              handleMouseEnter(product?.id, indexs)
                            }
                          />
                        )
                      )}
                    </p>
                  </div>{" "}
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
