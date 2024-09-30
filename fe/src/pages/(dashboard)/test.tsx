import React from "react";
import Chart from "react-apexcharts";
import { Card } from "antd";

const Component: React.FC = () => {
  const tuyChonBieuDo = {
    chart: {
      type: "bar" as "bar",
    },
    xaxis: {
      categories: [
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
      ],
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "50%",
      },
    },
    dataLabels: {
      enabled: false,
    },
    colors: ["#000000"], // Đặt màu cột là màu đen
  };

  const chuoiDuLieu = [
    {
      name: "Doanh số",
      data: [90, 10, 45, 50, 49, 60, 70, 80, 90, 100, 110, 120],
    },
  ];

  return (
    <Card title="Biểu đồ cột">
      <Chart
        options={tuyChonBieuDo}
        series={chuoiDuLieu}
        type="bar"
        height={350}
      />
    </Card>
  );
};

export default Component;
