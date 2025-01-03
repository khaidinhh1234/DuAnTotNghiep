import instance from "@/configs/admin";
import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import type { StatisticProps } from "antd";
import { Card, Statistic } from "antd";
import { useEffect } from "react";
import CountUp from "react-countup";

const Chart1 = ({ don_hang_chot }: any) => {
  // console.log(datestart, dateend);
  // const date =
  //   datestart && dateend
  //     ? { ngay_bat_dau: datestart, ngay_ket_thuc: dateend }
  //     : null;

  // const { data, refetch } = useQuery({
  //   queryKey: ["tongquanchart1", datestart, dateend],
  //   queryFn: async () => {
  //     const response = await instance.post("thong-ke/don-hang/chot", date);
  //     return response.data;
  //   },
  //   enabled: !!datestart && !!dateend,
  // });

  const formatter: StatisticProps["formatter"] = (value: any) => (
    <CountUp end={value as number} separator="," />
  );
  const phantien = don_hang_chot?.ti_le_tang_giam_tien > 0;
  const phandon = don_hang_chot?.ti_le_tang_giam_so_luong > 0;

  // useEffect(() => {
  //   if (datestart && dateend) {
  //     refetch();
  //   }
  // }, [datestart, dateend, refetch]);
  // console.log(data);
  return (
    <Card className="shadow-md rounded-lg bg-white px-0 sm:px-1 flex flex-col">
      <div className="flex items-center mb-2">
        <div className="bg-green-600 py-2 px-3 flex items-center rounded-full mr-2">
          <i className="fa-regular fa-box-check text-white text-xl"></i>
        </div>
        <h3 className="text-lg sm:text-xl font-bold">Tổng hàng chốt</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <div className="text-black">
            Tổng tiền:
            <br />
            <span className="text-xl sm:text-2xl font-bold text-green-800">
              <Statistic
                value={don_hang_chot?.tong_tien || 0}
                formatter={formatter}
                suffix="đ"
                valueStyle={{ color: "#00AA00" }}
              />
            </span>
          </div>
          <div
            className={`flex items-center gap-2 mt-1 ${
              phantien ? "text-green-600" : "text-red-600"
            }`}
          >
            {phantien ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
            <Statistic
              value={don_hang_chot?.ti_le_tang_giam_tien || 0}
              formatter={formatter}
              suffix="%"
              valueStyle={{
                fontSize: "14px",
                color: phantien ? "green" : "red",
              }}
            />
          </div>
        </div>
        <div>
          <div className="text-black">
            Số lượng đơn hàng:
            <br />
            <span className="text-xl sm:text-2xl font-bold">
              <Statistic
                value={don_hang_chot?.tong_so_luong || 0}
                formatter={formatter}
              />
            </span>
          </div>
          <div
            className={`flex items-center gap-2 mt-1 ${
              phandon ? "text-green-600" : "text-red-600"
            }`}
          >
            {phandon ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
            <Statistic
              value={don_hang_chot?.ti_le_tang_giam_so_luong || 0}
              formatter={formatter}
              suffix="%"
              valueStyle={{
                fontSize: "14px",
                color: phandon ? "green" : "red",
              }}
            />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default Chart1;
