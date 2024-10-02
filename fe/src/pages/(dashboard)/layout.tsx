import { Outlet } from "react-router-dom";
import Header from "./_component/Header";
import SiderComponent from "./_component/Sliber";

export function LayoutAdmin() {
  return (
    <div className="grid min-h-screen grid-cols-[220px_1fr] lg:grid-cols-[320px_1fr]">
      {/* Sidebar */}
      <div className="sticky top-0 flex flex-col h-screen ">
        {/* Nội dung Sidebar */}
        <SiderComponent />
      </div>
      {/* Header và Main Content */}
      <div className="flex flex-col bg-[#f3f2f2]">
        {/* Sticky Header */}
        <div className="sticky top-0 z-50">
          <Header />
        </div>
        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
