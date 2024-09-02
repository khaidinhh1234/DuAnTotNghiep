import { logo } from "@/assets/img";
import { SearchOutlined } from "@ant-design/icons";
import { Input, Modal } from "antd";
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
const { Search } = Input;
const SheetSide = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [menu, setMenu] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const handleMouseLeave = () => {
    setTimeout(() => {
      setMenu(false);
      setIsClosing(false);
    }, 100);
  };
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
      name: "Giới thiệu",
      path: "/ourstory",
    },
    {
      name: "Khuyến mãi",
      path: "/vourcher",
    },
    {
      name: "Liên Hệ",
      path: "/contact",
    },
  ];
  return (
    <header className="relative">
      <div
        className={`fixed top-0 left-0 w-full h-screen z-10 transition-transform duration-300 ease-in-out ${
          menu ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ backgroundColor: menu ? "rgba(0, 0, 0, 0.4)" : "transparent" }}
      >
        <div
          className="bg-white h-full w-64 fixed top-0 left-0 shadow-lg transition-transform duration-300 ease-in-out"
          style={{ transform: menu ? "translateX(0)" : "translateX(-100%)" }}
        >
          <button
            className="absolute top-4 right-4 text-3xl text-gray-500"
            onClick={() => setMenu(!menu)}
          >
            <i className="fa-solid fa-x"></i>
          </button>
          <nav className="h-full">
            <ul className="space-y-4 p-4">
              <li>
                <a href="#">Trang chủ</a>
              </li>
              <li>
                <a href="#">Giới Thiệu</a>
              </li>
              <li>
                <a href="#">Liên hệ</a>
              </li>
              <li>
                <a href="#">Trang chủ</a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
      <div className="container mx-auto my-3 h-16 flex justify-between items-center">
        <button className="lg:hidden text-2xl" onClick={() => setMenu(!menu)}>
          <i className="fa-solid fa-bars"></i>
        </button>
        <div className="lg:w-60">
          <img
            src={logo}
            alt="Logo"
            className="lg:w-[200px] lg:h-[60px] w-32 h-10"
          />
        </div>
        <nav className="hidden lg:block">
          <ul className="flex items-center space-x-4">
            {MenuList.map((item, index) => (
              <li key={index}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `xl:px-4 lg:px-1 py-2 rounded-[7px] text-lg font-medium hover:text-white hover:bg-black ${
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
        <div className="flex items-center space-x-6 cursor-pointer">
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
            <a href="/mywishlist">
              <i className="fa-regular fa-heart text-xl"></i>
            </a>
          </span>
          <span>
            <a href="/gio-hang">
              <i className="fa-regular fa-bag-shopping text-xl relative">
                <span
                  className={`${
                    menu ? "bg-opacity-60 text-opacity-60" : ""
                  } -bottom-1 left-[10px] w-4 h-4 text-[10px] bg-red-500 rounded-full absolute text-white flex items-center justify-center`}
                >
                  0
                </span>
              </i>
            </a>
          </span>
          <Link to="/login">
            <button
              className={`${
                menu ? "bg-opacity-60 text-opacity-60" : ""
              } bg-blackL border-black shadow-lg shadow-slate-600/50 hover:text-black hover:border-0 hover:bg-white text-white lg:px-6 lg:py-3 px-2 py-2 lg:rounded-xl rounded-lg text-lg font-medium`}
            >
              Đăng nhập
            </button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default SheetSide;
