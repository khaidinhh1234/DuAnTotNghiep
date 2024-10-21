import { bank, logofooter } from "@/assets/img";
import instance from "@/configs/client";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";


const Footer = () => {
  const {
    data: apiResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["websiteInfo"],
    queryFn: async () => {
      const response = await instance.get("/thong-tin-web");
      console.log("Raw API Response:", response.data);
      return response.data;
    },
  });

  useEffect(() => {
    if (apiResponse && apiResponse.data) {
      // Store the data in local storage
      localStorage.setItem('websiteInfo', JSON.stringify(apiResponse.data));
    }
  }, [apiResponse]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const websiteInfo = apiResponse?.data;
  return (
    <div>
      <footer className="bg-black text-white">
        <div className="container">
          <div className="grid grid-cols-12 gap-8 mx-4 py-14 border-b border-stone-700">
            <div className="lg:col-span-4 col-span-6">
              <div>
                <img
                  src={websiteInfo?.logo_website || logofooter}
                  alt=""
                  className="lg:w-[130px] w-28 h-auto"
                />
              </div>
              <div className="my-[39px] space-y-5 w-[261px]">
                <div className="*:px-1">
                  <i className="fa-regular fa-phone-volume text-lg" />
                  <span className="text-base">{websiteInfo?.so_dien_thoai_dat_hang}</span>
                </div>
                <div className="*:px-1">
                  <i className="fa-light fa-envelope text-lg" />
                  <span className="mx-1">{websiteInfo?.email}</span>
                </div>
                <div className="*:px-1 flex">
                  <i className="fa-regular fa-location-dot text-lg" />
                  <span className="mx-2 lg:w-full w-48">
                  {websiteInfo?.dia_chi}
                  </span>
                </div>
              </div>
            </div>
            <div className="lg:col-span-2 col-span-6">
              <h1 className="text-xl font-semibold mb-3">Information</h1>
              <ul>
                <li className="mb-3">
                  <a href="">My Acount</a>
                </li>
                <li className="mb-3">
                  <a href="">Login</a>
                </li>
                <li className="mb-3">
                  <a href="">My Cart</a>
                </li>
                <li className="mb-3">
                  <a href="">My Wishlist</a>
                </li>
                <li className="mb-3">
                  <a href="">Checkout</a>
                </li>
              </ul>
            </div>
            <div className="lg:col-span-2 col-span-6">
              <h1 className="text-xl font-semibold mb-3">Dịch vụ</h1>
              <ul>
                <li className="mb-3">
                  <a href="">About Us</a>
                </li>
                <li className="mb-3">
                  <a href="">Careers</a>
                </li>
                <li className="mb-3">
                  <a href="">Delivery Information</a>
                </li>
                <li className="mb-3">
                  <a href="">Privacy Policy</a>
                </li>
                <li className="mb-3">
                  <a href="">Terms &amp; Conditions</a>
                </li>
              </ul>
            </div>
            <div className="lg:col-span-4 col-span-6">
              <h1 className="text-xl font-semibold mb-4">Đăng ký</h1>
              <p className="lg:w-80 mb-5">
              {websiteInfo?.cau_noi}

              </p>
              <div className="relative">
                <i className="fa-regular fa-envelope absolute top-2 left-4 text-2xl" />
                <input
                  type="email"
                  placeholder="Email"
                  className="lg:w-[305px] w-[200px] bg-blackL text-[15px] py-3 px-12 rounded-lg text-white border shadow-lg shadow-slate-600/50 focus:ring focus:ring-blue-500 focus:ring-opacity-50 focus:outline-none placeholder-white"
                />
                <button type="submit">
                  <i className="fa-solid fa-arrow-right absolute text-gray-400 lg:top-3 lg:left-[270px] text-xl top-3 left-[170px]" />
                </button>
              </div>
            </div>
          </div>
          <div className="flex justify-between py-3">
            <div>
              <img src={bank} alt="" className="h-7" />
            </div>
            <div>© 2024 Krist All Rights are Reserved.</div>
            <div className="*:text-2xl *:px-3">
            <a href={websiteInfo?.link_facebook} target="_blank" rel="noopener noreferrer">
                <i className="fa-brands fa-facebook" style={{ color: "#ffffff" }} />
              </a>
              <a href={websiteInfo?.link_instagram} target="_blank" rel="noopener noreferrer">
                <i className="fa-brands fa-instagram" />
              </a>
              <a href={websiteInfo?.link_youtube} target="_blank" rel="noopener noreferrer">
                <i className="fa-brands fa-youtube" style={{ color: "#ffffff" }} />
              </a>
              <a href={websiteInfo?.link_youtube} target="_blank" rel="noopener noreferrer">
                <i className="fa-brands fa-youtube" style={{ color: "#ffffff" }} />
              </a>
              <a href={websiteInfo?.link_youtube} target="_blank" rel="noopener noreferrer">
              <i className="fa-brands fa-tiktok" style={{ color: "#ffffff" }} />
              </a>
            </div>
          </div>  
        </div>
      </footer>
    </div>
  );
};

export default Footer;
