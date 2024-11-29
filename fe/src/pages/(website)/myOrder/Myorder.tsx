import instanceClient from "@/configs/client";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import ProductList from "./_components/product";
import HoanTien from "./_components/Hoan";
import { Tabs } from "antd";

const MyOrder = () => {
  const [activeTab, setActiveTab] = useState<string>("");
  const [timkiem, setTimkiem] = useState<string>("");
  console.log(timkiem);
  console.log(activeTab);
  const datas = {
    trang_thai_don_hang: activeTab,
    loc: timkiem || "",
  };
  console.log(datas);
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["MyOrder_LISTas", datas],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await instanceClient.post(
        `danh-sach-don-hang?page=${pageParam}`,
        {
          trang_thai_don_hang: datas.trang_thai_don_hang,
          loc: datas.loc,
        }
      );
      if (response.status !== 200) {
        throw new Error("Lỗi khi lấy danh sách đơn hàng");
      }
      return response.data;
    },
    getNextPageParam: (lastPage) => {
      return lastPage.data.pagination.has_more_pages
        ? lastPage.data.pagination.current_page + 1
        : undefined;
    },
    initialPageParam: 1,
  });

  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loadMoreRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1.0 }
    );

    const currentRef = loadMoreRef.current;
    observer.observe(currentRef);

    return () => {
      observer.unobserve(currentRef);
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (status === "pending") return <p>Loading...</p>;
  if (status === "error") return <p>Error fetching data</p>;

  // const donhang =
  //   data?.pages.map((page) => {
  //     return { ...page, chitiet: page.data };
  //   }) || [];
  const orders = data?.pages.flatMap((page) => page.data.don_hang) || [];
  console.log(datas);
  const tabItems = [
    { label: "Tổng đơn hàng", key: "" },
    { label: "Chờ thanh toán", key: "Chưa thanh toán" },
    { label: "Đang giao hàng", key: "Đang giao hàng" },
    { label: "Hoàn thành", key: "Hoàn tất đơn hàng" },

    { label: "Đã hủy", key: "Hủy hàng" },

    { label: "Trả hàng/Hoàn tiền", key: "Hoàn hàng" },
  ];
  return (
    <div>
      {/* Hiển thị danh sách đơn hàng */}

      <ProductList
        donhang={orders}
        activeTab={activeTab}
        tabItems={tabItems}
        setActiveTab={setActiveTab}
        handleSumit={setTimkiem}
      />
      {/* Nút tải thêm nếu còn trang tiếp theo */}
      <div
        ref={loadMoreRef}
        style={{ height: "20px", backgroundColor: "transparent" }}
      />

      {/* Trạng thái tải thêm dữ liệu */}
      {isFetchingNextPage && (
        <div className="flex justify-center items-center">
          <svg
            className="w-24 h-24"
            width={240}
            height={240}
            viewBox="0 0 240 240"
          >
            <circle
              className="pl__ring pl__ring--a"
              cx={120}
              cy={120}
              r={105}
              fill="none"
              stroke="#f42f25"
              strokeWidth={20}
              strokeDasharray="0 660"
              strokeDashoffset={-330}
              strokeLinecap="round"
            />
            <circle
              className="pl__ring pl__ring--b"
              cx={120}
              cy={120}
              r={35}
              fill="none"
              stroke="#f49725"
              strokeWidth={20}
              strokeDasharray="0 220"
              strokeDashoffset={-110}
              strokeLinecap="round"
            />
            <circle
              className="pl__ring pl__ring--c"
              cx={85}
              cy={120}
              r={70}
              fill="none"
              stroke="#255ff4"
              strokeWidth={20}
              strokeDasharray="0 440"
              strokeLinecap="round"
            />
            <circle
              className="pl__ring pl__ring--d"
              cx={155}
              cy={120}
              r={70}
              fill="none"
              stroke="#f42582"
              strokeWidth={20}
              strokeDasharray="0 440"
              strokeLinecap="round"
            />
          </svg>
        </div>
      )}
    </div>
  );
};
export default MyOrder;
