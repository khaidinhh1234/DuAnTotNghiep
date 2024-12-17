import { useLocalStorage } from "@/components/hook/useStoratge";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import instanceClient from "@/configs/client";

const Slibar = () => {
  const [user] = useLocalStorage("user" as any, {});
  const member = user?.user;
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
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  const closeMobileMenu = () => {
    setShowMobileMenu(false);
  };

  return (
    <div
      className={`col-span-3 border border-hrblack rounded-lg transition-all duration-300 ${
        showMobileMenu ? "lg:h-auto" : "lg:h-[525px]"
      } xl:w-[262px] lg:w-[222px] w-[450px]`}
    >
      {/* Header Section */}
      <div className="flex items-center p-4 md:p-5 border-b border-hrBlack">
        <img
          src={data?.data?.user?.anh_nguoi_dung ?? anh_nguoi_dung}
          alt="Profile picture"
          className="rounded-full w-[40px] h-[40px] md:w-[50px] md:h-[50px] object-cover border border-gray-300 shadow-md"
        />
        <div className="px-4 py-2">
          <div className="flex items-center gap-1">
            <span className="text-sm">Xin chào</span>
            <span className="text-xl">👋</span>
          </div>
          <h4 className="font-bold text-base md:text-lg">
            {member?.ho + " " + member?.ten}
          </h4>
        </div>
        <div className="lg:hidden ml-auto">
          <button onClick={toggleMobileMenu}>
            <i className="fa-solid fa-bars text-xl" />
          </button>
        </div>
      </div>

      {/* Navigation Section */}
      <nav
        className={`${
          showMobileMenu ? "block" : "hidden"
        } lg:block py-4 md:py-5 w-full`}
      >
        <ul className="space-y-1 md:space-y-2">
          {[
            {
              to: "/mypro/myprofile",
              label: "Thông Tin Cá Nhân",
              icon: "fa-regular fa-user",
            },
            {
              to: "/mypro/myorder",
              label: "Đơn Hàng Của Tôi",
              icon: "fa-regular fa-box",
            },
            {
              to: "/mypro/wallet",
              label: "Ví của tôi",
              icon: "fa-light fa-wallet",
            },
            {
              to: "/mypro/vocher",
              label: "Mã khuyến mãi",
              icon: "fa-light fa-ticket",
            },
            {
              to: "/mypro/mywishlist",
              label: "Danh Sách Yêu Thích",
              icon: "fa-regular fa-heart",
            },
            {
              to: "/mypro/notification",
              label: "Thông báo",
              icon: "fa-regular fa-bell",
            },
          ].map((item) => (
            <li key={item.to}>
              <Link
                to={item.to}
                className="hover:bg-black hover:text-white w-full px-4 md:px-5 py-2 md:py-3 flex items-center"
                onClick={closeMobileMenu} // Đóng menu khi nhấn
              >
                <i className={`${item.icon} mr-3`} />
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Slibar;
