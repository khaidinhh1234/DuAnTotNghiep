
import React, { useState } from 'react';
import { useSpring, animated } from '@react-spring/web';
interface BankData {
  name: string;
  logo: string;
  accountNumber?: string;
  accountHolder?: string;
  bankName?: string;
  id?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  userId?: string;

}

interface CreditCardFormProps {
  bankData: BankData;
}
const AnimatedDigit = ({ digit,  }: { digit: string; className?: string }) => {
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
          className={!number ? 'text-gray-400' : ''}
        />
      ))}
    </div>
  );
};

const maskCardNumber = (value : any) => {
  const onlyNums = value.replace(/\D/g, '');
  let maskedNumber = '';
  
  if (onlyNums.length <= 4) {
    return onlyNums;
  }
  
  maskedNumber = onlyNums.slice(0, 4);
  
  if (onlyNums.length > 4) {
    maskedNumber += ' ';
    for (let i = 4; i < Math.min(onlyNums.length, 12); i++) {
      maskedNumber += '#';
    }
  }
  
  if (onlyNums.length > 8) {
    maskedNumber += ' ';
  }
  
  if (onlyNums.length > 12) {
    maskedNumber += onlyNums.slice(12);
  }
  
  return maskedNumber;
};

function CreditCardForm({ bankData }: CreditCardFormProps) {
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');


  const handleCardNumberChange = (e : any) => {
    const input = e.target.value.replace(/\D/g, '');
    if (input.length <= 16) {
      setCardNumber(input);
    }
  };

  const formatDisplayCardNumber = (number : any) => {
    return number.replace(/(.{4})/g, '$1 ').trim();
  };

  return (
    <div className="">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg ">
        {/* Card Preview */}
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
            <div className="absolute left-6 top-4 h-14 w-20 rounded  from-gray-300 to-gray-100 shadow">   <img 
          src={bankData.logo} 
          alt={bankData.name} 
          className=" h-14 w-20 object-contain mr-3" 
        /></div>
            
            <div className="mt-16 text-center text-base tracking-widest drop-shadow-lg">
              <DisplayCardNumber number={cardNumber} />
            </div>
            
            <div className="mt-4 flex justify-between text-sm">
              <div>
                <div className="text-gray-200 drop-shadow-lg">Chủ Thẻ</div>
                <div className="font-semibold uppercase drop-shadow-lg">
                  {cardHolder || 'TÊN ĐẦY ĐỦ'}
                </div>
              </div>
              <div>
                <div className="text-gray-200 drop-shadow-lg">Hết Hạn</div>
                <div className="font-semibold drop-shadow-lg">
                  { 'MM/YY'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Số Thẻ</label>
            <input
              type="text"
              placeholder="1234 5678 9012 3456"
              value={formatDisplayCardNumber(cardNumber)}
              onChange={handleCardNumberChange}
              className="mt-1 w-full rounded-md border border-gray-300 p-2.5 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition duration-300 ease-in-out transform hover:scale-105"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Tên Chủ Thẻ</label>
            <input
              type="text"
              placeholder="Tên Đầy Đủ"
              value={cardHolder}
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
    </div>
  );
}

export default CreditCardForm;
