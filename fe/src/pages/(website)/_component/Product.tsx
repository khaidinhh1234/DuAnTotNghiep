import React from "react";
import { Link } from "react-router-dom";
import View from "./View";
interface ProductProps {
  product: any;
  index?: any;
  hoveredProductId?: any;
  hoveredVariantIndex?: any;
  handleMouseEnter?: any;
  newProduct?: any;
  yeuthich?: any;
  prowish?: any;
}
const Product = ({
  product,
  hoveredProductId,
  hoveredVariantIndex,
  handleMouseEnter,
  newProduct,
  yeuthich,
  prowish,
}: ProductProps) => {
  return (
    <div>
      {" "}
      <div className="product-card hover:bg-zinc-100 rounded-md shadow-lg shadow-black/10">
        <div className="relative lg:w-full w-[350px] lg:h-[385px] h-[400px]">
          {yeuthich && (
            <span onClick={() => yeuthich(product?.id)}>
              <i
                className={`cursor-pointer text-red-500 z-10 fa-solid fa-trash text-xl pt-1 bg-white w-11 h-11 flex items-center justify-center absolute top-3 right-6 btn invisible opacity-0 transition-opacity duration-300 rounded-full`}
              />
            </span>
          )}{" "}
          {prowish !== undefined && (
            <span>
              <i
                className={`${
                  product?.yeu_thich
                    ? "text-red-500"
                    : "text-black hover:text-white"
                } z-10 fa-solid fa-heart text-xl pt-1 bg-white hover:bg-black w-11 h-11 flex items-center justify-center absolute top-3 right-6 btn invisible opacity-0 transition-opacity duration-300 rounded-full`}
              />
            </span>
          )}
          {/* <View id={product?.duong_dan} ID={product?.id} /> */}
          <Link to={`/product-detail/${product?.duong_dan}`}>
            <div className="relative">
              <img
                src={
                  hoveredProductId === product.id &&
                  hoveredVariantIndex !== null
                    ? product.mau_sac_va_anh[hoveredVariantIndex].hinh_anh
                    : product.anh_san_pham
                }
                // src={sanPham2}
                alt=""
                className="lg:w-[300px] w-[500px] lg:h-[380px] h-[400px] rounded-t-md"
              />
              {(newProduct ?? 0) === 1 && (
                <span className="absolute top-3 left-4 bg-red-500 text-white px-3 py-[2px] rounded-md font-bold">
                  Mới
                </span>
              )}
            </div>
          </Link>
          <View id={product?.duong_dan} ID={product?.id} />
        </div>
        <Link to={`/product-detail/${product?.duong_dan}`}>
          <div className="bg-slate-50 pt-4 px-4 rounded-md pb-2">
            <h5 className=" text-base truncate w-60 font-medium">
              {product?.ten_san_pham}
            </h5>
            <p className="font-semibold text-lg">
              {product?.gia_thap_nhat === product?.gia_cao_nhat ? (
                <>{(product?.gia_cao_nhat ?? 0).toLocaleString("vi-VN")} đ</>
              ) : (
                <>
                  {(product?.gia_thap_nhat ?? 0).toLocaleString("vi-VN")} đ
                  <i className="fa-solid fa-minus text-sm mx-1 text-slate-500"></i>
                  {(product?.gia_cao_nhat ?? 0).toLocaleString("vi-VN")} đ
                </>
              )}
            </p>

            <p className="font-bold text-lg flex items-center">
              {" "}
              {product?.mau_sac_va_anh?.map((item: any, indexs: any) => (
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
                  onMouseEnter={() => handleMouseEnter(product?.id, indexs)}
                />
              ))}
            </p>
          </div>{" "}
        </Link>
      </div>
    </div>
  );
};

export default Product;
