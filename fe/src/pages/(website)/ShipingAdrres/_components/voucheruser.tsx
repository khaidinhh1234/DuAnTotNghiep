import instanceClient from "@/configs/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button, message, Modal } from "antd";
import React, { useState } from "react";

interface VoucheruserProps {
  onSelectVoucher: ({
    giam_gia,
    index,
  }: {
    giam_gia: number | null;
    index: string | null;
  }) => void;
}

const Voucheruser: React.FC<VoucheruserProps> = ({ onSelectVoucher }) => {
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
      } catch (error) {
        message.error("Có lỗi xảy ra khi áp dụng mã giảm giá");
        throw new Error("Error applying voucher");
      }
    },
    onError: (error) => {
      console.error(error);
      alert("Có lỗi xảy ra khi áp dụng mã giảm giá. Vui lòng thử lại!");
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
      alert("Vui lòng chọn mã giảm giá trước khi áp dụng.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCode(e.target.value.toUpperCase());
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

  const { data } = useQuery({
    queryKey: ["Voucher"],
    queryFn: async () => {
      try {
        const response = await instanceClient.get(
          `/ma-uu-dai-cho-nguoi-dung-cu-the`
        );

        return response.data;
      } catch (error) {
        throw new Error("Error fetching cart data");
      }
    },
  });

  const voucher = data?.data;

  return (
    <div>
      <button
        className="rounded-r-lg py-5 flex justify-between w-full pr-5"
        onClick={() => setOpen(true)}
      >
        <div>
          <i className="fa-regular fa-ticket"></i> Mã giảm giá
        </div>
        <i className="fa-solid fa-chevron-up fa-rotate-90"></i>
      </button>
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
                maxLength={6}
                value={code}
                onChange={handleChange}
              />
              <button
                className={`w-40 px-4 py-2 rounded-md ${
                  code.length >= 6
                    ? "bg-teal-500 text-white"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                }`}
                disabled={code.length !== 6}
              >
                Sử dụng
              </button>
            </div>
            <div className="grid grid-cols-1 gap-5 overflow-y-auto h-96">
              {voucher && voucher.length > 0 ? (
                voucher.map((item: any, index: number) => (
                  <div
                    className={`border rounded-md px-4 flex justify-between items-center mb-4 ${
                      clickedIndex === item?.ma_code
                        ? "border border-teal-500 bg-teal-50 shadow-md shadow-black/50"
                        : ""
                    }`}
                    key={index}
                  >
                    <div>
                      <span className="bg-teal-500 text-white text-sm px-2 py-1 rounded">
                        Lựa chọn tốt nhất
                      </span>
                      <h3 className="text-lg font-semibold mt-2">
                        {item?.mo_ta}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Giảm{" "}
                        {item?.giam_gia > 100
                          ? item?.giam_gia.toLocaleString("vi-VN") + "k"
                          : item?.giam_gia + "%"}{" "}
                        cho đơn từ{" "}
                        {item?.chi_tieu_toi_thieu.toLocaleString("vi-VN")}k
                      </p>
                      <div className="font-mono bg-gray-100 text-gray-700 px-2 py-1 rounded mt-2">
                        {item?.ma_code}
                      </div>
                      <p className="text-sm text-red-500 mt-1">
                        Sắp hết hạn: Còn 2 ngày
                      </p>
                    </div>
                    <div className="text-teal-500">
                      <button
                        className={`text-sm font-semibold ${
                          clickedIndex === item?.ma_code ? "text-blue-500" : ""
                        }`}
                        onClick={() =>
                          handleClick({
                            index: item.ma_code,
                            giam_gia: item.giam_gia,
                          })
                        }
                      >
                        Điều kiện
                      </button>
                      <span className="text-2xl ml-4">
                        {clickedIndex === item?.ma_code ? "✔️" : ""}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <img
                  src="https://res.cloudinary.com/dcvu7e7ps/image/upload/v1730217496/Screenshot_2024-10-29_225706_vwmhq1.png"
                  alt="No vouchers available"
                  className="mx-auto"
                />
              )}
            </div>
            <div className="mt-5">
              <button
                className="bg-red-600 text-white w-full py-3 font-semibold hover:bg-red-700"
                onClick={handleApply}
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
