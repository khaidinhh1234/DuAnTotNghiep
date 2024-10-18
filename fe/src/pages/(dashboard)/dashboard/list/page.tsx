import { Card } from "@/components/ui/card";
import Chart1 from "./chart1/chart1";
import Chart2 from "./chart2/chart2";
import Chart3 from "./chart3/chart3";
import Chart4 from "./chart4/chart4";
import Chart5 from "./chart5/chart5";
import Chart6 from "./chart6/chart6";
// type SelectCommonPlacement = SelectProps["placement"];
export function List() {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex mb-6 gap-10">
        <h2 className="text-2xl font-bold ">Thống kê doanh thu</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        {/* <Card x-chunk="dashboard-01-chunk-0 " className="bg-white"> */}
        <Chart1 />
        {/* </Card> */}
        <Chart2 />
        <Chart3 />
        <Chart4 />
      </div>
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <Card className="xl:col-span-2 bg-white" x-chunk="dashboard-01-chunk-4">
          {" "}
          <Chart6 />{" "}
        </Card>
        <Card x-chunk="dashboard-01-chunk-5" className="bg-white">
          <Chart5 />
        </Card>
      </div>
    </div>
  );
}
