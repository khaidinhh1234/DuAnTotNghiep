import Method from "../_component/Method";
// import { sanPham2 } from "@/assets/img";

import AllProductDM from "./_components/AllProductDM";
import ProductCategoriesDM from "./_components/ProductCategoriesDM";
const ShopDM = () => {
  return (
    <>
      <AllProductDM />
      <ProductCategoriesDM />
      <Method />
    </>
  );
};

export default ShopDM;
