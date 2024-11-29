import instance from "@/configs/admin";
import { useQuery } from "@tanstack/react-query";
import { Card } from "antd";
const Chart5 = () => {
  const { data } = useQuery({
    queryKey: ["table2chart6"],
    queryFn: async () => {
      const response = await instance.get("thong-ke/tong-quan-theo-ngay");
      return response.data;
    },
  });
  return (
    <div className="grid grid-cols-3 gap-2">
      {" "}
      <Card className=" rounded-lg bg-[#F2F4F7] ">
        <div className="">
          <div className="">
            <div className="text-black text-base">Số đơn tạo:</div>
            <div className="text-black text-base font-bold">
              {data?.so_don_hang_moi || 0}
            </div>
          </div>
        </div>
      </Card>
      <Card className=" rounded-lg bg-[#F2F4F7] ">
        <div className="">
          <div className="">
            <div className="text-red-600 text-base">Đơn hủy :</div>
            <div className="text-red-600 text-base font-bold">
              {data?.so_don_hang_huy || 0}
            </div>
          </div>
        </div>
      </Card>
      <Card className=" rounded-lg bg-[#F2F4F7] ">
        <div className="">
          <div className="">
            <div className="text-green-800 text-base">Đơn chốt :</div>
            <div className="text-green-800 text-base font-bold">
              {data?.so_don_hang_thanh_cong || 0}
            </div>
          </div>
        </div>
      </Card>
      <Card className=" rounded-lg bg-[#F2F4F7] ">
        <div className="">
          <div className="">
            <div className="text-black text-base">Đơn hoàn :</div>
            <div className="text-black text-base font-bold">
              {data?.so_don_hang_hoan || 0}
            </div>
          </div>
        </div>
      </Card>
      <Card className=" rounded-lg bg-[#F2F4F7] ">
        <div className="">
          <div className="">
            <div className="text-black text-base">Hàng bán ra :</div>
            <div className="text-black text-base font-bold">
              {data?.so_luong_san_pham_ban_ra || 0}
            </div>
          </div>
        </div>
      </Card>
      <Card className=" rounded-lg bg-[#F2F4F7] ">
        <div className="">
          <div className="">
            <div className="text-black text-base">Khách hàng :</div>
            <div className="text-black text-base font-bold">
              {data?.so_luong_khach_hang_mua || 0}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Chart5;
