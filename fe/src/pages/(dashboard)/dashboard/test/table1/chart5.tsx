import React from "react";
import Chart from "react-apexcharts";

const Chart5 = () => {
  const chartData = {
    series: [
      {
        name: "doanh số",
        data: [320, 100, 320, 100, 200, 100, 300, 200, 500, 100, 200], // Example data
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
          formatter: (val: number) => `${val}M`,
        },
      },
    },
  };

  return (
    <div className="bg-white p-4 rounded-md shadow">
      <div className="grid grid-cols-5 gap-4 mb-2 ml-auto">
        <div className="col-span-1 text-end border-r px-5">
          <h3 className="text-lg font-bold">Doanh số</h3>
          <p className="text-base font-semibold text-red-600">42.260.927 đ</p>
          <span className="text-red-600">↓ 89,09%</span>
        </div>
        <div className="col-span-1 text-end border-r px-5">
          <h3 className="text-lg font-bold">Lợi nhuận (17.22%)</h3>
          <p className="text-base font-semibold text-green-600">5.987.227 đ</p>
          <span className="text-green-600">↑ 89,09%</span>
        </div>
        <div className="col-span-1 text-end border-r px-5">
          <h3 className="text-lg font-bold">GTTB</h3>
          <p className="text-base font-semibold text-green-600">540.325 đ</p>
          <span className="text-green-600">↑ 89,09%</span>
        </div>
        <div className="col-span-1 text-end border-r px-5">
          <h3 className="text-lg font-bold">Đơn chốt</h3>
          <p className="text-base font-semibold text-red-600">71</p>
          <span className="text-red-600">↓ 89,09%</span>
        </div>
        <div className="col-span-1 text-end border-r px-5">
          <h3 className="text-lg font-bold">SL sản phẩm</h3>
          <p className="text-base font-semibold text-green-600">17</p>
          <span className="text-green-600">↑ 89,09%</span>
        </div>
      </div>

      <Chart
        options={chartData.options}
        series={chartData.series}
        type="line"
        height={420}
      />
    </div>
  );
};

export default Chart5;
