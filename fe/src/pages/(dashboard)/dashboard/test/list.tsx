import React from "react";
import { Card, Statistic, Row, Col } from "antd";
import Chart1 from "./chart1/chart1";

const List = () => {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-6">Tổng quan</h2>
      <Row gutter={16}>
        <Col span={12} sm={8}>
          <Chart1 />
        </Col>
        <Col span={12} sm={8}>
          <Card className="shadow-md">
            <Statistic
              title="Tổng hàng hoàn"
              value={193628167}
              precision={0}
              valueStyle={{ color: "#ff4d4f" }}
              suffix="đ"
            />
            <div className="mt-2 text-gray-500">Số lượng: 561</div>
            <div className="text-red-600">- 19%</div>
          </Card>
        </Col>
        <Col span={12} sm={8}>
          <Card className="shadow-md">
            <Statistic
              title="Có thể bán"
              value={12342}
              precision={0}
              valueStyle={{ color: "#1677ff" }}
            />
            <div className="mt-2 text-gray-500">Giá nhập: 2.640.629.900 đ</div>
            <div className="text-gray-500">Giá bán: 3.791.877.500 đ</div>
            <div className="text-yellow-600">Cần nhập thêm: 119%</div>
          </Card>
        </Col>
      </Row>

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">
          Thông tin kinh doanh hôm nay
        </h3>
        <Row gutter={16}>
          <Col span={12}>
            <Card className="shadow-md">
              <Statistic title="Doanh thu" value={42260927} suffix="đ" />
              <div className="text-gray-500">Đơn chốt: 87</div>
            </Card>
          </Col>
        </Row>
      </div>

      <div className="mt-4">
        {/* Biểu đồ doanh thu có thể được thêm vào đây */}
        <canvas id="revenueChart" className="border rounded-md p-4"></canvas>
      </div>
    </div>
  );
};

export default List;
