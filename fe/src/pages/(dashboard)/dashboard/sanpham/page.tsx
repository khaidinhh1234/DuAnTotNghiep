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
          <h2 className="text-2xl font-bold ">Thống kê sản phẩm</h2>
          <div>
            <RangePicker
              // onChange={handleDateChange}
              // value={[datestart, dateend]} // Hiển thị giá trị ngày từ state
              defaultValue={[dayjs().subtract(10, "day"), dayjs()]} // Giá trị mặc định từ 10 ngày trước đến hôm nay
            />

            <Select
              defaultValue="1"
              style={{ width: 120 }}
              className="ml-5"
              onChange={handleChange}
              options={[
                { value: "1", label: "Top 5" },
                { value: "2", label: "Top 10" },
                { value: "3", label: "Top 20" },
              ]}
            />
          </div>{" "}
        </div>
        <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-1 px-6">
          <div className="bg-white px-5 py-5">
            <h2 className="text-xl font-bold mb-3 text-center">
              Thông tin kinh doanh hôm nay
            </h2>
            <Chart5 />
          </div>
          <Chart6 />
        </div>
      </div>
    </>
  );
};

export default SanPham;
