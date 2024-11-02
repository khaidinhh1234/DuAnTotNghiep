import { sanPham2 } from "@/assets/img";

import Sidebar from "./../../_component/Slibar";
import { Link } from "react-router-dom";
import View from "../../_component/View";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import instanceClient from "@/configs/client";
import { toast } from "react-toastify";
import { message } from "antd";
import { useState } from "react";

const MyWishlistsPage = ({ yeuthich }: any) => {
  const queryClient = useQueryClient();
  const [hoveredProductId, setHoveredProductId] = useState<number | null>(null);
  const [hoveredVariantIndex, setHoveredVariantIndex] = useState<number | null>(
    null
  );
  const handleMouseEnter = (productId: number, variantIndex: any) => {
    setHoveredProductId(productId);
    setHoveredVariantIndex(variantIndex);
  };
  const { mutate, isPending } = useMutation({
    mutationFn: async (id: any) => {
      try {
        const response = await instanceClient.post(`sanpham/yeuthich/${id}`);
        message.success("Xóa sản phẩm yêu thích thành công");
        return response.data;
      } catch (error) {
        console.error("API error", error); // Thêm log lỗi API
        throw new Error("Xóa sản phẩm yêu thích thất bại");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["SANPHAM_YEUTHICH"] });
    },
  });
  console.log(yeuthich);
  return (
    <>
      <div className="lg:col-span-9  col-span-8 mx-auto">
        {/* Content */}{" "}
        <h2 className="text-2xl font-bold text-black-500 mx-4">
          Sản phẩm yêu thích của bạn
        </h2>
        <div className="grid grid-cols-9 justify-center lg:gap-20 gap-14 px-3">
          {yeuthich && yeuthich.length !== 0 ? (
            yeuthich?.map((product: any, index: any) => (
              <div
                className="xl:col-span-3 lg:col-span-4 col-span-12 md:col-span-6 mb-2 lg:w-[290px] w-[350px] mx-auto lg:mx-0"
                key={index}
              >
                <div className="product-card hover:bg-zinc-100 rounded-md shadow-lg shadow-black/10">
                  <div className="relative lg:w-full w-[350px] lg:h-[335px] h-[400px]">
                    {isPending ? (
                      <span>
                        <i className="fa-sharp-duotone fa-solid fa-loader fa-spin-pulse px-3 py-[10px] rounded-full absolute top-3 right-4 btn invisible opacity-0 transition-opacity duration-300"></i>
                      </span>
                    ) : (
                      <span onClick={() => mutate(product.id)}>
                        <i className="fa-solid fa-trash-can text-red-500 bg-white  hover:bg-slate-200 px-3 py-[10px] rounded-full absolute top-3 right-4 btn invisible opacity-0 transition-opacity duration-300" />
                      </span>
                    )}
                    <Link to={`/product-detail/${product.duong_dan}`}>
                      <img
                        src={product?.anh_san_pham}
                        alt=""
                        className="lg:w-[300px] w-[500px] lg:h-[330px] h-[400px] rounded-t-md"
                      />
                    </Link>
                    <View id={product?.duong_dan} ID={product?.id} />
                  </div>
                  <div className="bg-slate-50 pt-4 px-4 rounded-md pb-2">
                    <Link to={`/product-detail/${product.duong_dan}`}>
                      {" "}
                      <h5 className=" text-base truncate w-60 font-medium hover:text-red-500">
                        {product?.ten_san_pham}
                      </h5>
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
                          <i className="fa-solid fa-minus text-sm mx-1 text-slate-500"></i>
                          {(product?.gia_cao_nhat ?? 0).toLocaleString("vi-VN")}{" "}
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
            ))
          ) : (
            <>
              <div className="col-span-9 h-[530px] ">
                <img
                  src="https://res.cloudinary.com/dpypwbeis/image/upload/v1730343472/zh60sofc5dxucpb9lv5i.png"
                  alt=""
                  className="w-[25%] h-auto mx-auto mt-24"
                />
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default MyWishlistsPage;
