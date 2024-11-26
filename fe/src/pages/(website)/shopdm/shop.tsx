import Method from "../_component/Method";
import AllProduct from "../shop/_components/AllProduct";
// import { sanPham2 } from "@/assets/img";

import instanceClient from "@/configs/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import ProductCategoriesDM from "./_components/ProductCategoriesDM";
import AllProductDM from "./_components/AllProductDM";
const ShopDM = () => {
  // const queryclient = useQueryClient();
  // const { mutate, isPending } = useMutation({
  //   mutationFn: async (id: any) => {
  //     try {
  //       const response = await instanceClient.post(`sanpham/yeuthich/${id}`);
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
  //     } catch (error: any) {
  //       message.error(error.response.data.message);
  //       console.error("API error", error); // Thêm log lỗi API
  //       throw new Error("Xóa sản phẩm yêu thích thất bại");
  //     }
  //   },
  //   onSuccess: () => {
  //     queryclient.invalidateQueries({ queryKey: ["PRODUCTSLOC"] });
  //   },
  // });

  return (
    <>
      <AllProductDM />
      <ProductCategoriesDM />
      <Method />
    </>
  );
};

export default ShopDM;
