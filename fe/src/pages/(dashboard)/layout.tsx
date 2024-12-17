import { Outlet } from "react-router-dom";
import Header from "./_component/Header";
import SiderComponent from "./_component/Sliber";
import { Layout } from "antd";
import { useState } from "react";

const { Sider } = Layout;

export function LayoutAdmin() {
  const [collapsed, setCollapsed] = useState(false);
  const siderWidth = collapsed ? 80 : 320;
  return (
    <>
      {/* Header luôn cố định */}
      <div className="sticky top-0 z-10">
        <Header />
      </div>

      {/* Layout chính */}
      <Layout className="min-h-screen">
        {/* Sidebar */}
        <Sider
          width={320}
          className="bg-white text-white h-screen overflow-y-auto "
          style={{
            position: "fixed", // Sidebar cố định
            left: 0, // Căn lề trái
            top: "64px", // Khoảng cách từ trên để tránh Header (nếu Header cao 64px)
            height: "calc(100vh - 64px)", // Chiều cao trừ phần Header
            zIndex: 1000,
          }}
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          breakpoint="lg"
        >
          {/* <div className="fixed top-15 left-0 h-screen w-[220px] lg:w-[320px] bg-white z-10"> */}
          <SiderComponent />
          {/* </div> */}
        </Sider>

        {/* Nội dung chính */}
        <Layout
          className="bg-[#f3f3f3]"
          style={{ marginLeft: siderWidth }} // Khoảng cách bên trái tương ứng sidebar
        >
          <div className="p-4 sm:p-6">
            <Outlet />
          </div>
        </Layout>
      </Layout>
    </>
  );
}
