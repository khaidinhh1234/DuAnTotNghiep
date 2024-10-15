import React from "react";
import ReactApexChart from "react-apexcharts";

const Chart1: React.FC = () => {
  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "donut",
      toolbar: {
        show: false,
      },
    },
    labels: ["Nam", "Nữ", "khác"],
    colors: ["#1E90FF", "#32CD32", "#D3D3D3"], // Blue, Green, Grey
    legend: {
      show: true,
      position: "left",
      markers: {
        width: 10,
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
            show: false, // Hide center label
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
          return `${val.toFixed(0)}%`; // Show value with "%" symbol
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

  const series = [57, 3, 40]; // Data for Nam, Nữ, khác

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <h3>Giới tính</h3>
      <ReactApexChart
        options={options}
        series={series}
        type="donut"
        width="300"
      />
      <div style={{ marginTop: "10px" }}>
        <p>
          <span style={{ color: "#1E90FF", marginRight: "5px" }}>●</span> Nam{" "}
          <br />
          <span style={{ color: "#32CD32", marginRight: "5px" }}>
            ●
          </span> Nữ <br />
          <span style={{ color: "#D3D3D3", marginRight: "5px" }}>●</span> Chưa
          có thông tin
        </p>
      </div>
    </div>
  );
};

export default Chart1;
