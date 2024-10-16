import instance from "@/configs/admin";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import ReactApexChart from "react-apexcharts";

const Chart3: React.FC = () => {
  const { data } = useQuery({
    queryKey: ["tongquattable2chart3"],
    queryFn: async () => {
      const response = await instance.get(
        "thong-ke/doanh-thu-loi-nhuan-theo-ngay"
      );
      return response.data;
    },
  });
  console.log(data);
  const [chartData] = useState({
    series: [
      {
        name: "Lợi nhuận ròng",
        data: data?.loi_nhuan,
      },
      {
        name: "Doanh thu",
        data: data?.doanh_thu,
      },
    ],
    options: {
      chart: {
        type: "bar",
        height: 350,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
          endingShape: "rounded",
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"],
      },
      xaxis: {
        categories: [
          "0h",
          "2h",
          "4h",
          "6h",
          "8h",
          "10h",
          "12h",
          "14h",
          "16h",
          "18h",
          "20h",
          "22h",
          "24h",
        ],
      },
      yaxis: {
        title: {
          text: "",
        },
      },
      fill: {
        opacity: 1,
      },
      tooltip: {
        y: {
          formatter: (val: number) => {
            return `${val.toLocaleString("vi-VN")} đ`;
          },
        },
      },
    },
  });

  return (
    <div>
      <div id="chart">
        <ReactApexChart
          options={chartData.options as any}
          series={chartData.series}
          type="bar"
          height={350}
        />
      </div>
      <div id="html-dist"></div>
    </div>
  );
};

export default Chart3;
