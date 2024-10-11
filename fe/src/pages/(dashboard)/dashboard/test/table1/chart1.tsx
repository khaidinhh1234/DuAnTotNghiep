import { ArrowDownOutlined } from "@ant-design/icons";
import { Card } from "antd";

const Chart1 = () => {
  return (
    <div>
      {" "}
      <Card className=" rounded-lg bg-[#F2F4F7] w-72">
        <div className="">
          <div className="flex justify-between">
            <div className="text-black">Tổng tiền:</div>
            <div className="text-black">_</div>
          </div>
          <div className="flex justify-between">
            <div className="text-black">Doanh thu:</div>
            <div className="text-black font-bold text-lg">0 đ</div>
          </div>
          <div className="flex justify-between">
            <div className="text-black text-lg">Đơn chốt:</div>
            <div className="text-black text-lg font-semibold">0</div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Chart1;
