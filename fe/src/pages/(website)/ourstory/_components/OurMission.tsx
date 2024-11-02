import { our1, our2 } from "@/assets/img";

const OurMission = () => {
  return (
    <>
      <section id="OurMission" className="mb-16 bg-neutral-200 pt-10 pb-20">
        <div className="container">
          <h2 className="lg:text-4xl text-2xl font-semibold mb-10 text-center">
            Sứ Mệnh Của Chúng Tôi
          </h2>
          <div className="grid grid-cols-12 gap-10">
            <div className="col-span-6">
              <h3 className="lg:text-[40px] text-2xl font-semibold py-3">
                Thời Trang và Sự Thoải Mái
              </h3>
              <p className="lg:text-lg lg:max-w-lg my-3 font-medium">
                Chúng tôi cam kết mang đến cho khách hàng những trang phục thời
                trang và thoải mái. Mục tiêu của chúng tôi là kết hợp xu hướng
                thời trang với sự thoải mái hàng ngày, đảm bảo rằng trang phục
                của chúng tôi nâng cao cả phong cách và sự dễ chịu.
              </p>
              <img
                src={our1}
                alt=""
                className="lg:w-[560px] lg:h-[648px] w-[260px] h-[348px] py-3"
              />
            </div>
            <div className="col-span-6">
              <img
                src={our2}
                alt=""
                className="lg:w-[560px] lg:h-[648px] w-[260px] h-[348px] py-3"
              />
              <h3 className="lg:text-[40px] text-2xl font-semibold py-3">
                Chất Lượng và Sự Tự Tin
              </h3>
              <p className="lg:text-lg lg:max-w-lg my-3 font-medium">
                Chúng tôi nỗ lực mang đến những trang phục chất lượng cao,
                truyền cảm hứng tự tin. Mỗi sản phẩm được chế tác với sự chú ý
                tỉ mỉ đến từng chi tiết, đảm bảo không chỉ vẻ đẹp thẩm mỹ mà còn
                độ bền và sự hài lòng cho khách hàng của chúng tôi.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default OurMission;
