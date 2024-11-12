import React, { useState } from "react";
import ReactApexChart from "react-apexcharts";

interface DataPoint {
  x: number;
  y: number;
}

interface Series {
  name: string;
  data: DataPoint[];
}

const generateDayWiseTimeSeries = (
  baseval: number,
  count: number,
  yrange: { min: number; max: number }
): DataPoint[] => {
  let series = [];
  for (let i = 0; i < count; i++) {
    const x = baseval + i * 86400000;
    const y =
      Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;
    series.push({ x, y });
  }
  return series;
};

const Test: React.FC = () => {
  const [series, setSeries] = useState<Series[]>([
    {
      name: "Khách hàng mới",
      data: chart3?.so_luong_khach_hang_moi,
    },
    {
      name: "Khách hàng cũ",
      data: chart3?.so_luong_khach_hang_cu,
    },
    {
      name: "Tổng khách hàng",
      data: chart3?.tong_so_luong_khach_hang,
    },
  ]);

  const [options, setOptions] = useState({
    chart: {
      type: "area" as const,
      height: 350,
      stacked: true,
      events: {
        selection: function (chart: any, e: any) {
          console.log(new Date(e.xaxis.min));
        },
      },
    },
    colors: ["#00E396", "#008FFB", "#FF4560"],

    stroke: {
      curve: "monotoneCubic" as const,
    },
    fill: {
      type: "gradient" as const,
      gradient: {
        opacityFrom: 0.6,
        opacityTo: 0.8,
      },
    },
    legend: {
      position: "top" as const,
      horizontalAlign: "left" as const,
    },
    xaxis: {
      categories: chart3?.moc_time,
    },
    yaxis: {
      title: {
        text: "Số lượng khách hàng",
      },
    },
    dataLabels: {
      enabled: true,
    },
  });

  return (
    <div>
      <div id="chart">
        <ReactApexChart
          options={options}
          series={series}
          type="area"
          height={350}
        />
      </div>
      <div id="html-dist"></div>
    </div>
  );
};

export default Test;
