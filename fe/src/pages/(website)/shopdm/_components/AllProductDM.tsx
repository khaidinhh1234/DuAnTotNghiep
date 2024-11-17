import instanceClient from "@/configs/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";

const AllProductDM = () => {
  const { tenDanhMucCha, tenDanhMucCon, tenDanhMucConCapBa } = useParams();

  const { data } = useQuery({
    queryKey: ["SANPHAM_LOC", tenDanhMucCha, tenDanhMucCon, tenDanhMucConCapBa],
    queryFn: async () => {
      try {
        let url = "danhmuc";

        // Ưu tiên danh mục cấp 3 -> danh mục con -> danh mục cha
        if (tenDanhMucCha) {
          url += `/${tenDanhMucCha}`;
        } else if (tenDanhMucCon) {
          url += `/${tenDanhMucCha}/${tenDanhMucCon}`;
        } else if (tenDanhMucConCapBa) {
          url += `/${tenDanhMucConCapBa}/${tenDanhMucCon}/${tenDanhMucConCapBa}`;
        } else {
          throw new Error("Không có danh mục hợp lệ");
        }

        const response = await instanceClient.post(url);
        return response.data;
      } catch (error) {
        throw new Error("Lỗi khi lấy thông tin");
      }
    },
    enabled: !!tenDanhMucCha || !!tenDanhMucCon || !!tenDanhMucConCapBa,
  });
  console.log(data);
  return (
    <>
      <section>
        <div className="container">
          <div className=" flex  mt-20 text-2xl font-bold">
            <h1 className="font-bold">Danh Mục </h1>{" "}
            <p className="pl-2 capitalize ">
              {data?.data?.danh_muc?.ten_danh_muc ?? "Không xác định"}
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default AllProductDM;
