import { Col, Row, Segmented } from "antd";
import { useState } from "react";
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
import { DatePicker, Space } from "antd";

const { RangePicker } = DatePicker;
const Dashboard = () => {
  const [datestart, setDatestart] = useState();
  const [dateend, setDateend] = useState();
  const [tab, setTab] = useState<string>("Trang chủ 1");
  const handleDateChange = (e: any, dateStrings: [string, string]) => {
    const startDate = dateStrings[0];
    const endDate = dateStrings[1];
    setDatestart(startDate as any);
    setDateend(endDate as any);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex mb-6 gap-10">
        <h2 className="text-2xl font-bold ">Tổng quan</h2>
        <div>
          <RangePicker onChange={handleDateChange} />
        </div>
      </div>
      <Row gutter={16}>
        <Col span={12} sm={8}>
          <Chart1 datestart={datestart} dateend={dateend} />
        </Col>
        <Col span={12} sm={8}>
          <Chart2 datestart={datestart} dateend={dateend} />
        </Col>
        <Col span={12} sm={8}>
          <Chart3 />
        </Col>
      </Row>
      <div className="mt-6 grid grid-cols-8 gap-5">
        <Row className="col-span-5 shadow-md bg-white rounded-md px-6 py-7">
          <div className="grid grid-cols-3 gap-5 mb-5">
            <div>
              <Tablechart1 />
            </div>
            <div>
              {" "}
              <Tablechart2 />
            </div>
            <div>
              {" "}
              <Tablechart3 />
            </div>
          </div>{" "}
          <div className="">
            {" "}
            <Segmented<string>
              options={["Tổng quan", "Trạng thái"]}
              onChange={(value) => {
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
                      <Tablechart4 />
                    </div>
                  );

                case "Trạng thái":
                  return (
                    <div>
                      <Tablechart6 />
                    </div>
                  );
                default:
                  return (
                    <div>
                      <Tablechart4 />
                    </div>
                  );
              }
            })()}
          </div>
        </Row>{" "}
        <div className="col-span-3">
          <div className="shadow-md bg-white rounded-md px-6 py-7">
            <h2 className="text-xl font-bold mb-3">
              Thông tin kinh doanh hôm nay
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
              {" "}
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
