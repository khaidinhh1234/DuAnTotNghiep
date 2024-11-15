import instance from "@/configs/admin";
import { useQuery } from "@tanstack/react-query";
import ReactApexChart from "react-apexcharts";
import { useEffect, useState } from "react";

const Test: React.FC = () => {
  const datestart = "2024-11-10T17:00:00.000Z";
  const dateend = "2024-11-16T17:00:00.000Z";
  const date =
    datestart && dateend
      ? { ngay_bat_dau: datestart, ngay_ket_thuc: dateend }
      : null;

  const [series, setSeries] = useState<{ name: string; data: any[] }[]>([]);
  const [options, setOptions] = useState({
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
      type: "datetime",
      categories: [],
    },
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

  const { data: Chart1, refetch } = useQuery({
    queryKey: ["tongquan1chart1", datestart, dateend],
    queryFn: async () => {
      const response = await instance.post("thong-ke/doanh-thu/so-sanh", date);
      return response.data;
    },
    enabled: !!datestart && !!dateend,
  });

  useEffect(() => {
    if (Chart1) {
      const isoDates = Chart1.ngay_trong_khoang.map((date: string) =>
        new Date(date).toISOString()
      );

      setSeries([
        {
          name: "Doanh thu đơn thành công",
          data: Chart1?.doanh_thu_hoan_tat_theo_ngay || [],
        },
        {
          name: "Số tiền hoàn hàng",
          data: Chart1?.doanh_thu_huy_hoan_theo_ngay || [],
        },
      ]);

      setOptions((prevOptions) => ({
        ...prevOptions,
        xaxis: {
          ...prevOptions.xaxis,
          categories: isoDates,
        },
      }));
    }
  }, [Chart1]);

  useEffect(() => {
    if (datestart && dateend) {
      refetch();
    }
  }, [datestart, dateend, refetch]);

  return (
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
  );
};

export default Test;
