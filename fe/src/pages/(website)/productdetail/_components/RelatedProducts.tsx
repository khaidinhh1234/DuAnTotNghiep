import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import instance from "@/configs/client";
import View from "../../_component/View";
import { message } from "antd";
import Product from "../../_component/Product";

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

  // const { mutate, isPending } = useMutation({
  //   mutationFn: async (id: any) => {
  //     try {
  //       const response = await instance.post(`sanpham/yeuthich/${id}`);
  //       // console.log(response.data);
  //       if (
  //         response.data.mess === "Sản phẩm đã được xóa khỏi danh sách yêu thích"
  //       ) {
  //         message.success("Xóa sản phẩm yêu thích thành công");
  //       }
  //       if (
  //         response.data.mess === "Sản phẩm đã được thêm vào danh sách yêu thích"
  //       ) {
  //         message.success("Thêm sản phẩm yêu thích thành công");
  //       }

  //       return response.data;
  //     } catch (error) {
  //       message.error("Xóa sản phẩm yêu thích thất bại");
  //       console.error("API error", error); // Thêm log lỗi API
  //       throw new Error("Xóa sản phẩm yêu thích thất bại");
  //     }
  //   },
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ["SANPHAM_YEUTHICH"] });
  //   },
  // });

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
        {relatedProducts?.data?.slice(0, 4).map((product, index) => (
          <div
            key={index}
            className="xl:col-span-3 lg:col-span-4 col-span-12 md:col-span-6 mb-2 lg:w-[300px] w-[350px] mx-auto lg:mx-0"
          >
            <Product
              product={product}
              handleMouseEnter={handleMouseEnter}
              hoveredProductId={hoveredProductId}
              hoveredVariantIndex={hoveredVariantIndex}
              index={index}
              // prowish={product?.yeu_thich}
              // newProduct={product?.hang_moi}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
