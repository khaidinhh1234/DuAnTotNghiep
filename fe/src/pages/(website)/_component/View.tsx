import { product, products1, products2, sanPham2 } from "@/assets/img";
import instance from "@/configs/admin";
import instanceClient from "@/configs/client";
import { useQuery } from "@tanstack/react-query";
import { Modal, Rate } from "antd";
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Autoplay,
  FreeMode,
  Navigation,
  Pagination,
  Thumbs,
} from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
const View = ({ id }: any) => {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [isHeart, setIsHeart] = useState(false);
  //   console.log(id);
  const { data } = useQuery({
    queryKey: ["PRODUCT_DETAIL", id],
    queryFn: async () => {
      try {
        const response = await instanceClient.get(`chi-tiet-san-pham/${id}`);
        return response.data;
      } catch (error) {
        throw new Error("Lỗi khi lấy thông tin");
      }
    },
  });
  const product = data?.data;
  // console.log(product);
  const [open, setOpen] = React.useState<boolean>(false);
  // danh gia
  const averageRating = useMemo(() => {
    if (!data || !product || product?.danh_gias.length === 0) return 0;
    const totalStars = product.danh_gias.reduce(
      (sum: any, review: any) => sum + review.so_sao_san_pham,
      0
    );
    return (totalStars / data.data.danh_gias.length).toFixed(1);
  }, [data]);

  // kich thuoc
  const sizesForSelectedColor = product?.bien_the_san_pham
    ?.filter(
      (variant: any) => variant?.mau_bien_the?.ma_mau_sac === selectedColor
    )
    ?.map((variant: any) => variant?.kich_thuoc_bien_the?.kich_thuoc);

  interface Variant {
    mau_bien_the: {
      ma_mau_sac: string;
    };
    kich_thuoc_bien_the: {
      kich_thuoc: string;
    };
    gia_ban: number;
    gia_khuyen_mai: number;
    anh_bien_the: string[];
  }

  interface Product {
    bien_the_san_pham: Variant[];
  }

  const sanpham = product?.bien_the_san_pham
    ?.filter(
      (variant: Variant) =>
        variant?.mau_bien_the?.ma_mau_sac === selectedColor &&
        variant?.kich_thuoc_bien_the?.kich_thuoc === selectedSize
    )
    ?.map((variant: Variant) => ({
      gia_ban: variant?.gia_ban,
      gia_khuyen_mai: variant?.gia_khuyen_mai,
      anh_san_pham: variant?.anh_bien_the,
    }));

  console.log(sanpham);
  //   const showLoading = () => {
  //     setOpen(true);
  //   };
  //   const [activeTab, setActiveTab] = useState("descriptions"); // State to manage active tab

  const handleColorClick = (color: any) => {
    setSelectedColor(color);
  };

  // const colors = [
  //   "bg-red-500",
  //   "bg-blue-500",
  //   "bg-purple-500",
  //   "bg-black",
  //   "bg-yellow-500",
  //   "bg-green-500",
  // ];
  const handleSizeClick = (size: string) => {
    setSelectedSize(size);
  };

  // const sizes = ["S", "M", "L", "XL", "XXL"];

  const handleClickHeart = () => {
    setIsHeart(!isHeart);
  };
  const handlePreview = (imageUrl: string) => {
    setPreviewImage(imageUrl);
    setPreviewOpen(true);
  };

  // -

  // +

  // const images = [product, products1, products2, sanPham2];

  useEffect(() => {
    if (product && product.bien_the_san_pham.length > 0) {
      const firstVariant = product?.bien_the_san_pham[0];
      setSelectedColor(firstVariant?.mau_bien_the?.ma_mau_sac);
      setSelectedSize(firstVariant?.kich_thuoc_bien_the?.kich_thuoc);
    }
  }, [product]);
  return (
    <>
      <Link to={``} type="primary" onClick={() => setOpen(true)}>
        <i className="z-20 fa-regular fa-eye text-lg bg-white hover:bg-black hover:text-white w-11 h-11 flex items-center justify-center absolute top-[115px] right-6 btn invisible opacity-0 transition-opacity duration-300 rounded-full" />
      </Link>
      <Modal
        width={1300}
        // title={<p>Loading Modal</p>}
        footer={null}
        open={open}
        onCancel={() => setOpen(false)}
      >
        <div>
          {" "}
          <section>
            <div className="container py-5">
              <div className="md:px-5 px-5 pt-3 grid grid-cols-12 gap-10 w-[100%] justify-center ">
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
                      thumbs={
                        thumbsSwiper ? { swiper: thumbsSwiper } : undefined
                      }
                      modules={[
                        Autoplay,
                        Pagination,
                        Navigation,
                        Thumbs,
                        FreeMode,
                      ]}
                      className="mySwiper2 w-[555px]  swiper-with-hover"
                      loop={true}
                      spaceBetween={10}
                    >
                      {sanpham?.map((item: any) =>
                        item?.anh_san_pham?.map((image: any, index: any) => (
                          <SwiperSlide key={index}>
                            <img
                              src={image?.duong_dan_anh}
                              alt=""
                              onClick={() =>
                                handlePreview(image?.duong_dan_anh)
                              }
                              style={{ cursor: "pointer" }}
                              className="mx-auto h-[550px] w-[450px]"
                            />
                          </SwiperSlide>
                        ))
                      )}
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
                      {sanpham?.map((item: any) =>
                        item?.anh_san_pham?.map((image: any, index: any) => (
                          <SwiperSlide key={index}>
                            <div className="md:w-[100px] md:h-[100px] w-[62px] h-[60px] bg-[#F4F4F4] rounded-2xl px-1 border border-[#F4F4F4] flex justify-center items-center ">
                              <img
                                src={image?.duong_dan_anh}
                                alt={image?.duong_dan_anh}
                                style={{
                                  cursor: "pointer",
                                  objectFit: "cover",
                                  objectPosition: "top",
                                  width: "100%",
                                  height: "100%",
                                  imageRendering: "auto",
                                }}
                                className="w-full h-full py-1 rounded-2xl"
                              />
                            </div>
                          </SwiperSlide>
                        ))
                      )}
                    </Swiper>
                  </div>
                </div>
                <div className="lg:col-span-6 col-span-12 px-4 w-[100%] ">
                  <div className="product_detail_name">
                    {" "}
                    <div className="text-end">
                      {product?.hang_moi === 1 && (
                        <a className="bg-red-500/90 text-sm px-2 py-[2px]  text-[#ffffff] rounded-[5px] font-bold mx-1">
                          Mới
                        </a>
                      )}
                      {product?.gia_tot === 1 && (
                        <a className="bg-[#3CD139]/90 text-sm px-2 py-[2px] text-[#ffffff] rounded-[5px] font-bold mx-1">
                          Khuyến mãi lớn
                        </a>
                      )}
                    </div>
                    <div className="flex justify-between ">
                      <h3 className=" font-bold text-3xl w-full">
                        {product?.ten_san_pham}
                      </h3>
                    </div>
                    <h4 className=" text-xl font-normal">
                      {product?.ma_san_pham}
                    </h4>
                    <div className="stars_reviews d-flex ">
                      <span>
                        <Rate disabled defaultValue={Number(averageRating)} />
                      </span>
                      <span className="px-2 text-[#A4A1AA] text-sm">
                        {averageRating}{" "}
                        <span className="px-[2px]">
                          ({product?.danh_gias?.length} đánh giá)
                        </span>
                      </span>
                    </div>
                  </div>
                  {sanpham?.map((gia: any) => (
                    <div
                      className=" mb-5 text-3xl font-semibold text-red-500 flex items-center"
                      key={gia}
                    >
                      {gia?.gia_khuyen_mai != null ? (
                        <>
                          {gia?.gia_khuyen_mai?.toLocaleString("vi-VN") ?? 0} đ
                          <del className="text-[#acabad] text-xl mx-2 mt-1">
                            {gia?.gia_ban?.toLocaleString("vi-VN")} đ
                          </del>
                          <span className="text-sm bg-red-100 text-red-600 px-2 rounded-full font-normal py-[2px]">
                            -
                            {Math.floor(
                              ((gia?.gia_ban - gia?.gia_khuyen_mai) /
                                gia?.gia_ban) *
                                100
                            )}
                            %
                          </span>
                        </>
                      ) : (
                        <p className="text-black">
                          {" "}
                          {gia?.gia_ban?.toLocaleString("vi-VN")} đ
                        </p>
                      )}
                    </div>
                  ))}
                  <p className="description mb-4 font-medium">
                    {product?.mo_ta_ngan}
                  </p>
                  <div className="mb-4">
                    <h3 className="  text-gray-900 mb-2 font-bold text-lg">
                      Color{" "}
                    </h3>
                    {/* <div className="flex space-x-2">
                  <button className="w-9 h-9 bg-red-500 rounded-md border-2 border-transparent hover:border-blackL" />
                  <button className="w-9 h-9 bg-blue-500 rounded-md border-2 border-transparent hover:border-blackL" />
                  <button className="w-9 h-9 bg-purple-500 rounded-md border-2 border-transparent hover:border-blackL" />
                  <button className="w-9 h-9 bg-black rounded-md border-2 border-transparent hover:border-blackL" />
                  <button className="w-9 h-9 bg-yellow-500 rounded-md border-2 border-transparent hover:border-blackL" />
                  <button className="w-9 h-9 bg-green-500 rounded-md border-2 border-transparent hover:border-blackL" />
                </div> */}
                    <div className="flex space-x-2">
                      {product?.bien_the_san_pham?.map(
                        (color: any, index: number) => (
                          <button
                            key={index}
                            className={`w-9 h-9 rounded-md border-2 ${
                              selectedColor === color?.mau_bien_the?.ma_mau_sac
                                ? "border-black"
                                : ""
                            } 
                          
                        `}
                            style={{
                              backgroundColor: color?.mau_bien_the?.ma_mau_sac,
                            }}
                            onClick={() =>
                              handleColorClick(color?.mau_bien_the?.ma_mau_sac)
                            }
                          />
                        )
                      )}
                    </div>
                  </div>
                  <div className=" items-center mt-4 mb-3">
                    <h3 className=" mr-4 font-bold text-lg">Size </h3>
                    <div className="flex mt-3">
                      {sizesForSelectedColor?.map((size: any) => (
                        <button
                          key={size}
                          onClick={() => handleSizeClick(size)}
                          className={`w-10 h-10 rounded-md border border-blackL text-blackL hover:bg-blackL hover:text-white mr-2 ${
                            selectedSize === size ? "bg-blackL text-white" : ""
                          }`}
                        >
                          {size}
                        </button>
                      ))}
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
                        max={100}
                        className="xl:w-10 xl:h-10 lg:w-5 lg:h-5 md:w-10 md:h-10  w-5 h-5 border-0 focus:ring-0 focus:outline-none text-center text-lg font-semibold"
                      />
                      <button className="py-2 pl-2">
                        <i className="fa-solid fa-plus" />
                      </button>
                    </div>
                    <button className="btn-black xl:w-[340px] w-[250px] lg:w-[250px] md:w-[340px] xl:h-14 lg:h-10  md:h-14 h-10 rounded-lg text-lg font-medium">
                      Thêm vào giỏ hàng
                    </button>
                    <button
                      onClick={handleClickHeart}
                      className={`border border-black xl:w-16 lg:w-11 md:w-16 w-11 xl:h-14 lg:h-10 md:h-14 h-10 rounded-lg flex items-center justify-center shadow-lg shadow-slate-400/50 
                 
                      `}
                    >
                      <i
                        className={`fa-heart text-3xl text-red-600 ${isHeart ? "fa-solid " : "fa-regular "}`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </Modal>
    </>
  );
};

export default View;