import { anh1, anh2, anh3 } from "@/assets/img";

const OurValues = () => {
  return (
    <section id="OurValues" className="mt-16">
      <div className="container">
        <h2 className="lg:text-4xl text-2xl font-semibold mb-6 text-center">
          Our Values
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
              Integrity
            </h3>
            <p className="lg:w-96 mx-auto text-[#7b8799] text-sm">
              We always prioritize integrity and ethics in all activities. Every
              transaction and product at Krist is transparent and trustworthy.
            </p>
          </div>
          <div className="col-span-6 flex flex-col justify-center items-center text-center bg-[#D3D4D0]">
            <h3 className="mb-4 font-bold lg:text-4xl text-2xl text-[#6A747A]">
              Quality
            </h3>
            <p className="lg:w-96 mx-auto text-[#7b8799] text-sm">
              Quality is our top priority. Each Krist product is made from
              high-quality materials and undergoes meticulous testing to ensure
              durability and comfort.
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
              Innovation
            </h3>
            <p className="lg:w-96 mx-auto text-[#7b8799] text-sm">
              We continuously innovate to bring the most modern and functional
              fashion products to our customers. Creativity drives us to develop
              and improve every day.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurValues;
