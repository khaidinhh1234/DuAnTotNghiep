import { useLocalStorage } from "@/components/hook/useStoratge";
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
  User,
} from "lucide-react";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const { Sider } = Layout;
const { SubMenu } = Menu;

const SiderComponent: React.FC = () => {
  const navigate = useNavigate();

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key);
  };
  const [user] = useLocalStorage("user" as any, {});
  const quyen = user.quyen;
  // console.log(quyen);
  // console.log(user);
  const vaitro =
    user?.user?.vai_tros?.map((item: any) => item.ten_vai_tro) || [];
  // console.log(vaitro);
  useEffect(() => {
    if (vaitro.includes("Người giao hàng")) {
      navigate("/admin/orders/uncomfirmedorder");
    }
  }, [quyen]);
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
          {vaitro?.includes("Người giao hàng") ? null : (
            <SubMenu key="sub1" icon={<Package />} title="Thống kê">
              <Menu.Item key="/admin/dashboard/list">Tổng quan</Menu.Item>
              <Menu.Item key="/admin/dashboard/doanhthu">Doanh thu</Menu.Item>
              <Menu.Item key="/admin/dashboard/sanpham">Sản phẩm</Menu.Item>
              <Menu.Item key="/admin/dashboard/taikhoan">Tài khoản</Menu.Item>
            </SubMenu>
          )}
          {(quyen?.includes("admin.sanpham.index") ||
            (quyen?.includes("admin.bienthekichthuoc.index") && quyen?.includes("admin.bienthemausac.index"))||
            quyen?.includes("admin.bosuutap.index")) && (
            <SubMenu key="sub2" icon={<Package />} title="Sản phẩm">
              {quyen?.includes("admin.sanpham.index") && (
                <Menu.Item key="/admin/products/list">
                  Danh sách sản phẩm
                </Menu.Item>
              )}
              {(quyen?.includes("admin.bienthekichthuoc.index") && quyen?.includes("admin.bienthemausac.index") ) && (
                <Menu.Item key="/admin/products/bienthe">Biến thể</Menu.Item>
              )}
              {quyen?.includes("admin.bosuutap.index") && (
                <Menu.Item key="/admin/products/tags">
                  Bộ sưu tập
                </Menu.Item>
              )}
            </SubMenu>
          )}

          {(quyen?.includes("admin.danhmuctintuc.index") ||
            quyen?.includes("admin.danhmuc.index")) && (
            <SubMenu key="sub3" icon={<Folder />} title="Danh mục">
              {quyen?.includes("admin.danhmuc.index") && (
                <Menu.Item key="/admin/categories">Danh mục sản phẩm</Menu.Item>
              )}
              {quyen?.includes("admin.danhmuctintuc.index") && (
                <Menu.Item key="/admin/newcategory">Danh mục tin tức</Menu.Item>
              )}{" "}
            </SubMenu>
          )}

          {quyen?.includes("admin.donhang.index") && (
            <SubMenu key="sub4" icon={<ShoppingCart />} title="Đơn hàng">
              <Menu.Item key="/admin/orders/transport">Tổng quan</Menu.Item>

              {quyen.includes("admin.donhang.index") && (
                <Menu.Item key="/admin/orders/list">
                  Danh sách đơn hàng
                </Menu.Item>
              )}
              {quyen.includes("admin.vanchuyen.index") && (
                <Menu.Item key="/admin/orders/uncomfirmedorder">
                  Vận chuyển
                </Menu.Item>
              )}
            </SubMenu>
          )}

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
          {(quyen?.includes("admin.chuongtrinhuudai.index") ||
            quyen?.includes("admin.makhuyenmai.index")) && (
            <SubMenu key="sub6" icon={<Tag />} title="Khuyến mại & Ưu đãi">
              {quyen?.includes("admin.makhuyenmai.index") && (
                <Menu.Item key="/admin/vouchers">Mã khuyến mại</Menu.Item>
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
            <Menu.Item key="/admin/evaluates" icon={<Newspaper />}>
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

          {quyen?.includes("admin.vanchuyen.index") &&
            vaitro?.includes("Người giao hàng") && (
              <Menu.Item key="/admin/orders/uncomfirmedorder">
                Vận chuyển
              </Menu.Item>
            )}
        </Menu>
      </Sider>
    </Layout>
  );
};

export default SiderComponent;
