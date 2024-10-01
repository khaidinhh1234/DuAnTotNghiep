import { Outlet } from "react-router-dom";
import Header from "./_component/Header";
import SlibarProduct from "./_component/Sliber";

export function LayoutAdmin() {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[320px_1fr] ">
      <div className="">
        <SlibarProduct />
      </div>
      <div className="flex flex-col bg-[#f3f2f2]">
        <Header />
        <Outlet />
      </div>
    </div>
  );
}
