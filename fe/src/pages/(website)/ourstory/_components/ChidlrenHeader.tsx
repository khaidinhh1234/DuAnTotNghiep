const ChidlrenHeader = () => {
  return (
    <>
      <section className="mt-16">
        <div className="container mx-auto px-4 lg:mb-3 mb-5">
          <nav>
            <ul className="flex flex-col lg:flex-row justify-between items-center lg:gap-4 gap-3">
              {/* Nhóm nút bên trái */}
              <div className="flex flex-col lg:flex-row gap-2">
                <li>
                  <a
                    href="#OurStory"
                    className="lg:text-base text-sm px-4 py-2 hover:bg-black/50 hover:text-white rounded-xl bg-white border border-black font-semibold hover:border-white transition-all text-center block"
                  >
                    Câu Chuyện Của Chúng Tôi
                  </a>
                </li>
                <li>
                  <a
                    href="#OurMission"
                    className="lg:text-base text-sm px-4 py-2 hover:bg-black/50 hover:text-white rounded-xl bg-white border border-black font-semibold hover:border-white transition-all text-center block"
                  >
                    Sứ Mệnh Của Chúng Tôi
                  </a>
                </li>
              </div>

              {/* Nhóm nút bên phải */}
              <div className="flex flex-col lg:flex-row gap-2">
                <li>
                  <a
                    href="#OurValues"
                    className="lg:text-base text-sm px-4 py-2 hover:bg-black/50 hover:text-white rounded-xl bg-white border border-black font-semibold hover:border-white transition-all text-center block"
                  >
                    Giá Trị Của Chúng Tôi
                  </a>
                </li>
                <li>
                  <a
                    href="#OurJourney"
                    className="lg:text-base text-sm px-4 py-2 hover:bg-black/50 hover:text-white rounded-xl bg-white border border-black font-semibold hover:border-white transition-all text-center block"
                  >
                    Hành Trình Của Chúng Tôi
                  </a>
                </li>
              </div>
            </ul>
          </nav>
        </div>
      </section>
    </>
  );
};

export default ChidlrenHeader;
