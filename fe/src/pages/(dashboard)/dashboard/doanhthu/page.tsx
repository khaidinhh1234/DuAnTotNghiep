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
    <>
      <div className="flex items-center">
        <h2 className="text-2xl font-bold mb-6">Tổng quan</h2>
      </div>

      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-1 px-6">
        {/* <Chart6 /> */}
        <Chart5 />
        <Chart7 />
      </div>
    </>
  );
};

export default DoanhThu;
