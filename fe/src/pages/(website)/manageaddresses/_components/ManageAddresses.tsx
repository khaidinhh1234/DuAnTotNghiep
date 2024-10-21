import { ellipse, hello } from "@/assets/img";
import { Link } from "react-router-dom";
import Sidebar from "./../../_component/Slibar";

const ManageAddressesPage = () => {
  return (
    <>
      <main>
        {/* Danh sách yêu thích của tôi */}
        <section className="container ">
          <div className="lg:mx-0 md:mx-6 lg:my-[80px] mt-[42px] ">
            <div className="grid lg:grid-cols-12 md:grid-cols-8 gap-2 items-center">
              <div className="lg:colx-span-7 md:col-span-4">
                <h1 className="lg:text-4xl text-3xl tracking-wider font-medium">
                  Hồ Sơ Của Tôi
                </h1>
              </div>
            </div>
            <div className="grid lg:grid-cols-12 grid-cols-8 lg:gap-8 gap-2 lg:my-12 my-6">
              {/* Thanh bên */}
              <div className="lg:col-span-3 col-span-3 border border-hrblack xl:w-[262px] lg:w-[222px] w-[262px] lg:h-[524px] rounded-lg">
                <Sidebar />
              </div>
              <div className="lg:col-span-9  col-span-8 lg:pl-5">
                {/* Nội dung */}
                <div className="my-2">
                  <button className="btn-black lg:w-[320px] w-[220px] h-14 rounded-lg">
                    <i className="fa-solid fa-plus mr-4" /> Thêm Địa Chỉ Mới
                  </button>
                </div>
                <div className="flex justify-between pt-6 pb-7 border-b border-hrBlack">
                  <div>
                    <h4 className="font-bold text-xl">Robert Fox</h4>
                    <p className="text-md py-2">
                      4517 Washingtion Ave . Manchester Kentucky 39495
                    </p>
                    <span className="text-lg font-medium">
                      <i className="fa-regular fa-phone-volume text-xl" /> (209)
                      555 014
                    </span>
                  </div>
                  <div className=" ">
                    <button className="bg-slate-200/50 hover:bg-blackL hover:text-white w-[85px] h-[38px] whitespace-nowrap text-center mb-2 rounded-lg">
                      <i className="fa-regular fa-pen-to-square  pr-2" />
                      Sửa
                    </button>
                    <br />
                    <button className="bg-rose-100/70 text-red-400 hover:bg-[#FF7262]  w-[85px] h-[38px] hover:text-white rounded-lg">
                      <i className="fa-regular fa-trash-can pr-2"> </i>Xóa
                    </button>
                  </div>
                </div>
                <div className="flex justify-between pt-6 pb-7 border-b border-hrBlack">
                  <div>
                    <h4 className="font-bold text-xl">Robert Fox</h4>
                    <p className="text-md py-2 md:w-full w-[280px]">
                      4517 Washingtion Ave . Manchester Kentucky 39495
                    </p>
                    <span className="text-lg font-medium">
                      <i className="fa-regular fa-phone-volume text-xl" /> (209)
                      555 014
                    </span>
                  </div>
                  <div className=" ">
                    <button className="bg-slate-200/50 hover:bg-blackL hover:text-white w-[85px] h-[38px] whitespace-nowrap text-center mb-2 rounded-lg">
                      <i className="fa-regular fa-pen-to-square  pr-2" />
                      Sửa
                    </button>
                    <br />
                    <button className="bg-rose-100/70 text-red-400 hover:bg-[#FF7262]  w-[85px] h-[38px] hover:text-white rounded-lg">
                      <i className="fa-regular fa-trash-can pr-2"> </i>Xóa
                    </button>
                  </div>
                </div>
                <div className="flex justify-between pt-6 pb-7 border-b border-hrBlack">
                  <div>
                    <h4 className="font-bold text-xl">Robert Fox</h4>
                    <p className="text-md py-2  md:w-full w-[280px]">
                      4517 Washingtion Ave . Manchester Kentucky 39495
                    </p>
                    <span className="text-lg font-medium">
                      <i className="fa-regular fa-phone-volume text-xl" /> (209)
                      555 014
                    </span>
                  </div>
                  <div className=" ">
                    <button className="bg-slate-200/50 hover:bg-blackL hover:text-white w-[85px] h-[38px] whitespace-nowrap text-center mb-2 rounded-lg">
                      <i className="fa-regular fa-pen-to-square  pr-2" />
                      Sửa
                    </button>
                    <br />
                    <button className="bg-rose-100/70 text-red-400 hover:bg-[#FF7262]  w-[85px] h-[38px] hover:text-white rounded-lg">
                      <i className="fa-regular fa-trash-can pr-2"> </i>Xóa
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default ManageAddressesPage;
