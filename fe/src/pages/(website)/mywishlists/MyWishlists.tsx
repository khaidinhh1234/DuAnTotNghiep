import { QueryClient, useQuery } from "@tanstack/react-query";
import MyWishlistsPage from "./_components/MyWishlists";
import instanceClient from "@/configs/client";
import { useEffect, useState } from "react";

const MyWishlists = () => {
  const [yeuthich1, setYeuthich1] = useState<any>();
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["SANPHAM_YEUTHICH"],

    queryFn: async () => {
      try {
        if (!yeuthich1) {
          const response = await instanceClient.get("sanpham/yeuthich");
          // console.log(response.data); // Kiểm tra dữ liệu
          return response.data;
        } else {
          const responses = await instanceClient.get(
            `sanpham/yeuthich/${yeuthich1}`
          );

          // console.log(responses.map((res) => res.data)); // Kiểm tra dữ liệu
          return responses.data;
        }
      } catch (error) {
        console.error("API error", error); // Thêm log lỗi API
        throw new Error("Lỗi khi lấy thông tin");
      }
    },
  });
  const handleClick = (id: number) => {
    console.log(id);
    setYeuthich1(id);
  };
  const queryClient = new QueryClient();
  useEffect(() => {
    if (yeuthich1) {
      queryClient.invalidateQueries({ queryKey: ["SANPHAM_YEUTHICH"] });
      data.data.filter((item: any) => item.id !== yeuthich1);

      refetch();
    }
  }, [yeuthich1, refetch]);
  // console.log(data);
  const yeuthich = data?.data;
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error...</div>;
  return (
    <>
      <MyWishlistsPage yeuthich={yeuthich} onAdd={handleClick} />
    </>
  );
};

export default MyWishlists;
