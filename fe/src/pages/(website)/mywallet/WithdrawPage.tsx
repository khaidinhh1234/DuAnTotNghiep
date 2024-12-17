import React, { useState } from 'react';
import { toast } from 'react-toastify';
import instanceClient from '@/configs/client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useLocation, useNavigate } from 'react-router-dom';

interface WithdrawPageProps {
  bankData: {
    id: string,
    bankName: string,
    accountNumber: string,
    logo?: string,
    accountHolder: string,
  }
}

const WithdrawPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { bankData } = location.state as { bankData: WithdrawPageProps['bankData'] };
  const queryClient = useQueryClient()
  const [amount, setAmount] = useState<number>(0);
  const [useFullBalance, setUseFullBalance] = useState(false);
  const [lastToastTime, setLastToastTime] = useState(0);

  const { data: walletData } = useQuery({
    queryKey: ['walletData'],
    queryFn: async () => {
      const walletVerificationCode = localStorage.getItem('walletVerificationCode');
      const response = await instanceClient.post('/vi-tai-khoan', {
        ma_xac_minh: walletVerificationCode
      });
      return response.data;
    }
  });


  const withdrawalMutation = useMutation({
    mutationFn: (withdrawalData: { so_tien: number }) => 
      instanceClient.post(`/rut-tien/${bankData.id}`, withdrawalData).then(res => res.data),
    onSuccess: () => {
      setAmount(0);
      setUseFullBalance(false);
      toast.success('Rút tiền thành công');
      navigate("/mypro/wallet");
      queryClient.invalidateQueries({ queryKey: ['walletData'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
    }
  });

  const handleSubmit = () => {
    if (amount < 50000) {
      toast.error('Số tiền rút tối thiểu là 50.000₫');
      return;
    }
    withdrawalMutation.mutate({ so_tien: amount });
  };

  const walletBalance = walletData?.data?.viUser?.so_du || 0;
console.log(walletBalance)
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    
    if (value > walletBalance) {
      const currentTime = Date.now();
      if (currentTime - lastToastTime > 2000) {
        toast.error('Số tiền rút không được vượt quá số dư ví', {
          toastId: 'balance-exceeded'
        });
        setLastToastTime(currentTime);
      }
      setAmount(walletBalance);
      return;
    }
    
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

  return (
    <div className="max-w-2xl mx-auto p-4">
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
            {bankData.bankName} ***{bankData.accountNumber.slice(-4)}
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
              max={walletBalance}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-gray-700 text-2xl tracking-widest shadow-sm focus:outline-none focus:border-blue-500"
              placeholder="Nhập số tiền"
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
          Nhấn "Tiếp tục", bạn đã đồng ý tuân theo{'           Số tiền rút tối thiểu là 50.0000đ  '}
          <p className="text-gray-500 ">Điều khoản sử dụng và Chính sách bảo mật
          </p>
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
            disabled={amount < 50000 || withdrawalMutation.isPending}
            className={`py-2 px-6 rounded-lg text-lg font-semibold transition-colors ${
              amount >= 50000 
                ? 'bg-blue-500 text-white hover:bg-blue-600' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {withdrawalMutation.isPending ? 'Đang xử lý...' : 'Tiếp tục'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WithdrawPage;
