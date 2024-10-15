const SearchSection = () => {
  return (
    <div className="grid lg:grid-cols-12 md:grid-cols-8 gap-2 items-center">
      <div className="lg:col-span-7 md:col-span-4">
        <h1 className="lg:text-4xl text-3xl tracking-wider font-medium">
          Hồ sơ của tôi
        </h1>
      </div>
      <div className="lg:col-span-5 md:col-span-4 relative flex">
        <i className="fa-light fa-magnifying-glass lg:text-2xl text-lg absolute lg:top-4 lg:left-5 top-[10px] left-3"></i>
        <input
          type="search"
          placeholder="Search"
          className="border border-blackL lg:w-[320px] md:w-[298px] lg:h-[56px] h-[36px] rounded-xl lg:px-[50px] px-[35px] mr-8"
        />
        <button className="btn-black items-center px-8 flex whitespace-nowrap rounded-lg hover:text-black">
          <span className="mr-3">Filter</span>
          <i className="fa-solid fa-sliders"></i>
        </button>
      </div>
    </div>
  );
};

export default SearchSection;
