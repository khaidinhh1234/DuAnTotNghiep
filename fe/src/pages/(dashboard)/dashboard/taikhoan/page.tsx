// import dayjs from "dayjs";
import Chart1 from "./chart1/chart1";
import Chart2 from "./chart2/chart2";
import Chart3 from "./chart3/chart3";
import Chart4 from "./chart4/chart4";
// import { DatePicker } from "antd";
import Chart5 from "./chart5/chart5";
// const { RangePicker } = DatePicker;
const TaiKhoan = () => {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex mb-6 gap-10">
        <h2 className="text-2xl font-bold ">Thống kê khách hàng</h2>
      </div>
      <div className="grid gap-4 grid-cols-2">
        <div className="grid gap-4 grid-cols-5 bg-white p-5 rounded-md shadow-md">
          <div className="col-span-2">
            <Chart1 />
          </div>
          <div className="col-span-3">
            <Chart4 />
          </div>
        </div>

        <div className="bg-white p-5 rounded-md shadow-md">
          <Chart2 />
        </div>

        <div className="bg-white p-5 rounded-md shadow-md col-span-2">
          <Chart3 />
        </div>
        <div className="bg-white p-5 rounded-md  col-span-2 grid grid-cols-5 gap-5 ">
          <div className="col-span-1  ">
            <h2 className="text-xl font-semibold mt-4 text-center">
              Khách hàng Đặc biệt
            </h2>
            <div className="flex flex-col items-center p-6 bg-white shadow-lg rounded-lg">
              <div className="relative">
                <img
                  src="https://res.cloudinary.com/dcvu7e7ps/image/upload/v1729004618/lj75vpaur77ckutktmgn.webp"
                  alt="Avatar"
                  className="w-40 h-40 rounded-full border-4 border-red-500"
                />
                <div className="absolute top-0 left-0 w-full h-full border-red-500 border-dotted rounded-full" />
              </div>
              <h2 className="text-xl font-semibold mt-4 text-center">
                Ngô Đình Toản
              </h2>
              <div className="flex  items-center gap-2 ">
                <span className="bg-yellow-400 font-bold text-white px-3 py-1 rounded-full mt-2">
                  Cao thủ
                </span>{" "}
                <img
                  src="https://res.cloudinary.com/dcvu7e7ps/image/upload/v1729005120/rvrhbb0ryot0iukg3dau.png"
                  alt="Avatar"
                  className="w-12 h-10 mt-3 rounded-full border-4 border-red-500"
                />
              </div>
              <p className="text-sm text-gray-500 mt-2">Đã chi tiêu </p>
              <p className="text-sm font-bold">1,324,034,000 VNĐ</p>
              <div className="w-full mt-4">
                <div className="flex justify-between text-sm font-semibold">
                  <span>Kinh nghiệm</span>
                  <span>90%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4 mt-2">
                  <div
                    className="bg-red-500 h-4 rounded-full"
                    style={{ width: "90%" }}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-4 shadow-md rounded-md border ">
            <h2 className="text-xl font-semibold mt-4  px-5 ">
              Danh sách khách hàng tiêu biểu
            </h2>
            <Chart5 />
          </div>
        </div>
      </div>

      <br />
    </div>
  );
};

export default TaiKhoan;
