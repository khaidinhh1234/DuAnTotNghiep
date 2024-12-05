import { logo } from "@/assets/img";
import { useLocalStorage } from "@/components/hook/useStoratge";
import { SearchOutlined } from "@ant-design/icons";
import { Dropdown, Input, Modal, MenuProps, Menu, Drawer } from "antd";
import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import instance from "@/configs/client";
import CartOverlay from "./CartOverlay";
import Notifications from "./Notifications";
import instanceClient from "@/configs/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import Search from "./Search";
import "./dropdown.css";
interface Category {
  id: number;
  ten_danh_muc: string;
  duong_dan: string;
  con: Category[]; // Chứa các danh mục con
}

const Test123 = () => {
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
        setCategories(response.data.data); // Cập nhật danh mục con
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
        className="text-gray-950 text-sm"
      >
        {subCategory.ten_danh_muc}
      </Link>
    ));
  };

  // Hàm tạo mục danh mục chính và sử dụng renderSubCategories cho các danh mục con
  const renderMenuItems = (items: any): MenuProps["items"] => {
    return items?.danh_muc?.length
      ? items.danh_muc.map((category: any) => ({
          key: category.id.toString(),
          label: (
            <div className="menu-item py-5 flex flex-col gap-y-2 !items-start !m-0 !p-0 !mx-28 !gap-x-20">
              <Link
                className="row text-black text-sm font-bold"
                to={`/shop/${category.duong_dan}`}
              >
                {category.ten_danh_muc}
              </Link>

              {category.con && category.con.length > 0 && (
                <div className="subcategories flex flex-col">
                  {renderSubCategories(category.con)}
                </div>
              )}
            </div>
          ),
        }))
      : [];
  };

  // Sử dụng trong Menu component
  <Menu items={renderMenuItems(categories)} className="m-0 p-0" />;

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
    { id: 1, label: "Nam", slug: "nam" },
    { id: 2, label: "Nữ", slug: "nu" },
    { id: 3, label: "Trẻ em", slug: "tre-em" },
  ];
  return (
    <header className=" relative flex items-center justify-between py-10 px-10 bg-white shadow-md z-50 ">
      {/* Logo */}
      <div className="flex items-center space-x-4 ml-32">
        <Link to="/">
          <img
            src={logo}
            alt="Logo"
            className="lg:w-[130px] lg:h-[40px] w-32 h-9"
          />
        </Link>

        {/* Navigation Links */}
        <nav className="flex space-x-6 text-gray-700 font-bold ml-4 relative z-30">
          {" "}
          {/* Đảm bảo header có z-index cao */}
          <a href="#" className="hover:text-blue-500">
            Trang chủ
          </a>
          {/* Nam */}
          <div
            onMouseEnter={() => handleMouseEnter(1)}
            onMouseLeave={handleMouseLeave}
            className="relative"
          >
            <a href="#" className="hover:text-blue-500">
              Nam
            </a>
            <Drawer
              placement="top"
              height={200}
              onClose={handleMouseLeave}
              open={hoveredMenu === 1}
              closable={false}
              className="absolute top-[100px] -z-[10px] bg-white"
            >
              <p>Item 1</p>
              <p>Item 2</p>
              <p>Item 3</p>
            </Drawer>
          </div>
          {/* Nữ */}
          <div
            onMouseEnter={() => handleMouseEnter(2)}
            onMouseLeave={handleMouseLeave}
            className="relative"
          >
            <a href="#" className="hover:text-blue-500">
              Nữ
            </a>
            <Drawer
              placement="top"
              height={200}
              onClose={handleMouseLeave}
              open={hoveredMenu === 2}
              closable={false}
              className="absolute top-[100px] z-40 bg-white"
            >
              <p>Item 1</p>
              <p>Item 2</p>
              <p>Item 3</p>
            </Drawer>
          </div>
          {/* Trẻ em */}
          <div
            onMouseEnter={() => handleMouseEnter(3)}
            onMouseLeave={handleMouseLeave}
            className="relative"
          >
            <a href="#" className="hover:text-blue-500">
              Trẻ em
            </a>
            <Drawer
              placement="top"
              height={200}
              onClose={handleMouseLeave}
              open={hoveredMenu === 3}
              closable={false}
              className="absolute top-[100px] bg-white"
            >
              <p>Item 1</p>
              <p>Item 2</p>
              <p>Item 3</p>
            </Drawer>
          </div>
          <a href="#" className="hover:text-blue-500">
            Giới thiệu
          </a>
          <a href="#" className="hover:text-blue-500">
            Bài viết
          </a>
          <a href="#" className="hover:text-blue-500">
            Khuyến mãi
          </a>
          <a href="#" className="hover:text-blue-500">
            Liên hệ
          </a>
        </nav>
      </div>

      {/* Search and Cart Icons */}
      <div className="order-4 flex items-center space-x-4 cursor-pointer">
        <span className="px-1">
          <Search />
        </span>
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
          <a href="/gio-hang">
            <i className="fa-regular fa-bag-shopping text-xl relative px-1">
              <span
                className={`${
                  menu == true ? "bg-opacity-60 text-opacity-60" : ""
                } -bottom-1 right-0 w-4 h-4 px-1 py-1 text-[10px] bg-red-500 rounded-full absolute text-white flex items-center justify-center`}
              >
                {data?.tong_so_luong || 0}
              </span>
            </i>
          </a>
          <CartOverlay isVisible={isCartVisible} />
        </span>
        {member ? (
          <>
            <Avatar className="relative" onClick={() => setcheck(!check)}>
              <AvatarImage src={data?.data?.anh_nguoi_dung ?? ""} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            {check && (
              <div
                ref={ref}
                className="absolute top-20 w-60 h-auto p-3 rounded-lg shadow-lg bg-white border"
              >
                <ul>
                  <li className="mb-1">
                    <a
                      href="/mypro/myprofile"
                      className="text-black flex hover:bg-slate-300 px-2 pt-2 rounded-lg"
                    >
                      <img
                        src=""
                        alt=""
                        className="w-[30px] h-[30px] rounded-full"
                      />
                      <h6 className="font-semibold mx-2 text-lg">
                        {member.ten + " " + member.ho}
                      </h6>
                    </a>
                  </li>
                  <hr />
                  {!phanquyen || phanquyen.length === 0 ? (
                    ""
                  ) : (
                    <li className="my-1">
                      <a
                        href="/admin"
                        className="text-black flex hover:bg-slate-300 px-2 pt-2 rounded-lg"
                      >
                        <img
                          src="https://github.com/shadcn.png"
                          alt=""
                          className="w-[30px] h-[30px] rounded-full"
                        />
                        <h6 className="font-semibold mx-2 text-lg">Quản trị</h6>
                      </a>
                    </li>
                  )}
                  <li className="my-1">
                    <a
                      href=""
                      className="text-black flex hover:bg-slate-300 px-2 pt-2 rounded-lg"
                    >
                      <img
                        src="https://github.com/shadcn.png"
                        alt=""
                        className="w-[30px] h-[30px] rounded-full"
                      />
                      <h6 className="font-semibold mx-2 text-lg">Cài đặt</h6>
                    </a>
                  </li>
                  <li className="mb-2">
                    <a
                      onClick={logout}
                      href=""
                      className="text-black flex hover:bg-slate-300 px-2 pt-2 rounded-lg"
                    >
                      <img
                        src="https://github.com/shadcn.png"
                        alt=""
                        className="w-[30px] h-[30px] rounded-full"
                      />
                      <h6 className="font-semibold mx-2 text-lg">Đăng xuất</h6>
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
    </header>
  );
};
export default Test123;
