import { ellipse, hello, master, visa } from "@/assets/img";
import { Link } from "react-router-dom";
import Sidebar from "./../../_component/Slibar";

const SavedCardPage = () => {
  return (
    <>
      <div className="lg:col-span-9  col-span-8 lg:pl-5">
        {/* Nội dung */}
        <div className="mt-2 mb-8">
          <button className="btn-black lg:w-[320px] w-[220px] h-14 rounded-lg">
            <i className="fa-solid fa-plus mr-4" /> Thêm thẻ mới
          </button>
        </div>
        <div className="flex my-5 justify-between items-center border-b border-hrBlack pb-5">
          <div className="flex">
            <img
              src={master}
              className="w-16 h-16 px-1 py-3 bg-neutral-100 rounded-lg"
            />
            <div className="px-4 ">
              <h4 className="font-bold text-xl mb-3">Thẻ Master</h4>
              <span>3456 XXX3 5433 9XX8</span>
            </div>
          </div>
          <button className="bg-rose-100/70 text-red-400 hover:bg-[#FF7262]  w-[85px] h-[38px] hover:text-white rounded-lg">
            <i className="fa-regular fa-trash-can pr-2"> </i>Xóa
          </button>
        </div>
        <div className="flex my-5 justify-between items-center border-b border-hrBlack pb-5">
          <div className="flex">
            <img
              src={visa}
              className="w-16 h-16 px-1 py-3 bg-neutral-100 rounded-lg"
            />
            <div className="px-4 ">
              <h4 className="font-bold text-xl mb-3">Thẻ Visa</h4>
              <span>3456 XXX3 5433 9XX8</span>
            </div>
          </div>
          <button className="bg-rose-100/70 text-red-400 hover:bg-[#FF7262]  w-[85px] h-[38px] hover:text-white rounded-lg">
            <i className="fa-regular fa-trash-can pr-2"> </i>Xóa
          </button>
        </div>
      </div>
    </>
  );
};

export default SavedCardPage;
