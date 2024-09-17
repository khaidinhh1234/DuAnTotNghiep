import { Dashboard } from "@/pages/(dashboard)/dashboard/page";
import NotFoundPage from "@/pages/(website)/404/page";
import HomePage from "@/pages/(website)/home/page";
import LayoutWebsite from "@/pages/(website)/layout";
import { Route, Routes } from "react-router-dom";
import PageOur from "../pages/(website)/ourstory/pageOur";
import Page from "./../pages/(website)/shop/shop";
import ScrollToTop from "@/assets/js/scrolltotop";
import Contact from "@/pages/(website)/contact/Contact";
import ManageAddresses from "@/pages/(website)/manageaddresses/ManageAddresses";
import Minicard from "@/pages/(website)/MInicard/Minicard";
import MyOrder from "@/pages/(website)/myOrder/Myorder";
import MyProfile from "@/pages/(website)/myprofile/MyProfile";
import MyWishlists from "@/pages/(website)/mywishlists/MyWishlists";
import Notification from "@/pages/(website)/notifications/Notification";
import OrderPlaceSuccess from "@/pages/(website)/OrderPlaceSuccessfully/OrderPlaceSuccessfully";
import Ordersummary from "@/pages/(website)/ordersummary/ordersummary";
import Payment from "@/pages/(website)/payment/PayMent";
import SavedCard from "@/pages/(website)/savedcards/SavedCard";
import Setting from "@/pages/(website)/settings/Setting";
import ShippingAddressPage from "@/pages/(website)/ShipingAdrres/ShipingAdrres";
import PageProductDetail from "@/pages/(website)/productdetail/PageProductDetail";
import Voucher from "@/pages/(website)/vourcher/page";
import ProductsAdmin from "@/pages/(dashboard)/products/page";
import AnalyticsAdmin from "@/pages/(dashboard)/analytics/page";
import CentralStock from "@/pages/(dashboard)/centralstock.tsx/page";
import OrderAdmin from "@/pages/(dashboard)/order/page";
import VoucherAdmin from "@/pages/(dashboard)/vourcher/page";
import Suportuser from "@/pages/(dashboard)/suportuser/suportuser";
import CategoriesAdd from "@/pages/(dashboard)/categories/add/page";
import CategoriesEdit from "@/pages/(dashboard)/categories/edit/page";
import CategoriesAdmin from "@/pages/(dashboard)/categories/page";
import CategoriesRemote from "@/pages/(dashboard)/categories/remote/page";
import ProductsAdd from "@/pages/(dashboard)/products/add/page";
import ProductsEdit from "@/pages/(dashboard)/products/edit/page";
import ProductsRemote from "@/pages/(dashboard)/products/remote/page";
import { Navigate } from "react-router";
import OTPPage from "@/pages/(auth)/EnterOTP/EntOtp";
import ForgotPassword from "@/pages/(auth)/ForgotPassword/ForgotPassword";
import Login from "@/pages/(auth)/login/login";
import LoginSuccessfull from "@/pages/(auth)/LoginSuccessfull/LoginSuccessfull";
import Register from "@/pages/(auth)/register/register";
import BannerManagement from "@/pages/(dashboard)/content/banner/banner";
import Content from "@/pages/(dashboard)/content/footer/footer";
import EvaluateAdmin from "@/pages/(dashboard)/evaluate/page";
import { LayoutAdmin } from "@/pages/(dashboard)/layout";
import RevenueAdmin from "@/pages/(dashboard)/revenue/page";
import PageAddAdmin from "@/pages/(dashboard)/userprivileges/addAdmin/page";
import PageAddPermission from "@/pages/(dashboard)/userprivileges/addpermission/page";
import PagePrivilegeAdmin from "@/pages/(dashboard)/userprivileges/admin/page";
import UserPrivilegeAdmin from "@/pages/(dashboard)/userprivileges/page";
import AddVoucher from "@/pages/(dashboard)/vourcher/add/add";
import Cart from "@/pages/(website)/cart/Cart";
import ChangePassword from "@/pages/(auth)/ChangePassword/changepassword";
import SheetSide from "@/pages/(website)/test";
import UsersAdminkhachhang from "@/pages/(dashboard)/user/khachhang/page";
import UserskhachhangAdd from "@/pages/(dashboard)/user/khachhang/add/page";
import ErrorAuth from "@/pages/(auth)/ErrorAuth/changepassword";
import UserskhachhangEdit from "@/pages/(dashboard)/user/khachhang/edit/page";
import UsersAdminNhanvien from "@/pages/(dashboard)/user/nhanvien/page";
import UsersNhanvienAdd from "@/pages/(dashboard)/user/nhanvien/add/page";
import UsersnhanvienEdit from "@/pages/(dashboard)/user/nhanvien/edit/page";
import UsersRemoteNhanvien from "@/pages/(dashboard)/user/nhanvien/remote/page";
import UserskhachangRemote from "@/pages/(dashboard)/user/khachhang/remote/page";
import { Navigation } from "swiper/modules";
const Router = () => {
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
        <Route path="admin" element={<LayoutAdmin />}>
          <Route path="dashboard" element={<Dashboard />} />
          {/* Sản phẩm  */}
          <Route
            path="products"
            element={<Navigate to="/admin/products/list" />}
          />
          <Route path="products/list" element={<ProductsAdmin />} />
          <Route path="products/add" element={<ProductsAdd />} />
          <Route path="products/edit/:id" element={<ProductsEdit />} />
          <Route path="products/remote" element={<ProductsRemote />} />
          {/* danh mục */}
          <Route path="categories" element={<CategoriesAdmin />} />
          <Route path="categories/add" element={<CategoriesAdd />} />
          <Route path="categories/edit/:id" element={<CategoriesEdit />} />
          <Route path="categories/remote" element={<CategoriesRemote />} />
          <Route path="orders" element={<OrderAdmin />} />
          <Route path="vouchers" element={<VoucherAdmin />} />
          {/* Tài khoản */}
          <Route
            path="users"
            element={<Navigate to="/admin/users/khachhang" />}
          />
          <Route path="users/khachhang" element={<UsersAdminkhachhang />} />
          <Route path="users/khachhang/add" element={<UserskhachhangAdd />} />
          <Route
            path="users/khachhang/edit/:id"
            element={<UserskhachhangEdit />}
          />

          <Route
            path="users/khachhang/remote"
            element={<UserskhachangRemote />}
          />

          <Route path="users/nhanvien" element={<UsersAdminNhanvien />} />
          <Route path="users/nhanvien/add" element={<UsersNhanvienAdd />} />
          <Route
            path="users/nhanvien/edit/:id"
            element={<UsersnhanvienEdit />}
          />
          <Route
            path="users/nhanvien/remote"
            element={<UsersRemoteNhanvien />}
          />

          <Route path="analytics" element={<AnalyticsAdmin />} />
          <Route path="centralstocks" element={<CentralStock />} />

          <Route path="suportuser" element={<Suportuser />} />

          <Route path="evaluates" element={<EvaluateAdmin />} />
          <Route path="revenues" element={<RevenueAdmin />} />
          <Route
            path="ADmin"
            element={<Navigate to="/admin/ADmin/privilegeadmin" />}
          />

          <Route path="ADmin/userprivileges" element={<UserPrivilegeAdmin />} />

          <Route path="ADmin/privilegeadmin" element={<PagePrivilegeAdmin />} />
          <Route path="add-admin" element={<PageAddAdmin />} />
          <Route path="add-permission" element={<PageAddPermission />} />
          <Route
            path="Content"
            element={<Navigate to="/admin/Content/qlfooter" />}
          />
          <Route path="Content/qlfooter" element={<Content />} />
          <Route path="Content/qlbanner" element={<BannerManagement />} />
          <Route path="add-vocher" element={<AddVoucher />} />

          <Route path="*" element={<NotFoundPage />} />
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
