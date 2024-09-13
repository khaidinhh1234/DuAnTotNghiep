import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Bell, Home, Package, ShoppingCart, Users } from "lucide-react";
import { useLocation } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect } from "react";
import { DownOutlined, UpOutlined } from "@ant-design/icons";
import { CheckCircle, LineChart, Package2, AlignJustify } from "lucide-react";

const menu = [
  {
    name: "Trang chủ",
    path: "/admin/dashboard",
    icon: Home,
  },
  {
    name: "Sản phẩm",
    path: "/admin/products",
    icon: Package,
    subMenu: [
      { name: "Danh sách sản phẩm", path: "products/list" },
      { name: "Thêm sản phẩm", path: "products/add" },
    ],
  },
  {
    name: "Danh mục",
    path: "categories",

    icon: Package,
  },
  {
    name: "Kho sản phẩm",
    path: "/admin/centralstocks",
    icon: Package,
  },
  {
    name: "Khuyến mãi",
    path: "vouchers",
    icon: Package,
  },
  {
    name: "Đơn hàng",
    path: "orders",
    icon: ShoppingCart,
  },
  {
    name: "Người dùng",
    path: "users",
    icon: Users,
  },
  {
    name: "Hỗ Trợ khách hàng",
    path: "suportuser",
    icon: Users,
  },
  {
    name: "Đánh giá",
    path: "/admin/evaluates",
    icon: CheckCircle,
  },
  {
    name: "Doanh thu",
    path: "/admin/revenues",
    icon: CheckCircle,
  },
  {
    name: "Admin",
    icon: CheckCircle,
    path: "/admin",
    subMenu: [
      { name: "Quản lý admin", path: "privilegeadmin" },
      { name: "Phân quyền", path: "userprivileges" },
    ],
  },
  {
    name: "Nội dung",
    path: "/admin",
    icon: AlignJustify,
    subMenu: [
      { name: "Footer", path: "/admin/qlfooter" },
      { name: "Banner", path: "/admin/qlbanner" },
    ],
  },
  {
    name: "Thống kê",
    path: "/admin/analytics",
    icon: LineChart,
  },
];

const SlidebarProduct = () => {
  const location = useLocation(); 
  const [openMenu, setOpenMenu] = useState<number | null>(null); 

  useEffect(() => {
    // Duyệt qua menu để xem có submenu nào chứa đường dẫn hiện tại
    menu.forEach((item, index) => {
      if (item.subMenu) {
        const isCurrentSubmenu = item.subMenu.some((subItem) =>
          location.pathname.includes(subItem.path)
        );
        if (isCurrentSubmenu) {
          setOpenMenu(index); 
        }
      }
    });
  }, [location.pathname]);

  const toggleSubMenu = (index: any) => {
    setOpenMenu(openMenu === index ? null : index); 
  };

  return (
    <div className="hidden border-r bg-muted/40 md:block bg-[#f3f2f2]">
      <div className="flex h-full max-h-screen flex-col gap-2 m-5 rounded-xl border bg-white">
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
            <div key={index}>
              <nav
                className="grid items-start px-2 text-sm font-medium lg:px-4"
                onClick={() => toggleSubMenu(index)}
              >
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `my-1 flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary text-base font-bold  ${
                      !isActive ? "text-[#607D8B]" : "bg-black text-white"
                    }`
                  }
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                  {item.subMenu && (
                    <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                      {openMenu === index ? <DownOutlined /> : <UpOutlined />}
                    </Badge>
                  )}
                </NavLink>
                {item.subMenu && openMenu === index && (
                  <div className="ml-6 mt-1">
                    {item.subMenu.map((subItem, subIndex) => (
                      <NavLink
                        to={subItem.path}
                        key={subIndex}
                        className={({ isActive }) =>
                          `my-1 flex items-center gap-3 rounded-lg px-3 py-1 text-muted-foreground transition-all hover:text-primary text-base font-bold  ${
                            isActive ? "bg-black/70 text-white" : "bg-primary"
                          }`
                        }
                      >
                        <item.icon className="h-5 w-5" /> {subItem.name}
                      </NavLink>
                    ))}
                  </div>
                )}
              </nav>
            </div>
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

export default SlidebarProduct;
