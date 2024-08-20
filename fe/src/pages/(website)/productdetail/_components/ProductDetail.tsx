import { product, products1 } from "@/assets/img"

const ProductDetail = () => {
  return (
    <div>
     <main>
  {/*Order Summary*/}
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
    <div className=" container pb-11">
      <div className="md:px-14 px-5 pt-3 grid grid-cols-12  gap-3  w-[100%]  justify-center">
        <div className="lg:col-span-6 col-span-12 mx-auto mb-6 ">
          <div className=" bg-[#FAFAFB] xl:w-[555px] lg:w-[455px] lg:h-[455px]  md:h-[555px]  md:w-[655px]  w-[405px] h-[325px] inline-flex justify-center items-center mb-5 rounded-2xl shadow shadow-zinc-300/60 ">
            <img src={product} alt="" className="lg:w-[440px] lg:h-[500px] md:w-[540px] md:h-[600px] w-[320px] h-[400px]" />
          </div>
          <div className=" flex gap-5 justify-center ">
            <div className="md:w-[92px] md:h-[90px] w-[62px] h-[60px] bg-[#F4F4F4] rounded-2xl px-1 border border-[#F4F4F4] hover:border-slate-400 flex justify-center items-center">
              <img src={product} alt="" className="md:w-[82px] md:h-[90px] [42px] h-[50px]" />
            </div>
            <div className="md:w-[92px] md:h-[90px] w-[62px] h-[60px] bg-[#F4F4F4] rounded-2xl px-1 border border-[#F4F4F4] hover:border-slate-400 flex justify-center items-center">
              <img src={product} alt="" className="md:w-[82px] md:h-[90px] [42px] h-[50px]" />
            </div>
            <div className="md:w-[92px] md:h-[90px]  w-[62px] h-[60px]bg-[#F4F4F4] rounded-2xl px-1 border border-[#F4F4F4] hover:border-slate-400 flex justify-center items-center">
              <img src={product} alt="" className="md:w-[82px] md:h-[90px] [42px] h-[50px]" />
            </div>
            <div className="md:w-[92px] md:h-[90px] w-[62px] h-[60px] bg-[#F4F4F4] rounded-2xl px-1 border border-[#F4F4F4] hover:border-slate-400 flex justify-center items-center">
              <img src={product} alt="" className="md:w-[82px] md:h-[90px] [42px] h-[50px]" />
            </div>
          </div>
        </div>
        <div className="lg:col-span-6 col-span-12 px-4 w-[100%] ">
          <div className="product_detail_name">
            <div className="flex justify-between mb-2">
              <h3 className=" font-bold text-3xl ">
                YK Disney
              </h3>
              <div><a href className="bg-[#3CD139]/10 text-sm px-2 py-1 text-[#3CD139] rounded-sm">In Stock</a></div>
            </div>
            <h4 className="mb-3 text-2xl font-normal">Áo đẹp thoáng mát co giãn </h4>
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
            To use these apps, you will need to open the app and then take a picture of the image. The
            app will then process the image and return the extracted text.
          </p>
          <div className="mb-4">
            <h3 className="  text-gray-900 mb-2 font-bold text-lg">Color </h3>
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
              <button className="w-10 h-10  rounded-md border border-blackL text-blackL hover:bg-blackL hover:text-white mr-2">S</button>
              <button className="w-10 h-10  rounded-md border border-blackL text-blackL hover:bg-blackL hover:text-white ml-2 mr-2">M</button>
              <button className="w-10 h-10  rounded-md border border-blackL text-blackL hover:bg-blackL hover:text-white ml-2 mr-2">L</button>
              <button className="w-10 h-10  rounded-md border border-blackL text-blackL hover:bg-blackL hover:text-white ml-2 mr-2">XL</button>
              <button className="w-10 h-10  rounded-md border border-blackL text-blackL hover:bg-blackL hover:text-white ml-2 mr-2">XXL</button>
            </div>
          </div>
          <div className="mt-12 flex gap-5">
            <div className="border rounded-lg border-black xl:w-32 xl:h-14  ld:w-24 lg:h-10  md:w-32 md:h-14  w-24 h-10 flex justify-center items-center shadow-lg shadow-slate-400/50">
              <button className="py-2 pr-2">
                <i className="fa-solid fa-minus" />
              </button>
              <input type="number" id="numberInput" defaultValue={1} min={1} maxLength={2} className="xl:w-10 xl:h-10 lg:w-5 lg:h-5 md:w-10 md:h-10  w-5 h-5 border-0 focus:ring-0 focus:outline-none text-center" />
              <button className="py-2 pl-2">
                <i className="fa-solid fa-plus" />
              </button>
            </div>
            <button className="btn-black xl:w-[340px] w-[250px] lg:w-[250px] md:w-[340px] xl:h-14 lg:h-10  md:h-14 h-10 rounded-lg">Add
              to Cart</button>
            <button className="border border-black xl:w-16 lg:w-11 md:w-16 w-11  xl:h-14  lg:h-10 md:h-14  h-10 rounded-lg flex items-center justify-center  shadow-lg shadow-slate-400/50"><i className="fa-regular fa-heart text-2xl" style={{color: '#ff1100'}} /> </button>
          </div>
        </div>
      </div>
    </div></section>
  <section>
    <div className="container">
      <div className=" mx-14 bg-white rounded-lg    my-10 lg:mb-24">
        <div className="border-b border-gray-200 mb-4">
          <nav className="flex space-x-4 h-7">
            <button data-tab="descriptions" className="hover:text-gray-900 text-gray-500 border-b-2 border-white hover:border-black pb-2 focus:outline-none hover:text-xl hover:font-semibold">Descriptions</button>
            <button data-tab="additional-info" className="text-gray-500 hover:text-gray-900 pb-2 focus:outline-none border-b-2 border-white hover:border-black hover:text-xl hover:font-semibold">Additional
              Information</button>
            <button data-tab="reviews" className="text-gray-500 hover:text-gray-900 pb-2 focus:outline-none border-b-2 border-white hover:border-black hover:text-xl hover:font-semibold">Reviews</button>
          </nav>
        </div>
        <div id="descriptions" data-content className="py-4 h-auto">
          <p className="text-gray-600"><span>+</span>
            It is a long established fact that a reader will be distracted by the readable content of a page
            when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal
            distribution of letters, as opposed to using 'Content here, content here', making it look like
            readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as
            their default model text, and a search for 'lorem ipsum' will uncover many web sites still in
            their infancy.
          </p>
          <p className="mt-4 text-gray-600">
            Various versions have evolved over the years, sometimes by accident, sometimes on purpose
            (injected humour and the like).
          </p>
        </div>
        <div id="additional-info" data-content className="p-4 hidden">
          <p className="text-gray-600">
            This is the additional information tab content. Add any relevant information about the product
            here.
          </p>
        </div>
        <div id="reviews" data-content className="p-4 hidden">
          <p className="text-gray-600">
            This is the reviews tab content. Display customer reviews and ratings here.
          </p>
        </div>
      </div>
    </div>
  </section>
  <div className>
    <div className="container mx-14 pb-10">
      <h2 className="mx-14 text-4xl font-medium  tracking-[1px] mb-12">Related Products</h2>
      <div className="mx-14 lg:flex lg:gap-7  h-[500px] ">
        <div className="swiper mySwiper">
          <div className="swiper-wrapper">
            <div className="swiper-slide">
              <div className="xl:col-span-3 lg:col-span-4 col-span-12 md:col-span-6 mb-2 w-[264px] mx-auto">
                <div className="product-card hover:bg-zinc-100">
                  <div className="w-full h-[332px] relative">
                    <a href="#"><i className="fa-regular fa-star text-lg bg-white px-[13px] py-[14px] rounded-full absolute top-5 right-6 btn invisible opacity-0 transition-opacity duration-300 hover:bg-black hover:text-white" /></a>
                    <a href="#"><i className="fa-solid fa-arrow-right-arrow-left text-lg bg-white px-4 py-[14px] rounded-full absolute top-[70px] right-6 btn invisible opacity-0 transition-opacity duration-300 hover:bg-black hover:text-white" /></a>
                    <a href="#"><i className="fa-regular fa-eye text-lg bg-white px-[13px] py-[14px] rounded-full absolute top-[121px] right-6 btn invisible opacity-0 transition-opacity duration-300 hover:bg-black hover:text-white" /></a>
                    <img src={products1} alt="" className="w-[285px] h-[320px] " />
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
                      <span className="text-black/20 line-through px-1">$100.00</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="swiper-slide">
              <div className="xl:col-span-3 lg:col-span-4 col-span-12 md:col-span-6 mb-2 w-[264px] mx-auto">
                <div className="product-card hover:bg-zinc-100">
                  <div className="w-full h-[332px] relative">
                    <a href="#"><i className="fa-regular fa-star text-lg bg-white px-[13px] py-[14px] rounded-full absolute top-5 right-6 btn invisible opacity-0 transition-opacity duration-300 hover:bg-black hover:text-white" /></a>
                    <a href="#"><i className="fa-solid fa-arrow-right-arrow-left text-lg bg-white px-4 py-[14px] rounded-full absolute top-[70px] right-6 btn invisible opacity-0 transition-opacity duration-300 hover:bg-black hover:text-white" /></a>
                    <a href="#"><i className="fa-regular fa-eye text-lg bg-white px-[13px] py-[14px] rounded-full absolute top-[121px] right-6 btn invisible opacity-0 transition-opacity duration-300 hover:bg-black hover:text-white" /></a>
                    <img src={product} alt="" className="w-[285px] h-[320px] " />
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
                      <span className="text-black/20 line-through px-1">$100.00</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="swiper-slide">
              <div className="xl:col-span-3 lg:col-span-4 col-span-12 md:col-span-6 mb-2 w-[264px] mx-auto">
                <div className="product-card hover:bg-zinc-100">
                  <div className="w-full h-[332px] relative">
                    <a href="#"><i className="fa-regular fa-star text-lg bg-white px-[13px] py-[14px] rounded-full absolute top-5 right-6 btn invisible opacity-0 transition-opacity duration-300 hover:bg-black hover:text-white" /></a>
                    <a href="#"><i className="fa-solid fa-arrow-right-arrow-left text-lg bg-white px-4 py-[14px] rounded-full absolute top-[70px] right-6 btn invisible opacity-0 transition-opacity duration-300 hover:bg-black hover:text-white" /></a>
                    <a href="#"><i className="fa-regular fa-eye text-lg bg-white px-[13px] py-[14px] rounded-full absolute top-[121px] right-6 btn invisible opacity-0 transition-opacity duration-300 hover:bg-black hover:text-white" /></a>
                    <img src={product} alt="" className="w-[285px] h-[320px] " />
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
                      <span className="text-black/20 line-through px-1">$100.00</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="swiper-slide">
              <div className="xl:col-span-3 lg:col-span-4 col-span-12 md:col-span-6 mb-2 w-[264px] mx-auto">
                <div className="product-card hover:bg-zinc-100">
                  <div className="w-full h-[332px] relative">
                    <a href="#"><i className="fa-regular fa-star text-lg bg-white px-[13px] py-[14px] rounded-full absolute top-5 right-6 btn invisible opacity-0 transition-opacity duration-300 hover:bg-black hover:text-white" /></a>
                    <a href="#"><i className="fa-solid fa-arrow-right-arrow-left text-lg bg-white px-4 py-[14px] rounded-full absolute top-[70px] right-6 btn invisible opacity-0 transition-opacity duration-300 hover:bg-black hover:text-white" /></a>
                    <a href="#"><i className="fa-regular fa-eye text-lg bg-white px-[13px] py-[14px] rounded-full absolute top-[121px] right-6 btn invisible opacity-0 transition-opacity duration-300 hover:bg-black hover:text-white" /></a>
                    <img src={product} alt="" className="w-[285px] h-[320px] " />
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
                      <span className="text-black/20 line-through px-1">$100.00</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="swiper-slide">
              <div className="xl:col-span-3 lg:col-span-4 col-span-12 md:col-span-6 mb-2 w-[264px] mx-auto">
                <div className="product-card hover:bg-zinc-100">
                  <div className="w-full h-[332px] relative">
                    <a href="#"><i className="fa-regular fa-star text-lg bg-white px-[13px] py-[14px] rounded-full absolute top-5 right-6 btn invisible opacity-0 transition-opacity duration-300 hover:bg-black hover:text-white" /></a>
                    <a href="#"><i className="fa-solid fa-arrow-right-arrow-left text-lg bg-white px-4 py-[14px] rounded-full absolute top-[70px] right-6 btn invisible opacity-0 transition-opacity duration-300 hover:bg-black hover:text-white" /></a>
                    <a href="#"><i className="fa-regular fa-eye text-lg bg-white px-[13px] py-[14px] rounded-full absolute top-[121px] right-6 btn invisible opacity-0 transition-opacity duration-300 hover:bg-black hover:text-white" /></a>
                    <img src={product} alt="" className="w-[285px] h-[320px] " />
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
                      <span className="text-black/20 line-through px-1">$100.00</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <section>
    {/* End Main */}
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
        <div className="mx-auto">
          <i className="fa-regular fa-headphones text-3xl" />
          <h3 className="font-bold text-xl mt-3 mb-2">Online Support</h3>
          <p>24 hours a day, 7 days a week</p>
        </div>
        <div className="mx-auto">
          <i className="fa-light fa-credit-card text-3xl" />
          <h3 className="font-bold text-xl mt-3 mb-2">Flexible Payment</h3>
          <p>Pay with multiple credit cards</p>
        </div>
      </div>
    </div>
  </section>
</main>

    </div>
  )
}

export default ProductDetail
