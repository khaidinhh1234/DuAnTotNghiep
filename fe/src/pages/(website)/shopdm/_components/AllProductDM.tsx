import instanceClient from "@/configs/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";

const AllProductDM = () => {
  const { tenDanhMucCha, tenDanhMucCon, tenDanhMucConCapBa } = useParams();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string[]>([]);
  const [selectedMau, setSelectedMau] = useState<string[]>([]);
  const [price, setPrice] = useState<number>(0); // Define the price state
  const { data } = useQuery({
    queryKey: ["AllProductDM"],
    queryFn: async () => {
      try {
        let url = "/danhmuc"; // Bắt đầu với URL cơ bản

        // Xác định cấp độ danh mục và tạo URL phù hợp
        if (tenDanhMucCha) url += `/${tenDanhMucCha}`;
        if (tenDanhMucCon) url += `/${tenDanhMucCon}`;
        if (tenDanhMucConCapBa) url += `/${tenDanhMucConCapBa}`;

        // Gọi API với URL đã tạo
        const response = await instanceClient.post(url);

        // Kiểm tra trạng thái phản hồi
        if (response.data.status !== true) {
          throw new Error("Error fetching product");
        }

        return response.data; // Trả về dữ liệu
      } catch (error) {
        throw new Error("Lỗi khi lấy thông tin");
      }
    },
  });
  const { mutate } = useMutation({
    mutationFn: async () => {
      try {
        let url = "/danhmuc";
        if (tenDanhMucCha) url += `/${tenDanhMucCha}`;
        if (tenDanhMucCon) url += `/${tenDanhMucCon}`;
        if (tenDanhMucConCapBa) url += `/${tenDanhMucConCapBa}`;

        const response = await instanceClient.post(`${url}?page=${page}`);

        if (response.data.status !== true) {
          throw new Error("Error fetching product");
        }

        return response.data;
      } catch (error) {
        throw new Error("Lỗi khi lấy thông tin");
      }
    },
    onSuccess: (data) => {
      //   queryClient.setQueryData(["PRODUCTSLOC"], data);
      queryClient.invalidateQueries({ queryKey: ["AllProductDM"] });
    },
  });
  const location = useLocation();
  useEffect(() => {
    if (
      (tenDanhMucCha?.length ?? 0) >= 0 ||
      (tenDanhMucCon?.length ?? 0) >= 0 ||
      selectedSize.length >= 0 ||
      selectedMau.length >= 0 ||
      (tenDanhMucConCapBa?.length ?? 0) >= 0
    ) {
      mutate(); // Call mutate when URL or selection changes
    }
  }, [
    tenDanhMucCha,
    tenDanhMucCon,
    selectedSize,
    selectedMau,
    price,
    page,
    tenDanhMucConCapBa,
    location.pathname, // Run mutate when pathname changes
  ]);
  return (
    <>
      <section>
        <div className="container">
          <div className=" flex  mt-20 text-2xl font-bold">
            <h1 className="font-bold">Danh mục </h1>{" "}
            <p className="pl-2">
              {data?.data?.danh_muc?.ten_danh_muc ||
                "Tên danh mục không có sẵn"}
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default AllProductDM;
