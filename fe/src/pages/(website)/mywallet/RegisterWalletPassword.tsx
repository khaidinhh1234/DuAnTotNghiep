
import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import instanceClient from '@/configs/client';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  status: boolean;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ 
  isOpen, 
  onClose,
  status 
}) => {
  const [showRegistration, setShowRegistration] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [oldPassword, setOldPassword] = useState(['', '', '', '', '', '']);
  const [password, setPassword] = useState(['', '', '', '', '', '']);
  const [confirmPassword, setConfirmPassword] = useState(['', '', '', '', '', '']);

  const setupPasswordMutation = useMutation({
    mutationFn: async (data: { ma_xac_minh?: string, ma_xac_minh_moi: string }) => {
      return await instanceClient.post('/thiet-lap-ma-xac-minh', data);
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
    const oldPasswordString = oldPassword.join('');

    if (passwordString !== confirmPasswordString) {
      toast.error('Mật khẩu không khớp');
      return;
    }

    if (passwordString.length !== 6) {
      toast.error('Vui lòng nhập đủ 6 số');
      return;
    }

    if (showChangePassword) {
      if (oldPasswordString.length !== 6) {
        toast.error('Vui lòng nhập đủ 6 số cho mật khẩu cũ');
        return;
      }
      setupPasswordMutation.mutate({
        ma_xac_minh: oldPasswordString,
        ma_xac_minh_moi: passwordString
      });
    } else {
      setupPasswordMutation.mutate({
        ma_xac_minh_moi: passwordString
      });
    }
  };

  const handleInputChange = (index: number, value: string, inputType: 'old' | 'new' | 'confirm') => {
    const newValue = value.replace(/[^0-9]/g, '');
    
    const updateState = {
      old: setOldPassword,
      new: setPassword,
      confirm: setConfirmPassword
    }[inputType];

    const currentState = {
      old: oldPassword,
      new: password,
      confirm: confirmPassword
    }[inputType];

    const newState = [...currentState];
    newState[index] = newValue;
    updateState(newState);

    if (newValue && index < 5) {
      const inputs = document.getElementsByClassName(`${inputType}-input`);
      const nextInput = inputs[index + 1] as HTMLInputElement;
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>, inputType: 'old' | 'new' | 'confirm') => {
    if (e.key === 'Backspace') {
      const updateState = {
        old: setOldPassword,
        new: setPassword,
        confirm: setConfirmPassword
      }[inputType];

      const currentState = {
        old: oldPassword,
        new: password,
        confirm: confirmPassword
      }[inputType];

      const newState = [...currentState];
      if (newState[index] === '') {
        if (index > 0) {
          const inputs = document.getElementsByClassName(`${inputType}-input`);
          const prevInput = inputs[index - 1] as HTMLInputElement;
          if (prevInput) {
            prevInput.focus();
            newState[index - 1] = '';
          }
        }
      } else {
        newState[index] = '';
      }
      updateState(newState);
    }
  };

  const resetPasswordFields = () => {
    setOldPassword(['', '', '', '', '', '']);
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
        {status ? (
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
          {showChangePassword && (
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">Nhập mật khẩu ví cũ</label>
              <div className="flex justify-between space-x-2">
                {oldPassword.map((digit, index) => (
                  <input
                    key={index}
                    type="password"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleInputChange(index, e.target.value, 'old')}
                    onKeyDown={(e) => handleKeyDown(index, e, 'old')}
                    className="old-input w-10 h-10 text-center text-2xl border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ))}
              </div>
            </div>
          )}

          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">
              {showChangePassword ? 'Nhập mật khẩu ví mới' : 'Nhập mật khẩu ví'}
            </label>
            <div className="flex justify-between space-x-2">
              {password.map((digit, index) => (
                <input
                  key={index}
                  type="password"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleInputChange(index, e.target.value, 'new')}
                  onKeyDown={(e) => handleKeyDown(index, e, 'new')}
                  className="new-input w-10 h-10 text-center text-2xl border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  onChange={(e) => handleInputChange(index, e.target.value, 'confirm')}
                  onKeyDown={(e) => handleKeyDown(index, e, 'confirm')}
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
