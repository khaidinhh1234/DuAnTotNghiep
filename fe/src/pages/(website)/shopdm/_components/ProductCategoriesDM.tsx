import instanceClient from "@/configs/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { message, Slider } from "antd";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ProductsListDM from "./ProductListDm";
import { useDebounce } from "use-debounce";
const ProductCategoriesDM = ({ isPending }: any) => {
  const [showcate, setShowcate] = useState(true);
  const [showcolor, setShowcolor] = useState(true);
  const [showprice, setShowprice] = useState(true);
  const [showsize, setShowsize] = useState(true);
  // lọc danh mục
  const [selectedParentIds, setSelectedParentIds] = useState<number[]>([]);
  const [selectedChildIds, setSelectedChildIds] = useState<number[]>([]);
  const [selectedGrandchildIds, setSelectedGrandchildIds] = useState<number[]>(
    []
  );

  // lọc giá
  const [price, setPrice] = useState([0, 1000000]);
  // size
  const [selectedSize, setselectedSize] = useState<number[]>([]);
  // mau sac
  const [selectedMau, setSelectedMau] = useState<number[]>([]);
  // mau sac
  const handleItemClick = (id: number) => {
    setSelectedMau((prevSelectedSize) =>
      prevSelectedSize.includes(id)
        ? prevSelectedSize.filter((itemId) => itemId !== id)
        : [...prevSelectedSize, id]
    );
  };
  // size
  const handleCheckboxChange = (id: number) => {
    setselectedSize((prevSize) =>
      prevSize.includes(id)
        ? prevSize.filter((item) => item !== id)
        : [...prevSize, id]
    );
  };
  const { tenDanhMucCha, tenDanhMucCon, tenDanhMucConCapBa } = useParams();
  //data
  const datas = useMemo(() => {
    return {
      ...(selectedParentIds.length > 0 && {
        danh_muc_con_ids: selectedParentIds,
      }),
      ...(selectedChildIds.length > 0 && {
        danh_muc_chau_ids: selectedChildIds,
      }),
      ...(price.length > 0 && { gia_duoi: price[0], gia_tren: price[1] }),
      ...(selectedSize.length > 0 && { kich_thuoc_ids: selectedSize }),
      ...(selectedMau.length > 0 && { mau_sac_ids: selectedMau }),
    };
  }, [selectedParentIds, selectedChildIds, price, selectedSize, selectedMau]);

  const danhmuc = tenDanhMucConCapBa
    ? tenDanhMucConCapBa
    : tenDanhMucCon
      ? tenDanhMucCon
      : tenDanhMucCha;
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
      setSelectedParentIds((prev) => [...prev, parentId]);
      const childIds = children.map((child: any) => child.id);
      setSelectedChildIds((prev) => [...prev, ...childIds]);

      const allCheckedChildren = children.map(() => true);
      setChildChecked((prevState) => ({
        ...prevState,
        [index]: allCheckedChildren,
      }));
    } else {
      setSelectedParentIds((prev) => prev.filter((id) => id !== parentId));
      const childIds = children.map((child: any) => child.id);
      setSelectedChildIds((prev) =>
        prev.filter((id) => !childIds.includes(id))
      );

      setChildChecked((prevState) => ({ ...prevState, [index]: [] }));
    }
  };
  // toanmoi
  const handleChildChange = (
    parentIndex: number,
    childIndex: number,
    checked: boolean,
    childId: number,
    grandchildren: any[]
  ) => {
    // Cập nhật trạng thái của con
    setChildChecked((prev) => ({
      ...prev,
      [parentIndex]: {
        ...prev[parentIndex],
        [childIndex]: checked,
      },
    }));
    // Cập nhật danh sách con được chọn
    if (checked) {
      setSelectedChildIds((prev) => [...prev, childId]);
      const grandchildIds = grandchildren.map(
        (grandchild: any) => grandchild.id
      );
      setSelectedGrandchildIds((prev) => [...prev, ...grandchildIds]);
      // Đảm bảo cha được chọn
      setParentChecked((prevState) => ({
        ...prevState,
        [parentIndex]: true,
      }));
      setSelectedParentIds((prev) => {
        if (!prev.includes(parentIndex)) {
          return [...prev, parentIndex];
        }
        return prev;
      });
    } else {
      // Bỏ chọn con
      setSelectedChildIds((prev) => prev.filter((id) => id !== childId));
      const grandchildIds = grandchildren.map(
        (grandchild: any) => grandchild.id
      );
      setSelectedGrandchildIds((prev) =>
        prev.filter((id) => !grandchildIds.includes(id))
      );
      // Kiểm tra nếu không còn con nào được chọn, bỏ chọn cha
      setChildChecked((prev) => {
        const allChildrenUnchecked = Object.values(
          prev[parentIndex] || {}
        ).every((isChecked) => !isChecked);

        if (allChildrenUnchecked) {
          setParentChecked((prevState) => ({
            ...prevState,
            [parentIndex]: false,
          }));
          setSelectedParentIds((prev) =>
            prev.filter((id) => id !== parentIndex)
          );
        }
        return prev;
      });
    }
  };
  const nav = useNavigate();
  const { data, refetch: refetch2 } = useQuery({
    queryKey: [
      "PRODUCTS_KEY",
      tenDanhMucCha,
      tenDanhMucCon,
      tenDanhMucConCapBa,
      danhmuc,
    ],
    queryFn: async () => {
      try {
        if (tenDanhMucCha || tenDanhMucCon || tenDanhMucConCapBa) {
          let url = "danhmuc";
          if (tenDanhMucConCapBa) url += `/${tenDanhMucConCapBa}`;
          else if (tenDanhMucCon) url += `/${tenDanhMucCon}`;
          else if (tenDanhMucCha) url += `/${tenDanhMucCha}`;
          const response = await instanceClient.post(url, datas);
          return response.data;
        } else if (danhmuc) {
          const response = await instanceClient.get(
            `lay-dm-ms-kt?loai=${danhmuc}`
          );
          if (response.data.status_code !== 200) {
            throw new Error("Error fetching product");
          }
          return response.data;
        } else {
          throw new Error("Không có danh mục hợp lệ");
        }
      } catch (error) {
        message.error("Lỗi khi lấy thông tin sản phẩm");
      }
    },
    options: {
      staleTime: 5 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
      enabled:
        !!tenDanhMucCha || !!tenDanhMucCon || !!tenDanhMucConCapBa || !!danhmuc,
    },
  });
  const products = data?.data?.san_pham.data;
  const queryClient = useQueryClient();
  const { data: locsanpham, refetch } = useQuery({
    queryKey: ["PRODUCTS_KEY"],
    queryFn: async () => {
      try {
        const response = await instanceClient.get(
          `lay-dm-ms-kt?loai=${danhmuc}`
        );
        if (response.data.status_code !== 200) {
          throw new Error("Error fetching product");
        }
        return response.data;
      } catch (error) {
        throw new Error("Lỗi khi lấy thông tin");
      }
    },
    options: {
      staleTime: 5 * 60 * 1000, // Cache stale trong 5 phút
      cacheTime: 10 * 60 * 1000, // Cache giữ lại trong 10 phút
      enabled: !!danhmuc && !!datas,
    },
  });

  useEffect(() => {
    refetch();
    refetch2();
    datas;
  }, [danhmuc, refetch, refetch2, datas]);
  const mau_sac = locsanpham?.mauSac;
  const sizes = locsanpham?.kichThuoc;
  // lọc
  const [page, setPage] = useState(1);
  useEffect(() => {
    const isInDanhMucPage =
      tenDanhMucCha || tenDanhMucCon || tenDanhMucConCapBa;

    if (
      selectedParentIds.length > 0 ||
      selectedChildIds.length > 0 ||
      selectedGrandchildIds.length > 0 ||
      selectedSize.length > 0 ||
      selectedMau.length > 0 ||
      price.length > 0
    ) {
      if (isInDanhMucPage) {
      } else {
        // LOCMUTATE();
      }
    }
  }, [
    selectedParentIds,
    selectedChildIds,
    selectedGrandchildIds,
    selectedSize,
    selectedMau,
    price,
    page,
  ]);
  const onPage = (page: number) => {
    setPage(page);
  };
  const danh_muc = locsanpham?.danhMucCap2;

  // toanmoi
  const [grandchildChecked, setGrandchildChecked] = useState<{
    [key: string]: { [key: string]: { [key: string]: boolean } };
  }>({}); // Đây là trạng thái lưu trữ trạng thái của các checkbox cháu
  const handleGrandchildChange = (
    parentIndex: number,
    childIndex: number,
    grandchildIndex: number,
    checked: boolean,
    grandchildId: number
  ) => {
    setGrandchildChecked((prev) => ({
      ...prev,
      [parentIndex]: {
        ...prev[parentIndex],
        [childIndex]: {
          ...(prev[parentIndex]?.[childIndex] || {}), // Khởi tạo nếu chưa tồn tại
          [grandchildIndex]: checked,
        },
      },
    }));

    if (checked) {
      setSelectedGrandchildIds((prev) => [...prev, grandchildId]);
    } else {
      setSelectedGrandchildIds((prev) =>
        prev.filter((id) => id !== grandchildId)
      );
    }
  };

  //   1233412312
  return (
    <div>
      {" "}
      <section>
        <div className="container">
          <div className="flex flex-wrap items-start w-full mt-5">
            {/* <!-- Sidebar Filters --> */}
            <button
              className="lg:hidden w-0.5/4 py-3 px-1 pl-4 mb-4 lg:mb-0"
              title="Toggle Filters"
            >
              <i className="fa-solid fa-layer-group text-2xl hover:text-black text-gray-500"></i>
            </button>
            <div className="lg:block hidden w-1/5 py-4  mb-4 lg:mb-0    sticky top-20 ">
              {/* <!-- Product Categories --> */}
              <div className="mb-5">
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => setShowcate(!showcate)}
                >
                  <h2 className="font-bold mb-2 text-lg normal-case">
                    Danh mục{" "}
                    {data?.data?.danh_muc?.ten_danh_muc ?? "Không xác định"}
                  </h2>
                  <button className="mr-3">
                    {showcate ? (
                      <i className="fa-solid fa-chevron-up"></i>
                    ) : (
                      <i className="fa-solid fa-chevron-down"></i>
                    )}
                  </button>
                </div>
                {showcate ? (
                  <div className="mt-7 capitalize">
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
                                // isChecked && mutate(item.id);
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
                          item.children?.map((itemcon: any, indexCon: any) => (
                            <div key={indexCon} className="ml-4">
                              <div className="flex justify-between items-center my-4">
                                <label className="flex">
                                  <input
                                    type="checkbox"
                                    className="mr-2"
                                    checked={
                                      childChecked[index]?.[indexCon] || false
                                    }
                                    // disabled={!parentChecked[index]}
                                    onChange={(e) => {
                                      const isChecked = e.target.checked;
                                      handleChildChange(
                                        index,
                                        indexCon,
                                        isChecked,
                                        itemcon.id,
                                        itemcon.children
                                      );
                                      // isChecked && mutate(itemcon.id);
                                    }}
                                  />
                                  {itemcon.ten_danh_muc}
                                </label>
                                <i
                                  className={`fa-solid fa-plus mr-3 cursor-pointer ${
                                    expanded.includes(
                                      `${index}-${indexCon}` as any
                                    )
                                      ? "rotate-45"
                                      : ""
                                  }`}
                                  onClick={() =>
                                    toggleExpand(`${index}-${indexCon}` as any)
                                  }
                                ></i>
                              </div>

                              {expanded.includes(
                                `${index}-${indexCon}` as any
                              ) &&
                                itemcon.children?.map(
                                  (itemconcon: any, indexConCon: any) => (
                                    <div
                                      className="flex justify-between items-center my-4 ml-8"
                                      key={indexConCon}
                                    >
                                      <label className="flex">
                                        <input
                                          type="checkbox"
                                          className="mr-2"
                                          checked={
                                            grandchildChecked[index]?.[
                                              indexCon
                                            ]?.[indexConCon] || false
                                          }
                                          disabled={
                                            !childChecked[index]?.[indexCon]
                                          }
                                          onChange={(e) => {
                                            const isChecked = e.target.checked;
                                            handleGrandchildChange(
                                              index,
                                              indexCon,
                                              indexConCon,
                                              isChecked,
                                              itemconcon.id
                                            );
                                            // isChecked && mutate(itemconcon.id);
                                          }}
                                        />
                                        {itemconcon.ten_danh_muc}
                                      </label>
                                    </div>
                                  )
                                )}
                            </div>
                          ))}
                      </div>
                    ))}
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
                          // mutate();
                        }}
                        tipFormatter={(value: any) =>
                          `${value.toLocaleString()} đ`
                        }
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
                        <span className="text-sm ml-1">
                          {" "}
                          {item.loai_kich_thuoc === "nam"
                            ? "Nam"
                            : item.loai_kich_thuoc === "nu"
                              ? "Nữ"
                              : "Trẻ em"}
                        </span>{" "}
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
            {/* <!-- Product Listings --> */}
            <div className="sm:w-4/5 w-3/4 px-5">
              <ProductsListDM data={data} onPage={onPage} products={products} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductCategoriesDM;
