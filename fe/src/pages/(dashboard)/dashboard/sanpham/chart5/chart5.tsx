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
import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
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

  console.log(data);
  const [series, setSeries] = useState<{ name: string; data: any[] }[]>([]);
  // console.log(data);
  const [options, setOptions] = useState({});
  const formattedDates = data?.ngay_trong_khoang_chon?.map((date: any) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  });

  useEffect(() => {
    if (data) {
      setSeries(data?.series || []);
      setOptions({
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
          type: "date", // Make sure it's using "datetime" instead of "date"
          categories: formattedDates,
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
        tooltip: {
          x: {
            format: "dd/MM/yyyy",
          },
        },

        yaxis: {
          labels: {
            formatter: (val: number) => `${val.toLocaleString("vi-VN")} đ`,
          },
        },
      });
    }
  }, [data, datestart, dateend]); // Run when Chart1 data changes (i.e., after refetch)

  // Re-fetch data when datestart or dateend changes

  useEffect(() => {
    async () => {
      if (datestart && dateend) {
        await refetch();
      }
      if (top) {
        await refetch();
      }
    };
  }, [datestart, dateend, top, series, options]);
  return (
    <>
      {" "}
      <div>
        <div id="chart">
          <ReactApexChart
            options={options as any}
            series={series}
            type="area"
            height={420}
          />
        </div>
        <div id="html-dist"></div>
      </div>
    </>
  );
};

export default Chart5;
