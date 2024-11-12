import instance from "@/configs/admin";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import ReactApexChart from "react-apexcharts";

const Chart3: React.FC = () => {
  const { data: chart3, refetch } = useQuery({
    queryKey: ["tongquattable2chart3"],
    queryFn: async () => {
      const response = await instance.get("thong-ke/khach-hang-all");
      return response.data;
    },
  });

  useEffect(() => {
    async () => {
      await refetch();
    };
  }, [chart3]);
  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "line",
      height: 350,
    },
    title: {
      text: "Phân tích khách hàng trong 30 ngày qua",
      align: "center",
      style: {
        fontSize: "20px",
      },
    },

    xaxis: {
      categories: chart3?.moc_time, // Days of the month
    },
    yaxis: {
      title: {
        text: "Số lượng khách hàng",
      },
    },
    dataLabels: {
      enabled: true,
    },
    colors: ["#00E396", "#008FFB", "#FF4560"],
    tooltip: {
      shared: true,
      intersect: false,
    },
    legend: {
      position: "top",
      horizontalAlign: "left",
    },
  };

  const series = [
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
  ];

  return (
    <div id="chart" style={{ maxWidth: "1400px", margin: "0 auto" }}>
      <ReactApexChart
        options={options}
        series={series}
        type="line"
        height={450}
      />
    </div>
  );
};

export default Chart3;
