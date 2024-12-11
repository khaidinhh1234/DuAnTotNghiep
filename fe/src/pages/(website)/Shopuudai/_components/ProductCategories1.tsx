import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import instanceClient from "@/configs/client";
import { Slider } from "antd";
import ProductsList from "./ProductsList";
import Banner from "../../vourcher/_component/banner";

const ProductCategories = ({ handleWishlist, isPending }: any) => {
  const [showcate, setShowcate] = useState(true);
  const [showcolor, setShowcolor] = useState(true);
  const [showprice, setShowprice] = useState(true);
  const [showsize, setShowsize] = useState(true);
  const [parentIds, setParentIds] = useState<number[]>([]);
  const [childIds, setChildIds] = useState<number[]>([]);
  const [price, setPrice] = useState([0, 2000000]);
  const [selectedSize, setselectedSize] = useState<number[]>([]);
  const [selectedMau, setSelectedMau] = useState<number[]>([]);
  const [page, setPage] = useState(1);
  const { slug } = useParams();
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["PRODUCTSLOC"],
    queryFn: async () => {
      const response = await instanceClient.post(
        `chuong-trinh-uu-dai/${slug}`,
        {
          // danh_muc_ids: [...parentIds, ...childIds],
          mau_sac_ids: selectedMau,
          kich_thuoc_ids: selectedSize,
          gia_duoi: price[0],
          gia_tren: price[1],
          page,
        }
      );
      return response.data;
    },
  });

  const { mutate } = useMutation({
    mutationFn: async () => {
      const response = await instanceClient.post(
        `chuong-trinh-uu-dai/${slug}?page=${page}`,
        {
          // danh_muc_ids: [...parentIds, ...childIds],
          mau_sac_ids: selectedMau,
          kich_thuoc_ids: selectedSize,
          gia_duoi: price[0],
          gia_tren: price[1],
        }
      );
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["PRODUCTSLOC"], data);
    },
  });

  return (
    <div>
      <section>
        <div className="container">
        <Banner />

          <div className="flex flex-wrap items-start w-full mt-16">
            <button className="lg:hidden w-0.5/4 py-3 px-1 pl-4 mb-4 lg:mb-0">
              <i className="fa-solid fa-layer-group text-2xl hover:text-black text-gray-500"></i>
            </button>

            <div className="lg:block hidden w-1/5 py-4 mb-4 lg:mb-0 sticky top-20">
              {/* Categories */}
              {/* <div className="mb-5">
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => setShowcate(!showcate)}
                >
                  <h2 className="font-bold mb-2 text-lg">Danh mục sản phẩm</h2>
                  <button className="mr-3">
                    <i
                      className={`fa-solid fa-chevron-${showcate ? "up" : "down"}`}
                    ></i>
                  </button>
                </div>

                {showcate && (
                  <div className="mt-7">
                    {data?.data?.chuong_trinh?.danh_sach_loc?.original?.danhMuc?.map(
                      (category: any, index: number) => (
                        <div
                          key={index}
                          className="flex justify-between items-center my-4"
                        >
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={parentIds.includes(category.id)}
                              onChange={() => {
                                setParentIds((prev) =>
                                  prev.includes(category.id)
                                    ? prev.filter((id) => id !== category.id)
                                    : [...prev, category.id]
                                );
                                mutate();
                              }}
                              className="mr-2"
                            />
                            <span>{category.ten_danh_muc}</span>
                          </label>
                        </div>
                      )
                    )}
                  </div>
                )}
              </div> */}

              {/* Price Filter */}
              <div className="mb-5">
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => setShowprice(!showprice)}
                >
                  <h2 className="font-bold text-lg mb-2">Lọc Theo Giá</h2>
                  <button className="mr-3">
                    <i
                      className={`fa-solid fa-chevron-${showprice ? "up" : "down"}`}
                    ></i>
                  </button>
                </div>

                {showprice && (
                  <div>
                    <p className="my-4 font-medium">
                      Giá: {price[0].toLocaleString("vi-VN")}đ -{" "}
                      {price[1].toLocaleString("vi-VN")}đ
                    </p>
                    <div className="w-full">
                      <Slider
                        range
                        defaultValue={[0, 2000000]}
                        max={2000000}
                        onAfterChange={(value) => {
                          setPrice(value as [number, number]);
                          mutate();
                        }}
                        tipFormatter={(value) => `${value.toLocaleString()}đ`}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Color Filter */}
              <div className="mb-5">
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => setShowcolor(!showcolor)}
                >
                  <h2 className="font-bold text-lg mb-2">Lọc Theo Màu Sắc</h2>
                  <button className="mr-3">
                    <i
                      className={`fa-solid fa-chevron-${showcolor ? "up" : "down"}`}
                    ></i>
                  </button>
                </div>

                {showcolor && (
                  <div className="grid grid-cols-3 gap-4 mt-5 mb-12">
                    {data?.data?.chuong_trinh?.danh_sach_loc?.original?.mauSac?.map(
                      (color: any, index: number) => (
                        <div
                          key={index}
                          className="flex flex-col items-center cursor-pointer"
                          onClick={() => {
                            setSelectedMau((prev) =>
                              prev.includes(color.id)
                                ? prev.filter((id) => id !== color.id)
                                : [...prev, color.id]
                            );
                            mutate();
                          }}
                        >
                          <span
                            className={`w-7 h-7 inline-block rounded-full border-2 ${
                              selectedMau.includes(color.id)
                                ? "border-blue-400"
                                : "border-gray-300"
                            }`}
                            style={{ backgroundColor: color.ma_mau_sac }}
                          ></span>
                          <span className="mt-2 text-sm font-semibold">
                            {color.ten_mau_sac}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>

              {/* Size Filter */}
              <div className="mb-4 mr-3">
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => setShowsize(!showsize)}
                >
                  <h2 className="font-bold text-lg mb-2">Lọc Theo Kích Cỡ</h2>
                  <button>
                    <i
                      className={`fa-solid fa-chevron-${showsize ? "up" : "down"}`}
                    ></i>
                  </button>
                </div>

                {showsize && (
                  <div className="grid grid-cols-3 gap-2">
                    {data?.data?.chuong_trinh?.danh_sach_loc?.original?.kichThuoc?.map(
                      (size: any, index: number) => (
                        <div
                          key={index}
                          className={`flex items-center justify-center w-15 h-10 border rounded-lg cursor-pointer ${
                            selectedSize.includes(size.id)
                              ? "border-blue-500 bg-blue-100"
                              : "border-gray-300"
                          }`}
                          onClick={() => {
                            setselectedSize((prev) =>
                              prev.includes(size.id)
                                ? prev.filter((id) => id !== size.id)
                                : [...prev, size.id]
                            );
                            mutate();
                          }}
                        >
                          <span className="text-sm mr-1">
                            {size.kich_thuoc}
                          </span>
                          -
                          <span className="text-sm ml-1">
                            {size.loai_kich_thuoc === "nam"
                              ? "Nam"
                              : size.loai_kich_thuoc === "nu"
                                ? "Nữ"
                                : "Trẻ em"}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Product List */}
            <div className="sm:w-4/5 w-3/4 px-5">
              <ProductsList
                data={data?.data}
                onPage={setPage}
                products={data?.data?.chuong_trinh?.san_pham?.data}
                Wishlist={handleWishlist}
                isPending={isPending}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductCategories;
