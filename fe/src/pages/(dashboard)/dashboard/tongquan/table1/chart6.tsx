import type { StatisticProps } from "antd";
import { Statistic } from "antd";
import Chart from "react-apexcharts";
import CountUp from "react-countup";
const formatter: StatisticProps["formatter"] = (value: any) => (
  <CountUp end={value as number} separator="," />
);
const Chart6 = () => {
  const chartData = {
    series: [
      {
        name: "Đơn hủy",
        data: [1100, 200, 300, 6400, 200, 5100, 4300, 6400, 500, 3100, 8400], // Example data
      },

      {
        name: "Đơn chốt",
        data: [1100, 2100, 3100, 4200, 2300, 3200, 2300, 100, 600, 200, 300], // Example data
      },
    ],

    options: {
      chart: {
        type: "line",
        height: 350,
      },
      stroke: {
        curve: "smooth",
      },
      colors: ["#FF0000", "#00FF00"],
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        categories: [
          "13",
          "14",
          "15",
          "16",
          "17",
          "18",
          "19",
          "20",
          "21",
          "22",
          "23",
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

export default Chart6;
