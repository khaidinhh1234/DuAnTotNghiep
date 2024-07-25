type Props = {};

const Banner = () => {
  return (
    <div>
      {" "}
      <section
        className={`lg:bg-[url('./assets/images/Homepage/banner1.png')] bg-[url('./assets/images/Homepage/banner-mobile.png')] w-full  bg-cover bg-top `}
      >
        <div className=" min-h-[585px] lg:min-h-[885px] lg:min-w-[1280px]  bg-no-repeat lg:bg-center   flex py-32 lg:items-center lg:py-0 mt-9 mb-24">
          {/* <!-- Banner --> */}
          <div className="container">
            <div>
              <h3 className="md:text-4xl text-2xl tracking-[0.5px] font-semibold">
                classNameic Exclusive
              </h3>
              <h1 className="md:text-6xl text-4xl md:my-6 my-2 font-bold">
                Women's Collection
              </h1>
              <p className="uppercase md:text-3xl text-xl">upto 40% off</p>
              <button className="btn-black md:px-6 md:py-4 px-4 py-2 mt-12 rounded-lg">
                Shop Now <i className="fa-solid fa-arrow-right px-2"></i>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Banner;
