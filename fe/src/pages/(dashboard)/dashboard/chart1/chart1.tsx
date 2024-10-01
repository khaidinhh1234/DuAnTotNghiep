import { Bar, BarChart, Rectangle, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";

export default function Chart1() {
  return (
    <Card className="w-full bg-white">
      <CardHeader className="p-4 pb-0">
        <CardTitle className="text-xl">Tổng doanh thu </CardTitle>
        {/* <CardDescription>
          Over the last 7 days, your distance walked and run was 12.5 miles per
          day.
        </CardDescription> */}
      </CardHeader>
      <CardContent className="flex gap-4 p-4 pt-0">
        <div className="flex items-baseline gap-1 text-2xl font-bold tabular-nums leading-none">
          <div>
            12.500.000.00 <br />
            <span className="text-sm font-normal text-muted-foreground">
              +20,1% so với tháng trước
            </span>
          </div>{" "}
        </div>
        <ChartContainer
          config={{
            steps: {
              label: "Steps",
              color: "hsl(var(--chart-1))",
            },
          }}
          className="ml-auto w-[72px]"
        >
          <BarChart
            accessibilityLayer
            margin={{
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
            }}
            data={[
              {
                date: "2024-01-01",
                steps: 2000,
              },
              {
                date: "2024-01-02",
                steps: 2100,
              },
              {
                date: "2024-01-03",
                steps: 2200,
              },
              {
                date: "2024-01-04",
                steps: 1300,
              },
              {
                date: "2024-01-05",
                steps: 1400,
              },
              {
                date: "2024-01-06",
                steps: 2500,
              },
              {
                date: "2024-01-07",
                steps: 1600,
              },
            ]}
          >
            <Bar
              dataKey="steps"
              fill="var(--color-steps)"
              radius={2}
              fillOpacity={0.2}
              activeIndex={6}
              activeBar={<Rectangle fillOpacity={0.8} />}
            />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={4}
              hide
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
