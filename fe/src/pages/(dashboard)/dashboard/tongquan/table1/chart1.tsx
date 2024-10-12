import instance from "@/configs/admin";
import { useQuery } from "@tanstack/react-query";
import type { StatisticProps } from "antd";
import { Card, Statistic } from "antd";
import CountUp from "react-countup";
const Chart1 = () => {
  const { data } = useQuery({
    queryKey: ["chart1"],
    queryFn: async () => {
      const response = await instance.post("thong-ke/doanh-thu/tong");
      return response.data;
    },
  });
  // console.log(data);
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
                value={data?.doanh_thu || 0}
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
                value={data?.tong_so_luong_don_hang || 0}
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
