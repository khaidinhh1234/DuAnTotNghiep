import { sanPham2 } from "@/assets/img";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductsList from "./ProductsList";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import instanceClient from "@/configs/client";
import { Slider } from "antd";

const ProductCategories = ({ handleWishlist, isPending }: any) => {
  const [parentIds, setParentIds] = useState<number[]>([]);
  // console.log(parentIds);
  const [childIds, setChildIds] = useState<number[]>([]);
  const [price, setPrice] = useState([0, 1000000]);

  const [showcate, setShowcate] = useState(true);
  const [showcolor, setShowcolor] = useState(false);
  const [showprice, setShowprice] = useState(false);
  const [showsize, setShowsize] = useState(false);
  // console.log(childIds);
  // Removed unused variable and fixed condition
  const datas = {
    // danh_muc_cha_ids: [...parentIds],
    ...(parentIds.length > 0 && { danh_muc_cha_ids: [...parentIds] }),
    ...(childIds.length > 0 && { danh_muc_con_ids: [...childIds] }),
    ...(price.length > 0 && { gia_duoi: price[0] }),
    ...(price.length > 0 && { gia_tren: price[1] }),
  };
  console.log(datas);
  const [expanded, setExpanded] = useState<number[]>([]);
  const [parentChecked, setParentChecked] = useState<{
    [key: number]: boolean;
  }>({});
  const [childChecked, setChildChecked] = useState<{
    [key: number]: boolean[];
  }>({});

  // Arrays to store selected parent and child IDs

  const toggleExpand = (index: number) => {
    if (expanded.includes(index)) {
      setExpanded(expanded.filter((i) => i !== index));
    } else {
      setExpanded([...expanded, index]);
    }
  };

  const handleParentChange = (
    index: number,
    checked: boolean,
    children: any[],
    parentId: number
  ) => {
    setParentChecked((prevState) => ({ ...prevState, [index]: checked }));

    if (checked) {
      setParentIds((prevState) => [...prevState, parentId]);
      const allCheckedChildren = children.map(() => true);
      setChildChecked((prevState) => ({
        ...prevState,
        [index]: allCheckedChildren,
      }));
      // Add all children IDs to childIds when parent is selected
      const childIdsArray = children.map((child: any) => child.id);
      setChildIds((prevState) => [...prevState, ...childIdsArray]);
    } else {
      setParentIds((prevState) => prevState.filter((id) => id !== parentId));
      setChildChecked((prevState) => ({
        ...prevState,
        [index]: [],
      }));
      // Remove all children IDs from childIds when parent is deselected
      const childIdsArray = children.map((child: any) => child.id);
      setChildIds((prevState) =>
        prevState.filter((id) => !childIdsArray.includes(id))
      );
    }
  };

  const handleChildChange = (
    parentIndex: number,
    childIndex: number,
    checked: boolean,
    childId: number
  ) => {
    const currentChildren = childChecked[parentIndex] || [];
    const updatedChildren = [...currentChildren];
    updatedChildren[childIndex] = checked;

    setChildChecked({ ...childChecked, [parentIndex]: updatedChildren });

    if (checked) {
      setChildIds((prevState) => [...prevState, childId]);
      setParentChecked({ ...parentChecked, [parentIndex]: true });
    } else {
      setChildIds((prevState) => prevState.filter((id) => id !== childId));
    }
  };

  // list All products
  const { data, refetch } = useQuery({
    queryKey: ["PRODUCTSLOC"],
    queryFn: async () => {
      try {
        const response = await instanceClient.post("loc-san-pham", datas); // Gửi datas cho API
        if (response.data.status_code !== 200) {
          throw new Error("Error fetching product");
        }
        return response.data;
      } catch (error) {
        throw new Error("Lỗi khi lấy thông tin");
      }
    },
  });
  // console.log("data", data);
  const { data: danhmuc } = useQuery({
    queryKey: ["DANHMUCCLIENT"],
    queryFn: async () => {
      try {
        const response = await instanceClient.get("load-danh-muc");
        if (response.data.status_code !== 200) {
          throw new Error("Error fetching product");
        }
        return response.data;
      } catch (error) {
        throw new Error("Lỗi khi lấy thông tin");
      }
    },
  });
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: async () => {
      try {
        const response = await instanceClient.post("loc-san-pham", datas);
        if (response.data.status_code !== 200) {
          throw new Error("Error fetching product");
        }
        return response.data;
      } catch (error) {
        throw new Error("Lỗi khi lấy thông tin");
      }
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["PRODUCTSLOC"], data);
    },
  });
  const danh_muc = danhmuc?.data;
  // console.log(danh_muc);
  const products = data?.data?.data;
  // console.log(products);
  useEffect(() => {
    if (parentIds.length >= 0 || childIds.length >= 0) {
      mutate(); // Gọi mutate khi có sự thay đổi
    }
  }, [parentIds, childIds, mutate]);
  return (
    <div>
      {" "}
      <section>
        <div className="container">
          <div className="flex flex-wrap items-start w-full">
            {/* <!-- Sidebar Filters --> */}
            <button className="lg:hidden w-0.5/4 py-3 px-1 pl-4 mb-4 lg:mb-0">
              <i className="fa-solid fa-layer-group text-2xl hover:text-black text-gray-500"></i>
            </button>
            <div className="lg:block hidden w-1/5 py-4  mb-4 lg:mb-0">
              {/* <!-- Product Categories --> */}
              <div className="mb-5">
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => setShowcate(!showcate)}
                >
                  <h2 className="font-bold mb-2 text-lg">Danh mục sản phẩm</h2>
                  <button className="mr-3">
                    {showcate ? (
                      <i className="fa-solid fa-chevron-up"></i>
                    ) : (
                      <i className="fa-solid fa-chevron-down"></i>
                    )}
                  </button>
                </div>
                {showcate ? (
                  <div className="mt-7">
                    <>
                      {danh_muc?.map((item: any, index: any) => (
                        <div key={index}>
                          <div className="flex justify-between items-center my-4">
                            <label className="flex">
                              <input
                                type="checkbox"
                                className="mr-2"
                                checked={parentChecked[index] || false}
                                onChange={(e) => {
                                  const isChecked = e.target.checked;
                                  handleParentChange(
                                    index,
                                    isChecked,
                                    item.children,
                                    item.id
                                  );
                                  isChecked && mutate(item.id);
                                }}
                              />
                              {item.ten_danh_muc}
                            </label>
                            <i
                              className={`fa-solid fa-plus mr-3 cursor-pointer ${
                                expanded.includes(index) ? "rotate-45" : ""
                              }`}
                              onClick={() => toggleExpand(index)}
                            ></i>
                          </div>

                          {expanded.includes(index) &&
                            item.children.map((itemcon: any, indexCon: any) => (
                              <div
                                className="flex justify-between items-center my-4 ml-4"
                                key={indexCon}
                              >
                                <label className="flex">
                                  <input
                                    type="checkbox"
                                    className="mr-2"
                                    checked={
                                      childChecked[index]?.[indexCon] || false
                                    }
                                    disabled={!parentChecked[index]}
                                    onChange={(e) => {
                                      const isChecked = e.target.checked;
                                      handleChildChange(
                                        index,
                                        indexCon,
                                        isChecked,
                                        itemcon.id
                                      );
                                      isChecked && mutate(itemcon.id);
                                    }}
                                  />
                                  {itemcon.ten_danh_muc}
                                </label>
                              </div>
                            ))}
                        </div>
                      ))}
                    </>
                    {/* <div className="flex justify-between items-center my-4">
                      <label className="flex">
                        <input type="checkbox" className="mr-2" /> Nữ
                      </label>
                      <i className="fa-solid fa-plus mr-3"></i>
                    </div>
                    <div className="flex justify-between items-center my-4">
                      <label className="flex">
                        <input type="checkbox" className="mr-2" /> Trẻ em
                      </label>
                      <i className="fa-solid fa-plus mr-3"></i>
                    </div> */}
                  </div>
                ) : null}
              </div>

              {/* <!-- Filter by Price --> */}
              <div className="mb-5">
                <div
                  className=" flex justify-between items-center cursor-pointer"
                  onClick={() => setShowprice(!showprice)}
                >
                  <h2 className="font-bold text-lg mb-2">Lọc Theo Giá</h2>
                  <button className="mr-3">
                    {showprice ? (
                      <i className="fa-solid fa-chevron-up"></i>
                    ) : (
                      <i className="fa-solid fa-chevron-down"></i>
                    )}
                  </button>
                </div>

                {showprice ? (
                  <div>
                    <p className="my-4 font-medium">
                      Giá :{price[0].toLocaleString("vi-VN")}đ -{" "}
                      {price[1].toLocaleString("vi-VN")} đ
                    </p>
                    <div className="w-full">
                      <Slider
                        range
                        defaultValue={[0, 1000000]}
                        max={1000000}
                        onChange={(value) =>
                          setPrice(value as [number, number])
                        }
                        tipFormatter={(value: any) =>
                          `${value.toLocaleString()} đ`
                        } // Định dạng số với dấu phẩy
                      />
                    </div>{" "}
                  </div>
                ) : null}
              </div>

              {/* <!-- Filter by Color --> */}
              <div className="mb-5">
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => setShowcolor(!showcolor)}
                >
                  <h2 className="font-bold text-lg mb-2">Lọc Theo Màu Sắc</h2>
                  <button className="mr-3">
                    {showcolor ? (
                      <i className="fa-solid fa-chevron-up"></i>
                    ) : (
                      <i className="fa-solid fa-chevron-down"></i>
                    )}
                  </button>
                </div>
                {showcolor ? (
                  <div className="flex flex-col mb-12">
                    <div className="flex justify-between items-center mt-3">
                      <div className="flex items-center font-semibold">
                        <span className="w-6 h-6  bg-red-500 inline-block mr-2 rounded-[4px]"></span>
                        <span>Red</span>
                      </div>
                      <span className="px-3"> (10)</span>
                    </div>
                    <div className="flex justify-between items-center mt-3">
                      <div className="flex items-center font-semibold">
                        <span className="w-6 h-6 bg-blue-500 inline-block mr-2 rounded-[4px]"></span>
                        <span>Blue </span>
                      </div>
                      <span className="px-3"> (14)</span>
                    </div>
                    <div className="flex justify-between items-center mt-3">
                      <div className="flex items-center font-semibold">
                        <span className="w-6 h-6 bg-orange-500 inline-block mr-2 rounded-[4px]"></span>
                        <span>Orange </span>
                      </div>
                      <span className="px-3"> (8)</span>
                    </div>
                    <div className="flex justify-between items-center mt-3">
                      <div className="flex items-center font-semibold">
                        <span className="w-6 h-6 bg-black inline-block mr-2 rounded-[4px]"></span>
                        <span>Black </span>
                      </div>
                      <span className="px-3"> (9)</span>
                    </div>
                    <div className="flex justify-between items-center mt-3">
                      <div className="flex items-center font-semibold">
                        <span className="w-6 h-6 bg-green-500 inline-block mr-2 rounded-[4px]"></span>
                        <span>Green </span>
                      </div>
                      <span className="px-3"> (4)</span>
                    </div>
                    <div className="flex justify-between items-center mt-3">
                      <div className="flex items-center font-semibold">
                        <span className="w-6 h-6 bg-yellow-500 inline-block mr-2 rounded-[4px]"></span>
                        <span>Yellow </span>
                      </div>
                      <span className="px-3"> (2)</span>
                    </div>
                  </div>
                ) : null}
              </div>

              {/* <!-- Filter by Size --> */}
              <div className="mb-4 mr-3">
                <div
                  className="flex justify-between items-center"
                  onClick={() => setShowsize(!showsize)}
                >
                  <h2 className="font-bold text-lg mb-2">Lọc Theo Kích Cỡ</h2>
                  {showsize ? (
                    <i className="fa-solid fa-chevron-up"></i>
                  ) : (
                    <i className="fa-solid fa-chevron-down"></i>
                  )}
                </div>
                {showsize ? (
                  <div>
                    <div className="flex justify-between items-center my-4 ">
                      <label className="flex font-normal">
                        <input type="checkbox" className="mr-2" /> S
                      </label>
                      <span>(6)</span>
                    </div>
                    <div className="flex justify-between items-center my-4">
                      <label className="flex font-normal">
                        <input type="checkbox" className="mr-2" /> M
                      </label>
                      <span>(20)</span>
                    </div>
                    <div className="flex justify-between items-center my-4">
                      <label className="flex font-normal">
                        <input type="checkbox" className="mr-2" /> L
                      </label>
                      <span>(7)</span>
                    </div>
                    <div className="flex justify-between items-center my-4">
                      <label className="flex font-normal">
                        <input type="checkbox" className="mr-2" /> XL
                      </label>
                      <span>(16)</span>
                    </div>
                    <div className="flex justify-between items-center my-4">
                      <label className="flex font-normal">
                        <input type="checkbox" className="mr-2" /> XXL
                      </label>
                      <span>(10)</span>
                    </div>
                    <div className="flex justify-between items-center my-4">
                      <label className="flex font-normal">
                        <input type="checkbox" className="mr-2" /> XXXL
                      </label>
                      <span>(2)</span>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
            {/* <!-- Product Listings --> */}
            <div className="sm:w-4/5 w-3/4 px-5">
              <ProductsList
                products={products}
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
