
// import instanceClient from "@/configs/client";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { useEffect, useState, useRef } from "react";
// import { Link } from "react-router-dom";
// import SettingsModal from "./RegisterWalletPassword";

// function TaiChinh() {
//   const [isSettingsOpen, setIsSettingsOpen] = useState(false);
//   const [pins, setPins] = useState(['', '', '', '', '', '']);
//   const [error, setError] = useState('');
//   const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
//   const queryClient = useQueryClient();

//   const { data: walletStatus } = useQuery({
//     queryKey: ["walletStatus"],
//     queryFn: async () => {
//       const response = await instanceClient.get('/vi-tai-khoan');
//       return response.data;
//     }
//   });

//   useEffect(() => {
//     if (walletStatus && !walletStatus.status) {
//       setIsSettingsOpen(true);
//     }
//   }, [walletStatus]);

//   // Post mã xác minh để lấy dữ liệu ví
//   const verifyWalletMutation = useMutation({
//     mutationFn: async (code: string) => {
//       const response = await instanceClient.post('/vi-tai-khoan', {
//         ma_xac_minh: code
//       });
//       return response.data;
//     },
//     onSuccess: (data) => {
//       queryClient.setQueryData(["walletData"], data);
//       setPins(['', '', '', '', '', '']);
//       setError('');
//     },
//     onError: (error: any) => {
//       setError(error.response?.data?.message || 'Mã xác minh không đúng');
//       setPins(['', '', '', '', '', '']);
//       inputRefs.current[0]?.focus();
//     }
//   });

//   const handleChange = (index: number, value: string) => {
//     if (!/^\d*$/.test(value)) return;

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

//   // Xử lý khi click nút xác nhận
//   const handleVerification = () => {
//     const code = pins.join('');
//     if (code.length === 6) {
//       verifyWalletMutation.mutate(code);
//     }
//   };

//   const { data: walletData } = verifyWalletMutation;

//   return (
//     <div className="p-4 min-h-screen">
//       <div className="flex items-center align-center justify-between mb-4">
//         <h1 className="text-xl font-semibold">Tài chính</h1>
//         <button
//           onClick={() => setIsSettingsOpen(true)}
//           className="hover:text-gray-700"
//         >
//           <i className="fa-regular fa-gear"></i>
//         </button>
//       </div>

//       {walletStatus?.status && !walletData && (
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
//                     onChange={(e) => handleChange(index, e.target.value)}
//                     onKeyDown={(e) => handleKeyDown(index, e)}
//                     className="w-10 h-10 text-center text-2xl border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 ))}
//               </div>
//               {error && (
//                 <p className="text-red-500 text-sm mt-2">{error}</p>
//               )}
//             </div>

//             <div className="flex justify-end">
//               <button
//                 onClick={handleVerification}
//                 disabled={pins.some(pin => !pin) || verifyWalletMutation.isPending}
//                 className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
//               >
//                 {verifyWalletMutation.isPending ? 'Đang xử lý...' : 'Xác nhận'}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       <SettingsModal
//         isOpen={isSettingsOpen}
//         onClose={() => setIsSettingsOpen(false)}
//         trang_thai_ma_xac_minh={walletStatus?.status}
//       />

//       {walletData?.data && (
//         <>
//           <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-120">
//             <div className="flex justify-between items-center">
//               <span className="text-lg font-semibold">Tổng số dư</span>
//               <Link to="/mypro/naptien">
//               <button className="bg-red-500 text-white rounded-lg px-3 py-1 mr-3 hover:bg-orange-600 active:bg-orange-700">
//                   Nạp tiền
//                 </button>
//                 <button className="bg-red-500 text-white rounded-lg px-3 py-1 hover:bg-orange-600 active:bg-orange-700">
//                   Rút tiền
//                 </button>
//               </Link>
//             </div>
//             <div className="text-red-500 text-4xl font-semibold my-4">
//               {walletData.data?.viUser?.so_du?.toLocaleString() ?? 0}₫
//             </div>
//           </div>

//           <div className="bg-white rounded-lg p-4 shadow-sm mt-6 border border-gray-120">
//             <h2 className="text-lg font-semibold mb-4">Lịch sử Giao Dịch</h2>
//             {walletData.data?.viUser?.lich_su_giao_dichs?.length > 0 ? (
//               <ul className="max-h-[400px] overflow-y-auto">
//                 {walletData.data.viUser.lich_su_giao_dichs.map((transaction: any, index: number) => (
//                   <li key={index} className="flex justify-between items-center border-b py-2">
//                     <div>
//                       <p className="text-sm font-medium">{transaction?.mo_ta}</p>
//                       <p className="text-xs text-gray-500">
//                         {new Date(transaction?.ngay_thay_doi).toLocaleString("vi-VN", {
//                           year: "numeric",
//                           month: "2-digit",
//                           day: "2-digit",
//                           hour: "2-digit",
//                           minute: "2-digit",
//                         })}
//                       </p>
//                     </div>
//                     <p className="text-sm font-semibold">
//                     {transaction?.so_du_sau - transaction?.so_du_truoc > 0 ? "+" : ""}
//                       {(transaction?.so_du_sau - transaction?.so_du_truoc).toLocaleString()}đ
//                     </p>
//                   </li>
//                 ))}
//               </ul>
//             ) : (
//               <p className="text-center text-gray-500">Không có giao dịch nào</p>
//             )}
//           </div>
//         </>
//       )}
//     </div>
//   );
// }

// export default TaiChinh;
import instanceClient from "@/configs/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import SettingsModal from "./RegisterWalletPassword";

function TaiChinh() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [pins, setPins] = useState(['', '', '', '', '', '']);
  const [showForgotPinModal, setShowForgotPinModal] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: walletStatus } = useQuery({
    queryKey: ["walletStatus"],
    queryFn: async () => {
      const response = await instanceClient.get('/vi-tai-khoan');
      return response.data;
    }
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

  useEffect(() => {
    if (walletStatus && !walletStatus.status) {
      setIsSettingsOpen(true);
    }
  }, [walletStatus]);

  const verifyWalletMutation = useMutation({
    mutationFn: async (code: string) => {
      const response = await instanceClient.post('/vi-tai-khoan', {
        ma_xac_minh: code
      });
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["walletData"], data);
      setPins(['', '', '', '', '', '']);
      // toast.success('');
    },
    onError: (error: any) => {
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

  const { data: walletData } = verifyWalletMutation;

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

      {walletStatus?.status && !walletData && (
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
