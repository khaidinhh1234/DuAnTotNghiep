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
  const result = data?.chenh_lech_phan_tram.toFixed(1);
  const checkdata = result > 0 ? true : false;
  return (
    <Card x-chunk="dashboard-01-chunk-1" className="bg-white">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">Đăng ký</CardTitle>
        <Users className="h-10 w-8 text-muted-foreground text-orange-600 text-xl" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-orange-600">
          +{" "}
          {(data?.register_hien_tai
            ? data?.register_hien_tai
            : 0
          ).toLocaleString("vi-VN")}
        </div>
        <p
          className={`text-sm text-muted-foreground ${checkdata ? "text-green-600" : "text-red-500"}`}
        >
          {result ?? 0} % <span className="text-black">so với tháng trước</span>
        </p>
      </CardContent>
    </Card>
  );
};

export default Chart2;
