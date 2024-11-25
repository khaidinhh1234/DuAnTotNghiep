import { CameraOutlined } from "@ant-design/icons";
import { Avatar, Button, Progress } from "antd";
import Sidebar from "./../../_component/Slibar";
// import ProfileTab from './ProfileTab';
import { Upload } from "antd";
import { useEffect, useState } from "react";
import { useLocalStorage } from "@/components/hook/useStoratge";
import { useMutation, useQuery } from "@tanstack/react-query";
import instanceClient from "@/configs/client";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { uploadToCloudinary } from "@/configs/cloudinary";

const ListMyProfile = ({ member }: any) => {
  const [avatarImage, setAvatarImage] = useState<string>("");
  const [{ user }, setUser] = useLocalStorage("user" as any, {});
  const [tempImageUrl, setTempImageUrl] = useState<string>("");

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "user") {
        const newUser = JSON.parse(event.newValue || "{}");
        setUser(newUser);
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Dọn dẹp khi component unmount
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [setUser]);
  const url = user.anh_nguoi_dung;

  const { data, refetch } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      try {
        const response = await instanceClient.post("/cap-nhat-thong-tin");
        return response.data;
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    },
  });

  // console.log(hang_thanh_vien);
  const updateAvatarMutation = useMutation({
    mutationFn: async (file: File) => {
      const imageUrl = await uploadToCloudinary(file);
      await instanceClient.post("/cap-nhat-thong-tin", {
        anh_nguoi_dung: imageUrl,
      });
      return imageUrl;
    },
    onSuccess: (imageUrl) => {
      setUser((prev: any) => ({
        ...prev,
        user: {
          ...prev.user,
          anh_nguoi_dung: imageUrl,
        },
      }));
      setAvatarImage(imageUrl);
      setTempImageUrl("");
      refetch();
      // toast.success('Cập nhật ảnh đại diện thành công');
    },
    onError: () => {
      setTempImageUrl("");
      toast.error("Không thể cập nhật ảnh đại diện");
    },
  });

  const handleAvatarChange = async (info: any) => {
    if (info.file?.originFileObj) {
      setTempImageUrl(URL.createObjectURL(info.file.originFileObj));
      updateAvatarMutation.mutate(info.file.originFileObj);
    }
  };
  const userpro = data?.data.user;
  const hang_thanh_vien = userpro?.hang_thanh_vien;
  function convertDateToVietnameseFormat(dateString: any) {
    if (!dateString) return ""; // Kiểm tra nếu không có dữ liệu
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Tháng bắt đầu từ 0
    const year = date.getFullYear();

    return `${day} tháng ${month} Năm ${year}`;
  }
  const phantram =
    ((data?.data?.tong_tien_hang - hang_thanh_vien?.chi_tieu_toi_thieu) /
      (hang_thanh_vien?.chi_tieu_toi_da -
        hang_thanh_vien?.chi_tieu_toi_thieu)) *
    100;
  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div className="flex flex-col md:flex-row gap-5 items-center">
          <div className="relative">
            <Avatar
              src={tempImageUrl || avatarImage || url}
              size={100}
              className="border-4 border-white shadow-lg bg-top bg-no-repeat"
            />
            {updateAvatarMutation.isPending && (
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.3s]">
                    .
                  </span>
                  <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.2s]">
                    .
                  </span>
                  <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.1s]">
                    .
                  </span>
                </div>
              </div>
            )}
            <Upload
              showUploadList={false}
              onChange={handleAvatarChange}
              className="absolute bottom-0 right-0"
              disabled={updateAvatarMutation.isPending}
            >
              <Button
                type="primary"
                shape="circle"
                icon={<CameraOutlined />}
                disabled={updateAvatarMutation.isPending}
                className={`${
                  updateAvatarMutation.isPending
                    ? "bg-gray-400"
                    : "bg-blue-400 hover:bg-blue-500"
                } text-white p-2`}
              />
            </Upload>
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-2xl tracking-wider font-semibold mt-2">
              {userpro?.ho} {userpro?.ten}
              {userpro?.gioi_tinh !== null &&
                (userpro?.gioi_tinh === 1 ? (
                  <i className="fa-solid fa-mars text-[#74C0FC] mx-2"></i>
                ) : userpro?.gioi_tinh === 2 ? (
                  <i className="fa-regular fa-venus text-[#f39bf0] mx-2"></i>
                ) : (
                  ""
                ))}
            </h1>
            <span className="font-medium">
              {userpro?.email ?? "không có dữ liệu"}
            </span>
          </div>
        </div>
        <Link
          to="/mypro/myProfileedit"
          className="btn-black flex items-center md:px-8 md:py-4 px-4 py-2 rounded-lg hover:text-black mt-4 md:mt-0"
        >
          <i className="fa-solid fa-pen-to-square" />
          <span className="ml-3">Chỉnh Sửa Hồ Sơ</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-5">
        <div className="border rounded-md p-5 h-auto">
          <h1 className="text-xl font-semibold mt-5">Giới Thiệu</h1>
          <div>
            <h1 className="text-base font-semibold mt-5">Thông tin cơ bản:</h1>
            <p className="mb-1">
              <i className="fa-solid fa-cake-candles"></i>
              <span className="mx-2">
                {userpro?.ngay_sinh
                  ? convertDateToVietnameseFormat(userpro?.ngay_sinh)
                  : "không có dữ liệu"}
              </span>
            </p>
            <p className="mb-0">
              <i className="fa-solid fa-person-half-dress"></i>
              <span className="mx-2">
                {userpro?.gioi_tinh === 1
                  ? "Nam"
                  : userpro?.gioi_tinh === 2
                    ? "Nữ"
                    : userpro?.gioi_tinh === 2
                      ? "khác"
                      : "không có dữ liệu"}
              </span>
            </p>
            <h1 className="text-base font-semibold mt-5">Thông tin liên hệ:</h1>
            <p className="mb-0">
              <i className="fa-solid fa-phone-volume text-lg"></i>
              <span className="mx-2">
                {userpro?.so_dien_thoai ?? "không có dữ liệu"}
              </span>
            </p>
            <p>
              <i className="fa-regular fa-envelope text-lg"></i>
              <span className="mx-2">
                {userpro?.email ?? "không có dữ liệu"}
              </span>
            </p>
            <h1 className="text-base font-semibold mt-5">Nơi ở hiện tại:</h1>
            <p className="mb-0">
              <i className="fa-solid fa-map-marker-alt text-lg"></i>
              <span className="mx-2">
                {userpro?.dia_chi ?? "không có dữ liệu"}
              </span>
            </p>
          </div>
        </div>
        <div>
          <h3 className="text-gray-400 text-lg text-center">Hạng thành viên</h3>
          <h2 className="text-center text-2xl font-bold">
            {hang_thanh_vien?.ten_hang_thanh_vien ?? "Thành viên mới"}
          </h2>
          <div className="w-60 mx-auto">
            <img
              src={
                hang_thanh_vien?.anh_hang_thanh_vien ||
                "https://res.cloudinary.com/dcvu7e7ps/image/upload/v1729619625/game-level-icons-medals-stars-ui-badges-trophy_xsikh1.png"
              }
              alt={hang_thanh_vien?.anh_hang_thanh_vien}
              className="w-full"
            />
          </div>
          <div className="flex justify-center items-center gap-3 mt-4">
            <p className="pt-4">
              {(hang_thanh_vien?.chi_tieu_toi_thieu || 0).toLocaleString(
                "vi-VN"
              )}
            </p>
            <div className="w-40">
              <Progress
                percent={phantram ?? 43}
                strokeColor={{ "0%": "#6dd5ed", "100%": "#00bfff" }}
                trailColor="#333"
                strokeWidth={10}
                showInfo={false}
                style={{ borderRadius: "25px" }}
              />
            </div>
            <p className="pt-4">{hang_thanh_vien?.chi_tieu_toi_da || 500.0}</p>
          </div>
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
    </>
  );
};

export default ListMyProfile;
