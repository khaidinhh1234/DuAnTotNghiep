import { bannerend } from "@/assets/img";

const OurJourney = () => {
  return (
    <>
      <section id="OurJourney" className="mb-16 container">
        <div
          className={`bg-[url('${bannerend}')] lg:min-h-[710px] min-h-[410px] bg-center bg-cover bg-no-repeat grid justify-center items-center`}
        >
          <div className="mx-auto w-[500px]">
            <h2 className="lg:text-4xl text-2xl text-white font-semibold text-center">
              Our Journey
            </h2>

            <div className="flex items-center">
              <p className="lg:text-lg lg:w-full w-96 mx-auto text-white text-center py-3">
                From our humble beginnings to becoming a leading player in the
                industry, our journey has been marked by perseverance,
                innovation, and a commitment to excellence.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default OurJourney;
