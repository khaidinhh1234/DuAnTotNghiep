import {
  CheckCircleOutlined,
  GiftOutlined,
  SmileOutlined,
  TruckOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Steps } from "antd";
import React from "react";
import { Link, useParams } from "react-router-dom";

const MyOrderdetail = () => {
  const { slug } = useParams();
  // console.log(slug);
  const trang_thai_don_hang = "Đã hoàn thành"; // Define the variable
  const current = trang_thai_don_hang === "Đã hoàn thành" ? 4 : 0;
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
          <i className="fa-solid fa-money-check-dollar "></i>
        ) : (
          <i className="fa-solid fa-money-check-dollar opacity-50"></i>
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
          <i className="fa-solid fa-box-check"></i>
        ) : (
          <i className="fa-solid fa-box-check opacity-50"></i>
        ),
    },
    {
      title: "Đơn hàng đã được Đánh Giá",

      icon:
        current >= 4 ? (
          <SmileOutlined className="text-blue-500" />
        ) : (
          <SmileOutlined className="opacity-50" />
        ),
    },
  ];

  return (
    <div className=" ">
      <div className="flex justify-between items-center border px-5 pt-4 pb-1">
        <Link to={"/mypro/myorder"}>
          <h1>
            <i className="fa-solid fa-chevron-down fa-rotate-90"></i>TRỞ LẠI
          </h1>
        </Link>
        <div className="flex gap-5 ">
          <h1>MÃ ĐƠN HÀNG.{slug}</h1>{" "}
          <h1 className="border-l-2 pl-5 text-green-500 font-semibold">
            Đơn hàng đã hoàn thành
          </h1>
          <a className="border-l-2 px-2 text-red-500 font-semibold">Đánh giá</a>
        </div>
      </div>
      <div className="border-x  px-5 py-4">
        <Steps current={current} labelPlacement="vertical" items={items} />
      </div>
      <div className="border p-5">
        <div className="py-6 grid grid-cols-7  border-b border-hrBlack">
          <div className="col-span-7 ">
            <div className="flex justify-between ">
              <div className="flex gap-5 items-center ">
                <div className=" rounded-md text-center">
                  {" "}
                  <img
                    src={
                      "https://res.cloudinary.com/dcvu7e7ps/image/upload/v1729223981/ao-khoac-nu-SKN7004-DEN_1_jjbtoe.webp"
                    }
                    alt="Sản phẩm"
                    className="w-20 h-24 rounded-md mb-5"
                  />
                  <span
                    className={`text-xs px-3 py-1 rounded-sm ${status == "Hoàn tất đơn hàng" ? "delivered" : "inprocrass"}`}
                  >
                    đang xử lý
                  </span>
                </div>
                <div className="px-1">
                  <h3 className="font-bold my-1">ádfsdfsd</h3>
                  <p className={`font-bold  block md:hidden`}>Giá: ${345345}</p>
                  <p className="mb-2">
                    Size: <span>{/* {size} {gender && ` / ${gender}`} */}</span>
                    {/* , Màu: <span>{mau}</span> */}
                  </p>
                  <p className="mb-10">Số lượng: {123}</p>{" "}
                  <span className="">Sản phẩm của bạn đã đang xử lý</span>
                </div>
              </div>{" "}
              <div className={`text-center py-8 font-bold md:block  hidden`}>
                <p>3.453.465₫</p>
              </div>
            </div>
            {/* {chi_tiet_don_hangs && chi_tiet_don_hangs.length >= 2 && (
            <div className="text-center font-bold ml-20 mt-3">
              <button>
                <i className="fa-solid fa-share"></i> Xem thêm ...
              </button>
            </div>
          )} */}
          </div>

          {/* <div className="col-span-7 text-end border-t mt-2 py-3">
            {" "}
            Thành tiền:{" "}
            <span className="text-red-600 font-semibold text-2xl">
              {" "}
              ₫{(11111).toLocaleString("vi-VN")}
            </span>
          </div> */}
        </div>{" "}
        <div className="grid grid-cols-2 mt-5">
          <div>
            <h1 className="text-xl font-semibold">
              Địa chỉ nhận hàng{" "}
              <Link
                to={
                  "https://asset.cloudinary.com/dcvu7e7ps/6f1977e298bde704fe55379ef638bb9c"
                }
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 text-sm underline cursor-pointer "
              >
                Xem ảnh giao hàng
              </Link>
            </h1>
            <p>
              <UserOutlined /> Nguyễn đình khải
            </p>
            <p>
              <i className="fa-solid fa-phone"></i> (+84) 974943593
            </p>
            <p>
              <i className="fa-solid fa-map-marker-alt"></i> Đường đê mới Long
              Châu châu phụng châu, Xã Phụng Châu, Huyện Chương Mỹ, Hà Nội
            </p>
          </div>
          <div className="border-l px-5 flex justify-between">
            {/* <h1>THÔNG TIN ĐƠN HÀNG</h1> */}
            <div className="text-end">
              {" "}
              <p>Tổng tiền hàng</p>
              <p>Phí vận chuyển</p>
              <p>Voucher từ GLOW</p>
              <p>Thành tiền</p>
            </div>
            <div className="text-right">
              {" "}
              <p>₫109.000</p>
              <p>₫109.000</p>
              <p>₫109.000</p>
              <p className="text-red-600 font-semibold text-2xl">₫109.000</p>
            </div>
          </div>
        </div>
        <div className="text-end border-t pt-4">
          Phương thức Thanh toán{" "}
          <span className="ml-10">Thanh toán khi nhận hàng</span>
        </div>
      </div>
    </div>
  );
};

export default MyOrderdetail;
