import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Activity, CreditCard, Users } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Chart1 from "./chart1/chart1";
import Chart6 from "./chart6/chart6";
import Chart5 from "./chart5/chart5";
// type SelectCommonPlacement = SelectProps["placement"];
export function Dashboard() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center">
          <h1 className=" md:text-base">
            Quản trị / <span className="font-semibold px-px=">Thống kê </span>{" "}
          </h1>
        </div>
        <div className="flex items-center">
          <h1 className=" font-semibold md:text-3xl">Thống kê </h1>
        </div>
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
          {/* <Card x-chunk="dashboard-01-chunk-0 " className="bg-white"> */}
          <Chart1 />
          {/* </Card> */}
          <Card x-chunk="dashboard-01-chunk-1" className="bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-bold">Đăng ký</CardTitle>
              <Users className="h-6 w-6 text-muted-foreground " />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+2350</div>
              <p className="text-xs text-muted-foreground">
                +180.1% so với tháng trước
              </p>
            </CardContent>
          </Card>
          <Card x-chunk="dashboard-01-chunk-2" className="bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-bold">Bán hàng</CardTitle>
              <CreditCard className="h-6 w-6 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+12,234</div>
              <p className="text-xs text-muted-foreground">
                +19% so với tháng trước
              </p>
            </CardContent>
          </Card>
          <Card x-chunk="dashboard-01-chunk-3" className="bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-bold">
                Hoạt động hiện tại
              </CardTitle>
              <Activity className="h-6 w-6 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+573</div>
              <p className="text-xs text-muted-foreground">
                +201 kể từ giờ trước
              </p>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
          <Card
            className="xl:col-span-2 bg-white"
            x-chunk="dashboard-01-chunk-4"
          >
            {" "}
            <Chart6 />{" "}
          </Card>
          <Card x-chunk="dashboard-01-chunk-5" className="bg-white">
            <Chart5 />
          </Card>
        </div>
      </main>
      {/* <Chart3 /> */}
      {/* <Chart4 /> */}
    </div>
  );
}
