import Footer from "@/pages/(website)/_component/Footer";
// import Header from "@/pages/(website)/_component/Header";
import { Outlet } from "react-router-dom";

import { useWalletRouteCheck } from "@/services/useWalletRouteCheck";
import Test123 from "./_component/test123";
import Header from "./_component/Header";
import Test from "./_component/Test";
// import Test from "./_component/Test";

const Layout = () => {
  useWalletRouteCheck();

  return (
    <div>
      <Header />
<<<<<<< HEAD
=======
      {/* <Test/> */}
      {/* <Header2 /> */}
      {/* <Test123/> */}
      {/* <Header /> */}
>>>>>>> f9cdd6e6a744a726e4e568363dbd3b44230fb428
      {/* <Test123/> */}
      {/* <Test/> */}
      <Outlet />
      <Footer />
    </div>
  );
};

export default Layout;
