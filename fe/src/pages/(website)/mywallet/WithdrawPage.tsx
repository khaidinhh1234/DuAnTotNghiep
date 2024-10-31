import React, { useState } from 'react';
import instanceClient from '@/configs/client';
import { useQuery } from '@tanstack/react-query';
import { useLocation, useNavigate } from 'react-router-dom';

interface WithdrawPageProps {
  bankData: {
    bankName: string;
    accountNumber: string;
    logo?: string;
    accountHolder: string;
  };
}

export const fetchFinanceData = async () => {
  const response = await instanceClient.get(`/vi-tai-khoan`);
  return response.data?.data;
};

const submitWithdrawal = async (withdrawalData: {
  ngan_hang: string;
  tai_khoan_ngan_hang: string;
  so_tien: number;
  ten_chu_tai_khoan: string;
}) => {
  const response = await instanceClient.post('/rut-tien', withdrawalData);
  return response.data;
};

function WithdrawPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { bankData } = location.state as { bankData: WithdrawPageProps['bankData'] };
  
  const [amount, setAmount] = useState<number>(0);
  const [useFullBalance, setUseFullBalance] = useState(false);

  const { data } = useQuery({
    queryKey: ['financeData'],
    queryFn: fetchFinanceData,
  });

  const walletBalance = data?.viUser?.so_du || 0;

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    setAmount(value);
  };

  const handleFullBalanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUseFullBalance(e.target.checked);
    if (e.target.checked) {
      setAmount(walletBalance);
    } else {
      setAmount(0);
    }
  };

  const handleSubmit = async () => {
    try {
      const withdrawalData = {
        ngan_hang: bankData.bankName,
        tai_khoan_ngan_hang: bankData.accountNumber,
        so_tien: amount,
        ten_chu_tai_khoan: bankData.accountHolder,
        logo_ngan_hang: bankData.logo
      };
      
      const result = await submitWithdrawal(withdrawalData);
      console.log('Withdrawal successful:', result);
    } catch (error) {
      console.error('Withdrawal failed:', error);
    }
  };

  return (
    <div className="">
      <div className="w-full h-full">
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={() => navigate(-1)} 
            className="mr-4 text-gray-500 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 className="text-2xl font-semibold text-gray-800">Rút tiền</h2>
          <div></div>
        </div>

        <div className="flex items-center space-x-4 mb-8">
          {bankData.logo ? (
            <img src={bankData.logo} alt={bankData.bankName} className="w-12 h-12 object-contain" />
          ) : (
            <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-lg font-bold">✦</span>
            </div>
          )}
          <span className="text-gray-700 font-semibold text-lg">
            {bankData.bankName} *{bankData.accountNumber.slice(-4)}
          </span>
          
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-medium text-lg mb-2">Số tiền</label>
          <div className="relative">
            <span className="absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-400 text-2xl">₫</span>
            <input
              type="number"
              value={amount}
              onChange={handleAmountChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-gray-700 text-2xl tracking-widest shadow-sm focus:outline-none focus:border-blue-500"
              placeholder="0"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2 mb-6">
          <input
            type="checkbox"
            id="wallet-balance"
            checked={useFullBalance}
            onChange={handleFullBalanceChange}
            className="h-5 w-5 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="wallet-balance" className="text-gray-600 text-base">
            Số dư Ví: {walletBalance.toLocaleString()}₫
          </label>
        </div>

        <div className="text-gray-500 text-sm mb-6">
          Nhấn "Tiếp tục", bạn đã đồng ý tuân theo{' '}
          <a href="#" className="text-blue-500 underline">Điều khoản sử dụng</a>{' '}
          và{' '}
          <a href="#" className="text-blue-500 underline">Chính sách bảo mật</a>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-gray-700 text-lg font-medium">Tổng thanh toán</span>
            <span className="text-red-500 text-2xl font-semibold ml-2">
              ₫{amount.toLocaleString()}
            </span>
          </div>

          <button
            onClick={handleSubmit}
            disabled={amount === 0}
            className={`py-2 px-6 rounded-lg text-lg font-semibold transition-colors ${
              amount > 0 
                ? 'bg-blue-500 text-white hover:bg-blue-600' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Tiếp tục
          </button>
        </div>
      </div>
    </div>
  );
}

export default WithdrawPage;
