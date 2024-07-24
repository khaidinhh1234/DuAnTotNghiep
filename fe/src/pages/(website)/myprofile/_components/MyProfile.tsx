import { ellipse, hello } from '@/assets/img'
import { Link } from 'react-router-dom'

const MyProfilePage = () => {
    return (
        <>
            <main>
                {/* My Orders */}
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
                                        <span className="" />
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
                                <div className="flex justify-between items-center">
                                    <div className="relative">
                                        <Link to=""> <i className="fa-regular fa-pen-to-square text-sm pl-[6px] pb-[6px] pt-1 pr-1 rounded-lg bg-blackL text-white absolute -right-0 -bottom-0" /></Link>
                                        <img src={ellipse} alt='' className="md:w-20 md:h-20 w-14 h-14 rounded-full" /></div>
                                    <button className="btn-black items-center md:px-8 md:py-4 px-4 py-2 flex whitespace-nowrap rounded-lg hover:text-black"> <i className="fa-solid fa-pen-to-square" />
                                        <span className="ml-3">Edit Profile</span>
                                    </button></div>
                                <form className="my-8 mb-8">
                                    <div className="flex justify-between  mb-7">
                                        <div className=''>
                                            <label htmlFor="name" className="text-md px-3"> Firt Name</label><br />
                                            <input type="text" defaultValue="Robert" readOnly className="cursor-default border border-t-2 border-l-2 border-blackL px-5 py-3 xl:w-[403px] lg:w-[350px] md:w-[353px] sm:w-[273px] h-14 focus:ring-1 focus:ring-slate-500 rounded-xl mr-2" />
                                        </div>
                                        <div className=''>
                                            <label htmlFor="name" className="text-md px-3">Last Name</label><br />
                                            <input type="text" defaultValue="Fox" readOnly className="border border-t-2 border-l-2 border-blackL px-5 py-3 xl:w-[403px]  lg:w-[350px] md:w-[353px] sm:w-[273px] h-14 focus:ring-1 focus:ring-slate-500 rounded-xl" />
                                        </div>
                                    </div>
                                    <div className="flex justify-between  mb-7">
                                        <div className=''>
                                            <label htmlFor="name" className="text-md px-3"> Phone Number</label><br />
                                            <input id='name' type="number"  readOnly className="cursor-default border border-t-2 border-l-2 border-blackL px-5 py-3 xl:w-[403px]  lg:w-[350px] md:w-[353px] sm:w-[273px] h-14 focus:ring-1 focus:ring-slate-500 rounded-xl mr-2" />
                                        </div>
                                        <div className=''>
                                            <label htmlFor="name" className="text-md px-3">Email Address</label><br />
                                            <input type="text" defaultValue="rebert@gmail.com" readOnly className="border border-t-2 border-l-2 border-blackL px-5 py-3 xl:w-[403px]  lg:w-[350px] md:w-[353px] sm:w-[273px] h-14 focus:ring-1 focus:ring-slate-500 rounded-xl" />
                                        </div>
                                    </div>
                                    <div className="my-5">
                                        <label htmlFor="name" className="text-md px-1"> Address</label><br />
                                        <input  id='name' type="text" defaultValue="Đối Diện Bưu Điện Hà Đông(15 Quang Trung Hà Đông)" readOnly className="border border-t-2 border-l-2 border-blackL px-5 py-3 w-full focus:ring-1 focus:ring-slate-500 rounded-xl" />
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

        </>
    )
}

export default MyProfilePage
