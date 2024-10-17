import instance from "@/configs/admin";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import ReactApexChart from "react-apexcharts";
const conlai = 100 - (57 + 3 + 4);
const Chart1: React.FC = () => {
  const { data: chart1 } = useQuery({
    queryKey: ["khachhangtable1chart1"],
    queryFn: async () => {
      const response = await instance.get("/thong-ke/khach-hang-do-tuoi");
      return response.data;
    },
  });
  console.log(chart1);
  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "donut",
      toolbar: {
        show: false,
      },
    },
    labels: ["Nam", "Nữ", "khác", "Chưa có DL"],
    colors: ["#1E90FF", "#32CD32", "#38ef7d", "#D3D3D3"], // Blue, Green, Grey
    legend: {
      show: true,
      position: "left",
      markers: {
        height: 10,
        radius: 10,
        offsetX: -5,
      },
      labels: {
        colors: ["#000"],
      },
      itemMargin: {
        vertical: 5,
      },
    },
    dataLabels: {
      enabled: false, // Disable data labels
    },
    plotOptions: {
      pie: {
        donut: {
          size: "80%",
          labels: {
            show: true, // Show center label
            name: {
              fontSize: "22px", // Customize center label font size
              fontWeight: "bold", // Make it bold
            },
            value: {
              fontSize: "16px", // Customize value font size
              fontWeight: "normal", // Make it normal
            },
          },
        },
      },
    },
    stroke: {
      show: true,
      width: 0,
    },
    tooltip: {
      enabled: true, // Enable tooltip on hover
      y: {
        formatter: (val: number) => {
          return `${val.toFixed(0)}`;
        },
      },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  };

  const series = [57, 3, 4, conlai]; // Data for Nam, Nữ, khác

  return (
    <>
      <h3 className="font-semibold">Giới tính</h3>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
        className="mt-14"
      >
        <ReactApexChart
          options={options}
          series={series}
          type="donut"
          width="300"
        />
      </div>
    </>
  );
};

export default Chart1;
