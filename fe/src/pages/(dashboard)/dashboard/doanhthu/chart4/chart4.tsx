import { Activity } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import instance from "@/configs/admin";

const Chart4: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["hoat-donsdfg"],
    queryFn: async () => {
      const res = await instance.get("thong-ke/so-sanh-khach-hang-block");
      return res.data;
    },
  });
  if (isLoading) return <div>Loading...</div>;
  console.log(data);
  return (
    <Card x-chunk="dashboard-01-chunk-3" className="bg-white">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">
          Tài khoản ngừng hoạt động
        </CardTitle>
        <Activity className="h-6 w-6 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          + {(data?.block_hien_tai ?? 0).toLocaleString("vn-VN")}
        </div>
        <p className="text-xs text-muted-foreground">+201 kể từ giờ trước</p>
      </CardContent>
    </Card>
  );
};

export default Chart4;
