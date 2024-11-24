import React, { useState } from "react";
import { QRCode, Input, Space, Button } from "antd";

const Test: React.FC = () => {
  const [receiver, setReceiver] = useState("09748943593");
  const [amount, setAmount] = useState("1000000");
  const [description, setDescription] = useState("Thanh toán tiền điện");

  // Tạo URL cho mã QR
  const qrValue = `momo://pay?receiver=${receiver}&amount=${amount}&description=${encodeURIComponent(
    description
  )}`;
  return (
    <Space direction="vertical" align="center" style={{ marginTop: 20 }}>
      <QRCode value={qrValue} /> {/* Tạo QRCode */}
      <Space direction="vertical" style={{ width: "300px" }}>
        <Input
          placeholder="Số tài khoản"
          value={receiver}
          onChange={(e) => setReceiver(e.target.value)}
        />
        <Input
          placeholder="Số tiền"
          value={amount}
          type="number"
          onChange={(e) => setAmount(e.target.value)}
        />
        <Input
          placeholder="Mô tả giao dịch"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </Space>
      <Button type="primary" onClick={() => window.open(qrValue, "_blank")}>
        Thanh toán bằng MoMo
      </Button>
    </Space>
  );
};

export default Test;
