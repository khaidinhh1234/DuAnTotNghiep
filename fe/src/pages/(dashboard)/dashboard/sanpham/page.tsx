import Chart5 from "./chart5/chart5";
import Chart6 from "./chart6/chart6";
("use client");

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { ConfigProvider, DatePicker, Select } from "antd";
// import viVN from "antd/lib/locale/vi_VN";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import "moment/locale/vi";
const handleChange = (value: string) => {
  console.log(`selected ${value}`);
};

const { RangePicker } = DatePicker;
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale("vi");

// const { RangePicker } = DatePicker;
const SanPham = () => {
  return (
    <>
      <div className="p-6 bg-gray-100 min-h-screen">
        <div className="flex mb-6 gap-10">
          <h2 className="text-2xl font-bold ">Tổng quan</h2>
          <div>
            <RangePicker
              // onChange={handleDateChange}
              // value={[datestart, dateend]} // Hiển thị giá trị ngày từ state
              defaultValue={[dayjs().subtract(10, "day"), dayjs()]} // Giá trị mặc định từ 10 ngày trước đến hôm nay
            />

            <Select
              defaultValue="lucy"
              style={{ width: 120 }}
              className="ml-5"
              onChange={handleChange}
              options={[
                { value: "jack", label: "Top 5" },
                { value: "lucy", label: "Top 10" },
                { value: "Yiminghe", label: "Top 20" },
                { value: "disabled", label: "Disabled", disabled: true },
              ]}
            />
          </div>{" "}
        </div>
        <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-1 px-6">
          <Chart5 />
          <Chart6 />
        </div>
      </div>
    </>
  );
};

export default SanPham;
