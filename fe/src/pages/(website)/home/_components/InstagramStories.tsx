import { story } from "@/assets/img";

const InstagramStories = () => {
  return (
    <>
      <section>
        {/* <!-- Our Instagram  Stories --> */}
        <div>
          <div className="mt-20">
            <div className="grid justify-center items-center bg-black text-white">
              <h1 className="text-4xl font-semibold pl-9 my-5 ">
                Glow Clothing tự hào thương hiệu Việt
              </h1>
            </div>
            <div className="container">
              <div className="grid grid-cols-12 gap-3 mb-24 mt-10">
                <div className="xl:col-span-3 lg:col-span-4 md:col-span-6 col-span-12 relative w-[300px] h-[300px] product-card mx-auto">
                  <button className="btn absolute w-11 h-11 px-2  bg-white top-[120px] left-[120px] rounded-full invisible opacity-0 transition-opacity duration-300">
                    <i className="fa-solid fa-blog text-2xl"></i>
                  </button>
                  <img
                    src={
                      "https://res.cloudinary.com/dcvu7e7ps/image/upload/v1729841526/hruli44upyhqo4fpra1i.webp"
                    }
                    alt=""
                    className="w-full h-full bg-center bg-cover bg-no-repeat"
                  />
                </div>
                <div className="xl:col-span-3 lg:col-span-4 md:col-span-6 col-span-12 relative w-[300px] h-[300px] product-card mx-auto">
                  <button className="btn absolute w-11 h-11 px-2  bg-white top-[120px] left-[120px] rounded-full invisible opacity-0 transition-opacity duration-300">
                    <i className="fa-solid fa-blog text-2xl"></i>
                  </button>
                  <img
                    src={
                      "https://res.cloudinary.com/dcvu7e7ps/image/upload/v1729853519/magazine-5cdb5120-f54c-4e52-9768-988ababfaf7c_q8urnz.webp"
                    }
                    alt=""
                    className="w-full h-full  bg-center bg-cover bg-no-repeat"
                  />
                </div>
                <div className="xl:col-span-3 lg:col-span-4 md:col-span-6 col-span-12 relative w-[300px] h-[300px] product-card mx-auto">
                  <button className="btn absolute w-11 h-11 px-2  bg-white top-[120px] left-[120px] rounded-full invisible opacity-0 transition-opacity duration-300">
                    <i className="fa-solid fa-blog text-2xl"></i>
                  </button>
                  <img
                    src={
                      "https://res.cloudinary.com/dcvu7e7ps/image/upload/v1729853519/jonah-hill_iofwv0.webp"
                    }
                    alt=""
                    className="w-full h-full bg-center bg-cover bg-no-repeat"
                  />
                </div>
                <div className="xl:col-span-3 lg:col-span-4 md:col-span-6 col-span-12 relative w-[300px] h-[300px] product-card mx-auto">
                  <button className="btn absolute w-11 h-11 px-2  bg-white top-[120px] left-[120px] rounded-full invisible opacity-0 transition-opacity duration-300">
                    <i className="fa-solid fa-blog text-2xl"></i>
                  </button>
                  <img
                    src={
                      "https://res.cloudinary.com/dcvu7e7ps/image/upload/v1729841388/sgc0spzc57o5ur8ufeoe.jpg"
                    }
                    alt=""
                    className="w-full h-full  bg-center bg-cover bg-no-repeat"
                  />
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
