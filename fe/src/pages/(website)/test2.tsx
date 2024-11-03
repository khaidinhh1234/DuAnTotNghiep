import instanceClient from "@/configs/client";
import { useInfiniteQuery } from "@tanstack/react-query";
import ProductList from "./myOrder/_components/product";
import { useEffect, useRef } from "react";

const Test2 = () => {
  const {
    data,

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
  // console.log("34", orders);
  // const orders = donhang[0].chitiet;
  // console.log(orders);
  return (
    <div>
      {/* Hiển thị danh sách đơn hàng */}
      <ProductList donhang={orders} />
      {/* Nút tải thêm nếu còn trang tiếp theo */}
      <div
        ref={loadMoreRef}
        style={{ height: "20px", backgroundColor: "transparent" }}
      />

      {/* Trạng thái tải thêm dữ liệu */}
      {isFetchingNextPage && <p>Loading more...</p>}
    </div>
  );
};

export default Test2;
