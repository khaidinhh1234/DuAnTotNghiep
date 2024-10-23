import React from "react";
import { useParams } from "react-router-dom";

const MyOrderdetail = () => {
  const { slug } = useParams();
  console.log(slug);
  return (
    <div className=" ">
      <div className="flex justify-between  border px-5 pt-4 pb-1">
        <div className="">
          <h1>TRỞ LẠI</h1>
        </div>
        <div className="flex gap-5 ">
          <h1>MÃ ĐƠN HÀNG.{slug}</h1>{" "}
          <h1 className="border-l-2 px-5 text-green-500 font-semibold">
            Đơn hàng đã hoàn thành
          </h1>
        </div>
      </div>
      <div className="border px-5 pt-4 pb-1">sdjf</div>
    </div>
  );
};

export default MyOrderdetail;
