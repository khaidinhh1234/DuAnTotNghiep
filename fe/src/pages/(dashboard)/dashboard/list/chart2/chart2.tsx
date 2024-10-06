import { Users } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import instance from "@/configs/admin";
const Chart2: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["register"],
    queryFn: async () => {
      const res = await instance.get("thong-ke/so-sanh-khach-hang-register");
      return res.data;
    },
  });
  if (isLoading) return <div>Loading...</div>;
  // console.log(data);

  return (
    <Card x-chunk="dashboard-01-chunk-1" className="bg-white">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">Đăng ký</CardTitle>
        <Users className="h-6 w-6 text-muted-foreground " />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          +{" "}
          {(data?.register_hien_tai
            ? data?.register_hien_tai
            : 0
          ).toLocaleString("vi-VN")}
        </div>
        <p className="text-xs text-muted-foreground">
          +{data?.chenh_lech_phan_tram ?? 0} % so với tháng trước
        </p>
      </CardContent>
    </Card>
  );
};

export default Chart2;
