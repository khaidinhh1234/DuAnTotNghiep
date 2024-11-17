import instance from "@/configs/admin";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Image, message, Modal } from "antd";
import { useEffect, useState } from "react";

const ReturnOrderDetail = ({ record }: any) => {
  const [modalWidth, setModalWidth] = useState(400);
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const id = record?.id;

  useEffect(() => {
    const updateWidth = () => {
      setModalWidth(window.innerWidth >= 768 ? 1200 : 400);
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const { data } = useQuery({
    queryKey: ["RETURN_ORDER", id],
    queryFn: async () => {
      const response = await instance.get(`/hoanhang/chitiet/${id}`);
      return response.data;
    },
    enabled: !!id,
  });

  const returnOrder = data?.data?.hoan_hang;
  const products = data?.data?.hoan_hang?.don_hang?.chi_tiets;
  const thongtin = data?.data?.thong_tin;
  const donhang = data?.data?.hoan_hang?.don_hang;

  const { mutateAsync: mutate } = useMutation({
    mutationFn: async ({ id, action }: any) => {
      try {
        const response = await instance.put("/hoanhang/xac-nhan-hoan-hang", {
          trang_thai_hoan_hang: action,
          id: [id],
        });
        return response.data;
      } catch (error) {
        message.error("Lỗi xảy ra");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["RETURN_ORDER"] });
      message.success("Cập nhật trạng thái thành công");
    },
  });

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <div>
      <p onClick={() => setOpen(true)}>
        <div className="relative">
          <div>
            <h1 className="text-base md:text-lg">
              Mã Hoàn hàng: <span>{returnOrder?.ma_hoan_hang}</span> <br />
              Ngày tạo:{" "}
              <span>
                {new Date(returnOrder?.ngay_tao).toLocaleDateString("vi-VN")}
              </span>
            </h1>
          </div>
          <div className="flex flex-col md:flex-row items-start space-y-4 md:space-x-4 mb-4">
            <div className="w-full md:w-3/4">
              {products?.map((product: any) => (
                <div key={product.id} className="flex mb-4 border-b pb-4">
                  <img
                    src={product?.bien_the_san_pham?.san_pham?.anh_san_pham}
                    alt="Product"
                    className="w-20 h-20 md:w-24 md:h-28 object-cover rounded mr-4"
                  />
                  <div className="flex flex-col justify-between w-full">
                    <h3 className="text-sm md:text-lg font-semibold truncate hover:text-red-500 cursor-pointer">
                      {product?.bien_the_san_pham?.san_pham?.ten_san_pham}
                    </h3>
                    <div className="text-xs md:text-base text-gray-500 mt-1">
                      Size:{" "}
                      {
                        product?.bien_the_san_pham?.kich_thuoc_bien_the
                          ?.kich_thuoc
                      }
                      , Màu:{" "}
                      {product?.bien_the_san_pham?.mau_bien_the?.ten_mau_sac}
                    </div>
                    <span className="text-xs md:text-lg text-gray-500 mt-1">
                      x{product.so_luong}
                    </span>
                    {/* <div className="flex items-end mt-2">
                      <span className="text-base md:text-xl font-semibold text-red-500">
                        ₫{product?.gia?.toLocaleString("vi-VN")}
                      </span>
                    </div> */}
                    <div className="flex items-end mt-2">
                      <span className="text-xs sm:text-base text-gray-500 line-through mr-1">
                        ₫
                        {product?.bien_the_san_pham?.gia_ban?.toLocaleString(
                          "vi-VN"
                        ) || "0"}
                      </span>
                      <span className="text-base sm:text-xl font-semibold text-red-500">
                        ₫
                        {product?.bien_the_san_pham?.gia_khuyen_mai?.toLocaleString(
                          "vi-VN"
                        ) || "0"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="w-full md:w-1/4 flex flex-col items-end space-y-2 p-4">
              <div>
                <span
                  className={`font-bold
                    ${returnOrder?.trang_thai_hoan_hang === "Chờ lấy hàng hoàn" ? "text-yellow-500" : ""}
                  ${returnOrder?.trang_thai_hoan_hang === "Đang vận chuyển" ? "text-blue-500" : ""}
                  ${returnOrder?.trang_thai_hoan_hang === "Trả hàng thành công" ? "text-green-500" : ""}
                `}
                >
                  {returnOrder?.trang_thai_hoan_hang}
                </span>
              </div>
              <p className="text-xs md:text-lg text-gray-800">
                Tổng số tiền ({data?.data?.tong_so_luong} sản phẩm):{" "}
                {data?.data?.tong_tien_san_pham?.toLocaleString("vi-VN")} ₫
              </p>
            </div>
          </div>
        </div>
      </p>

      <Modal
        centered
        open={open}
        width={modalWidth}
        okText="Đồng ý"
        footer={null}
        onCancel={handleCancel}
      >
        <div className="p-4 bg-white min-h-screen">
          <div className="flex items-center space-x-2 text-lg font-semibold text-gray-700">
            <span>Thông tin đơn hoàn hàng</span>
          </div>

          <div className="bg-white rounded-md shadow-md p-4 mt-4">
            <div>
              <p className="text-gray-700 font-semibold">Thông tin hoàn hàng</p>
              <p className="text-gray-500 text-sm">
                Mã hoàn hàng: {returnOrder?.ma_hoan_hang}
              </p>
            </div>

            <div className="bg-white rounded-md shadow-md p-4 mt-4">
              <p className="text-gray-700 font-semibold">Địa chỉ hoàn hàng</p>
              <p className="text-gray-500 text-sm">
                {thongtin?.ten_nguoi_dat_hang} -{" "}
                {thongtin?.so_dien_thoai_nguoi_dat_hang}
              </p>
              <p className="text-gray-500 text-sm">
                {thongtin?.dia_chi_nguoi_dat_hang}
              </p>
              <p className="text-gray-500 text-sm">
                Lý do hoàn hàng: {donhang?.li_do_hoan_hang || "Không có"}
              </p>
              {donhang?.hinh_anh_hoan_tra && (
                <div className="text-right mt-4 sm:mt-0">
                  <p className="font-semibold mb-2 text-gray-700">
                    Hình ảnh hoàn trả:
                  </p>
                  <Image
                    src={donhang.hinh_anh_hoan_tra}
                    alt="Hình ảnh hoàn trả"
                    className="w-full max-w-[150px] sm:max-w-[200px] md:max-w-[250px] rounded-lg mx-auto"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-md shadow-md p-4 mt-4 relative">
            <div>
              <h1 className="text-base md:text-lg">
                Mã Hoàn hàng: <span>{returnOrder?.ma_hoan_hang}</span> <br />
              </h1>
            </div>
            <div className="flex flex-col md:flex-row items-start space-y-4 md:space-x-4 mb-4">
              <div className="w-full md:w-3/4">
                {products?.map((product: any) => (
                  <div key={product.id} className="flex mb-4 border-b pb-4">
                    <img
                      src={product?.bien_the_san_pham?.san_pham?.anh_san_pham}
                      alt="Product"
                      className="w-20 h-20 md:w-24 md:h-28 object-cover rounded mr-4"
                    />
                    <div className="flex flex-col justify-between w-full">
                      <h3 className="text-sm md:text-lg font-semibold truncate hover:text-red-500 cursor-pointer">
                        {product?.bien_the_san_pham?.san_pham?.ten_san_pham}
                      </h3>
                      <div className="text-xs md:text-base text-gray-500 mt-1">
                        Size:{" "}
                        {
                          product?.bien_the_san_pham?.kich_thuoc_bien_the
                            ?.kich_thuoc
                        }
                        , Màu:{" "}
                        {product?.bien_the_san_pham?.mau_bien_the?.ten_mau_sac}
                      </div>
                      <span className="text-xs md:text-lg text-gray-500 mt-1">
                        x{product.so_luong}
                      </span>
                      <div className="flex items-end mt-2">
                        <span className="text-xs sm:text-base text-gray-500 line-through mr-1">
                          ₫
                          {product?.bien_the_san_pham?.gia_ban?.toLocaleString(
                            "vi-VN"
                          ) || "0"}
                        </span>
                        <span className="text-base sm:text-xl font-semibold text-red-500">
                          ₫
                          {product?.bien_the_san_pham?.gia_khuyen_mai?.toLocaleString(
                            "vi-VN"
                          ) || "0"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="w-full md:w-1/4 flex flex-col items-end space-y-2 p-4">
                <div>
                  <span
                    className={`font-bold
                    ${returnOrder?.trang_thai_hoan_hang === "Chờ lấy hàng hoàn" ? "text-yellow-500" : ""}
                  ${returnOrder?.trang_thai_hoan_hang === "Đang vận chuyển" ? "text-blue-500" : ""}
                  ${returnOrder?.trang_thai_hoan_hang === "Trả hàng thành công" ? "text-green-500" : ""}
                `}
                  >
                    {returnOrder?.trang_thai_hoan_hang}
                  </span>
                </div>

                <div className="absolute bottom-4 right-4 text-right">
                  <p className="md:text-lg text-gray-700">
                    Thành tiền:{" "}
                    <span className="font-semibold text-red-500">
                      {data?.data?.hoan_hang?.don_hang?.tong_tien_don_hang?.toLocaleString(
                        "vi-VN"
                      )}{" "}
                      ₫{" "}
                    </span>
                  </p>
                  <p className="md:text-lg font-bold text-gray-700 mt-1">
                    Tổng tiền COD:{" "}
                    <span className="font-bold text-red-500">
                      {data?.data?.hoan_hang?.don_hang?.tong_tien_don_hang?.toLocaleString(
                        "vi-VN"
                      )}{" "}
                      ₫
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-md shadow-md p-4 mt-4">
            <div className="flex flex-col gap-2">
              {returnOrder?.trang_thai_hoan_hang === "Chờ lấy hàng hoàn" && (
                <button
                  className="w-full py-2 border bg-blue-600 rounded-lg text-white hover:bg-blue-700"
                  onClick={() =>
                    mutate({ id: record.id, action: "Đang vận chuyển" })
                  }
                >
                  Lấy hàng hoàn
                </button>
              )}
              {returnOrder?.trang_thai_hoan_hang === "Đang vận chuyển" && (
                <button
                  className="w-full py-2 border bg-green-600 rounded-lg text-white hover:bg-green-700"
                  onClick={() =>
                    mutate({ id: record.id, action: "Trả hàng thành công" })
                  }
                >
                  Xác nhận trả hàng thành công
                </button>
              )}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ReturnOrderDetail;
