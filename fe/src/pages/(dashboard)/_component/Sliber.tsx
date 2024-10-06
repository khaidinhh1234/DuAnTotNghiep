import { Layout, Menu } from "antd";
import {
  Home,
  Folder,
  Package,
  ShoppingCart,
  Tag,
  Newspaper,
  User,
  Lock,
  AlignJustify,
  BarChart,
} from "lucide-react";
import React from "react";
import { Link, useNavigate } from "react-router-dom";

const { Sider } = Layout;
const { SubMenu } = Menu;

const SiderComponent: React.FC = () => {
  const navigate = useNavigate();

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key);
  };

  return (
    <Layout className="min-h-screen flex">
      <Sider
        width={320}
        className="bg-white text-black overflow-y-auto h-[900px]"
        style={{ position: "relative" }}
      >
        <Menu
          mode="inline"
          defaultSelectedKeys={["/admin/dashboard"]}
          onClick={handleMenuClick}
          className="text-black py-5 font-semibold text-base space-y-4"
          // Thêm space-y-2 để tạo khoảng cách giữa các mục
        >
          {/* Trang chủ */}
          <Menu.Item key="/admin/dashboard" icon={<Home />} >
            Trang chủ
          </Menu.Item>

          {/* Danh mục */}
          <SubMenu key="sub1" icon={<Folder />} title="Danh mục" >
            <Menu.Item key="/admin/categories">Danh mục sản phẩm</Menu.Item>
            <Menu.Item key="/admin/newcategory">Danh mục tin tức</Menu.Item>
          </SubMenu>

          {/* Sản phẩm */}
          <SubMenu key="sub2" icon={<Package />} title="Sản phẩm" >
            <Menu.Item key="/admin/products/list">Danh sách sản phẩm</Menu.Item>
            <Menu.Item key="/admin/products/bienthe">Biến thể</Menu.Item>
            <Menu.Item key="/admin/products/tags">Quản lý nhãn dán</Menu.Item>
          </SubMenu>

          {/* Đơn hàng */}
          <SubMenu key="sub3" icon={<ShoppingCart />} title="Đơn hàng" >
            <Menu.Item key="/admin/orders/transport">Tổng quan</Menu.Item>
            <Menu.Item key="/admin/orders/list">Danh sách đơn hàng</Menu.Item>
            <Menu.Item key="/admin/orders/uncomfirmedorder">Vận chuyển</Menu.Item>
          </SubMenu>

          {/* Mã khuyến mại */}
          <Menu.Item key="/admin/vouchers" icon={<Tag />} >
            Mã khuyến mại
          </Menu.Item>

          {/* Tin tức */}
          <Menu.Item key="/admin/news" icon={<Newspaper />} >
            Tin tức
          </Menu.Item>

          {/* Tài khoản */}
          <SubMenu key="sub4" icon={<User />} title="Tài khoản" >
            <Menu.Item key="/admin/users/khachhang">Khách hàng</Menu.Item>
            <Menu.Item key="/admin/users/nhanvien">Nhân viên</Menu.Item>
            <Menu.Item key="/admin/users/rank">Hạng thành viên</Menu.Item>
          </SubMenu>

          {/* Phân quyền */}
          <Menu.Item key="/admin/ADmin/userprivileges" icon={<Lock />} >
            Phân quyền
          </Menu.Item>

          {/* Nội dung */}
          <SubMenu key="sub5" icon={<AlignJustify />} title="Nội dung" >
            <Menu.Item key="/admin/Content/qlfooter">Footer</Menu.Item>
            <Menu.Item key="/admin/Content/qlbanner">Banner</Menu.Item>
          </SubMenu>

          {/* Thống kê */}
          <Menu.Item key="/admin/analytics" icon={<BarChart />}>
            Thống kê
          </Menu.Item>
        </Menu>
      </Sider>
    </Layout>
  );
};

export default SiderComponent;
