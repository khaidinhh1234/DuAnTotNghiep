import instance from "@/configs/admin";
import { useQuery } from "@tanstack/react-query";
import { Progress } from "antd";
import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";

const Chart4: React.FC = () => {
  const { data: chart1 } = useQuery({
    queryKey: ["khachhangtable1chart1"],
    queryFn: async () => {
      const response = await instance.get("/thong-ke/khach-hang-do-tuoi");
      return response.data || {};
    },
  });

  const [chartData, setChartData] = useState({
    series: [
      {
        name: "Người",
        data: [],
      },
    ],
    options: {
      chart: {
        type: "bar",
        height: 340,
        stacked: true,
      },
      colors: ["#008FFB", "#FF4560"],
      plotOptions: {
        bar: {
          borderRadius: 3,
          borderRadiusApplication: "end",
          borderRadiusWhenStacked: "all",
          horizontal: true,
          barHeight: "60%",
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        width: 1,
        colors: ["#fff"],
      },
      grid: {
        xaxis: {
          lines: {
            show: false,
          },
        },
      },
      yaxis: {
        stepSize: 1,
      },
      tooltip: {
        shared: false,
        x: {
          formatter: (val: any) => val,
        },
        y: {
          formatter: (val: number) => val + " người",
        },
      },
      xaxis: {
        categories: [
          "dưới 18 tuổi",
          "18-24 tuổi",
          "25-34 tuổi",
          "35-44 tuổi",
          "45-54 tuổi",
          "Trên 55 tuổi",
        ],
        labels: {
          formatter: (val: number) => Math.abs(Math.round(val)).toString(),
        },
        title: {
          text: "",
        },
      },
      title: {
        text: "",
      },
    },
  });

  useEffect(() => {
    if (chart1) {
      setChartData((prevData) => ({
        ...prevData,
        series: [
          {
            name: "Người",
            data: chart1?.so_luong || [],
          },
        ],
      }));
    }
  }, [chart1]);

  const coPercent =
    chart1 &&
    chart1.co_ngay_sinh !== undefined &&
    chart1.không_co_ngay_sinh !== undefined
      ? (chart1.co_ngay_sinh /
          (chart1.co_ngay_sinh + chart1.không_co_ngay_sinh)) *
        100
      : 0;

  return (
    <>
      <h3 className="mx-5 font-semibold">Độ tuổi</h3>

      <div className="">
        <div className="flex justify-center items-center text-lg">
          <span>{chart1?.co_ngay_sinh || 0}</span>
          <Progress
            percent={chart1?.co_ngay_sinh}
            size="small"
            strokeColor={["#38ef7d", "#ff4d4f"]}
            showInfo={false}
            className="px-5 w-72"
          />
          <span>{chart1?.không_co_ngay_sinh || 0}</span>
        </div>
        <div className="flex items-center gap-3 mx-5">
          <p className="w-3 h-3 bg-[#38ef7d] mt-3 rounded-lg"></p>{" "}
          <span>có ngày sinh</span>{" "}
          <p className="w-3 h-3 bg-[#d9d9d9] mt-3 rounded-lg"></p>{" "}
          <span>không có ngày sinh</span>{" "}
        </div>
        <div id="chart">
          <ReactApexChart
            options={chartData.options as any}
            series={chartData.series}
            type="bar"
            height={280}
          />
        </div>
      </div>
    </>
  );
};

export default Chart4;
