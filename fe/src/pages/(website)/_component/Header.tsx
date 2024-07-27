import { logo } from "@/assets/img";
import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Input, Modal } from "antd";
import { FaSearch } from "react-icons/fa";
import { SearchOutlined, CloseOutlined } from "@ant-design/icons";
const { Search } = Input;
const Header = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const onSearch = (value: any) => {
    console.log("Search value:", value);
    // Add your search logic here
    setIsModalVisible(false);
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const MenuList = [
    {
      name: "Trang chủ",
      path: "/",
    },
    {
      name: "Sản phẩm",
      path: "/shop",
    },
    {
      name: "Our Story",
      path: "/ourstory",
    },
    {
      name: "Nhật Ký",
      path: "*",
    },
    {
      name: "Liên Hệ",
      path: "/contact",
    },
  ];
  return (
    <header className="h-12 ">
      <div className="fixed top-0 left-0 w-full z-50  shadow-lg bg-white bg-opacity-70">
        <div className="container mx-auto my-3 h-16 flex justify-between items-center">
          <div className="lg:hidden order-1">
            <i className="fa-solid fa-bars text-2xl"></i>
          </div>
          <div className="order-2 lg:w-60">
            <img
              src={logo}
              alt="Logo"
              className="lg:w-[200px] lg:h-[60px] w-32 h-10"
            />
          </div>
          <nav className="hidden lg:block order-3">
            <ul className="flex items-center space-x-4">
              {MenuList.map((item, index) => (
                <li key={index}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `px-4 py-2 rounded-[7px] text-lg font-medium hover:text-white hover:bg-black ${
                        !isActive
                          ? "text-black hover:shadow-slate-500/50 hover:shadow-lg hover:border-0"
                          : "text-white bg-black"
                      }`
                    }
                  >
                    {item.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
          <div className="order-4 flex items-center space-x-6 cursor-pointer">
            <span>
              <div className="relative">
                <SearchOutlined
                  className="text-xl cursor-pointer"
                  onClick={showModal}
                />
                <Modal
                  open={isModalVisible}
                  onCancel={handleCancel}
                  footer={null}
                  title="Tìm kiếm"
                >
                  <Input
                    placeholder="Nhập từ khóa tìm kiếm"
                    size="large"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    onPressEnter={() => onSearch(searchValue)}
                  />
                </Modal>
              </div>
            </span>
            <span>
              <i className="fa-regular fa-heart text-xl"></i>
            </span>
            <span>
              <a href="/gio-hang">
                <i className="fa-regular fa-bag-shopping text-xl relative">
                  <span className="-bottom-1 left-[10px] w-4 h-4 text-[10px] bg-red-500 rounded-full absolute text-white flex items-center justify-center">
                    0
                  </span>
                </i>
              </a>
            </span>
            <Link to="/login">
              <button className="bg-blackL border-black shadow-lg shadow-slate-600/50 hover:text-black hover:border-0 hover:bg-white text-white lg:px-6 lg:py-3 px-2 py-2 lg:rounded-xl rounded-lg text-lg font-medium">
                Đăng nhập
              </button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
