import type { StatisticProps } from "antd";
import { Card, Statistic } from "antd";
import CountUp from "react-countup";
const Chart1 = () => {
  const formatter: StatisticProps["formatter"] = (value: any) => (
    <CountUp end={value as number} separator="," />
  );
  return (
    <div>
      {" "}
      <Card className=" rounded-lg bg-[#F2F4F7] w-72">
        <div className="">
          <div className="flex justify-between">
            <div className="text-black">Tổng tiền:</div>
            <div className="text-black">_</div>
          </div>
          <div className="flex justify-between">
            <div className="text-black">Doanh thu:</div>
            <div className="text-black font-bold text-md">
              {" "}
              <Statistic
                value={1456234}
                formatter={formatter}
                suffix="đ"
                valueStyle={{ fontSize: "16px" }} // Giảm font size ở đây
              />
            </div>
          </div>
          <div className="flex justify-between">
            <div className="text-black text-lg">Đơn chốt:</div>
            <div className="text-black text-lg font-semibold">
              {" "}
              <Statistic
                value={234}
                formatter={formatter}
                valueStyle={{ fontSize: "17px" }} // Giảm font size ở đây
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Chart1;
