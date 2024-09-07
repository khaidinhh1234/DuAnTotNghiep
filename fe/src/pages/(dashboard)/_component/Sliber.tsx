import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import {
  Bell,
  Home,
  Package,
  ShoppingCart,
  Users,
  CheckCircle,
  LineChart,
  Package2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';


const menu = [
  {
    name: 'Trang chủ',
    path: '/admin/dashboard',
    icon: Home,
  },
  {
    name: 'Sản phẩm',
    path: '/admin/products',
    icon: Package,
  },
  {
    name: 'Danh mục',
    path: '/admin/categories',
    icon: Package,
  },
  {
    name: 'Kho sản phẩm',
    path: '/admin/centralstocks',
    icon: Package,
  },
  {
    name: 'Khuyến mãi',
    path: '/admin/vouchers',
    icon: Package,
  },
  {
    name: 'Đơn hàng',
    path: '/admin/orders',
    icon: ShoppingCart,
  },
  {
    name: 'Người dùng',
    path: '/admin/users',
    icon: Users,
  },
  {
    name: 'Đánh giá',
    path: '/admin/evaluates',
    icon: CheckCircle,
  },
  {
    name: 'Doanh thu',
    path: '/admin/revenues',
    icon: CheckCircle,
  },
  {
    name: 'Admin',
    icon: CheckCircle,
    submenu: [
      { name: 'Quản lý admin', path: '/admin/privilegeadmin' },
      { name: 'Phân quyền', path: '/admin/userprivileges' },
    ],
  },
  {
    name: 'Thống kê',
    path: '/admin/analytics',
    icon: LineChart,
  },
];

const SlibarProduct = () => {
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  const toggleSubmenu = (menuName: string) => {
    setOpenSubmenu(prev => (prev === menuName ? null : menuName));
  };
  
  return (
    <div className="hidden border-r bg-muted/40 md:block bg-[#f3f2f2]">
      <div className="flex h-full max-h-screen flex-col gap-2 m-5 rounded-xl border bg-white">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <Package2 className="h-6 w-6" />
            <span>GLOW</span>
          </Link>
          <Button
            variant="outline"
            size="icon"
            className="ml-auto h-8 w-8 borber border-black rounded-[7px]"
          >
            <Bell className="h-4 w-4" />
            <span className="sr-only">Toggle notifications</span>
          </Button>
        </div>
        <div className="flex-1 mt-3">
          {menu.map((item, index) => (
            <div key={index}>
              {item.submenu ? (
                <>
                  <div
                    className={`my-1 flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary text-base font-bold cursor-pointer ${openSubmenu === item.name ? 'bg-black text-white' : 'text-[#607D8B]'}`}
                    onClick={() => toggleSubmenu(item.name)}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </div>
                  {openSubmenu === item.name && (
                    <div className="ml-8">
                      {item.submenu.map((subitem, subindex) => (
                        <NavLink
                          to={subitem.path}
                          key={subindex}
                          className={({ isActive }) =>
                            `block my-1 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary text-base font-medium ${!isActive ? 'text-[#607D8B]' : 'bg-black text-white'}`
                          }
                        >
                          {subitem.name}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `my-1 flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary text-base font-bold ${!isActive ? 'text-[#607D8B]' : 'bg-black text-white'}`
                  }
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </NavLink>
              )}
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

export default SlibarProduct;
