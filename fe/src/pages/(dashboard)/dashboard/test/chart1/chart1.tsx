import React from "react";
import { Card, Statistic } from "antd";
import {
  CheckCircleOutlined,
  ArrowDownOutlined,
  ArrowUpOutlined,
} from "@ant-design/icons";

const Chart1 = () => {
  return (
    <Card className="shadow-md p-4 rounded-lg bg-white flex flex-col">
      <div className="flex items-center mb-2">
        <CheckCircleOutlined className="text-green-500 text-2xl mr-2" />
        <h3 className="text-lg font-bold">Tổng hàng chốt</h3>
      </div>
      <div className="grid grid-cols-2">
        <div>
          <div className="text-gray-500">
            Tổng tiền: <br />
            <span className="text-4xl font-semibold text-black"> 8.232</span>
          </div>
          <div className="flex items-center mt-1">
            <ArrowDownOutlined className="text-red-500" />
            <span className="text-red-500 ml-1">- 89,09 %</span>
          </div>
        </div>
        <div>
          <div className="text-gray-500">
            Số tiền đơn hàng: <br />
            <span className="text-4xl font-semibold text-black"> 32</span>
          </div>
          <div className="flex items-center mt-1">
            <ArrowDownOutlined className="text-green-500" />
            <span className="text-green-500 ml-1">- 89,09 %</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default Chart1;
