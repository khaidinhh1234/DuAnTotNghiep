import instanceClient from "@/configs/client";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import ProductList from "./_components/product";

const MyOrder = () => {
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["MyOrder_LISTas"],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await instanceClient.get(`don-hang?page=${pageParam}`);
      if (response.status !== 200) {
        throw new Error("Lỗi khi lấy danh sách đơn hàng");
      }
      return response.data; // Giả sử response.data chứa cấu trúc như bạn đã cung cấp
    },
    getNextPageParam: (lastPage) => {
      return lastPage.data.pagination.has_more_pages
        ? lastPage.data.pagination.current_page + 1
        : undefined;
    },
    initialPageParam: 1,
  });

  const loadMoreRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1.0 }
    );

    if (loadMoreRef.current) observer.observe(loadMoreRef.current);

    return () => {
      if (loadMoreRef.current) observer.unobserve(loadMoreRef.current);
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (status === "pending") return <p>Loading...</p>;
  if (status === "error") return <p>Error fetching data</p>;

  // const donhang =
  //   data?.pages.map((page) => {
  //     return { ...page, chitiet: page.data };
  //   }) || [];
  const orders = data?.pages.flatMap((page) => page.data.don_hang) || [];
  const tong = data?.pages[0]?.data?.tong_thanh_tien_san_pham ?? 0;

  // console.log(tong);
  return (
    <div>
      {/* Hiển thị danh sách đơn hàng */}
      <ProductList donhang={orders} tong={tong} />
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
