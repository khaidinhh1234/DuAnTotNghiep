import { ArrowDownOutlined } from "@ant-design/icons";
import type { StatisticProps } from "antd";
import { Card, Statistic } from "antd";
import CountUp from "react-countup";
const Chart3 = () => {
  const formatter: StatisticProps["formatter"] = (value: any) => (
    <CountUp end={value as number} separator="," />
  );
  return (
    <Card className="shadow-md px-1 rounded-lg bg-white flex flex-col">
      <div className="flex items-center mb-2">
        <div className="bg-blue-600 py-[7px] px-3 flex items-center rounded-full mr-2">
          <i className="fa-regular fa-box-check text-white text-xl"></i>
        </div>
        <div className="flex ">
          <h3 className="text-lg font-bold">Sản phẩm tồn kho: </h3>{" "}
          <h3 className="text-lg font-bold mx-1">20 sản phẩm</h3>
        </div>
      </div>
      <div className="grid grid-cols-2">
        <div>
          <div className="text-black">
            Giá nhập: <br />
            <span className="text-2xl font-bold text-blue-800">
              {" "}
              <Statistic
                value={34234}
                formatter={formatter}
                suffix="đ"
                valueStyle={{ color: "#3333CC" }}
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
            Giá bán: <br />
            <span className="text-2xl font-bold text-black">
              {" "}
              <Statistic value={234} formatter={formatter} />
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

export default Chart3;
