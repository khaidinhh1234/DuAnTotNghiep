import React, { useState } from 'react';
import '../../../index.css'; // Đảm bảo có file CSS phù hợp

function CreditCardForm() {
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiryMonth, setExpiryMonth] = useState('');
  const [expiryYear, setExpiryYear] = useState('');
  const [cvv, setCvv] = useState('');

  // Hàm định dạng số thẻ, chỉ hiển thị 4 số đầu và 4 số cuối, giữa là "#### ####"
  const maskCardNumber = (value) => {
    const onlyNums = value.replace(/\D/g, ''); // Loại bỏ các ký tự không phải số
    if (onlyNums.length <= 4) return onlyNums; // Hiển thị trực tiếp nếu ít hơn 4 số
    if (onlyNums.length <= 12) return `${onlyNums.slice(0, 4)} #### ####`; // Nếu chưa đủ 16 số, hiển thị các ký tự có sẵn
    
    return `${onlyNums.slice(0, 4)} #### #### ${onlyNums.slice(-4)}`; // Hiển thị 4 số đầu và cuối
  };

  // Hàm xử lý khi người dùng nhập vào số thẻ
  const handleCardNumberChange = (e) => {
    const value = e.target.value.replace(/\s/g, ''); // Loại bỏ khoảng trắng
    setCardNumber(value);
  };

  return (
    <div className="container1">
      {/* Mẫu thẻ tín dụng */}
      <div className="card-preview">
        <div className="card">
          <div className="card-logo">VISA</div>
          <div className="card-chip"></div>
          <div className="card-number">
            {maskCardNumber(cardNumber) || '#### #### #### ####'}
          </div>
          <div className="card-details">
            <div className="card-holder">
              Chủ Thẻ<br />
              <strong>{cardHolder || 'TÊN ĐẦY ĐỦ'}</strong>
            </div>
            <div className="card-expiry">
              Hết Hạn<br />
              <strong>{expiryMonth && expiryYear ? `${expiryMonth}/${expiryYear}` : 'MM/YY'}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Form nhập liệu */}
      <form className="card-form">
        <label>Số Thẻ</label>
        <input
          type="text"
          placeholder="1234 5678 9012 3456"
          maxLength="19"
          value={cardNumber.replace(/(.{4})/g, '$1 ')} // Hiển thị theo từng nhóm 4 số
          onChange={handleCardNumberChange}
        />

        <label>Tên Chủ Thẻ</label>
        <input
          type="text"
          placeholder="Tên Đầy Đủ"
          value={cardHolder}
          onChange={(e) => setCardHolder(e.target.value)}
        />

        <label>Ngày Hết Hạn</label>
        <div className="expiry-cvv">
          <select value={expiryMonth} onChange={(e) => setExpiryMonth(e.target.value)}>
            <option value="">Tháng</option>
            {[...Array(12)].map((_, i) => (
              <option key={i} value={String(i + 1).padStart(2, '0')}>
                {String(i + 1).padStart(2, '0')}
              </option>
            ))}
          </select>
          <select value={expiryYear} onChange={(e) => setExpiryYear(e.target.value)}>
            <option value="">Năm</option>
            {[...Array(10)].map((_, i) => (
              <option key={i} value={2024 + i}>
                {2024 + i}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="CVV"
            maxLength="3"
            value={cvv}
            onChange={(e) => setCvv(e.target.value)}
          />
        </div>

        <button type="submit">Gửi</button>
      </form>
    </div>
  );
}

export default CreditCardForm;
