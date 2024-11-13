import { MenuOutlined } from "@ant-design/icons";
import { Menu } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

const MainHeader = () => {
  const navigate = useNavigate();
  const [menuVisible, setMenuVisible] = useState(false);

  const menuItems = [
    {
      key: 'orders',
      label: 'Đơn hàng',
      onClick: () => navigate('/shipper2')
    },
    {
      key: 'returns',
      label: 'Đơn hoàn',
      onClick: () => navigate('/return-orders')
    }
  ];

  return (
    <div className="flex justify-between items-start ">
      <div className="flex gap-5 items-center">
        <div className="relative mr-4" style={{ zIndex: 1000 }}>
          <MenuOutlined
            className="text-2xl cursor-pointer hover:text-blue-500 transition-colors"
            onClick={() => setMenuVisible(!menuVisible)}
          />
          {menuVisible && (
            <Menu
              className="absolute mt-2 w-48 bg-white rounded-md"
              items={menuItems}
              selectedKeys={[location.pathname === '/' ? 'orders' : 'returns']}
              style={{
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                border: '1px solid #f0f0f0',
              }}
            />
          )}

        </div>
        <Link to='/'>
          <img
            src="https://res.cloudinary.com/dcvu7e7ps/image/upload/v1729398683/Black_and_White_Circle_Business_Logo_1_ieyoum.png"
            alt="Logo"
            className="w-16 h-16"
          />
        </Link>
        <h1 className="font-semibold md:text-2xl">
          Giao Hàng Glow Express
        </h1>
      </div>
    </div>
  );
};

export default MainHeader;
