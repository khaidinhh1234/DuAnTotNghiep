import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import instance from "@/configs/admin";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Select } from "antd";
import { useState } from "react";
import Chart from "react-apexcharts";

const Chart6 = () => {
  const generateYearOptions = (currentYear: number, numberOfYears: number) => {
    return Array.from({ length: numberOfYears }, (_, i) => ({
      value: currentYear - i,
      label: currentYear - i,
    }));
  };

  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );
  const [selectedQuarter, setSelectedQuarter] = useState<any>(null);
  const [selectedMonth, setSelectedMonth] = useState<any>(null);
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: [
      "thongke",
      selectedYear,
      selectedQuarter,
      selectedMonth,
      selectedWeek,
    ],
    queryFn: async () => {
      const res = await instance.post("thong-ke/doanh-thu-tuan-tu", {
        nam: selectedYear,
        quy: selectedQuarter,
        thang: selectedMonth,
        tuan: selectedWeek,
      });
      return res.data;
    },
  });
  console.log(data);
  const { mutate } = useMutation({
    mutationFn: async ({
      nam,
      quy,
      thang,
      tuan,
    }: {
      nam: number;
      quy: string;
      thang: any;
      tuan: number | null;
    }) => {
      const res = await instance.post("thong-ke/doanh-thu-tuan-tu", {
        nam,
        quy,
        thang,
        tuan,
      });
      return res.data;
    },
    onSuccess: (data) => {
      console.log("Updated data:", data);
    },
  });

  const tuyChonBieuDo = {
    chart: {
      type: "bar" as "bar",
    },

    xaxis: {
      categories:
        data?.theo_nam?.quy || data?.theo_quy?.thang || data?.theo_thang?.tuan,
      // data?.theo_tuan?.ngay |
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "50%",
        borderRadius: 5,
        borderRadiusApplication: "end" as "end",
      },
    },
    dataLabels: {
      enabled: false,
    },
    colors: ["#000000"],
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
      data: data?.theo_nam?.doanh_thu?.length
        ? data.theo_nam.doanh_thu
        : data?.theo_quy?.doanh_thu?.length
          ? data.theo_quy.doanh_thu
          : data?.theo_thang?.doanh_thu?.length
            ? data.theo_thang.doanh_thu
            : data?.theo_tuan?.doanh_thu?.length
              ? data.theo_tuan.doanh_thu
              : [0, 0, 0], // Mảng mặc định nếu không có dữ liệu
    },
  ];

  const currentYear = new Date().getFullYear();

  const quarterOptions = [
    { value: null, label: "Tất cả" },
    { value: "1", label: "Quý 1" },
    { value: "2", label: "Quý 2" },
    { value: "3", label: "Quý 3" },
    { value: "4", label: "Quý 4" },
  ];

  const getMonthOptions = (quarter: string) => {
    switch (quarter) {
      case "1":
        return [
          { value: null, label: "Tất cả" },
          { value: 1, label: "Tháng 1" },
          { value: 2, label: "Tháng 2" },
          { value: 3, label: "Tháng 3" },
        ];
      case "2":
        return [
          { value: null, label: "Tất cả" },
          { value: 4, label: "Tháng 4" },
          { value: 5, label: "Tháng 5" },
          { value: 6, label: "Tháng 6" },
        ];
      case "3":
        return [
          { value: null, label: "Tất cả" },
          { value: 7, label: "Tháng 7" },
          { value: 8, label: "Tháng 8" },
          { value: 9, label: "Tháng 9" },
        ];
      case "4":
        return [
          { value: null, label: "Tất cả" },
          { value: 10, label: "Tháng 10" },
          { value: 11, label: "Tháng 11" },
          { value: 12, label: "Tháng 12" },
        ];
      default:
        return [{ value: null, label: "Tất cả" }];
    }
  };

  // Get week options, including "Tất cả" only when a month is selected
  const getWeekOptions = (month: number) => {
    if (month === null) {
      // Return only "Tất cả" if no month is selected
      return [{ value: null, label: "Tất cả" }];
    }

    const daysInMonth = new Date(selectedYear, month, 0).getDate();
    const numberOfWeeks = Math.ceil(daysInMonth / 7);
    const weekOptions = Array.from({ length: numberOfWeeks }, (_, i) => ({
      value: i + 1,
      label: `Tuần ${i + 1}`,
    }));

    // Add "Tất cả" option only if a month is selected
    weekOptions.unshift({ value: null, label: "Tất cả" });

    return weekOptions;
  };

  const handleYearChange = (value: number) => {
    setSelectedYear(value);
    mutate({
      nam: value,
      quy: selectedQuarter,
      thang: selectedMonth,
      tuan: selectedWeek,
    });
  };

  const handleQuarterChange = (value: string) => {
    setSelectedQuarter(value);
    setSelectedMonth(getMonthOptions(value)[0].value);
    setSelectedWeek(null); // Reset week when quarter changes
    mutate({
      nam: selectedYear,
      quy: value,
      thang: getMonthOptions(value)[0].value,
      tuan: null,
    }); // Fetch all weeks for the new quarter
  };

  const handleMonthChange = (value: number) => {
    setSelectedMonth(value);
    setSelectedWeek(null); // Reset week to "Tất cả" when month changes
    mutate({
      nam: selectedYear,
      quy: selectedQuarter,
      thang: value,
      tuan: null,
    }); // Fetch all weeks for the new month
  };

  const handleWeekChange = (value: number | null) => {
    setSelectedWeek(value);
    mutate({
      nam: selectedYear,
      quy: selectedQuarter,
      thang: selectedMonth,
      tuan: value,
    });
  };

  return (
    <div>
      <CardHeader className="grid grid-cols-12 mt-5">
        <div className="col-span-5">
          <CardTitle>Tổng quan doanh thu</CardTitle>
          <h3 className="text-lg font-bold">
            Doanh thu:{" "}
            {(data?.tong_doanh_thu_nam
              ? data?.tong_doanh_thu_nam
              : data?.tong_doanh_thu_quy
                ? data?.tong_doanh_thu_quy
                : data?.tong_doanh_thu_thang
                  ? data?.tong_doanh_thu_thang
                  : data?.tong_doanh_thu_tuan
                    ? data?.tong_doanh_thu_tuan
                    : 0
            ).toLocaleString("vi-VN")}
            VNĐ /
            {data?.theo_nam?.quy.length
              ? "Năm"
              : data?.theo_quy?.thang.length
                ? "Quý"
                : data?.theo_thang?.tuan
                  ? "Tháng"
                  : data?.theo_tuan?.nay
                    ? "Tuần"
                    : ""}
          </h3>
        </div>
        <div className="col-span-7">
          <Select
            defaultValue={currentYear}
            style={{ width: 120, marginRight: 10 }}
            onChange={handleYearChange}
            options={generateYearOptions(currentYear, 10)}
          />
          <Select
            value={selectedQuarter}
            style={{ width: 120, marginRight: 10 }}
            onChange={handleQuarterChange}
            options={quarterOptions}
          />
          <Select
            value={selectedMonth}
            style={{ width: 120, marginRight: 10 }}
            onChange={handleMonthChange}
            options={getMonthOptions(selectedQuarter)}
          />
          <Select
            value={selectedWeek}
            style={{ width: 120, marginRight: 10 }}
            onChange={handleWeekChange}
            options={getWeekOptions(selectedMonth)} // Update to use dynamic week options
          />
        </div>
      </CardHeader>
      <CardContent>
        <Card className="p-5">
          <Chart
            options={tuyChonBieuDo}
            series={chuoiDuLieu}
            type="bar"
            height={450}
          />
        </Card>
      </CardContent>
    </div>
  );
};

export default Chart6;
