import { useLocalStorage } from "@/components/hook/useStoratge";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import instanceClient from "@/configs/client";

const Slibar = () => {
  const [user] = useLocalStorage("user" as any, {});
  const member = user?.user;
  console.log(user?.user?.anh_nguoi_dung);
  const [anh_nguoi_dung] = useState(member?.anh_nguoi_dung);
  const { data } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      try {
        const response = await instanceClient.post("cap-nhat-thong-tin");
        return response.data;
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    },
  });
  const [showNotificationMenu, setShowNotificationMenu] = useState(false);

  const toggleNotificationMenu = () => {
    setShowNotificationMenu(!showNotificationMenu);
  };

  // console.log('data....',data)

  return (
    <div
      className={`lg:col-span-3 col-span-3 border border-hrblack xl:w-[262px] lg:w-[222px] w-[262px] rounded-lg transition-all duration-300  ${showNotificationMenu ? "lg:h-[610px]" : "lg:h-[525px]"}`}
    >
      <div className="flex items-center p-5 border-b border-hrBlack">
        <img
          src={data?.data?.anh_nguoi_dung ?? anh_nguoi_dung}
          alt=""
          className="rounded-full md:w-[51px] md:h-[51px]"
        />
        <div className="px-4 py-2 mt-2">
          <div className="flex items-center gap-1">
            <span className="text-sm">Xin chào</span>
            <span className="text-xl">👋</span>
          </div>
          <h4 className="font-bold text-lg">
            {member?.ho + " " + member?.ten}
          </h4>
        </div>
        <div className="lg:hidden">
          <button>
            <i className="fa-solid fa-layer-group pl-5 text-xl" />
          </button>
        </div>
      </div>
      <nav className="lg:block hidden py-5 w-full">
        <ul className="space-y-2">
          <li>
            <Link
              to="/mypro/myprofile"
              className="hover:bg-black hover:text-white w-full px-5 py-3 flex items-center"
            >
              <i className="fa-regular fa-user mr-3" />
              Thông Tin Cá Nhân
            </Link>
          </li>
          <li>
            <Link
              to="/mypro/myorder"
              className="hover:bg-black hover:text-white w-full px-5 py-3 flex items-center"
            >
              <i className="fa-regular fa-box mr-3" />
              Đơn Hàng Của Tôi
            </Link>
          </li>
          <li>
            <Link
              to="/mypro/wallet"
              className="hover:bg-black hover:text-white w-full px-5 py-3 flex items-center"
            >
              <i className="fa-light fa-wallet mr-3"></i>
              Ví của tôi
            </Link>
          </li>
          <li>
            <Link
              to="/mypro/vocher"
              className="hover:bg-black hover:text-white w-full px-5 py-3 flex items-center"
            >
              <i className="fa-light fa-ticket mr-3" />
              Voucher của tôi
            </Link>
          </li>
          <li>
            <Link
              to="/mypro/mywishlist"
              className="hover:bg-black hover:text-white w-full px-5 py-3 flex items-center"
            >
              <i className="fa-regular fa-heart mr-3" />
              Danh Sách Yêu Thích
            </Link>
          </li>
          {/* <li>
            <Link
              to="/mypro/manageaddresses"
              className="hover:bg-black hover:text-white w-full px-5 py-3 flex items-center"
            >
              <i className="fa-regular fa-location-dot mr-3" />
              Quản Lý Địa Chỉ
            </Link>
          </li> */}
          {/* <li>
            <Link
              to="/mypro/savedcard"
              className="hover:bg-black hover:text-white w-full px-5 py-3 flex items-center"
            >
              <i className="fa-light fa-credit-card mr-3" />
              Thẻ Đã Lưu
            </Link>
          </li> */}
          <li className="relative">
            <button
              onClick={toggleNotificationMenu}
              className="hover:bg-black hover:text-white w-full px-5 py-3 flex items-center justify-between"
            >
              <div className="flex items-center">
                <i className="fa-regular fa-bell mr-3" />
                Thông Báo
              </div>
              <i
                className={`fa-solid fa-chevron-${showNotificationMenu ? "up" : "down"}`}
              />
            </button>
            {showNotificationMenu && (
              <ul className="pl-8 bg-gray-50">
                <li>
                  <Link
                    to="/mypro/notification"
                    className="hover:bg-black hover:text-white w-full px-5 py-3 flex items-center"
                  >
                    <i className="fa-regular fa-box mr-3" />
                    Cập nhập Đơn Hàng
                  </Link>
                </li>
                <li>
                  <Link
                    to="/mypro/notificationKm"
                    className="hover:bg-black hover:text-white w-full px-5 py-3 flex items-center"
                  >
                    <i className="fa-regular fa-tag mr-3" />
                    Khuyến Mãi
                  </Link>
                </li>
              </ul>
            )}
          </li>
          <li>
            <Link
              to="/mypro/setting"
              className="hover:bg-black hover:text-white w-full px-5 py-3 flex items-center"
            >
              <i className="fa-regular fa-gear mr-3" />
              Cài Đặt
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Slibar;
