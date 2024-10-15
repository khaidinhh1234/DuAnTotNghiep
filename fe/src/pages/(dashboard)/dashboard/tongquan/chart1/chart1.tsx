import instance from "@/configs/admin";
import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import type { StatisticProps } from "antd";
import { Card, Statistic, Typography } from "antd";
import { useEffect } from "react";
import CountUp from "react-countup";
const { Text } = Typography;
interface ChartProps {
  datestart?: string;
  dateend?: string;
}

const Chart1 = ({ datestart, dateend }: ChartProps) => {
  const date =
    datestart && dateend
      ? { ngay_bat_dau: datestart, ngay_ket_thuc: dateend }
      : null;

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["tongquanchart1", datestart, dateend],
    queryFn: async () => {
      const response = await instance.post("thong-ke/don-hang/chot", date);
      return response.data;
    },
    enabled: !!datestart && !!dateend,
  });

  const formatter: StatisticProps["formatter"] = (value: any) => (
    <CountUp end={value as number} separator="," />
  );
  const phantien = data?.ti_le_tang_giam_tien > 0;
  const phandon = data?.ti_le_tang_giam_don_hang > 0;

  // if (isLoading) {
  //   return <div>Loading...</div>;
  // }

  // if (isError) {
  //   return <div>Error: {error.message}</div>;
  // }
  useEffect(() => {
    if (datestart && dateend) {
      refetch();
    }
  }, [datestart, dateend, refetch]);
  console.log(data);
  return (
    <Card className="shadow-md px-1 rounded-lg bg-white flex flex-col">
      <div className="flex items-center mb-2">
        <div className="bg-green-600 py-[7px] px-3 flex items-center rounded-full mr-2">
          <i className="fa-regular fa-box-check text-white text-xl"></i>
        </div>
        <h3 className="text-lg font-bold">Tổng hàng chốt</h3>
      </div>
      <div className="grid grid-cols-2">
        <div>
          <div className="text-black">
            Tổng tiền: <br />
            <span className="text-2xl font-bold text-green-800">
              <Statistic
                value={data?.tong_tien || 0}
                formatter={formatter}
                suffix="đ"
                valueStyle={{ color: "#00AA00" }}
              />
            </span>
          </div>
          <div
            className={`flex items-center gap-1 mt-1 ${phantien ? "text-green-600" : "text-red-600"}`}
          >
            {phantien ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
            <Statistic
              value={data?.ti_le_tang_giam_tien || 0}
              formatter={formatter}
              suffix="%"
              valueStyle={{
                fontSize: "14px",
                color: phantien ? "green" : "red",
              }} // Giảm font size ở đây
            />
          </div>
        </div>
        <div>
          <div className="text-black">
            Số lượng đơn hàng: <br />
            <span className="text-2xl font-bold text-black">
              <Statistic
                value={data?.tong_so_luong_don_hang || 0}
                formatter={formatter}
              />
            </span>
          </div>
          <div
            className={`flex items-center gap-1 mt-1 ${phandon ? "text-green-600" : "text-red-600"}`}
          >
            {phandon ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
            <Statistic
              value={data?.ti_le_tang_giam_don_hang || 0}
              formatter={formatter}
              suffix="%"
              valueStyle={{
                fontSize: "14px",
                color: phandon ? "green" : "red",
              }} // Giảm font size ở đây
            />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default Chart1;
