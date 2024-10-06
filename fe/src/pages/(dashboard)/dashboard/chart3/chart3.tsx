import { CreditCard } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
const Chart3: React.FC = () => {
  return (
    <Card x-chunk="dashboard-01-chunk-2" className="bg-white">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">Bán hàng</CardTitle>
        <CreditCard className="h-6 w-6 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">+12,234</div>
        <p className="text-xs text-muted-foreground">+19% so với tháng trước</p>
      </CardContent>
    </Card>
  );
};

export default Chart3;
