import React, { useEffect, useState } from "react";
import ApexCharts from "apexcharts";

const RevenueChart: React.FC = () => {
  const [timeframe, setTimeframe] = useState("week");

  const weeklyData = [500, 800, 1000, 700, 1200, 900, 1100];
  const monthlyData = [
    3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000, 11000, 12000, 13000, 14000,
  ];
  const yearlyData = [50000, 60000, 70000, 80000, 90000];

  useEffect(() => {
    const getData = () => {
      if (timeframe === "week") {
        return weeklyData;
      } else if (timeframe === "month") {
        return monthlyData;
      } else {
        return yearlyData;
      }
    };

    const getLabels = () => {
      if (timeframe === "week") {
        return [
          "Tuần 1",
          "Tuần 2",
          "Tuần 3",
          "Tuần 4",
          "Tuần 5",
          "Tuần 6",
          "Tuần 7",
        ];
      } else if (timeframe === "month") {
        return [
          "Tháng 1",
          "Tháng 2",
          "Tháng 3",
          "Tháng 4",
          "Tháng 5",
          "Tháng 6",
          "Tháng 7",
          "Tháng 8",
          "Tháng 9",
          "Tháng 10",
          "Tháng 11",
          "Tháng 12",
        ];
      } else {
        return ["Năm 2020", "Năm 2021", "Năm 2022", "Năm 2023", "Năm 2024"];
      }
    };

    const options = {
      series: [
        {
          name: "Doanh Thu",
          type: "line",
          data: getData(),
        },
      ],
      chart: {
        height: 350,
        type: "line",
      },
      stroke: {
        width: 4,
      },
      title: {
        text: `Doanh Thu Theo ${timeframe === "week" ? "Tuần" : timeframe === "month" ? "Tháng" : "Năm"}`,
      },
      dataLabels: {
        enabled: true,
      },
      labels: getLabels(),
      yaxis: {
        title: {
          text: "Doanh Thu (VNĐ)",
        },
      },
    };

    const chart = new ApexCharts(
      document.querySelector("#revenue-chart"),
      options
    );
    chart.render();

    return () => {
      chart.destroy();
    };
  }, [timeframe]);

  return (
    <div>
      <div>
        <button onClick={() => setTimeframe("week")}>Theo Tuần</button>
        <button onClick={() => setTimeframe("month")}>Theo Tháng</button>
        <button onClick={() => setTimeframe("year")}>Theo Năm</button>
      </div>
      <div id="revenue-chart" />
    </div>
  );
};

export default RevenueChart;
