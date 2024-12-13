import Footer from "@/pages/(website)/_component/Footer";
import { Outlet } from "react-router-dom";
import { useWalletRouteCheck } from "@/services/useWalletRouteCheck";
import Header from "./_component/Header";

const Layout = () => {
  useWalletRouteCheck();

  return (
    <div className="relative">
      <Header />
      <Outlet />
      
      {/* Tuyết rơi xuyên suốt màn hình */}
      <div className="fixed top-0 left-0 right-0 bottom-0 z-50 pointer-events-none overflow-hidden">
        {[...Array(30)].map((_, index) => (
          <div
            key={index}
            className="snowflake absolute text-blue-300 animate-snow-fall"
            style={{
              bottom: `${Math.random() * 100}vw`,
              animationDuration: `${Math.random() * 10 + 5}s`, 
              animationDelay: `${Math.random() * 5}s`, 
              fontSize: `${Math.random() * 15 + 10}px`, 
            }}
          >
           <i className="fa-regular fa-snowflake"></i>
          </div>
        ))}
      </div>

      <Footer />
    </div>
  );
};

export default Layout;
