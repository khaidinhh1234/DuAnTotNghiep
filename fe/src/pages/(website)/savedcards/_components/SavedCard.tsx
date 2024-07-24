import { ellipse, hello, master, visa } from '@/assets/img'
import React from 'react'
import { Link } from 'react-router-dom'

const SavedCardPage = () => {
    return (
        <>
            <main>
                {/* My Wishlist */}
                <section className="container ">
                    <div className="lg:mx-14 md:mx-6 lg:my-[80px] mt-[42px] ">
                        <div className="grid lg:grid-cols-12 md:grid-cols-8 gap-2 items-center">
                            <div className="lg:colx-span-7 md:col-span-4">
                                <h1 className="lg:text-4xl text-3xl tracking-wider font-medium">My Profile</h1>
                            </div>
                        </div>
                        <div className="grid lg:grid-cols-12 grid-cols-8 lg:gap-8 gap-2 lg:my-12 my-6">
                            {/* Sidebar */}
                            <div className="lg:col-span-3 col-span-3 border border-hrblack xl:w-[262px] lg:w-[222px] w-[262px] lg:h-[524px] rounded-lg">
                                <div className="flex items-center p-5 border-b border-hrBlack">
                                    <img src={ellipse} alt className="rounded-full md:w-[51px] md:h-[51px]" />
                                    <div className="px-4 py-2">
                                        <span className='' />
                                        <img src={hello} className="px-[2px]" alt />
                                        <h4 className="font-bold text-lg">Robert Fox</h4>
                                    </div>
                                    <div className="lg:hidden ">
                                        <button> <i className=" fa-solid fa-layer-group pl-5 text-xl" /></button>
                                    </div> </div>
                                    <nav className="lg:block hidden py-5 w-full">
                                    <ul className="space-y-2">
                                        <li>
                                            <a href="#" className="hover:bg-black hover:text-white w-full  px-5 py-3 flex items-center">
                                                <i className="fa-regular fa-user mr-3" />Personal Information
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#" className="hover:bg-black hover:text-white w-full  px-5 py-3 flex items-center">
                                                <i className="fa-regular fa-box mr-3" />My Orders
                                            </a>
                                        </li>
                                        <li>
                                            <Link to="/mywishlist" className="hover:bg-black hover:text-white w-full  px-5 py-3 flex items-center">
                                                <i className="fa-regular fa-heart mr-3" />My Wishlist
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="/manageaddresses" className="hover:bg-black hover:text-white w-full  px-5 py-3 flex items-center">
                                                <i className="fa-regular fa-location-dot mr-3" />Manage Addresses
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="/savedcard" className="hover:bg-black hover:text-white w-full  px-5 py-3 flex items-center">
                                                <i className="fa-light fa-credit-card mr-3" />Saved Cards
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="/notification" className="hover:bg-black hover:text-white w-full  px-5 py-3 flex items-center">
                                                <i className="fa-regular fa-bell mr-3" />Notifications
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="/setting" className="hover:bg-black hover:text-white w-full  px-5 py-3 flex items-center">
                                                <i className="fa-regular fa-gear mr-3" />Settings
                                            </Link>
                                        </li>
                                    </ul>
                                </nav>
                            </div>
                            <div className="lg:col-span-9  col-span-8 lg:pl-5">
                                {/* Content */}
                                <div className="mt-2 mb-8"><button className="btn-black lg:w-[320px] w-[220px] h-14 rounded-lg"><i className="fa-solid fa-plus mr-4" /> Add New Card</button></div>
                                <div className="flex my-5 justify-between items-center border-b border-hrBlack pb-5">
                                    <div className="flex"><img src={master} alt className="w-16 h-16 px-1 py-3 bg-neutral-100 rounded-lg" />
                                        <div className="px-4 "><h4 className="font-bold text-xl mb-3">Master Card</h4>
                                            <span>3456 XXX3 5433 9XX8</span></div></div><button className="bg-rose-100/70 text-red-400 hover:bg-[#FF7262]  w-[85px] h-[38px] hover:text-white rounded-lg">
                                        <i className="fa-regular fa-trash-can pr-2"> </i>Delete
                                    </button></div>
                                <div className="flex my-5 justify-between items-center border-b border-hrBlack pb-5">
                                    <div className="flex"><img src={visa} alt className="w-16 h-16 px-1 py-3 bg-neutral-100 rounded-lg" />
                                        <div className="px-4 "><h4 className="font-bold text-xl mb-3">Visa Card</h4>
                                            <span>3456 XXX3 5433 9XX8</span></div></div><button className="bg-rose-100/70 text-red-400 hover:bg-[#FF7262]  w-[85px] h-[38px] hover:text-white rounded-lg">
                                        <i className="fa-regular fa-trash-can pr-2"> </i>Delete
                                    </button></div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

        </>
    )
}

export default SavedCardPage
