import { ellipse, hello } from "@/assets/img";
import { Link } from "react-router-dom";

const NotificationPage = () => {
  return (
    <>
      <main>
        {/* My Wishlist */}
        <section className="container ">
          <div className="lg:mx-14 md:mx-6 lg:my-[80px] mt-[42px] ">
            <div className="grid lg:grid-cols-12 md:grid-cols-8 gap-2 items-center">
              <div className="lg:colx-span-7 md:col-span-4">
                <h1 className="lg:text-4xl text-3xl tracking-wider font-medium">
                  My Profile
                </h1>
              </div>
            </div>
            <div className="grid lg:grid-cols-12 grid-cols-8 lg:gap-8 gap-2 lg:my-12 my-6">
              {/* Sidebar */}
              <div className="lg:col-span-3 col-span-3 border border-hrblack xl:w-[262px] lg:w-[222px] w-[262px] lg:h-[524px] rounded-lg">
                <div className="flex items-center p-5 border-b border-hrBlack">
                  <img
                    src={ellipse}
                    alt={ellipse}
                    className="rounded-full md:w-[51px] md:h-[51px]"
                  />
                  <div className="px-4 py-2">
                    <span className="" />
                    <img src={hello} className="px-[2px]" alt={ellipse} />
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
                      <a
                        href="#"
                        className="hover:bg-black hover:text-white w-full  px-5 py-3 flex items-center"
                      >
                        <i className="fa-regular fa-user mr-3" />
                        Personal Information
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="hover:bg-black hover:text-white w-full  px-5 py-3 flex items-center"
                      >
                        <i className="fa-regular fa-box mr-3" />
                        My Orders
                      </a>
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
              <div className="lg:col-span-9  col-span-8 lg:pl-5">
                {/* Content */}
                <div className="flex justify-between items-end border-b border-hrBlack pb-5 mb-5">
                  <div className="flex">
                    <img
                      src={ellipse}
                      alt={ellipse}
                      className="w-14 h-14 rounded-full"
                    />
                    <div className="px-4">
                      <h4 className="font-bold text-base mb-2">
                        Profile Update
                      </h4>
                      <p className="text-[#A4A1AA]">
                        Your order placed successfullty
                      </p>
                    </div>
                  </div>
                  <p className="text-[#A4A1AA] capitalize">just now</p>
                </div>
                <div className="flex justify-between items-end border-b border-hrBlack pb-5 mb-5">
                  <div className="flex items-center">
                    <i className="fa-regular fa-box  w-14 h-14 bg-neutral-200 rounded-full text-center py-4 text-2xl " />
                    <div className="px-4">
                      <h4 className="font-bold text-base mb-2">
                        Your order placed successfullty
                      </h4>
                      <p className="text-[#A4A1AA]">Your placed a new order</p>
                    </div>
                  </div>
                  <p className="text-[#A4A1AA] capitalize">11:16 AM</p>
                </div>
                <div className="flex justify-between items-end border-b border-hrBlack pb-5 mb-5">
                  <div className="flex">
                    <img
                      src={ellipse}
                      alt={ellipse}
                      className="w-14 h-14 rounded-full"
                    />
                    <div className="px-4">
                      <h4 className="font-bold text-base mb-2">
                        Profile Update
                      </h4>
                      <p className="text-[#A4A1AA]">
                        Your order placed successfullty
                      </p>
                    </div>
                  </div>
                  <p className="text-[#A4A1AA] capitalize">just now</p>
                </div>
                <div className="flex justify-between items-end border-b border-hrBlack pb-5 mb-5">
                  <div className="flex items-center">
                    <i className="fa-regular fa-box  w-14 h-14 bg-neutral-200 rounded-full text-center py-4 text-2xl " />
                    <div className="px-4">
                      <h4 className="font-bold text-base mb-2">
                        Your order placed successfullty
                      </h4>
                      <p className="text-[#A4A1AA]">Your placed a new order</p>
                    </div>
                  </div>
                  <p className="text-[#A4A1AA] capitalize">11:16 AM</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default NotificationPage;
