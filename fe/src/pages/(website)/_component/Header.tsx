import { logo } from "@/assets/img";
import { useLocalStorage } from "@/components/hook/useStoratge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import instanceClient from "@/configs/client";
import LoginPopup from "@/pages/(auth)/loginpopup/LoginPopup";
import { useQuery } from "@tanstack/react-query";
import { Dropdown, Menu, MenuProps, Modal, Spin } from "antd";
import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Notifications from "./Notifications";
import Search from "./Search";
import "./dropdown.css";
interface Category {
  id: number;
  ten_danh_muc: string;
  duong_dan: string;
  con: Category[]; // Chứa các danh mục con
}

const Header = () => {
  const [check, setcheck] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
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
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<Category[]>([]);
  const [hoveredMenu, setHoveredMenu] = useState<number | null>(null);
  useEffect(() => {
    const fetchParentCategories = async () => {
      try {
        const response = await instanceClient.get("/load-danh-muc-cha");
        if (response.data.status) {
          const categories = response.data.data.map((category: any) => ({
            id: category.id,
            ten_danh_muc: category.ten_danh_muc,
            duong_dan: category.duong_dan,
            con: [], // Mảng con ban đầu rỗng
          }));
          setMenuItems(categories);
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu danh mục cha:", error);
      }
    };

    fetchParentCategories();
  }, []);

  // Fetch danh mục con
  const fetchCategories = async (parentId: number) => {
    try {
      const response = await instanceClient.get(
        `/load-danh-muc-con-chau/${parentId}`
      );
      if (response.data.status) {
        setCategories(response.data.data);
      }
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu danh mục con:", error);
    }
  };

  // Handle hover event
  const handleMouseEnter = (id: number) => {
    setHoveredMenu(id);
    fetchCategories(id); // Fetch danh mục con khi hover vào danh mục cha
  };

  const handleMouseLeave = () => {
    setHoveredMenu(null);
    // setCategories([]); // Clear categories khi di chuột ra ngoài
  };

  // Hàm render các menu items từ dữ liệu categories
  // Hàm tạo mục danh mục con
  const renderSubCategories = (subCategories: any[]) => {
    return subCategories.map((subCategory: any) => (
      <Link
        key={subCategory.id}
        to={`/shop/${subCategory.duong_dan}`}
        className="text-gray-950 text-sm hover:text-red-600 transition-colors duration-200"
      >
        {subCategory.ten_danh_muc}
      </Link>
    ));
  };

  // Hàm tạo mục danh mục chính và sử dụng renderSubCategories cho các danh mục con
  const renderMenuItems = (items: any): MenuProps["items"] => {
    if (!items || !items.danh_muc || items.danh_muc.length === 0) {
      // Trả về một component loading khi không có danh mục hoặc đang tải
      return [
        {
          key: "loading",
          label: (
            <div className="menu-item py-5 flex justify-center items-center">
              <Spin size="small" /> {/* Hiển thị loading spinner */}
            </div>
          ),
        },
      ];
    }

    return items.danh_muc.map((category: any) => ({
      key: category.id.toString(),
      label: (
        <div className="menu-item py-5 flex flex-col gap-y-4 w-80  rounded-lg px-[50px]">
          <Link
            className="text-black text-lg font-semibold hover:text-red-600 transition-colors duration-200"
            to={`/shop/${category.duong_dan}`}
          >
            {category.ten_danh_muc}
          </Link>

          {category.con && category.con.length > 0 && (
            <div className="subcategories flex flex-col mt-2 text-sm text-gray-700">
              {renderSubCategories(category.con)}
            </div>
          )}
        </div>
      ),
    }));
  };

  // Sử dụng trong Menu component
  <Menu items={renderMenuItems(categories)} className="m-0 p-0" />;
  // console.log
  const handleMouseLeaveMenu = () => {
    setHoveredMenu(null);
    // setCategories([]); // Clear categories khi di chuột ra ngoài
  };
  // console.log("giaohang", giaohangs);
  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user"); //
    nav("/");
    // setUser(null);
  };
  const [isModalVisible, setIsModalVisible] = useState(false);
  // const [searchValue, setSearchValue] = useState("");
  const [menu, setMenu] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // const handleMouseLeave = () => {
  //   setTimeout(() => {
  //     setMenu(false);
  //     setIsClosing(false);
  //   }, 100);
  // };
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
  // console.log("data1", data1);
  // const allItems = [
  //   ...(data1?.san_pham_giam_gia || []),
  //   ...(data1?.san_pham_nguyen_gia || []),
  // ];
  // const totalUniqueProducts = allItems.length;

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
      name: "Nam",
      path: "/shop/nam",
    },
    {
      name: "Nữ",
      path: "/shop/nu",
    },
    {
      name: "Trẻ em",
      path: "/shop/tre-em",
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
    { id: 1, label: "Nam", slug: "nam" },
    { id: 2, label: "Nữ", slug: "nu" },
    { id: 3, label: "Trẻ em", slug: "tre-em" },
  ];

  const handleCart = (e: React.MouseEvent) => {
    if (!access_token) {
      e.preventDefault(); // Ngăn chuyển hướng
      setIsModalVisible(true); // Hiển thị Modal
    }
  };
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
                          isActive
                            ? "underline decoration-sky-500"
                            : "hover:underline hover:text-red-500"
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
          <div className="mx-10 md:mx-40 flex justify-between items-center ">
            <div className="lg:hidden order-1 relative flex">
              <button
                onClick={() => {
                  setMenu(!menu);
                }}
              >
                <i className="fa-solid fa-bars text-3xl mx-0"></i>
              </button>{" "}
              <div className="lg:w-36 mx-10">
                <Link to="/">
                  <img
                    src={
                      "https://res.cloudinary.com/dcvu7e7ps/image/upload/v1733674338/mcix5sx1uxkjyhs33hss.png"
                    }
                    alt="Logo"
                    className="lg:w-[120px] lg:h-[35px] w-32 h-9"
                  />
                </Link>
              </div>
            </div>
            <nav className="hidden lg:flex order-3 items-cennter justify-start">
              <div className="lg:w-36">
                <Link to="/">
                  <img
                    src={
                      "https://res.cloudinary.com/dcvu7e7ps/image/upload/v1733674338/mcix5sx1uxkjyhs33hss.png"
                    }
                    alt="Logo"
                    className="lg:w-[120px] lg:h-[35px] w-32 h-9"
                  />
                </Link>
              </div>
              <nav className="flex space-x-6 text-gray-700 font-bold pt-1 relative">
                <NavLink to="/" className="text-lg font-bold">
                  Trang chủ
                </NavLink>
                <NavLink to="/ourstory" className="text-lg">
                  Giới thiệu
                </NavLink>
                {mainMenuItems.map((item) => (
                  <div
                    key={item.id}
                    onMouseEnter={() => handleMouseEnter(item.id)}
                    onMouseLeave={handleMouseLeave}
                    className="relative text-lg"
                  >
                    <Dropdown
                      menu={{
                        items: renderMenuItems(categories),
                        className:
                          "custom-dropdown flex flex-row justify-start w-[100%] fixed top-[80px] left-0 z-20 ",
                      }}
                    >
                      <Link to={`/shop/${item.slug}`} className="text-black ">
                        {item.label}
                      </Link>
                    </Dropdown>
                  </div>
                ))}
                <NavLink to="/blog" className="text-lg">
                  Bài viết
                </NavLink>
                <NavLink to="/vourcher" className="text-lg">
                  Khuyến mãi
                </NavLink>
                <NavLink to="/contact" className="text-lg">
                  Liên hệ
                </NavLink>
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
                <Link to="/gio-hang" onClick={handleCart}>
                  <i className="fa-regular fa-bag-shopping text-xl relative px-1">
                    <span
                      className={`${
                        menu == true ? "bg-opacity-60 text-opacity-60" : ""
                      } -bottom-1 right-0 w-4 h-4 px-1 py-1 text-[10px] bg-red-500 rounded-full absolute text-white flex items-center justify-center`}
                    >
                      {data1?.tong_so_luong > 99
                        ? "+99"
                        : data1?.tong_so_luong || 0}
                    </span>
                  </i>
                </Link>
                <Modal
                  visible={isModalVisible}
                  onCancel={() => setIsModalVisible(false)}
                  footer={null}
                  width={500}
                >
                  <LoginPopup />
                </Modal>
                {/* <div className="absolute top-full left-0 pt-4 w-full"> */}
                {/* <CartOverlay isVisible={isCartVisible} /> */}
                {/* </div> */}
              </span>
              {member ? (
                <>
                  {" "}
                  <Avatar className="relative" onClick={() => setcheck(!check)}>
                    <AvatarImage
                      src={data?.data?.user?.anh_nguoi_dung ?? anh_nguoi_dung}
                      className="w-10 h-10 rounded-full border-2 border-gray-200 shadow-md object-cover"
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
                      src={data?.data?.user?.anh_nguoi_dung ?? anh_nguoi_dung}
                      alt=""
                              className="w-8 h-8 rounded-full border-2 border-gray-200 shadow-md object-cover"
                            />
                            <h6 className="font-semibold mx-2 text-lg ">
                              {" "}
                              {member.ho + " " + member.ten}
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
