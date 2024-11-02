import React from "react";

const History = () => {
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
              <tr className="hover:bg-gray-50">
                <td className="py-3 px-4 border-b">01/11/2024</td>
                <td className="py-3 px-4 border-b">#123456</td>
                <td className="py-3 px-4 border-b">Thành công</td>
                <td className="py-3 px-4 border-b">Chuyển khoản</td>
                <td className="py-3 px-4 border-b">01/11/2024</td>
                <td className="py-3 px-4 border-b">₫500,000</td>
                <td className="py-3 px-4 border-b text-blue-500 font-semibold">
                  Visa
                </td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="py-3 px-4 border-b">30/10/2024</td>
                <td className="py-3 px-4 border-b">#123455</td>
                <td className="py-3 px-4 border-b">Thất bại</td>
                <td className="py-3 px-4 border-b">Thẻ tín dụng</td>
                <td className="py-3 px-4 border-b">30/10/2024</td>
                <td className="py-3 px-4 border-b">₫250,000</td>
                <td className="py-3 px-4 border-b text-red-500 font-semibold">
                  Mastercard
                </td>
              </tr>
              {/* Add more rows as needed */}
            </tbody>
          </table>

          {/* Display if there are no transactions */}
          <table className="w-full text-center" v-else>
            <tbody>
              <tr>
                <td className="text-gray-500 py-4">Không có giao dịch nào</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default History;
