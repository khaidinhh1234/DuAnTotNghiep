import React, { useState, useRef } from 'react';
import { toast } from 'react-toastify';
import instanceClient from '@/configs/client';
import { useMutation, useQuery } from '@tanstack/react-query';
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
  
  const [amount, setAmount] = useState<number>(0);
  const [useFullBalance, setUseFullBalance] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [showForgotPinModal, setShowForgotPinModal] = useState(false);
  const [pins, setPins] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [lastToastTime, setLastToastTime] = useState(0);

  const { data: walletData } = useQuery({
    queryKey: ['walletData'],
    queryFn: async () => {
      const storedCode = localStorage.getItem('walletVerificationCode');
      if (!storedCode) return null;
      
      const response = await instanceClient.post('/vi-tai-khoan', {
        ma_xac_minh: storedCode
      });
      return response.data;
    },
    enabled: !!localStorage.getItem('walletVerificationCode')
  });

  const withdrawalMutation = useMutation({
    mutationFn: (withdrawalData: {
      so_tien: number,
      ma_xac_minh: string,
    }) => instanceClient.post(`/rut-tien/${bankData.id}`, withdrawalData).then(res => res.data),
    onSuccess: () => {
      setShowVerificationModal(false);
      setAmount(0);
      setUseFullBalance(false);
      resetPins();
      toast.success('Rút tiền thành công');
      navigate(-1);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
    }
  });

  const forgotPinMutation = useMutation({
    mutationFn: async () => {
      const response = await instanceClient.get('/quen-ma-xac-minh');
      return response.data;
    },
    onSuccess: () => {
      toast.success('Yêu cầu Lấy lại mã PIN đã được gửi đến email của bạn');
      setShowForgotPinModal(false);
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại!';
      toast.error(errorMessage);
    }
  });

  const handleInitialSubmit = () => {
    if (amount < 50000) {
      toast.error('Số tiền rút tối thiểu là 50.000₫');
      return;
    }
    setShowVerificationModal(true);
  };

  const walletBalance = walletData?.data?.viUser?.so_du || 0;


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

  const handlePinChange = (index: number, value: string) => {
    const newPins = [...pins];
    newPins[index] = value;
    setPins(newPins);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !pins[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const resetPins = () => {
    setPins(['', '', '', '', '', '']);
  };

  const handleFinalSubmit = () => {
    const verificationCode = pins.join('');
    withdrawalMutation.mutate({
      so_tien: amount,
      ma_xac_minh: verificationCode
    });
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
            onClick={handleInitialSubmit}
            disabled={amount < 50000}
            className={`py-2 px-6 rounded-lg text-lg font-semibold transition-colors ${
              amount >= 50000 
                ? 'bg-blue-500 text-white hover:bg-blue-600' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Tiếp tục
          </button>
        </div>
      </div>

      {showVerificationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h2 className="text-xl font-semibold mb-4">Xác nhận mật khẩu ví</h2>
            <p className="text-gray-600 mb-6">Vui lòng nhập mật khẩu ví gồm 6 chữ số</p>

          

            <div className="mb-6">
              <div className="flex justify-between space-x-2">
                {pins.map((pin, index) => (
                  <input
                    key={index}
                    type="password"
                    maxLength={1}
                    value={pin}
                    ref={(el) => (inputRefs.current[index] = el)}
                    onChange={(e) => handlePinChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-10 h-10 text-center text-2xl border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ))}
              </div>
              <button 
                onClick={() => setShowForgotPinModal(true)}
                className="text-blue-600 hover:text-blue-800 text-sm mt-4 block"
              >
                Quên mật khẩu?
              </button>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  resetPins();
                  setShowVerificationModal(false);
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Hủy
              </button>
              <button
                onClick={handleFinalSubmit}
                disabled={pins.some(pin => !pin) || withdrawalMutation.isPending}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {withdrawalMutation.isPending ? 'Đang xử lý...' : 'Xác nhận'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showForgotPinModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h2 className="text-xl font-semibold mb-4">Xác nhận quên mật khẩu</h2>
            <p className="text-gray-600 mb-6">
              Bạn có chắc chắn muốn lấy lại mật khẩu ví? Chúng tôi sẽ gửi mã đến email của bạn.
            </p>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowForgotPinModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Hủy
              </button>
              <button
                onClick={() => forgotPinMutation.mutate()}
                disabled={forgotPinMutation.isPending}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {forgotPinMutation.isPending ? 'Đang xử lý...' : 'Xác nhận'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    
  );
};

export default WithdrawPage;
