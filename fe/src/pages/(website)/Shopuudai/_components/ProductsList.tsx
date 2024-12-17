import type { PaginationProps } from "antd";
import { Pagination } from "antd";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import View from "../../_component/View";
import instanceClient from "@/configs/client";
import Product from "../../_component/Product";
const ProductsList = ({ products, Wishlist, isPending, data, onPage }: any) => {
  const [hoveredProductId, setHoveredProductId] = useState<number | null>(null);
  const [hoveredVariantIndex, setHoveredVariantIndex] = useState<number | null>(
    null
  );
  const handleMouseEnter = (productId: number, variantIndex: any) => {
    setHoveredProductId(productId);
    setHoveredVariantIndex(variantIndex);
  };

  const handleWishlist = (id: any) => {
    Wishlist(id) as any;
  };
  const itemRender: PaginationProps["itemRender"] = (
    _,
    type,
    originalElement
  ) => {
    if (type === "prev") {
      return <a>Trước</a>;
    }
    if (type === "next") {
      return <a>Tiếp</a>;
    }

    return originalElement;
  };
  const [currentPage, setCurrentPage] = useState(data?.current_page ?? 1); // Trang hiện tại
  const [pageSize, setPageSize] = useState(data?.per_page); // Số lượng sản phẩm mỗi trang

  const onChange = (page: number, pageSize: number) => {
    setCurrentPage(page);
    setPageSize(pageSize);
    onPage(page);
    // console.log(`Page: ${page}, PageSize: ${pageSize}`);
    // Thực hiện xử lý dữ liệu dựa trên trang và số lượng sản phẩm mỗi trang
  };

  return (
    <>
      <div className="flex justify-between sm:items-center items-start mb-4  overflow-hidden">
        <div className="sm:flex items-center mt-2">
          <div className="mx-5">
            <p className="text-gray-700">{products?.length ?? 0} sản phẩm</p>
          </div>
        </div>
        <div className="w-0.5/4 sm:text-base text-sm flex items-center">
          {/* Short by latest <i className="fa-solid fa-chevron-down pl-1"></i> */}
        </div>
      </div>
      <section className="">
        <div className="container">
          <div className="grid grid-cols-9 justify-center lg:gap-20 gap-14 mx-auto">
            {products && products.length !== 0 ? (
              products.map((product: any, index: any) => (
                <div
                  className="xl:col-span-3 lg:col-span-4 col-span-12 md:col-span-6  lg:w-[300px] w-[350px] mx-auto lg:mx-0"
                  key={index}
                >
                  {" "}
                  <Product
                    product={product}
                    handleMouseEnter={handleMouseEnter}
                    hoveredProductId={hoveredProductId}
                    hoveredVariantIndex={hoveredVariantIndex}
                    index={index}
                    prowish={product?.trang_thai_yeu_thich}
                    newProduct={product?.hang_moi}
                    
                  />
                </div>
              ))
            ) : (
              <>
                <div className="w-full flex flex-col items-center justify-center col-span-12">
                  <img
                    src="https://res.cloudinary.com/dcvu7e7ps/image/upload/v1729832531/m5xu2paczoiy6rmlu4vm.png"
                    alt="No products"
                    className="w-[500px] mb-4" // Add margin-bottom to space the text from the image
                  />
                  <span className="text-center font-bold text-2xl text-yellow-500 ">
                    Không có sản phẩm nào
                  </span>
                </div>
              </>
            )}
          </div>

          {/* <!-- Pagination --> */}
          <div className="flex justify-end mt-10">
            <Pagination
              total={data?.data?.total ?? 0}
              current={currentPage}
              pageSize={pageSize}
              itemRender={itemRender}
              onChange={onChange}
            />
            {/* {hasNextPage && (
        <button onClick={() => fetchNextPage()}>Tải thêm đơn hàng</button>
      )} */}
          </div>
        </div>
      </section>
    </>
  );
};

export default ProductsList;
