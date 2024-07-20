import React from 'react';

const Sidebar = () => {
  return (
    <div className="lg:col-span-3 col-span-3 border border-hrblack xl:w-[262px] lg:w-[222px] w-[262px] lg:h-[524px] rounded-lg">
      <div className="flex items-center p-5 border-b border-hrBlack">
        <img
          src="../assets/images/myorder/Ellipse 958.png"
          alt=""
          className="rounded-full w-[51px] h-[51px]"
        />
        <div className="px-4 py-2">
          <span className="">
            <img
              src="../assets/images/myorder/Hello.png"
              className="px-[2px]"
              alt=""
            />
          </span>
          <h4 className="font-bold text-lg">Robert Fox</h4>
        </div>
        <div className="lg:hidden">
          <button>
            <i className="fa-solid fa-layer-group pl-5 text-xl"></i>
          </button>
        </div>
      </div>
      <nav className="lg:block hidden py-5 w-full">
        <ul className="space-y-2">
          <li>
            <a
              href="#"
              className="hover:bg-black hover:text-white w-full px-5 py-3 flex items-center"
            >
              <i className="fa-regular fa-user mr-3"></i>Personal Information
            </a>
          </li>
          <li>
            <a
              href="#"
              className="hover:bg-black hover:text-white w-full px-5 py-3 flex items-center"
            >
              <i className="fa-regular fa-box mr-3"></i>My Orders
            </a>
          </li>
          <li>
            <a
              href="#"
              className="hover:bg-black hover:text-white w-full px-5 py-3 flex items-center"
            >
              <i className="fa-regular fa-heart mr-3"></i>My Wishlist
            </a>
          </li>
          <li>
            <a
              href="#"
              className="hover:bg-black hover:text-white w-full px-5 py-3 flex items-center"
            >
              <i className="fa-regular fa-location-dot mr-3"></i>Manage Addresses
            </a>
          </li>
          <li>
            <a
              href="#"
              className="hover:bg-black hover:text-white w-full px-5 py-3 flex items-center"
            >
              <i className="fa-light fa-credit-card mr-3"></i>Saved Cards
            </a>
          </li>
          <li>
            <a
              href="#"
              className="hover:bg-black hover:text-white w-full px-5 py-3 flex items-center"
            >
              <i className="fa-regular fa-bell mr-3"></i>Notifications
            </a>
          </li>
          <li>
            <a
              href="#"
              className="hover:bg-black hover:text-white w-full px-5 py-3 flex items-center"
            >
              <i className="fa-regular fa-gear mr-3"></i>Settings
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
