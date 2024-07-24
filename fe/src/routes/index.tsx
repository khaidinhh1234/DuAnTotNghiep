import { Dashboard } from "@/pages/(dashboard)/dashboard/page";
import LayoutAdmin from "@/pages/(dashboard)/layout";
import Products from "@/pages/(dashboard)/products/page";
import NotFoundPage from "@/pages/(website)/404/page";
import HomePage from "@/pages/(website)/home/page";
import LayoutWebsite from "@/pages/(website)/layout";
import { Route, Routes } from "react-router-dom";
import Page from "./../pages/(website)/shop/shop";
import PageOur from "../pages/(website)/ourstory/pageOur";
import Login from "@/pages/(website)/login/login";
import Cart from "@/pages/(website)/cart/Cart";
import Register from "@/pages/(website)/register/register";
import ForgotPassword from "@/pages/(website)/ForgotPassword/ForgotPassword";
import LoginSuccessfull from "@/pages/(website)/LoginSuccessfull/LoginSuccessfull";
<<<<<<< HEAD
import MyProfile from "@/pages/(website)/myprofile/MyProfile";
import MyWishlists from "@/pages/(website)/mywishlists/MyWishlists";
import ManageAddresses from "@/pages/(website)/manageaddresses/ManageAddresses";
import Notification from "@/pages/(website)/notifications/Notification";
import Setting from "@/pages/(website)/settings/Setting";
import SavedCard from "@/pages/(website)/savedcards/SavedCard";
=======
import OrderPlaceSuccess from "@/pages/(website)/OrderPlaceSuccessfully/OrderPlaceSuccessfully";
import Minicard from "@/pages/(website)/MInicard/Minicard";
import MyOrder from "@/pages/(website)/myOrder/Myorder";
import Ordersummary from "@/pages/(website)/ordersummary/ordersummary";
import ShippingAddressPage from "@/pages/(website)/ShipingAdrres/ShipingAdrres";
import Payment from "@/pages/(website)/payment/PayMent";
import OTPPage from "@/pages/(website)/EnterOTP/EntOtp";

>>>>>>> 358d1fcd69196bef4844820df816adcff051120c

const Router = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<LayoutWebsite />}>
          <Route index element={<HomePage />} />
          <Route path="/shop" element={<Page />} />
          <Route path="/ourstory" element={<PageOur />} />
          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register/>} />
          <Route path="/forgotpassword" element={<ForgotPassword/>} />
          <Route path="/EnterOtp" element={<OTPPage/>} />
          <Route path="/loginSuccessfull" element={<LoginSuccessfull/>} />
<<<<<<< HEAD
          <Route path="/myprofile" element={<MyProfile/>} />
          <Route path="/mywishlist" element={<MyWishlists/>} />
          <Route path="/manageaddresses" element={<ManageAddresses/>} />
          <Route path="/notification" element={<Notification/>} />
          <Route path="/savedcard" element={<SavedCard/>} />
          <Route path="/setting" element={<Setting/>} />
=======
          <Route path="/orderPlaceSuccess" element={<OrderPlaceSuccess/>} />
          <Route path="/minicard" element={<Minicard/>} />=
          <Route path="/myorder" element={<MyOrder/>} />
          <Route path="/ordersummary" element={<Ordersummary/>} />
          <Route path="/ShippingAddressPage" element={<ShippingAddressPage/>} />
          <Route path="/payment" element={<Payment/>} />
>>>>>>> 358d1fcd69196bef4844820df816adcff051120c
          <Route path="/gio-hang" element={<Cart />} />{" "}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
        <Route path="admin" element={<LayoutAdmin />}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<Products />} />
        </Route>
      </Routes>
    </>
  );
};

export default Router;
