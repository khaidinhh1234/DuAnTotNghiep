"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "antd";

export default function Chart3() {
  return (
    <Card className="bg-gradient-to-r from-black/90 to-yellow-500 shadow-inner shadow-black">
      <CardHeader className="pb-2 text-white">
        <CardDescription>Đơn</CardDescription>
        <CardTitle className="text-4xl">1,329,000đ</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-xs text-muted-foreground text-white">
          +25% from last week
        </div>
      </CardContent>
      <CardFooter>
        <Progress
          percent={100}
          percentPosition={{ align: "center", type: "inner" }}
          size={[300, 10]}
          strokeColor="#ffffff"
          showInfo={false}
        />
      </CardFooter>
    </Card>
  );
}
