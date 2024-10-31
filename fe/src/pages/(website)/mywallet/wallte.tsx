// import React from 'react';
// import { Link } from 'react-router-dom';

// function TaiChinh() {
//   // Sample transaction data
//   const transactions = [
//     { id: 1, description: 'Thanh toán đơn hàng #123', amount: '-₫200,000', date: '2024-10-20' },
//     { id: 2, description: 'Nạp tiền vào tài khoản', amount: '+₫500,000', date: '2024-10-18' },
//     { id: 3, description: 'Rút tiền', amount: '-₫100,000', date: '2024-10-15' },
//   ];

//   return (
//     <div className="p-4 min-h-screen">
//       {/* Header */}
//       <div className="flex items-center justify-between mb-4">
//         <button className="text-red-500">
//           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
//           </svg>
//         </button>
//         <h1 className="text-lg font-semibold">Tài chính</h1>
//         <button className="text-red-500">
//           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zM4.928 4.928a9.003 9.003 0 0112.728 0l1.414-1.414a1 1 0 111.414 1.414L18.07 6.342a9.003 9.003 0 010 12.728l1.414 1.414a1 1 0 11-1.414 1.414L16.656 18.07a9.003 9.003 0 01-12.728 0L2.514 19.484a1 1 0 11-1.414-1.414L4.93 16.656a9.003 9.003 0 010-12.728L3.516 4.93a1 1 0 011.414-1.414L4.928 4.928z" />
//           </svg>
//         </button>
//       </div>

//       {/* Container */}
//       <div className="bg-white rounded-lg p-4 shadow-sm">
//         {/* Tổng số dư */}
//         <div className="flex justify-between items-center">
//           <div>
//             <span className="text-lg font-semibold">Tổng số dư</span>
//             <a href="#" className="ml-2 text-gray-500 text-sm">Lịch sử GD &gt;</a>
//           </div>
//           <button className="bg-gray-300 text-gray-500 rounded-lg px-3 py-1 cursor-not-allowed">
//             Rút tiền
//           </button>
//         </div>

//         {/* Số dư */}
//         <div className="text-red-500 text-4xl font-semibold my-4">₫0</div>

//         {/* Doanh Thu Đơn Hàng */}
//         <div className="flex items-center justify-between">
//           <Link to="/mypro/doangthu" className="flex items-center">
//             <div className="bg-red-500 text-white p-3 rounded-lg">
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
//               </svg>
//             </div>
//             <span className="ml-4 text-xl font-semibold">Doanh Thu Đơn Hàng</span>
//           </Link>
//           <div className="text-gray-400">
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
//             </svg>
//           </div>
//         </div>
//       </div>

//       {/* Transaction History */}
//       <div className="bg-white rounded-lg p-4 shadow-sm mt-6">
//         <h2 className="text-lg font-semibold mb-4">Lịch sử Giao Dịch</h2>
//         <ul>
//           {transactions.map(transaction => (
//             <li key={transaction.id} className="flex justify-between items-center border-b py-2">
//               <div>
//                 <p className="text-sm font-medium">{transaction.description}</p>
//                 <p className="text-xs text-gray-500">{transaction.date}</p>
//               </div>
//               <p className={`text-sm font-semibold ${transaction.amount.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
//                 {transaction.amount}
//               </p>
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// }

// export default TaiChinh;


import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import instanceClient from "@/configs/client";

export const fetchFinanceData = async () => {
    const response = await instanceClient.get(`${}/finance`);
    return response.data;
  };
function TaiChinh() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['financeData'],
    queryFn: fetchFinanceData,
  });

  if (isLoading) {
    return <div className="p-4">Loading...</div>;
  }

  if (error) {
    return <div className="p-4">Error loading finance data</div>;
  }

  return (
    <div className="p-4 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button className="text-red-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-lg font-semibold">Tài chính</h1>
        <button className="text-red-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zM4.928 4.928a9.003 9.003 0 0112.728 0l1.414-1.414a1 1 0 111.414 1.414L18.07 6.342a9.003 9.003 0 010 12.728l1.414 1.414a1 1 0 11-1.414 1.414L16.656 18.07a9.003 9.003 0 01-12.728 0L2.514 19.484a1 1 0 11-1.414-1.414L4.93 16.656a9.003 9.003 0 010-12.728L3.516 4.93a1 1 0 011.414-1.414L4.928 4.928z" />
          </svg>
        </button>
      </div>

      {/* Container */}
      <div className="bg-white rounded-lg p-4 shadow-sm">
        {/* Tổng số dư */}
        <div className="flex justify-between items-center">
          <div>
            <span className="text-lg font-semibold">Tổng số dư</span>
            <a href="#" className="ml-2 text-gray-500 text-sm">Lịch sử GD &gt;</a>
          </div>
          <button className="bg-gray-300 text-gray-500 rounded-lg px-3 py-1 cursor-not-allowed">
            Rút tiền
          </button>
        </div>

        {/* Số dư */}
        <div className="text-red-500 text-4xl font-semibold my-4">
          ₫{data?.balance.toLocaleString() ?? 0}
        </div>

        {/* Doanh Thu Đơn Hàng */}
        <div className="flex items-center justify-between">
          <Link to="/mypro/doangthu" className="flex items-center">
            <div className="bg-red-500 text-white p-3 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <span className="ml-4 text-xl font-semibold">Doanh Thu Đơn Hàng</span>
          </Link>
          <div className="text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-lg p-4 shadow-sm mt-6">
        <h2 className="text-lg font-semibold mb-4">Lịch sử Giao Dịch</h2>
        <ul>
          {data?.transactions.map(transaction => (
            <li key={transaction.id} className="flex justify-between items-center border-b py-2">
              <div>
                <p className="text-sm font-medium">{transaction.description}</p>
                <p className="text-xs text-gray-500">{transaction.date}</p>
              </div>
              <p className={`text-sm font-semibold ${transaction.amount.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                {transaction.amount}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default TaiChinh;
