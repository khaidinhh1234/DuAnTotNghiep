import { Outlet } from "react-router-dom";
// import Link from "next/link";

import SlibarProduct from "@/pages/(dashboard)/_component/Sliber";
import Header from "./_component/Header";

const Layout = () => {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <SlibarProduct></SlibarProduct>

      <div className="flex flex-col">
        <Header></Header>
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
