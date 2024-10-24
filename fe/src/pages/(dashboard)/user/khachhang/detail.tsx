import instance from "@/configs/admin";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, message, Modal } from "antd";
import { useState } from "react";

const Detail = ({ record }: any) => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const formatDate = (dateString: any) => {
    if (!dateString) return "";

    const date = new Date(dateString);

    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();

    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  const { data } = useQuery({
    queryKey: ["ORDER_DETAIL", record.id],
    queryFn: async () => {
      const response = await instance.get(`/donhang/${record.id}`);
      return response.data;
    },
  });
  const products = data?.data?.don_hang?.chi_tiets?.map((item: any) => {
    return {
      ...item,
    };
  });

  // const donhang = data?.data;
  console.log("data", data);
  console.log("data", products);

  const handleCancel = () => {
    setOpen(false);
  };

  const { mutate } = useMutation({
    mutationFn: async ({ id, action }: any) => {
      console.log("data", id, action);

      try {
        const response = await instance.put("/donhang/trang-thai-don-hang", {
          trang_thai_don_hang: action,
          id: [id],
        });
        const error = response.data.message;

        if (error === "Cập nhật trạng thái đơn hàng thành công") {
          message.open({
            type: "success",
            content: error,
          });
        } else {
          message.open({
            type: "success",
            content: error,
          });
        }
        return response.data;
      } catch (error) {
        message.open({
          type: "error",
          content: "Không thể cập nhật trạng thái đơn hàng!",
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["ORDERS"],
      });
    },
  });

  // if (isLoading) {
  //   return <div>Loading...</div>;
  // }
  return (
    <div>
      {" "}
      <Button onClick={() => setOpen(true)}>Xem chi tiết </Button>
      <Modal
        centered
        open={open}
        width={1200}
        className=" "
        okText="Đồng ý"
        footer={null}
        onCancel={handleCancel}
      >
        <h1 className="text-3xl font-bold">Chi tiết đơn hàng </h1>
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-9">
            {" "}
            <div className="py-1 px-5 border bg-slate-100 rounded-md flex justify-between items-center">
              <div className="">
                <h4 className="text-lg font-bold">
                  Đơn Hàng:
                  <span className="text-blue-500">{record?.ma_don_hang}</span>
                </h4>
                <p className="text-base">
                  Ngày tạo:{" "}
                  <span className="font-medium">
                    {formatDate(record?.created_at)}
                  </span>
                </p>{" "}
              </div>{" "}
              <div
                className={`font-bold text-[15px] ${
                  record.trang_thai_don_hang === "Chờ xác nhận"
                    ? "text-yellow-400" // Chờ xác nhận: màu vàng nhạt
                    : record.trang_thai_don_hang === "Đã xác nhận"
                      ? "text-orange-500" // Đã xác nhận: màu cam đậm
                      : record.trang_thai_don_hang === "Đang xử lý"
                        ? "text-blue-500" // Đang xử lý: màu xanh dương
                        : record.trang_thai_don_hang === "Đang giao hàng"
                          ? "text-purple-500" // Đang giao hàng: màu tím
                          : record.trang_thai_don_hang ===
                              "Đã giao hàng thành công"
                            ? "text-green-500" // Đã giao hàng thành công: màu xanh lá
                            : "text-red-500" // Các trạng thái khác: màu đỏ
                }`}
              >
                <div
                  className={`${
                    record.trang_thai_don_hang === "Chờ xác nhận"
                      ? "bg-blue-400" // Chờ xác nhận: màu vàng nhạt
                      : record.trang_thai_don_hang === "Đã xác nhận"
                        ? "bg-green-500" // Đã xác nhận: màu cam đậm
                        : record.trang_thai_don_hang === "Đang xử lý"
                          ? "bg-yellow-500" // Đang xử lý: màu xanh dương
                          : record.trang_thai_don_hang === "Đang giao hàng"
                            ? "bg-purple-500" // Đang giao hàng: màu tím
                            : record.trang_thai_don_hang ===
                                "Giao hàng thành công"
                              ? "bg-green-500" // Đã giao hàng thành công: màu xanh lá
                              : "bg-red-500" // Các trạng thái khác: màu đỏ
                  } text-white px-2 py-1 font-bold rounded-lg`}
                >
                  {record.trang_thai_don_hang === "Chờ xác nhận"
                    ? "Chờ xác nhận" // Chờ xác nhận: màu vàng nhạt
                    : record.trang_thai_don_hang === "Đã xác nhận"
                      ? "Đã xác nhận" // Đã xác nhận: màu cam đậm
                      : record.trang_thai_don_hang === "Đang xử lý"
                        ? "Chờ lấy hàng" // Đang xử lý: màu xanh dương
                        : record.trang_thai_don_hang === "Đang giao hàng"
                          ? "Đang giao hàng" // Đang giao hàng: màu tím
                          : record.trang_thai_don_hang ===
                              "Giao hàng thành công"
                            ? "Giao hàng thành công" // Đã giao hàng thành công: màu xanh lá
                            : "Đã hủy"}
                </div>
              </div>
            </div>
            <div className="bg-slate-100 border px-5  my-5">
              <h1 className="text-lg font-bold mt-5 ">Tất Cả Sản Phẩm</h1>{" "}
              <hr />
              <div className="my-5">
                <table>
                  <thead>
                    <tr className="*:px-12 *:text-base">
                      <th className=" w-[30%]"></th>

                      <th className="w-[15%]">Số Lượng</th>
                      <th className="w-[20%]">Giá</th>
                      <th className="w-[35%]">Thành Tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products?.map((item: any, index: number) => (
                      <tr key={index} className="my-5">
                        <td>
                          <div className="flex gap-5 items-center  w-[50%] my-2">
                            <img
                              src={
                                item?.bien_the_san_pham?.san_pham?.anh_san_pham
                              }
                              alt={""}
                              className="w-20 h-20"
                            />
                            <div>
                              <h1 className=" font-bold truncate w-40">
                                {
                                  item?.bien_the_san_pham?.san_pham
                                    ?.ten_san_pham
                                }
                              </h1>
                              <div className="flex gap-2">
                                <p className="text-base">
                                  Màu :{" "}
                                  <span>
                                    {
                                      item?.bien_the_san_pham?.mau_bien_the
                                        ?.ten_mau_sac
                                    }
                                  </span>
                                </p>
                                <p className="text-base">
                                  Size :{" "}
                                  <span>
                                    {" "}
                                    {
                                      item?.bien_the_san_pham
                                        ?.kich_thuoc_bien_the?.kich_thuoc
                                    }
                                  </span>
                                </p>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="text-center w-30 font-semibold  w-[20%]">
                          {" "}
                          {item?.so_luong}
                        </td>
                        <td className="text-center w-[20%] font-semibold  ">
                          {(item?.gia).toLocaleString()} VNĐ
                        </td>
                        <td className="text-center w-[35%] font-semibold">
                          {(item?.thanh_tien).toLocaleString()} VNĐ
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="grid grid-cols-2 gap-5 my-5">
                  <div>
                    <div className="flex justify-between">
                      <p>Lấy hàng</p> <span> Hà Nội</span>
                    </div>
                    <div className="flex justify-between">
                      <p>Mã Vận chuyển</p> <span> 100023874</span>
                    </div>
                    <div className="flex justify-between">
                      <p>Nhà vận chuyển</p> <span> Hà Nội</span>
                    </div>
                  </div>{" "}
                  <div>
                    <div className="flex justify-between">
                      <p>Trạng thái vận chuyển</p>{" "}
                      <span
                        className={`   ${
                          record.trang_thai_don_hang == "Chờ xác nhận"
                            ? "bg-blue-500"
                            : record.trang_thai_don_hang == "Đã xác nhận"
                              ? "bg-green-500"
                              : record.trang_thai_don_hang == "Đang xử lý"
                                ? "bg-yellow-500"
                                : record.trang_thai_don_hang == "Đang giao hàng"
                                  ? "bg-purple-500"
                                  : record.trang_thai_don_hang ==
                                      "Giao hàng thành công"
                                    ? "bg-green-500"
                                    : "bg-red-500"
                        }
                        } text-white px-2 font-bold rounded-lg h-6`}
                      >
                        {" "}
                        {record.trang_thai_don_hang == "Chờ xác nhận"
                          ? "Chờ xác nhận"
                          : record.trang_thai_don_hang == "Đã xác nhận"
                            ? "Chuẩn bị giao"
                            : record.trang_thai_don_hang == "Đang xử lý"
                              ? "Chờ lấy hàng"
                              : record.trang_thai_don_hang == "Đang giao hàng"
                                ? "Đang giao hàng"
                                : record.trang_thai_don_hang ==
                                    "Giao hàng thành công"
                                  ? "Giao hàng thành công"
                                  : "Đã hủy"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <p>Tổng khối lượng</p> <span> 0.00kg</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-5">
              <h1 className="text-xl font-bold mt-5">Đã nhận hàng</h1>
              <div className="grid grid-cols-1 gap-5 w-full">
                <div className="flex justify-between">
                  <h1 className="text-lg font-semibold">
                    Số lượng sản phẩm :{" "}
                  </h1>
                  <p className="text-base font-semibold">
                    <span>{data?.data?.tong_so_luong}</span> sản phẩm
                  </p>
                </div>
                <div className="flex justify-between">
                  <h1 className="text-lg font-semibold">Tổng tiền hàng</h1>
                  <p className="text-base font-semibold">
                    <span>
                      {(products?.thanh_tien ?? 0).toLocaleString("vi-VN")}
                    </span>{" "}
                    VNĐ
                  </p>
                </div>
                <div className="flex justify-between">
                  <h1 className="text-lg font-semibold">Giảm giá</h1>
                  <p className="text-base font-semibold">
                    -{" "}
                    <span>
                      {data?.data?.gia_khuyen_mai
                        ? data?.data?.gia_khuyen_mai
                        : "1.029.007"}
                    </span>
                  </p>
                </div>
                <div className="flex justify-between">
                  <h1 className="text-lg font-semibold">Vận chuyển</h1>
                  <p className="text-base font-semibold">
                    <span>20.000</span> VNĐ
                  </p>
                </div>
                <div className="flex justify-between">
                  <h1 className="text-lg font-semibold">
                    Tổng giá trị đơn hàng <br />
                  </h1>
                  <p className="text-lg font-bold">
                    {" "}
                    {(record?.tong_tien_don_hang + 20000).toLocaleString(
                      "vi-VN"
                    )}{" "}
                    VNĐ
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-3  ">
            <div className=" bg-slate-100 p-5 border rounded-lg">
              <h5 className="text-blue-800 text-lg">Xác nhận đơn hàng </h5>
              <hr />
              <p> Vui lòng xác nhận đơn hàng đã nhận hàng</p>

              <div className="flex flex-col gap-2">
                {record.trang_thai_don_hang === "Chờ xác nhận" ? (
                  <>
                    <span className="w-full py-1 px-2 text-base font-medium text-blue-500 border-b-2 border-blue-500 hover:text-blue-600 hover:border-blue-600 transition-all duration-300 ease-in-out cursor-default text-center ">
                      Xác nhận đơn hàng
                    </span>
                  </>
                ) : record.trang_thai_don_hang === "Đã xác nhận" ? (
                  <>
                    <span className="w-full py-1 px-2 text-base font-medium text-green-500 border-b-2 border-green-500 hover:text-green-600 hover:border-green-600 transition-all duration-300 ease-in-out cursor-default text-center ">
                      Hoàn tất đơn hàng
                    </span>
                  </>
                ) : record.trang_thai_don_hang === "Đang xử lý" ? (
                  <span className="w-full py-1 px-2 text-base font-medium text-yellow-500 border-b-2 border-yellow-500 hover:text-yellow-600 hover:border-yellow-600 transition-all duration-300 ease-in-out cursor-default text-center ">
                    Chờ lấy hàng
                  </span>
                ) : record.trang_thai_don_hang === "Đang giao hàng" ? (
                  <span className="w-full py-1 px-2 text-base font-medium text-purple-500 border-b-2 border-purple-500 hover:text-purple-600 hover:border-purple-600 transition-all duration-300 ease-in-out cursor-default text-center">
                    Đang giao hàng
                  </span>
                ) : record.trang_thai_don_hang === "Giao hàng thành công" ? (
                  <span className="w-full py-1 px-2 text-base font-medium text-green-500 border-b-2 border-green-500 hover:text-green-600 hover:border-green-600 transition-all duration-300 ease-in-out cursor-default text-center">
                    Giao hàng thành công
                  </span>
                ) : (
                  <span className="w-full py-1 px-2 text-base font-medium text-red-500 border-b-2 border-red-500 hover:text-red-600 hover:border-red-600 transition-all duration-300 ease-in-out cursor-default text-center">
                    Đã hủy đơn hàng
                  </span>
                )}
              </div>
            </div>{" "}
            <div className=" bg-slate-100 p-5 border rounded-lg my-2">
              <h5 className="text-blue-800 text-lg">Thông tin khách hàng</h5>
              <hr />
              <h5 className="text-blue-600 my-2">
                {record.ten_nguoi_dat_hang}
              </h5>
              <hr />
              <h5 className="text-blue-800 text-lg my-2">Người liên hệ</h5>
              <h5 className="text-black my-2">{record.ten_nguoi_dat_hang}</h5>
              <p>
                Số điện thoại :{" "}
                <span>{record.so_dien_thoai_nguoi_dat_hang}</span>
              </p>
              <h5 className="text-blue-800">
                Địa chỉ Giao hàng: <span>{record?.dia_chi_nguoi_dat_hang}</span>
              </h5>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Detail;
