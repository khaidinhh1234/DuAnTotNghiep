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
      className={`col-span-3 border border-hrblack rounded-lg transition-all duration-300 ${
        showNotificationMenu ? "lg:h-[610px]" : "lg:h-[525px]"
      } xl:w-[262px] lg:w-[222px] w-full`}
    >
      <div className="flex items-center p-4 md:p-5 border-b border-hrBlack">
        <img
          src={data?.data?.anh_nguoi_dung ?? anh_nguoi_dung}
          alt="Profile picture"
          className="rounded-full w-[40px] h-[40px] md:w-[50px] md:h-[50px] object-cover border border-gray-300 shadow-md"
        />

        <div className="px-4 py-2 mt-2">
          <div className="flex items-center gap-1">
            <span className="text-sm">Xin chào</span>
            <span className="text-xl">👋</span>
          </div>
          <h4 className="font-bold text-base md:text-lg">
            {member?.ho + " " + member?.ten}
          </h4>
        </div>
        <div className="lg:hidden ml-auto">
          <button>
            <i className="fa-solid fa-layer-group pl-5 text-xl" />
          </button>
        </div>
      </div>
      <nav className="hidden lg:block py-4 md:py-5 w-full">
        <ul className="space-y-1 md:space-y-2">
          <li>
            <Link
              to="/mypro/myprofile"
              className="hover:bg-black hover:text-white w-full px-4 md:px-5 py-2 md:py-3 flex items-center"
            >
              <i className="fa-regular fa-user mr-3" />
              Thông Tin Cá Nhân
            </Link>
          </li>
          <li>
            <Link
              to="/mypro/myorder"
              className="hover:bg-black hover:text-white w-full px-4 md:px-5 py-2 md:py-3 flex items-center"
            >
              <i className="fa-regular fa-box mr-3" />
              Đơn Hàng Của Tôi
            </Link>
          </li>
          <li>
            <Link
              to="/mypro/wallet"
              className="hover:bg-black hover:text-white w-full px-4 md:px-5 py-2 md:py-3 flex items-center"
            >
              <i className="fa-light fa-wallet mr-3"></i>
              Ví của tôi
            </Link>
          </li>
          <li>
            <Link
              to="/mypro/vocher"
              className="hover:bg-black hover:text-white w-full px-4 md:px-5 py-2 md:py-3 flex items-center"
            >
              <i className="fa-light fa-ticket mr-3" />
              Voucher của tôi
            </Link>
          </li>
          <li>
            <Link
              to="/mypro/mywishlist"
              className="hover:bg-black hover:text-white w-full px-4 md:px-5 py-2 md:py-3 flex items-center"
            >
              <i className="fa-regular fa-heart mr-3" />
              Danh Sách Yêu Thích
            </Link>
          </li>
          <li>
            <Link
              to="/mypro/notification"
              className="hover:bg-black hover:text-white w-full px-4 md:px-5 py-2 md:py-3 flex items-center"
            >
              <i className="fa-regular fa-bell mr-3" />
              Thông báo
            </Link>
          </li>
          {/* <li>
            <Link
              to="/mypro/setting"
              className="hover:bg-black hover:text-white w-full px-4 md:px-5 py-2 md:py-3 flex items-center"
            >
              <i className="fa-regular fa-gear mr-3" />
              Cài Đặt
            </Link>
          </li> */}
        </ul>
      </nav>
    </div>
  );
};

export default Slibar;
