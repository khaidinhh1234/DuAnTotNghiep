import { ellipse, hello } from "@/assets/img";
import { Link } from "react-router-dom";
import Sidebar from "./../../_component/Slibar";

const MyProfilePage = ({ member }: any) => {
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
                    <Link to="">
                      {" "}
                      <i className="fa-regular fa-pen-to-square text-sm pl-[6px] pb-[6px] pt-1 pr-1 rounded-lg bg-blackL text-white absolute -right-0 -bottom-0" />
                    </Link>
                    <img
                      src={ellipse}
                      alt=""
                      className="md:w-20 md:h-20 w-14 h-14 rounded-full"
                    />
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
