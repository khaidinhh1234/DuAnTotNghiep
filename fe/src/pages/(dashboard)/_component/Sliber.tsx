import { Layout, Menu } from "antd";
import {
  AlignJustify,
  BarChart,
  Folder,
  Home,
  Lock,
  Newspaper,
  Package,
  ShoppingCart,
  Tag,
  User,
} from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

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
        >

          <Menu.Item key="/admin/dashboard" icon={<Home />} >
            Trang chủ
          </Menu.Item>
          <SubMenu key="sub2" icon={<Package />} title="Sản phẩm" >
            <Menu.Item key="/admin/products/list">Danh sách sản phẩm</Menu.Item>
            <Menu.Item key="/admin/products/bienthe">Biến thể</Menu.Item>
            <Menu.Item key="/admin/products/tags">Quản lý nhãn dán</Menu.Item>
          </SubMenu>

          <SubMenu key="sub1" icon={<Folder />} title="Danh mục" >
            <Menu.Item key="/admin/categories">Danh mục sản phẩm</Menu.Item>
            <Menu.Item key="/admin/newcategory">Danh mục tin tức</Menu.Item>
          </SubMenu>


          <SubMenu key="sub3" icon={<ShoppingCart />} title="Đơn hàng" >
            <Menu.Item key="/admin/orders/transport">Tổng quan</Menu.Item>
            <Menu.Item key="/admin/orders/list">Danh sách đơn hàng</Menu.Item>
            <Menu.Item key="/admin/orders/uncomfirmedorder">Vận chuyển</Menu.Item>
          </SubMenu>

          <SubMenu key="sub4" icon={<User />} title="Tài khoản" >
            <Menu.Item key="/admin/users/khachhang">Khách hàng</Menu.Item>
            <Menu.Item key="/admin/users/nhanvien">Nhân viên</Menu.Item>
            <Menu.Item key="/admin/users/rank">Hạng thành viên</Menu.Item>
          </SubMenu>

          <Menu.Item key="/admin/vouchers" icon={<Tag />} >
            Mã khuyến mại
          </Menu.Item>

          <Menu.Item key="/admin/news" icon={<Newspaper />} >
            Tin tức
          </Menu.Item>

          <Menu.Item key="/admin/ADmin/userprivileges" icon={<Lock />} >
            Phân quyền
          </Menu.Item>

          <SubMenu key="sub5" icon={<AlignJustify />} title="Nội dung" >
            <Menu.Item key="/admin/Content/qlfooter">Footer</Menu.Item>
            <Menu.Item key="/admin/Content/qlbanner">Banner</Menu.Item>
          </SubMenu>

          <Menu.Item key="/admin/analytics" icon={<BarChart />}>
            Thống kê
          </Menu.Item>
        </Menu>
      </Sider>
    </Layout>
  );
};

export default SiderComponent;
