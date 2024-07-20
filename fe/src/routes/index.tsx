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
import EnterOtp from "@/pages/(website)/EnterOTP/EnterOTP";
import LoginSuccessfull from "@/pages/(website)/LoginSuccessfull/LoginSuccessfull";
import MyOrder from "@/pages/(website)/login copy 7/Myorder";


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
          <Route path="/forgotpassword" element={<ForgotPassword/>} />EnterOtp
          <Route path="/EnterOtp" element={<EnterOtp/>} />
          <Route path="/loginSuccessfull" element={<LoginSuccessfull/>} />
          <Route path="/myorder" element={<MyOrder/>} />
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
