import { DeleteOutlined } from "@ant-design/icons";
import { Button } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import ColorTable from "./ColorTable ";
import SizeManagement from "./SizeTable ";

const Bienthe: React.FC = () => {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1>
          Quản trị / Sản phẩm /{" "}
          <span className="font-semibold px-px">Biến thể</span>{" "}
        </h1>
      </div>
      <div className="flex items-center justify-between">
        <h1 className="font-semibold md:text-3xl">Biến thể sản phẩm</h1>
        <div className="flex gap-2">
          <Link to="/admin/products/bienthe/remote">
            <Button className="bg-gradient-to-r  from-red-500 to-orange-400 text-white rounded-lg">
              <DeleteOutlined />
              Màu
            </Button>
          </Link>
          <Link to="/admin/products/bienthe/remotesize">
            <Button className="bg-gradient-to-r  from-red-500 to-orange-400 text-white rounded-lg">
              <DeleteOutlined />
              Kích thước
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex space-x-4">
        <div className="w-1/2">
          <ColorTable />
        </div>
        <div className="w-1/2">
          <SizeManagement />
        </div>
      </div>
    </main>
  );
};

export default Bienthe;
