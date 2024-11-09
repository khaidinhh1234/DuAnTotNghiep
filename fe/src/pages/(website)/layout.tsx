import Footer from "@/pages/(website)/_component/Footer";
// import Header from "@/pages/(website)/_component/Header";
import { Outlet } from "react-router-dom";
// import Header from "./_component/Header";
import Header2 from "./_component/Header2";
import { useWalletRouteCheck } from "@/services/useWalletRouteCheck";
import Test123 from "./_component/test123";
// import Test from "./_component/Test";

const Layout = () => {
  useWalletRouteCheck();

  return (
    <div>
      {/* <Header /> */}
      {/* <Test/> */}
      <Header2 />
      {/* <Test123/> */}
      <Outlet />  
      <Footer />
    </div>
  );
};

export default Layout;
