import React from "react";
import ReactApexChart from "react-apexcharts";

const Chart3: React.FC = () => {
  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "line", // Set to 'line' for a line chart
      height: 350,
    },
    title: {
      text: "Phân tích khách hàng trong ... ngày",
      align: "center",
      style: {
        fontSize: "20px",
      },
    },
    xaxis: {
      categories: [
        "Ngày 1",
        "Ngày 2",
        "Ngày 3",
        "Ngày 4",
        "Ngày 5",
        "Ngày 6",
        "Ngày 7",
        "Ngày 8",
        "Ngày 9",
        "Ngày 10",
      ],
    },
    yaxis: {
      title: {
        text: "Số lượng khách hàng",
      },
    },
    dataLabels: {
      enabled: true,
    },
    colors: ["#00E396", "#008FFB", "#FF4560"], // Custom colors for each series
    tooltip: {
      shared: true,
      intersect: false,
    },
    legend: {
      position: "top",
      horizontalAlign: "left",
    },
  };

  // Sample data for new customers, old customers, and total customers
  const series = [
    {
      name: "Khách hàng mới",
      data: [10, 12, 15, 20, 18, 22, 25, 30, 35, 40], // New customers in each of the 10 days
    },
    {
      name: "Khách hàng cũ",
      data: [5, 8, 7, 6, 10, 11, 9, 12, 15, 18], // Returning customers in each of the 10 days
    },
    {
      name: "Tổng khách hàng",
      data: [15, 20, 22, 26, 28, 33, 34, 42, 50, 58], // Total customers in each of the 10 days
    },
  ];

  return (
    <div id="chart" style={{ maxWidth: "800px", margin: "0 auto" }}>
      <ReactApexChart
        options={options}
        series={series}
        type="line"
        height={350}
      />
    </div>
  );
};

export default Chart3;
