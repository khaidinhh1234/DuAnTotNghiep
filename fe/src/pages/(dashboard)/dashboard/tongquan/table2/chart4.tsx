import type { StatisticProps } from "antd";
import { Card, Statistic } from "antd";
import CountUp from "react-countup";
const formatter: StatisticProps["formatter"] = (value: any) => (
  <CountUp end={value as number} separator="," />
);
const Chart4 = () => {
  return (
    <div>
      {" "}
      <Card className=" rounded-lg bg-[#F2F4F7] w-60">
        <div className="">
          <div className="">
            <div className="text-black text-base">Bán tại quầy:</div>{" "}
            <div className="text-black text-lg font-bold">
              {" "}
              <Statistic
                value={23423}
                formatter={formatter}
                suffix="đ"
                valueStyle={{ fontSize: "20px" }} // Giảm font size ở đây
              />
            </div>
            <div className="text-black text-lg font-bold">
              {" "}
              <Statistic
                value={34}
                formatter={formatter}
                suffix="chốt"
                valueStyle={{ fontSize: "20px" }} // Giảm font size ở đây
              />{" "}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Chart4;
