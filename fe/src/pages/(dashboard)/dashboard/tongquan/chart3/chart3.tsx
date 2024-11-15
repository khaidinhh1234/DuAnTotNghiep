import instance from "@/configs/admin";
import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import type { StatisticProps } from "antd";
import { Card, Statistic } from "antd";
import { useEffect } from "react";
import CountUp from "react-countup";

interface ChartProps {
  datestart?: string;
  dateend?: string;
}
const Chart3 = ({ datestart, dateend }: ChartProps) => {
  const date =
    datestart && dateend
      ? { ngay_bat_dau: datestart, ngay_ket_thuc: dateend }
      : null;

  const { data, refetch } = useQuery({
    queryKey: ["tongquanchart3", datestart, dateend],
    queryFn: async () => {
      const response = await instance.post("thong-ke/san-pham/ton-kho", date);
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
  const phantien = data?.ti_le_tang_giam_ton_kho > 0;

  return (
    <Card className="shadow-md px-1 rounded-lg bg-white flex flex-col">
      <div className="flex items-center mb-2">
        <div className="bg-blue-600 py-[7px] px-3 flex items-center rounded-full mr-2">
          <i className="fa-regular fa-box-check text-white text-xl"></i>
        </div>
        <div className="flex ">
          <h3 className="text-lg font-bold">Tổng SL Sản phẩm: </h3>{" "}
          <h3 className="text-lg font-bold mx-1">
            {data?.tong_so_luong_ton_kho || 0} sản phẩm
          </h3>
        </div>
      </div>
      <div className="grid grid-cols-2">
        <div>
          <div className="text-black">
            Chi phí sản xuất: <br />
            <span className="text-2xl font-bold text-blue-800">
              {" "}
              <Statistic
                value={data?.tong_chi_phi_san_xuat}
                formatter={formatter}
                suffix="đ"
                valueStyle={{ color: "#3333CC" }}
              />
            </span>
          </div>
          <div
            className={`flex items-center gap-1 mt-1 ${phantien ? "text-green-600" : "text-red-600"}`}
          >
            {phantien ? <ArrowUpOutlined /> : <ArrowDownOutlined />}

            <Statistic
              value={data?.ti_le_tang_giam_ton_kho || 0}
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
          {/* <div className="text-black">
            Giá bán : <br />
            <span className="text-2xl font-bold text-black">
              {" "}
              <Statistic
                value={data?.tong_gia_ban}
                formatter={formatter}
                suffix="đ"
              />
            </span>
          </div> */}
          {/* <div
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
          </div> */}
        </div>
      </div>
    </Card>
  );
};

export default Chart3;
