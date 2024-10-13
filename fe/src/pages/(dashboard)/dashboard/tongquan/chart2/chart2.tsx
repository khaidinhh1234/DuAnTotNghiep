import instance from "@/configs/admin";
import { ArrowDownOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import type { StatisticProps } from "antd";
import { Card, Statistic } from "antd";
import CountUp from "react-countup";
interface ChartProps {
  datestart?: string;
  dateend?: string;
}
const Chart2 = ({ datestart, dateend }: ChartProps) => {
  const { data } = useQuery({
    queryKey: ["chart1", datestart, dateend],
    queryFn: async () => {
      if (!datestart || !dateend) return null;
      const response = await instance.post("thong-ke/don-hang/chot", {
        ngay_bat_dau: datestart,
        ngay_ket_thuc: dateend,
      });
      return response.data;
    },
    enabled: !!datestart && !!dateend,
  });
  const formatter: StatisticProps["formatter"] = (value: any) => (
    <CountUp end={value as number} separator="," />
  );
  console.log(data);
  const phantien = data?.ti_le_tang_giam_tien > 0 ? true : false;

  const phandon = data?.ti_le_tang_giam_don_hang > 0 ? true : false;
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
                value={data?.tong_tien || 0}
                formatter={formatter}
                suffix="đ"
                valueStyle={{ color: "#FF6600" }}
              />
            </span>
          </div>
          <div
            className={`flex items-center mt-1 ${phantien ? "text-green-600" : "text-red-600"}`}
          >
            {" "}
            {phantien ? (
              <i className="fa-solid fa-arrow-up "></i>
            ) : (
              <ArrowDownOutlined />
            )}
            <span className=" ml-1 font-medium">
              {data?.ti_le_tang_giam_tien || 0} %
            </span>
          </div>
        </div>
        <div>
          <div className="text-black">
            Số lượng đơn hàng: <br />
            <span className="text-2xl font-bold text-black">
              {" "}
              <Statistic
                value={data?.tong_so_luong_don_hang || 0}
                formatter={formatter}
              />
            </span>
          </div>
          <div
            className={`flex items-center mt-1 ${phandon ? "text-green-600" : "text-red-600"}`}
          >
            {phandon ? (
              <i className="fa-solid fa-arrow-up "></i>
            ) : (
              <ArrowDownOutlined />
            )}
            <span className="text-green-500 ml-1  font-medium">
              {data?.ti_le_tang_giam_don_hang || 0} %
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default Chart2;
