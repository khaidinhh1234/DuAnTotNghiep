// import React from 'react';
// import { Link } from 'react-router-dom';
// import View from '../../_component/View';

// interface RelatedProduct {
//   id: number;
//   ten_san_pham: string;
//   anh_san_pham: string;
//   gia_thap_nhat: number;
//   gia_cao_nhat: number;
//   bien_the: Array<{
//     ma_mau_sac: string;
//   }>;
// }

// interface RelatedProductsProps {
//   products: RelatedProduct[];
// }

// const RelatedProducts: React.FC<RelatedProductsProps> = ({ products }) => {
//   return (
//     <div className="container mb-28">
//       <div className="flex justify-center mb-5">
//         <h1 className="md:text-4xl text-3xl font-normal tracking-[1px]">
//           Sản phẩm cùng loại
//         </h1>
//       </div>

//       <div className="grid grid-cols-12 justify-center gap-7">
//         {products.map((product, index) => (
//           <div
//             className="xl:col-span-3 lg:col-span-4 col-span-12 md:col-span-6 mb-2 lg:w-[300px] w-[350px] mx-auto lg:mx-0"
//             key={index}
//           >
//             <div className="product-card hover:bg-zinc-100 rounded-md shadow-lg shadow-black/10">
//               <div className="relative lg:w-full w-[350px] lg:h-[385px] h-[400px]">
//                 <span>
//                   <i className="z-20 fa-solid fa-heart text-xl pt-1 bg-white hover:bg-black hover:text-white w-11 h-11 flex items-center justify-center absolute top-3 right-6 btn invisible opacity-0 transition-opacity duration-300 rounded-full" />
//                 </span>
//                 <a href="#">
//                   <i className="z-20 fa-solid fa-arrow-right-arrow-left text-lg bg-white hover:bg-black hover:text-white w-11 h-11 flex items-center justify-center absolute top-[63px] right-6 btn invisible opacity-0 transition-opacity duration-300 rounded-full" />
//                 </a>

//                 <View id={product.id} />
//                 <Link to={`/product-detail/${product.id}`}>
//                   <div className="relative">
//                     <img
//                       src={product.anh_san_pham}
//                       alt=""
//                       className="lg:w-[300px] w-[500px] lg:h-[380px] h-[400px] rounded-t-md"
//                     />
//                   </div>
//                 </Link>
//               </div>

//               <Link to={`/product-detail/${product.id}`}>
//                 <div className="bg-slate-50 pt-4 px-4 rounded-md pb-2">
//                   <h5 className="text-base truncate w-60 font-medium">
//                     {product.ten_san_pham}
//                   </h5>

//                   <p className="font-semibold text-lg">
//                     {product.gia_thap_nhat === product.gia_cao_nhat ? (
//                       <>{(product.gia_cao_nhat ?? 0).toLocaleString("vi-VN")} đ</>
//                     ) : (
//                       <>
//                         {(product.gia_thap_nhat ?? 0).toLocaleString("vi-VN")} đ
//                         <i className="fa-solid fa-minus text-sm mx-1 text-slate-500"></i>
//                         {(product.gia_cao_nhat ?? 0).toLocaleString("vi-VN")} đ
//                       </>
//                     )}
//                   </p>

//                   <p className="font-bold text-lg flex items-center">
//                     {product.bien_the?.map((item, index) => (
//                       <button
//                         key={index}
//                         className="w-7 h-7 rounded-full border-1 inline-block mr-1"
//                         style={{
//                           backgroundColor: item.ma_mau_sac,
//                         }}
//                       />
//                     ))}
//                   </p>
//                 </div>
//               </Link>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default RelatedProducts;
import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import instance from "@/configs/client";
import View from "../../_component/View";

interface RelatedProduct {
  id: number;
  ten_san_pham: string;
  anh_san_pham: string;
  gia_thap_nhat: number;
  gia_cao_nhat: number;
  bien_the: Array<{
    ma_mau_sac: string;
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
  const { data: relatedProducts } = useQuery<{ data: RelatedProduct[] }>({
    queryKey: ["relatedProducts", productId],
    queryFn: () => fetchRelatedProducts(productId),
    enabled: !!productId,
  });

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
        {relatedProducts?.data?.map((product, index) => (
          <div
            className="xl:col-span-3 lg:col-span-4 col-span-12 md:col-span-6 mb-2 lg:w-[300px] w-[350px] mx-auto lg:mx-0"
            key={index}
          >
            <div className="product-card hover:bg-zinc-100 rounded-md shadow-lg shadow-black/10">
              <div className="relative lg:w-full w-[350px] lg:h-[385px] h-[400px]">
                <span>
                  <i className="z-20 fa-solid fa-heart text-xl pt-1 bg-white hover:bg-black hover:text-white w-11 h-11 flex items-center justify-center absolute top-3 right-6 btn invisible opacity-0 transition-opacity duration-300 rounded-full" />
                </span>
                <a href="#">
                  <i className="z-20 fa-solid fa-arrow-right-arrow-left text-lg bg-white hover:bg-black hover:text-white w-11 h-11 flex items-center justify-center absolute top-[63px] right-6 btn invisible opacity-0 transition-opacity duration-300 rounded-full" />
                </a>

                <Link to={`/product-detail/${product.id}`}>
                  <div className="relative">
                    <img
                      src={product.anh_san_pham}
                      alt=""
                      className="lg:w-[300px] w-[500px] lg:h-[380px] h-[400px] rounded-t-md"
                    />
                  </div>
                </Link>
                <View id={product?.id} />
              </div>

              <Link to={`/product-detail/${product.id}`}>
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
                    {product.bien_the?.map((item, index) => (
                      <button
                        key={index}
                        className="w-7 h-7 rounded-full border-1 inline-block mr-1"
                        style={{
                          backgroundColor: item.ma_mau_sac,
                        }}
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
