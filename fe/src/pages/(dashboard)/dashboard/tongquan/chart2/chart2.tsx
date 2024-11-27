import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import type { StatisticProps } from "antd";
import { Card, Statistic } from "antd";
import CountUp from "react-countup";
// const { Text } = Typography;

const Chart2 = ({ don_hang_hoan }: any) => {
  const formatter: StatisticProps["formatter"] = (value: any) => (
    <CountUp end={value as number} separator="," />
  );
  const phantien = don_hang_hoan?.ti_le_tang_giam_tien > 0;
  const phandon = don_hang_hoan?.ti_le_tang_giam_so_luong > 0;

  return (
    <Card className="shadow-md rounded-lg bg-white px-0 sm:px-1 flex flex-col">
      <div className="flex items-center mb-2">
        <div className="bg-orange-600 py-2 px-3 flex items-center rounded-full mr-2">
          <i className="fa-regular fa-box-check text-white text-xl"></i>
        </div>
        <h3 className="text-lg sm:text-xl font-bold">Tổng hàng hoàn</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <div className="text-black">
            Tổng tiền: <br />
            <span className="text-xl sm:text-2xl font-bold text-orange-800">
              <Statistic
                value={don_hang_hoan?.tong_tien || 0}
                formatter={formatter}
                suffix="đ"
                valueStyle={{ color: "#fc4a1a" }}
              />
            </span>
          </div>
          <div
            className={`flex items-center gap-2 mt-1 ${phantien ? "text-green-600" : "text-red-600"}`}
          >
            {phantien ? <ArrowUpOutlined /> : <ArrowDownOutlined />}

            <Statistic
              value={don_hang_hoan?.ti_le_tang_giam_tien || 0}
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
            <span className="text-xl sm:text-2xl font-bold">
              <Statistic
                value={don_hang_hoan?.tong_so_luong || 0}
                formatter={formatter}
              />
            </span>
          </div>
          <div
            className={`flex items-center gap-2 mt-1 ${phandon ? "text-green-600" : "text-red-600"}`}
          >
            {phandon ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
            <Statistic
              value={don_hang_hoan?.ti_le_tang_giam_so_luong || 0}
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

export default Chart2;
