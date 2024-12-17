import { useQuery } from "@tanstack/react-query";
import { Button, Modal, Spin } from "antd";
import { useState } from "react";
import instance from "@/configs/admin";

const Detail = ({ record }: any) => {
  const [open, setOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["RETURN_ORDER_DETAIL", record.id],
    queryFn: async () => {
      const response = await instance.get(`/hoanhang/chitiet/${record.id}`);
      return response.data;
    },
    enabled: open,
  });
  const [visibleProducts, setVisibleProducts] = useState(2);
  const handleLoadMore = () => {
    setVisibleProducts(products.length);
  };
  const returnOrderDetail = data?.data?.hoan_hang;
  const orderInfo = returnOrderDetail?.don_hang;
  const products = orderInfo?.chi_tiets || [];
  console.log(returnOrderDetail);
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  return (
    <div>
      <Button onClick={() => setOpen(true)} className="hover:opacity-90">
        Xem chi tiết
      </Button>
      <Modal
        centered
        open={open}
        width={1200}
        className="relative"
        footer={null}
        onCancel={() => setOpen(false)}
      >
        <div className="max-h-[100vh] overflow-y-auto px-6 py-4">
          <h1 className="text-2xl font-bold mb-6 sticky top-0 bg-white pb-4 border-b">
            Chi tiết đơn hoàn hàng
          </h1>

          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-9">
              <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-lg mb-2">
                      Mã hoàn hàng:
                      <span className="text-blue-600 ml-2 font-medium">
                        {returnOrderDetail?.ma_hoan_hang}
                      </span>
                    </h4>
                    <p className="text-gray-600">
                      Ngày tạo: {formatDate(returnOrderDetail?.ngay_tao)}
                    </p>
                  </div>
                  <div
                    className={`px-4 py-2 rounded-full font-medium ${
                      returnOrderDetail?.trang_thai_hoan_hang ===
                      "Trả hàng thành công"
                        ? "bg-green-50 text-green-600"
                        : "bg-yellow-50 text-yellow-600"
                    }`}
                  >
                    {returnOrderDetail?.trang_thai_hoan_hang}
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border p-4 mb-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-lg mb-2">Thông tin hoàn hàng</h4>
                    <p className="text-gray-600 flex justify-start">
                      Ngày lấy hàng :{" "}
                      <p className="font-medium ml-1">
                        {formatDate(returnOrderDetail?.ngay_lay_hang) ||
                          "Chưa lấy hàng"}
                      </p>
                    </p>
                    <p className="text-gray-600 flex justify-start -mt-5">
                      Ngày hoàn thành :{" "}
                      <p className="font-medium ml-1">
                        {formatDate(
                          returnOrderDetail?.ngay_hoan_hang_thanh_cong
                        ) || "Chưa hoàn thành"}
                      </p>
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                <div className="p-4 border-b">
                  <h2 className="text-lg font-semibold">Sản phẩm hoàn trả</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr className="*:p-4 *:text-left *:font-medium *:text-gray-600">
                        <th className="w-[45%]">Sản phẩm</th>
                        <th className="w-[15%]">Số lượng</th>
                        <th className="w-[20%]">Đơn giá</th>
                        <th className="w-[20%]">Thành tiền</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                    {products && products.length > 0 ? (
                      products.slice(0, visibleProducts).map((item: any, index: number) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="p-4">
                            <div className="flex gap-4">
                              <img
                                src={
                                  item?.bien_the_san_pham?.san_pham
                                    ?.anh_san_pham
                                }
                                alt=""
                                className="w-20 h-20 object-cover rounded"
                              />
                              <div>
                                <h3 className="font-medium mb-1">
                                  {
                                    item?.bien_the_san_pham?.san_pham
                                      ?.ten_san_pham
                                  }
                                </h3>
                                <div className="text-sm text-gray-600 space-y-1">
                                  <p>
                                    Màu:{" "}
                                    {
                                      item?.bien_the_san_pham?.mau_bien_the
                                        ?.ten_mau_sac
                                    }
                                  </p>
                                  <p>
                                    Size:{" "}
                                    {
                                      item?.bien_the_san_pham
                                        ?.kich_thuoc_bien_the?.kich_thuoc
                                    }
                                  </p>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="p-8">{item?.so_luong}</td>
                          <td className="p-6">
                            {item?.gia?.toLocaleString("vi-VN")}đ
                          </td>
                          <td className="p-6 font-medium">
                            {item?.thanh_tien?.toLocaleString("vi-VN")}đ
                          </td>
                        </tr>
                     ))
                    ) : (
                      <tr>
                        <td colSpan={4}>Không có sản phẩm</td>
                      </tr>
                    )}
                    {visibleProducts < products.length && (
                      <div className="flex  ">
                        <div
                          onClick={handleLoadMore}
                          className="font-bold"
                        >
                           <i className="fa-solid fa-share"></i> Xem thêm ...
                        </div>
                      </div>
                    )}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border mt-6 p-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Tổng tiền sản phẩm</span>
                    <span className="font-medium">
                      {data?.data?.tong_tien_san_pham?.toLocaleString("vi-VN")}đ
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Phí thu hộ (COD)</span>
                    <span className="font-medium">20,000đ</span>
                  </div>
                  <div className="h-px bg-gray-200 my-2"></div>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">
                      Tổng cộng hoàn trả
                    </span>
                    <span className="text-lg font-bold text-blue-600">
                      {(data?.data?.tong_tien_san_pham - 20000)?.toLocaleString(
                        "vi-VN"
                      )}
                      đ
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-span-3 space-y-6">
              <div className="bg-white rounded-lg shadow-sm border p-4">
                <h3 className="text-lg font-semibold mb-4 pb-2 border-b">
                  Thông tin người giao hàng
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-gray-600 mb-1">Họ tên</p>
                    <p className="font-medium">
                      {returnOrderDetail?.shipper?.ho}{" "}
                      {returnOrderDetail?.shipper?.ten}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-1">email</p>
                    <p className="font-medium">
                      {returnOrderDetail?.shipper?.email}{" "}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-1">email</p>
                    <p className="font-medium">
                      {returnOrderDetail?.shipper?.so_dien_thoai}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border p-4">
                <h3 className="text-lg font-semibold mb-4 pb-2 border-b">
                  Thông tin người hoàn hàng
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-gray-600 mb-1">Họ tên</p>
                    <p className="font-medium">
                      {orderInfo?.ten_nguoi_dat_hang}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-1">Số điện thoại</p>
                    <p className="font-medium">
                      {orderInfo?.so_dien_thoai_nguoi_dat_hang}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-1">Địa chỉ</p>
                    <p className="font-medium">
                      {orderInfo?.dia_chi_nguoi_dat_hang}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-1">Lý do hoàn hàng</p>
                    <p className="font-medium">{orderInfo?.li_do_hoan_hang}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Detail;
