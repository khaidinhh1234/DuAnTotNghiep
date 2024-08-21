import { bannervoucher } from "@/assets/img";

const Banner = () => {
  return (
    <div>
      {" "}
      <section>
        <div className="container">
          <img
            src={bannervoucher}
            alt=""
            className="w-full md:bg-center bg-top bg-cover md:h-[550px] h-[250px] rounded"
          />
        </div>
      </section>
    </div>
  );
};

export default Banner;
