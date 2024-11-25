import { sanPham2 } from "@/assets/img";

import Sidebar from "./../../_component/Slibar";
import { Link } from "react-router-dom";
import View from "../../_component/View";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import instanceClient from "@/configs/client";
import { toast } from "react-toastify";
import { message } from "antd";
import { useState } from "react";
import Product from "../../_component/Product";

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
  const { mutate: yeu_thich } = useMutation({
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
                <Product
                  product={product}
                  handleMouseEnter={handleMouseEnter}
                  hoveredProductId={hoveredProductId}
                  hoveredVariantIndex={hoveredVariantIndex}
                  yeuthich={yeu_thich}
                />
              </div>
            ))
          ) : (
            <>
              <div className="col-span-9 h-[450px] ">
                <img
                  src="https://res.cloudinary.com/dpypwbeis/image/upload/v1731090053/alrcbcq0hw5obbuhonmb.png"
                  alt=""
                  className="w-[20%] h-auto mx-auto mt-24"
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
