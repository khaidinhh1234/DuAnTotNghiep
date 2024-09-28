import React from "react";
import Chart from "react-apexcharts";
import { Card } from "antd";

const Chart5: React.FC = () => {
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
        borderRadius: 5,
        borderRadiusApplication: "end" as "end", // Làm tròn phần trên của cột
      },
    },
    dataLabels: {
      enabled: false,
    },
    colors: ["#000000"], // Đặt màu cột là màu đen
    tooltip: {
      y: {
        formatter: (val: number) => {
          return val.toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
          });
        },
      },
    },
  };

  const chuoiDuLieu = [
    {
      name: "Doanh số",
      data: [
        90000, 10000, 45000, 50000, 39000, 60000, 70000, 80000, 50000, 100000,
        70000, 120000,
      ],
    },
  ];

  return (
    <Card>
      <Chart
        options={tuyChonBieuDo}
        series={chuoiDuLieu}
        type="bar"
        height={450}
      />
    </Card>
  );
};

export default Chart5;
