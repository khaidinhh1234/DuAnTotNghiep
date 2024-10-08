import React from "react";
import Chart1 from "./chart1/chart1";
import Chart2 from "./chart2/chart2";
import Chart3 from "./chart3/chart3";
import Chart4 from "./chart4/chart4";
import Chart5 from "./chart5/chart5";
import Chart6 from "./chart6/chart6";
import Chart7 from "./chart7/chart7";

const DoanhThu = () => {
  return (
    <div>
      {" "}
      <div className="flex min-h-screen w-full flex-col">
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <div className="flex items-center">
            <h1 className=" md:text-base">
              Quản trị /{" "}
              <span className="font-semibold px-px=">Thống kê doanh thu</span>{" "}
            </h1>
          </div>
          <div className="flex items-center">
            <h1 className=" font-semibold md:text-3xl">Thống kê doanh thu</h1>
          </div>

          <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-1">
            <Chart6 />
            <Chart5 />
            <Chart7 />
          </div>
        </main>
        {/* <Chart3 /> */}
        {/* <Chart4 /> */}
      </div>
    </div>
  );
};

export default DoanhThu;
