import instance from "@/configs/admin";
import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import type { StatisticProps } from "antd";
import { Statistic } from "antd";
import { useEffect } from "react";
import Chart from "react-apexcharts";
import CountUp from "react-countup";
// const { Text } = Typography;
interface ChartProps {
  datestart?: string;
  dateend?: string;
}

const Chart4 = ({ datestart, dateend }: ChartProps) => {
  const date =
    datestart && dateend
      ? { ngay_bat_dau: datestart, ngay_ket_thuc: dateend }
      : null;
  // console.log(date);
  const { data: doanhso, refetch } = useQuery({
    queryKey: ["tongquandoanhso", datestart, dateend],
    queryFn: async () => {
      const response = await instance.post("thong-ke/doanh-so-san-pham", date);
      return response.data;
    },
    enabled: !!datestart && !!dateend,
  });
  console.log(doanhso);
  const {
    data: loinhuan,

    refetch: refetch2,
  } = useQuery({
    queryKey: ["tongquanchart5", datestart, dateend],
    queryFn: async () => {
      const response = await instance.post("thong-ke/doanh-thu/tong", date);
      return response.data;
    },
    enabled: !!datestart && !!dateend,
  });
  const {
    data: gttb,

    refetch: refetch3,
  } = useQuery({
    queryKey: ["tongquanchart6", datestart, dateend],
    queryFn: async () => {
      const response = await instance.post("thong-ke/doanh-thu/tb", date);
      return response.data;
    },
    enabled: !!datestart && !!dateend,
  });
  const {
    data: don,

    refetch: refetch4,
  } = useQuery({
    queryKey: ["tongquanchart1", datestart, dateend],
    queryFn: async () => {
      const response = await instance.post("thong-ke/don-hang/chot", date);
      return response.data;
    },
    enabled: !!datestart && !!dateend,
  });
  const {
    data: Chart1,

    refetch: chart1,
  } = useQuery({
    queryKey: ["table1chart1", datestart, dateend],
    queryFn: async () => {
      const response = await instance.post("thong-ke/doanh-thu/so-sanh", date);
      return response.data;
    },
    enabled: !!datestart && !!dateend,
  });
  // console.log(Chart1);
  // console.log(doanhso);
  const doanh_so = doanhso?.ti_le_tang_giam_don_hang > 0;
  // console.log(doanh_so);
  const san_pham = doanhso?.ti_le_tang_giam_san_pham > 0;
  const loi_nhuan = loinhuan?.ti_le_tang_giam_doanh_thu > 0;
  const gt_tb = gttb?.ti_le_tang_giam_doanh_thu_tb > 0;
  const don_hang = don?.ti_le_tang_giam_don_hang > 0;

  const formatter: StatisticProps["formatter"] = (value: any) => (
    <CountUp end={value as number} separator="," />
  );

  // if (isLoading) {
  //   return <div>Loading...</div>;
  // }

  // if (isError) {
  //   return <div>Error: {error.message}</div>;
  // }
  useEffect(() => {
    if (datestart && dateend) {
      refetch();
    }
  }, [datestart, dateend, refetch]);
  useEffect(() => {
    if (datestart && dateend) {
      refetch2();
    }
  }, [datestart, dateend, refetch2]);
  useEffect(() => {
    if (datestart && dateend) {
      refetch3();
    }
  }, [datestart, dateend, refetch3]);
  useEffect(() => {
    if (datestart && dateend) {
      refetch4();
    }
  }, [datestart, dateend, refetch4]);
  useEffect(() => {
    if (datestart && dateend) {
      chart1();
    }
  }, [datestart, dateend, chart1]);
  // const date2 = Chart1?.ngay_trong_khoang.map((item: any) => item);
  // console.log(date2);
  const chartData = {
    series: [
      {
        name: "Doanh thu đơn thành công",
        data: Chart1?.doanh_thu_hoan_tat_theo_ngay, // Example data
      },
      {
        name: "Số tiền hoàn hàng",
        data: Chart1?.doanh_thu_huy_hoan_theo_ngay, // Example data
      },
    ],
    options: {
      chart: {
        type: "line",
        height: 350,
      },
      stroke: {
        curve: "smooth",
        dashArray: [0, 5],
      },
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        categories: Chart1?.ngay_trong_khoang, // Days of the month
      },
      yaxis: {
        labels: {
          formatter: (val: number) => {
            return `${val.toLocaleString("vi-VN")} đ`;
          },
        },
      },
    },
  };

  return (
    <div className="bg-white p-4 rounded-md shadow">
      <div className="grid grid-cols-5 gap-4 mb-2 ml-auto">
        <div className="col-span-1 text-end border-r px-5">
          <h3 className="text-lg font-bold">Doanh số</h3>
          <p className="text-base font-semibold text-red-600">
            {" "}
            <Statistic
              value={doanhso?.tong_doanh_so_hien_tai || 0}
              formatter={formatter}
              suffix="đ"
              valueStyle={{ fontSize: "16px" }} // Giảm font size ở đây
            />
          </p>
          <div
            className={` mt-1 ${doanh_so ? "text-green-600" : "text-red-600"} flex justify-end gap-1`}
          >
            {doanh_so ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
            <Statistic
              value={doanhso?.ti_le_tang_giam_don_hang || 0}
              formatter={formatter}
              suffix="%"
              valueStyle={{
                fontSize: "14px",
                color: doanh_so ? "green" : "red",
              }} // Giảm font size ở đây
            />
          </div>
        </div>
        <div className="col-span-1 text-end border-r px-5">
          <h3 className="text-lg font-bold">Lợi nhuận </h3>
          <p className="text-base font-semibold text-green-600">
            {" "}
            <Statistic
              value={loinhuan?.tong_doanh_thu || 0}
              formatter={formatter}
              suffix="đ"
              valueStyle={{ fontSize: "16px" }} // Giảm font size ở đây
            />
          </p>
          <div
            className={` mt-1 ${loi_nhuan ? "text-green-600" : "text-red-600"} flex justify-end gap-1`}
          >
            {loi_nhuan ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
            <Statistic
              value={loinhuan?.ti_le_tang_giam_doanh_thu || 0}
              formatter={formatter}
              suffix="%"
              valueStyle={{
                fontSize: "14px",
                color: loi_nhuan ? "green" : "red",
              }} // Giảm font size ở đây
            />
          </div>
        </div>
        <div className="col-span-1 text-end border-r px-5">
          <h3 className="text-lg font-bold">GTTB</h3>
          <p className="text-base font-semibold text-green-600">
            {" "}
            <Statistic
              value={gttb?.doanh_thu_tb_hien_tai || 0}
              formatter={formatter}
              suffix="đ"
              valueStyle={{ fontSize: "16px" }} // Giảm font size ở đây
            />
          </p>
          <div
            className={` mt-1 ${gt_tb ? "text-green-600" : "text-red-600"} flex justify-end gap-1`}
          >
            {gt_tb ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
            <Statistic
              value={gttb?.ti_le_tang_giam_doanh_thu_tb || 0}
              formatter={formatter}
              suffix="%"
              valueStyle={{
                fontSize: "14px",
                color: gt_tb ? "green" : "red",
              }} // Giảm font size ở đây
            />
          </div>
        </div>
        <div className="col-span-1 text-end border-r px-5">
          <h3 className="text-lg font-bold">Đơn chốt</h3>
          <p className="text-base font-semibold text-red-600">
            {" "}
            <Statistic
              value={don?.tong_so_luong_don_hang || 0}
              formatter={formatter}
              valueStyle={{ fontSize: "16px" }} // Giảm font size ở đây
            />
          </p>
          <div
            className={` mt-1 ${don_hang ? "text-green-600" : "text-red-600"} flex justify-end  gap-1`}
          >
            {don_hang ? <ArrowUpOutlined /> : <ArrowDownOutlined />}

            <Statistic
              value={don?.ti_le_tang_giam_don_hang || 0}
              formatter={formatter}
              suffix="%"
              valueStyle={{
                fontSize: "14px",
                color: don_hang ? "green" : "red",
              }} // Giảm font size ở đây
            />
          </div>
        </div>
        <div className="col-span-1 text-end border-r px-5">
          <h3 className="text-lg font-bold">Số lượng sản phẩm</h3>
          <p className="text-base font-semibold text-green-600">
            {" "}
            <Statistic
              value={doanhso?.tong_so_luong_san_pham_hien_tai || 0}
              formatter={formatter}
              valueStyle={{ fontSize: "16px" }} // Giảm font size ở đây
            />
          </p>
          <div
            className={` mt-1 ${san_pham ? "text-green-600" : "text-red-600"} flex justify-end  gap-1`}
          >
            {san_pham ? <ArrowUpOutlined /> : <ArrowDownOutlined />}

            <Statistic
              value={doanhso?.ti_le_tang_giam_san_pham || 0}
              formatter={formatter}
              suffix="%"
              valueStyle={{
                fontSize: "14px",
                color: san_pham ? "green" : "red",
              }} // Giảm font size ở đây
            />
          </div>
        </div>
      </div>

      <Chart
        options={chartData.options as any}
        series={chartData.series}
        type="line"
        height={420}
      />
    </div>
  );
};

export default Chart4;
