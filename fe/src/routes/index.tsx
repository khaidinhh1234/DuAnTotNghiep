import ScrollToTop from "@/assets/js/scrolltotop";
import ChangePassword from "@/pages/(auth)/ChangePassword/changepassword";
import OTPPage from "@/pages/(auth)/EnterOTP/EntOtp";
import ErrorAuth from "@/pages/(auth)/ErrorAuth/changepassword";
import ForgotPassword from "@/pages/(auth)/ForgotPassword/ForgotPassword";
import Login from "@/pages/(auth)/login/login";
import LoginSuccessfull from "@/pages/(auth)/LoginSuccessfull/LoginSuccessfull";
import Register from "@/pages/(auth)/register/register";
import PageAddAdmin from "@/pages/(dashboard)/admin/addAdmin/page";
import PagePrivilegeAdmin from "@/pages/(dashboard)/admin/page";
import { AnalyticsAdmin } from "@/pages/(dashboard)/analytics/page";
import Color from "@/pages/(dashboard)/bienthe/color";
import Remotecolor from "@/pages/(dashboard)/bienthe/remote";
import Remotesize from "@/pages/(dashboard)/bienthe/remotesize";
import Size from "@/pages/(dashboard)/bienthe/size";
import CategoriesAdd from "@/pages/(dashboard)/categories/add/page";
import CategoriesEdit from "@/pages/(dashboard)/categories/edit/page";
import CategoriesAdmin from "@/pages/(dashboard)/categories/page";
import CategoriesRemote from "@/pages/(dashboard)/categories/remote/page";
import CentralStock from "@/pages/(dashboard)/centralstock.tsx/page";
import BannerManagement from "@/pages/(dashboard)/content/banner/banner";
import Content from "@/pages/(dashboard)/content/footer/footer";

import EvaluateAdmin from "@/pages/(dashboard)/evaluate/page";
import { LayoutAdmin } from "@/pages/(dashboard)/layout";
import NewEdit from "@/pages/(dashboard)/news/edit/NewEdit";
import PageNew from "@/pages/(dashboard)/news/pagenew";
import RemoteNew from "@/pages/(dashboard)/news/remote/RemoteNew";
import ViewNew from "@/pages/(dashboard)/news/view/ViewNew";
import NewCategoriesAdd from "@/pages/(dashboard)/newscategory/add/page";
import NewCategoriesEdit from "@/pages/(dashboard)/newscategory/edit/page";
import NewCategory from "@/pages/(dashboard)/newscategory/page";
import NewCategoriesRemote from "@/pages/(dashboard)/newscategory/remove/page";
import OrderAdmin from "@/pages/(dashboard)/order/page";
import ProductsAdd from "@/pages/(dashboard)/products/add/page";
import ProductsEdit from "@/pages/(dashboard)/products/edit/page";
import ProductsAdmin from "@/pages/(dashboard)/products/page";
import ProductsRemote from "@/pages/(dashboard)/products/remote/page";
import RevenueAdmin from "@/pages/(dashboard)/revenue/page";
import Suportuser from "@/pages/(dashboard)/suportuser/suportuser";
import Tagsadd from "@/pages/(dashboard)/tags/add/add";
import Tagsedit from "@/pages/(dashboard)/tags/edit/edit";
import TagsRemoteAdmin from "@/pages/(dashboard)/tags/remove/remove";
import Tags from "@/pages/(dashboard)/tags/tags";
import MemberRankForm from "@/pages/(dashboard)/user/hangthanhvien/add/page";
import MemberRank from "@/pages/(dashboard)/user/hangthanhvien/edit/page";
import Rank from "@/pages/(dashboard)/user/hangthanhvien/page";
import Remoterank from "@/pages/(dashboard)/user/hangthanhvien/remote.tsx/remote";
import UserskhachhangAdd from "@/pages/(dashboard)/user/khachhang/add/page";
import UserskhachhangEdit from "@/pages/(dashboard)/user/khachhang/edit/page";
import UsersAdminkhachhang from "@/pages/(dashboard)/user/khachhang/page";
import UserskhachangRemote from "@/pages/(dashboard)/user/khachhang/remote/page";
import UsersNhanvienAdd from "@/pages/(dashboard)/user/nhanvien/add/page";
import UsersnhanvienEdit from "@/pages/(dashboard)/user/nhanvien/edit/page";
import UsersAdminNhanvien from "@/pages/(dashboard)/user/nhanvien/page";
import UsersRemoteNhanvien from "@/pages/(dashboard)/user/nhanvien/remote/page";
import PageAddPermission from "@/pages/(dashboard)/userprivileges/addpermission/page";
import PageEditPermission from "@/pages/(dashboard)/userprivileges/edit/page";
import UserPrivilegeAdmin from "@/pages/(dashboard)/userprivileges/page";
import Showvaitro from "@/pages/(dashboard)/userprivileges/show/page";
import AddVoucher from "@/pages/(dashboard)/vourcher/add/add";
import EditVoucher from "@/pages/(dashboard)/vourcher/edit/edit";
import VoucherAdmin from "@/pages/(dashboard)/vourcher/page";
import ShowVoucher from "@/pages/(dashboard)/vourcher/show/show";
import NotFoundPage from "@/pages/(website)/404/page";
import Cart from "@/pages/(website)/cart/Cart";
import Contact from "@/pages/(website)/contact/Contact";
import HomePage from "@/pages/(website)/home/page";
import LayoutWebsite from "@/pages/(website)/layout";
import ManageAddresses from "@/pages/(website)/manageaddresses/ManageAddresses";
import Minicard from "@/pages/(website)/MInicard/Minicard";
import MyOrder from "@/pages/(website)/myOrder/Myorder";
import MyProfile from "@/pages/(website)/myprofile/MyProfile";
import MyWishlists from "@/pages/(website)/mywishlists/MyWishlists";
import Notification from "@/pages/(website)/notifications/Notification";
import OrderPlaceSuccess from "@/pages/(website)/OrderPlaceSuccessfully/OrderPlaceSuccessfully";
import Ordersummary from "@/pages/(website)/ordersummary/ordersummary";
import Payment from "@/pages/(website)/payment/PayMent";
import PageProductDetail from "@/pages/(website)/productdetail/PageProductDetail";
import SavedCard from "@/pages/(website)/savedcards/SavedCard";
import Setting from "@/pages/(website)/settings/Setting";
import ShippingAddressPage from "@/pages/(website)/ShipingAdrres/ShipingAdrres";
import SheetSide from "@/pages/(website)/test";
import Voucher from "@/pages/(website)/vourcher/page";
import { Navigate } from "react-router";
import { Route, Routes } from "react-router-dom";
import Bienthe from "../pages/(dashboard)/bienthe/bienthe";
import PageOur from "../pages/(website)/ourstory/pageOur";
import Page from "./../pages/(website)/shop/shop";

import NewAdd from "@/pages/(dashboard)/news/add/NewAdd";
import PageTransport from "@/pages/(dashboard)/transport/page";
import TableUncomfirmedOrder from "@/pages/(dashboard)/transport/unconfirmedorder/table";
// import Detail from "@/pages/(dashboard)/products/detail/page";
import SanPham from "@/pages/(dashboard)/dashboard/sanpham/page";
import TaiKhoan from "@/pages/(dashboard)/dashboard/taikhoan/page";
import PageSupport from "@/pages/(dashboard)/support/page";
import Collect from "@/pages/(dashboard)/transport/collect/Collect";
import { default as ShowNhanvien, default as ShowUser } from "@/pages/(dashboard)/user/khachhang/show/showUser";
// import Productsadd from "@/pages/(dashboard)/products/fix";

import AddProducts from "@/pages/(dashboard)/products/Addd/page";

import Test from "@/pages/(dashboard)/test";
import PrivateRoute from "./PrivateRoute";
// import List from "@/pages/(dashboard)/dashboard/test/page";

import Feedback from "@/pages/(dashboard)/support/feedback/Feedback";
import ChuongTrinhUuDai from "@/pages/(dashboard)/vourcher/banner/page";
import ChuongTrinhUuDaiAdd from "@/pages/(dashboard)/vourcher/banner/add";
// import ChuongTrinhUuDaiEdit from "@/pages/(dashboard)/vourcher/banner/edit";
// import PrivateRoute from "./PrivateRoute";


// import Dashboard from "@/pages/(dashboard)/dashboard/tongquan/page";


// import Test from "@/pages/(dashboard)/test";
// import showVoucher from "./../pages/(dashboard)/vourcher/show";
import { List } from "./../pages/(dashboard)/dashboard/list/page";
import EditProducts from "@/pages/(dashboard)/products/Editt/page";

import { ActionLog } from "@/pages/(dashboard)/ActionLog/page";
import Dashboard from "./../pages/(dashboard)/dashboard/tongquan/page";

import AdminProfile from "@/pages/(dashboard)/adminProfile/admin-profile/AdminProfile";


const Router = () => {
  //

  return (
    <>
      {" "}
      <ScrollToTop />
      <Routes>
        {/* TRang USER */}
        <Route path="/" element={<LayoutWebsite />}>
          <Route index element={<HomePage />} />
          <Route path="/shop" element={<Page />} />
          <Route path="/product-detail" element={<PageProductDetail />} />
          <Route path="/ourstory" element={<PageOur />} />
          <Route path="/myprofile" element={<MyProfile />} />
          <Route path="/mywishlist" element={<MyWishlists />} />
          <Route path="/manageaddresses" element={<ManageAddresses />} />
          <Route path="/notification" element={<Notification />} />
          <Route path="/savedcard" element={<SavedCard />} />
          <Route path="/setting" element={<Setting />} />
          <Route path="/orderPlaceSuccess" element={<OrderPlaceSuccess />} />
          <Route path="/minicard" element={<Minicard />} />
          <Route path="/voucher" element={<Voucher />} />
          <Route path="/myorder" element={<MyOrder />} />
          <Route path="/ordersummary" element={<Ordersummary />} />
          <Route
            path="/ShippingAddressPage"
            element={<ShippingAddressPage />}
          />
          <Route path="/payment" element={<Payment />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/gio-hang" element={<Cart />} />{" "}
          <Route path="/test" element={<SheetSide />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
        {/* TRang admin */}
        <Route
          path="admin"
          element={

            // <PrivateRoute>
              <LayoutAdmin />
            /* </PrivateRoute> */
          }
        >
          <Route index element={<Navigate to="/admin/dashboard/list" />} />
          <Route path="dashboard/list" element={<Dashboard />} />
          <Route path="dashboard/doanhthu" element={<List />} />
          <Route path="dashboard/sanpham" element={<SanPham />} />
          <Route path="dashboard/taikhoan" element={<TaiKhoan />} />
          {/* Sản phẩm  */}
          <Route
            path="products"
            element={<Navigate to="/admin/products/list" />}
          />{" "}
          <Route path="products/list" element={<ProductsAdmin />} />
          <Route path="products/add" element={<ProductsAdd />} />
          <Route path="products/addd" element={<AddProducts />} />
          <Route path="products/edit/:id" element={<EditProducts />} />
          {/* <Route path="products/edit/:id" element={<ProductsEdit />} /> */}
          <Route path="products/remote" element={<ProductsRemote />} />
          {/* <Route path="products/adds" element={<Productsadd />} /> */}
          {/* Biến thể */}
          {/* <Route path="products/detaile" element={<Detail item={{
            id: 0
          }} />} /> */}
          {/* Biến thể */}
          <Route path="products/bienthe" element={<Bienthe />} />
          <Route path="products/bienthecolor/edit/:id" element={<Color />} />
          <Route path="products/bienthesize/edit/:id" element={<Size />} />
          <Route path="products/bienthe/remote" element={<Remotecolor />} />
          <Route path="products/bienthe/remotesize" element={<Remotesize />} />
          {/* Tag */}
          <Route path="products/tags" element={<Tags />} />
          <Route path="products/tags/add" element={<Tagsadd />} />
          <Route path="products/tags/edit/:id" element={<Tagsedit />} />
          <Route path="products/tags/remote" element={<TagsRemoteAdmin />} />
          {/* danh mục */}
          <Route path="categories" element={<CategoriesAdmin />} />
          <Route path="categories/add" element={<CategoriesAdd />} />
          <Route path="categories/edit/:id" element={<CategoriesEdit />} />
          <Route path="categories/remote" element={<CategoriesRemote />} />{" "}
          {/* danh mục tin tức */}
          <Route path="newcategory" element={<NewCategory />} />
          <Route path="newcategory/add" element={<NewCategoriesAdd />} />
          <Route path="newcategory/edit/:id" element={<NewCategoriesEdit />} />
          <Route path="newcategory/remote" element={<NewCategoriesRemote />} />
          {/* đơn hàng */}
          <Route
            path="orders"
            element={<Navigate to="/admin/orders/transport" />}
          />
          <Route path="orders/list" element={<OrderAdmin />} />
          <Route path="orders/transport" element={<PageTransport />} />
          <Route
            path="orders/uncomfirmedorder"
            element={<TableUncomfirmedOrder />}
          />
          <Route path="orders/collect" element={<Collect />} />
          {/* khuyến mãi */}
          <Route path="vouchers" element={<VoucherAdmin />} />{" "}
          <Route path="add-vocher" element={<AddVoucher />} />
          <Route path="vouchers/show/:id" element={<ShowVoucher />} />
          <Route path="vouchers/edit/:id" element={<EditVoucher />} />
                    {/* trương trình ưu đâix */}
                    <Route path="chuongtrinhuudai" element={<ChuongTrinhUuDai />} />
                    <Route path="chuongtrinhuudaiadd" element={<ChuongTrinhUuDaiAdd />} />
                    {/* <Route path="chuongtrinhuudaiedit" element={<ChuongTrinhUuDaiEdit />} /> */}



          {/* Tài khoản khách hàng */}
          <Route
            path="users"
            element={<Navigate to="/admin/users/khachhang" />}
          />{" "}
          <Route path="users/khachhang" element={<UsersAdminkhachhang />} />
          <Route path="users/khachhang/add" element={<UserskhachhangAdd />} />
          <Route
            path="users/khachhang/edit/:id"
            element={<UserskhachhangEdit />}
          />
          <Route
            path="users/khachhang/remote"
            element={<UserskhachangRemote />}
          />{" "}
          <Route path="users/khachhang/show/:id" element={<ShowUser />} />
          {/* tài khoản Nhân viên */}
          <Route path="users/nhanvien" element={<UsersAdminNhanvien />} />
          <Route path="users/nhanvien/add" element={<UsersNhanvienAdd />} />
          <Route
            path="users/nhanvien/edit/:id"
            element={<UsersnhanvienEdit />}
          />
          <Route path="users/nhanvien/show/:id" element={<ShowNhanvien />} />
          <Route
            path="users/nhanvien/remote"
            element={<UsersRemoteNhanvien />}
          />
          {/* Hạng thành viên */}
          <Route path="users/rank" element={<Rank />} />
          <Route path="users/rankadd" element={<MemberRankForm />} />
          <Route path="users/remoterank" element={<Remoterank />} />
          <Route path="users/rank/edit/:id" element={<MemberRank />} />
          {/* Đánh giá */}
          <Route path="evaluates" element={<EvaluateAdmin />} />
          {/* liên hệ */}
          <Route path="support" element={<PageSupport />} />
          <Route path="support/feedback" element={<Feedback />} />
          {/* Tin tức */}
          <Route path="news" element={<PageNew />} />
          <Route path="news/add" element={<NewAdd />} />
          <Route path="news/edit/:id" element={<NewEdit />} />
          <Route path="news/remote" element={<RemoteNew />} />
          <Route path="news/details/:id" element={<ViewNew />} />
          {/* Thống kê */}
          <Route path="analytics" element={<AnalyticsAdmin />} />
          <Route path="centralstocks" element={<CentralStock />} />
          <Route path="suportuser" element={<Suportuser />} />
          <Route path="revenues" element={<RevenueAdmin />} />
          <Route path="test" element={<Test />} />
          <Route path="list" element={<List />} />
          <Route
            path="ADmin"
            element={<Navigate to="/admin/ADmin/privilegeadmin" />}
          />
          {/* vận chuyển */}
          <Route path="transport" element={<PageTransport />} />
          <Route
            path="transport/uncomfirmedorder"
            element={<TableUncomfirmedOrder />}
          />
          //vai trò
          {/* //vai trò */}
          <Route
            path="ADmin/userprivileges"
            element={<UserPrivilegeAdmin />}
          />{" "}
          <Route
            path="ADmin/userprivileges/add-permission"
            element={<PageAddPermission />}
          />
          <Route
            path="ADmin/userprivileges/show/:id"
            element={<Showvaitro />}
          />
          <Route
            path="ADmin/userprivileges/edit-permission/:id"
            element={<PageEditPermission />}
          />
          {/* Profile admin */}
          <Route path="admin-profile" element={<AdminProfile/>}/>
          {/* Nội dung */}
          <Route
            path="Content"
            element={<Navigate to="/admin/Content/qlfooter" />}
          />
          <Route path="Content/qlfooter" element={<Content />} />
          <Route path="Content/qlbanner" element={<BannerManagement />} />
          {/* Lịch sử thao tác */}
          <Route path="history" element={<ActionLog />} />
          {/* Error */}
          <Route path="*" element={<NotFoundPage />} />
          {/* Chưa dùng đến */}
          <Route path="ADmin/privilegeadmin" element={<PagePrivilegeAdmin />} />
          <Route path="add-admin" element={<PageAddAdmin />} />
        </Route>{" "}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/EnterOtp" element={<OTPPage />} />
        <Route path="/error" element={<ErrorAuth />} />
        <Route path="/changePassword" element={<ChangePassword />} />
        <Route path="/loginSuccessfull" element={<LoginSuccessfull />} />{" "}
      </Routes>
    </>
  );
};

export default Router;
