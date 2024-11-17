import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import instance from "@/configs/client";
import View from "../../_component/View";
import { message } from "antd";

interface RelatedProduct {
  id: number;
  ten_san_pham: string;
  anh_san_pham: string;
  gia_thap_nhat: number;
  gia_cao_nhat: number;
  duong_dan: string;
  mau_sac_va_anh: Array<{
    ma_mau_sac: string;
    hinh_anh: string;
  }>;
}

interface RelatedProductsProps {
  productId: number;
}

const fetchRelatedProducts = async (productId: number) => {
  const response = await instance.get(
    `/danh-sach-san-pham-cung-loai/${productId}`
  );
  return response.data;
};

const RelatedProducts: React.FC<RelatedProductsProps> = ({ productId }) => {
  const [hoveredProductId, setHoveredProductId] = useState<number | null>(null);
  const [hoveredVariantIndex, setHoveredVariantIndex] = useState<number | null>(
    null
  );
  const queryClient = useQueryClient();

  const { data: relatedProducts } = useQuery<{ data: RelatedProduct[] }>({
    queryKey: ["relatedProducts", productId],
    queryFn: () => fetchRelatedProducts(productId),
    enabled: !!productId,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (id: any) => {
      try {
        const response = await instance.post(`sanpham/yeuthich/${id}`);
        // console.log(response.data);
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
        message.error(error.response.data.message);
        console.error("API error", error); // Thêm log lỗi API
        throw new Error("Xóa sản phẩm yêu thích thất bại");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["SANPHAM_YEUTHICH"] });
    },
  });

  const handleMouseEnter = (productId: number, variantIndex: number) => {
    setHoveredProductId(productId);
    setHoveredVariantIndex(variantIndex);
  };

  if (!relatedProducts?.data || relatedProducts.data.length === 0) {
    return null;
  }

  return (
    <div className="container mb-28">
      <div className="flex justify-center mb-5">
        <h1 className="md:text-4xl text-3xl font-normal tracking-[1px]">
          Sản phẩm cùng loại
        </h1>
      </div>

      <div className="grid grid-cols-12 justify-center gap-7">
        {relatedProducts?.data?.map((product) => (
          <div
            key={product.id}
            className="xl:col-span-3 lg:col-span-4 col-span-12 md:col-span-6 mb-2 lg:w-[300px] w-[350px] mx-auto lg:mx-0"
          >
            <div className="product-card hover:bg-zinc-100 rounded-md shadow-lg shadow-black/10">
              <div className="relative lg:w-full w-[350px] lg:h-[385px] h-[400px]">
                {isPending ? (
                  <span>
                    <i className="z-20 fa-sharp-duotone fa-solid fa-loader fa-spin-pulse text-xl pt-1 bg-white hover:bg-black hover:text-white w-11 h-11 flex items-center justify-center absolute top-3 right-6 btn invisible opacity-0 transition-opacity duration-300 rounded-full" />
                  </span>
                ) : (
                  <span onClick={() => mutate(product.id)}>
                    <i className="z-20 fa-solid fa-heart text-xl pt-1 bg-white hover:bg-black hover:text-white w-11 h-11 flex items-center justify-center absolute top-3 right-6 btn invisible opacity-0 transition-opacity duration-300 rounded-full" />
                  </span>
                )}

                <Link to={`/product-detail/${product.duong_dan}`}>
                  <div className="relative">
                    <img
                      src={
                        hoveredProductId === product.id &&
                        hoveredVariantIndex !== null
                          ? product.mau_sac_va_anh[hoveredVariantIndex].hinh_anh
                          : product.anh_san_pham
                      }
                      alt=""
                      className="lg:w-[300px] w-[500px] lg:h-[380px] h-[400px] rounded-t-md"
                    />
                  </div>
                </Link>
                <View id={product.duong_dan} ID={product.id} />
              </div>

              <Link to={`/product-detail/${product.duong_dan}`}>
                <div className="bg-slate-50 pt-4 px-4 rounded-md pb-2">
                  <h5 className="text-base truncate w-60 font-medium">
                    {product.ten_san_pham}
                  </h5>

                  <p className="font-semibold text-lg">
                    {product.gia_thap_nhat === product.gia_cao_nhat ? (
                      <>
                        {(product.gia_cao_nhat ?? 0).toLocaleString("vi-VN")} đ
                      </>
                    ) : (
                      <>
                        {(product.gia_thap_nhat ?? 0).toLocaleString("vi-VN")} đ
                        <i className="fa-solid fa-minus text-sm mx-1 text-slate-500"></i>
                        {(product.gia_cao_nhat ?? 0).toLocaleString("vi-VN")} đ
                      </>
                    )}
                  </p>

                  <p className="font-bold text-lg flex items-center">
                    {product.mau_sac_va_anh?.map((item, index) => (
                      <button
                        key={index}
                        className={`w-7 h-7 rounded-full border mr-1 ${
                          hoveredProductId === product.id &&
                          hoveredVariantIndex === index
                            ? "border-black"
                            : "border-gray-300 hover:border-black"
                        }`}
                        style={{
                          backgroundColor: item.ma_mau_sac,
                        }}
                        onMouseEnter={() => handleMouseEnter(product.id, index)}
                      />
                    ))}
                  </p>
                </div>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
