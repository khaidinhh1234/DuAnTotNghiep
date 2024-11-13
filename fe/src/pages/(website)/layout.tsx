import Footer from "@/pages/(website)/_component/Footer";
import { Outlet } from "react-router-dom";

import { useWalletRouteCheck } from "@/services/useWalletRouteCheck";
import Header from "./_component/Header";

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
