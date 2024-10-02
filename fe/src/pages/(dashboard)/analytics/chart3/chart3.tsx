import React, { useEffect } from "react";
import ApexCharts from "apexcharts";

const Chart3: React.FC = () => {
  // Dữ liệu doanh thu trong 10 ngày
  const revenueData = [
    1200, 1500, 1800, 1600, 1900, 1700, 2000, 2100, 2200, 2300,
  ];

  // Lấy 10 ngày gần nhất
  const getLast10Days = () => {
    const today = new Date();
    const days = [];
    for (let i = 0; i < 10; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      days.unshift(`${date.getDate()} Thg ${date.getMonth() + 1}`);
    }
    return days;
  };

  useEffect(() => {
    const options = {
      series: [
        {
          name: "Doanh Thu",
          type: "line",
          data: revenueData,
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
        text: "Doanh Thu Trong 10 Ngày Qua",
      },
      dataLabels: {
        enabled: true,
      },
      labels: getLast10Days(),
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
  }, []);

  return <div id="revenue-chart" />;
};

export default Chart3;
