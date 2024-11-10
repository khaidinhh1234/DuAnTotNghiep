// import Link from "next/link";
import {
  Home,
  LineChart,
  Menu,
  Package,
  Package2,
  ShoppingCart,
  Users,
} from "lucide-react";

import { useLocalStorage } from "@/components/hook/useStoratge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Link, useNavigate } from "react-router-dom";
import Notifications from "./Notifications";
import { useRef, useState } from "react";

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
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col bg-white">
          <nav className="grid gap-2 text-lg font-medium">
            <Link
              to="#"
              className="flex items-center gap-2 text-lg font-semibold"
            >
              <Package2 className="h-6 w-6" />
              <span className="sr-only">Acme Inc</span>
            </Link>
            <Link
              to="#"
              className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-2xl text-muted-foreground hover:text-foreground"
            >
              <Home className="h-5 w-5" />
              Dashboard
            </Link>
            <Link
              to="#"
              className="mx-[-0.65rem] flex items-center gap-4 rounded-xl bg-muted px-3 py-2 text-foreground hover:text-foreground"
            >
              <ShoppingCart className="h-5 w-5" />
              Orders
              <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                6
              </Badge>
            </Link>
            <Link
              to="#"
              className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
            >
              <Package className="h-5 w-5" />
              Products
            </Link>
            <Link
              to="#"
              className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
            >
              <Users className="h-5 w-5" />
              Customers
            </Link>
            <Link
              to="#"
              className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
            >
              <LineChart className="h-5 w-5" />
              Analytics
            </Link>
          </nav>
          <div className="mt-auto">
            <Card>
              <CardHeader>
                <CardTitle>Upgrade to Pro</CardTitle>
                <CardDescription>
                  Unlock all features and get unlimited access to our support
                  team.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button size="sm" className="w-full">
                  Upgrade
                </Button>
              </CardContent>
            </Card>
          </div>
        </SheetContent>
      </Sheet>
      <div className="w-full flex-1">
        <form>
          {" "}
          <div className="sticky top-0 z-10 flex h-[60px] items-center border-b border-gray-300 px-4 lg:px-6 bg-white ">
            <Link
              to="/"
              className="flex items-center gap-2 font-bold text-black text-xl "
            >
              <Package className="h-6 w-6" />
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
              </span>      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="icon" className="rounded-full">
            <img src={anh} alt="" className="w-[30px] h-[30px] rounded-full" />
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
