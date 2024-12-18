// import instanceClient from "@/configs/client";
// import { useMutation, useQuery } from "@tanstack/react-query";
// import { message, Modal, Spin } from "antd";
// import React, { useEffect, useState } from "react";
//
// interface VoucheruserProps {
//   onSelectVoucher: ({
//     giam_gia,
//     index,
//   }: {
//     giam_gia: number | null;
//     index: string | null;
//   }) => void;
// }
//
// const Voucheruser: React.FC<VoucheruserProps> = ({
//   onSelectVoucher,
//   ap,
//   trangthai,
// }: any) => {
//   console.log(trangthai);
//   const [selectedDiscount, setSelectedDiscount] = useState<number | null>(null);
//   const [giamtoida, setGiamtoida] = useState<number | null>(null);
//   const [open, setOpen] = useState(false);
//   const [code, setCode] = useState("");
//   const [clickedIndex, setClickedIndex] = useState<string | null>(null);
//
//   const handleCancel = () => {
//     setOpen(false);
//   };
//
//   const { mutate } = useMutation({
//     mutationFn: async (index: any) => {
//       try {
//         await instanceClient.post(`/ap-dung-ma-khuyen-mai`, {
//           ma_giam_gia: index,
//         });
//         message.success("Áp dụng mã giảm giá thành công");
//       } catch (error: any) {
//         message.error(error.response.data.message);
//         throw new Error("Error applying voucher");
//       }
//     },
//   });
//   // const handleApply = () => {
//   //   if (selectedDiscount !== null && clickedIndex !== null) {
//   //     mutate(clickedIndex, {
//   //       onSuccess: () => {
//   //         onSelectVoucher({
//   //           giam_gia: selectedDiscount,
//   //           index: clickedIndex,
//   //           giam_toi_da: giamtoida,
//   //         });
//   //         handleCancel();
//   //       },
//   //     });
//   //   } else {
//   //     onSelectVoucher({ giam_gia: null, index: null });
//   //     message.success("Đã bỏ chọn mã giảm giá.");
//   //     handleCancel();
//   //   }
//   // };
//   const [loading, setLoading] = useState(false);
//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setCode(e.target.value);
//   };
//
//   const handleSearch = async () => {
//     setLoading(true);
//     try {
//       if (!code) {
//         // Input rỗng -> hiển thị tất cả
//         await refetch({ code: "" }); // Truyền tham số code rỗng
//         message.success("Hiển thị tất cả mã ưu đãi.");
//       } else if (code.length < 6) {
//         message.error("Mã phải có ít nhất 6 ký tự.");
//       } else {
//         // Input có mã -> tìm kiếm
//         await refetch({ code }); // Tìm kiếm theo mã
//         message.success("Tìm kiếm thành công!");
//       }
//     } catch {
//       message.error("Có lỗi xảy ra khi tải dữ liệu.");
//     } finally {
//       setLoading(false);
//     }
//   };
//
//   const handleClick = ({
//     index,
//     giam_gia,
//     giam_toi_da,
//   }: {
//     index: string;
//     giam_gia: number;
//     giam_toi_da: number;
//   }) => {
//     if (clickedIndex === index) {
//       // Nếu voucher đã được chọn -> Bỏ chọn
//       setClickedIndex(null);
//       setSelectedDiscount(null);
//       setGiamtoida(null);
//       onSelectVoucher({ giam_gia: null, index: null }); // Hủy áp dụng voucher
//     } else {
//       // Chọn voucher mới
//       setClickedIndex(index);
//       setSelectedDiscount(giam_gia);
//       setGiamtoida(giam_toi_da);
//       onSelectVoucher({ giam_gia, index, giam_toi_da }); // Áp dụng voucher ngay lập tức
//     }
//   };
//
//   // console.log(ap);
//   const { data, refetch } = useQuery({
//     queryKey: ["Voucher_LIST"],
//     queryFn: async () => {
//       try {
//         const datas =
//           code || ap !== 0
//             ? { ma_code: code, ap_dung_vi: ap }
//             : { ap_dung_vi: 0 };
//         const response = await instanceClient.post(
//           "ma-uu-dai-theo-gio-hang",
//           datas
//         );
//         return response.data;
//       } catch (error) {
//         throw new Error("Error fetching cart data");
//       }
//     },
//     enabled: false, // Disable automatic fetch on mount
//   });
//   useEffect(() => {
//     // Reset voucher selection when the `trangthai` changes (to remove previously selected voucher)
//     setClickedIndex(null);
//     setSelectedDiscount(null);
//     setGiamtoida(null);
//     onSelectVoucher({ giam_gia: null, index: null, giam_toi_da: null });
//
//     refetch();
//   }, [ap, trangthai, refetch]);
//
//   // console.log(data);
//   const voucher = data?.data;
//   const vouchertrue = voucher
//     ?.map((item: any) => {
//       const today = new Date();
//       const endDate = new Date(item.ma_khuyen_mai.ngay_ket_thuc);
//       const diffTime = endDate.getTime() - today.getTime();
//       const day = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//       // console.log(day);
//       return {
//         ...item,
//         day,
//       };
//     })
//     ?.filter((item: any) => item?.day > 0);
//   // console.log(vouchertrue);
//   return (
//     <div>
//       <span
//         className="rounded-r-lg py-5 flex justify-between w-full pr-5"
//         onClick={() => setOpen(true)}
//       >
//         <div>
//           <i className="fa-regular fa-ticket"></i> Mã giảm giá
//         </div>
//         <i className="fa-solid fa-chevron-up fa-rotate-90"></i>
//       </span>
//       <Modal
//         centered
//         open={open}
//         width={600}
//         okText="Đồng ý"
//         footer={null}
//         onCancel={handleCancel}
//       >
//         <div className="flex items-center justify-center bg-opacity-50">
//           <div className="bg-white rounded-lg w-full p-5">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-semibold">Mã ưu đãi</h2>
//             </div>
//             <div className="flex items-center mb-4">
//               <input
//                 type="text"
//                 placeholder="Nhập mã ưu đãi"
//                 className="border border-gray-300 rounded-md px-4 py-2 w-full mr-2"
//                 maxLength={8}
//                 value={code}
//                 onChange={handleChange}
//               />
//               <button
//                 className={`w-40 px-4 py-2 rounded-md ${"bg-teal-500 text-white"}`}
//                 onClick={handleSearch}
//                 // disabled={code.length < 6}
//               >
//                 {loading ? <Spin size="small" /> : "Tìm kiếm"}
//               </button>
//             </div>
//             <div className="grid grid-cols-1 gap-5 overflow-y-auto ">
//               {voucher && voucher.length > 0 ? (
//                 vouchertrue?.map((item: any, index: number) => (
//                   <div
//                     className={`border rounded-md px-4 flex justify-between items-center mb-4 ${
//                       item?.ap_dung
//                         ? item?.ma_khuyen_mai?.ap_dung_vi == ap
//                           ? "cursor-pointer"
//                           : "opacity-50 cursor-not-allowed"
//                         : "opacity-50 cursor-not-allowed"
//                     } ${
//                       clickedIndex === item?.ma_khuyen_mai?.ma_code
//                         ? item?.ma_khuyen_mai?.ap_dung_vi == 1
//                           ? "border-red-500 border  bg-red-50 shadow-md shadow-black/50"
//                           : "border-teal-500 border  bg-teal-50 shadow-md shadow-black/50"
//                         : ""
//                     }`}
//                     onClick={() =>
//                       item?.ap_dung &&
//                       item?.ma_khuyen_mai?.ap_dung_vi == ap &&
//                       handleClick({
//                         index: item?.ma_khuyen_mai?.ma_code,
//                         giam_gia: item?.ma_khuyen_mai?.giam_gia,
//                         giam_toi_da: item?.ma_khuyen_mai?.giam_toi_da,
//                       })
//                     }
//                     key={index}
//                   >
//                     <div>
//                       <span
//                         className={` text-white text-sm px-2 py-1 rounded ${item?.ma_khuyen_mai?.ap_dung_vi == 1 ? "bg-red-700" : "bg-teal-500"}`}
//                       >
//                         Lựa chọn tốt nhất{" "}
//                         {`${item?.ma_khuyen_mai?.ap_dung_vi == 1 ? "Áp dụng cho ví" : ""}`}
//                       </span>
//                       <h3 className="text-lg font-semibold mt-2 truncate w-80">
//                         {item?.ma_khuyen_mai?.mo_ta}
//                       </h3>
//                       <p className="text-sm text-gray-500">
//                         Giảm{" "}
//                         {item?.ma_khuyen_mai?.giam_gia > 100
//                           ? item?.ma_khuyen_mai?.giam_gia?.toLocaleString(
//                               "vi-VN"
//                             ) + "k"
//                           : item?.ma_khuyen_mai?.giam_gia +
//                             `% tối đa ₫${Number(
//                               item?.ma_khuyen_mai?.giam_toi_da
//                             ).toLocaleString("vi-VN")}`}{" "}
//                         cho đơn từ{" "}
//                         {item?.ma_khuyen_mai?.chi_tieu_toi_thieu?.toLocaleString(
//                           "vi-VN"
//                         )}
//                         k
//                       </p>
//                       <div className="font-mono bg-gray-100 text-gray-700 px-2 py-1 rounded mt-2">
//                         {item?.ma_khuyen_mai?.ma_code}
//                       </div>
//                       <p className="text-sm text-red-500 mt-1">
//                         Sắp hết hạn: Còn {item?.day} ngày
//                       </p>
//                     </div>
//                     <div
//                       className={`${item?.ma_khuyen_mai?.ap_dung_vi == 1 ? "text-red-700" : "text-teal-500"}`}
//                     >
//                       <button
//                         className={`text-sm font-semibold ${
//                           clickedIndex === item?.ma_khuyen_mai?.ma_code
//                             ? "text-blue-500"
//                             : ""
//                         }`}
//                       >
//                         Điều kiện
//                       </button>
//                       <span className="text-2xl ml-4">
//                         {clickedIndex === item?.ma_khuyen_mai?.ma_code
//                           ? "✔️"
//                           : ""}
//                       </span>
//                     </div>
//                   </div>
//                 ))
//               ) : (
//                 <img
//                   src="https://res.cloudinary.com/dcvu7e7ps/image/upload/v1730217496/Screenshot_2024-10-29_225706_vwmhq1.png"
//                   alt="No vouchers available"
//                   className="mx-auto"
//                 />
//               )}
//             </div>
//             {/* <div className="mt-5">
//               <button
//                 className="bg-red-600 text-white w-full py-3 font-semibold hover:bg-red-700"
//                 onClick={handleApply}
//               >
//                 Áp dụng
//               </button>
//             </div> */}
//           </div>
//         </div>
//       </Modal>
//     </div>
//   );
// };
//
// export default Voucheruser;

import { useMutation, useQuery } from "@tanstack/react-query";
import { message, Modal, Spin } from "antd";
import React, { useEffect, useState } from "react";
import instanceClient from "@/configs/client";

interface VoucheruserProps {
  onSelectVoucher: ({
                      giam_gia,
                      index,
                    }: {
    giam_gia: number | null;
    index: string | null;
  }) => void;
}

const Voucheruser: React.FC<VoucheruserProps> = ({
                                                   onSelectVoucher,
                                                   ap,
                                                   trangthai,
                                                 }: any) => {
  const [selectedDiscount, setSelectedDiscount] = useState<number | null>(null);
  const [giamtoida, setGiamtoida] = useState<number | null>(null);
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState("");
  const [clickedIndex, setClickedIndex] = useState<string | null>(null);
  const [errorMessages, setErrorMessages] = useState<string[]>([]);

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

  const [loading, setLoading] = useState(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCode(e.target.value);
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      if (!code) {
        await refetch({ code: "" }); // Truyền tham số code rỗng
        message.success("Hiển thị tất cả mã ưu đãi.");
      } else if (code.length < 6) {
        message.error("Mã phải có ít nhất 6 ký tự.");
      } else {
        await refetch({ code }); // Tìm kiếm theo mã
        message.success("Tìm kiếm thành công!");
      }
    } catch {
      message.error("Có lỗi xảy ra khi tải dữ liệu.");
    } finally {
      setLoading(false);
    }
  };

  const handleClick = ({
                         index,
                         giam_gia,
                         giam_toi_da,
                       }: {
    index: string;
    giam_gia: number;
    giam_toi_da: number;
  }) => {
    if (clickedIndex === index) {
      setClickedIndex(null);
      setSelectedDiscount(null);
      setGiamtoida(null);
      onSelectVoucher({ giam_gia: null, index: null }); // Hủy áp dụng voucher
    } else {
      setClickedIndex(index);
      setSelectedDiscount(giam_gia);
      setGiamtoida(giam_toi_da);
      onSelectVoucher({ giam_gia, index, giam_toi_da }); // Áp dụng voucher
    }
  };

  const { data, refetch } = useQuery({
    queryKey: ["Voucher_LIST"],
    queryFn: async () => {
      try {
        const datas = code || ap !== 0 ? { ma_code: code, ap_dung_vi: ap } : { ap_dung_vi: 0 };
        const response = await instanceClient.post("ma-uu-dai-theo-gio-hang", datas);
        return response.data;
      } catch (error) {
        throw new Error("Error fetching cart data");
      }
    },
    enabled: false, // Disable automatic fetch on mount
  });

  useEffect(() => {
    setClickedIndex(null);
    setSelectedDiscount(null);
    setGiamtoida(null);
    onSelectVoucher({ giam_gia: null, index: null, giam_toi_da: null });
    refetch();
  }, [ap, trangthai, refetch]);

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
      ?.filter((item: any) => item?.day > 0);

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
                    className={`w-40 px-4 py-2 rounded-md ${"bg-teal-500 text-white"}`}
                    onClick={handleSearch}
                >
                  {loading ? <Spin size="small" /> : "Tìm kiếm"}
                </button>
              </div>
              <div className="grid grid-cols-1 gap-5 overflow-y-auto">
                {voucher && voucher.length > 0 ? (
                    vouchertrue?.map((item: any, index: number) => (
                        <div
                            key={index}
                            className={`border rounded-md px-4 flex justify-between items-center mb-4 ${
                                item?.ap_dung
                                    ? item?.ma_khuyen_mai?.ap_dung_vi === 1
                                        ? "cursor-pointer border-red-500 bg-red-50"
                                        : "cursor-pointer border-teal-500 bg-teal-50"
                                    : "opacity-50 cursor-not-allowed"
                            } ${
                                clickedIndex === item?.ma_khuyen_mai?.ma_code
                                    ? "border-2 border-blue-500"
                                    : ""
                            }`}
                            onClick={() =>
                                item?.ap_dung &&
                                item?.ma_khuyen_mai?.ap_dung_vi === ap &&
                                handleClick({
                                  index: item?.ma_khuyen_mai?.ma_code,
                                  giam_gia: item?.ma_khuyen_mai?.giam_gia,
                                  giam_toi_da: item?.ma_khuyen_mai?.giam_toi_da,
                                })
                            }
                        >
                          <div>
                            {index === 0 && (
                                <span className="text-sm text-yellow-500 font-bold">Lựa chọn tốt nhất</span>
                            )}
                            <span
                                className={`text-white text-sm px-2 py-1 rounded ${
                                    item?.ma_khuyen_mai?.ap_dung_vi === 1 ? "bg-red-700" : "bg-teal-500"
                                }`}
                            >
                        {item?.ma_khuyen_mai?.ap_dung_vi === 1
                            ? "Áp dụng ví"
                            : "Mã giảm giá"}
                      </span>
                            <h3 className="text-lg font-semibold mt-2 truncate w-80">
                              {item?.ma_khuyen_mai?.mo_ta}
                            </h3>
                            <p className="text-sm text-gray-500">
                              Giảm{" "}
                              {item?.ma_khuyen_mai?.giam_gia > 100
                                  ? `${item?.ma_khuyen_mai?.giam_gia}k`
                                  : `${item?.ma_khuyen_mai?.giam_gia}% tối đa ₫${item?.ma_khuyen_mai?.giam_toi_da?.toLocaleString("vi-VN") || '0'}`}
                              cho đơn từ{" "}
                              {item?.ma_khuyen_mai?.chi_tieu_toi_thieu?.toLocaleString("vi-VN") || '0'}
                              k
                            </p>
                            <div className="font-mono bg-gray-100 text-gray-700 px-2 py-1 rounded mt-2">
                              {item?.ma_khuyen_mai?.ma_code}
                            </div>
                            <p className="text-sm text-red-500 mt-1">
                              Sắp hết hạn: Còn {item?.day} ngày
                            </p>
                          </div>
                          <div>
                            {item?.ap_dung === false ? (
                                <div className="text-red-500 text-sm">
                                  {item?.error_messages?.join(", ")}
                                </div>
                            ) : (
                                <div className="flex items-center space-x-2">
                                  <input
                                      type="checkbox"
                                      checked={clickedIndex === item?.ma_khuyen_mai?.ma_code}
                                      onChange={() =>
                                          handleClick({
                                            index: item?.ma_khuyen_mai?.ma_code,
                                            giam_gia: item?.ma_khuyen_mai?.giam_gia,
                                            giam_toi_da: item?.ma_khuyen_mai?.giam_toi_da,
                                          })
                                      }
                                  />
                                  <span className="text-sm font-semibold text-teal-500">
                            Chọn mã
                          </span>
                                </div>
                            )}
                          </div>
                          {clickedIndex === item?.ma_khuyen_mai?.ma_code && giamtoida && (
                              <div className="text-sm text-gray-700 mt-2">
                                Giảm tối đa: ₫{giamtoida?.toLocaleString("vi-VN")}
                              </div>
                          )}
                        </div>
                    ))
                ) : (
                    <div className="text-center text-gray-500">Không có mã giảm giá nào.</div>
                )}
              </div>
            </div>
          </div>
        </Modal>
      </div>
  );
};

export default Voucheruser;

