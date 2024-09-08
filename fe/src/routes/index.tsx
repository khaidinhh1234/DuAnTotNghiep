import { Dashboard } from "@/pages/(dashboard)/dashboard/page";
import Products from "@/pages/(dashboard)/products/page";
import NotFoundPage from "@/pages/(website)/404/page";
import HomePage from "@/pages/(website)/home/page";
import LayoutWebsite from "@/pages/(website)/layout";
import { Route, Routes } from "react-router-dom";
import Page from "./../pages/(website)/shop/shop";
import PageOur from "../pages/(website)/ourstory/pageOur";

import MyProfile from "@/pages/(website)/myprofile/MyProfile";
import MyWishlists from "@/pages/(website)/mywishlists/MyWishlists";
import ManageAddresses from "@/pages/(website)/manageaddresses/ManageAddresses";
import Notification from "@/pages/(website)/notifications/Notification";
import Setting from "@/pages/(website)/settings/Setting";
import SavedCard from "@/pages/(website)/savedcards/SavedCard";
import OrderPlaceSuccess from "@/pages/(website)/OrderPlaceSuccessfully/OrderPlaceSuccessfully";
import Minicard from "@/pages/(website)/MInicard/Minicard";
import MyOrder from "@/pages/(website)/myOrder/Myorder";
import Ordersummary from "@/pages/(website)/ordersummary/ordersummary";
import ShippingAddressPage from "@/pages/(website)/ShipingAdrres/ShipingAdrres";
import Payment from "@/pages/(website)/payment/PayMent";
import Contact from "@/pages/(website)/contact/Contact";
import ScrollToTop from "@/assets/js/scrolltotop";

import PageProductDetail from "@/pages/(website)/productdetail/PageProductDetail";
import Voucher from "@/pages/(website)/vourcher/page";


import Remote from "@/pages/(dashboard)/products/remote/page";
import ProductsAdmin from "@/pages/(dashboard)/products/page";

import OrderAdmin from "@/pages/(dashboard)/order/page";
import VoucherAdmin from "@/pages/(dashboard)/vourcher/page";
import UserAdmin from "@/pages/(dashboard)/user/page";
import AnalyticsAdmin from "@/pages/(dashboard)/analytics/page";
import CentralStock from "@/pages/(dashboard)/centralstock.tsx/page";
import SheetSide from "@/pages/(website)/test";
import CategoryAdmin from "@/pages/(dashboard)/categories/page";
import EvaluateAdmin from "@/pages/(dashboard)/evaluate/page";
import RevenueAdmin from "@/pages/(dashboard)/revenue/page";
import UserPrivilegeAdmin from "@/pages/(dashboard)/userprivileges/page";
import PagePrivilegeAdmin from "@/pages/(dashboard)/userprivileges/admin/page";
import PageAddAdmin from "@/pages/(dashboard)/userprivileges/addAdmin/page";
import PageAddPermission from "@/pages/(dashboard)/userprivileges/addpermission/page";
import Cart from "@/pages/(website)/cart/Cart";
import  Login  from '@/pages/(auth)/login/login';
import Register from "@/pages/(auth)/register/register";
import  ForgotPassword  from '@/pages/(auth)/ForgotPassword/ForgotPassword';
import OTPPage from "@/pages/(auth)/EnterOTP/EntOtp";
import LoginSuccessfull from "@/pages/(auth)/LoginSuccessfull/LoginSuccessfull";
import { LayoutAdmin } from "@/pages/(dashboard)/layout";

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
          {/* <Route path="/test" element={<Test />} /> */}

          <Route path="*" element={<NotFoundPage />} />
        </Route>
        {/* TRang admin */}
        <Route path="admin" element={<LayoutAdmin />}>
          <Route path="dashboard" element={<Dashboard />} />

          <Route path="products" element={<ProductsAdmin />} />
          {/* <Route path="products/add" element={<ProductsAdd />} />
          <Route path="products/edit/:id" element={<ProductsEdit />} /> */}
          <Route path="products/remote" element={<Remote />} />

          <Route path="categories" element={<CategoryAdmin />} />
          <Route path="orders" element={<OrderAdmin />} />
          <Route path="vouchers" element={<VoucherAdmin />} />
          <Route path="users" element={<UserAdmin />} />
          <Route path="analytics" element={<AnalyticsAdmin />} />
          <Route path="centralstocks" element={<CentralStock />} />
          <Route path="evaluates" element={<EvaluateAdmin />} />
          <Route path="revenues" element={<RevenueAdmin />} />
          <Route path="userprivileges" element={<UserPrivilegeAdmin />} />
          <Route path="privilegeadmin" element={<PagePrivilegeAdmin />} />
          <Route path="add-admin" element={<PageAddAdmin />} />
          <Route path="add-permission" element={<PageAddPermission />} />
          <Route path="qlfooter" element={<Content />} />
<Route path="qlbanner" element={<BannerAdminManagement />} />
<Route path="add-vocher" element={<AddVocher />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>{" "}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/EnterOtp" element={<OTPPage />} />
        <Route path="/loginSuccessfull" element={<LoginSuccessfull />} />{" "}
      </Routes>
    </>
  );
};

export default Router;
