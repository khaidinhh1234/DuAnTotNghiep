import { anh1, anh2, anh3 } from "@/assets/img";

const OurValues = () => {
  return (
    <section id="OurValues" className="mt-16">
      <div className="container">
        <h2 className="lg:text-4xl text-2xl font-semibold mb-6 text-center">
          Giá Trị Của Chúng Tôi
        </h2>
        <div className="grid grid-cols-12 bg-[#D0DBE1]">
          <div className="col-span-6 flex items-center">
            <img
              src={anh2}
              alt=""
              className="mx-auto lg:h-[710px] h-auto w-[full]"
            />
          </div>
          <div className="col-span-6 flex flex-col justify-center items-center text-center">
            <h3 className="mb-4 font-bold text-2xl lg:text-4xl text-[#6A747A]">
              Chính Trực
            </h3>
            <p className="lg:w-96 mx-auto text-[#7b8799] text-sm">
              Chúng tôi luôn ưu tiên sự chính trực và đạo đức trong mọi hoạt
              động. Mọi giao dịch và sản phẩm tại Krist đều minh bạch và đáng
              tin cậy.
            </p>
          </div>
          <div className="col-span-6 flex flex-col justify-center items-center text-center bg-[#D3D4D0]">
            <h3 className="mb-4 font-bold lg:text-4xl text-2xl text-[#6A747A]">
              Chất Lượng
            </h3>
            <p className="lg:w-96 mx-auto text-[#7b8799] text-sm">
              Chất lượng là ưu tiên hàng đầu của chúng tôi. Mỗi sản phẩm của
              Krist đều được làm từ nguyên liệu chất lượng cao và trải qua quá
              trình kiểm tra kỹ lưỡng để đảm bảo độ bền và sự thoải mái.
            </p>
          </div>
          <div className="col-span-6 flex items-center">
            <img src={anh1} alt="" className="mx-auto h-auto w-[full]" />
          </div>
          <div className="col-span-6 flex items-center">
            <img
              src={anh3}
              alt=""
              className="mx-auto lg:h-[710px] h-[300px] w-[full]"
            />
          </div>
          <div className="col-span-6 flex flex-col justify-center items-center text-center">
            <h3 className="mb-4 font-bold lg:text-4xl text-2xl text-[#6A747A]">
              Sáng Tạo
            </h3>
            <p className="lg:w-96 mx-auto text-[#7b8799] text-sm">
              Chúng tôi liên tục đổi mới để mang đến những sản phẩm thời trang
              hiện đại và tiện dụng nhất cho khách hàng. Sự sáng tạo thúc đẩy
              chúng tôi phát triển và cải thiện mỗi ngày.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurValues;
