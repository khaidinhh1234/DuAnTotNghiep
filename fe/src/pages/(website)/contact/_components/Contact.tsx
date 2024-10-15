const ContactPage = () => {
  return (
    <>
      <main className="pt-10">
        <div className="container my-10 ">
          <div className="grid grid-cols-12 gap-8 mx-14 ">
            <div className=" col-span-12 ">
              <h1 className="text-4xl font-semibold mb-5 text-center">
                Contact Us
              </h1>
              <p className="text-lg mb-5 text-center">
                We are here to help you. If you have any questions or need
                assistance, please contact us.
              </p>
              <div className="lg:col-span-6 col-span-12 ">
                <div className="bg-gray-100 py-5 px-12 rounded-lg w-[700px] mx-auto">
                  <h1 className="text-2xl font-semibold mb-5">
                    Contact Information
                  </h1>
                  <div className="flex items-center space-x-3 py-[2px]">
                    <i className="fa-regular fa-phone-volume text-lg" />
                    <span className="text-lg">(704)555-0127</span>
                  </div>
                  <div className="flex items-center space-x-3 py-[2px]">
                    <i className="fa-light fa-envelope text-lg" />
                    <span className="text-lg">kist@example.com</span>
                  </div>
                  <div className="flex items-center space-x-3 py-[2px]" />
                  <i className="fa-regular fa-location-dot text-lg" />
                  <span className="text-lg">
                    3891 Ranchview Dr.Richardson, California 626339
                  </span>
                </div>
              </div>
              <form action="" className="space-y-5">
                <div className="flex flex-col space-y-2">
                  <label htmlFor="name" className="text-lg">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    placeholder="Your Name"
                    className="border border-stone-500 rounded-lg px-3 py-2"
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <label htmlFor="email" className="text-lg">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    placeholder="Your Email"
                    className="border border-stone-500 rounded-lg px-3 py-2"
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <label htmlFor="message" className="text-lg">
                    Message
                  </label>
                  <textarea
                    name=""
                    id="message"
                    cols={20}
                    rows={5}
                    placeholder="Your Message"
                    className="border border-stone-500 rounded-lg px-3 py-2"
                    defaultValue={""}
                  />
                </div>
                <button className="btn-black lg:text-lg lg:py-3 lg:px-7 py-2 px-5 font-serif rounded-lg">
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default ContactPage;
