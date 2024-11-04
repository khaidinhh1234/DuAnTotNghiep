import React from "react";
import Chart from "react-apexcharts";

const Test = () => {
  const options = {
    chart: {
      height: 350,
      type: "area",
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
    },
    xaxis: {
      categories: [
        "25/10/2024",
        "26/10/2024",
        "27/10/2024",
        "28/10/2024",
        "29/10/2024",
        "30/10/2024",
        "31/10/2024",
        "01/11/2024",
        "02/11/2024",
        "03/11/2024",
        "04/11/2024",
      ],
    },
    tooltip: {
      x: {
        format: "dd/MM/yyyy",
      },
    },
    yaxis: {
      labels: {
        formatter: (val) => {
          return `${val.toLocaleString("vi-VN")} đ`;
        },
      },
    },
  };

  const series = [
    {
      name: "Doanh thu đơn thành công",
      data: [0, 0, 0, 0, "23562", 0, 0, 0, 0, "2346", 0],
    },
    {
      name: "Số tiền hoàn hàng",
      data: [0, 0, 0, 0, 0, 0, 0, 0, 0, "84324", 0],
    },
  ];

  return (
    <div id="chart">
      <Chart options={options} series={series} type="area" height={350} />
    </div>
  );
};

export default Test;
