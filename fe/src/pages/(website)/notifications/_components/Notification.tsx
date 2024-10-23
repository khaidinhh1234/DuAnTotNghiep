import { ellipse, hello } from "@/assets/img";
import { Link } from "react-router-dom";
import Sidebar from "./../../_component/Slibar";

const NotificationPage = () => {
  return (
    <>
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
              <h4 className="font-bold text-base mb-2">Cập nhật hồ sơ</h4>
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
              <p className="text-[#A4A1AA]">Bạn đã đặt một đơn hàng mới</p>
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
              <h4 className="font-bold text-base mb-2">Cập nhật hồ sơ</h4>
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
              <p className="text-[#A4A1AA]">Bạn đã đặt một đơn hàng mới</p>
            </div>
          </div>
          <p className="text-[#A4A1AA] capitalize">11:16 AM</p>
        </div>
      </div>
    </>
  );
};

export default NotificationPage;
