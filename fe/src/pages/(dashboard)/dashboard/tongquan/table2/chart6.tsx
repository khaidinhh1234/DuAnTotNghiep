import { ArrowDownOutlined } from "@ant-design/icons";
import { Card } from "antd";

const Chart5 = () => {
  return (
    <div className="grid grid-cols-3 gap-2">
      {" "}
      <Card className=" rounded-lg bg-[#F2F4F7] ">
        <div className="">
          <div className="">
            <div className="text-black text-base">Đơn tạo mới:</div>
            <div className="text-black text-base font-bold">435</div>
          </div>
        </div>
      </Card>
      <Card className=" rounded-lg bg-[#F2F4F7] ">
        <div className="">
          <div className="">
            <div className="text-red-600 text-base">Đơn hủy :</div>
            <div className="text-red-600 text-base font-bold">2345</div>
          </div>
        </div>
      </Card>
      <Card className=" rounded-lg bg-[#F2F4F7] ">
        <div className="">
          <div className="">
            <div className="text-green-800 text-base">Đơn chốt :</div>
            <div className="text-green-800 text-base font-bold">6234</div>
          </div>
        </div>
      </Card>
      <Card className=" rounded-lg bg-[#F2F4F7] ">
        <div className="">
          <div className="">
            <div className="text-black text-base">Đơn hoàn :</div>
            <div className="text-black text-base font-bold">1234</div>
          </div>
        </div>
      </Card>
      <Card className=" rounded-lg bg-[#F2F4F7] ">
        <div className="">
          <div className="">
            <div className="text-black text-base">Hàng bán ra :</div>
            <div className="text-black text-base font-bold">223</div>
          </div>
        </div>
      </Card>
      <Card className=" rounded-lg bg-[#F2F4F7] ">
        <div className="">
          <div className="">
            <div className="text-black text-base">Khách hàng :</div>
            <div className="text-black text-base font-bold">4235</div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Chart5;
