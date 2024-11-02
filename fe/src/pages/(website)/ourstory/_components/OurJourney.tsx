import { bannerend } from "@/assets/img";

const OurJourney = () => {
  return (
    <>
      <section id="OurJourney" className="mb-16 container">
        <div
          className={`relative lg:min-h-[710px] min-h-[410px] bg-center bg-cover bg-no-repeat grid justify-center items-center`}
        >
          <img src={bannerend} alt="" />
          <div className="mx-auto w-full absolute">
            <h2 className="lg:text-4xl text-2xl text-white font-semibold text-center">
              Hành Trình Của Chúng Tôi
            </h2>

            <div className="flex items-center justify-center text-center w-full ">
              <p className="lg:text-lg w-[50%] mx-auto text-white text-center py-3">
                Từ những khởi đầu khiêm tốn đến việc trở thành một người chơi
                hàng đầu trong ngành, hành trình của chúng tôi đã được đánh dấu
                bởi sự kiên trì, đổi mới và cam kết với sự xuất sắc.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default OurJourney;
