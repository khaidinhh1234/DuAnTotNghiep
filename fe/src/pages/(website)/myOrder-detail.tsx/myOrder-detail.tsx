import {
  CheckCircleOutlined,
  GiftOutlined,
  SmileOutlined,
  TruckOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Steps } from "antd";
import React from "react";
import { useParams } from "react-router-dom";
const description = "This is a description.";
const MyOrderdetail = () => {
  const { slug } = useParams();
  console.log(slug);
  const current = 2; // Define the current variable
  const items = [
    {
      title: "Đơn hàng đã đặt",

      icon:
        current >= 0 ? (
          <i className="fa-solid fa-memo-circle-check"></i>
        ) : (
          <i className="fa-solid fa-memo-circle-check opacity-50"></i>
        ),
    },
    {
      title: "Đã xác nhận thanh toán",

      icon:
        current >= 1 ? (
          <CheckCircleOutlined />
        ) : (
          <CheckCircleOutlined className="opacity-50" />
        ),
    },
    {
      title: "Đã giao cho ĐVVC",

      icon:
        current >= 2 ? (
          <TruckOutlined />
        ) : (
          <TruckOutlined className="opacity-50" />
        ),
    },
    {
      title: "Đã nhận được hàng",

      icon:
        current >= 3 ? (
          <GiftOutlined />
        ) : (
          <GiftOutlined className="opacity-50" />
        ),
    },
    {
      title: "Đơn hàng đã được Đánh Giá",

      status: "wait" as "wait",
      icon:
        current >= 4 ? (
          <SmileOutlined />
        ) : (
          <SmileOutlined className="opacity-50" />
        ),
    },
  ];

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
      <div className="border px-5 pt-4 pb-1">
        <Steps current={current} labelPlacement="vertical" items={items} />
      </div>
    </div>
  );
};

export default MyOrderdetail;
