import { ellipse, hello } from "@/assets/img";
import { useLocalStorage } from "@/components/hook/useStoratge";
import { Link } from "react-router-dom";
const Slibar = () => {
  const [user] = useLocalStorage("user" as any, {});
  const member = user.user;
  console.log(member);
  return (
    <div className="lg:col-span-3 col-span-3 border border-hrblack xl:w-[262px] lg:w-[222px] w-[262px] lg:h-[524px] rounded-lg">
      {" "}
      <div className="flex items-center p-5 border-b border-hrBlack">
        <img
          src={ellipse}
          alt=""
          className="rounded-full md:w-[51px] md:h-[51px]"
        />
        <div className="px-4 py-2">
          <span className=""></span>
          <img src={hello} className="px-[2px]" alt="" />
          <h4 className="font-bold text-lg">
            {member?.ho + " " + member?.ten}
          </h4>
        </div>
        <div className="lg:hidden ">
          <button>
            <i className=" fa-solid fa-layer-group pl-5 text-xl" />
          </button>
        </div>{" "}
      </div>
      <nav className="lg:block hidden py-5 w-full">
        <ul className="space-y-2">
          <li>
            <Link
              to="/myprofile"
              className="hover:bg-black hover:text-white w-full  px-5 py-3 flex items-center"
            >
              <i className="fa-regular fa-user mr-3" />
              Thông Tin Cá Nhân
            </Link>
          </li>
          <li>
            <Link
              to="/myorder"
              className="hover:bg-black hover:text-white w-full  px-5 py-3 flex items-center"
            >
              <i className="fa-regular fa-box mr-3" />
              Đơn Hàng Của Tôi
            </Link>
          </li>
          <li>
            <Link
              to="/mywishlist"
              className="hover:bg-black hover:text-white w-full  px-5 py-3 flex items-center"
            >
              <i className="fa-regular fa-heart mr-3" />
              Danh Sách Yêu Thích
            </Link>
          </li>
          <li>
            <Link
              to="/manageaddresses"
              className="hover:bg-black hover:text-white w-full  px-5 py-3 flex items-center"
            >
              <i className="fa-regular fa-location-dot mr-3" />
              Quản Lý Địa Chỉ
            </Link>
          </li>
          <li>
            <Link
              to="/savedcard"
              className="hover:bg-black hover:text-white w-full  px-5 py-3 flex items-center"
            >
              <i className="fa-light fa-credit-card mr-3" />
              Thẻ Đã Lưu
            </Link>
          </li>
          <li>
            <Link
              to="/notification"
              className="hover:bg-black hover:text-white w-full  px-5 py-3 flex items-center"
            >
              <i className="fa-regular fa-bell mr-3" />
              Thông Báo
            </Link>
          </li>
          <li>
            <Link
              to="/setting"
              className="hover:bg-black hover:text-white w-full  px-5 py-3 flex items-center"
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
