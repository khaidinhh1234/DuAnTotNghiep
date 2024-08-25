import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Image } from "antd";
import {
  Autoplay,
  Pagination,
  Navigation,
  FreeMode,
  Thumbs,
} from "swiper/modules";
import { product, products2, products1, sanPham2 } from "@/assets/img";

const ProductDetail = () => {
  const [activeTab, setActiveTab] = useState("descriptions"); // State to manage active tab
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  const handlePreview = (imageUrl: string) => {
    setPreviewImage(imageUrl);
    setPreviewOpen(true);
  };

  const images = [product, products1, products2, sanPham2];

  return (
    <>
      <section>
        <div className="container">
          <div className="mx-14 flex mt-[70px] mb-9">
            <p className="pr-2">Home</p>
            &gt;
            <p className="px-2">Shop</p>
            &gt;
            <p className="px-2">All Products</p>
          </div>
        </div>
      </section>
      <section>
        <div className="container pb-11">
          <div className="md:px-14 px-5 pt-3 grid grid-cols-12 gap-3 w-[100%] justify-center">
            <div className="lg:col-span-6 col-span-12 mb-6 ">
              <div className="bg-[#FAFAFB] xl:w-[555px] xl:h-[535px] lg:w-[455px] lg:h-[455px] md:h-[555px] md:w-[655px] w-[405px] h-[325px] inline-flex justify-center items-center mb-5 rounded-2xl shadow shadow-zinc-300/60">
                <Swiper
                  style={
                    {
                      "--swiper-navigation-color": "#000000",
                      "--swiper-pagination-color": "#000000",
                    } as React.CSSProperties
                  }
                  centeredSlides={true}
                  autoplay={{
                    delay: 2500,
                    disableOnInteraction: false,
                  }}
                  pagination={{
                    clickable: true,
                  }}
                  navigation={true}
                  thumbs={thumbsSwiper ? { swiper: thumbsSwiper } : undefined}
                  modules={[Autoplay, Pagination, Navigation, Thumbs, FreeMode]}
                  className="mySwiper2 w-[555px] swiper-with-hover"
                  loop={true}
                  spaceBetween={10}
                >
                  {images.map((image, index) => (
                    <SwiperSlide key={index}>
                      <img
                        src={image}
                        alt=""
                        onClick={() => handlePreview(image)}
                        style={{ cursor: "pointer" }}
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
              <div className="w-[500px] mx-auto">
                <Swiper
                  onSwiper={(swiperInstance) =>
                    setThumbsSwiper(swiperInstance as any)
                  }
                  loop={true}
                  spaceBetween={31}
                  slidesPerView={4}
                  freeMode={true}
                  watchSlidesProgress={true}
                  modules={[FreeMode, Navigation, Thumbs]}
                  className="mySwiper1"
                >
                  {images.map((image, index) => (
                    <SwiperSlide key={index}>
                      <div className="md:w-[100px] md:h-[100px] w-[62px] h-[60px] bg-[#F4F4F4] rounded-2xl px-1 border border-[#F4F4F4] flex justify-center items-center">
                        <img src={image} alt="" style={{ cursor: "pointer" }} />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>
            <div className="lg:col-span-6 col-span-12 px-4 w-[100%] ">
              <div className="product_detail_name">
                <div className="flex justify-between mb-2">
                  <h3 className=" font-bold text-3xl ">YK Disney</h3>
                  <div>
                    <a className="bg-[#3CD139]/10 text-sm px-2 py-1 text-[#3CD139] rounded-sm">
                      In Stock
                    </a>
                  </div>
                </div>
                <h4 className="mb-3 text-2xl font-normal">
                  Áo đẹp thoáng mát co giãn{" "}
                </h4>
                <div className="stars_reviews d-flex mb-3">
                  <span>
                    <i className="fa-solid fa-star  text-yellow-400 text-xl" />
                    <i className="fa-solid fa-star text-yellow-400 text-xl" />
                    <i className="fa-solid fa-star text-yellow-400 text-xl" />
                    <i className="fa-solid fa-star text-yellow-400 text-xl" />
                    <i className="fa-solid fa-star text-yellow-400 text-xl" />
                  </span>
                  <span className="px-2 text-[#A4A1AA]">
                    5.0 <span className="px-[2px]">(122 Reviews)</span>
                  </span>
                </div>
              </div>
              <div className=" mb-5 text-xl font-medium">
                $80.00 <del className="text-[#A4A1AA]">$100.00</del>
              </div>
              <p className="description mb-4 font-medium">
                To use these apps, you will need to open the app and then take a
                picture of the image. The app will then process the image and
                return the extracted text.
              </p>
              <div className="mb-4">
                <h3 className="  text-gray-900 mb-2 font-bold text-lg">
                  Color{" "}
                </h3>
                <div className="flex space-x-2">
                  <button className="w-9 h-9 bg-red-500 rounded-md border-2 border-transparent hover:border-blackL" />
                  <button className="w-9 h-9 bg-blue-500 rounded-md border-2 border-transparent hover:border-blackL" />
                  <button className="w-9 h-9 bg-purple-500 rounded-md border-2 border-transparent hover:border-blackL" />
                  <button className="w-9 h-9 bg-black rounded-md border-2 border-transparent hover:border-blackL" />
                  <button className="w-9 h-9 bg-yellow-500 rounded-md border-2 border-transparent hover:border-blackL" />
                  <button className="w-9 h-9 bg-green-500 rounded-md border-2 border-transparent hover:border-blackL" />
                </div>
              </div>
              <div className=" items-center mt-4 mb-3">
                <h3 className=" mr-4 font-bold text-lg">Size </h3>
                <div className="flex mt-3">
                  <button className="w-10 h-10  rounded-md border border-blackL text-blackL hover:bg-blackL hover:text-white mr-2">
                    S
                  </button>
                  <button className="w-10 h-10  rounded-md border border-blackL text-blackL hover:bg-blackL hover:text-white ml-2 mr-2">
                    M
                  </button>
                  <button className="w-10 h-10  rounded-md border border-blackL text-blackL hover:bg-blackL hover:text-white ml-2 mr-2">
                    L
                  </button>
                  <button className="w-10 h-10  rounded-md border border-blackL text-blackL hover:bg-blackL hover:text-white ml-2 mr-2">
                    XL
                  </button>
                  <button className="w-10 h-10  rounded-md border border-blackL text-blackL hover:bg-blackL hover:text-white ml-2 mr-2">
                    XXL
                  </button>
                </div>
              </div>
              <div className="mt-12 flex gap-5">
                <div className="border rounded-lg border-black xl:w-32 xl:h-14  ld:w-24 lg:h-10  md:w-32 md:h-14  w-24 h-10 flex justify-center items-center shadow-lg shadow-slate-400/50">
                  <button className="py-2 pr-2">
                    <i className="fa-solid fa-minus" />
                  </button>
                  <input
                    type="number"
                    id="numberInput"
                    defaultValue={1}
                    min={1}
                    maxLength={2}
                    className="xl:w-10 xl:h-10 lg:w-5 lg:h-5 md:w-10 md:h-10  w-5 h-5 border-0 focus:ring-0 focus:outline-none text-center"
                  />
                  <button className="py-2 pl-2">
                    <i className="fa-solid fa-plus" />
                  </button>
                </div>
                <button className="btn-black xl:w-[340px] w-[250px] lg:w-[250px] md:w-[340px] xl:h-14 lg:h-10  md:h-14 h-10 rounded-lg">
                  Add to Cart
                </button>
                <button className="border border-black xl:w-16 lg:w-11 md:w-16 w-11  xl:h-14  lg:h-10 md:h-14  h-10 rounded-lg flex items-center justify-center  shadow-lg shadow-slate-400/50">
                  <i
                    className="fa-regular fa-heart text-2xl"
                    style={{ color: "#ff1100" }}
                  />{" "}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto p-8">
        <div className="flex space-x-8 border-b pb-2 mb-4">
          <button
            className={`font-medium ${activeTab === "descriptions" ? "text-black border-b-2 border-black pb-2" : "text-gray-700"}`}
            onClick={() => setActiveTab("descriptions")}
          >
            Descriptions
          </button>
          <button
            className={`font-medium ${activeTab === "additionalInfo" ? "text-black border-b-2 border-black pb-2" : "text-gray-700"}`}
            onClick={() => setActiveTab("additionalInfo")}
          >
            Additional Information
          </button>
          <button
            className={`font-medium ${activeTab === "reviews" ? "text-black border-b-2 border-black pb-2" : "text-gray-700"}`}
            onClick={() => setActiveTab("reviews")}
          >
            Reviews
          </button>
        </div>

        {activeTab === "descriptions" && (
          <div className="mb-4">
            <p className="description mb-4 font-medium">
              <div id="descriptions" data-content className="py-4 h-auto">
                <p className="text-gray-600">
                  <span>+</span>
                  It is a long established fact that a reader will be distracted
                  by the readable content of a page when looking at its layout.
                  The point of using Lorem Ipsum is that it has a more-or-less
                  normal distribution of letters, as opposed to using 'Content
                  here, content here', making it look like readable English.
                  Many desktop publishing packages and web page editors now use
                  Lorem Ipsum as their default model text, and a search for
                  'lorem ipsum' will uncover many web sites still in their
                  infancy.
                </p>
                <p className="mt-4 text-gray-600">
                  Various versions have evolved over the years, sometimes by
                  accident, sometimes on purpose (injected humour and the like).
                </p>
              </div>
              <div id="additional-info" data-content className="p-4 hidden">
                <p className="text-gray-600">
                  This is the additional information tab content. Add any
                  relevant information about the product here.
                </p>
              </div>
              <div id="reviews" data-content className="p-4 hidden">
                <p className="text-gray-600">
                  This is the reviews tab content. Display customer reviews and
                  ratings here.
                </p>
              </div>{" "}
            </p>
          </div>
        )}

        {activeTab === "additionalInfo" && (
          <div className="mb-4">
            <h3 className="text-gray-900 mb-2 font-bold text-lg">Color</h3>
            <div className="flex space-x-2">
              {/* Color buttons here */}
              <h1>Đỏ,</h1>
              <h1>Xanh dương,</h1>
              <h1>Tím,</h1>
              <h1>Đen,</h1>
              <h1>cam,</h1>
            </div>
            <h3 className="mt-4 mb-2 font-bold text-lg">Size</h3>
            <div className="flex space-x-2">
              {/* Size buttons here */}
              <h1>S,</h1>
              <h1>L,</h1>
              <h1>XL,</h1>
              <h1>XXL,</h1>
            </div>
          </div>
        )}

        {activeTab === "reviews" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Customer Reviews</h2>
            {/* <div className="space-y-6">
            <h2 className="text-xl font-semibold mb-4">Customer Reviews</h2> */}

            <div className="space-y-6">
              {/* Review Item */}
              <div className="border p-4 rounded-lg">
                <div className="flex items-center space-x-4 mb-2">
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <img
                      src="https://i.pravatar.cc/100"
                      alt="Mark Williams"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium">Mark Williams</h4>
                    <div className="flex items-center">
                      <span className="text-yellow-500 text-xl">★★★★★</span>
                      <span className="ml-2 text-sm text-gray-500">
                        Jan 05, 2023
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 font-medium mb-2">
                  Excellent Product, I Love It 😍
                </p>
                <p className="text-gray-600">
                  It is a long established fact that a reader will be distracted
                  by the readable content of a page when looking at its layout.
                </p>
              </div>

              {/* Another Review Item */}
              <div className="border p-4 rounded-lg">
                <div className="flex items-center space-x-4 mb-2">
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <img
                      src="https://i.pravatar.cc/100?img=2"
                      alt="Alexa Johnson"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium">Alexa Johnson</h4>
                    <div className="flex items-center">
                      <span className="text-yellow-500 text-xl">★★★★★</span>
                      <span className="ml-2 text-sm text-gray-500">
                        Jan 06, 2023
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 font-medium mb-2">
                  My Daughter is very much happy with this product
                </p>
                <p className="text-gray-600">
                  It is a long established fact that a reader will be distracted
                  by the readable content of a page when looking at its layout.
                </p>
              </div>
              {/* </div> */}

              {/* Add Review Form */}
              <h3 className="text-lg font-semibold mt-8 mb-4">
                Add your Review
              </h3>
              <form className="space-y-4">
                <div>
                  <label className="block font-medium">Your Rating</label>
                  <div className="flex space-x-2 text-yellow-500 text-xl">
                    {[...Array(5)].map((_, i) => (
                      <button key={i} type="button">
                        ★
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-medium">Name</label>
                  <input
                    type="text"
                    className="w-full border p-2 rounded"
                    placeholder="Enter Your Name"
                  />
                </div>

                <div>
                  <label className="block font-medium">Email Address</label>
                  <input
                    type="email"
                    className="w-full border p-2 rounded"
                    placeholder="Enter Your Email"
                  />
                </div>

                <div>
                  <label className="block font-medium">Your Review</label>
                  <textarea
                    className="w-full border p-2 rounded"
                    placeholder="Enter Your Review"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="bg-black text-white px-4 py-2 rounded"
                >
                  Submit
                </button>
              </form>
            </div>
            {/* <h3 className="text-lg font-semibold mt-8 mb-4">Add your Review</h3> */}
            <form className="space-y-4">{/* Review form here */}</form>
          </div>
        )}
      </div>
      <div className="container mx-14 pb-10">
        <h2 className="mx-14 text-4xl font-medium tracking-[1px] mb-12">
          Related Products
        </h2>
        <div className="mx-14 lg:flex lg:gap-7 h-[500px]">
          <div className="swiper mySwiper">
            <div className="swiper-wrapper">
              <div className="swiper-slide">
                <div className="xl:col-span-3 lg:col-span-4 col-span-12 md:col-span-6 mb-2 w-[264px] mx-auto">
                  <div className="product-card hover:bg-zinc-100">
                    <div className="w-full h-[332px] relative">
                      <a href="#">
                        <i className="fa-regular fa-star text-lg bg-white px-[13px] py-[14px] rounded-full absolute top-5 right-6 btn invisible opacity-0 transition-opacity duration-300 hover:bg-black hover:text-white" />
                      </a>
                      <a href="#">
                        <i className="fa-solid fa-arrow-right-arrow-left text-lg bg-white px-4 py-[14px] rounded-full absolute top-[70px] right-6 btn invisible opacity-0 transition-opacity duration-300 hover:bg-black hover:text-white" />
                      </a>
                      <a href="#">
                        <i className="fa-regular fa-eye text-lg bg-white px-[13px] py-[14px] rounded-full absolute top-[121px] right-6 btn invisible opacity-0 transition-opacity duration-300 hover:bg-black hover:text-white" />
                      </a>
                      <img
                        src={product}
                        alt=""
                        className="w-[285px] h-[320px]"
                      />
                      <button className="hover:bg-blackL hover:text-white absolute px-[75px] py-3 left-4 rounded-lg bottom-5 bg-white invisible opacity-30 transition-opacity btn duration-300">
                        Add to Cart
                      </button>
                    </div>
                    <div className="bg-white pt-4">
                      <a href="#">
                        <h5 className="font-bold text-lg">Allen Solly</h5>
                      </a>
                      <p className="my-1 font-normal ">
                        Women Texttured Handheld Bag
                      </p>
                      <p className="font-medium text-lg">
                        $80.00
                        <span className="text-black/20 line-through px-1">
                          $100.00
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              {/* Add more related product slides as needed */}
            </div>
          </div>
        </div>
      </div>
      <section>
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4  gap-14 mt-12 mb-24">
            <div className="mx-auto">
              <i className="fa-regular fa-box text-3xl" />
              <h3 className="font-bold text-xl mt-3 mb-2">Free Shipping</h3>
              <p>Free shipping for order above $150</p>
            </div>
            <div className="mx-auto">
              <i className="fa-regular fa-circle-dollar text-3xl" />
              <h3 className="font-bold text-xl mt-3 mb-2">Money Guarantee</h3>
              <p>Within 30 days for an exchange</p>
            </div>
          </div>
        </div>
      </section>

      {previewImage && (
        <Image
          wrapperStyle={{ display: "none" }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(""),
          }}
          src={previewImage}
        />
      )}
    </>
  );
};

export default ProductDetail;
