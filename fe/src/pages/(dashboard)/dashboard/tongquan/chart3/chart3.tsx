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
const Chart3 = ({ datestart, dateend }: ChartProps) => {
  const date =
    datestart && dateend
      ? { ngay_bat_dau: datestart, ngay_ket_thuc: dateend }
      : null;

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["chart3", datestart, dateend],
    queryFn: async () => {
      const response = await instance.post("thong-ke/don-hang/chot", date);
      return response.data;
    },
    enabled: !!datestart && !!dateend,
  });

  const formatter: StatisticProps["formatter"] = (value: any) => (
    <CountUp end={value as number} separator="," />
  );
  useEffect(() => {
    if (datestart && dateend) {
      refetch();
    }
  }, [datestart, dateend, refetch]);
  const phantien = data?.ti_le_tang_giam_ton_kho > 0;
  const phandon = data?.ti_le_tang_giam_ton_kho > 0;

  return (
    <Card className="shadow-md px-1 rounded-lg bg-white flex flex-col">
      <div className="flex items-center mb-2">
        <div className="bg-blue-600 py-[7px] px-3 flex items-center rounded-full mr-2">
          <i className="fa-regular fa-box-check text-white text-xl"></i>
        </div>
        <div className="flex ">
          <h3 className="text-lg font-bold">Sản phẩm tồn kho: </h3>{" "}
          <h3 className="text-lg font-bold mx-1">
            {data?.tong_so_luong_ton_kho || 0} sản phẩm
          </h3>
        </div>
      </div>
      <div className="grid grid-cols-2">
        <div>
          <div className="text-black">
            Giá nhập: <br />
            <span className="text-2xl font-bold text-blue-800">
              {" "}
              <Statistic
                value={data?.tong_tien}
                formatter={formatter}
                suffix="đ"
                valueStyle={{ color: "#3333CC" }}
              />
            </span>
          </div>
          <div className="flex items-center mt-1">
            <ArrowDownOutlined className="text-red-500" />
            <span className="text-red-500 ml-1 font-medium">
              {data?.ti_le_tang_giam_tien || 0} %
            </span>
          </div>
        </div>
        <div>
          <div className="text-black">
            Giá bán: <br />
            <span className="text-2xl font-bold text-black">
              {" "}
              <Statistic value={""} formatter={formatter} />
            </span>
          </div>
          <div
            className={`flex items-center mt-1 ${phandon ? "text-green-600" : "text-red-600"}`}
          >
            {phandon ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
            <Text
              className={`ml-1 font-medium ${phandon ? "text-green-600" : "text-red-600"}`}
            >
              {data?.ti_le_tang_giam_ton_kho !== undefined &&
              data?.ti_le_tang_giam_ton_kho !== null &&
              data?.ti_le_tang_giam_ton_kho !== 0
                ? `${data.ti_le_tang_giam_ton_kho} %`
                : "0 %"}
            </Text>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default Chart3;
