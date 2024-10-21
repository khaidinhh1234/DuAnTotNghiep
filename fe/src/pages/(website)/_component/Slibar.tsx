import React from "react";
import { ellipse, hello } from "@/assets/img";
import { Link } from "react-router-dom";
const Slibar = () => {
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
          <span className="" />
          <img src={hello} className="px-[2px]" alt="" />
          <h4 className="font-bold text-lg">Robert Fox</h4>
        </div>
        <div className="lg:hidden ">
          <button>
            {" "}
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
              Personal Information
            </Link>
          </li>
          <li>
            <Link
              to="/myorder"
              className="hover:bg-black hover:text-white w-full  px-5 py-3 flex items-center"
            >
              <i className="fa-regular fa-box mr-3" />
              My Orders
            </Link>
          </li>
          <li>
            <Link
              to="/mywishlist"
              className="hover:bg-black hover:text-white w-full  px-5 py-3 flex items-center"
            >
              <i className="fa-regular fa-heart mr-3" />
              My Wishlist
            </Link>
          </li>
          <li>
            <Link
              to="/manageaddresses"
              className="hover:bg-black hover:text-white w-full  px-5 py-3 flex items-center"
            >
              <i className="fa-regular fa-location-dot mr-3" />
              Manage Addresses
            </Link>
          </li>
          <li>
            <Link
              to="/savedcard"
              className="hover:bg-black hover:text-white w-full  px-5 py-3 flex items-center"
            >
              <i className="fa-light fa-credit-card mr-3" />
              Saved Cards
            </Link>
          </li>
          <li>
            <Link
              to="/notification"
              className="hover:bg-black hover:text-white w-full  px-5 py-3 flex items-center"
            >
              <i className="fa-regular fa-bell mr-3" />
              Notifications
            </Link>
          </li>
          <li>
            <Link
              to="/setting"
              className="hover:bg-black hover:text-white w-full  px-5 py-3 flex items-center"
            >
              <i className="fa-regular fa-gear mr-3" />
              Settings
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Slibar;
