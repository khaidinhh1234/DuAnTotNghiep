import { MenuOutlined } from "@ant-design/icons";
import { Menu } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

const MainHeader = () => {
  const navigate = useNavigate();
  const [menuVisible, setMenuVisible] = useState(false);
  const nav = useNavigate();
  const menuItems = [
    {
      key: "orders",
      label: "Đơn hàng",
      onClick: () => navigate("/shipper2"),
    },
    {
      key: "returns",
      label: "Đơn hoàn",
      onClick: () => navigate("/return-orders"),
    },
  ];
  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user"); //
    nav("/login");
    // setUser(null);
  };
  return (
    <div className="flex justify-between items-center p-4 bg-white">
      {/* Logo và Menu */}
      <div className="flex items-center gap-5">
        <div className="relative bg-white z-10">
          <MenuOutlined
            className="text-2xl cursor-pointer hover:text-blue-500 transition-colors sm:hidden bg-white "
            onClick={() => setMenuVisible(!menuVisible)}
          />
          {menuVisible && (
            <Menu
              className="absolute top-10 left-0 w-48 bg-white rounded-md shadow-md sm:w-60 md:w-72"
              items={menuItems}
            />
          )}
        </div>
        <Link to="/shipper2">
          <img
            src="https://res.cloudinary.com/dcvu7e7ps/image/upload/v1729398683/Black_and_White_Circle_Business_Logo_1_ieyoum.png"
            alt="Logo"
            className="w-full lg:w-24 lg:h-24 h-14"
          />
        </Link>
        <h1 className="font-semibold text-md md:text-2xl">
          Giao Hàng Glow Express
        </h1>
      </div>
      <div className="hover:text-red-500 cursor-pointer" onClick={logout}>
        <span>Thoát</span>
        <i className="fa-solid fa-arrow-right-from-bracket ml-1 mr-5 "></i>
      </div>
      {/* Thông tin giao hàng */}
      {/* <div className="lg:ml-auto text-left lg:text-right">
        <h1 className="font-semibold text-lg lg:text-2xl">
          Thông tin giao hàng
          <i
            className="fa-solid fa-arrow-right-from-bracket ml-5 hover:text-red-500 cursor-pointer"
            // onClick={logout}
          ></i>
        </h1>
        <h1 className="font-semibold text-md lg:text-xl">
          Người giao hàng: !3223434
        </h1>
        <h1 className="font-semibold text-md lg:text-xl">ID: VN-DC01432</h1>
      </div> */}
    </div>
  );
};

export default MainHeader;
