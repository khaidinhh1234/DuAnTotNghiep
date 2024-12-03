// import Link from "next/link";

import { useLocalStorage } from "@/components/hook/useStoratge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Notifications from "./Notifications";

const Header = () => {
  const [user] = useLocalStorage("user" as any, {});

  const vaitro =
    user?.user?.vai_tros?.map((item: any) => item.ten_vai_tro) || [];
  const ten = user?.user?.ho + " " + user?.user?.ten;
  const anh = user?.user?.anh_nguoi_dung;
  const nav = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const logout = () => {
    nav("/login");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    // setUser(null);
  };
  const [unreadCount, setUnreadCount] = useState(0);

  return (
    <header className="sticky top-0 z-50 flex h-14 items-center gap-4 border-b bg-white px-4 lg:h-[60px] lg:px-6">
      <div className="w-full flex-1">
        <form>
          {" "}
          <div className="sticky top-0 z-10 flex h-[60px] items-center border-b border-gray-300 px-4 lg:px-6 bg-white ">
            <Link
              to="/admin"
              className="flex items-center gap-2 font-bold text-black text-xl "
            >
              {/* <Package className="h-6 w-6" /> */}
              {/* <i class="fa-sharp fa-solid fa-g text-black"></i> */}
              <span>GLOW CLOTHING</span>
            </Link>
          </div>
        </form>
      </div>
      <div>
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
        </span>{" "}
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="icon" className="rounded-full">
            <img
              src={anh}
              alt={anh}
              className="w-[30px] h-[30px] rounded-full"
            />
            <span className="sr-only">Toggle user menu</span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="max-h-[400px]  mr-10">
          <DropdownMenuLabel>{ten}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            {" "}
            <Link to="admin-profile">Thông tin cá nhân </Link>
          </DropdownMenuItem>
          {vaitro?.includes("Quản trị viên") && (
            <DropdownMenuItem>
              <Link to={"/admin/history"}>Lịch sử thao tác </Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => logout()}>
            Đăng xuất
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
};

export default Header;
