import Footer from "@/pages/(website)/_component/Footer";
// import Header from "@/pages/(website)/_component/Header";
import { Outlet } from "react-router-dom";

import { useWalletRouteCheck } from "@/services/useWalletRouteCheck";
import Test123 from "./_component/test123";
import Header from "./_component/Header";
// import Test from "./_component/Test";

const Layout = () => {
  useWalletRouteCheck();

  return (
    <div>
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
};

export default Layout;
