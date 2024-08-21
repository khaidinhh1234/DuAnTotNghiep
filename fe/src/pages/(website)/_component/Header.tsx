import { logo } from "@/assets/img";
import { SearchOutlined } from "@ant-design/icons";
import { Input, Modal } from "antd";
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
const { Search } = Input;
const Header = () => {
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
      <div
        className={` ${menu == true ? "bg-black/40 h-screen " : "bg-white"} fixed top-0 left-0 w-full z-10  shadow-lg  `}
      >
        {menu && (
          <div
            className={`fixed z-20 transform transition duration-1000 ease-in-out ${
              isClosing ? "-translate-x-full" : "translate-x-0"
            }`}
            onMouseLeave={handleMouseLeave}
          >
            <div className="bg-white relative">
              <nav className="lg:hidden h-screen w-[260px] sm:w-[460px]">
                <ul>
                  <li>
                    <a href="">Trang chủ</a>
                  </li>
                  <li>
                    <a href="">Giới Thiệu</a>
                  </li>
                  <li>
                    <a href="">Liên hệ</a>
                  </li>
                  <li>
                    <a href="">Trang chủ</a>
                  </li>
                </ul>
              </nav>
              <div className="absolute top-[20px] left-[280px] sm:left-[480px]">
                <button
                  onClick={() => {
                    setMenu(!menu);
                    console.log(menu);
                  }}
                >
                  <i className="fa-solid fa-x text-3xl text-white"></i>
                </button>
              </div>
            </div>
          </div>
        )}
        <div className="container mx-auto my-3 h-16 flex justify-between items-center">
          <div className="lg:hidden order-1 relative">
            {" "}
            <button
              onClick={() => {
                setMenu(!menu);
                console.log(menu);
              }}
            >
              {" "}
              <i className="fa-solid fa-bars text-2xl"></i>
            </button>
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
                  <span
                    className={`${menu == true ? "bg-opacity-60 text-opacity-60" : ""} -bottom-1 left-[10px] w-4 h-4 text-[10px] bg-red-500 rounded-full absolute text-white flex items-center justify-center`}
                  >
                    0
                  </span>
                </i>
              </a>
            </span>
            <Link to="/login">
              <button
                className={`${menu == true ? "bg-opacity-60 text-opacity-60" : ""} bg-blackL border-black shadow-lg shadow-slate-600/50 hover:text-black hover:border-0 hover:bg-white text-white lg:px-6 lg:py-3 px-2 py-2 lg:rounded-xl rounded-lg text-lg font-medium`}
              >
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
