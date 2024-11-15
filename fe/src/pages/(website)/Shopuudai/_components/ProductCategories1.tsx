
import { sanPham2 } from "@/assets/img";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ProductsList from "./ProductsList";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import instanceClient from "@/configs/client";
import { Slider } from "antd";

const ProductCategories = ({ handleWishlist, isPending }: any) => {
  const [showcate, setShowcate] = useState(true);
  const [showcolor, setShowcolor] = useState(true);
  const [showprice, setShowprice] = useState(true);
  const [showsize, setShowsize] = useState(true);
  // lọc danh mục
  const [parentIds, setParentIds] = useState<number[]>([]);
  const [childIds, setChildIds] = useState<number[]>([]);
  // lọc giá
  const [price, setPrice] = useState([0, 1000000]);
  // size
  const [selectedSize, setselectedSize] = useState<number[]>([]);
  // console.log(selectedSize);
  // mau sac
  const [selectedMau, setSelectedMau] = useState<number[]>([]);
  // console.log(selectedMau);
  // mau sac
    const { slug,  } = useParams();

  const handleItemClick = (id: number) => {
    setSelectedMau(
      (prevSelectedSize) =>
        prevSelectedSize.includes(id)
          ? prevSelectedSize.filter((itemId) => itemId !== id) // Deselect if already clicked
          : [...prevSelectedSize, id] // Add to the list if not yet selected
    );
  };

  // size
  const handleCheckboxChange = (id: number) => {
    setselectedSize((prevSize) =>
      prevSize.includes(id)
        ? prevSize.filter((item) => item !== id)
        : [...prevSize, id]
    );
  }; //data
//  const { data: promotionalData } = useQuery({
//    queryKey: ["PROMOTIONAL", slug],
//    queryFn: async () => {
//     if (!slug) return null;
//      const response = await instanceClient.get(`chuong-trinh-uu-dai/${slug}`);
//     return response.data;
//   },
//    enabled: !!slug,
//  });
 const datas = {
  ...(parentIds.length > 0 && { danh_muc_cha_ids: [...parentIds] }),
  ...(childIds.length > 0 && { danh_muc_con_ids: [...childIds] }),
  ...(price.length > 0 && { gia_duoi: price[0] }),
  ...(price.length > 0 && { gia_tren: price[1] }),
  ...(selectedSize.length > 0 && { kich_thuoc_ids: [...selectedSize] }),
  ...(selectedMau.length > 0 && { mau_sac_ids: [...selectedMau] }),



};
  // console.log(datas);
  // lọc danh mục
  const [expanded, setExpanded] = useState<number[]>([]);
  const [parentChecked, setParentChecked] = useState<{
    [key: number]: boolean;
  }>({});
  const [childChecked, setChildChecked] = useState<{
    [key: number]: boolean[];
  }>({});
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

      const childIdsArray = children.map((child: any) => child.id);
      setChildIds((prevState) => [...prevState, ...childIdsArray]);
    } else {
      setParentIds((prevState) => prevState.filter((id) => id !== parentId));
      setChildChecked((prevState) => ({
        ...prevState,
        [index]: [],
      }));
      const childIdsArray = children.map((child: any) => child.id);
      setChildIds((prevState) =>
        prevState.filter((id) => !childIdsArray.includes(id))
      );
    }
  };
// toanmoi
  const handleChildChange = (
    parentIndex: number,
    childIndex: number,
    checked: boolean,
    childId: number,
    children: any[]
  ) => {
    // Cập nhật trạng thái checkbox của danh mục con
    const currentChildren = childChecked[parentIndex] || [];
    const updatedChildren = [...currentChildren];
    updatedChildren[childIndex] = checked;
    setChildChecked({ ...childChecked, [parentIndex]: updatedChildren });
  
    // Cập nhật trạng thái các ID của danh mục con
    if (checked) {
      setChildIds((prevState) => [...prevState, childId]);
    } else {
      setChildIds((prevState) => prevState.filter((id) => id !== childId));
    }
  
    // Cập nhật trạng thái checkbox của các item con con
    if (checked) {
      // Nếu item con được chọn, tất cả item con con cũng được chọn
      const grandchildIds = children[childIndex]?.children.map((child: any) => child.id);
      setGrandchildChecked((prev) => {
        const updatedChecked = { ...prev };
        if (!updatedChecked[parentIndex]) updatedChecked[parentIndex] = {};
        if (!updatedChecked[parentIndex][childIndex]) updatedChecked[parentIndex][childIndex] = {};
        grandchildIds.forEach((id: any) => {
          updatedChecked[parentIndex][childIndex][id] = true;
        });
        return updatedChecked;
      });
    } else {
      // Nếu item con bị bỏ chọn, tất cả item con con cũng bị bỏ chọn
      setGrandchildChecked((prev) => {
        const updatedChecked = { ...prev };
        if (updatedChecked[parentIndex] && updatedChecked[parentIndex][childIndex]) {
          Object.keys(updatedChecked[parentIndex][childIndex]).forEach((id) => {
            updatedChecked[parentIndex][childIndex][id] = false;
          });
        }
        return updatedChecked;
      });
    }
  
    // Nếu checkbox của danh mục con được bật, bật luôn checkbox của danh mục cha
    if (checked) {
      setParentChecked({ ...parentChecked, [parentIndex]: true });
    } else {
      // Nếu tất cả các danh mục con của danh mục cha đều tắt, tắt checkbox của danh mục cha
      const allChildrenUnchecked = !updatedChildren.some((checked) => checked);
      if (allChildrenUnchecked) {
        setParentChecked((prevState) => ({
          ...prevState,
          [parentIndex]: false,
        }));
      }
    }
  };



  const { data,  } = useQuery({
    queryKey: ["PRODUCTSLOC"],
    queryFn: async () => {
      try {
        const response = await instanceClient.post(`chuong-trinh-uu-dai/${slug}`, datas); // Gửi datas cho API
        if (response.data.status !== true) {
          throw new Error("Error fetching product");
        }
        return response.data;
        
      } catch (error) {
        throw new Error("Lỗi khi lấy thông tin");
      }
    },
  });
  // console.log("data", apiResponse?.chuong_trinh?.san_pham?.data);
  // danh mục
  const { data: locsanpham } = useQuery({
    queryKey: ["LOCSLIBAR"],
    queryFn: async () => {
      try {
        const response = await instanceClient.get("lay-dm-ms-kt");
        if (response.data.status_code !== 200) {
          throw new Error("Error fetching product");
        }
        return response.data;
      } catch (error) {
        throw new Error("Lỗi khi lấy thông tin");
      }
    },
  });

  const mau_sac = locsanpham?.mauSac;

  const sizes = locsanpham?.kichThuoc;
  // console.log(sizes);
  // lọc
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: async () => {
      try {
        const response = await instanceClient.post(
          `chuong-trinh-uu-dai/${slug}?page=${page}`,
          datas
        );
        if (response.data.status !== true) {
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
  const onPage = (page: number) => {
    setPage(page);
  };
  const danh_muc = locsanpham?.danhMucCha;
  const products = data?.data?.chuong_trinh?.san_pham?.data;

  // console.log(danh_muc);
  // console.log(products);
  useEffect(() => {
    if (
      parentIds.length >= 0 ||
      childIds.length >= 0 ||
      selectedSize.length >= 0 ||
      selectedMau.length >= 0
    ) {
      mutate(); // Gọi mutate khi có sự thay đổi
    }
  }, [parentIds, childIds, mutate, selectedSize, selectedMau, price, page]);
  // toanmoi
  const [grandchildChecked, setGrandchildChecked] = useState<
    { [key: string]: { [key: string]: { [key: string]: boolean } } }
  >({}); // Đây là trạng thái lưu trữ trạng thái của các checkbox cháu
  const handleGrandchildChange = (
    parentIndex: number,
    childIndex: number,
    grandchildIndex: number,
    isChecked: boolean,
    grandchildId: number
  ) => {
    setGrandchildChecked((prev) => {
      const updatedChecked = { ...prev };
      if (!updatedChecked[parentIndex]) updatedChecked[parentIndex] = {};
      if (!updatedChecked[parentIndex][childIndex]) updatedChecked[parentIndex][childIndex] = {};
      updatedChecked[parentIndex][childIndex][grandchildIndex] = isChecked;
      return updatedChecked;
    });
  
    // Cập nhật danh sách các ID của item con con
    if (isChecked) {
      setChildIds((prevState) => [...prevState, grandchildId]);
    } else {
      setChildIds((prevState) => prevState.filter((id) => id !== grandchildId));
    }
  };
  
  return (
    <div>
      {" "}
      <section>
        <div className="container">
          <div className="flex flex-wrap items-start w-full mt-16">
            {/* <!-- Sidebar Filters --> */}
            <button className="lg:hidden w-0.5/4 py-3 px-1 pl-4 mb-4 lg:mb-0">
              <i className="fa-solid fa-layer-group text-2xl hover:text-black text-gray-500"></i>
            </button>
            <div className="lg:block hidden w-1/5 py-4  mb-4 lg:mb-0    sticky top-20 ">
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
                                  handleParentChange(index, isChecked, item.children, item.id);
                                  isChecked && mutate(item.id);
                                }}
                              />
                              {item.ten_danh_muc}
                            </label>
                            <i
                              className={`fa-solid fa-plus mr-3 cursor-pointer ${expanded.includes(index) ? "rotate-45" : ""
                                }`}
                              onClick={() => toggleExpand(index)}
                            ></i>
                          </div>

                          {expanded.includes(index) &&
                            item.children.map((itemcon: any, indexCon: any) => (
                              <div key={indexCon} className="ml-4">
                                <div className="flex justify-between items-center my-4">
                                  <label className="flex">
                                    <input
                                      type="checkbox"
                                      className="mr-2"
                                      checked={childChecked[index]?.[indexCon] || false}
                                      disabled={!parentChecked[index]}
                                      onChange={(e) => {
                                        const isChecked = e.target.checked;
                                        handleChildChange(index, indexCon, isChecked, itemcon.id);
                                        isChecked && mutate(itemcon.id);
                                      }}
                                    />
                                    {itemcon.ten_danh_muc}
                                  </label>
                                  <i
                                    className={`fa-solid fa-plus mr-3 cursor-pointer ${expanded.includes(`${index}-${indexCon}`) ? "rotate-45" : ""
                                      }`}
                                    onClick={() => toggleExpand(`${index}-${indexCon}`)}
                                  ></i>
                                </div>
                                {/* Thêm cấp danh mục con của danh mục con */}
                                {expanded.includes(`${index}-${indexCon}`) &&
                                  itemcon.children?.map((itemconcon: any, indexConCon: any) => (
                                    <div
                                      className="flex justify-between items-center my-4 ml-8"
                                      key={indexConCon}
                                    >
                                      <label className="flex">
                                        <input
                                          type="checkbox"
                                          className="mr-2"
                                          checked={
                                            grandchildChecked[index]?.[indexCon]?.[indexConCon] || false
                                          }
                                          disabled={!childChecked[index]?.[indexCon]}
                                          onChange={(e) => {
                                            const isChecked = e.target.checked;
                                            handleGrandchildChange(
                                              index,
                                              indexCon,
                                              indexConCon,
                                              isChecked,
                                              itemconcon.id
                                            );
                                            isChecked && mutate(itemconcon.id);
                                          }}
                                        />
                                        {itemconcon.ten_danh_muc}
                                      </label>
                                    </div>
                                  ))}
                              </div>
                            ))}

                        </div>
                      ))}

                    </>
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
                        onAfterChange={(value) => {
                          setPrice(value as [number, number]);
                          mutate();
                        }}
                        tipFormatter={(value: any) =>
                          `${value.toLocaleString()} đ`
                        }
                      />
                    </div>{" "}
                  </div>
                ) : null}
              </div>
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
                  <div className="grid grid-cols-3 gap-4 mt-5 mb-12">
                    {mau_sac?.map((item: any, index: number) => (
                      <div
                        key={index}
                        className="flex flex-col items-center cursor-pointer"
                        onClick={() => handleItemClick(item.id)}
                      >
                        <span
                          className={`w-7 h-7 inline-block rounded-full border-2 ${
                            selectedMau.includes(item.id)
                              ? "border-blue-400"
                              : "border-gray-300"
                          }`}
                          style={{ backgroundColor: item.ma_mau_sac }}
                        ></span>
                        <span className="mt-2 text-sm font-semibold">
                          {item.ten_mau_sac}
                        </span>
                      </div>
                    ))}
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
                  <div className="grid grid-cols-3 gap-2">
                    {sizes?.map((item: any, index: any) => (
                      <div
                        key={index}
                        className={`flex items-center justify-center w-15 h-10 border rounded-lg cursor-pointer ${
                          selectedSize.includes(item.id)
                            ? "border-blue-500 bg-blue-100"
                            : "border-gray-300"
                        }`}
                        onClick={() => handleCheckboxChange(item.id)}
                      >
                        <span className="text-sm mr-1">{item.kich_thuoc}</span>-

                        <span className="text-sm ml-1">  {item.loai_kich_thuoc === "nam"
                            ? "Nam"
                            : item.loai_kich_thuoc === "nu"
                              ? "Nữ"
                              : "Trẻ em"}</span>

                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
            {/* <!-- Product Listings --> */}
            <div className="sm:w-4/5 w-3/4 px-5">
              <ProductsList
                data={data}
                onPage={onPage}
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
