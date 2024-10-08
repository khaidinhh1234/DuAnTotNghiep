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

export default function Chart4() {
  return (
    <Card className="bg-gradient-to-r from-black/90 to-red-500 shadow-inner shadow-black">
      <CardHeader className="pb-2 text-white">
        <CardDescription>This Week</CardDescription>
        <CardTitle className="text-4xl">$1,329</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-xs text-muted-foreground text-white">
          +25% from last week
        </div>
      </CardContent>
      <CardFooter>
        <Progress
          percent={50}
          percentPosition={{ align: "center", type: "inner" }}
          size={[300, 10]}
          strokeColor="#ffffff"
          showInfo={false}
        />
      </CardFooter>
    </Card>
  );
}
