import { ellipse, hello } from "@/assets/img";
import { Link } from "react-router-dom";
import Sidebar from "./../../_component/Slibar";

const NotificationPage = () => {
  return (
    <>
      <main>
        {/* Danh sách yêu thích của tôi */}
        <section className="container ">
          <div className="lg:mx-0 md:mx-6 lg:my-[80px] mt-[42px] ">
            <div className="grid lg:grid-cols-12 md:grid-cols-8 gap-2 items-center">
              <div className="lg:colx-span-7 md:col-span-4">
                <h1 className="lg:text-4xl text-3xl tracking-wider font-medium">
                  Hồ sơ của tôi
                </h1>
              </div>
            </div>
            <div className="grid lg:grid-cols-12 grid-cols-8 lg:gap-8 gap-2 lg:my-12 my-6">
              {/* Thanh bên */}
              <div className="lg:col-span-3 col-span-3 border border-hrblack xl:w-[262px] lg:w-[222px] w-[262px] lg:h-[524px] rounded-lg">
                <Sidebar />
              </div>{" "}
              <div className="lg:col-span-9  col-span-8 lg:pl-5">
                {/* Nội dung */}
                <div className="flex justify-between items-end border-b border-hrBlack pb-5 mb-5">
                  <div className="flex">
                    <img
                      src={ellipse}
                      alt={ellipse}
                      className="w-14 h-14 rounded-full"
                    />
                    <div className="px-4">
                      <h4 className="font-bold text-base mb-2">
                        Cập nhật hồ sơ
                      </h4>
                      <p className="text-[#A4A1AA]">
                        Đơn hàng của bạn đã được đặt thành công
                      </p>
                    </div>
                  </div>
                  <p className="text-[#A4A1AA] capitalize">vừa xong</p>
                </div>
                <div className="flex justify-between items-end border-b border-hrBlack pb-5 mb-5">
                  <div className="flex items-center">
                    <i className="fa-regular fa-box  w-14 h-14 bg-neutral-200 rounded-full text-center py-4 text-2xl " />
                    <div className="px-4">
                      <h4 className="font-bold text-base mb-2">
                        Đơn hàng của bạn đã được đặt thành công
                      </h4>
                      <p className="text-[#A4A1AA]">
                        Bạn đã đặt một đơn hàng mới
                      </p>
                    </div>
                  </div>
                  <p className="text-[#A4A1AA] capitalize">11:16 AM</p>
                </div>
                <div className="flex justify-between items-end border-b border-hrBlack pb-5 mb-5">
                  <div className="flex">
                    <img
                      src={ellipse}
                      alt={ellipse}
                      className="w-14 h-14 rounded-full"
                    />
                    <div className="px-4">
                      <h4 className="font-bold text-base mb-2">
                        Cập nhật hồ sơ
                      </h4>
                      <p className="text-[#A4A1AA]">
                        Đơn hàng của bạn đã được đặt thành công
                      </p>
                    </div>
                  </div>
                  <p className="text-[#A4A1AA] capitalize">vừa xong</p>
                </div>
                <div className="flex justify-between items-end border-b border-hrBlack pb-5 mb-5">
                  <div className="flex items-center">
                    <i className="fa-regular fa-box  w-14 h-14 bg-neutral-200 rounded-full text-center py-4 text-2xl " />
                    <div className="px-4">
                      <h4 className="font-bold text-base mb-2">
                        Đơn hàng của bạn đã được đặt thành công
                      </h4>
                      <p className="text-[#A4A1AA]">
                        Bạn đã đặt một đơn hàng mới
                      </p>
                    </div>
                  </div>
                  <p className="text-[#A4A1AA] capitalize">11:16 AM</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default NotificationPage;
