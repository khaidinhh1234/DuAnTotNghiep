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
      name: "Khuyến mãi",
      path: "/vourcher",
    },
    {
      name: "Liên Hệ",
      path: "/contact",
    },
  ];
  return (
    <header className="h-12 relative ">
      <div
      // className={` ${menu == true ? "bg-black/40 h-screen " : "bg-white"} fixed top-0 left-0 w-full z-10  shadow-lg  transition-transform duration-300 ease-in-out`}
      >
        <div
          className={`fixed top-0 left-0 w-full h-screen z-10 transition-transform duration-300 ease-in-out ${
            menu ? "translate-x-0" : "-translate-x-full"
          }`}
          style={{
            backgroundColor: menu ? "rgba(0, 0, 0, 0.4)" : "transparent",
          }}
        >
          <div
            className={`fixed z-20 transform transition duration-1000 ease-in-out ${
              isClosing ? "-translate-x-full" : "translate-x-0"
            }`}
            onMouseLeave={handleMouseLeave}
          >
            <div className="grid ">
              <div className="my-10 text-2xl *:mx-2">
                <a href="" className="font-bold text-xl">
                  Nam
                </a>{" "}
                |
                <a className="font-bold text-2xl" href="">
                  Nữ
                </a>
                |
                <a href="" className="font-bold text-2xl">
                  Trẻ em
                </a>
              </div>
              <nav className="h-full my-5 px-2">
                <ul className="space-y-4  text-xl font-bold  ">
                  {MenuList.map((item, index) => (
                    <li className="" key={index}>
                      <NavLink
                        to={item.path}
                        onClick={() => setMenu(!menu)}
                        className={({ isActive }) =>
                          isActive ? "underline decoration-sky-500" : ""
                        }
                      >
                        {item.name}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
            <div className="fixed bottom-0  py-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xl font-semibold ">
                  <i className="fa-regular fa-user"></i>
                  <a href="/login">
                    <button className=" px-4 py-2 rounded-lg">Đăng nhập</button>
                  </a>
                  |
                  <a href="/register">
                    <button className=" px-4 py-2 rounded-lg">Đăng ký</button>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <button
            className="absolute top-1 left-[400px] text-3xl text-white"
            onClick={() => setMenu(!menu)}
          >
            <i className="fa-solid fa-x"></i>
          </button>
        </div>
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
          <div className="order-2 lg:w-50">
            <img
              src={logo}
              alt="Logo"
              className="lg:w-[140px] lg:h-[42px] w-20 h-6"
            />
          </div>
          <nav className="hidden lg:block order-3">
            <ul className="flex items-center space-x-4">
              {MenuList.map((item, index) => (
                <li key={index}>
                  <NavLink
                    to={item.path}
                    // className="xl:px-4 lg:px-1  py-2 rounded-[7px] text-lg font-medium hover:text-white hover:bg-black"
                    className={({ isActive }) =>
                      `xl:px-4 lg:px-1  py-2 rounded-[7px] text-lg font-medium hover:text-white hover:bg-black ${
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
              <a href="/mywishlist">
                <i className="fa-regular fa-heart text-xl"></i>
              </a>
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
