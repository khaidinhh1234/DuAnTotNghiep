import Method from "../_component/Method";
import AllProduct from "./_components/AllProduct";
import ProductCategories from "./_components/ProductCategories";
// import { sanPham2 } from "@/assets/img";

import instanceClient from "@/configs/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
const Page = () => {
  const queryclient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: async (id: any) => {
      try {
        const response = await instanceClient.post(`sanpham/yeuthich/${id}`);
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
      } catch (error) {
        message.error("Xóa sản phẩm yêu thích thất bại");
        console.error("API error", error); // Thêm log lỗi API
        throw new Error("Xóa sản phẩm yêu thích thất bại");
      }
    },
    onSuccess: () => {
      queryclient.invalidateQueries({ queryKey: ["PRODUCTSLOC"] });
    },
  });
  const handleWishlist = (id: any) => {
    mutate(id);
  };
  return (
    <>
      <AllProduct />
      <ProductCategories
        handleWishlist={handleWishlist}
        isPending={isPending}
      />
      <Method />
    </>
  );
};

export default Page;
