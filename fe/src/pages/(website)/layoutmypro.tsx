import { Outlet } from "react-router-dom";
import Sidebar from "./_component/Slibar";
import { useWalletRouteCheck } from "@/services/useWalletRouteCheck";
const LayoutMyPro = () => {
  useWalletRouteCheck();

  return (
    <div>
      <main>
        {/* Đơn hàng của tôi */}
        <section className="container ">
          <div className="lg:mx-0 md:mx-6 lg:my-[80px] mt-[42px] ">
            <div className="lg:colx-span-7 md:col-span-4">
              <h1 className="lg:text-3xl text-2xl tracking-wider font-semibold">
                Thông Tin Cá Nhân
              </h1>
            </div>
            <div className="grid lg:grid-cols-12 grid-cols-8 lg:gap-8 gap-2 lg:my-12 mt-6 ">
              {/* Thanh bên */}
              <div className="lg:col-span-3 col-span-3 border border-hrblack xl:w-[262px] lg:w-[222px] w-[262px] lg:h-[524px] rounded-lg">
                <Sidebar />
              </div>
              <div className="lg:col-span-9  col-span-8 lg:pl-5 mb-10">
                <Outlet />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default LayoutMyPro;
