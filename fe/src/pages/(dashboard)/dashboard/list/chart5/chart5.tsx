import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import instance from "@/configs/admin";
import { useQuery } from "@tanstack/react-query";
const Chart5 = () => {
  const { data } = useQuery({
    queryKey: ["productskey233"],
    queryFn: async () => {
      const res = await instance.get("thong-ke/top5-khach-hang-gan-day");
      return res.data;
    },
  });
  // console.log(data);
  return (
    <>
      <CardHeader>
        <CardTitle>Bán hàng gần đây</CardTitle>
      </CardHeader>
      {data?.map((item: any, index: number) => (
        <CardContent className="grid gap-8  py-4 px-6 rounded-lg " key={index}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14">
                <img
                  src={item?.anh_nguoi_dung}
                  alt="Avatar"
                  className="h-full w-full object-cover rounded-full"
                />
              </div>
              <div className="">
                <p className="text-sm font-bold text-gray-800 leading-none">
                  {item?.ho} {item?.ten}
                </p>
                <p className="text-sm text-gray-600">{item?.email}</p>
              </div>
            </div>
            <div className="font-medium text-gray-800">
              + {item?.tong_tien_da_mua.toLocaleString("vn-VN")} VNĐ
            </div>
          </div>
        </CardContent>
      ))}
    </>
  );
};

export default Chart5;
