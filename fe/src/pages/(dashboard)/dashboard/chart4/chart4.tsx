import { Activity } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Chart4: React.FC = () => {
  return (
    <Card x-chunk="dashboard-01-chunk-3" className="bg-white">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">Hoạt động hiện tại</CardTitle>
        <Activity className="h-6 w-6 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">+573</div>
        <p className="text-xs text-muted-foreground">+201 kể từ giờ trước</p>
      </CardContent>
    </Card>
  );
};

export default Chart4;
