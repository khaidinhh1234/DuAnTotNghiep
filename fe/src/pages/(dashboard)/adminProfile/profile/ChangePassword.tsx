import React, { useState } from 'react';
import { Input, Button, message, Alert } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordMatchError, setPasswordMatchError] = useState(false); // Trạng thái lỗi khớp mật khẩu
  const [passwordLengthError, setPasswordLengthError] = useState(false); // Trạng thái lỗi độ dài mật khẩu
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSubmit = () => {
    // Kiểm tra độ dài mật khẩu
    if (newPassword.length < 6) {
      setPasswordLengthError(true);
      setAlert({ message: 'Mật khẩu mới phải có ít nhất 6 ký tự.', type: 'error' });
      return;
    }

    // Kiểm tra mật khẩu khớp
    if (newPassword !== confirmNewPassword) {
      setPasswordMatchError(true);
      setAlert({ message: 'Mật khẩu mới và xác nhận mật khẩu không khớp.', type: 'error' });
      return;
    }

    // Thông báo thành công
    setAlert({ message: 'Đổi mật khẩu thành công!', type: 'success' });
    message.success('Đổi mật khẩu thành công!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
    setPasswordMatchError(false);
    setPasswordLengthError(false);
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmNewPassword(e.target.value);
    if (newPassword !== e.target.value) {
      setPasswordMatchError(true);
    } else {
      setPasswordMatchError(false);
    }
  };

  return (
    <div className="max-w mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4">Đổi Mật Khẩu</h2>

      {/* Mật khẩu hiện tại */}
      <div className="mb-4">
        <label className="block text-gray-700">Mật khẩu hiện tại</label>
        <Input.Password
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
          className="mt-1"
        />
      </div>

      {/* Mật khẩu mới */}
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

      {/* Xác nhận mật khẩu mới */}
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

      {/* Nút đổi mật khẩu */}
      <div>
        <Button type="primary" onClick={handleSubmit}>
          Đổi mật khẩu
        </Button>
      </div>

      {/* Hiển thị Alert */}
      {alert && (
        <div className="mt-4">
          <Alert message={alert.message} type={alert.type} showIcon />
        </div>
      )}
    </div>
  );
};

export default ChangePassword;
