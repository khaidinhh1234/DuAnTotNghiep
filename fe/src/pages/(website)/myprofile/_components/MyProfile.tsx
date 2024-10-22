import { CameraOutlined } from "@ant-design/icons";
import { Avatar, Button } from "antd";
import Sidebar from "./../../_component/Slibar";
// import ProfileTab from './ProfileTab';
import { Upload } from "antd";
import { useState } from "react";
import { useLocalStorage } from "@/components/hook/useStoratge";

const MyProfilePage = ({ member }: any) => {
  const [avatarImage, setAvatarImage] = useState<string>("");
  const [{ user }] = useLocalStorage("user" as any, {});
  const url = user.anh_nguoi_dung;
  const handleAvatarChange = (info: any) => {
    if (info.file && info.file.originFileObj) {
      const file = URL.createObjectURL(info.file.originFileObj);
      setAvatarImage(file);
    }
  };
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
                <div className="flex justify-between items-center">
                  <div className="relative">
                    <Avatar
                      src={avatarImage || url}
                      size={110}
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
                  <button className="btn-black items-center md:px-8 md:py-4 px-4 py-2 flex whitespace-nowrap rounded-lg hover:text-black">
                    {" "}
                    <i className="fa-solid fa-pen-to-square" />
                    <span className="ml-3">Chỉnh Sửa Hồ Sơ</span>
                  </button>
                </div>
                <form className="my-8 mb-8">
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
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default MyProfilePage;
