import {
  Bell,
  Home,
  LineChart,
  Package,
  Package2,
  ShoppingCart,
  Users,
} from "lucide-react";
// import Link from "next/link";
import { Link, NavLink } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
const menu = [
  {
    name: "Trang chủ",
    path: "/admin/dashboard",
    icon: Home,
  },
  {
    name: "Sản phẩm",
    path: "products",
    icon: Package,
  },
  {
    name: " Danh mục",
    path: "categories",
    icon: Package,
  },
  {
    name: "Kho sản phẩm",
    path: "centralstocks",
    icon: Package,
  },
  {
    name: "khuyến mãi",
    path: "vouchers",
    icon: Package,
  },
  {
    name: " Đơn hàng",
    path: "orders",
    icon: ShoppingCart,
  },
  {
    name: " Người dùng",
    path: "users",
    icon: Users,
  },
  {
    name: " Hỗ Trợ khách hàng",
    path: "suportuser",
    icon: Users,
  },
  {
    name: "Thống kê",
    path: "analytics",
    icon: LineChart,
  },
];
const SlibarProduct = () => {
  return (
    <div className="hidden border-r bg-muted/40 md:block bg-[#f3f2f2]">
      <div className="flex h-full max-h-screen flex-col gap-2  m-5 rounded-xl border  bg-white">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <Package2 className="h-6 w-6" />
            <span className="">GLOW</span>
          </Link>
          <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
            <Bell className="h-4 w-4" />
            <span className="sr-only">Toggle notifications</span>
          </Button>
        </div>
        <div className="flex-1 mt-3">
          {menu?.map((item, index) => (
            <nav
              className="grid items-start px-2 text-sm font-medium lg:px-4 "
              key={index}
            >
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  ` my-1 flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary text-base font-bold  ${!isActive ? "text-[#607D8B]" : "bg-black text-white"}`
                }
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </NavLink>
            </nav>
          ))}
        </div>
        <div className="mt-auto p-4">
          <Card x-chunk="dashboard-02-chunk-0">
            <CardHeader className="p-2 pt-0 md:p-4">
              <CardTitle>Upgrade to Pro</CardTitle>
              <CardDescription>
                Unlock all features and get unlimited access to our support
                team.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-2 pt-0 md:p-4 md:pt-0">
              <Button size="sm" className="w-full">
                Upgrade
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SlibarProduct;
