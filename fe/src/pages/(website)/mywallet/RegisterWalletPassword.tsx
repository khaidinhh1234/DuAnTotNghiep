// // import React from 'react';

// // function RegisterWalletPassword() {
// //   return (
// //     <div className=" flex items-center justify-center h-screen">
// //       <div className="flex flex-col md:flex-row min-h-screen">
// //         <section className="flex-1 flex items-center justify-center p-4 md:p-0">
// //           <div className="w-full max-w-md p-6 md:p-8 bg-white shadow-lg rounded-lg">
// //             <div className="mb-6">
// //               <a href="#" className="text-gray-600 hover:text-gray-800 flex items-center">
// //                 <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
// //                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
// //                 </svg>
// //                 Quay lại
// //               </a>
// //             </div>

// //             <h2 className="text-3xl font-bold mb-2">Đăng ký mật khẩu ví</h2>
// //             <p className="text-gray-600 mb-6">Vui lòng nhập mật khẩu ví gồm 6 chữ số</p>

// //             <form>
// //               {/* Nhập mật khẩu ví */}
// //               <div className="mb-6">
// //                 <label className="block text-gray-700 font-semibold mb-2">Nhập mật khẩu ví</label>
// //                 <div className="flex justify-between space-x-2">
// //                   {[...Array(6)].map((_, index) => (
// //                     <input
// //                       key={index}
// //                       type="text"
// //                       maxLength="1"
// //                       className="w-10 h-10 text-center text-2xl border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// //                     />
// //                   ))}
// //                 </div>
// //               </div>

// //               {/* Nhập lại mật khẩu ví */}
// //               <div className="mb-6">
// //                 <label className="block text-gray-700 font-semibold mb-2">Nhập lại mật khẩu ví</label>
// //                 <div className="flex justify-between space-x-2">
// //                   {[...Array(6)].map((_, index) => (
// //                     <input
// //                       key={index}
// //                       type="text"
// //                       maxLength="1"
// //                       className="w-10 h-10 text-center text-2xl border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// //                     />
// //                   ))}
// //                 </div>
// //               </div>

// //               <button type="submit" className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 text-sm font-bold">
// //                 Xác nhận
// //               </button>
// //             </form>
// //           </div>
// //         </section>
// //       </div>
// //     </div>
// //   );
// // }

// // export default RegisterWalletPassword;
// import React, { useState } from 'react';
// import { useMutation } from '@tanstack/react-query';
// import instanceClient from '@/configs/client';
// import { toast } from 'react-toastify';

// interface SettingsModalProps {
//   isOpen: boolean;
//   onClose: () => void;
// }

// const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
//   const [showRegistration, setShowRegistration] = useState(false);
//   const [password, setPassword] = useState(['', '', '', '', '', '']);
//   const [confirmPassword, setConfirmPassword] = useState(['', '', '', '', '', '']);
//   const setupPasswordMutation = useMutation({
//     mutationFn: async (ma_xac_minh: string) => {
//       return await instanceClient.post('/thiet-lap-ma-xac-minh', {
//         ma_xac_minh
//       });
//     },
//     onSuccess: () => {
//         onClose();
//         toast.success('Thiết lập mật khẩu thành công!');
//       },
//       onError: () => {
//         toast.error('Có lỗi xảy ra. Vui lòng thử lại!');
//       }
  
//   });
//   const handleSubmit = () => {
//     const passwordString = password.join('');
//     const confirmPasswordString = confirmPassword.join('');

//     if (passwordString !== confirmPasswordString) {
//       alert('Mật khẩu không khớp');
//       return;
//     }

//     if (passwordString.length !== 6) {
//       alert('Vui lòng nhập đủ 6 số');
//       return;
//     }

//     setupPasswordMutation.mutate(passwordString);
//   };

//   const handleInputChange = (index: number, value: string, isConfirm: boolean) => {
//     const newValue = value.replace(/[^0-9]/g, '');
    
//     if (isConfirm) {
//       const newConfirmPassword = [...confirmPassword];
//       newConfirmPassword[index] = newValue;
//       setConfirmPassword(newConfirmPassword);
//     } else {
//       const newPassword = [...password];
//       newPassword[index] = newValue;
//       setPassword(newPassword);
//     }

//     if (newValue && index < 5) {
//       const inputs = document.getElementsByClassName(isConfirm ? 'confirm-input' : 'password-input');
//       const nextInput = inputs[index + 1] as HTMLInputElement;
//       if (nextInput) nextInput.focus();
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white rounded-lg p-6 w-96">
//         {!showRegistration ? (
//           <>
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-semibold">Cài đặt ví</h2>
//               <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
//                 <i className="fa-solid fa-times"></i>
//               </button>
//             </div>
//             <div className="space-y-4">
//               <button 
//                 onClick={() => setShowRegistration(true)}
//                 className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100 flex items-center justify-between"
//               >
//                 <span>Đăng ký mật khẩu ví</span>
//                 <i className="fa-solid fa-chevron-right text-gray-400"></i>
//               </button>
//               <button 
//                 className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100 flex items-center justify-between"
//               >
//                 <span>Phương Thức thanh toán</span>
//                 <i className="fa-solid fa-chevron-right text-gray-400"></i>
//               </button>
//             </div>
//           </>
//         ) : (
//           <>
//              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white rounded-lg p-6 w-96">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-xl font-semibold">Đăng ký mật khẩu ví</h2>
//           <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
//             <i className="fa-solid fa-times"></i>
//           </button>
//         </div>
        
//         <div className="space-y-4">
//           <div className="mb-6">
//             <label className="block text-gray-700 font-semibold mb-2">Nhập mật khẩu ví</label>
//             <div className="flex justify-between space-x-2">
//               {password.map((digit, index) => (
//                 <input
//                   key={index}
//                   type="text"
//                   maxLength={1}
//                   value={digit}
//                   onChange={(e) => handleInputChange(index, e.target.value, false)}
//                   className="password-input w-10 h-10 text-center text-2xl border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               ))}
//             </div>
//           </div>

//           <div className="mb-6">
//             <label className="block text-gray-700 font-semibold mb-2">Nhập lại mật khẩu ví</label>
//             <div className="flex justify-between space-x-2">
//               {confirmPassword.map((digit, index) => (
//                 <input
//                   key={index}
//                   type="text"
//                   maxLength={1}
//                   value={digit}
//                   onChange={(e) => handleInputChange(index, e.target.value, true)}
//                   className="confirm-input w-10 h-10 text-center text-2xl border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               ))}
//             </div>
//           </div>

//           <button 
//             onClick={handleSubmit}
//             disabled={setupPasswordMutation.isPending}
//             className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 text-sm font-bold disabled:bg-gray-400"
//           >
//             {setupPasswordMutation.isPending ? 'Đang xử lý...' : 'Xác nhận'}
//           </button>
//         </div>
//       </div>
//     </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default SettingsModal;
// import React, { useState } from 'react';
// import { useMutation } from '@tanstack/react-query';
// import instanceClient from '@/configs/client';
// import { toast } from 'react-toastify';
// import { Link } from 'react-router-dom';

// interface SettingsModalProps {
//   isOpen: boolean;
//   onClose: () => void;
// }

// const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
//   const [showRegistration, setShowRegistration] = useState(false);
//   const [showChangePassword, setShowChangePassword] = useState(false);
//   const [isPasswordSet, setIsPasswordSet] = useState(false);
//   const [password, setPassword] = useState(['', '', '', '', '', '']);
//   const [confirmPassword, setConfirmPassword] = useState(['', '', '', '', '', '']);
//   const setupPasswordMutation = useMutation({
//     mutationFn: async (ma_xac_minh: string) => {
//       return await instanceClient.post('/thiet-lap-ma-xac-minh', {
//         ma_xac_minh
//       });
//     },
//     onSuccess: () => {
//       setIsPasswordSet(true);
//       setShowRegistration(false);
//       toast.success('Thiết lập mật khẩu thành công!');
//     },
//     onError: () => {
//       toast.error('Có lỗi xảy ra. Vui lòng thử lại!');
//     }
//   });

//   const handleSubmit = () => {
//     const passwordString = password.join('');
//     const confirmPasswordString = confirmPassword.join('');

//     if (passwordString !== confirmPasswordString) {
//       alert('Mật khẩu không khớp');
//       return;
//     }

//     if (passwordString.length !== 6) {
//       alert('Vui lòng nhập đủ 6 số');
//       return;
//     }

//     setupPasswordMutation.mutate(passwordString);
//   };

//   const handleInputChange = (index: number, value: string, isConfirm: boolean) => {
//     const newValue = value.replace(/[^0-9]/g, '');
    
//     if (isConfirm) {
//       const newConfirmPassword = [...confirmPassword];
//       newConfirmPassword[index] = newValue;
//       setConfirmPassword(newConfirmPassword);
//     } else {
//       const newPassword = [...password];
//       newPassword[index] = newValue;
//       setPassword(newPassword);
//     }

//     if (newValue && index < 5) {
//       const inputs = document.getElementsByClassName(isConfirm ? 'confirm-input' : 'password-input');
//       const nextInput = inputs[index + 1] as HTMLInputElement;
//       if (nextInput) nextInput.focus();
//     }
//   };
//   const resetPasswordFields = () => {
//     setPassword(['', '', '', '', '', '']);
//     setConfirmPassword(['', '', '', '', '', '']);
//   };
//   if (!isOpen) return null;

//   const renderMainMenu = () => (
//     <>
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-xl font-semibold">Cài đặt ví</h2>
//            <button 
//         onClick={() => {
//           onClose();
//           setShowRegistration(false);
//           setShowChangePassword(false);
//           resetPasswordFields();
//         }}  className="text-gray-500 hover:text-gray-700">
//           <i className="fa-solid fa-times"></i>
//         </button>
//       </div>
//       <div className="space-y-4">
//         {!isPasswordSet ? (
//     <button 
//     onClick={() => {
//       resetPasswordFields();
//       setShowRegistration(true);
//     }}
//           className="w-full text-left px-4 py-3  rounded-lg hover:bg-gray-100 flex items-center justify-between"
//           >
//             <span>Đăng ký mật khẩu ví</span>
//             <i className="fa-solid fa-chevron-right text-gray-400"></i>
//           </button>
//         ) : (
//             <button 
//             onClick={() => {
//               resetPasswordFields();
//               setShowChangePassword(true);
//             }}
//             className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100 flex items-center justify-between"
//           >
//             <span>Đổi mật khẩu ví</span>
//             <i className="fa-solid fa-chevron-right text-gray-400"></i>
//           </button>
//         )}
//                   <Link to="/mypro/bank">
//         <button 
//           className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100 flex items-center justify-between"
//         >
//           <span>Phương Thức thanh toán</span>
//           <i className="fa-solid fa-chevron-right text-gray-400"></i>
//         </button>
//         </Link>
//       </div>
//     </>
//   );

//   const renderPasswordForm = (title: string) => (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white rounded-lg p-6 w-96">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-xl font-semibold">{title}</h2>
//           <button 
//           onClick={() => {
//             setShowRegistration(false);
//             setShowChangePassword(false);
//             resetPasswordFields();
//           }} className="text-gray-500 hover:text-gray-700">
//             <i className="fa-solid fa-times"></i>
//           </button>
//         </div>
        
//         <div className="space-y-4">
//           <div className="mb-6">
//             <label className="block text-gray-700 font-semibold mb-2">Nhập mật khẩu ví</label>
//             <div className="flex justify-between space-x-2">
//               {password.map((digit, index) => (
//                 <input
//                   key={index}
//                   type="text"
//                   maxLength={1}
//                   value={digit}
//                   onChange={(e) => handleInputChange(index, e.target.value, false)}
//                   className="password-input w-10 h-10 text-center text-2xl border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               ))}
//             </div>
//           </div>

//           <div className="mb-6">
//             <label className="block text-gray-700 font-semibold mb-2">Nhập  mật khẩu ví</label>
//             <div className="flex justify-between space-x-2">
//               {confirmPassword.map((digit, index) => (
//                 <input
//                   key={index}
//                   type="text"
//                   maxLength={1}
//                   value={digit}
//                   onChange={(e) => handleInputChange(index, e.target.value, true)}
//                   className="confirm-input w-10 h-10 text-center text-2xl border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               ))}
//             </div>
//           </div>

//           <button 
//             onClick={handleSubmit}
//             disabled={setupPasswordMutation.isPending}
//             className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 text-sm font-bold disabled:bg-gray-400"
//           >
//             {setupPasswordMutation.isPending ? 'Đang xử lý...' : 'Xác nhận'}
//           </button>
//         </div>
//       </div>
//     </div>
//   );

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white rounded-lg p-6 w-96">
//         {!showRegistration && !showChangePassword && renderMainMenu()}
//         {showRegistration && renderPasswordForm('Đăng ký mật khẩu ví')}
//         {showChangePassword && renderPasswordForm('Đổi mật khẩu ví')}
//       </div>
//     </div>
//   );
// };

// export default SettingsModal;
import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import instanceClient from '@/configs/client';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  trang_thai_ma_xac_minh: boolean;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ 
  isOpen, 
  onClose,
  trang_thai_ma_xac_minh 
}) => {
  const [showRegistration, setShowRegistration] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [password, setPassword] = useState(['', '', '', '', '', '']);
  const [confirmPassword, setConfirmPassword] = useState(['', '', '', '', '', '']);

  const setupPasswordMutation = useMutation({
    mutationFn: async (ma_xac_minh: string) => {
      
      return await instanceClient.post('/thiet-lap-ma-xac-minh', {
        ma_xac_minh
      });
    },
    onSuccess: () => {
      setShowRegistration(false);
      setShowChangePassword(false);
      onClose();
      resetPasswordFields();
      toast.success('Thiết lập mật khẩu thành công!');
    },
    onError: () => {
      toast.error('Có lỗi xảy ra. Vui lòng thử lại!');
    }
  });

  const handleSubmit = () => {
    const passwordString = password.join('');
    const confirmPasswordString = confirmPassword.join('');

    if (passwordString !== confirmPasswordString) {
      toast.success('Mật khẩu không khớp');
      return;
    }

    if (passwordString.length !== 6) {
      toast.success('Vui lòng nhập đủ 6 số');
      return;
    }

    setupPasswordMutation.mutate(passwordString);
  };

  const handleInputChange = (index: number, value: string, isConfirm: boolean) => {
    const newValue = value.replace(/[^0-9]/g, '');
    
    if (isConfirm) {
      const newConfirmPassword = [...confirmPassword];
      newConfirmPassword[index] = newValue;
      setConfirmPassword(newConfirmPassword);
    } else {
      const newPassword = [...password];
      newPassword[index] = newValue;
      setPassword(newPassword);
    }

    if (newValue && index < 5) {
      const inputs = document.getElementsByClassName(isConfirm ? 'confirm-input' : 'password-input');
      const nextInput = inputs[index + 1] as HTMLInputElement;
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>, isConfirm: boolean) => {
    if (e.key === 'Backspace') {
      if (isConfirm) {
        const newConfirmPassword = [...confirmPassword];
        if (newConfirmPassword[index] === '') {
          if (index > 0) {
            const inputs = document.getElementsByClassName('confirm-input');
            const prevInput = inputs[index - 1] as HTMLInputElement;
            if (prevInput) {
              prevInput.focus();
              newConfirmPassword[index - 1] = '';
            }
          }
        } else {
          newConfirmPassword[index] = '';
        }
        setConfirmPassword(newConfirmPassword);
      } else {
        const newPassword = [...password];
        if (newPassword[index] === '') {
          if (index > 0) {
            const inputs = document.getElementsByClassName('password-input');
            const prevInput = inputs[index - 1] as HTMLInputElement;
            if (prevInput) {
              prevInput.focus();
              newPassword[index - 1] = '';
            }
          }
        } else {
          newPassword[index] = '';
        }
        setPassword(newPassword);
      }
    }
  };

  const resetPasswordFields = () => {
    setPassword(['', '', '', '', '', '']);
    setConfirmPassword(['', '', '', '', '', '']);
  };

  if (!isOpen) return null;

  const renderMainMenu = () => (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Cài đặt ví</h2>
        <button 
          onClick={() => {
            onClose();
            setShowRegistration(false);
            setShowChangePassword(false);
            resetPasswordFields();
          }}
          className="text-gray-500 hover:text-gray-700"
        >
          <i className="fa-solid fa-times"></i>
        </button>
      </div>
      <div className="space-y-4">
        {!trang_thai_ma_xac_minh ? (
          <button 
            onClick={() => {
              resetPasswordFields();
              setShowRegistration(true);
            }}
            className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100 flex items-center justify-between"
          >
            <span>Đăng ký mật khẩu ví</span>
            <i className="fa-solid fa-chevron-right text-gray-400"></i>
          </button>
        ) : (
          <button 
            onClick={() => {
              resetPasswordFields();
              setShowChangePassword(true);
            }}
            className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100 flex items-center justify-between"
          >
            <span>Đổi mật khẩu ví</span>
            <i className="fa-solid fa-chevron-right text-gray-400"></i>
          </button>
        )}
        <Link to="/mypro/bank">
          <button 
            className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100 flex items-center justify-between"
          >
            <span>Phương Thức thanh toán</span>
            <i className="fa-solid fa-chevron-right text-gray-400"></i>
          </button>
        </Link>
      </div>
    </>
  );

  const renderPasswordForm = (title: string) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button 
            onClick={() => {
              setShowRegistration(false);
              setShowChangePassword(false);
              resetPasswordFields();
            }}
            className="text-gray-500 hover:text-gray-700"
          >
            <i className="fa-solid fa-times"></i>
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">Nhập mật khẩu ví</label>
            <div className="flex justify-between space-x-2">
              {password.map((digit, index) => (
                <input
                  key={index}
                  type="password"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleInputChange(index, e.target.value, false)}
                  onKeyDown={(e) => handleKeyDown(index, e, false)}
                  className="password-input w-10 h-10 text-center text-2xl border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">Nhập lại mật khẩu ví</label>
            <div className="flex justify-between space-x-2">
              {confirmPassword.map((digit, index) => (
                <input
                  key={index}
                  type="password"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleInputChange(index, e.target.value, true)}
                  onKeyDown={(e) => handleKeyDown(index, e, true)}
                  className="confirm-input w-10 h-10 text-center text-2xl border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ))}
            </div>
          </div>

          <button 
            onClick={handleSubmit}
            disabled={setupPasswordMutation.isPending}
            className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 text-sm font-bold disabled:bg-gray-400"
          >
            {setupPasswordMutation.isPending ? 'Đang xử lý...' : 'Xác nhận'}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96">
        {!showRegistration && !showChangePassword && renderMainMenu()}
        {showRegistration && renderPasswordForm('Đăng ký mật khẩu ví')}
        {showChangePassword && renderPasswordForm('Đổi mật khẩu ví')}
      </div>
    </div>
  );
};

export default SettingsModal;
