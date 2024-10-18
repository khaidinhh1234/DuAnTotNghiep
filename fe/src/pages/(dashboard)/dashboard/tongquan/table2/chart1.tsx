import instance from "@/configs/admin";
import { useQuery } from "@tanstack/react-query";
import type { StatisticProps } from "antd";
import { Card, Statistic } from "antd";
import CountUp from "react-countup";
const formatter: StatisticProps["formatter"] = (value: any) => (
  <CountUp end={value as number} separator="," />
);
const Chart1 = () => {
  const { data } = useQuery({
    queryKey: ["table2chart1"],
    queryFn: async () => {
      const response = await instance.get(
        "thong-ke/doanh-thu-va-don-theo-ngay"
      );
      return response.data;
    },
  });
  // console.log(data);
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
                value={data?.tong_doanh_thu || 0}
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
