import { logo } from "@/assets/img";
import { useLocalStorage } from "@/components/hook/useStoratge";
import { SearchOutlined } from "@ant-design/icons";
import { Dropdown, Input, Modal, MenuProps } from "antd";
import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import instance from "@/configs/client";
import CartOverlay from "./CartOverlay";
import Notifications from "./Notifications";
import instanceClient from "@/configs/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import Search from "./Search";

interface Category {
  id: number;
  ten_danh_muc: string;
  duong_dan: string;
  children: Category[];
}

const Header = () => {
  const [check, setcheck] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isCartVisible, setIsCartVisible] = useState(false);
  const cartRef = useRef<HTMLDivElement>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const [user] = useLocalStorage("user" as any, {});
  const member = user?.user;
  const nav = useNavigate();
  // console.log(user?.user?.anh_nguoi_dung);
  const [anh_nguoi_dung] = useState(member?.anh_nguoi_dung);
  const { data } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      try {
        const response = await instanceClient.post("cap-nhat-thong-tin");
        return response.data;
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    },
  });
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
        setIsCartVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await instance.get("/load-danh-muc");

        const result = response.data;
        if (result.status) {
          setCategories(result.data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as any)) {
        // Khi click ra ngoài, ẩn phần tử
        setcheck(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);
  // const [user] = useLocalStorage("user" as any, {});
  // const nav = useNavigate();
  // const member = user.user;
  const phanquyen = user?.user?.vai_tros?.filter(
    (vai_tro: any) => vai_tro?.ten_vai_tro !== "Khách hàng"
  );
  // console.log(member);
  // console.log("member", member);
  // console.log("member", member);
  const [hoveredMenu, setHoveredMenu] = useState<number | null>(null);
  const fetchCategories = async (parentId: number) => {
    try {
      const response = await instanceClient.get(
        `/load-danh-muc-con-chau/${parentId}`
      );
      if (response.data.status) {
        setCategories(response.data.data); // Cập nhật danh mục con
      }
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu danh mục con:", error);
    }
  };
  const handleMouseEnter = (id: number) => {
    setHoveredMenu(id);
    fetchCategories(id); // Fetch danh mục con khi hover vào danh mục cha
  };

  const handleMouseLeaveMenu = () => {
    setHoveredMenu(null);
    // setCategories([]); // Clear categories khi di chuột ra ngoài
  };
  // console.log("giaohang", giaohangs);
  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user"); //
    nav("/");
    // setUser(null);
  };
  const [isModalVisible, setIsModalVisible] = useState(false);
  // const [searchValue, setSearchValue] = useState("");
  const [menu, setMenu] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

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
  // const showModal = () => {
  //   setIsModalVisible(true);
  // };
  // const handleCancel = () => {
  //   setIsModalVisible(false);
  // };
  const [isProductMenuVisible, setIsProductMenuVisible] = useState(false);

  const handleMouseEnterProduct = () => {
    setIsProductMenuVisible(true);
  };

  const handleMouseLeaveProduct = () => {
    setIsProductMenuVisible(false);
  };
  const renderMenuItems = (items: any): MenuProps["items"] => {
    return items?.danh_muc?.length
      ? items.danh_muc.map((category: any) => ({
          key: category.id.toString(),
          label: (
            <div className="menu-item py-5 flex flex-col gap-y-2 items-start !m-0 !p-0 !mx-28 !gap-x-20">
              <a
                className="row text-black text-sm font-bold"
                href={`/${category.duong_dan}`}
                rel="noopener noreferrer"
              >
                {category.ten_danh_muc}
              </a>
              {category.con && category.con.length > 0 && (
                <div className="subcategories flex flex-col">
                  {category.con.map((subCategory: any) => (
                    <a
                      key={subCategory.id}
                      href={`/${subCategory.duong_dan}`}
                      rel="noopener noreferrer"
                      className="text-gray-950 text-sm"
                    >
                      {subCategory.ten_danh_muc}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ),
        }))
      : [];
  };
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as any)) {
        setcheck(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);

  const access_token =
    user.access_token || localStorage.getItem("access_token");
  const { data: data1 } = useQuery({
    queryKey: ["cart", access_token],
    queryFn: async () => {
      try {
        const response = await instanceClient.get(`/gio-hang`, {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });
        return response.data;
      } catch (error) {
        throw new Error("Error fetching cart data");
      }
    },
  });
  const allItems = [
    ...(data1?.san_pham_giam_gia || []),
    ...(data1?.san_pham_nguyen_gia || []),
  ];
  const totalUniqueProducts = allItems.length;

  const MenuList = [
    {
      name: "Trang chủ",
      path: "/",
    },
    {
      name: "Giới thiệu",
      path: "/ourstory",
    },
    {
      name: "Sản phẩm",
      path: "/shop",
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
  const mainMenuItems = [
    { id: 1, label: "Nam" },
    { id: 2, label: "Nữ" },
    { id: 3, label: "Trẻ em" },
  ];
  return (
    <header className="h-12 relative">
      <div className="bg-white w-full">
        {/* Add the corresponding closing tag for this div */}
        <div
          className={`fixed top-0 left-0 w-full h-screen z-20 transition-transform duration-300 ease-in-out ${
            menu ? "translate-x-0" : "-translate-x-full"
          }`}
          style={{
            backgroundColor: menu ? "rgba(0, 0, 0, 0.4)" : "transparent",
          }}
        >
          <div
            className="px-10 bg-white h-full w-96 sm:w-96 fixed top-0 left-0 shadow-lg transition-transform duration-300 ease-in-out"
            style={{ transform: menu ? "translateX(0)" : "translateX(-100%)" }}
            onMouseLeave={handleMouseLeaveMenu}
          >
            <div className="grid">
              <div className="my-10 text-2xl">
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
              <nav className="h-full my-5 px-2 ">
                <ul className="space-y-4 text-xl font-bold ">
                  {MenuList.map((item, index) => (
                    <li key={index}>
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
            <div className="fixed bottom-0 py-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xl font-semibold">
                  <i className="fa-regular fa-user"></i>
                  <a href="/login">
                    <button className="px-4 py-2 rounded-lg">Đăng nhập</button>
                  </a>
                  |
                  <a href="/register">
                    <button className="px-4 py-2 rounded-lg">Đăng ký</button>
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
        <div className="fixed w-full  h-[86px] z-20 bg-neutral-100 pt-4 ">
          <div className=" mx-40 flex justify-between items-center ">
            <div className="lg:hidden order-1 relative">
              <button
                onClick={() => {
                  setMenu(!menu);
                }}
              >
                <i className="fa-solid fa-bars text-2xl mx-5"></i>
              </button>
            </div>

            <nav className="hidden lg:flex order-3 items-cennter justify-start">
              <div className="lg:w-36">
                <Link to="/">
                  <img
                    src={logo}
                    alt="Logo"
                    className="lg:w-[120px] lg:h-[35px] w-32 h-9"
                  />
                </Link>
              </div>
              {/* Navigation Links */}
              <nav className="flex space-x-6 text-gray-700 font-bold pt-1 relative">
                <a href="/" className="text-lg font-bold">
                  Trang chủ
                </a>
                <a href="/ourstory" className="text-lg">
                  Giới thiệu
                </a>
                {mainMenuItems.map((item) => (
                  <div
                    key={item.id}
                    onMouseEnter={() => handleMouseEnter(item.id)}
                    onMouseLeave={handleMouseLeave}
                    className="relative text-lg"
                  >
                    <Dropdown
                      menu={{
                        items: renderMenuItems(categories), // Đảm bảo truyền categories vào hàm renderMenuItems
                        className:
                          "custom-dropdown flex flex-row justify-start w-[100vw] top-[45px] -left-[555px]",
                      }}
                    >
                      <a href="#" className="text-black">
                        {item.label}
                      </a>
                    </Dropdown>
                  </div>
                ))}

                <a href="/" className="text-lg">
                  Bài viết
                </a>
                <a href="/vourcher" className="text-lg">
                  Khuyến mại
                </a>
                <a href="/contact" className="text-lg">
                  Liên hệ
                </a>
              </nav>
            </nav>

            <div className="order-4 flex items-center space-x-2 cursor-pointer">
              {/* <span className="px-1">
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
              </span> */}

              <span className="px-1">
                <Search />
              </span>

              {/* {" "}
                  <span>
                    <a href="/mywishlist">
                      <i className="fa-regular fa-heart text-xl">{ }</i>
                    </a>
                  </span> */}
              <span
                ref={notificationRef}
                className="relative"
                onMouseEnter={() => setShowNotifications(true)}
                onMouseLeave={() => setShowNotifications(false)}
              >
                <i className="fa-regular fa-bell text-xl relative cursor-pointer px-1">
                  {unreadCount > 0 && (
                    <span className="absolute -bottom-1 left-[10px] w-4 h-4 text-[10px] bg-red-500 rounded-full text-white flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </i>

                <div
                  className={`absolute -right-2 px-2 mt-2 z-50 transition-opacity duration-300 ${
                    showNotifications
                      ? "opacity-100"
                      : "opacity-0 pointer-events-none"
                  }`}
                >
                  <Notifications onUnreadCountChange={setUnreadCount} />
                </div>
              </span>
              <span
                ref={cartRef}
                onMouseEnter={() => setIsCartVisible(true)}
                onMouseLeave={() => setIsCartVisible(false)}
              >
                {" "}
                <a href="/gio-hang">
                  <i className="fa-regular fa-bag-shopping text-xl relative px-1">
                    <span
                      className={`${
                        menu == true ? "bg-opacity-60 text-opacity-60" : ""
                      } -bottom-1 right-0 w-4 h-4 px-1 py-1 text-[10px] bg-red-500 rounded-full absolute text-white flex items-center justify-center`}
                    >
                      {totalUniqueProducts || 0}{" "}
                    </span>
                  </i>
                </a>
                {/* <div className="absolute top-full left-0 pt-4 w-full"> */}
                <CartOverlay isVisible={isCartVisible} />
                {/* </div> */}
              </span>
              {member ? (
                <>
                  {" "}
                  <Avatar className="relative" onClick={() => setcheck(!check)}>
                    <AvatarImage
                      src={data?.data?.anh_nguoi_dung ?? anh_nguoi_dung}
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  {check && (
                    <div
                      ref={ref}
                      className="absolute top-20 w-60 h-auto p-3 rounded-lg shadow-lg
                   bg-white border"
                    >
                      <ul>
                        <li className="mb-1">
                          <a
                            href="/mypro/myprofile"
                            className="text-black flex hover:bg-slate-300 px-2 pt-2 rounded-lg"
                          >
                            <img
                              src={data?.data?.anh_nguoi_dung ?? anh_nguoi_dung}
                              alt=""
                              className="w-[30px] h-[30px] rounded-full"
                            />
                            <h6 className="font-semibold mx-2 text-lg ">
                              {" "}
                              {member.ten + " " + member.ho}
                            </h6>
                          </a>
                        </li>
                        <hr />
                        {!phanquyen || phanquyen.length === 0 ? (
                          ""
                        ) : (
                          <>
                            <li className="my-1">
                              <a
                                href="/admin"
                                className="text-black flex hover:bg-slate-300 px-2 pt-2 rounded-lg "
                              >
                                <i className="fa-solid fa-crown text-xl ml-1"></i>
                                <h6 className="font-semibold mx-2 text-lg ">
                                  Quản trị
                                </h6>
                              </a>
                            </li>
                          </>
                        )}
                        <li className="my-1">
                          <a
                            href="/mypro/myorder/"
                            className="text-black flex hover:bg-slate-300 px-2 pt-2 rounded-lg "
                          >
                            <i className="fa-sharp-duotone fa-solid fa-box-open-full text-xl ml-1"></i>
                            <h6 className="font-semibold mx-2 text-lg ">
                              Đơn hàng
                            </h6>
                          </a>
                        </li>
                        <li className="mb-2">
                          <a
                            onClick={logout}
                            href=""
                            className="text-black flex hover:bg-slate-300 px-2 pt-2 rounded-lg "
                          >
                            <i className="fa-solid fa-arrow-right-from-bracket text-xl ml-2 "></i>
                            <h6 className="font-semibold mx-2 text-lg ">
                              Đăng xuất
                            </h6>
                          </a>
                        </li>
                      </ul>
                      <p className="text-[12px] p-2">
                        Quyền riêng tư · Điều khoản · © 2024
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <Link to="/login">
                  <button
                    className={`${
                      menu == true ? "bg-opacity-60 text-opacity-60" : ""
                    } bg-blackL border-black shadow-lg shadow-slate-600/50 hover:text-black hover:border-0 hover:bg-white text-white lg:px-6 lg:py-3 px-2 py-2 lg:rounded-xl rounded-lg text-lg font-medium`}
                  >
                    Đăng nhập
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
export default Header;
