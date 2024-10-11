import { ellipse, hello } from '@/assets/img'
import { Link } from 'react-router-dom'

const SettingPage = () => {
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
                              <div className="flex justify-between items-center border-b border-hrBlack pb-4 mb-5">
                                  <div className=''>
                                      <h4 className="font-bold text-base mb-2">Appearance</h4>
                                      <p className="text-[#A4A1AA]">Customize how your theme looks on your device</p>
                                  </div>
                                  <label className="relative inline-flex items-center cursor-pointer">
                                      <input className="sr-only peer"  type="checkbox" />
                                      <div className="w-24 h-12 rounded-full ring-0 peer duration-500 outline-none bg-gray-200 overflow-hidden before:flex before:items-center before:justify-center after:flex after:items-center after:justify-center before:content-['☀️'] before:absolute before:h-10 before:w-10 before:top-1/2 before:bg-white before:rounded-full before:left-1 before:-translate-y-1/2 before:transition-all before:duration-700 peer-checked:before:opacity-0 peer-checked:before:rotate-90 peer-checked:before:-translate-y-full shadow-lg shadow-gray-400 peer-checked:shadow-lg peer-checked:shadow-gray-700 peer-checked:bg-[#383838] after:content-['🌑'] after:absolute after:bg-[#1d1d1d] after:rounded-full after:top-[4px] after:right-1 after:translate-y-full after:w-10 after:h-10 after:opacity-0 after:transition-all after:duration-700 peer-checked:after:opacity-100 peer-checked:after:rotate-180 peer-checked:after:translate-y-0" />
                                  </label>
                              </div>
                              <div className="flex justify-between items-center border-b border-hrBlack pb-4 mb-5">
                                  <div className=''>
                                      <h4 className="font-bold text-base mb-2">Language</h4>
                                      <p className="text-[#A4A1AA]">Select your language</p>
                                  </div>
                                  <select name id className="bg-neutral-100 hover:bg-neutral-200 focus:ring-2 focus:ring-blue-500 rounded-md pl-3 py-2 text-sm ">
                                      <option value={1}>English</option>
                                      <option value={2}>Vietnamese</option>
                                      <option value={3}>China</option>
                                      <option value={2}>Janpan</option>
                                  </select>
                              </div>
                              <div className="flex justify-between items-center border-b border-hrBlack pb-4 mb-5">
                                  <div className=''>
                                      <h4 className="font-bold text-base mb-2">Two-factor Authentication</h4>
                                      <p className="text-[#A4A1AA]">Keep your account cecure by enabling 2FA via mail </p>
                                  </div>
                                  <div><label className="relative inline-block h-8 w-14 cursor-pointer rounded-full bg-gray-300 transition [-webkit-tap-highlight-color:_transparent] has-[:checked]:bg-gray-900">
                                      <input className="peer sr-only" id="AcceptConditions" type="checkbox" />
                                      <span className="absolute inset-y-0 start-0 m-1 size-6 rounded-full bg-gray-300 ring-[6px] ring-inset ring-white transition-all peer-checked:start-8 peer-checked:w-2 peer-checked:bg-white peer-checked:ring-transparent" />
                                  </label>
                                  </div>
                              </div>
                              <div className="flex justify-between items-center border-b border-hrBlack pb-4 mb-5">
                                  <div className=''>
                                      <h4 className="font-bold text-base mb-2">Push Notifications</h4>
                                      <p className="text-[#A4A1AA]">Receive push notifications </p>
                                  </div>
                                  <div><label className="relative inline-block h-8 w-14 cursor-pointer rounded-full bg-gray-300 transition [-webkit-tap-highlight-color:_transparent] has-[:checked]:bg-gray-900">
                                      <input className="peer sr-only" id="AcceptConditions" type="checkbox" />
                                      <span className="absolute inset-y-0 start-0 m-1 size-6 rounded-full bg-gray-300 ring-[6px] ring-inset ring-white transition-all peer-checked:start-8 peer-checked:w-2 peer-checked:bg-white peer-checked:ring-transparent" />
                                  </label>
                                  </div>
                              </div>
                              <div className="flex justify-between items-center border-b border-hrBlack pb-4 mb-5">
                                  <div className=''>
                                      <h4 className="font-bold text-base mb-2">Desktop Notifications</h4>
                                      <p className="text-[#A4A1AA]">Receive push notifications in desktop</p>
                                  </div>
                                  <div><label className="relative inline-block h-8 w-14 cursor-pointer rounded-full bg-gray-300 transition [-webkit-tap-highlight-color:_transparent] has-[:checked]:bg-gray-900">
                                      <input className="peer sr-only" id="AcceptConditions" type="checkbox" />
                                      <span className="absolute inset-y-0 start-0 m-1 size-6 rounded-full bg-gray-300 ring-[6px] ring-inset ring-white transition-all peer-checked:start-8 peer-checked:w-2 peer-checked:bg-white peer-checked:ring-transparent" />
                                  </label>
                                  </div>
                              </div><div className="flex justify-between items-center border-b border-hrBlack pb-4 mb-5">
                                  <div className=''>
                                      <h4 className="font-bold text-base mb-2">Email Notifications</h4>
                                      <p className="text-[#A4A1AA]">Receive email notifications </p>
                                  </div>
                                  <div><label className="relative inline-block h-8 w-14 cursor-pointer rounded-full bg-gray-300 transition [-webkit-tap-highlight-color:_transparent] has-[:checked]:bg-gray-900">
                                      <input className="peer sr-only" id="AcceptConditions" type="checkbox" />
                                      <span className="absolute inset-y-0 start-0 m-1 size-6 rounded-full bg-gray-300 ring-[6px] ring-inset ring-white transition-all peer-checked:start-8 peer-checked:w-2 peer-checked:bg-white peer-checked:ring-transparent" />
                                  </label>
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

export default SettingPage
