import { logo } from "@/assets/img";


const Header = () => {
  return (
    <>
       <header>
      <div className="container my-3">
        <div className="flex justify-around lg:justify-between items-center">
          <div className="order-1 lg:hidden">
            <i className="fa-solid fa-bars text-2xl"></i>
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
                  className="hover:shadow-slate-500/50 font-medium hover:text-white text-lg hover:bg-black hover:shadow-lg hover:border-0 px-4 py-2 rounded-xl"
                  >Home</a>
              
              </li>
              <li>
                <a
                  href="/shop"
                  className="hhover:shadow-slate-500/50 font-medium hover:text-white text-lg hover:bg-black hover:shadow-lg hover:border-0 px-4 py-2 rounded-xl"
                  >Shop</a
                >
              </li>
              <li>
                <a
                  href="/ourstory"
                  className="hover:shadow-slate-500/50 font-medium hover:text-white text-lg hover:bg-black hover:shadow-lg hover:border-0 px-4 py-2 rounded-xl"
                  >Our Story</a>
                
              </li>
              <li>
                <a
                  href=""
                  className="hover:shadow-slate-500/50 font-medium hover:text-white text-lg hover:bg-black hover:shadow-lg hover:border-0 px-4 py-2 rounded-xl"
                  >Blog</a>
                
              </li>
              <li>
                <a
                  href=""
                  className="hover:shadow-slate-500/50 font-medium hover:text-white text-lg hover:bg-black hover:shadow-lg hover:border-0 px-4 py-2 rounded-xl"
                  >Contact Us</a>
          
              </li>
            </ul>
          </nav>
          <div className="order-4 icon space-x-6 *:cursor-pointer">
            <span className=""
              ><i className="fa-solid fa-magnifying-glass text-xl"></i
            ></span>
            <span><i className="fa-regular fa-heart text-xl"></i></span>
            <span>
              <a href="./src/checkout.html"
                ><i className="fa-regular fa-bag-shopping text-xl relative">
                  <span
                    className="-bottom-1 left-[10px] w-4 h-4 text-[10px] bg-red-500 rounded-full absolute text-white flex items-center justify-center"
                    >0</span>
                  </i>
                </a>
              
            </span>

            <button
              className="btn-black bg-black text-white hover:text-black text-lg hover:bg-white lg:text-lg lg:py-3 lg:px-7 py-2 px-5 font-serif rounded-xl"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </header>
     
    </>
  );
};

export default Header;
