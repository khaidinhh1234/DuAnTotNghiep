import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DownOutlined, UpOutlined } from "@ant-design/icons";
import {
  AlignJustify,
  Bell,
  CheckCircle,
  Home,
  LineChart,
  Package,
  Package2,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";

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
      { name: "Biến thể", path: "products/bienthe" },
      { name: "Quản lý nhãn dán", path: "products/tags" },
    ],
  },
  {
    name: "Danh mục",
    path: "categories",
    subMenu: [
      { name: "Danh mục sản phẩm", path: "categories" },
      { name: "Danh mục tin tức", path: "newcategory" },
    ],

    icon: Package,
  },
  {
    name: "Đơn hàng",
    path: "/admin/orders",
    icon: Package,
  },
  {
    name: "Khuyến mãi",
    path: "vouchers",
    icon: Package,
  },

  {
    name: "Tài khoản",
    path: "users",
    icon: Users,
    subMenu: [
      { name: "Khách hàng", path: "users/khachhang" },
      { name: "Nhân viên ", path: "users/nhanvien" },
      { name: "Hạng thành viên ", path: "users/rank" },
    ],
  },

  {
    name: "Đánh giá",
    path: "/admin/evaluates",
    icon: CheckCircle,
  },
  {
    name: "Tin tức",
    path: "/admin/news",
    icon: CheckCircle,
  },
  {
    name: "Doanh thu",
    path: "/admin/revenues",
    icon: CheckCircle,
  },
  {
    name: "Vận chuyển",
    path: "/admin/transport",
    icon: CheckCircle,
  },
  {
    name: "Phân quyền",
    icon: CheckCircle,
    path: "ADmin/userprivileges",
    // subMenu: [
    //   { name: "Quản lý admin", path: "ADmin/privilegeadmin" },
    //   { name: "Phân quyền", path: "ADmin/userprivileges" },
    // ],
  },
  {
    name: "Nội dung",
    path: "Content",
    icon: AlignJustify,
    subMenu: [
      { name: "Footer", path: "Content/qlfooter" },
      { name: "Banner", path: "Content/qlbanner" },
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
    <div className=" sticky top-0 border-r bg-muted/40 md:block bg-[#f3f2f2]  py-2">
      <div className="flex max-h-[900px] flex-col gap-2 m-5 rounded-xl border bg-white py-5">
        <div className="flex h-14 items-center border-b px-4  lg:px-6 ">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <Package2 className="h-6 w-6" />
            <span className="">GLOW</span>
          </Link>
        </div>
        <div className="flex-1 mt-3 mb-[100%]">
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
      </div>
    </div>
  );
};

export default SlidebarProduct;
