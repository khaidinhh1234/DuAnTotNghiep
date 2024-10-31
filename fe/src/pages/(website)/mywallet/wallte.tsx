
import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import instanceClient from "@/configs/client";
import { SettingOutlined } from '@ant-design/icons';

export const fetchFinanceData = async () => {
    const response = await instanceClient.get(`/vi-tai-khoan`);
    console.log('response',response)
    return response.data?.data;
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
        <SettingOutlined />      </div>

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
          ₫{data?.viUser?.so_du?.toLocaleString() ?? 0}
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

      <div className="bg-white rounded-lg p-4 shadow-sm mt-6">
        <h2 className="text-lg font-semibold mb-4">Lịch sử Giao Dịch</h2>
        {data?.lichSuGiaoDich?.length > 0 ? (
          <ul>
            {data.lichSuGiaoDich.map((transaction: any, index: number) => (
              <li key={index} className="flex justify-between items-center border-b py-2">
                <div>
                  <p className="text-sm font-medium">{transaction.description}</p>
                  <p className="text-xs text-gray-500">{transaction.created_at}</p>
                </div>
                <p className="text-sm font-semibold">
                  {transaction.amount}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500">Không có giao dịch nào</p>
        )}
      </div>
    </div>
  );
}

export default TaiChinh;
