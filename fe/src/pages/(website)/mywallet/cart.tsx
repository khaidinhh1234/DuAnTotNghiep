
import React, { useEffect, useRef, useState } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import instanceClient from '@/configs/client';
import { toast } from 'react-toastify';

interface BankData {
  name: string;
  logo: string;
}

const AnimatedDigit = ({ digit }: { digit: string }) => {
  const animation = useSpring({
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
    config: { tension: 300, friction: 20 }
  });

  return (
    <animated.span style={animation} className="inline-block">
      {digit}
    </animated.span>
  );
};

const DisplayCardNumber = ({ number }: { number: string }) => {
  const maskedNumber = number ? maskCardNumber(number) : '';
  const emptyDisplay = '#### #### #### ####';
  
  return (
    <div className="flex justify-center space-x-2">
      {(maskedNumber || emptyDisplay).split('').map((digit: string, index: number) => (
        <AnimatedDigit 
          key={index + digit} 
          digit={digit === ' ' ? '\u00A0' : digit} 
        />
      ))}
    </div>
  );
};

const maskCardNumber = (value: string) => {
  const onlyNums = value.replace(/\D/g, '');
  let maskedNumber = '';
  
  if (onlyNums.length <= 4) return onlyNums;
  maskedNumber = onlyNums.slice(0, 4);
  
  if (onlyNums.length > 4) {
    maskedNumber += ' ';
    for (let i = 4; i < Math.min(onlyNums.length, 12); i++) {
      maskedNumber += '#';
    }
  }
  
  if (onlyNums.length > 8) maskedNumber += ' ';
  if (onlyNums.length > 12) maskedNumber += onlyNums.slice(12);
  
  return maskedNumber;
};
const PinModal = ({ isOpen, onClose, onSubmit, isLoading }: any) => {
  const [pins, setPins] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (isOpen) {
      resetPins();
      inputRefs.current[0]?.focus();
    }
  }, [isOpen]);

  const resetPins = () => {
    setPins(['', '', '', '', '', '']);
    inputRefs.current[0]?.focus();
  };

  const handleChange = (index: number, value: string) => {
    if (value.match(/^[0-9]$/)) {
      const newPins = [...pins];
      newPins[index] = value;
      setPins(newPins);
      if (index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !pins[index] && index > 0) {
      const newPins = [...pins];
      newPins[index - 1] = '';
      setPins(newPins);
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = () => {
    onSubmit(pins.join(''));
    resetPins();
  };

  if (!isOpen) return null;

  return (
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
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-10 h-10 text-center text-2xl border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={() => {
              resetPins();
              onClose();
            }}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            disabled={pins.some(pin => !pin) || isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Đang xử lý...' : 'Xác nhận'}
          </button>
        </div>
      </div>
    </div>
  );
};


function CreditCardForm({ bankData }: { bankData: BankData }) {
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [showPinModal, setShowPinModal] = useState(false);
  const queryClient = useQueryClient();

  const addBankMutation = useMutation({
    mutationFn: (data: any) => {
      return instanceClient.post('/them-ngan-hang', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['linkedBanks'] });
      toast.success('Thêm ngân hàng thành công');
      setShowPinModal(false);
      setCardNumber('');
      setCardHolder('');
    },
    onError: (error : any) => {
      const errorMessage = error.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại!';
      toast.error(errorMessage);    }
  });
  

  const [error, setError] = useState('');

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.replace(/\D/g, '');
    if (input.length <= 16) {
      setCardNumber(input);
      if (input.length > 0 && input.length < 6) {
        setError('Số thẻ phải có ít nhất 6 chữ số');
      } else {
        setError('');
      }
    }
  };
  

  const formatDisplayCardNumber = (number: string) => {
    return number.replace(/(.{4})/g, '$1 ').trim();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowPinModal(true);
  };

  const handlePinSubmit = (pin: string) => {
    addBankMutation.mutate({
      ngan_hang: bankData.name,
      logo_ngan_hang: bankData.logo,
      ten_chu_tai_khoan: cardHolder,
      tai_khoan_ngan_hang: cardNumber,
      ma_xac_minh: pin
    });
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="rounded-2xl bg-white p-6 shadow-lg">
        <div className="mb-6">
          <div 
            className="relative h-56 w-full rounded-xl p-6 text-white shadow-md"
            style={{
              backgroundImage: "url('/istockphoto-1332736514-1024x1024.jpg')",
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="absolute right-6 top-6 text-xl font-bold italic tracking-wider text-white drop-shadow-lg">
              <h2 className="text-lg font-semibold">{bankData.name}</h2>
            </div>
            <div className="absolute left-6 top-4 h-14 w-20 rounded shadow">
              <img 
                src={bankData.logo} 
                alt={bankData.name} 
                className="h-14 w-20 object-contain" 
              />
            </div>
            
            <div className="mt-16 text-center text-base tracking-widest drop-shadow-lg">
              <DisplayCardNumber number={cardNumber} />
            </div>
            
            <div className="mt-4 flex justify-between text-sm">
              <div>
                <div className="text-gray-200 drop-shadow-lg">Chủ Tài Khoản</div>
                <div className="font-semibold uppercase drop-shadow-lg">
                  {cardHolder || 'TÊN ĐẦY ĐỦ'}
                </div>
              </div>
              <div>
                <div className="text-gray-200 drop-shadow-lg">Hết Hạn</div>
                <div className="font-semibold drop-shadow-lg">MM/YY</div>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Số Tài Khoản</label>
            <input
              type="text"
              placeholder="1234 5678 9012 3456"
              value={formatDisplayCardNumber(cardNumber)}
              onChange={handleCardNumberChange}
              className="mt-1 w-full rounded-md border border-gray-300 p-2.5 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition duration-300 ease-in-out transform hover:scale-105"
            />
              {error && (
    <p className="mt-1 text-sm text-red-500">
      {error}
    </p>
  )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Tên Chủ Tài Khoản</label>
            <input
              type="text"
              placeholder="Tên Đầy Đủ"
              value={cardHolder}
              maxLength={25}
              onChange={(e) => setCardHolder(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 p-2.5 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition duration-300 ease-in-out transform hover:scale-105"
            />
          </div>

          <button
            type="submit"
            className="mt-6 w-full rounded-md bg-blue-600 py-3 text-white transition duration-300 ease-in-out transform hover:scale-105 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Gửi
          </button>
        </form>
      </div>

      <PinModal
        isOpen={showPinModal}
        onClose={() => setShowPinModal(false)}
        onSubmit={handlePinSubmit}
        isLoading={addBankMutation.isPending}
      />
    </div>
  );
}

export default CreditCardForm;
