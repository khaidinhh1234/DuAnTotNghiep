import { IEvaluate } from "@/common/types/evaluate";
import instance from "@/configs/admin";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Input, message, Modal, Rate } from "antd";
import { SpadeIcon } from "lucide-react";
import { useState } from "react";

const Detail = ({ record }: any) => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEvaluate, setCurrentEvaluate] = useState<IEvaluate | null>(
    null
  );
  const [phan_hoi, setphan_hoi] = useState<{ [key: number]: string }>({});
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
  // console.log(data, "data");
  // console.log(data,'datatoString');
  // const { data: vanchuyen, isLoading } = useQuery({
  //   queryKey: ["vanchuyen"],
  //   queryFn: async () => {
  //     const response = await instance.get("/vanchuyen");
  //     return response.data;
  //   },
  // });
  // const { data: danhgia  } = useQuery({
  //   queryKey: ["danhgiasanpham"],
  //   queryFn: async () => {
  //     const response = await instance.get(`/danhsachdanhgia`);
  //     return response.data;
  //   },
  // });
  const mutation = useMutation({
    mutationFn: async ({
      id,
      phan_hoi,
    }: {
      id: number | string;
      phan_hoi: string;
    }) => {
      const response = await instance.post(`/danhsachdanhgia/${id}`, {
        phan_hoi,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ORDER_DETAIL"] });
    },
    onError: (error) => {
      console.error("Error:", error);
    },
  });
  const tong = data?.data;
  const products = data?.data?.don_hang?.chi_tiets?.map((item: any) => {
    return {
      ...item,
    };
  });
  // const donhang = data?.data;
  const thongtin = data?.data.thong_tin;

  // console.log("data", products);
  // console.log(vanchuyen, "vanchuyen");
  const handleCancel = () => {
    setOpen(false);
  };

  const { mutate } = useMutation({
    mutationFn: async ({ id, action }: any) => {
      // console.log("data", id, action);

      try {
        const response = await instance.put("/donhang/trang-thai-don-hang", {
          trang_thai_don_hang: action,
          id: [id],
        });
        // console.log("response", response);
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
        // console.error("Error:", error);
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

  const showModal = (record: IEvaluate) => {
    setCurrentEvaluate(record);
    setIsModalOpen(true);
  };
  const handlephan_hoiChange = (id: number, value: string) => {
    setphan_hoi((prev) => ({
      ...prev,
      [id]: value,
    }));
  };
  const handleOk = () => {
    if (currentEvaluate && phan_hoi[currentEvaluate.id as number]) {
      mutation.mutate({
        id: currentEvaluate.id,
        phan_hoi: phan_hoi[currentEvaluate.id as number],
      });
    }
    setIsModalOpen(false);
  };

  const handleCancel2 = () => {
    setIsModalOpen(false);
  };
  // console.log("record", record);
  return (
    <div>
      {" "}
      <Button onClick={() => setOpen(true)}>Xem chi tiết </Button>
      <Modal
        centered
        open={open}
        width={1200}
        className=""
        okText="Đồng ý"
        footer={null}
        onCancel={handleCancel}
      >
        <h1 className="text-3xl font-bold">Chi tiết đơn hàng </h1>
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-9">
            {" "}
            <div className="py-1 px-5 border bg-slate-100 rounded-md flex justify-between items-center">
              <div className="grid grid-cols-2 gap-5">
                <div className="col-span-1">
                  <h4 className="text-lg font-bold">
                    Đơn Hàng:
                    <span className="text-blue-500">{record?.ma_don_hang}</span>
                  </h4>
                  <p className="text-base">
                    Ngày tạo:{" "}
                    <span className="font-medium">
                      {formatDate(record?.created_at)}
                    </span>
                  </p>
                </div>
                <div className="col-span-1 flex justify-end items-start space-x-2">
                  <span
                    className={
                      record.trang_thai_thanh_toan === "Đã thanh toán"
                        ? "text-green-500 font-bold text-lg"
                        : record.trang_thai_thanh_toan === "Chờ xử lý"
                          ? "text-blue-500 font-bold text-lg"
                          : record.trang_thai_thanh_toan === "Đã hoàn tiền"
                            ? "text-red-500 font-bold text-lg" // Đã hoàn tiền: màu đỏ
                            : "text-yellow-500 font-bold text-lg" // Chưa thanh toán: màu vàng
                    }
                  >
                    <span className={"text-black"}>
                      Trạng thái thanh toán:{" "}
                    </span>
                    {record.trang_thai_thanh_toan === "Đã thanh toán"
                      ? "Đã thanh toán"
                      : record.trang_thai_thanh_toan === "Chờ xử lý"
                        ? "Chờ xử lý"
                        : record.trang_thai_thanh_toan === "Đã hoàn tiền"
                          ? "Đã hoàn tiền"
                          : "Chưa thanh toán"}
                  </span>
                </div>
              </div>

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
                          : record.trang_thai_don_hang === "Hoàn tất đơn hàng"
                            ? "text-green-500" // Đã giao hàng thành công: màu xanh lá
                            : record.trang_thai_don_hang ===
                                "Chờ khách hàng xác nhận"
                              ? "bg-pink-500"
                              : record.trang_thai_don_hang ===
                                  "Đơn hàng bị từ chối nhan"
                                ? "bg-red-500"
                                : record.trang_thai_don_hang === "Hủy hàng"
                                  ? "bg-red-500"
                                  : record.trang_thai_don_hang === "Hoàn hàng"
                                    ? "bg-green-500"
                                    : "text-red-500" // Các trạng thái khác: màu đỏ
                }`}
              >
                <div
                  className={`${
                    record.trang_thai_don_hang === "Chờ xác nhận"
                      ? "text-yellow-400" // Chờ xác nhận: màu vàng nhạt
                      : record.trang_thai_don_hang === "Đã xác nhận"
                        ? "text-orange-500" // Đã xác nhận: màu cam đậm
                        : record.trang_thai_don_hang === "Đang xử lý"
                          ? "text-blue-500" // Đang xử lý: màu xanh dương
                          : record.trang_thai_don_hang === "Đang giao hàng"
                            ? "text-purple-500" // Đang giao hàng: màu tím
                            : record.trang_thai_don_hang === "Hoàn tất đơn hàng"
                              ? "text-green-500" // Hoàn tất đơn hàng: màu xanh lá
                              : record.trang_thai_don_hang === "Hủy hàng"
                                ? "text-red-500" // Hủy hàng: màu đỏ
                                : record.trang_thai_don_hang ===
                                    "Đơn hàng bị từ chối nhân"
                                  ? "text-red-700" // Đơn hàng bị từ chối nhận: màu đỏ đậm
                                  : record.trang_thai_don_hang === "Hoàn hàng"
                                    ? "text-blue-700" // Hoàn hàng: màu xanh đậm
                                    : record.trang_thai_don_hang ===
                                        "Chờ xác nhận hoàn hàng"
                                      ? "text-yellow-500" // Chờ xác nhận hoàn hàng: màu vàng đậm
                                      : record.trang_thai_don_hang ===
                                          "Từ chối hoàn hàng"
                                        ? "text-gray-500" // Từ chối hoàn hàng: màu xám
                                        : "text-gray-700" // Các trạng thái khác: màu đỏ
                  } text-white px-2 py-1 font-bold rounded-lg`}
                >
                  {record.trang_thai_don_hang === "Chờ xác nhận"
                    ? "Chờ xác nhận"
                    : record.trang_thai_don_hang === "Đã xác nhận"
                      ? "Đã xác nhận"
                      : record.trang_thai_don_hang === "Đang xử lý"
                        ? "Chờ lấy hàng"
                        : record.trang_thai_don_hang === "Đang giao hàng"
                          ? "Đang giao hàng"
                          : record.trang_thai_don_hang === "Hoàn tất đơn hàng"
                            ? "Hoàn tất đơn hàng"
                            : record.trang_thai_don_hang === "Hủy hàng"
                              ? "Hủy hàng"
                              : record.trang_thai_don_hang ===
                                  "Đơn hàng bị từ chối nhân"
                                ? "Đơn hàng bị từ chối nhận"
                                : record.trang_thai_don_hang === "Hoàn hàng"
                                  ? "Hoàn hàng"
                                  : record.trang_thai_don_hang ===
                                      "Chờ xác nhận hoàn hàng"
                                    ? "Chờ xác nhận hoàn hàng"
                                    : record.trang_thai_don_hang ===
                                        "Từ chối hoàn hàng"
                                      ? "Từ chối hoàn hàng"
                                      : "Giao hàng thất bại"}
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
                                <p className="text-base flex">
                                  Size :{" "}
                                  <span>
                                    {" "}
                                    {
                                      item?.bien_the_san_pham
                                        ?.kich_thuoc_bien_the?.kich_thuoc
                                    }
                                    /
                                    {
                                      item?.bien_the_san_pham
                                        ?.kich_thuoc_bien_the?.loai_kich_thuoc
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
                          <span className="text-gray-400 line-through text-xs">
                            {item?.bien_the_san_pham?.gia_ban.toLocaleString()}{" "}
                          </span>{" "}
                          {(
                            item?.bien_the_san_pham?.gia_khuyen_mai_tam_thoi ??
                            item?.bien_the_san_pham?.gia_khuyen_mai ??
                            item?.bien_the_san_pham?.gia_ban
                          ).toLocaleString()}
                          VNĐ
                        </td>
                        <td className="text-center w-[35%] font-semibold">
                          {(item?.thanh_tien).toLocaleString()} VNĐ
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {record?.trang_thai_don_hang !== "Đã xác nhận" &&
                  record?.trang_thai_don_hang !== "Hủy hàng" &&
                  record?.trang_thai_don_hang !== "Chờ xử lý" && (
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
                                    : record.trang_thai_don_hang ==
                                        "Đang giao hàng"
                                      ? "bg-purple-500"
                                      : record.trang_thai_don_hang ==
                                          "Hoàn tất đơn hàng"
                                        ? "bg-green-500"
                                        : record.trang_thai_don_hang ==
                                            "Chờ khách hàng xác nhận"
                                          ? "bg-pink-500"
                                          : record.trang_thai_don_hang ==
                                              "Đơn hàng bị từ chối nhan"
                                            ? "bg-red-500"
                                            : record.trang_thai_don_hang ==
                                                "Hủy hàng"
                                              ? "bg-red-500"
                                              : record.trang_thai_don_hang ==
                                                  "Hoàn hàng"
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
                                  : record.trang_thai_don_hang ==
                                      "Đang giao hàng"
                                    ? "Đang giao hàng"
                                    : record.trang_thai_don_hang ==
                                        "Hoàn tất đơn hàng"
                                      ? "Hoàn tất đơn hàng"
                                      : record.trang_thai_don_hang ==
                                          "Chờ khách hàng xác nhận"
                                        ? "Chờ khách hàng xác nhận"
                                        : record.trang_thai_don_hang ==
                                            "Đơn hàng bị từ chối nhan"
                                          ? "Đơn hàng bị từ chối nhan"
                                          : record.trang_thai_don_hang ==
                                              "Hủy hàng"
                                            ? "Hủy hàng"
                                            : record.trang_thai_don_hang ==
                                                "Hoàn hàng"
                                              ? "Hoàn hàng"
                                              : "Đã hủy"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <p>Tổng khối lượng</p> <span> 0.00kg</span>
                        </div>
                        <div className="flex justify-between">
                          <p>Tiền thu hộ</p> <span> {}</span>
                        </div>
                      </div>
                    </div>
                  )}
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
                    <span>{tong?.tong_so_luong}</span> sản phẩm
                  </p>
                </div>
                <div className="flex justify-between">
                  <h1 className="text-lg font-semibold">Tổng tiền hàng</h1>
                  <p className="text-base font-semibold">
                    <span>
                      {tong?.tong_thanh_tien_san_pham.toLocaleString(
                        "vi-VN"
                      )
                      // .toLocaleString()
                      }
                    </span>{" "}
                    VNĐ
                  </p>
                </div>
                <div className="flex justify-between">
                  <h1 className="text-lg font-semibold">Giảm giá</h1>
                  <p className="text-base font-semibold">
                    <span>
                      {tong?.so_tien_giam_gia
                        ? "-" + tong?.so_tien_giam_gia.toLocaleString("vi-VN")
                        : 0}{" "}
                      VNĐ
                    </span>
                  </p>
                </div>
                <div className="flex justify-between">
                  <h1 className="text-lg font-semibold">Vận chuyển</h1>
                  <p className="text-base font-semibold">
                    <span>{tong?.tien_ship}</span> VNĐ
                  </p>
                </div>
                <div className="flex justify-between">
                  <h1 className="text-lg font-semibold">
                    Tổng giá trị đơn hàng <br />
                  </h1>
                  <p className="text-lg font-bold">
                    {" "}
                    {(tong?.tong_tien).toLocaleString("vi-VN")} VNĐ
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
                    <button
                      className="w-full py-2 border bg-blue-600 rounded-lg text-white hover:bg-blue-700"
                      onClick={() =>
                        mutate({ id: record.id, action: "Đã xác nhận" })
                      }
                    >
                      Xác nhận đơn hàng
                    </button>{" "}
                    <button
                      className="w-full py-2 border bg-red-500 rounded-lg text-white hover:bg-red-700"
                      onClick={() =>
                        mutate({ id: record.id, action: "Hủy hàng" })
                      }
                    >
                      Hủy
                    </button>
                  </>
                ) : record.trang_thai_don_hang === "Đã xác nhận" ? (
                  <>
                    <button
                      className="w-full py-2 border bg-green-500 rounded-lg text-white hover:bg-green-400"
                      onClick={() =>
                        mutate({ id: record.id, action: "Đang xử lý" })
                      }
                    >
                      Hoàn tất đơn hàng
                    </button>{" "}
                    <button
                      className="w-full py-2 border bg-red-500 rounded-lg text-white hover:bg-red-700 font-semibold"
                      onClick={() =>
                        mutate({ id: record.id, action: "Hủy hàng" })
                      }
                    >
                      Hủy
                    </button>
                  </>
                ) : record.trang_thai_don_hang === "Đang xử lý" ? (
                  <span className="w-full py-1 px-2 text-base font-medium text-yellow-500 border-b-2 border-yellow-500 hover:text-yellow-600 hover:border-yellow-600 transition-all duration-300 ease-in-out cursor-default text-center ">
                    Chờ lấy hàng
                  </span>
                ) : record.trang_thai_don_hang === "Đang giao hàng" ? (
                  <span className="w-full py-1 px-2 text-base font-medium text-purple-500 border-b-2 border-purple-500 hover:text-purple-600 hover:border-purple-600 transition-all duration-300 ease-in-out cursor-default text-center">
                    Đang giao hàng
                  </span>
                ) : record.trang_thai_don_hang === "Hoàn tất đơn hàng" ? (
                  <span className="w-full py-1 px-2 text-base font-medium text-green-500 border-b-2 border-green-500 hover:text-green-600 hover:border-green-600 transition-all duration-300 ease-in-out cursor-default text-center">
                    Hoàn tất đơn hàng
                  </span>
                ) : (
                  <span className="w-full py-1 px-2 text-base font-medium text-red-500 border-b-2 border-red-500 hover:text-red-600 hover:border-red-600 transition-all duration-300 ease-in-out cursor-default text-center">
                    Hủy đơn hàng
                  </span>
                )}
              </div>
            </div>{" "}
            <div className=" bg-slate-100 p-5 border rounded-lg my-2">
              <h5 className="text-blue-800 text-lg">Thông tin khách hàng</h5>
              <hr />
              <h5 className="text-blue-600 my-2">
                {record.ten_nguoi_dat_hang
                  ? record.ten_nguoi_dat_hang
                  : thongtin?.ho + " " + thongtin?.ten}
              </h5>
              <hr />
              <h5 className="text-blue-800 text-lg my-2">Người liên hệ</h5>
              <h5 className="text-black my-2">
                {" "}
                {record.ten_nguoi_dat_hang
                  ? record.ten_nguoi_dat_hang
                  : thongtin?.ho + " " + thongtin?.ten}
              </h5>
              <p className="text-blue-800 font-semibold">
                Số điện thoại :
                <span className="text-black font-medium">
                  {record.so_dien_thoai_nguoi_dat_hang
                    ? record.so_dien_thoai_nguoi_dat_hang
                    : thongtin?.so_dien_thoai}
                </span>
              </p>
              <h5 className="text-blue-800">
                Địa chỉ Giao hàng: <br />
                <span className="text-black">
                  {record?.dia_chi_nguoi_dat_hang
                    ? record?.dia_chi_nguoi_dat_hang
                    : thongtin?.dia_chi}
                </span>
              </h5>
              <p className="text-blue-800 font-semibold">
                Ghi chú của khách hàng : <br />
                <span className="text-black">
                  {record?.ghi_chu ? record?.ghi_chu : "Không có ghi chú"}
                </span>
              </p>
            </div>
            <div className="bg-slate-100 p-5 border rounded-lg my-2 shadow-md">
              <h5 className="text-blue-800 text-lg font-semibold mb-1">
                Đánh giá của khách hàng
              </h5>
              {record.trang_thai_don_hang === "Hoàn tất đơn hàng" && (
                <>
                  {data?.data?.don_hang?.danh_gias?.length > 0 ? (
                    data.data.don_hang.danh_gias.map(
                      (item: any, index: number) => (
                        <div className="my-4" key={index}>
                          <div className="flex items-center mb-2">
                            <img
                              src={
                                item?.user?.anh_nguoi_dung ||
                                "/default-avatar.png"
                              }
                              alt={`${item?.user?.ho} ${item?.user?.ten}`}
                              className="w-12 h-12 rounded-full object-cover border-2 border-blue-800 mr-3"
                            />
                            <div className="pt-2">
                              <h5 className="text-blue-800 text-xl font-medium">
                                {item?.user?.ho} {item?.user?.ten}
                              </h5>
                              {/* Giảm kích thước sao bằng scale-50 */}
                              <Rate disabled defaultValue={2} />
                            </div>
                          </div>
                          <div className="text-blue-800 mx-4 mb-2">
                            <p>
                              <strong></strong>{" "}
                              {item?.mo_ta || "Không có đánh giá."}
                            </p>
                            {item?.phan_hoi && (
                              <p>
                                <strong>Trả lời:</strong> {item?.phan_hoi}
                              </p>
                            )}
                          </div>
                          <div className="flex">
                            <button
                              onClick={() => showModal(record)}
                              disabled={!!item.phan_hoi}
                              className={`px-4 py-2 rounded transition-colors duration-300 ${
                                !!item.phan_hoi
                                  ? "  text-black cursor-not-allowed"
                                  : " text-blue-500 font-bold"
                              }`}
                            >
                              {!!item.phan_hoi ? "Đã phản hồi" : "Phản hồi"}
                            </button>
                            <button className="mx-2 px-4 text-blue-500 ">
                              Ẩn
                            </button>
                          </div>
                        </div>
                      )
                    )
                  ) : (
                    <p className="text-blue-800">Chưa có đánh giá nào.</p>
                  )}
                </>
              )}
              <Modal
                title="Phản hồi đánh giá"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel2}
              >
                {currentEvaluate && (
                  <div className="flex flex-col gap-2">
                    <p>
                      <strong>Đánh giá của khách hàng:</strong>{" "}
                      {currentEvaluate.mo_ta}
                    </p>
                    <Input.TextArea
                      rows={4}
                      value={phan_hoi[currentEvaluate.id as number] || ""}
                      onChange={(e) =>
                        handlephan_hoiChange(
                          currentEvaluate.id as number,
                          e.target.value
                        )
                      }
                      placeholder="Nhập phản hồi"
                      disabled={!!currentEvaluate.phan_hoi}
                    />
                  </div>
                )}
              </Modal>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Detail;
