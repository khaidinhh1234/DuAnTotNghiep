import { Users } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
const Chart2: React.FC = () => {
  return (
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
  );
};

export default Chart2;
