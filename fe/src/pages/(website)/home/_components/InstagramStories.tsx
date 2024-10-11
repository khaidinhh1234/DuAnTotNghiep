import { story } from "@/assets/img";

const InstagramStories = () => {
  return (
    <>
      <section>
        {/* <!-- Our Instagram  Stories --> */}
        <div>
          <div className="container">
            <div className="mt-40">
              <div className="grid justify-center items-center">
                <h1 className="text-4xl font-semibold pl-9 mb-5">
                  Our Instagram Stories
                </h1>
              </div>

              <div className="grid grid-cols-12 gap-3 mb-24">
                <div className="xl:col-span-3 lg:col-span-4 md:col-span-6 col-span-12 relative w-[300px] h-[300px] product-card mx-auto">
                  <button className="btn absolute w-11 h-11 px-2  bg-white top-[120px] left-[120px] rounded-full invisible opacity-0 transition-opacity duration-300">
                    <i className="fa-brands fa-instagram text-2xl"></i>
                  </button>
                  <img src={story} alt="" className="" />
                </div>
                <div className="xl:col-span-3 lg:col-span-4 md:col-span-6 col-span-12 relative w-[300px] h-[300px] product-card mx-auto">
                  <button className="btn absolute w-11 h-11 px-2  bg-white top-[120px] left-[120px] rounded-full invisible opacity-0 transition-opacity duration-300">
                    <i className="fa-brands fa-instagram text-2xl"></i>
                  </button>
                  <img src={story} alt="" className="" />
                </div>
                <div className="xl:col-span-3 lg:col-span-4 md:col-span-6 col-span-12 relative w-[300px] h-[300px] product-card mx-auto">
                  <button className="btn absolute w-11 h-11 px-2  bg-white top-[120px] left-[120px] rounded-full invisible opacity-0 transition-opacity duration-300">
                    <i className="fa-brands fa-instagram text-2xl"></i>
                  </button>
                  <img src={story} alt="" className="" />
                </div>
                <div className="xl:col-span-3 lg:col-span-4 md:col-span-6 col-span-12 relative w-[300px] h-[300px] product-card mx-auto">
                  <button className="btn absolute w-11 h-11 px-2  bg-white top-[120px] left-[120px] rounded-full invisible opacity-0 transition-opacity duration-300">
                    <i className="fa-brands fa-instagram text-2xl"></i>
                  </button>
                  <img src={story} alt="" className="" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default InstagramStories;
