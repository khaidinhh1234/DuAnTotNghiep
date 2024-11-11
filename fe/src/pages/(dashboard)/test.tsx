import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import ReactApexChart from "react-apexcharts";

const Test = () => {
  // Define state using useState hook
  const [series, setSeries] = useState([
    {
      name: "Số lượng khách",
      type: "column",
      data: chart2?.so_luong_thanh_vien || [],
    },
    {
      name: "Tiền đã chi tiêu",
      type: "column",
      data: chart2?.tong_chi_tieu || [],
    },
  ]);

  const [options, setOptions] = useState({
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
    title: {
      text: "Phân tích Hạng thành viên",
      align: "left",
      offsetX: 110,
    },
    xaxis: {
      categories: chart2?.ten_hang_thanh_vien || [],
    },
    yaxis: [
      {
        seriesName: "Income",
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
        seriesName: "Cashflow",
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
            return `${value.toLocaleString()} đ `; // Format to show in millions
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
        position: "topLeft",
        offsetY: 30,
        offsetX: 60,
      },
    },
    legend: {
      horizontalAlign: "left",
      offsetX: 40,
    },
  });

  return (
    <div>
      <div id="chart">
        <ReactApexChart
          options={options}
          series={series}
          type="line"
          height={350}
        />
      </div>
      <div id="html-dist"></div>
    </div>
  );
};

export default Test;
