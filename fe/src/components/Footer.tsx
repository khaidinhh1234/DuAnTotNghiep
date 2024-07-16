import { logo } from "@/assets/img";
import React from "react";

type Props = {};

const Footer = () => {
  return (
    <div>
      <footer className="bg-black text-white">
      <div className="container">
        <div
          className="grid grid-cols-12 gap-8 mx-4 py-14 border-b border-stone-700"
        >
          <div className="lg:col-span-4 col-span-6">
            <div>
              <img
                src="http://localhost:5174/assets/images/Logo.svg "
                alt=""
                className="lg:w-[143px] lg:h-[42.24px] w-32 h-8"
              />
            </div>
            <div className="my-[39px] space-y-5 w-[261px]">
              <div className="*:px-1">
                <i className="fa-regular fa-phone-volume text-lg"></i>
                <span className="text-base">(704)555-0127</span>
              </div>
              <div className="*:px-1">
                <i className="fa-light fa-envelope text-lg"></i
                ><span className="mx-1">kist@example.com</span>
              </div>
              <div className="*:px-1 flex">
                <i className="fa-regular fa-location-dot text-lg"></i>
                <span className="mx-2 lg:w-full w-48"
                  >3891 Ranchview Dr.Richardson, California 626339</span
                >
              </div>
            </div>
          </div>
          <div className="lg:col-span-2 col-span-6">
            <h1 className="text-xl font-semibold mb-3">Information</h1>
            <ul className="">
              <li className="mb-3"><a href="" className="">My Acount</a></li>
              <li className="mb-3"><a href="">Login</a></li>
              <li className="mb-3"><a href="">My Cart</a></li>
              <li className="mb-3"><a href="">My Wishlist</a></li>

              <li className="mb-3"><a href="">Checkout</a></li>
            </ul>
          </div>
          <div className="lg:col-span-2 col-span-6">
            <h1 className="text-xl font-semibold mb-3">Service</h1>
            <ul>
              <li className="mb-3"><a href="">About Us</a></li>
              <li className="mb-3"><a href="">Careers</a></li>
              <li className="mb-3"><a href="">Delivery Information</a></li>
              <li className="mb-3"><a href="">Privacy Policy</a></li>
              <li className="mb-3"><a href="">Terms & Conditions</a></li>
            </ul>
          </div>
          <div className="lg:col-span-4 col-span-6">
            <h1 className="text-xl font-semibold mb-4">Subscribe</h1>
            <p className="lg:w-80 mb-5">
              Enter your email below to be the first to know about new
              collections and product launches.
            </p>
            <div className="relative">
              <i
                className="fa-regular fa-envelope absolute top-3 left-4 text-2xl"
              ></i>

              <input
                type="email"
                placeholder="Your Email"
                className="lg:w-[305px] w-[200px] bg-blackL text-[15px] py-3 px-12 rounded-lg text-white border shadow-lg shadow-slate-600/50 focus:ring focus:ring-blue-500 focus:ring-opacity-50 focus:outline-none placeholder-white"
              />
              <button type="submit">
                <i
                  className="fa-solid fa-arrow-right absolute text-gray-400 lg:top-4 lg:left-[270px] text-xl top-4 left-[170px]"
                ></i>
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-between py-3">
          <div className="">
            <img src={logo} alt="" className="h-7" />
          </div>
          <div>© 2024 Krist All Rights are Reserved.</div>
          <div className="*:text-2xl *:px-3">
            <i className="fa-brands fa-facebook"></i
            ><i className="fa-brands fa-instagram"></i
            ><i className="fa-brands fa-twitter"></i>
          </div>
        </div>
      </div>
    </footer>
    </div>
  );
};

export default Footer;
