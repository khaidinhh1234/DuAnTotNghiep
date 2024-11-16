import instanceClient from "@/configs/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";

const AllProductDM = () => {
  const { tenDanhMucCha, tenDanhMucCon, tenDanhMucConCapBa } = useParams();

  console.log("data", tenDanhMucCha);
  console.log("data", tenDanhMucCon);
  console.log("data", tenDanhMucConCapBa);
  const data = tenDanhMucConCapBa
    ? tenDanhMucConCapBa
    : tenDanhMucCon
      ? tenDanhMucCon
      : tenDanhMucCha
        ? tenDanhMucCha
        : "không xác định";
  return (
    <>
      <section>
        <div className="container">
          <div className=" flex  mt-20 text-2xl font-bold">
            <h1 className="font-bold">Danh Mục </h1>{" "}
            <p className="pl-2 normal-case  ">
              {data == "nam"
                ? "Nam"
                : data == "nu"
                  ? "Nữ"
                  : data == "tre_em"
                    ? "Trẻ em"
                    : (data ?? "Không xác định")}
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default AllProductDM;
