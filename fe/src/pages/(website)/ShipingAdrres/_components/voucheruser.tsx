import instanceClient from "@/configs/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { message, Modal } from "antd";
import React, { useEffect, useState } from "react";

interface VoucheruserProps {
  onSelectVoucher: ({
                      giam_gia,
                      index,
                    }: {
    giam_gia: number | null;
    index: string | null;
  }) => void;
}

const Voucheruser: React.FC<VoucheruserProps> = ({ onSelectVoucher, ap }: any) => {
  const [selectedDiscount, setSelectedDiscount] = useState<number | null>(null);
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState("");
  const [clickedIndex, setClickedIndex] = useState<string | null>(null);

  const handleCancel = () => {
    setOpen(false);
  };

  const { mutate } = useMutation({
    mutationFn: async (index: any) => {
      try {
        await instanceClient.post(`/ap-dung-ma-khuyen-mai`, {
          ma_giam_gia: index,
        });
        message.success("Áp dụng mã giảm giá thành công");
      } catch (error: any) {
        message.error(error.response.data.message);
        throw new Error("Error applying voucher");
      }
    },
  });

  const handleApply = () => {
    if (selectedDiscount !== null && clickedIndex !== null) {
      mutate(clickedIndex, {
        onSuccess: () => {
          onSelectVoucher({ giam_gia: selectedDiscount, index: clickedIndex });
          handleCancel();
        },
      });
    } else {
      message.error("Vui lòng chọn mã giảm giá trước khi áp dụng.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCode(e.target.value.toUpperCase());
    const value = e.target.value.toUpperCase();
    if (value === "") {
      refetch(); // Gọi lại API để hiển thị toàn bộ danh sách nếu code rỗng
    }
  };

  const handleSearch = () => {
    if (code.length >= 6) {
      refetch(); // Refetch data when search button is clicked and code has a valid length
    } else {
      message.error("Mã phải có ít nhất 6 ký tự.");
    }
  };

  const handleClick = ({
                         index,
                         giam_gia,
                       }: {
    index: string;
    giam_gia: number;
  }) => {
    const newIndex = clickedIndex === index ? null : index;
    setClickedIndex(newIndex);
    setSelectedDiscount(newIndex ? giam_gia : null);
  };

  const { data, refetch } = useQuery({
    queryKey: ["Voucher_LIST"],
    queryFn: async () => {
      try {
        const datas =
            code || ap !== 0
                ? { ma_code: code, ap_dung_vi: ap }
                : { ap_dung_vi: 0 };
        const response = await instanceClient.post(
            "ma-uu-dai-theo-gio-hang",
            datas
        );
        return response.data;
      } catch (error) {
        throw new Error("Error fetching cart data");
      }
    },
    enabled: false, // Disable automatic fetch on mount
  });

  useEffect(() => {
    refetch();
  }, [ap, refetch]);

  const voucher = data?.data;
  const vouchertrue = voucher
      ?.map((item: any) => {
        const today = new Date();
        const endDate = new Date(item.ma_khuyen_mai.ngay_ket_thuc);
        const diffTime = endDate.getTime() - today.getTime();
        const day = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return {
          ...item,
          day,
        };
      })
      ?.filter((item: any) => item?.day > 0); // Filter out expired vouchers

  return (
      <div>
      <span
          className="rounded-r-lg py-5 flex justify-between w-full pr-5"
          onClick={() => setOpen(true)}
      >
        <div>
          <i className="fa-regular fa-ticket"></i> Mã giảm giá
        </div>
        <i className="fa-solid fa-chevron-up fa-rotate-90"></i>
      </span>
        <Modal
            centered
            open={open}
            width={600}
            okText="Đồng ý"
            footer={null}
            onCancel={handleCancel}
        >
          <div className="flex items-center justify-center bg-opacity-50">
            <div className="bg-white rounded-lg w-full p-5">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Mã ưu đãi</h2>
              </div>
              <div className="flex items-center mb-4">
                <input
                    type="text"
                    placeholder="Nhập mã ưu đãi"
                    className="border border-gray-300 rounded-md px-4 py-2 w-full mr-2"
                    maxLength={8}
                    value={code}
                    onChange={handleChange}
                />
                <button
                    className={`w-40 px-4 py-2 rounded-md ${
                        code.length >= 6
                            ? "bg-teal-500 text-white"
                            : "bg-gray-200 text-gray-500 cursor-not-allowed"
                    }`}
                    onClick={handleSearch}
                >
                  Tìm kiếm
                </button>
              </div>
              <div className="grid grid-cols-1 gap-5 overflow-y-auto h-96">
                {voucher && voucher.length > 0 ? (
                    vouchertrue?.map((item: any, index: number) => (
                        <div
                            className={`border rounded-md px-4 flex justify-between items-center mb-4 ${
                                item?.ap_dung
                                    ? item?.ma_khuyen_mai?.ap_dung_vi == ap
                                        ? "cursor-pointer"
                                        : "opacity-50 cursor-not-allowed"
                                    : "opacity-50 cursor-not-allowed"
                            } ${
                                clickedIndex === item?.ma_khuyen_mai?.ma_code
                                    ? item?.ma_khuyen_mai?.ap_dung_vi == 1
                                        ? "border-red-500 border bg-red-50 shadow-md shadow-black/50"
                                        : "border-teal-500 border bg-teal-50 shadow-md shadow-black/50"
                                    : ""
                            }`}
                            onClick={() =>
                                item?.ap_dung &&
                                item?.ma_khuyen_mai?.ap_dung_vi == ap &&
                                handleClick({
                                  index: item?.ma_khuyen_mai?.ma_code,
                                  giam_gia: item?.ma_khuyen_mai?.giam_gia,
                                })
                            }
                            key={index}
                        >
                          <div>
                            {/* First Voucher - Lựa chọn tốt nhất */}
                            {index === 0 && (
                                <span className="text-white text-sm px-2 py-1 rounded bg-red-700">
                          Lựa chọn tốt nhất
                        </span>
                            )}
                            <h3 className="text-lg font-semibold mt-2 truncate w-80">
                              {item?.ma_khuyen_mai?.mo_ta}
                            </h3>
                            <p className="text-sm text-gray-500">
                              Giảm{" "}
                              {item?.so_tien_giam_gia
                                  ? item?.so_tien_giam_gia.toLocaleString("vi-VN") + " VND"
                                  : item?.ma_khuyen_mai?.giam_gia + "%"}{" "}
                              cho đơn từ{" "}
                              {item?.ma_khuyen_mai?.chi_tieu_toi_thieu.toLocaleString("vi-VN")}
                              k
                            </p>
                            <div className="font-mono bg-gray-100 text-gray-700 px-2 py-1 rounded mt-2">
                              {item?.ma_khuyen_mai?.ma_code}
                            </div>
                            <p className="text-sm text-red-500 mt-1">
                              Sắp hết hạn: Còn {item?.day} ngày
                            </p>
                            {/* Error Messages */}
                            {item?.error_messages.length > 0 && (
                                <div className="mt-2">
                                  <ul className="text-red-500">
                                    {item?.error_messages.map((msg: string, idx: number) => (
                                        <li key={idx}>{msg}</li>
                                    ))}
                                  </ul>
                                </div>
                            )}
                          </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center">Không có mã ưu đãi phù hợp.</p>
                )}
              </div>
              <div className="flex justify-between items-center mt-4">
                <button
                    onClick={handleCancel}
                    className="bg-gray-300 px-4 py-2 rounded-md"
                >
                  Đóng
                </button>
                <button
                    onClick={handleApply}
                    className="bg-teal-500 text-white px-4 py-2 rounded-md"
                >
                  Áp dụng
                </button>
              </div>
            </div>
          </div>
        </Modal>
      </div>
  );
};

export default Voucheruser;
