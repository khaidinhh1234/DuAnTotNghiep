import { Dashboard } from "@/pages/(dashboard)/dashboard/page";
import LayoutAdmin from "@/pages/(dashboard)/layout";
import Products from "@/pages/(dashboard)/products/page";
import NotFoundPage from "@/pages/(website)/404/page";
import ForgotPassword from "@/pages/(website)/ForgotPassword/ForgotPassword";
import LoginSuccessfull from "@/pages/(website)/LoginSuccessfull/LoginSuccessfull";
import Cart from "@/pages/(website)/cart/Cart";
import HomePage from "@/pages/(website)/home/page";
import LayoutWebsite from "@/pages/(website)/layout";
import Login from "@/pages/(website)/login/login";
import Register from "@/pages/(website)/register/register";
import { Route, Routes } from "react-router-dom";
import PageOur from "../pages/(website)/ourstory/pageOur";
import Page from "./../pages/(website)/shop/shop";
import Minicard from "@/pages/(website)/MInicard/Minicard";
import OrderPlaceSuccess from "@/pages/(website)/OrderPlaceSuccessfully/OrderPlaceSuccessfully";
import ShippingAddressPage from "@/pages/(website)/ShipingAdrres/ShipingAdrres";
import ManageAddresses from "@/pages/(website)/manageaddresses/ManageAddresses";
import MyOrder from "@/pages/(website)/myOrder/Myorder";
import MyProfile from "@/pages/(website)/myprofile/MyProfile";
import MyWishlists from "@/pages/(website)/mywishlists/MyWishlists";
import Notification from "@/pages/(website)/notifications/Notification";
import Ordersummary from "@/pages/(website)/ordersummary/ordersummary";
import Payment from "@/pages/(website)/payment/PayMent";
import SavedCard from "@/pages/(website)/savedcards/SavedCard";
import Setting from "@/pages/(website)/settings/Setting";
import PageProductDetail from "@/pages/(website)/productdetail/PageProductDetail";
import Test from "@/pages/(website)/test";
import OTPPage from "@/pages/(website)/EnterOTP/EntOtp";
import Contact from "@/pages/(website)/contact/Contact";
import ScrollToTop from "@/assets/js/scrolltotop";
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
          <Route path="/product-detail" element={<PageProductDetail/>}/>
          <Route path="/ourstory" element={<PageOur />} />
          <Route path="/myprofile" element={<MyProfile />} />
          <Route path="/mywishlist" element={<MyWishlists />} />
          <Route path="/manageaddresses" element={<ManageAddresses />} />
          <Route path="/notification" element={<Notification />} />
          <Route path="/savedcard" element={<SavedCard />} />
          <Route path="/setting" element={<Setting />} />
          <Route path="/orderPlaceSuccess" element={<OrderPlaceSuccess />} />
          <Route path="/minicard" element={<Minicard />} />=
          <Route path="/myorder" element={<MyOrder />} />
          <Route path="/ordersummary" element={<Ordersummary />} />
          <Route
            path="/ShippingAddressPage"
            element={<ShippingAddressPage />}
          />
          <Route path="/payment" element={<Payment />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/gio-hang" element={<Cart />} />{" "}
          <Route path="/test" element={<Test />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
        {/* TRang admin */}
        <Route path="admin" element={<LayoutAdmin />}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<Products />} />
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
