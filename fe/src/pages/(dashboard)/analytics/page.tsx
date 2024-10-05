import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Activity, CreditCard, Users } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectProps } from "antd";
import Chart1 from "./chart1/chart1";
import Chart2 from "./chart2/chart2";
import Chart3 from "./chart3/chart3";
import Chart5 from "./chart5/chart5";
type SelectCommonPlacement = SelectProps["placement"];
export function AnalyticsAdmin() {
  const currentYear = new Date().getFullYear();

  // Tạo danh sách năm (10 năm từ năm hiện tại)
  const generateYearOptions = (currentYear: any, numberOfYears: any) => {
    const yearOptions = [];
    for (let i = 0; i < numberOfYears; i++) {
      yearOptions.push({ value: currentYear - i, label: currentYear - i });
    }
    return yearOptions;
  };

  // Tạo danh sách quý (4 quý)
  const quarterOptions = [
    { value: "Q1", label: "Quý 1" },
    { value: "Q2", label: "Quý 2" },
    { value: "Q3", label: "Quý 3" },
    { value: "Q4", label: "Quý 4" },
  ];

  // Tạo danh sách tháng (12 tháng)
  const monthOptions = Array.from({ length: 12 }, (v, i) => ({
    value: i + 1,
    label: `Tháng ${i + 1}`,
  }));

  // Tạo danh sách tuần (giả sử tuần từ 1 đến 5)
  const weekOptions = Array.from({ length: 5 }, (v, i) => ({
    value: i + 1,
    label: `Tuần ${i + 1}`,
  }));

  // Hàm xử lý khi thay đổi giá trị của Select
  const handleYearChange = (value: any) => {
    console.log(`Selected year: ${value}`);
  };

  const handleQuarterChange = (value: any) => {
    console.log(`Selected quarter: ${value}`);
  };

  const handleMonthChange = (value: any) => {
    console.log(`Selected month: ${value}`);
  };

  const handleWeekChange = (value: any) => {
    console.log(`Selected week: ${value}`);
  };
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
            <CardHeader className="grid grid-cols-12 mt-5">
              <div className="col-span-5">
                <CardTitle>Tổng quan doanh thu</CardTitle>
              </div>
              <div className="col-span-7">
                {/* Select Năm */}
                <Select
                  defaultValue={currentYear}
                  style={{ width: 120, marginRight: 10 }}
                  onChange={handleYearChange}
                  options={generateYearOptions(currentYear, 10)} // Lấy 10 năm từ hiện tại
                />

                {/* Select Quý */}
                <Select
                  defaultValue="Q1"
                  style={{ width: 120, marginRight: 10 }}
                  onChange={handleQuarterChange}
                  options={quarterOptions} // Quý 1 đến quý 4
                />

                {/* Select Tháng */}
                <Select
                  defaultValue={1}
                  style={{ width: 120, marginRight: 10 }}
                  onChange={handleMonthChange}
                  options={monthOptions} // Tháng 1 đến tháng 12
                />

                {/* Select Tuần */}
                <Select
                  defaultValue={1}
                  style={{ width: 120, marginRight: 10 }}
                  onChange={handleWeekChange}
                  options={weekOptions} // Tuần 1 đến tuần 5
                />
              </div>
            </CardHeader>
            <CardContent>
              <Chart5 />
              <Chart2 />
            </CardContent>
          </Card>
          <Card x-chunk="dashboard-01-chunk-5" className="bg-white">
            <CardHeader>
              <CardTitle>Bán hàng gần đây</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-8">
              <div className="flex items-center gap-4">
                <Avatar className="hidden h-9 w-9 sm:flex">
                  <AvatarImage src="/avatars/01.png" alt="Avatar" />
                  <AvatarFallback>OM</AvatarFallback>
                </Avatar>
                <div className="grid gap-1">
                  <p className="text-sm font-medium leading-none">
                    Olivia Martin
                  </p>
                  <p className="text-sm text-muted-foreground">
                    olivia.martin@email.com
                  </p>
                </div>
                <div className="ml-auto font-medium">+199,000 VNĐ</div>
              </div>
              <div className="flex items-center gap-4">
                <Avatar className="hidden h-9 w-9 sm:flex">
                  <AvatarImage src="/avatars/02.png" alt="Avatar" />
                  <AvatarFallback>JL</AvatarFallback>
                </Avatar>
                <div className="grid gap-1">
                  <p className="text-sm font-medium leading-none">
                    Jackson Lee
                  </p>
                  <p className="text-sm text-muted-foreground">
                    jackson.lee@email.com
                  </p>
                </div>
                <div className="ml-auto font-medium">+39.000 VNĐ</div>
              </div>
              <div className="flex items-center gap-4">
                <Avatar className="hidden h-9 w-9 sm:flex">
                  <AvatarImage src="/avatars/03.png" alt="Avatar" />
                  <AvatarFallback>IN</AvatarFallback>
                </Avatar>
                <div className="grid gap-1">
                  <p className="text-sm font-medium leading-none">
                    Isabella Nguyen
                  </p>
                  <p className="text-sm text-muted-foreground">
                    isabella.nguyen@email.com
                  </p>
                </div>
                <div className="ml-auto font-medium">+299.000 VNĐ</div>
              </div>
              <div className="flex items-center gap-4">
                <Avatar className="hidden h-9 w-9 sm:flex">
                  <AvatarImage src="/avatars/04.png" alt="Avatar" />
                  <AvatarFallback>WK</AvatarFallback>
                </Avatar>
                <div className="grid gap-1">
                  <p className="text-sm font-medium leading-none">
                    William Kim
                  </p>
                  <p className="text-sm text-muted-foreground">
                    will@email.com
                  </p>
                </div>
                <div className="ml-auto font-medium">+99.000 VNĐ</div>
              </div>
              <div className="flex items-center gap-4">
                <Avatar className="hidden h-9 w-9 sm:flex">
                  <AvatarImage src="/avatars/05.png" alt="Avatar" />
                  <AvatarFallback>SD</AvatarFallback>
                </Avatar>
                <div className="grid gap-1">
                  <p className="text-sm font-medium leading-none">
                    Sofia Davis
                  </p>
                  <p className="text-sm text-muted-foreground">
                    sofia.davis@email.com
                  </p>
                </div>
                <div className="ml-auto font-medium">+39.000 VNĐ</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      {/* <Chart3 /> */}
      {/* <Chart4 /> */}
    </div>
  );
}
