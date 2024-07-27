import Footer from "@/pages/(website)/_component/Footer";
import Header from "@/pages/(website)/_component/Header";
import React from "react";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div>
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
};

export default Layout;
