import { Bar, BarChart, Rectangle, XAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import instance from "@/configs/admin";
import { useQuery } from "@tanstack/react-query";

export default function Chart1() {
  const { data } = useQuery({
    queryKey: ["thongkesdf"],
    queryFn: async () => {
      try {
        const res = await instance.get("thong-ke/doanh-thu-so-sanh");
        return res.data;
      } catch (error) {
        console.error(error);
      }
    },
  });
  // console.log(data);
  return (
    <Card className="w-full bg-white">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">Tổng doanh thu </CardTitle>
        {/* <CardDescription>
          Over the last 7 days, your distance walked and run was 12.5 miles per
          day.
        </CardDescription> */}
      </CardHeader>
      <CardContent className="flex gap-4 p-6 pt-0 justify-between ">
        <div className="flex items-baseline gap-1 text-2xl tabular-nums leading-none">
          <div>
            <div className="font-bold text-green-700">
              {data?.doanh_thu_thang_hien_tai.toLocaleString("vi-VN")} đ
            </div>
            <span className="text-sm text-muted-foreground text-green-600">
              +{data?.chenh_lech_phan_tram}%{" "}
              <span className="text-black">so với tháng trước</span>
            </span>
          </div>{" "}
        </div>
        <i className="fa-solid fa-chart-mixed-up-circle-dollar text-4xl text-green-600"></i>
      </CardContent>
    </Card>
  );
}
