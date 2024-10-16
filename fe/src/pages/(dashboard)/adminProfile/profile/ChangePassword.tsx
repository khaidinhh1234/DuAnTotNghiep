import React, { useState } from 'react';
import { Input, Button, Alert } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import instance from '@/configs/auth';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from '@/components/hook/useStoratge';

interface ChangPassword {
  current_password: string;
  new_password: string;
  new_password_confirmation: string;
  token?: string;
  user?: any; // Add user property
}

const ChangePassword = () => {
  const nav = useNavigate();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordMatchError, setPasswordMatchError] = useState(false);
  const [passwordLengthError, setPasswordLengthError] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [user] = useLocalStorage('user' as any, {});

  // Kiểm tra mật khẩu hợp lệ
  const handlePasswordValidation = () => {
    if (newPassword.length < 6) {
      setPasswordLengthError(true);
      setAlert({ message: 'Mật khẩu mới phải có ít nhất 6 ký tự.', type: 'error' });
      return false;
    }

    if (newPassword !== confirmNewPassword) {
      setPasswordMatchError(true);
      setAlert({ message: 'Mật khẩu mới và xác nhận mật khẩu không khớp.', type: 'error' });
      return false;
    }

    setPasswordLengthError(false);
    setPasswordMatchError(false);
    return true;
  };

  const handleSubmit = () => {
    const isValid = handlePasswordValidation();
    if (!isValid) return;

    onSubmit({
      current_password: currentPassword,
      new_password: newPassword,
      new_password_confirmation: confirmNewPassword,
    });
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmNewPassword(e.target.value);
    if (newPassword !== e.target.value) {
      setPasswordMatchError(true);
    } else {
      setPasswordMatchError(false);
    }
  };

  // Mutation để gửi yêu cầu đổi mật khẩu
  const { mutate } = useMutation({
    mutationFn: async (user: ChangPassword) => {
      try {
        const res = await instance.post('/change-password', user);
        toast.success(res.data.message || "Đổi mật khẩu thành công");
        setAlert({ message: 'Đổi mật khẩu thành công!', type: 'success' });

        // Reset form sau khi thành công
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Đổi mật khẩu thất bại');
        setAlert({ message: 'Đổi mật khẩu thất bại!', type: 'error' });
      }
    },
  });

  // Hàm để gọi mutate với user
  const onSubmit = (data: ChangPassword) => {
    if (!user) {
      toast.error('Token không hợp lệ hoặc không tồn tại');
      return;
    }

    mutate({ ...data, user }); // Gửi user kèm theo dữ liệu mật khẩu mới
  };

  return (
    <div className="max-w mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4">Đổi Mật Khẩu</h2>

      <div className="mb-4">
        <label className="block text-gray-700">Mật khẩu hiện tại</label>
        <Input.Password
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
          className="mt-1"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Mật khẩu mới</label>
        <Input.Password
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
          className="mt-1"
        />
        {passwordLengthError && (
          <p className="text-red-500 text-sm mt-1">Mật khẩu mới phải có ít nhất 6 ký tự</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Nhập lại mật khẩu mới</label>
        <Input.Password
          value={confirmNewPassword}
          onChange={handleConfirmPasswordChange}
          iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
          className="mt-1"
        />
        {passwordMatchError && (
          <p className="text-red-500 text-sm mt-1">Mật khẩu không khớp</p>
        )}
      </div>

      <div>
        <Button type="primary" onClick={handleSubmit}>
          Đổi mật khẩu
        </Button>
      </div>
    </div>
  );
};

export default ChangePassword;
