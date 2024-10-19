import { CreditCard } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import instance from "@/configs/admin";
const Chart3: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["ban-hang"],
    queryFn: async () => {
      const res = await instance.get("thong-ke/so-sanh-don-hang-thang");
      return res.data;
    },
  });
  if (isLoading) return <div>Loading...</div>;
  // console.log(data);
  return (
    <Card x-chunk="dashboard-01-chunk-2" className="bg-white">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">Đơn hàng bán hàng</CardTitle>
        <CreditCard className="h-8 w-8 text-muted-foreground text-blue-800" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-blue-800">
          +{(data?.donHang_hien_tai ?? 0).toLocaleString("vi-VN")}
        </div>
        <p className="text-sm text-muted-foreground text-green-600">
          +{(data?.chenh_lech_phan_tram ?? 0).toLocaleString("vn-VN")}%{" "}
          <span className="text-black"> so với tháng trước</span>
        </p>
      </CardContent>
    </Card>
  );
};

export default Chart3;
