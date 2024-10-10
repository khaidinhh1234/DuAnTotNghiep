import { ArrowDownOutlined } from "@ant-design/icons";
import type { StatisticProps } from "antd";
import { Card, Statistic } from "antd";
import CountUp from "react-countup";
const Chart2 = () => {
  const formatter: StatisticProps["formatter"] = (value: any) => (
    <CountUp end={value as number} separator="," />
  );
  return (
    <Card className="shadow-md px-1 rounded-lg bg-white flex flex-col">
      <div className="flex items-center mb-2">
        <div className="bg-orange-600 py-[7px] px-3 flex items-center rounded-full mr-2">
          <i className="fa-regular fa-box-check text-white text-xl"></i>
        </div>

        <h3 className="text-lg font-bold">Tổng hàng hoàn</h3>
      </div>
      <div className="grid grid-cols-2">
        <div>
          <div className="text-black">
            Tổng tiền: <br />
            <span className="text-2xl font-bold text-orange-700">
              {" "}
              <Statistic
                value={145622234}
                formatter={formatter}
                suffix="đ"
                valueStyle={{ color: "#FF6600" }}
              />
            </span>
          </div>
          <div className="flex items-center mt-1">
            <ArrowDownOutlined className="text-red-500" />
            <span className="text-red-500 ml-1 font-medium">- 89,09 %</span>
          </div>
        </div>
        <div>
          <div className="text-black">
            Số lượng đơn hàng: <br />
            <span className="text-2xl font-bold text-black">
              {" "}
              <Statistic value={2234} formatter={formatter} />
            </span>
          </div>
          <div className="flex items-center mt-1">
            <i className="fa-solid fa-arrow-up text-green-500"></i>
            <span className="text-green-500 ml-1  font-medium">- 89,09 %</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default Chart2;
