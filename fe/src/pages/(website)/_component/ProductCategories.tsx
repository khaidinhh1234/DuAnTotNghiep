import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import instanceClient from "@/configs/client";
import { message, Slider } from "antd";
import SearchResultsPage from "./SearchResultsPage";

const ProductCategories = ({ handleWishlist, isPending }: any) => {
  const [showcate, setShowcate] = useState(true);
  const [showcolor, setShowcolor] = useState(true);
  const [showprice, setShowprice] = useState(true);
  const [showsize, setShowsize] = useState(true);
  // lọc danh mục
  const [parentIds, setParentIds] = useState<number[]>([]);
  const [childIds, setChildIds] = useState<number[]>([]);
  // lọc giá
  const [price, setPrice] = useState([0, 2000000]);
  // size
  const [selectedSize, setselectedSize] = useState<number[]>([]);
  // console.log(selectedSize);
  // mau sac
  const [selectedMau, setSelectedMau] = useState<number[]>([]);
  // console.log(selectedMau);
  // mau sac
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("query") || "";
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
  const datas = {
    // danh_muc_cha_ids: [...parentIds],
    ...(parentIds.length > 0 && { danh_muc_cha_ids: [...parentIds] }),
    ...(childIds.length > 0 && { danh_muc_con_ids: [...childIds] }),
    ...(price.length > 0 && { gia_duoi: price[0] }),
    ...(price.length > 0 && { gia_tren: price[1] }),
    ...(selectedSize.length > 0 && { kich_thuoc_ids: [...selectedSize] }),
    ...(selectedMau.length > 0 && { mau_sac_ids: [...selectedMau] }),
    ...(query && { query: query }),
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
  const { tenDanhMucCha, tenDanhMucCon } = useParams();
  const [_, setProducts] = useState([]);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await instanceClient.get(
          `/sanpham/danhmuc/${tenDanhMucCha}/${tenDanhMucCon}`
        );
        if (response.data.status) {
          setProducts(response.data.data); // Giả sử dữ liệu trả về là mảng sản phẩm
        }
      } catch (error) {
        console.error("Lỗi khi lấy sản phẩm:", error);
      }
    };

    fetchProducts();
  }, [tenDanhMucCha, tenDanhMucCon]);
  // ALL sản phẩm
  const { data } = useQuery({
    queryKey: ["PRODUCTSLOC", datas],
    queryFn: async () => {
      try {
        const response = await instanceClient.post(`/tim-kiem-goi-y`, datas);
        return response.data;
      } catch (error) {
        throw new Error("Lỗi khi lấy thông tin");
      }
    },
  });

  // console.log("data", data?.data?.data);
  // danh mục
  // Replace the existing useQuery for locsanpham with:
  const { data: locsanpham } = useQuery({
    queryKey: ["LOCSLIBAR"],
    queryFn: async () => {
      try {
        const response = await instanceClient.post("/tim-kiem-goi-y", {
          query: query || undefined,
          danh_muc_cha_ids: parentIds.length > 0 ? parentIds : undefined,
          danh_muc_con_ids: childIds.length > 0 ? childIds : undefined,
          gia_duoi: price[0],
          gia_tren: price[1],
          kich_thuoc_ids: selectedSize.length > 0 ? selectedSize : undefined,
          mau_sac_ids: selectedMau.length > 0 ? selectedMau : undefined,
        });

        if (response.data.status_code !== 200) {
          throw new Error("Error fetching filtered products");
        }

        return {
          danhMucCha: response.data.danh_sach_loc?.original?.danhMuc || [],
          mauSac: response.data.danh_sach_loc?.original?.mauSac || [],
          kichThuoc: response.data.danh_sach_loc?.original?.kichThuoc || [],
        };
      } catch (error) {
        throw new Error("Error filtering products");
      }
    },
    enabled: true, // Query will run immediately
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
          `/tim-kiem-goi-y?page=${page}`,
          datas
        );
        return response.data;
      } catch (error: any) {
        message.error(error.response.data.message);
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
  // console.log(danh_muc);
  const products = data?.san_pham?.original?.data?.data || [];
  console.log(products);
  useEffect(() => {
    if (
      parentIds.length >= 0 ||
      childIds.length >= 0 ||
      selectedSize.length >= 0 ||
      selectedMau.length >= 0
    ) {
      mutate(); // Gọi mutate khi có sự thay đổi
    }
  }, [
    parentIds,
    childIds,
    mutate,
    selectedSize,
    selectedMau,
    price,
    page,
    query,
  ]);

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
                                  {itemcon?.ten_danh_muc}
                                </label>
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
                        defaultValue={[0, 2000000]}
                        max={2000000}
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
              <SearchResultsPage
                data={data}
                onPage={setPage}
                products={data?.san_pham?.original?.data?.data || []}
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
