
import React, { useState } from "react";
import { Button, Input } from "antd";
import { Link } from "react-router-dom";
import SizeManagement from "./SizeTable ";
import ColorTable from "./ColorTable ";
import { DeleteOutlined } from "@ant-design/icons";

const Bienthe: React.FC = () => {
  const [searchText, setSearchText] = useState<string>("");

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1>Quản trị / Sản phẩm</h1>
      </div>
      <div className="flex items-center justify-between">
        <h1 className="font-semibold md:text-3xl">Sản phẩm</h1>
        <div className="flex gap-2">
          <Link to="/admin/products/bienthe/remote">
            <Button className="bg-red-500 text-white rounded-lg"><DeleteOutlined />màu</Button>
          </Link>
          <Link to="/admin/products/bienthe/remotesize">
            <Button className="bg-red-500 text-white rounded-lg"><DeleteOutlined />kích thước</Button>
          </Link>
        </div>
      </div>
      <div className="max-w-xs my-2">
        <Input 
          placeholder="Tìm kiếm..." 
          size="large" 
          value={searchText} 
          onChange={(e) => setSearchText(e.target.value)} 
        />
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
