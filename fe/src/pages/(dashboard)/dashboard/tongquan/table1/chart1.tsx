import instance from "@/configs/admin";
// import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import type { StatisticProps } from "antd";
import { Card, Statistic } from "antd";
import { useEffect } from "react";
import CountUp from "react-countup";
// const { Text } = Typography;
interface ChartProps {
  datestart?: string;
  dateend?: string;
}
const Chart1 = ({ datestart, dateend }: ChartProps) => {
  const date =
    datestart && dateend
      ? { ngay_bat_dau: datestart, ngay_ket_thuc: dateend }
      : null;
  // console.log(date);
  const { data, refetch } = useQuery({
    queryKey: ["tongquantable1chart1", datestart, dateend],
    queryFn: async () => {
      const response = await instance.post("thong-ke/doanh-thu/tong", date);
      return response.data;
    },
    enabled: !!datestart && !!dateend,
  });
  // console.log(data);
  const formatter: StatisticProps["formatter"] = (value: any) => (
    <CountUp end={value as number} separator="," />
  );

  useEffect(() => {
    if (datestart && dateend) {
      refetch();
    }
  }, [datestart, dateend, refetch]);
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
                value={data?.tong_doanh_thu || 0}
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
                value={data?.so_don_hang || 0}
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
