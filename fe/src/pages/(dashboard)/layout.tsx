import { Outlet } from "react-router-dom";
import Header from "./_component/Header";
import SiderComponent from "./_component/Sliber";

export function LayoutAdmin() {
  return (
    <>
      <div className="sticky top-0 z-10">
        <Header />
      </div>
      <div className="grid min-h-screen grid-cols-[1fr] lg:grid-cols-[1fr] ">
        <div className="fixed top-15 left-0 h-screen w-[220px] lg:w-[320px] bg-white z-10">
          {/* Nội dung Sidebar */}
          <SiderComponent />
        </div>

        {/* Header và Main Content */}
        <div className="ml-[220px] lg:ml-[320px] flex flex-col bg-[#f3f3f3]">
          {/* Main Content */}
          <div className="flex-1 h-screen">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
}
