import { logo } from "@/assets/img";
import React from "react";

const Header = () => {
  return (
    <header>
      <div className="container my-3">
        <div className="flex justify-around lg:justify-between items-center">
          <div className="order-1 lg:hidden">
            <i className="fa-solid fa-bars text-2xl" />
          </div>
          <div className="order-2 Logo lg:w-60">
            <img
              src={logo}
              alt=""
              className="lg:w-[143px] lg:h-[42.24px] w-32 h-8"
            />
          </div>
          <nav className="order-3 hidden lg:block">
            <ul className="flex items-center space-x-2">
              <li>
                <a
                  href="/"
<<<<<<< HEAD
                  className="hover:shadow-slate-500/50 font-medium hover:text-white text-lg hover:bg-black hover:shadow-lg hover:border-0 px-4 py-2 rounded-[7px]"
=======
                  className="hover:shadow-slate-500/50 font-medium hover:text-white text-lg hover:bg-black hover:shadow-lg hover:border-0 px-4 py-2 rounded-lg"
>>>>>>> 86fa7cf0be720c149244411ea5d6f95edad3575b
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/shop"
<<<<<<< HEAD
                  className="hover:shadow-slate-500/50 font-medium hover:text-white text-lg hover:bg-black hover:shadow-lg hover:border-0 px-4 py-2 rounded-[7px]"
=======
                  className="hover:shadow-slate-500/50 font-medium hover:text-white text-lg hover:bg-black hover:shadow-lg hover:border-0 px-4 py-2 rounded-lg"
>>>>>>> 86fa7cf0be720c149244411ea5d6f95edad3575b
                >
                  Shop
                </a>
              </li>
              <li>
                <a
                  href="/ourstory"
<<<<<<< HEAD
                  className="hover:shadow-slate-500/50 font-medium hover:text-white text-lg hover:bg-black hover:shadow-lg hover:border-0 px-4 py-2 rounded-[7px]"
=======
                  className="hover:shadow-slate-500/50 font-medium hover:text-white text-lg hover:bg-black hover:shadow-lg hover:border-0 px-4 py-2 rounded-lg"
>>>>>>> 86fa7cf0be720c149244411ea5d6f95edad3575b
                >
                  Our Story
                </a>
              </li>
              <li>
                <a
                  href=""
<<<<<<< HEAD
                  className="hover:shadow-slate-500/50 font-medium hover:text-white text-lg hover:bg-black hover:shadow-lg hover:border-0 px-4 py-2 rounded-[7px]"
=======
                  className="hover:shadow-slate-500/50 font-medium hover:text-white text-lg hover:bg-black hover:shadow-lg hover:border-0 px-4 py-2 rounded-lg"
>>>>>>> 86fa7cf0be720c149244411ea5d6f95edad3575b
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  href=""
<<<<<<< HEAD
                  className="hover:shadow-slate-500/50 font-medium hover:text-white text-lg hover:bg-black hover:shadow-lg hover:border-0 px-4 py-2 rounded-[7px]"
=======
                  className="hover:shadow-slate-500/50 font-medium hover:text-white text-lg hover:bg-black hover:shadow-lg hover:border-0 px-4 py-2 rounded-lg"
>>>>>>> 86fa7cf0be720c149244411ea5d6f95edad3575b
                >
                  Contact Us
                </a>
              </li>
            </ul>
          </nav>
          <div className="order-4 icon space-x-6 *:cursor-pointer">
            <span>
              <i className="fa-solid fa-magnifying-glass text-xl" />
            </span>
            <span>
              <i className="fa-regular fa-heart text-xl" />
            </span>
            <span>
              <a href="/gio-hang">
                <i className="fa-regular fa-bag-shopping text-xl relative">
                  <span className="-bottom-1 left-[10px] w-4 h-4 text-[10px] bg-red-500 rounded-full absolute text-white flex items-center justify-center">
                    0
                  </span>
                </i>
              </a>
            </span>
<<<<<<< HEAD
            <button className="btn-black bg-black text-white hover:bg-white hover:border-black border hover:text-black lg:text-lg lg:py-3 lg:px-7 py-2 px-5 font-serif rounded-2xl">
=======
            <button className="bg-blackL  border-black shadow-lg shadow-slate-600/50 hover:text-black hover:border-0 hover:bg-white text-white px-6 py-3 rounded-xl text-lg font-medium">
>>>>>>> 86fa7cf0be720c149244411ea5d6f95edad3575b
              Login
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
