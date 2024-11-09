import { sanPham2 } from "@/assets/img";
import instanceClient from "@/configs/client";
import { PlusOutlined } from "@ant-design/icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Form, Image, message, Upload } from "antd";
import TextArea from "antd/es/input/TextArea";
import { UploadFile, UploadProps } from "antd/es/upload";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import HoanTien from "./Hoan";
// Component hiển thị thông tin sản phẩm
const isToday = (date) => {
  const today = new Date();
  // console.log(today);
  return (
    date.getUTCDate() === today.getUTCDate() &&
    date.getUTCMonth() === today.getUTCMonth() &&
    date.getUTCFullYear() === today.getUTCFullYear()
  );
};

const ProductItem = ({
  status,
  price,
  img,
  name,
  size,
  mau,
  quantity,
  gender,
  chi_tiet_don_hangs,
  tong_tien,
  ma_don_hang,
  pricesale,
  trang_thai_thanh_toan,
  created_at,
  phuong_thuc_thanh_toans,
}: any) => {
  // console.log(chi_tiet_don_hangs);
  console.log("status", new Date(created_at));
  const dateToCheck = new Date(created_at);
  console.log(isToday(dateToCheck));
  const [reviewText, setReviewText] = useState("");
  const [qualityRating, setQualityRating] = useState(0);
  const [toggleUsername, setToggleUsername] = useState(true);
  const [values, setValues] = useState<string>("");
  const [danhgia, setDanhgia] = useState<boolean>(false);
  // console.log(values);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [Payment, setPayment] = useState(false);
  const [Hoan, setHoan] = useState(false);

  const queryClient = useQueryClient();
  const [li_do_huy_hang, setValue] = useState<string>("");
  const [phuong_thuc_thanh_toan, setPhuongthuc] = useState<any>({});
  const { mutate } = useMutation({
    mutationFn: async (data: any) => {
      // console.log(data);

      // await instance.post(`/gio-hang/${id}`, {
      //   headers: {
      //     Authorization: `Bearer ${access_token}`,
      //   },
      // });
      try {
        const response = await instanceClient.post(
          `don-hang/huy-don-hang`,
          data
        );
        message.success("Hủy đơn hàng thành công");
        setIsModalOpen(false);
        return response.data;
      } catch (error) {
        message.error("Hủy đơn hàng thất bại");
        console.log(error);
      }

      // const response = await  instanceClient.post(`don-hang/huy-don-hang`, data);
      // return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["MyOrder_LISTas"],
      });
    },
  });
  const { mutate: mutateXacnhan } = useMutation({
    mutationFn: async (data: any) => {
      // console.log(data);
      try {
        const response = await instanceClient.patch(
          `xac-nhan-don-hang/${data}`
        );
        message.success("Đã xác nhận nhận hàng ");
        // setIsModalOpen(false);
        return response.data;
      } catch (error) {
        message.error(" Lỗi xác nhận nhận hàng ");
        console.log(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["MyOrder_LISTas"],
      });
    },
  });
  const handleCancelOrder = () => {
    if (status === "Hoàn tất đơn hàng") {
      console.log("Đánh giá");
      setDanhgia(true);
    } else if (status === "Chờ khách hàng xác nhận") {
      mutateXacnhan(ma_don_hang);
    } else {
      setIsModalOpen(true); // Show the modal when other statuses are met
    }
  };

  const closeModal = () => setIsModalOpen(false);
  const handleSubmit = (e: any) => {
    e.preventDefault();
    const data = { li_do_huy_hang, ma_don_hang };
    mutate(data);
  };
  // const handlehoan ()=>{

  // }
  const nav = useNavigate();
  const { mutate: mutatePayment, isPending } = useMutation({
    mutationFn: async (data: any) => {
      // console.log(data);
      try {
        if (data.phuong_thuc_thanh_toan !== "Thanh toán khi nhận hàng") {
          const response = await instanceClient.post("payment/momo", data);
          if (response.data && response.data.payUrl) {
            window.location.href = response.data.payUrl; // Redirect the user to the MoMo payment interface
          }
          if (response.status === 200) {
            // message.success("Thanh toán MoMo thành công");
            message.success("Chờ  xử lý Thanh toán");
          }
        } else if (data.phuong_thuc_thanh_toan === "Thanh toán khi nhận hàng") {
          message.success("Đặt hàng thành công");
          nav(`/thankyou?orderId=${data.ma_don_hang}&resultCode=0`); // Chuyển hướng người dùng đến trang cảm ơn
        } else {
          message.error("Đặt hàng thất bại");
          throw new Error("Error during order creation or MoMo payment");
        }
        // const response = await instanceClient.post(`payment/momo`, data);
        // if (response.data && response.data.payUrl) {
        //   window.location.href = response.data.payUrl; // Redirect the user to the MoMo payment interface
        // }
        // if (response.status === 200) {
        //   // message.success("Thanh toán MoMo thành công");
        //   message.success("Thanh toán thành công");
        // }
        // return response.data;
      } catch (error) {
        console.log(error);
        message.error("Thanh toán thất bại");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["MyOrder_LISTas"],
      });
    },
  });
  const handlethanhtoan = (e: any) => {
    e.preventDefault();
    const data = { ma_don_hang, phuong_thuc_thanh_toan, amount: tong_tien };
    // console.log(data);
    mutatePayment(data);
  };

  const PaymentClose = [
    {
      name: "Thanh toán quét mã MoMoQR",
      value: "Momo_QR",
      img: "https://res.cloudinary.com/dcvu7e7ps/image/upload/v1730963854/nzgq1qiuvtynqdkhwc5g.png",
    },
    { name: "Thẻ ATM  và tài khoản ngân hàng", value: "Momo_ATM" },
    // {
    //   name: "Thanh toán qua Visa, MasterCard, JCB",
    //   value: "Ví điện tử",
    // },
    { name: "Ví Glow Clothing", value: "Ví tiền" },
    { name: "Thanh toán khi nhận hàng", value: "Thanh toán khi nhận hàng" },
  ];
  //upload image

  return (
    <>
      {danhgia && (
        <>
          <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75 z-50">
            <div className="p-6 bg-white rounded-lg shadow-lg max-w-lg mx-auto">
              {/* Header */}
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Đánh giá sản phẩm</h2>
                <button className="text-red-500 font-semibold">Gửi</button>
              </div>

              {/* Product Info */}
              <div className="mb-4">
                <p className="text-sm text-gray-700">
                  Xem Hướng dẫn đánh giá chuẩn để nhận đến{" "}
                  <span className="text-red-500 font-bold">200 xu</span>!
                </p>
              </div>

              {/* Rating */}
              <div className="mb-4">
                <h3 className="text-lg font-semibold">Chất lượng sản phẩm</h3>
                <div className="flex items-center space-x-1 my-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setQualityRating(star)}
                      className={`text-2xl ${star <= qualityRating ? "text-yellow-500" : "text-gray-400"}`}
                    >
                      ★
                    </button>
                  ))}
                  <span className="text-sm text-gray-600">Tuyệt vời</span>
                </div>
              </div>

              {/* Image/Video Upload */}
              <div className="flex space-x-4 mb-4">
                <button className="border border-gray-300 rounded-lg p-3 flex items-center justify-center w-1/2">
                  <span role="img" aria-label="Camera" className="mr-2">
                    📷
                  </span>{" "}
                  Thêm Hình ảnh
                </button>
                <button className="border border-gray-300 rounded-lg p-3 flex items-center justify-center w-1/2">
                  <span role="img" aria-label="Video Camera" className="mr-2">
                    🎥
                  </span>{" "}
                  Thêm Video
                </button>
              </div>

              {/* Additional Review Section */}
              <div className="border border-red-500 p-4 mb-4">
                <h4 className="text-sm font-semibold text-red-500 mb-1">
                  Mục đánh giá bổ sung dành cho Người mua
                </h4>
                <textarea
                  placeholder="Chất liệu: để lại đánh giá"
                  className="w-full border border-gray-300 p-2 rounded-lg mt-2"
                  rows={2}
                />
                <textarea
                  placeholder="Công dụng: để lại đánh giá"
                  className="w-full border border-gray-300 p-2 rounded-lg mt-2"
                  rows={2}
                />
              </div>

              {/* Review Text Area */}
              <textarea
                placeholder="Hãy chia sẻ cảm nhận về sản phẩm (Tối đa 200 ký tự)"
                className="w-full border border-gray-300 p-2 rounded-lg mb-4"
                rows={3}
                maxLength={200}
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
              />

              {/* Toggle Username Display */}
              <div className="flex items-center mb-4">
                <label className="text-sm text-gray-700 mr-2">
                  Hiển thị tên đăng nhập trên đánh giá này
                </label>
                <input
                  type="checkbox"
                  checked={toggleUsername}
                  onChange={() => setToggleUsername(!toggleUsername)}
                  className="h-5 w-5 text-blue-500 focus:ring focus:ring-blue-200"
                />
              </div>

              {/* Additional Ratings */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Dịch vụ của người bán</span>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button key={star} className="text-yellow-500 text-xl">
                        ★
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span>Dịch vụ vận chuyển</span>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button key={star} className="text-yellow-500 text-xl">
                        ★
                      </button>
                    ))}
                  </div>
                  <button
                    className=""
                    onClick={() => {
                      setToggleUsername(false);
                    }}
                  >
                    click
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      {Hoan && (
        <>
          <HoanTien
            chi_tiet_don_hangs={chi_tiet_don_hangs}
            setHoan={setHoan}
            tong_tien={tong_tien}
            setValues={setValues}
          />
        </>
      )}
      {Payment && (
        <>
          <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Phương thức thanh toán
              </h2>
              <p className="text-sm text-gray-600">
                Vui lòng chọn lý do hủy. Với lý do này, bạn sẽ hủy tất cả sản
                phẩm trong đơn hàng và không thể thay đổi sau đó.
              </p>

              <form className="space-y-3">
                {PaymentClose?.map((reason: any, index) => (
                  <label
                    key={index}
                    className="flex items-center my-5  border-b py-3"
                  >
                    <input
                      type="radio"
                      name="phuong_thuc_thanh_toan"
                      className="form-radio text-red-500 h-5 w-5 mr-3 focus:ring focus:ring-red-200"
                      onChange={() => setPhuongthuc(reason?.value)}
                    />
                    <span className="text-gray-700 mr-3">{reason?.name}</span>{" "}
                    <img
                      src={reason?.img}
                      alt={reason?.name}
                      className="w-12 h-12"
                    />
                  </label>
                ))}
                <div className="flex justify-between items-center pt-4  border-gray-200">
                  <button
                    className="text-gray-600 hover:text-gray-800 text-sm font-medium focus:outline-none"
                    onClick={(e: any) => {
                      e.preventDefault();
                      setPayment(!Payment);
                    }}
                  >
                    KHÔNG PHẢI BÂY GIỜ
                  </button>
                  <button
                    className="bg-gray-600 hover:bg-gray-800 text-white font-semibold py-2 px-6 rounded-md shadow-lg transition-all"
                    onClick={(e: any) => handlethanhtoan(e)}
                  >
                    Thanh toán ngay
                  </button>
                </div>{" "}
              </form>
            </div>
          </div>
        </>
      )}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Chọn Lý Do Hủy
            </h2>
            <p className="text-sm text-gray-600">
              Vui lòng chọn lý do hủy. Với lý do này, bạn sẽ hủy tất cả sản phẩm
              trong đơn hàng và không thể thay đổi sau đó.
            </p>

            <form className="space-y-3">
              {[
                "Muốn thay đổi địa chỉ giao hàng",
                "Muốn nhập/thay đổi mã Voucher",
                "Muốn thay đổi sản phẩm trong đơn hàng (size, màu sắc, số lượng, ...)",
                "Thủ tục thanh toán quá rắc rối",
                "Tìm thấy giá rẻ hơn ở chỗ khác",
                "Đổi ý, không muốn mua nữa",
                "Lý do khác",
              ].map((reason, index) => (
                <label
                  key={index}
                  className="flex items-center my-5  border-b py-3"
                >
                  <input
                    type="radio"
                    name="li_do_huy_hang"
                    className="form-radio text-red-500 h-5 w-5 mr-3 focus:ring focus:ring-red-200"
                    onChange={() => setValue(reason)}
                  />
                  <span className="text-gray-700">{reason}</span>
                </label>
              ))}
              <div className="flex justify-between items-center pt-4  border-gray-200">
                <button
                  className="text-gray-600 hover:text-gray-800 text-sm font-medium focus:outline-none"
                  onClick={closeModal}
                >
                  KHÔNG PHẢI BÂY GIỜ
                </button>
                <button
                  className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-md shadow-lg transition-all"
                  onClick={(e: any) => handleSubmit(e)}
                >
                  HỦY ĐƠN HÀNG
                </button>
              </div>{" "}
            </form>
          </div>
        </div>
      )}
      <div className="py-6 grid grid-cols-7  border-b border-hrBlack">
        <div className="col-span-5 ">
          <div className="flex justify-between ">
            <div className="grid justify-between">
              <div className="flex gap-5 items-center ">
                <div className=" rounded-md text-center">
                  {" "}
                  <img
                    src={img ?? sanPham2}
                    alt={img ?? sanPham2}
                    className="w-36 h-40 lg:w-20 lg:h-24 rounded-md mb-5"
                  />
                  <span
                    className={`text-xs px-2 py-1 rounded-sm ${
                      status == "Chờ xác nhận"
                        ? "inprocrass"
                        : status == "Đã xác nhận"
                          ? "bg-orange-100 text-orange-500 rounded-md"
                          : status == "Đang xử lý"
                            ? "bg-blue-100 text-blue-500 rounded-md"
                            : status == "Đang giao hàng"
                              ? "bg-violet-100 text-violet-500 rounded-md"
                              : status == "Chờ khách hàng xác nhận"
                                ? "bg-yellow-100 text-yellow-500 rounded-md"
                                : status == "Hoàn tất đơn hàng"
                                  ? "delivered"
                                  : status == "Đơn hàng bị từ chối nhân"
                                    ? "bg-red-100 text-red-500 rounded-md"
                                    : "bg-red-100 text-red-500 rounded-md"
                    }`}
                  >
                    {status === "Đang xử lý"
                      ? "Chờ lấy hàng"
                      : status == "Chờ khách hàng xác nhận"
                        ? "Giao thành công"
                        : status == "Đơn hàng bị từ chối nhân"
                          ? "Hoàn hàng"
                          : status}
                  </span>
                </div>
                <div className="px-1">
                  <h3 className="font-bold my-1">{name}</h3>
                  <p className={`font-bold  block md:hidden`}>
                    {" "}
                    <p>
                      {" "}
                      <span className="text-gray-400 line-through text-base">
                        {price.toLocaleString("vi-VN")} đ{" "}
                      </span>
                      {pricesale.toLocaleString("vi-VN")} đ
                    </p>
                  </p>
                  <p className="mb-2">
                    Size:{" "}
                    <span>
                      {size} {gender && ` / ${gender}`}
                    </span>
                    , Màu: <span>{mau}</span>
                  </p>
                  <p className="mb-10">Số lượng: {quantity}</p>{" "}
                  <span className="">
                    Sản phẩm của bạn{" "}
                    {status === "Đang xử lý"
                      ? "đang chờ lấy hàng"
                      : status == "Chờ khách hàng xác nhận"
                        ? "đã giao thành công"
                        : status == "Đơn hàng bị từ chối nhân"
                          ? "đã từ chối nhận"
                          : status}
                  </span>
                </div>
              </div>{" "}
            </div>
            <div
              className={`text-center py-8 font-bold md:block  hidden text-lg`}
            >
              <p>
                {" "}
                <span className="text-gray-400 line-through text-base">
                  {price.toLocaleString("vi-VN")} đ{" "}
                </span>
                {pricesale.toLocaleString("vi-VN")} đ
              </p>
            </div>
          </div>
          {chi_tiet_don_hangs && chi_tiet_don_hangs.length >= 2 && (
            <div className="text-center font-bold ml-20 mt-3">
              <Link to={`/mypro/myorder/${ma_don_hang}`}>
                <i className="fa-solid fa-share"></i> Xem thêm ...
              </Link>
            </div>
          )}
        </div>
        <div className="hidden sm:block col-span-2 text-end">
          <Link to={`/mypro/myorder/${ma_don_hang}`}>
            <button className="hover:bg-blackL hover:text-white shadow font-medium shadow-black/50 text-sm py-3 px-6 mb-2 rounded-lg">
              Xem Đơn Hàng
            </button>
          </Link>
          <br />
          {(status === "Chờ xác nhận" ||
            status === "Đã xác nhận" ||
            // status === "Đang xử lý" ||
            status === "Hoàn tất đơn hàng" ||
            status === "Chờ khách hàng xác nhận") && (
            <button
              className={`${
                status === "Hoàn tất đơn hàng" ||
                status === "Chờ khách hàng xác nhận"
                  ? "bg-black hover:bg-black/50"
                  : "bg-[#FF7262] hover:bg-[#e9b2ac]"
              } shadow-md shadow-slate-600/50 text-white w-[146px] text-sm py-3 rounded-lg mb-2`}
              onClick={(e) => {
                e.preventDefault();
                handleCancelOrder();
              }}
            >
              {status === "Hoàn tất đơn hàng"
                ? "Đánh giá"
                : status === "Chờ khách hàng xác nhận" &&
                    status !== "Hoàn tất đơn hàng"
                  ? "Đã nhận hàng"
                  : "Hủy Đơn Hàng"}
            </button>
          )}{" "}
          <br />
          {isToday(dateToCheck) &&
            phuong_thuc_thanh_toans !== "Thanh toán khi nhận hàng" &&
            trang_thai_thanh_toan == "Chưa thanh toán" &&
            status == "Chờ xác nhận" && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setPayment(true);
                }}
                className={`shadow-md shadow-slate-600/50  hover:text-white  bg-black hover:bg-black/50 font-medium  text-sm py-3 px-6 mb-2 rounded-lg text-white  ${isPending ? "cursor-not-allowed" : ""}`}
              >
                {isPending ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin "></i> Tiếp tục
                    thanh toán
                  </>
                ) : (
                  "Tiếp tục thanh toán"
                )}
              </button>
            )}
          {/* {status === "Hoàn tất đơn hàng" ||
            (status === "Chờ khách hàng xác nhận" &&
              trang_thai_thanh_toan == "Đã thanh toán" && ( */}
          <button
            className="shadow-md shadow-slate-600/50 hover:text-white  bg-[#FF7262] hover:bg-[#e9b2ac] font-medium  text-sm py-3 px-10 mb-2 rounded-lg text-white"
            onClick={(e) => {
              e.preventDefault();
              setHoan(true);
            }}
          >
            Hoàn hàng
          </button>
          {/* ))} */}
        </div>
        <div className="col-span-7 border-t mt-2 py-3 lg:flex lg:justify-between">
          {" "}
          <div>
            <span
              className={`${trang_thai_thanh_toan == "Đã thanh toán" ? "text-green-500 " : " text-red-600"} font-semibold text-base lg:text-lg `}
            >
              {" "}
              <span className="text-black font-medium text-xs lg:text-lg">
                {" "}
                Trạng thái thanh toán:
              </span>
              {trang_thai_thanh_toan ?? "Thanh toán thất bại"}
            </span>
          </div>
          <div>
            Thành tiền:{" "}
            <span className="text-red-600 font-semibold text-2xl">
              {" "}
              ₫{(tong_tien ?? 0).toLocaleString("vi-VN")}
            </span>
          </div>
        </div>{" "}
        <div className="block sm:hidden col-span-2 text-end w-[450px]">
          <Link to={`/mypro/myorder/${ma_don_hang}`}>
            <button className="hover:bg-blackL hover:text-white shadow font-medium shadow-black/50 text-sm py-3 px-6 mb-2 rounded-lg w-[100%]">
              Xem Đơn Hàng
            </button>
          </Link>
          <br />
          {(status === "Chờ xác nhận" ||
            status === "Đã xác nhận" ||
            status === "Hoàn tất đơn hàng" ||
            status === "Chờ khách hàng xác nhận") && (
            <button
              className={`${
                status === "Hoàn tất đơn hàng" ||
                status === "Chờ khách hàng xác nhận"
                  ? "bg-black hover:bg-black/50"
                  : "bg-[#FF7262] hover:bg-[#e9b2ac]"
              } shadow-md shadow-slate-600/50 text-white  text-sm py-3 rounded-lg mb-2 w-[50%]`}
              onClick={() => {
                console.log("click");
              }}
            >
              {status === "Hoàn tất đơn hàng"
                ? "Đánh giá"
                : status === "Chờ khách hàng xác nhận"
                  ? "Đã nhận hàng"
                  : "Hủy Đơn Hàng"}
            </button>
          )}{" "}
          {trang_thai_thanh_toan == "Chưa thanh toán" && (
            <button className="shadow-md shadow-slate-600/50 w-[49%]  hover:text-white  bg-[#FF7262] hover:bg-[#e9b2ac] font-medium  text-sm py-3 px-6 mb-2 rounded-lg text-white">
              Tiếp tục thanh toán
            </button>
          )}
        </div>
      </div>
    </>
  );
};

// Component hiển thị danh sách sản phẩm
const ProductList = ({ donhang }: any) => {
  const don_hang = donhang;
  // console.log(don_hang);
  return (
    <>
      <div className="flex flex-row lg:justify-between lg:items-center">
        <h2 className="text-lg md:text-2xl font-bold text-black-500 mx-4">
          Đơn hàng của bạn
        </h2>
        <Link
          to="/mypro/lichsu"
          className="hover:text-blue-500 underline cursor-pointer pt-2 text-sm md:text-base"
        >
          Lịch sử giao dịch
        </Link>
      </div>

      <div className="lg:col-span-9 col-span-8 lg:pl-4 h-full">
        <form>
          {don_hang && don_hang.length ? (
            don_hang?.map((item: any, index: number) => (
              <ProductItem
                key={index}
                status={item.trang_thai_don_hang || "Đang xử lý"}
                pricesale={
                  item.chi_tiets[0]?.bien_the_san_pham
                    ?.gia_khuyen_mai_tam_thoi ||
                  item?.chi_tiets[0]?.bien_the_san_pham?.gia_khuyen_mai ||
                  item.chi_tiets[0]?.bien_the_san_pham?.gia_ban ||
                  0
                }
                price={item.chi_tiets[0]?.bien_the_san_pham?.gia_ban || 0}
                img={
                  item.chi_tiets[0]?.bien_the_san_pham?.anh_bien_the[0]
                    ?.duong_dan_anh
                }
                name={
                  item.chi_tiets[0]?.bien_the_san_pham?.san_pham?.ten_san_pham
                }
                size={
                  item.chi_tiets[0]?.bien_the_san_pham?.kich_thuoc_bien_the
                    ?.kich_thuoc || "M"
                }
                gender={
                  item.chi_tiets[0]?.bien_the_san_pham?.kich_thuoc_bien_the
                    ?.loai_kich_thuoc || ""
                }
                mau={
                  item.chi_tiets[0]?.bien_the_san_pham?.mau_bien_the
                    ?.ten_mau_sac || "Đen"
                }
                trang_thai_thanh_toan={
                  item.trang_thai_thanh_toan || "thanh toán thất bại"
                }
                quantity={item.chi_tiets[0]?.so_luong || 1}
                chi_tiet_don_hangs={item.chi_tiets || []}
                tong_tien={item?.tong_tien_don_hang || 0}
                created_at={item?.created_at || ""}
                ma_don_hang={item.ma_don_hang || ""}
                phuong_thuc_thanh_toans={item.phuong_thuc_thanh_toan || ""}
              />
            ))
          ) : (
            <div className="col-span-9 h-[430px] flex items-center justify-center">
              <img
                src="https://res.cloudinary.com/dcvu7e7ps/image/upload/v1730026893/cach-huy-don-hang-tren-shopee-04-removebg-preview_2_db7yq1.png"
                alt="No orders"
                className="w-1/2 h-full mx-auto"
              />
            </div>
          )}
        </form>
      </div>
    </>
  );
};

export default ProductList;
