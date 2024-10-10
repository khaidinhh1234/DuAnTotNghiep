"use client";

import { Area, AreaChart, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
const Chart4 = () => {
  return (
    <Card className="max-w-[310px] bg-gradient-to-r from-[#2193b0] to-[#6dd5ed] ">
      <CardHeader className="space-y-0 pb-0">
        <CardDescription className="text-white">Doanh thu</CardDescription>
        <CardTitle className="flex items-baseline gap-1 text-4xl tabular-nums">
          <h2 className="text-2xl font-bold text-white">44.000.000 đ</h2>
          <p className="text-[15px] text-white">( - 23.6% ↓ )</p>{" "}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ChartContainer
          config={{
            time: {
              label: "Time",
              color: "hsl(var(--chart-2))", // Bạn có thể thay đổi màu này
            },
          }}
        >
          <AreaChart
            accessibilityLayer
            data={[
              {
                date: "2024-01-01",
                time: 8.5,
              },
              {
                date: "2024-01-02",
                time: 7.2,
              },
              {
                date: "2024-01-03",
                time: 8.1,
              },
              {
                date: "2024-01-04",
                time: 6.2,
              },
              {
                date: "2024-01-05",
                time: 5.2,
              },
              {
                date: "2024-01-06",
                time: 8.1,
              },
              {
                date: "2024-01-07",
                time: 7.0,
              },
            ]}
            margin={{
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
            }}
          >
            <XAxis dataKey="date" hide />
            <YAxis domain={["dataMin - 5", "dataMax + 2"]} hide />
            <defs>
              <linearGradient id="fillTime" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="" // Màu cho gradient đầu
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="" // Màu cho gradient cuối
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <Area
              dataKey="time"
              type="natural"
              fill="url(#fillTime)"
              fillOpacity={0.4}
              stroke="#fdbb2d" // Màu của đường viền
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
              formatter={(value) => (
                <div className="flex min-w-[120px] items-center text-xs text-muted-foreground text-white">
                  doanh thu
                  <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground">
                    {value}
                    <span className="font-normal text-muted-foreground">đ</span>
                  </div>
                </div>
              )}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default Chart4;
