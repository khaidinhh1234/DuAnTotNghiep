import Footer from "@/pages/(website)/_component/Footer";
// import Header from "@/pages/(website)/_component/Header";
import { Outlet } from "react-router-dom";
import Header from './_component/Test';
import Header2 from "./_component/Header2";
// import Test from "./_component/Test";

const Layout = () => {
  return (
    <div>
      {/* <Header /> */}
      {/* <Test/> */}
      <Header2/>
      <Outlet />
      <Footer />
    </div>
  );
};

export default Layout;
