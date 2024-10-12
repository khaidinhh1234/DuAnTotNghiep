import instance from "@/configs/admin";
import { ArrowDownOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import type { StatisticProps } from "antd";
import { Card, Statistic } from "antd";
import CountUp from "react-countup";
const Chart1 = () => {
  const { data } = useQuery({
    queryKey: ["chart1"],
    queryFn: async () => {
      const response = await instance.post("thong-ke/don-hang/chot");
      return response.data;
    },
  });

  const formatter: StatisticProps["formatter"] = (value: any) => (
    <CountUp end={value as number} separator="," />
  );
  const phantien = parseFloat("+ 6") > 0 ? "text-green-600" : "text-red-600";
  return (
    <Card className="shadow-md px-1 rounded-lg bg-white flex flex-col">
      <div className="flex items-center mb-2">
        <div className="bg-green-600 py-[7px] px-3 flex items-center rounded-full mr-2">
          <i className="fa-regular fa-box-check text-white text-xl"></i>
        </div>

        <h3 className="text-lg font-bold">Tổng hàng chốt</h3>
      </div>
      <div className="grid grid-cols-2">
        <div>
          <div className="text-black">
            Tổng tiền: <br />
            <span className="text-2xl font-bold text-green-800">
              <Statistic
                value={data?.tong_tien}
                formatter={formatter}
                suffix="đ"
                valueStyle={{ color: "#00AA00" }}
              />
            </span>
          </div>
          <div className={`flex items-center mt-1 ${phantien}`}>
            <ArrowDownOutlined />
            <span className=" ml-1 font-medium">
              {data?.ti_le_tang_giam_tien} %
            </span>
          </div>
        </div>
        <div>
          <div className="text-black">
            Số lượng đơn hàng: <br />
            <span className="text-2xl font-bold text-black">
              {" "}
              <Statistic
                value={data?.tong_so_luong_don_hang}
                formatter={formatter}
              />
            </span>
          </div>
          <div className={`flex items-center mt-1 ${phantien}`}>
            <i className="fa-solid fa-arrow-up "></i>
            <span className=" ml-1  font-medium">
              {data?.ti_le_tang_giam_don_hang} %
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default Chart1;
