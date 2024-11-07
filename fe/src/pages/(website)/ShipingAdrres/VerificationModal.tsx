import { Modal, Input } from 'antd';
import { useState } from 'react';

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: (code: string) => void;
}

const VerificationModal = ({ isOpen, onClose, onVerify }: VerificationModalProps) => {
  const [verificationCode, setVerificationCode] = useState('');

  const handleVerify = () => {
    onVerify(verificationCode);
    setVerificationCode('');
  };

  return (
    <Modal
      title="Xác minh thanh toán"
      open={isOpen}
      onCancel={onClose}
      onOk={handleVerify}
      okText="Xác nhận"
      cancelText="Hủy"
    >
      <div className="py-4">
        <label className="block mb-2">Nhập mã xác minh:</label>
        <Input
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
          placeholder="Nhập mã xác minh"
          className="w-full"
        />
      </div>
    </Modal>
  );
};

export default VerificationModal;
