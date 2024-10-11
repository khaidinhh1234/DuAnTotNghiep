import type { StatisticProps } from "antd";
import { Statistic } from "antd";
import Chart from "react-apexcharts";
import CountUp from "react-countup";
const formatter: StatisticProps["formatter"] = (value: any) => (
  <CountUp end={value as number} separator="," />
);
const Chart4 = () => {
  const chartData = {
    series: [
      {
        name: "165 ngày qua",
        data: [
          100000, 200000, 300000, 400000, 200000, 100000, 300000, 400000,
          500000, 100000, 400000,
        ], // Example data
      },
      {
        name: "165 ngày trước",
        data: [
          12000, 90000, 32000, 12000, 561000, 280000, 32000, 48000, 59000,
          130000, 45000,
        ], // Example data
      },
    ],
    options: {
      chart: {
        type: "line",
        height: 350,
      },
      stroke: {
        curve: "smooth",
        dashArray: [0, 5],
      },
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        categories: [
          "13/04/2024",
          "14/04/2024",
          "15/04/2024",
          "16/04/2024",
          "17/04/2024",
          "18/04/2024",
          "19/04/2024",
          "20/04/2024",
          "21/04/2024",
          "22/04/2024",
          "23/04/2024",
        ], // Days of the month
      },
      yaxis: {
        labels: {
          formatter: (val: number) => {
            return `${val.toLocaleString("vi-VN")} đ`;
          },
        },
      },
    },
  };

  return (
    <div className="bg-white p-4 rounded-md shadow">
      <div className="grid grid-cols-5 gap-4 mb-2 ml-auto">
        <div className="col-span-1 text-end border-r px-5">
          <h3 className="text-lg font-bold">Doanh số</h3>
          <p className="text-base font-semibold text-red-600">
            {" "}
            <Statistic
              value={120234}
              formatter={formatter}
              suffix="đ"
              valueStyle={{ fontSize: "16px" }} // Giảm font size ở đây
            />
          </p>
          <span className="text-red-600">↓ 89,09%</span>
        </div>
        <div className="col-span-1 text-end border-r px-5">
          <h3 className="text-lg font-bold">Lợi nhuận (17.22%)</h3>
          <p className="text-base font-semibold text-green-600">
            {" "}
            <Statistic
              value={120234}
              formatter={formatter}
              suffix="đ"
              valueStyle={{ fontSize: "16px" }} // Giảm font size ở đây
            />
          </p>
          <span className="text-green-600">↑ 89,09%</span>
        </div>
        <div className="col-span-1 text-end border-r px-5">
          <h3 className="text-lg font-bold">GTTB</h3>
          <p className="text-base font-semibold text-green-600">
            {" "}
            <Statistic
              value={120234}
              formatter={formatter}
              suffix="đ"
              valueStyle={{ fontSize: "16px" }} // Giảm font size ở đây
            />
          </p>
          <span className="text-green-600">↑ 89,09%</span>
        </div>
        <div className="col-span-1 text-end border-r px-5">
          <h3 className="text-lg font-bold">Đơn chốt</h3>
          <p className="text-base font-semibold text-red-600">
            {" "}
            <Statistic
              value={120234}
              formatter={formatter}
              valueStyle={{ fontSize: "16px" }} // Giảm font size ở đây
            />
          </p>
          <span className="text-red-600">↓ 89,09%</span>
        </div>
        <div className="col-span-1 text-end border-r px-5">
          <h3 className="text-lg font-bold">SL sản phẩm</h3>
          <p className="text-base font-semibold text-green-600">
            {" "}
            <Statistic
              value={120234}
              formatter={formatter}
              valueStyle={{ fontSize: "16px" }} // Giảm font size ở đây
            />
          </p>
          <span className="text-green-600">↑ 89,09%</span>
        </div>
      </div>

      <Chart
        options={chartData.options as any}
        series={chartData.series}
        type="line"
        height={420}
      />
    </div>
  );
};

export default Chart4;
