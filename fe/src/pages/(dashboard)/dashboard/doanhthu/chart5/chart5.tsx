"use client";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore

import Chart from "react-apexcharts";
import { Props } from "react-apexcharts";
import dayjs from "dayjs"; // Thêm thư viện dayjs
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const Chart5 = () => {
  const optionsareachart: Props = {
    chart: {
      id: "area-chart",
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      foreColor: "#adb0bb",
      zoom: {
        enabled: true,
      },
      toolbar: {
        show: true,
      },
    },
    dataLabels: {
      enabled: true,
    },
    stroke: {
      width: "3",
      curve: "smooth",
    },
    colors: ["#f5af19", "#66ff00", "#2193b0", "#c31432"],
    xaxis: {
      type: "datetime",
      categories: [
        "2018-09-20",
        "2018-09-21",
        "2018-09-22",
        "2018-09-23",
        "2018-09-24",
        "2018-09-25",
        "2018-09-26",
      ],
      labels: {
        formatter: function (value: any) {
          return dayjs(value).tz("Asia/Ho_Chi_Minh").format("DD/MM/YYYY");
        },
      },
    },
    yaxis: {
      opposite: false,
      labels: {
        show: true,
      },
    },
    legend: {
      show: true,
      position: "bottom",
      width: "50px",
    },
    grid: {
      show: false,
    },
    tooltip: {
      theme: "dark",
      fillSeriesColor: false,
    },
  };

  const seriesareachart = [
    {
      name: "Sản phẩm A",
      data: [31, 40, 28, 51, 42, 109, 100],
    },
    {
      name: "Sản phẩm B",
      data: [11, 92, 45, 102, 34, 52, 41],
    },
    {
      name: "Sản phẩm C",
      data: [60, 4, 100, 52, 12, 209, 50],
    },
    {
      name: "Sản phẩm D",
      data: [41, 192, 25, 22, 74, 82, 41],
    },
  ];

  return (
    <Chart
      className="bg-white p-5"
      options={optionsareachart}
      series={seriesareachart}
      type="area"
      height="500px"
    />
  );
};

export default Chart5;
