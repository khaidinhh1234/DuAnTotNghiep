"use client";

import instance from "@/configs/admin";
import { useQuery } from "@tanstack/react-query";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { DatePicker } from "antd";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import "moment/locale/vi";
import { useEffect } from "react";
import Chart, { Props } from "react-apexcharts";
// const handleChange = (value: string) => {
//   console.log(`selected ${value}`);
// };

// const { RangePicker } = DatePicker;
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale("vi");

const Chart5 = ({ datestart, dateend, top }: any) => {
  // console.log(datestart, dateend, top);
  const date =
    datestart && dateend && top
      ? { ngay_bat_dau: datestart, ngay_ket_thuc: dateend, top: top }
      : null;
  const { data, refetch } = useQuery({
    queryKey: ["sanphamtable2chart5", datestart, dateend, top],
    queryFn: async () => {
      const response = await instance.post("thong-ke/top-san-pham", date);
      return response.data;
    },
    enabled: !!datestart && !!dateend && !!top,
  });
  useEffect(() => {
    if (datestart && dateend) {
      refetch();
    }
    if (top) {
      refetch();
    }
  }, [datestart, dateend, top, refetch]);
  // console.log(data);
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
    colors: [
      "#FF5733", // Orange Red
      "#33FF57", // Lime Green
      "#3357FF", // Royal Blue
      "#FF33A8", // Hot Pink
      "#FFBD33", // Bright Yellow
      "#33FFF3", // Aqua
      "#9933FF", // Purple
      "#FF3361", // Red-Pink
      "#33FF88", // Mint Green
      "#33D4FF", // Sky Blue
      "#FF9933", // Orange
      "#8D33FF", // Violet
      "#33FFBD", // Sea Green
      "#FF5733", // Coral
      "#33FF99", // Light Green
      "#FF33E3", // Magenta
      "#FF3333", // Red
      "#33FF66", // Green
      "#FF6F33", // Light Coral
      "#3333FF", // Blue
    ],
    xaxis: {
      categories: data?.ngay_trong_khoang_chon || [],
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

  const seriesareachart = data?.series || [];

  return (
    <>
      {" "}
      <Chart
        options={optionsareachart}
        series={seriesareachart}
        type="area"
        height="500px"
      />
    </>
  );
};

export default Chart5;
