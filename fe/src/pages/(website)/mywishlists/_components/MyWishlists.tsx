import { ellipse, hello, sanPham2 } from '@/assets/img'
import React from 'react'
import { Link } from 'react-router-dom'

const MyWishlistsPage = () => {
    return (
        <>
            <main>
                {/* My Wishlist */}
                <section className="container ">
                    <div className="lg:mx-14 md:mx-6 lg:my-[80px] mt-[42px] ">
                        <div className="lg:colx-span-7 md:col-span-4">
                            <h1 className="lg:text-4xl text-3xl tracking-wider font-medium">My Profile</h1>
                        </div>
                        <div className="grid lg:grid-cols-12 grid-cols-8 lg:gap-8 gap-2 lg:my-12 my-6">
                            {/* Sidebar */}
                            <div className="lg:col-span-3 col-span-3 border border-hrblack xl:w-[262px] lg:w-[222px] w-[262px] lg:h-[524px] rounded-lg">
                                <div className="flex items-center p-5 border-b border-hrBlack">
                                    <img src={ellipse} alt='' className="rounded-full md:w-[51px] md:h-[51px]" />
                                    <div className="px-4 py-2">
                                        <span className='' />
                                        <img src={hello} className="px-[2px]" alt='' />
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
                                <div className=" grid grid-cols-12 gap-7">
                                    <div className="col-span-4 mb-2 ">
                                        <div className="product-card hover:bg-zinc-100">
                                            <div className="w-[250px] h-[330px] relative ">
                                                <a href="#"><i className="fa-solid fa-trash-can text-red-500 bg-white  px-3 py-[10px] rounded-full absolute top-5 right-6 btn invisible opacity-0 transition-opacity duration-300" /></a>
                                                <img src={sanPham2} alt='' className=" w-full h-full" />
                                                <button className="hover:bg-blackL hover:text-white absolute px-16 py-3 left-4 rounded-lg bottom-5 bg-white  invisible opacity-30 transition-opacity btn duration-300">Move to Cart</button></div>
                                            <div className="bg-white pt-4">
                                                <a href="#"><h5 className="font-bold">Allen Solly</h5></a>
                                                <p className="my-1">Women Texttured Handheld Bag</p>
                                                <p className="font-medium">$80.00 <span className="text-black/20 line-through px-1">$100.00</span></p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-span-4 mb-2 ">
                                        <div className="product-card hover:bg-zinc-100">
                                            <div className="w-[250px] h-[330px] relative ">
                                                <a href="#"><i className="fa-solid fa-trash-can text-red-500 bg-white  px-3 py-[10px] rounded-full absolute top-5 right-6 btn invisible opacity-0 transition-opacity duration-300" /></a>
                                                <img src={sanPham2} alt='' className=" w-full h-full" />
                                                <button className="hover:bg-blackL hover:text-white absolute px-16 py-3 left-4 rounded-lg bottom-5 bg-white  invisible opacity-30 transition-opacity btn duration-300">Move to Cart</button></div>
                                            <div className="bg-white pt-4">
                                                <a href="#"><h5 className="font-bold">Allen Solly</h5></a>
                                                <p className="my-1">Women Texttured Handheld Bag</p>
                                                <p className="font-medium">$80.00 <span className="text-black/20 line-through px-1">$100.00</span></p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-span-4 mb-2 ">
                                        <div className="product-card hover:bg-zinc-100">
                                            <div className="w-[250px] h-[330px] relative ">
                                                <a href="#"><i className="fa-solid fa-trash-can text-red-500 bg-white  px-3 py-[10px] rounded-full absolute top-5 right-6 btn invisible opacity-0 transition-opacity duration-300" /></a>
                                                <img src={sanPham2} alt='' className=" w-full h-full" />
                                                <button className="hover:bg-blackL hover:text-white absolute px-16 py-3 left-4 rounded-lg bottom-5 bg-white  invisible opacity-30 transition-opacity btn duration-300">Move to Cart</button></div>
                                            <div className="bg-white pt-4">
                                                <a href="#"><h5 className="font-bold">Allen Solly</h5></a>
                                                <p className="my-1">Women Texttured Handheld Bag</p>
                                                <p className="font-medium">$80.00 <span className="text-black/20 line-through px-1">$100.00</span></p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-span-4 mb-2 ">
                                        <div className="product-card hover:bg-zinc-100">
                                            <div className="w-[250px] h-[330px] relative ">
                                                <a href="#"><i className="fa-solid fa-trash-can text-red-500 bg-white  px-3 py-[10px] rounded-full absolute top-5 right-6 btn invisible opacity-0 transition-opacity duration-300" /></a>
                                                <img src={sanPham2} alt='' className=" w-full h-full" />
                                                <button className="hover:bg-blackL hover:text-white absolute px-16 py-3 left-4 rounded-lg bottom-5 bg-white  invisible opacity-30 transition-opacity btn duration-300">Move to Cart</button></div>
                                            <div className="bg-white pt-4">
                                                <a href="#"><h5 className="font-bold">Allen Solly</h5></a>
                                                <p className="my-1">Women Texttured Handheld Bag</p>
                                                <p className="font-medium">$80.00 <span className="text-black/20 line-through px-1">$100.00</span></p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-span-4 mb-2 ">
                                        <div className="product-card hover:bg-zinc-100">
                                            <div className="w-[250px] h-[330px] relative ">
                                                <a href="#"><i className="fa-solid fa-trash-can text-red-500 bg-white  px-3 py-[10px] rounded-full absolute top-5 right-6 btn invisible opacity-0 transition-opacity duration-300" /></a>
                                                <img src={sanPham2} alt='' className=" w-full h-full" />
                                                <button className="hover:bg-blackL hover:text-white absolute px-16 py-3 left-4 rounded-lg bottom-5 bg-white  invisible opacity-30 transition-opacity btn duration-300">Move to Cart</button></div>
                                            <div className="bg-white pt-4">
                                                <a href="#"><h5 className="font-bold">Allen Solly</h5></a>
                                                <p className="my-1">Women Texttured Handheld Bag</p>
                                                <p className="font-medium">$80.00 <span className="text-black/20 line-through px-1">$100.00</span></p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-span-4 mb-2 ">
                                        <div className="product-card hover:bg-zinc-100">
                                            <div className="w-[250px] h-[330px] relative ">
                                                <a href="#"><i className="fa-solid fa-trash-can text-red-500 bg-white  px-3 py-[10px] rounded-full absolute top-5 right-6 btn invisible opacity-0 transition-opacity duration-300" /></a>
                                                <img src={sanPham2} alt='' className=" w-full h-full" />
                                                <button className="hover:bg-blackL hover:text-white absolute px-16 py-3 left-4 rounded-lg bottom-5 bg-white  invisible opacity-30 transition-opacity btn duration-300">Move to Cart</button></div>
                                            <div className="bg-white pt-4">
                                                <a href="#"><h5 className="font-bold">Allen Solly</h5></a>
                                                <p className="my-1">Women Texttured Handheld Bag</p>
                                                <p className="font-medium">$80.00 <span className="text-black/20 line-through px-1">$100.00</span></p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

        </>
    )
}

export default MyWishlistsPage