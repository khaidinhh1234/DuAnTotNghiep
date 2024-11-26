import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import instanceClient from "@/configs/client";
import View from "../../_component/View";
import Product from "../../_component/Product";
// import useDebounce from "@/components/hook/useDebounce";

const Bestseller = ({ products, sectionTitle, isPromotional = false }: any) => {
  const [hoveredProductId, setHoveredProductId] = useState<number | null>(null);
  const [hoveredVariantIndex, setHoveredVariantIndex] = useState<number | null>(
    null
  );
  const [visibleProductsCount, setVisibleProductsCount] = useState(4);

  const handleSeeMore = () => {
    setVisibleProductsCount(visibleProductsCount + 8);
  };

  const handleMouseEnter = (productId: number, variantIndex: any) => {
    setHoveredProductId(productId);
    setHoveredVariantIndex(variantIndex);
  };
  return (
    <section>
      <div className="container mb-28">
        <div className="flex justify-center mb-5">
          <h1 className="md:text-4xl text-3xl font-semibold tracking-[1px]">
            {sectionTitle}
          </h1>
        </div>

        <div className="grid grid-cols-12 justify-center gap-7">
          {products
            ?.slice(0, visibleProductsCount)
            .map((product: any, index: any) => {
              // Check if product belongs to the promotional section
              if (isPromotional && !product?.chuong_trinh_uu_dai) return null; // Skip products that are not in promotion

              return (
                <div
                  className="xl:col-span-3 lg:col-span-4 col-span-12 md:col-span-6 mb-2 lg:w-[300px] w-[350px] mx-auto lg:mx-0"
                  key={index}
                >
                  <Product
                    product={product}
                    handleMouseEnter={handleMouseEnter}
                    hoveredProductId={hoveredProductId}
                    hoveredVariantIndex={hoveredVariantIndex}
                    index={index}
                    prowish={product?.yeu_thich}
                    newProduct={product?.hang_moi}
                  />
                </div>
              );
            })}
        </div>

        {products?.length > visibleProductsCount && (
          <div className="col-span-12 text-center mt-4">
            <button
              onClick={handleSeeMore}
              className="bg-black text-white px-4 py-2 rounded-md hover:bg-white hover:text-black border border-black"
            >
              Xem thêm
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Bestseller;
