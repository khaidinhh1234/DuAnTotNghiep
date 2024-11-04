import { logo } from "@/assets/img";
import { useLocalStorage } from "@/components/hook/useStoratge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import instanceClient from "@/configs/client";
import { SearchOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Input, Modal } from "antd";
import { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import CartOverlay from "./CartOverlay";
import HoverMenu from "./HoverMenu";
import Notifications from './Notifications';
interface Category {
    id: number;
    ten_danh_muc: string;
    duong_dan: string;
    children: Category[];
}

const Header2 = () => {
    const [check, setcheck] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isCartVisible, setIsCartVisible] = useState(false);
    const cartRef = useRef<HTMLDivElement>(null);
    const [showNotifications, setShowNotifications] = useState(false);
    const notificationRef = useRef<HTMLDivElement>(null);
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
    // 
    interface MenuItem {
        id: number;
        name: string;
        path: string;
    }
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [hoveredCategory, setHoveredCategory] = useState<number | null>(null);

    // Fetch parent categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await instanceClient.get('/load-danh-muc-cha');
                if (response.data.status) {
                    const categories = response.data.data.map((category: any) => ({
                        id: category.id,
                        name: category.ten_danh_muc,
                        path: `/${category.duong_dan}`,
                    }));
                    setMenuItems(categories);
                }
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu danh mục:', error);
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
    const [user] = useLocalStorage("user" as any, {});
    // const nav = useNavigate();
    const member = user.user;
    const phanquyen = user?.user?.vai_tros?.filter(
        (vai_tro: any) => vai_tro?.ten_vai_tro !== "Khách hàng"
    );
    // console.log(member);
    // console.log("member", member);
    // console.log("member", member);

    // console.log("giaohang", giaohangs);
    const logout = () => {
        // nav("/login");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        // setUser(null);
    };
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

    const access_token = user.access_token || localStorage.getItem("access_token");
    const { data } = useQuery({
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

    const dataCount = data?.notifications?.length || 0;



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
        <header className="h-12 relative">
            <div className="bg-white w-full">
                <div
                    className={`fixed top-0 left-0 w-full h-screen z-20 transition-transform duration-300 ease-in-out ${menu ? "translate-x-0" : "-translate-x-full"
                        }`}
                    style={{
                        backgroundColor: menu ? "rgba(0, 0, 0, 0.4)" : "transparent",
                    }}
                >
                    <div
                        className="px-10 bg-white h-full w-96 sm:w-96 fixed top-0 left-0 shadow-lg transition-transform duration-300 ease-in-out"
                        style={{ transform: menu ? "translateX(0)" : "translateX(-100%)" }}
                        onMouseLeave={handleMouseLeave}
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
                <div className="fixed w-full  h-[86px] z-20 bg-neutral-100 pt-4 opacity-90">
                    <div className="max-w-7xl mx-auto flex justify-between items-center ">
                        <div className="lg:hidden order-1 relative">
                            <button
                                onClick={() => {
                                    setMenu(!menu);
                                }}
                            >
                                <i className="fa-solid fa-bars text-2xl mx-5"></i>
                            </button>
                        </div>
                        <div className="order-2 lg:w-60">
                            <Link to='/'>
                            <img
                                src={logo}
                                alt="Logo"
                                className="lg:w-[130px] lg:h-[40px] w-32 h-9"
                            /></Link>
                        </div>

                        <nav className="hidden lg:block order-3">
                            <ul className="flex items-center space-x-4">
                                {menuItems.map((category) => (
                                    <li
                                        key={category.id}
                                        className="relative group"
                                        onMouseEnter={() => setHoveredCategory(category.id)}
                                        onMouseLeave={() => setHoveredCategory(null)}
                                    >
                                        <a href={category.path} className="px-4 py-2 block hover:bg-gray-100">
                                            {category.name}
                                        </a>
                                        {hoveredCategory === category.id && (
                                            <HoverMenu
                                                parentId={category.id}
                                                onClose={() => setHoveredCategory(null)}
                                            />
                                        )}
                                    </li>
                                ))}

                                {/* <li>
                                    <a href="/bai-viet" className="px-4 py-2 block hover:bg-gray-100">Bài viết</a>
                                </li> */}
                                <li>
                                    <a href="/vourcher" className="px-4 py-2 block hover:bg-gray-100">Khuyến mại</a>
                                </li>
                                <li>
                                    <a href="/contact" className="px-4 py-2 block hover:bg-gray-100">Liên hệ</a>
                                </li>
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

                            {member ? (
                                <>
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
                                        <i className="fa-regular fa-bell text-xl relative cursor-pointer">
                                            <span className="absolute -bottom-1 left-[10px] w-4 h-4 text-[10px] bg-red-500 rounded-full text-white flex items-center justify-center">
                                                {dataCount}
                                            </span>
                                        </i>

                                        <div
                                            className={`absolute right-0 mt-2 z-50 transition-opacity duration-300 ${showNotifications
                                                    ? "opacity-100"
                                                    : "opacity-0 pointer-events-none"
                                                }`}
                                        >
                                            <Notifications onUnreadCountChange={(count: number) => console.log(`Unread count: ${count}`)} />
                                        </div>
                                    </span>
                                    <span
                                        ref={cartRef}
                                        onMouseEnter={() => setIsCartVisible(true)}
                                        onMouseLeave={() => setIsCartVisible(false)}
                                    >
                                        {" "}
                                        <a href="/gio-hang">
                                            <i className="fa-regular fa-bag-shopping text-xl relative">
                                                <span
                                                    className={`${menu === true ? "bg-opacity-60 text-opacity-60" : ""
                                                        } -bottom-1 left-[10px] w-4 h-4 text-[10px] bg-red-500 rounded-full absolute text-white flex items-center justify-center`}
                                                >
                                                    {data?.tong_so_luong}
                                                </span>
                                            </i>
                                        </a>
                                        {/* <div className="absolute top-full left-0 pt-4 w-full"> */}
                                        <CartOverlay isVisible={isCartVisible} />
                                        {/* </div> */}
                                    </span>
                                    <Avatar className="relative" onClick={() => setcheck(!check)}>
                                        <AvatarImage src={member?.anh_nguoi_dung} />
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
                                                            src=""
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
                                                                <img
                                                                    src="https://github.com/shadcn.png"
                                                                    alt=""
                                                                    className="w-[30px] h-[30px] rounded-full"
                                                                />
                                                                <h6 className="font-semibold mx-2 text-lg ">
                                                                    Quản trị
                                                                </h6>
                                                            </a>
                                                        </li>
                                                    </>
                                                )}
                                                <li className="my-1">
                                                    <a
                                                        href=""
                                                        className="text-black flex hover:bg-slate-300 px-2 pt-2 rounded-lg "
                                                    >
                                                        <img
                                                            src="https://github.com/shadcn.png"
                                                            alt=""
                                                            className="w-[30px] h-[30px] rounded-full"
                                                        />
                                                        <h6 className="font-semibold mx-2 text-lg ">
                                                            Cài đặt
                                                        </h6>
                                                    </a>
                                                </li>
                                                <li className="mb-2">
                                                    <a
                                                        onClick={logout}
                                                        href=""
                                                        className="text-black flex hover:bg-slate-300 px-2 pt-2 rounded-lg "
                                                    >
                                                        <img
                                                            src="https://github.com/shadcn.png"
                                                            alt=""
                                                            className="w-[30px] h-[30px] rounded-full"
                                                        />
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
                                        className={`${menu == true ? "bg-opacity-60 text-opacity-60" : ""
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
export default Header2;
