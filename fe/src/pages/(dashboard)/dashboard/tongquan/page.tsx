import { Col, message, Row, Segmented } from "antd";
import { useEffect, useState } from "react";
import Chart1 from "./chart1/chart1";
import Chart2 from "./chart2/chart2";
import Chart3 from "./chart3/chart3";
import Tablechart1 from "./table1/chart1";
import Tablechart2 from "./table1/chart2";
import Tablechart3 from "./table1/chart3";
import Tablechart4 from "./table1/chart4";
import Tablechart6 from "./table1/chart6";
import Table2chart1 from "./table2/chart1";
import Table2chart2 from "./table2/chart2";
import Table2chart3 from "./table2/chart3";
import Table2chart4 from "./table2/chart4";
import Table2chart5 from "./table2/chart5";
import Table2chart6 from "./table2/chart6";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import { useQuery } from "@tanstack/react-query";
import instance from "@/configs/admin";
const { RangePicker } = DatePicker;
const Dashboard = () => {
  const today = dayjs().format("DD/MM/YYYY");
  const [datestart, setDatestart] = useState<dayjs.Dayjs | null>(
    dayjs().subtract(10, "day")
  );
  const [dateend, setDateend] = useState<dayjs.Dayjs | null>(dayjs());
  const [tab, setTab] = useState<string>("Trang chủ 1");
  const handleDateChange = (dates: any) => {
    if (dates && dates.length === 2) {
      const [startDate, endDate] = dates;

      // Kiểm tra nếu ngày kết thúc vượt quá hôm nay
      if (endDate.isAfter(dayjs(), "day")) {
        message.error("Ngày kết thúc không được vượt quá hôm nay.");
        return;
      }

      setDatestart(startDate);
      setDateend(endDate);
    } else {
      setDatestart(null);
      setDateend(null);
    }
  };
  const disabledDate = (current: any | null) => {
    return current && current.isAfter(dayjs().endOf("day"));
  };
  const { data, error } = useQuery({
    queryKey: ["TONG_QUAN", datestart, dateend],
    queryFn: async () => {
      const response = await instance.post("thong-ke/tong-quan-theo-khoang1", {
        ngay_bat_dau: datestart?.format("YYYY-MM-DD"),
        ngay_ket_thuc: dateend?.format("YYYY-MM-DD"),
      });
      return response.data;
    },
    enabled: !!datestart && !!dateend,
  });

  // Log dữ liệu để kiểm tra
  useEffect(() => {
    if (error) console.error("Error fetching data:", error);
    console.log("Fetched data:", data);
  }, [data, error]);
  console.log(data);

  const don_hang_chot = data?.don_hang_chot;
  const don_hang_hoan = data?.don_hang_hoan;
  const soluonsp = data?.ton_kho_san_pham;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex mb-6 gap-10">
        <h2 className="text-2xl font-bold ">Tổng quan</h2>
        <div>
          <RangePicker
            onChange={handleDateChange}
            value={[datestart, dateend]} // Hiển thị giá trị ngày từ state
            defaultValue={[dayjs().subtract(10, "day"), dayjs()]}
            disabledDate={disabledDate}
          />
        </div>
      </div>
      <Row gutter={16}>
        <Col span={12} sm={8}>
          <Chart1 don_hang_chot={don_hang_chot} />
        </Col>
        <Col span={12} sm={8}>
          <Chart2 don_hang_hoan={don_hang_hoan} />
        </Col>
        <Col span={12} sm={8}>
          <Chart3 soluonsp={soluonsp} />
        </Col>
      </Row>
      <div className="mt-6 grid grid-cols-8 gap-5">
        <Row className="col-span-5 shadow-md bg-white rounded-md px-6 py-7">
          <div className="grid grid-cols-3 gap-5 mb-5 mx-auto">
            <div>
              <Tablechart1
                datestart={datestart as any}
                dateend={dateend as any}
              />
            </div>
            <div>
              {" "}
              <Tablechart2
                datestart={datestart as any}
                dateend={dateend as any}
              />
            </div>
            <div>
              {" "}
              <Tablechart3
                datestart={datestart as any}
                dateend={dateend as any}
              />
            </div>
          </div>{" "}
          <div className="">
            {" "}
            <Segmented
              options={["Tổng quan", "Trạng thái"]}
              onChange={(value: string) => {
                setTab(value);
              }}
              block
              className="mb-5 w-96 font-semibold text-lg"
            />
            {(() => {
              switch (tab) {
                case "Tổng quan":
                  return (
                    <div>
                      <Tablechart4
                        datestart={datestart as any}
                        dateend={dateend as any}
                        don_hang_chot={don_hang_chot}
                      />
                      {/* <Test /> */}
                    </div>
                  );

                case "Trạng thái":
                  return (
                    <div>
                      <Tablechart6
                        datestart={datestart as any}
                        dateend={dateend as any}
                        don_hang_chot={don_hang_chot}
                      />
                    </div>
                  );
                default:
                  return (
                    <div>
                      <Tablechart4
                        datestart={datestart as any}
                        dateend={dateend as any}
                        don_hang_chot={don_hang_chot}
                      />{" "}
                      {/* <Test /> */}
                    </div>
                  );
              }
            })()}
          </div>
        </Row>{" "}
        <div className="col-span-3">
          <div className="shadow-md bg-white rounded-md px-6 py-7">
            <h2 className="text-xl font-bold mb-3">
              Thông tin kinh doanh hôm nay:
              <span className="text-xl">{today}</span>
            </h2>
            <div className="flex gap-5 mb-3">
              <div>
                <Table2chart1 />
              </div>
              <div>
                <Table2chart2 />
              </div>
            </div>
            <div>
              <Table2chart3 />
            </div>
            <div className="flex gap-5 mb-3">
              <div>
                <Table2chart4 />
              </div>
              <div>
                <Table2chart5 />
              </div>
            </div>
            <div>
              {" "}
              <Table2chart6 />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
