// import React, { useState, useRef } from 'react';
// import { toast } from 'react-toastify';
// import instanceClient from '@/configs/client';
// import { useMutation, useQuery } from '@tanstack/react-query';
// import { useLocation, useNavigate } from 'react-router-dom';

// interface WithdrawPageProps {
//   bankData: {
//     id: string,
//     bankName: string,
//     accountNumber: string,
//     logo?: string,
//     accountHolder: string,
//   }
// }

// const WithdrawPage = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { bankData } = location.state as { bankData: WithdrawPageProps['bankData'] };
  
//   const [amount, setAmount] = useState<number>(0);
//   const [useFullBalance, setUseFullBalance] = useState(false);
//   const [showVerificationModal, setShowVerificationModal] = useState(false);
//   const [showForgotPinModal, setShowForgotPinModal] = useState(false);
//   const [pins, setPins] = useState(['', '', '', '', '', '']);
//   const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
//   const [lastToastTime, setLastToastTime] = useState(0);

//   const { data: walletData } = useQuery({
//     queryKey: ['walletData'],
//     queryFn: async () => {
//       const storedCode = localStorage.getItem('walletVerificationCode');
//       if (!storedCode) return null;
      
//       const response = await instanceClient.post('/vi-tai-khoan', {
//         ma_xac_minh: storedCode
//       });
//       return response.data;
//     },
//     enabled: !!localStorage.getItem('walletVerificationCode')
//   });

//   const withdrawalMutation = useMutation({
//     mutationFn: (withdrawalData: {
//       so_tien: number,
//       ma_xac_minh: string,
//     }) => instanceClient.post(`/rut-tien/${bankData.id}`, withdrawalData).then(res => res.data),
//     onSuccess: () => {
//       setShowVerificationModal(false);
//       setAmount(0);
//       setUseFullBalance(false);
//       resetPins();
//       toast.success('Rút tiền thành công');
//       navigate(-1);
//     },
//     onError: (error: any) => {
//       toast.error(error.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
//     }
//   });

//   const forgotPinMutation = useMutation({
//     mutationFn: async () => {
//       const response = await instanceClient.get('/quen-ma-xac-minh');
//       return response.data;
//     },
//     onSuccess: () => {
//       toast.success('Yêu cầu Lấy lại mã PIN đã được gửi đến email của bạn');
//       setShowForgotPinModal(false);
//     },
//     onError: (error: any) => {
//       const errorMessage = error.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại!';
//       toast.error(errorMessage);
//     }
//   });

//   const handleInitialSubmit = () => {
//     if (amount < 50000) {
//       toast.error('Số tiền rút tối thiểu là 50.000₫');
//       return;
//     }
//     setShowVerificationModal(true);
//   };

//   const walletBalance = walletData?.data?.viUser?.so_du || 0;


//   const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const value = parseInt(e.target.value) || 0;
    
//     if (value > walletBalance) {
//       const currentTime = Date.now();
//       if (currentTime - lastToastTime > 2000) {
//         toast.error('Số tiền rút không được vượt quá số dư ví', {
//           toastId: 'balance-exceeded'
//         });
//         setLastToastTime(currentTime);
//       }
//       setAmount(walletBalance);
//       return;
//     }
    
//     setAmount(value);
//   };
//   const handleFullBalanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setUseFullBalance(e.target.checked);
//     if (e.target.checked) {
//       setAmount(walletBalance);
//     } else {
//       setAmount(0);
//     }
//   };

//   const handlePinChange = (index: number, value: string) => {
//     const newPins = [...pins];
//     newPins[index] = value;
//     setPins(newPins);

//     if (value && index < 5) {
//       inputRefs.current[index + 1]?.focus();
//     }
//   };

//   const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
//     if (e.key === 'Backspace' && !pins[index] && index > 0) {
//       inputRefs.current[index - 1]?.focus();
//     }
//   };

//   const resetPins = () => {
//     setPins(['', '', '', '', '', '']);
//   };

//   const handleFinalSubmit = () => {
//     const verificationCode = pins.join('');
//     withdrawalMutation.mutate({
//       so_tien: amount,
//       ma_xac_minh: verificationCode
//     });
//   };

//   return (
//     <div className="max-w-2xl mx-auto p-4">
//       <div className="w-full h-full">
//         <div className="flex items-center justify-between mb-6">
//           <button 
//             onClick={() => navigate(-1)} 
//             className="mr-4 text-gray-500 hover:text-gray-700"
//           >
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
//             </svg>
//           </button>
//           <h2 className="text-2xl font-semibold text-gray-800">Rút tiền</h2>
//           <div></div>
//         </div>

//         <div className="flex items-center space-x-4 mb-8">
//           {bankData.logo ? (
//             <img src={bankData.logo} alt={bankData.bankName} className="w-12 h-12 object-contain" />
//           ) : (
//             <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
//               <span className="text-white text-lg font-bold">✦</span>
//             </div>
//           )}
//           <span className="text-gray-700 font-semibold text-lg">
//             {bankData.bankName} *{bankData.accountNumber.slice(-4)}
//           </span>
//         </div>

//         <div className="mb-6">
//           <label className="block text-gray-700 font-medium text-lg mb-2">Số tiền</label>
//           <div className="relative">
//             <span className="absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-400 text-2xl">₫</span>
//             <input
//               type="number"
//               value={amount}
//               onChange={handleAmountChange}
//               max={walletBalance}
//               className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-gray-700 text-2xl tracking-widest shadow-sm focus:outline-none focus:border-blue-500"
//               placeholder="Nhập số tiền"
//             />
//           </div>
//         </div>

//         <div className="flex items-center space-x-2 mb-6">
//           <input
//             type="checkbox"
//             id="wallet-balance"
//             checked={useFullBalance}
//             onChange={handleFullBalanceChange}
//             className="h-5 w-5 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
//           />
//           <label htmlFor="wallet-balance" className="text-gray-600 text-base">
//             Số dư Ví: {walletBalance.toLocaleString()}₫
//           </label>
//         </div>

//         <div className="text-gray-500 text-sm mb-6">
//           Nhấn "Tiếp tục", bạn đã đồng ý tuân theo{'           Số tiền rút tối thiểu là 50.0000đ  '}
//           <a href="#" className="text-blue-500 underline">Điều khoản sử dụng</a>{' '}
//           và{' '}
//           <a href="#" className="text-blue-500 underline">Chính sách bảo mật</a>
//         </div>

//         <div className="flex items-center justify-between">
//           <div>
//             <span className="text-gray-700 text-lg font-medium">Tổng thanh toán</span>
//             <span className="text-red-500 text-2xl font-semibold ml-2">
//               ₫{amount.toLocaleString()}
//             </span>
//           </div>

//           <button
//             onClick={handleInitialSubmit}
//             disabled={amount < 50000}
//             className={`py-2 px-6 rounded-lg text-lg font-semibold transition-colors ${
//               amount >= 50000 
//                 ? 'bg-blue-500 text-white hover:bg-blue-600' 
//                 : 'bg-gray-200 text-gray-400 cursor-not-allowed'
//             }`}
//           >
//             Tiếp tục
//           </button>
//         </div>
//       </div>

//       {showVerificationModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-6 w-96">
//             <h2 className="text-xl font-semibold mb-4">Xác nhận mật khẩu ví</h2>
//             <p className="text-gray-600 mb-6">Vui lòng nhập mật khẩu ví gồm 6 chữ số</p>

          

//             <div className="mb-6">
//               <div className="flex justify-between space-x-2">
//                 {pins.map((pin, index) => (
//                   <input
//                     key={index}
//                     type="password"
//                     maxLength={1}
//                     value={pin}
//                     ref={(el) => (inputRefs.current[index] = el)}
//                     onChange={(e) => handlePinChange(index, e.target.value)}
//                     onKeyDown={(e) => handleKeyDown(index, e)}
//                     className="w-10 h-10 text-center text-2xl border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 ))}
//               </div>
//               <button 
//                 onClick={() => setShowForgotPinModal(true)}
//                 className="text-blue-600 hover:text-blue-800 text-sm mt-4 block"
//               >
//                 Quên mật khẩu?
//               </button>
//             </div>

//             <div className="flex justify-end space-x-3">
//               <button
//                 onClick={() => {
//                   resetPins();
//                   setShowVerificationModal(false);
//                 }}
//                 className="px-4 py-2 text-gray-600 hover:text-gray-800"
//               >
//                 Hủy
//               </button>
//               <button
//                 onClick={handleFinalSubmit}
//                 disabled={pins.some(pin => !pin) || withdrawalMutation.isPending}
//                 className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
//               >
//                 {withdrawalMutation.isPending ? 'Đang xử lý...' : 'Xác nhận'}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {showForgotPinModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-6 w-96">
//             <h2 className="text-xl font-semibold mb-4">Xác nhận quên mật khẩu</h2>
//             <p className="text-gray-600 mb-6">
//               Bạn có chắc chắn muốn lấy lại mật khẩu ví? Chúng tôi sẽ gửi mã đến email của bạn.
//             </p>

//             <div className="flex justify-end space-x-3">
//               <button
//                 onClick={() => setShowForgotPinModal(false)}
//                 className="px-4 py-2 text-gray-600 hover:text-gray-800"
//               >
//                 Hủy
//               </button>
//               <button
//                 onClick={() => forgotPinMutation.mutate()}
//                 disabled={forgotPinMutation.isPending}
//                 className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
//               >
//                 {forgotPinMutation.isPending ? 'Đang xử lý...' : 'Xác nhận'}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
    
//   );
// };

// export default WithdrawPage;
import instanceClient from "@/configs/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState, useRef } from "react";
import { Link, useNavigate,  } from "react-router-dom";
import { toast } from "react-toastify";
import SettingsModal from "./RegisterWalletPassword";

function TaiChinh() {
  const queryParams = new URLSearchParams(window.location.search);
  const resultCode = parseInt(queryParams.get("resultCode") ?? "0", 10);
  const orderId = queryParams.get("orderId");
  const partnerCode = queryParams.get("partnerCode");
  const amount = parseInt(queryParams.get("amount") ?? "0", 10);
  const requestId = queryParams.get("requestId");
  const orderInfo = queryParams.get("orderInfo");
  const orderType = queryParams.get("orderType");
  const transId = queryParams.get("transId");
  const payType = queryParams.get("payType");
  const signature = queryParams.get("signature");
  const datas = {
    resultCode: resultCode,
    partnerCode: partnerCode,
    orderId: orderId,
    amount: amount,
    requestId: requestId,
    orderInfo: orderInfo,
    orderType: orderType,
    transId: transId,
    payType: payType,
    signature: signature,
  };
  console.log(datas);

  
  const { data } = useQuery({
    queryKey: ["checkbill"],
    queryFn: async () => {
      if (resultCode === 0) {
        const response = await instanceClient.post(`/xac-nhan-nap-tien`, {
          orderId: orderId,
          resultCode: resultCode,
          amount: amount,

        });
    
        toast.success("Đặt hàng thành công");
        return response.data;
      }
      if (resultCode !== 0) {
        toast.error("Đặt hàng thất bại");
      }
    },
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [pins, setPins] = useState(['', '', '', '', '', '']);
  const [showForgotPinModal, setShowForgotPinModal] = useState(false);
  const [storedVerificationCode, setStoredVerificationCode] = useState(() => 
    localStorage.getItem('walletVerificationCode')
  );
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { data: walletStatus, isSuccess, refetch: refetchWalletStatus } = useQuery({
    queryKey: ["walletStatus"],
    queryFn: async () => {
      try {
        const response = await instanceClient.get('/vi-tai-khoan');
        return response.data;
      } catch (error: any) {
        if (error.response?.status === 400) {
          return {
            status: false,
            status_code: 400
          };
        }
        throw error;
      }
    },
    retry: false
  });

  useEffect(() => {
    if (isSuccess && walletStatus?.status === false) {
      setIsSettingsOpen(true);
    }
  }, [walletStatus, isSuccess]);

  const { data: walletData } = useQuery({
    queryKey: ['walletData', storedVerificationCode],
    queryFn: async () => {
      if (!storedVerificationCode) return null;
      const response = await instanceClient.post('/vi-tai-khoan', {
        ma_xac_minh: storedVerificationCode
      });
      return response.data;
    },
    enabled: !!storedVerificationCode,
    staleTime: 5 * 60 * 1000,
  });

  const forgotPinMutation = useMutation({
    mutationFn: async () => {
      const response = await instanceClient.get('/quen-ma-xac-minh');
      return response.data;
    },
    onSuccess: () => {
      toast.success('Yêu cầu lấy lại mã PIN đã được gửi đến email của bạn');
      setShowForgotPinModal(false);
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại!';
      toast.error(errorMessage);
    }
  });

  const verifyWalletMutation = useMutation({
    mutationFn: async (code: string) => {
      const response = await instanceClient.post('/vi-tai-khoan', {
        ma_xac_minh: code
      });
      return response.data;
    },
    onSuccess: (data) => {
      const verificationCode = pins.join('');
      localStorage.setItem('walletVerificationCode', verificationCode);
      setStoredVerificationCode(verificationCode);
      queryClient.setQueryData(['walletData', verificationCode], data);
      setPins(['', '', '', '', '', '']);
    },
    onError: (error: any) => {
      localStorage.removeItem('walletVerificationCode');
      setStoredVerificationCode(null);
      toast.error(error.response?.data?.message || 'Mã xác minh không đúng');
      setPins(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    }
  });

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

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

  const handleVerification = () => {
    const code = pins.join('');
    if (code.length === 6) {
      verifyWalletMutation.mutate(code);
    }
  };

  const handleRegisterSuccess = async (code: string) => {
    setStoredVerificationCode(code);
    await refetchWalletStatus();
    queryClient.invalidateQueries({ queryKey: ['walletData', code] });
  };

  return (
    <div className="p-4 min-h-screen">
      <div className="flex items-center align-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Tài chính</h1>
        <button
          onClick={() => setIsSettingsOpen(true)}
          className="hover:text-gray-700"
        >
          <i className="fa-regular fa-gear"></i>
        </button>
      </div>

      {walletStatus?.status && !storedVerificationCode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Xác nhận mật khẩu ví</h2>
              <button
                onClick={() => navigate('/mypro/myprofile')}
                className="text-gray-500 hover:text-gray-700"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
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
                    onChange={(e) => handleChange(index, e.target.value)}
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
                onClick={() => navigate('/mypro/myprofile')}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Thoát
              </button>
              <button
                onClick={handleVerification}
                disabled={pins.some(pin => !pin) || verifyWalletMutation.isPending}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {verifyWalletMutation.isPending ? 'Đang xử lý...' : 'Xác nhận'}
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
              Bạn có chắc chắn muốn lấy lại mật khẩu ví? Chúng tôi sẽ gửi đến email của bạn.
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

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        status={walletStatus?.status}
        onRegisterSuccess={handleRegisterSuccess}
      />

      {walletData?.data && (
        <>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-120">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">Tổng số dư</span>
              <div className="flex space-x-2">
                <Link to="/mypro/naptien">
                  <button className="bg-red-500 text-white rounded-lg px-3 py-1 hover:bg-orange-600 active:bg-orange-700">
                    Nạp tiền
                  </button>
                </Link>
                <Link to="/mypro/bank">
                  <button className="bg-red-500 text-white rounded-lg px-3 py-1 hover:bg-orange-600 active:bg-orange-700">
                    Rút tiền
                  </button>
                </Link>
              </div>
            </div>

            <div className="text-red-500 text-4xl font-semibold my-4">
              {walletData.data?.viUser?.so_du?.toLocaleString() ?? 0}₫
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm mt-6 border border-gray-120">
            <h2 className="text-lg font-semibold mb-4">Lịch sử Giao Dịch</h2>
            {walletData.data?.viUser?.lich_su_giao_dichs?.length > 0 ? (
              <ul className="max-h-[400px] overflow-y-auto">
                {walletData.data.viUser.lich_su_giao_dichs.map((transaction: any, index: number) => (
                  <li key={index} className="flex justify-between items-center border-b py-2">
                    <div>
                      <p className="text-sm font-medium">{transaction?.mo_ta}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(transaction?.ngay_thay_doi).toLocaleString("vi-VN", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <p className="text-sm font-semibold">
                      {transaction?.so_du_sau - transaction?.so_du_truoc > 0 ? "+" : ""}
                      {(transaction?.so_du_sau - transaction?.so_du_truoc).toLocaleString()}đ
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-gray-500">Không có giao dịch nào</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default TaiChinh;
