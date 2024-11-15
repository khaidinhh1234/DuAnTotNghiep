import instanceClient from "@/configs/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Slider } from "antd";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import ProductsListDM from "./ProductListDm";

const ProductCategoriesDM = ({ handleWishlist, isPending }: any) => {
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

  console.log(selectedParentIds);

  console.log(selectedChildIds);
  console.log(selectedGrandchildIds);
  // lọc giá
  const [price, setPrice] = useState([0, 1000000]);
  // size
  const [selectedSize, setselectedSize] = useState<number[]>([]);
  console.log(selectedSize);
  // mau sac
  const [selectedMau, setSelectedMau] = useState<number[]>([]);
  console.log(selectedMau);
  // mau sac
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
  };

  const { tenDanhMucCha, tenDanhMucCon, tenDanhMucConCapBa } = useParams();

  //data
  const datas = {
    ...(selectedParentIds.length > 0 && {
      danh_muc_cha_ids: [...selectedParentIds],
    }),
    ...(selectedChildIds.length > 0 && {
      danh_muc_con_ids: [...selectedChildIds],
    }),
    ...(selectedGrandchildIds.length > 0 && {
      danh_muc_chau_ids: [...selectedGrandchildIds],
    }),
    ...(price.length > 0 && { gia_duoi: price[0] }),
    ...(price.length > 0 && { gia_tren: price[1] }),
    ...(selectedSize.length > 0 && { kich_thuoc_ids: [...selectedSize] }),
    ...(selectedMau.length > 0 && { mau_sac_ids: [...selectedMau] }),
    // ...(tenDanhMucCha?.length ? { danh_muc_cha: tenDanhMucCha } : {}),
    // ...(tenDanhMucCon?.length ? { danh_muc_con: tenDanhMucConCapBa } : {}),
    // ...(tenDanhMucConCapBa?.length
    //   ? { danh_muc_con_cap_ba: tenDanhMucConCapBa }
    //   : {}),
  };
  console.log("data", datas);
  const danhmuc = tenDanhMucConCapBa
    ? tenDanhMucConCapBa
    : tenDanhMucCon
      ? tenDanhMucCon
      : tenDanhMucCha;
  console.log(danhmuc);
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
    setChildChecked((prev) => ({
      ...prev,
      [parentIndex]: {
        ...prev[parentIndex],
        [childIndex]: checked,
      },
    }));

    if (checked) {
      setSelectedChildIds((prev) => [...prev, childId]);
      const grandchildIds = grandchildren.map(
        (grandchild: any) => grandchild.id
      );
      setSelectedGrandchildIds((prev) => [...prev, ...grandchildIds]);
    } else {
      setSelectedChildIds((prev) => prev.filter((id) => id !== childId));
      const grandchildIds = grandchildren.map(
        (grandchild: any) => grandchild.id
      );
      setSelectedGrandchildIds((prev) =>
        prev.filter((id) => !grandchildIds.includes(id))
      );
    }
  };

    // const { data: categoriesData } = useQuery({
    //   queryKey: ["CATEGORIES", tenDanhMucCha, tenDanhMucCon, tenDanhMucConCapBa],
    //   queryFn: async () => {
    //     if (!tenDanhMucCha || !tenDanhMucCon || !tenDanhMucConCapBa) return null;
    //     const response = await instanceClient.post(`danhmuc/${tenDanhMucCha}/${tenDanhMucCon}/${tenDanhMucConCapBa}`);
    //     return response.data;
    //   },
    //   enabled: !!tenDanhMucCha && !!tenDanhMucCon && !!tenDanhMucConCapBa,
    // });
  // console.log(categoriesData?.data?.san_pham)
  const { data, refetch: refetch2 } = useQuery({
    queryKey: ["PRODUCTSLOC"],
    queryFn: async () => {
      try {
        const response = await instanceClient.post(`loc-san-pham`, {
          loai_danh_muc: danhmuc,
        });

        if (response.data.status !== true) {
          throw new Error("Error fetching product");
        }

        return response.data;
      } catch (error) {
        throw new Error("Lỗi khi lấy thông tin");
      }
    },
  });

  console.log("data", data?.data?.data);

  // danh mục
  const { data: locsanpham, refetch } = useQuery({
    queryKey: ["LOCSAMPHAM"],
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
  });
  useEffect(() => {
    refetch();
    refetch2();
  }, [danhmuc, refetch, refetch2]);
  console.log(locsanpham);
  const mau_sac = locsanpham?.mauSac;

  const sizes = locsanpham?.kichThuoc;
  // console.log(sizes);
  // lọc
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();
  const { mutate: LOCMUTATE } = useMutation({
    mutationFn: async () => {
      try {
        const response = await instanceClient.post(
          `danhmuc?page=${page}`,
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
      // Chỉ invalidate nếu cần thiết, tránh reload liên tục
      if (!isInDanhMucPage) {
        queryClient.invalidateQueries({ queryKey: ["PRODUCTSLOC"] });
      }
    },
  });
  const { mutate } = useMutation({
    mutationFn: async () => {
      try {
        // let url = "/danhmuc";
        // if (tenDanhMucCha) url += `/${tenDanhMucCha}`;
        // if (tenDanhMucCon) url += `/${tenDanhMucCon}`;
        // if (tenDanhMucConCapBa) url += `/${tenDanhMucConCapBa}`;
        const response = await instanceClient.post(
          `loc-san-pham?page=${page}`,
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
      // Chỉ invalidate nếu cần thiết, tránh reload liên tục
      if (!isInDanhMucPage) {
        queryClient.invalidateQueries({ queryKey: ["PRODUCTSLOC"] });
      }
    },
  });
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
        mutate();
      } else {
        LOCMUTATE();
      }
    }
  }, [
    selectedParentIds,
    selectedChildIds,
    selectedGrandchildIds,
    mutate,
    LOCMUTATE,
    selectedSize,
    selectedMau,
    price,
    page,
  ]);
  const onPage = (page: number) => {
    setPage(page);
  };
  const danh_muc = locsanpham?.danhMucCha;
  // console.log(danh_muc);
  const products = data?.data?.data;
  // console.log(products);
  const location = useLocation();

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
                  <h2 className="font-bold mb-2 text-lg capitalize">
                    Danh mục {danhmuc}
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
                  <div className="mt-7">
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
                                    disabled={!parentChecked[index]}
                                    onChange={(e) => {
                                      const isChecked = e.target.checked;
                                      handleChildChange(
                                        index,
                                        indexCon,
                                        isChecked,
                                        itemcon.id,
                                        itemcon.children
                                      );
                                      isChecked && mutate(itemcon.id);
                                    }}
                                  />
                                  {itemcon.ten_danh_muc}
                                </label>
                                <i
                                  className={`fa-solid fa-plus mr-3 cursor-pointer ${
                                    expanded.includes(`${index}-${indexCon}`)
                                      ? "rotate-45"
                                      : ""
                                  }`}
                                  onClick={() =>
                                    toggleExpand(`${index}-${indexCon}`)
                                  }
                                ></i>
                              </div>

                              {expanded.includes(`${index}-${indexCon}`) &&
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
                                            isChecked && mutate(itemconcon.id);
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
                        <span className="text-sm ">{item.kich_thuoc}</span>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
            {/* <!-- Product Listings --> */}
            <div className="sm:w-4/5 w-3/4 px-5">
              <ProductsListDM
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

export default ProductCategoriesDM;
