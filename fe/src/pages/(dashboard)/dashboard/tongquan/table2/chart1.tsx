import { ArrowDownOutlined } from "@ant-design/icons";
import { Card } from "antd";
import type { StatisticProps } from "antd";
import { Statistic } from "antd";
import Chart from "react-apexcharts";
import CountUp from "react-countup";
const formatter: StatisticProps["formatter"] = (value: any) => (
  <CountUp end={value as number} separator="," />
);
const Chart1 = () => {
  return (
    <div>
      {" "}
      <Card className=" rounded-lg bg-[#F2F4F7] w-60">
        <div className="">
          <div className="">
            <div className="text-black text-base">Doanh thu:</div>
            <div className="text-black text-lg font-bold">
              {" "}
              <Statistic
                value={120123234}
                formatter={formatter}
                suffix="đ"
                valueStyle={{ fontSize: "20px" }} // Giảm font size ở đây
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Chart1;
