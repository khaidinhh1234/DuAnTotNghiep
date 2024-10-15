import React from "react";
import ReactApexChart from "react-apexcharts";

const Chart2: React.FC = () => {
  const options: ApexCharts.ApexOptions = {
    series: [
      {
        name: "Số lượng khách",
        type: "column",
        data: [14, 20, 25, 15, 95, 28, 38, 46],
      },
      {
        name: "Tiền đã chi tiêu",
        type: "column",
        data: [10, 37, 31, 46, 41, 49, 65, 85],
      },
    ],
    chart: {
      height: 350,
      type: "line",
      stacked: false,
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      width: [1, 1],
    },

    xaxis: {
      categories: [
        "Rank 1",
        "Rank 2",
        "Rank 3",
        "Rank 4",
        "Rank 5",
        "Rank 6",
        "Rank 7",
        "Rank 8",
      ], // Ranks instead of years
    },
    yaxis: [
      {
        seriesName: "Số lượng khách",
        axisTicks: {
          show: true,
        },
        axisBorder: {
          show: true,
          color: "#008FFB",
        },
        labels: {
          style: {
            colors: "#008FFB",
          },
          formatter: (value: number) => {
            return `${value}`; // Format to show in millions
          },
        },
        title: {
          text: "Số lượng khách (triệu khách)",
          style: {
            color: "#008FFB",
          },
        },
        tooltip: {
          enabled: true,
        },
      },
      {
        seriesName: "Tiền đã chi tiêu",
        opposite: true,
        axisTicks: {
          show: true,
        },
        axisBorder: {
          show: true,
          color: "#00E396",
        },
        labels: {
          style: {
            colors: "#00E396",
          },
          formatter: (value: number) => {
            return `${value}M`; // Format to show in millions
          },
        },
        title: {
          text: "Tiền đã chi tiêu (triệu đồng)",
          style: {
            color: "#00E396",
          },
        },
      },
    ],
    tooltip: {
      fixed: {
        enabled: true,
        position: "topLeft", // Options: topRight, topLeft, bottomRight, bottomLeft
        offsetY: 30,
        offsetX: 60,
      },
    },
    legend: {
      horizontalAlign: "left",
      offsetX: 40,
    },
  };

  return (
    <>
      {" "}
      <h3 className="font-semibold">Phân tích Hạng thành viên</h3>
      <div id="chart" style={{ maxWidth: "800px", margin: "0 auto" }}>
        <ReactApexChart
          options={options}
          series={options.series}
          type="line"
          height={350}
        />
      </div>
    </>
  );
};

export default Chart2;
