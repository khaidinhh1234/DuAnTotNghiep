import { ArrowDownOutlined } from "@ant-design/icons";
import { Card } from "antd";

const Chart3 = () => {
  return (
    <Card className="shadow-md px-1 rounded-lg bg-white flex flex-col">
      <div className="flex items-center mb-2">
        <div className="bg-blue-600 py-[7px] px-3 flex items-center rounded-full mr-2">
          <i className="fa-regular fa-box-check text-white text-xl"></i>
        </div>

        <h3 className="text-lg font-bold">Có thể bán</h3>
      </div>
      <div className="grid grid-cols-2">
        <div>
          <div className="text-black">
            Giá nhập: <br />
            <span className="text-2xl font-bold text-blue-800"> 8.232</span>
          </div>
          <div className="flex items-center mt-1">
            <ArrowDownOutlined className="text-red-500" />
            <span className="text-red-500 ml-1 font-medium">- 89,09 %</span>
          </div>
        </div>
        <div>
          <div className="text-black">
            Giá bán: <br />
            <span className="text-2xl font-bold text-black"> 32</span>
          </div>
          <div className="flex items-center mt-1">
            <i className="fa-solid fa-arrow-up text-green-500"></i>
            <span className="text-green-500 ml-1  font-medium">- 89,09 %</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default Chart3;
