import instanceClient from "@/configs/client";
import { useQuery } from "@tanstack/react-query";
import React from "react";

const History = () => {
  const { data } = useQuery({
    queryKey: ["MyOrderhistory"],
    queryFn: async () => {
      try {
        const response = await instanceClient.get("momo-transactions");
        if (response.status !== 200) {
          throw new Error("Lỗi khi lấy thông tin");
        }
        return response.data;
      } catch (error) {
        throw new Error("Lỗi khi lấy thông tin");
      }
    },
  });
  const lichsu = data?.data || [];
  const lichsus = lichsu.map((item: any) => {
    const dateISO = item.created_at.split("T")[0];
    const dateVN = dateISO.split("-").reverse().join("-");
    // console.log(dateVN);
    return {
      ngay: dateVN,
      ...item,
    };
  });
  // console.log(lichsus);
  return (
    <div>
      <div>
        <div className="bg-white rounded-lg shadow-lg p-6 border">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Lịch sử Giao Dịch
          </h2>
          {/* No transactions message */}

          {/* Table */}
          <table
            className="w-full text-left border-collapse"
            v-if="transactions.length"
          >
            <thead>
              <tr className="text-gray-600 uppercase text-sm leading-normal bg-gray-100">
                <th className="py-3 px-4 border-b">Mã giao dịch</th>
                <th className="py-3 px-4 border-b">Mã đơn hàng</th>
                <th className="py-3 px-4 border-b">TT thanh toán</th>
                <th className="py-3 px-4 border-b">PT thanh toán</th>
                <th className="py-3 px-4 border-b">Ngày thanh toán</th>
                <th className="py-3 px-4 border-b">Tổng giá trị</th>
                <th className="py-3 px-4 border-b">Loại thẻ</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 text-sm font-light">
              {lichsus.length != 0 ? (
                lichsus?.map((item: any) => (
                  <tr className="hover:bg-gray-50" key={item?.id}>
                    <td className="py-3 px-4 border-b">{item.transId}</td>
                    <td className="py-3 px-4 border-b">{item.orderId}</td>
                    <td className="py-3 px-4 border-b">
                      {item.don_hang.trang_thai_thanh_toan}
                    </td>
                    <td className="py-3 px-4 border-b">
                      {item.don_hang.phuong_thuc_thanh_toan === "Momo_ATM"
                        ? "Thanh toán qua Thẻ ATM"
                        : "Thanh toán qua MoMo QR"}
                    </td>
                    <td className="py-3 px-4 border-b">{item?.ngay}</td>
                    <td className="py-3 px-4 border-b">
                      {item?.amount?.toLocaleString("vi-VN")}₫
                    </td>
                    <td className="py-3 px-4 border-b text-blue-500 font-semibold">
                      {item.don_hang.phuong_thuc_thanh_toan === "Momo_ATM" ? ( // ATM
                        <span>Thẻ ATM</span>
                      ) : (
                        <span>MoMo QR</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <table className="w-full text-center" v-else>
                  <tbody>
                    <tr>
                      <td className="text-gray-500 py-4">
                        Không có giao dịch nào
                      </td>
                    </tr>
                  </tbody>
                </table>
              )}
              {/* <tr className="hover:bg-gray-50">
                <td className="py-3 px-4 border-b">30/10/2024</td>
                <td className="py-3 px-4 border-b">#123455</td>
                <td className="py-3 px-4 border-b">Thất bại</td>
                <td className="py-3 px-4 border-b">Thẻ tín dụng</td>
                <td className="py-3 px-4 border-b">30/10/2024</td>
                <td className="py-3 px-4 border-b">₫250,000</td>
                <td className="py-3 px-4 border-b text-red-500 font-semibold">
                  Mastercard
                </td>
              </tr> */}
              {/* Add more rows as needed */}
            </tbody>
          </table>

          {/* Display if there are no transactions */}
        </div>
      </div>
    </div>
  );
};

export default History;
