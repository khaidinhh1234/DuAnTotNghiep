import Footer from "@/pages/(website)/_component/Footer";
// import Header from "@/pages/(website)/_component/Header";
import { Outlet } from "react-router-dom";
import Header from './_component/Test';
import Test from "./_component/Test";

const Layout = () => {
  return (
    <div>
      {/* <Header /> */}
      <Test/>
      <Outlet />
      <Footer />
    </div>
  );
};

export default Layout;
