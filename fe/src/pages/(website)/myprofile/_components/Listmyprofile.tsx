import { CameraOutlined } from "@ant-design/icons";
import { Avatar, Button, Progress } from "antd";
import Sidebar from "./../../_component/Slibar";
// import ProfileTab from './ProfileTab';
import { Upload } from "antd";
import { useState } from "react";
import { useLocalStorage } from "@/components/hook/useStoratge";
import { useQuery } from "@tanstack/react-query";
import instanceClient from "@/configs/client";
import { Link } from "react-router-dom";

const ListMyProfile = ({ member }: any) => {
  const [avatarImage, setAvatarImage] = useState<string>("");
  const [{ user }] = useLocalStorage("user" as any, {});
  const url = user.anh_nguoi_dung;
  const handleAvatarChange = (info: any) => {
    if (info.file && info.file.originFileObj) {
      const file = URL.createObjectURL(info.file.originFileObj);
      setAvatarImage(file);
    }
  };
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
  console.log(data);
  function convertDateToVietnameseFormat(dateString: any) {
    if (!dateString) return ""; // Kiểm tra nếu không có dữ liệu
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Tháng bắt đầu từ 0
    const year = date.getFullYear();

    return `${day} tháng ${month} Năm ${year}`;
  }
  const phantram =
    ((data?.data - user?.hang_thanh_vien?.chi_tieu_toi_thieu) /
      (user?.hang_thanh_vien?.chi_tieu_toi_da -
        user?.hang_thanh_vien?.chi_tieu_toi_thieu)) *
    100;
  return (
    <>
      <main>
        {/* Đơn hàng của tôi */}
        <section className="container ">
          <div className="lg:mx-0 md:mx-6 lg:my-[80px] mt-[42px] ">
            <div className="lg:colx-span-7 md:col-span-4">
              <h1 className="lg:text-3xl text-2xl tracking-wider font-semibold">
                Thông Tin Cá Nhân
              </h1>
            </div>
            <div className="grid lg:grid-cols-12 grid-cols-8 lg:gap-8 gap-2 lg:my-12 my-6">
              {/* Thanh bên */}
              <div className="lg:col-span-3 col-span-3 border border-hrblack xl:w-[262px] lg:w-[222px] w-[262px] lg:h-[524px] rounded-lg">
                <Sidebar />
              </div>
              <div className="lg:col-span-9  col-span-8 lg:pl-5">
                {/* Nội dung */}
                <div className="flex justify-between items-start">
                  <div className="flex gap-5 items-center">
                    <div className="relative">
                      <Avatar
                        src={avatarImage || url}
                        size={100}
                        className="border-4 border-white shadow-lg"
                      />
                      <Upload
                        showUploadList={false}
                        onChange={handleAvatarChange}
                        className="absolute bottom-0 right-0 "
                      >
                        <Button
                          type="primary"
                          shape="circle"
                          icon={<CameraOutlined />}
                          className="bg-blue-400 hover:bg-blue-500 text-white p-2"
                        />
                      </Upload>
                    </div>
                    <div>
                      {" "}
                      <h1 className=" text-2xl tracking-wider font-semibold mt-2">
                        {data?.data?.ho} {data?.data?.ten}
                        {data?.data?.gioi_tinh !== null &&
                        data?.data?.gioi_tinh === null ? (
                          <i className="fa-solid fa-mars text-[#74C0FC] mx-2"></i>
                        ) : data?.data?.gioi_tinh === 2 ? (
                          <i className="fa-regular fa-venus text-[#f39bf0] mx-2"></i>
                        ) : (
                          ""
                        )}
                      </h1>
                      <span className="font-medium">{data?.data?.email}</span>
                    </div>
                  </div>
                  <Link
                    to={"/myProfileedit"}
                    className="btn-black items-center md:px-8 md:py-4 px-4 py-2 flex whitespace-nowrap rounded-lg hover:text-black"
                  >
                    {" "}
                    <i className="fa-solid fa-pen-to-square" />
                    <span className="ml-3">Chỉnh Sửa Hồ Sơ</span>
                  </Link>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-5">
                  <div className="border rounded-md h-[400px] px-5">
                    <h1 className="text-xl font-semibold mt-5">Giới Thiệu</h1>
                    <div>
                      <h1 className="text-base font-semibold mt-5">
                        Thông tin cơ bản :
                      </h1>{" "}
                      <p className="mb-1">
                        <i className="fa-solid fa-cake-candles"></i>
                        <span className="mx-2">
                          {" "}
                          {convertDateToVietnameseFormat(data?.data?.ngay_sinh)}
                        </span>
                      </p>
                      <p className="mb-0">
                        <i className="fa-solid fa-person-half-dress"></i>
                        <span className="mx-2">
                          {" "}
                          {data?.data?.gioi_tinh == 3
                            ? "Khác"
                            : data?.data?.gioi_tinh == 1 &&
                                data?.data?.gioi_tinh == 2
                              ? ""
                              : "Không có thông tin"}
                        </span>
                      </p>
                      <h1 className="text-base font-semibold mt-5">
                        Thông tin liên hệ :
                      </h1>
                      <p className="mb-0">
                        <i className="fa-solid fa-phone-volume text-lg"></i>{" "}
                        <span className="mx-2">
                          {data?.data?.so_dien_thoai}
                        </span>
                      </p>
                      <p>
                        <i className="fa-regular fa-envelope text-lg"></i>
                        <span className="mx-2">{data?.data?.email}</span>
                      </p>
                      <h1 className="text-base font-semibold mt-5">
                        Nơi ở hiện tại:
                      </h1>
                      <p className="mb-0">
                        <i className="fa-solid fa-map-marker-alt text-lg"></i>{" "}
                        <span className="mx-2">{data?.data?.dia_chi}</span>
                      </p>
                    </div>
                  </div>
                  <div>
                    <h3 className=" text-gray-400 text-lg text-center">
                      Hạng thành viên
                    </h3>
                    <h2 className="text-center text-2xl font-bold">
                      {user?.hang_thanh_vien?.ten_hang_thanh_vien ??
                        "Thành viên mới"}
                    </h2>
                    <div className="w-60 mx-auto">
                      <img
                        src={
                          user?.hang_thanh_vien?.anh_hang_thanh_vien
                            ? user?.hang_thanh_vien?.anh_hang_thanh_vien
                            : "https://res.cloudinary.com/dcvu7e7ps/image/upload/v1729619625/game-level-icons-medals-stars-ui-badges-trophy_xsikh1.png"
                        }
                        alt={user?.hang_thanh_vien?.anh_hang_thanh_vien}
                        className="w-full  "
                      />
                    </div>
                    <p
                      className={`flex justify-center items-center gap-3 ${user?.hang_thanh_vien?.chi_tieu_toi_thieu >= 100 ? "" : "ml-7"}`}
                    >
                      <p className="pt-4">
                        {(user?.hang_thanh_vien?.chi_tieu_toi_thieu
                          ? user?.hang_thanh_vien?.chi_tieu_toi_thieu
                          : 0
                        ).toLocaleString("vi-VN")}{" "}
                      </p>
                      <div className="w-40">
                        <Progress
                          percent={phantram}
                          strokeColor={{
                            "0%": "#6dd5ed",
                            "100%": "#00bfff", // Màu chuyển tiếp
                          }}
                          trailColor="#333"
                          strokeWidth={10}
                          showInfo={false} // Hiện thị tỷ lệ
                          style={{ borderRadius: "25px" }} // Đường viền tròn
                        />
                      </div>{" "}
                      <p className="pt-4">
                        {user?.hang_thanh_vien?.chi_tieu_toi_da
                          ? user?.hang_thanh_vien?.chi_tieu_toi_da
                          : 500.0}{" "}
                      </p>
                    </p>
                  </div>
                </div>
                {/* <form className="my-8 mb-8">
                  <div className="flex justify-between  mb-7">
                    <div className="">
                      <label htmlFor="name" className="text-md px-3">
                        {" "}
                        Tên
                      </label>
                      <br />
                      <input
                        type="text"
                        defaultValue="Robert"
                        readOnly
                        className="cursor-default border border-t-2 border-l-2 border-blackL px-5 py-3 xl:w-[403px] lg:w-[350px] md:w-[353px] sm:w-[273px] h-14 focus:ring-1 focus:ring-slate-500 rounded-xl mr-2"
                      />
                    </div>
                    <div className="">
                      <label htmlFor="name" className="text-md px-3">
                        Họ
                      </label>
                      <br />
                      <input
                        type="text"
                        defaultValue="Fox"
                        readOnly
                        className="border border-t-2 border-l-2 border-blackL px-5 py-3 xl:w-[403px]  lg:w-[350px] md:w-[353px] sm:w-[273px] h-14 focus:ring-1 focus:ring-slate-500 rounded-xl"
                      />
                    </div>
                  </div>
                  <div className="flex justify-between  mb-7">
                    <div className="">
                      <label htmlFor="name" className="text-md px-3">
                        {" "}
                        Số Điện Thoại
                      </label>
                      <br />
                      <input
                        id="name"
                        type="number"
                        readOnly
                        className="cursor-default border border-t-2 border-l-2 border-blackL px-5 py-3 xl:w-[403px]  lg:w-[350px] md:w-[353px] sm:w-[273px] h-14 focus:ring-1 focus:ring-slate-500 rounded-xl mr-2"
                      />
                    </div>
                    <div className="">
                      <label htmlFor="name" className="text-md px-3">
                        Địa Chỉ Email
                      </label>
                      <br />
                      <input
                        type="text"
                        defaultValue="rebert@gmail.com"
                        readOnly
                        className="border border-t-2 border-l-2 border-blackL px-5 py-3 xl:w-[403px]  lg:w-[350px] md:w-[353px] sm:w-[273px] h-14 focus:ring-1 focus:ring-slate-500 rounded-xl"
                      />
                    </div>
                  </div>
                  <div className="my-5">
                    <label htmlFor="name" className="text-md px-1">
                      {" "}
                      Địa Chỉ
                    </label>
                    <br />
                    <input
                      id="name"
                      type="text"
                      defaultValue="Đối Diện Bưu Điện Hà Đông(15 Quang Trung Hà Đông)"
                      readOnly
                      className="border border-t-2 border-l-2 border-blackL px-5 py-3 w-full focus:ring-1 focus:ring-slate-500 rounded-xl"
                    />
                  </div>
                </form> */}
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default ListMyProfile;
