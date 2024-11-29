import { useLocalStorage } from "@/components/hook/useStoratge";
import { DollarOutlined } from "@ant-design/icons";
import { Layout, Menu } from "antd";
import {
  AlignJustify,
  Folder,
  Lock,
  Mail,
  Newspaper,
  Package,
  ShoppingCart,
  Tag,
  BarChart2,
  Truck,
  User,
  MessageCircleDashed,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const { Sider } = Layout;
const { SubMenu } = Menu;

const SiderComponent: React.FC = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false); // State for handling collapse
  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key); // Navigates to the selected route
  };

  const [user] = useLocalStorage("user" as any, {}); // Gets user data from localStorage
  const quyen = user.quyen; // User's permissions
  const vaitro =
    user?.user?.vai_tros?.map((item: any) => item.ten_vai_tro) || []; // User's roles

  useEffect(() => {
    if (vaitro.includes("Người giao hàng")) {
      navigate("/admin/orders/uncomfirmedorder"); // Redirect to unconfirmed orders if the role is "Người giao hàng"
    }
  }, [quyen]);

  return (
    <>
      {/* <Sider
        width={320}
        className="bg-white text-white overflow-y-auto h-[900px]"
        style={{ position: "relative" }}
        collapsible
        collapsed={collapsed} // State for collapse
        onCollapse={setCollapsed} // Toggle collapse state
        breakpoint="lg" // Sidebar will collapse on screens smaller than "lg"
      > */}
      <Menu
        mode="inline"
        defaultSelectedKeys={["/admin/dashboard"]}
        onClick={handleMenuClick}
        className="text-white py-5 font-semibold text-base space-y-4"
      >
        {/* Thống kê (Statistics) Menu */}
        {vaitro?.includes("Người giao hàng") ? null : (
          <SubMenu key="sub1" icon={<BarChart2 />} title="Thống kê">
            <Menu.Item key="/admin/dashboard/list">Tổng quan</Menu.Item>
            <Menu.Item key="/admin/dashboard/doanhthu">Doanh thu</Menu.Item>
            <Menu.Item key="/admin/dashboard/sanpham">Sản phẩm</Menu.Item>
            <Menu.Item key="/admin/dashboard/taikhoan">Khách hàng</Menu.Item>
          </SubMenu>
        )}

        {/* Sản phẩm (Products) Menu */}
        {(quyen?.includes("admin.sanpham.index") ||
          (quyen?.includes("admin.bienthekichthuoc.index") &&
            quyen?.includes("admin.bienthemausac.index")) ||
          quyen?.includes("admin.bosuutap.index")) && (
          <SubMenu key="sub2" icon={<Package />} title="Sản phẩm">
            {quyen?.includes("admin.sanpham.index") && (
              <Menu.Item key="/admin/products/list">
                Danh sách sản phẩm
              </Menu.Item>
            )}
            {quyen?.includes("admin.bienthekichthuoc.index") &&
              quyen?.includes("admin.bienthemausac.index") && (
                <Menu.Item key="/admin/products/bienthe">Biến thể</Menu.Item>
              )}
            {quyen?.includes("admin.bosuutap.index") && (
              <Menu.Item key="/admin/products/tags">Bộ sưu tập</Menu.Item>
            )}
          </SubMenu>
        )}

        {/* Danh mục (Categories) Menu */}
        {(quyen?.includes("admin.danhmuctintuc.index") ||
          quyen?.includes("admin.danhmuc.index")) && (
          <SubMenu key="sub3" icon={<Folder />} title="Danh mục">
            {quyen?.includes("admin.danhmuc.index") && (
              <Menu.Item key="/admin/categories">Danh mục sản phẩm</Menu.Item>
            )}
            {quyen?.includes("admin.danhmuctintuc.index") && (
              <Menu.Item key="/admin/newcategory">Danh mục tin tức</Menu.Item>
            )}
          </SubMenu>
        )}

        {/* Đơn hàng (Orders) Menu */}
        {quyen?.includes("admin.donhang.index") && (
          <SubMenu key="sub4" icon={<ShoppingCart />} title="Đơn hàng">
            <Menu.Item key="/admin/orders/transport">Tổng quan</Menu.Item>
            {quyen.includes("admin.donhang.index") && (
              <Menu.Item key="/admin/orders/list">Danh sách đơn hàng</Menu.Item>
            )}
            {quyen.includes("admin.donhang.hoanhang") && (
              <Menu.Item key="/admin/orders/donhoan">
                Danh sách đơn hoàn
              </Menu.Item>
            )}
            {quyen.includes("admin.vanchuyen.index") && (
              <SubMenu icon={<Truck />} key="van-chuyen" title="Vận chuyển">
                <Menu.Item key="/admin/orders/uncomfirmedorder">
                  Đơn hàng
                </Menu.Item>
                <Menu.Item key="/admin/orders/hoanhang">Đơn hoàn</Menu.Item>
              </SubMenu>
            )}
          </SubMenu>
        )}

        {/* Other Menus */}
        {quyen?.includes("admin.rut-tien.xacnhan") && (
          <Menu.Item
            key="/admin/orders/ruttien"
            icon={<DollarOutlined style={{ fontSize: "24px" }} />}
          >
            Rút tiền
          </Menu.Item>
        )}

        {/* Tài khoản (Account) Menu */}
        {(quyen?.includes("admin.taikhoan.index") ||
          quyen?.includes("admin.hangthanhvien.index")) && (
          <SubMenu key="sub5" icon={<User />} title="Tài khoản">
            <Menu.Item key="/admin/users/khachhang">Khách hàng</Menu.Item>
            {quyen?.includes("admin.taikhoan.index") &&
              vaitro.includes("Quản trị viên") && (
                <Menu.Item key="/admin/users/nhanvien">Nhân viên</Menu.Item>
              )}
            {quyen?.includes("admin.hangthanhvien.index") && (
              <Menu.Item key="/admin/users/rank">Hạng thành viên</Menu.Item>
            )}
          </SubMenu>
        )}

        {/* Other Menus */}
        {quyen?.includes("admin.chuongtrinhuudai.index") && (
          <SubMenu key="sub6" icon={<Tag />} title="Khuyến mãi & Ưu đãi">
            {quyen?.includes("admin.makhuyenmai.index") && (
              <Menu.Item key="/admin/vouchers">Mã khuyến mãi</Menu.Item>
            )}
            {quyen?.includes("admin.chuongtrinhuudai.index") && (
              <Menu.Item key="/admin/chuongtrinhuudai">
                Chương trình ưu đãi
              </Menu.Item>
            )}
          </SubMenu>
        )}
        {quyen?.includes("admin.tintuc.index") && (
          <Menu.Item key="/admin/news" icon={<Newspaper />}>
            Tin tức
          </Menu.Item>
        )}
        {quyen?.includes("admin.danhgia.index") && (
          <Menu.Item key="/admin/evaluates" icon={<MessageCircleDashed />}>
            Đánh giá
          </Menu.Item>
        )}
        {quyen?.includes("admin.lienhe.index") && (
          <Menu.Item key="/admin/support" icon={<Mail />}>
            Liên hệ
          </Menu.Item>
        )}
        {quyen?.includes("admin.vaitro.index") && (
          <Menu.Item key="/admin/ADmin/userprivileges" icon={<Lock />}>
            Phân quyền
          </Menu.Item>
        )}
        {quyen?.includes("admin.thongtinweb.index") && (
            <SubMenu key="sub7" icon={<AlignJustify />} title="Nội dung">
              <Menu.Item key="/admin/Content/qlfooter">Footer</Menu.Item>
              <Menu.Item key="/admin/Content/qlbanner">Banner</Menu.Item>
            </SubMenu>
          )}
      </Menu>
      {/* </Sider> */}
    </>
  );
};

export default SiderComponent;
