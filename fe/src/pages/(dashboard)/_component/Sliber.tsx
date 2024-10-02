import React from 'react';
import { Button, Layout, Menu, MenuProps } from 'antd';
import { Home, Package, ShoppingCart, Users, CheckCircle, AlignJustify, LineChart } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const { Sider } = Layout;
const { SubMenu } = Menu;

type MenuItem = Required<MenuProps>['items'][number] & { path?: string };

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  path?: string,
  children?: MenuItem[],
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    path,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem('Trang chủ', '1', <Home />, '/admin/dashboard'),
  getItem('Sản phẩm', 'sub1', <Package />, '', [
    getItem('Danh sách sản phẩm', '2', null, '/admin/products/list'),
    getItem('Biến thể', '3', null, '/admin/products/bienthe'),
    getItem('Quản lý nhãn dán', '4', null, '/admin/products/tags'),
  ]),
  getItem('Danh mục', 'sub2', <Package />, '', [
    getItem('Danh mục sản phẩm', '5', null, '/admin/categories'),
    getItem('Danh mục tin tức', '6', null, '/admin/newcategory'),
  ]),
  getItem('Đơn hàng', 'sub3', <Package />, '', [
    getItem('Tổng quan', '7', null, '/admin/orders/transport'),
    getItem('Danh sách đơn hàng', '8', null, '/admin/orders/list'),
    getItem('Vận chuyển', '9', null, '/admin/orders/uncomfirmedorder'),
    getItem('Thu hộ', '19', null, '/admin/orders/collect'),
  ]),
  getItem('Khuyến mãi', '10', <Package />, '/admin/vouchers'),
  getItem('Tài khoản', 'sub4', <Package />, '', [
    getItem('Khách hàng', '11', null, '/admin/users/khachhang'),
    getItem('Nhân viên', '12', null, '/admin/users/nhanvien'),
    getItem('Hạng thành viên', '13', null, '/admin/users/rank'),
  ]),
  getItem('Đánh giá', '14', <CheckCircle />, '/admin/evaluates'),
  getItem('Phân quyền', '15', <CheckCircle />, '/admin/ADmin/userprivileges'),
  getItem('Nội dung', 'sub5', <AlignJustify />, '', [
    getItem('Footer', '16', null, '/admin/Content/qlfooter'),
    getItem('Banner', '17', null, '/admin/Content/qlbanner'),
  ]),
  getItem('Thống kê', '18', <LineChart />, '/admin/analytics'),
];

const SiderComponent: React.FC = () => {
  const navigate = useNavigate();

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    const key = e.key;
    const item = items.find(item => item.key === key);
    if (item && item.path) {
      navigate(item.path);
    }
  };

  return (
    <Layout className="min-h-screen flex">
      <Sider
        width={320}
        className="bg-white text-black border-r border-gray-300"
        style={{ position: 'relative', overflow: 'auto' }}
      >
        {/* Sticky logo section */}
        <div className="sticky top-0 z-10 flex h-14 items-center border-b border-gray-300 px-4 lg:px-6 bg-white">
          <Link to="/" className="flex items-center gap-2 font-semibold text-black">
            <Package className="h-6 w-6" />
            <span>GLOW</span>
          </Link>
          <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
            <span className="sr-only">Toggle notifications</span>
          </Button>
        </div>

        {/* Menu items */}
        <Menu
          defaultSelectedKeys={['1']}
          mode="inline"
          onClick={handleMenuClick}
          className="bg-white text-black"
        >
          {items.map(item =>
            item.children ? (
              <SubMenu key={item.key} icon={item.icon} title={item.label}>
                {item.children.map(child =>
                  <Menu.Item key={child.key} icon={child.icon}>
                    <Link to={child.path}>{child.label}</Link>
                  </Menu.Item>
                )}
              </SubMenu>
            ) : (
              <Menu.Item key={item.key} icon={item.icon}>
                <Link to={item.path}>{item.label}</Link>
              </Menu.Item>
            )
          )}
        </Menu>

      </Sider>
    </Layout>
  );
};

export default SiderComponent;
