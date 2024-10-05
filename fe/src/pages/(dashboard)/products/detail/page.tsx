// const allImages = [product.anh_san_pham, ...variantImages].filter(Boolean);
{/* <div className="lg:col-span-6 col-span-12 mb-6">
<div className="bg-[#FAFAFB] w-full h-[400px] inline-flex justify-center items-center mb-4 rounded-2xl shadow shadow-zinc-300/60">
  <Swiper
    style={{
      "--swiper-navigation-color": "#000000",
      "--swiper-pagination-color": "#000000",
    } as React.CSSProperties}
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
    className="mySwiper2 w-full swiper-with-hover"
    loop={true}
    spaceBetween={10}
  >
    {allImages.map((image, index) => (
      <SwiperSlide key={index}>
        <img
          src={image}
          alt=""
          onClick={() => handlePreview(image)}
          style={{ cursor: "pointer", maxHeight: "100%", width: "auto" }}
        />
      </SwiperSlide>
    ))}
  </Swiper>
</div>
<div className="w-full mx-auto">
  <Swiper
    onSwiper={(swiperInstance) =>
      setThumbsSwiper(swiperInstance as any)
    }
    loop={true}
    spaceBetween={16}
    slidesPerView={4}
    freeMode={true}
    watchSlidesProgress={true}
    modules={[FreeMode, Navigation, Thumbs]}
    className="mySwiper1"
  >
    {allImages.map((image, index) => (
      <SwiperSlide key={index}>
        <div className="w-[60px] h-[60px] bg-[#F4F4F4] rounded-lg border border-[#F4F4F4] flex justify-center items-center">
          <img src={image} alt="" style={{ cursor: "pointer", maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
        </div>
      </SwiperSlide>
    ))}
  </Swiper>
</div>
</div> */}

import React, { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, FreeMode, Navigation, Pagination, Thumbs } from "swiper/modules";
import type { Swiper as SwiperType } from 'swiper';
import instance from '@/configs/admin';
import { Button, Modal, Image, Rate } from 'antd';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';import 'swiper/css/pagination';
interface ProductDetailProps {
  item: {
    id: number;
    ten_san_pham: string;
  };
}

interface ProductVariant {
  id: number;
  gia_ban: number;
  gia_khuyen_mai?: number;
  so_luong_bien_the: number;

  mau_bien_the: {
    ma_mau_sac: string;
    ten_mau: string;
  };
  kich_thuoc_bien_the: {
    kich_thuoc: string;
  };
  anh_bien_the: Array<{ duong_dan_anh: string }>;
  ten_san_pham: string;
}

interface Review {
  id: number;
  user_id: number;
  san_pham_id: number;
  don_hang_id: number;
  so_sao_san_pham: number;
  so_sao_dich_vu_van_chuyen: number;
  chat_luong_san_pham: string;
  mo_ta: string;
  phan_hoi: string | null;
  huu_ich: number | null;
  created_at: string | null;
  updated_at: string | null;
  deleted_at: string | null;
  user: {
    id: number;
    ho: string;
    ten: string;
    anh_nguoi_dung: string | null;
  };
}

interface Product {
  id: number;
  ten_san_pham: string;
  mo_ta_ngan: string;
  noi_dung: string;
  anh_san_pham: string;
  bien_the_san_pham: ProductVariant[];
  danh_gias: Review[];
}

const Detail: React.FC<ProductDetailProps> = ({ item }) => {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [isHeart, setIsHeart] = useState(false);
  const [expandedResponses, setExpandedResponses] = useState<number[]>([]);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const { data, isLoading, error } = useQuery<{ data: Product }>({
    queryKey: ["PRODUCT_DETAIL", item.id],
    queryFn: async () => {
      const response = await instance.get(`/sanpham/${item.id}`);
      return response.data;
    },
  });

  const averageRating = useMemo(() => {
    if (!data || !data.data || data.data.danh_gias.length === 0) return 0;
    const totalStars = data.data.danh_gias.reduce((sum, review) => sum + review.so_sao_san_pham, 0);
    return (totalStars / data.data.danh_gias.length).toFixed(1);
  }, [data]);

  useEffect(() => {
    if (data && data.data.bien_the_san_pham.length > 0) {
      setSelectedColor(data.data.bien_the_san_pham[0].mau_bien_the.ma_mau_sac);
      setSelectedSize(data.data.bien_the_san_pham[0].kich_thuoc_bien_the.kich_thuoc);
    }
  }, [data]);

  const handleCancel = () => {
    setOpen(false);
  };

  const handlePreview = (imageUrl: string) => {
    setPreviewImage(imageUrl);
    setPreviewOpen(true);
  };

  const handleClickHeart = () => {
    setIsHeart(!isHeart);
  };

  const toggleResponse = (reviewId: number) => {
    setExpandedResponses(prev =>
      prev.includes(reviewId)
        ? prev.filter(id => id !== reviewId)
        : [...prev, reviewId]
    );
  };

  const toggleDescription = () => {
    setIsDescriptionExpanded(!isDescriptionExpanded);
  };
  const getStockStatus = (variant: ProductVariant) => {
    if (variant.so_luong_bien_the > 0) {
      return (
        <span style={{ fontSize: "20px" }}>
          kho: {variant.so_luong_bien_the}
        </span>
      );
    } else {
      return (
        <span style={{ fontSize: "18px" }}>
          Hết hàng
        </span>
      );
    }
  };
  


  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {(error as Error).message}</div>;
  if (!data || !data.data) return <div>No product data available</div>;

  const product = data.data;

  const uniqueColors = Array.from(new Set(product.bien_the_san_pham.map(variant => variant.mau_bien_the.ma_mau_sac)));
  const sizesForSelectedColor = product.bien_the_san_pham
    .filter(variant => variant.mau_bien_the.ma_mau_sac === selectedColor)
    .map(variant => variant.kich_thuoc_bien_the.kich_thuoc);

  const selectedVariant = product.bien_the_san_pham.find(
    variant => variant.mau_bien_the.ma_mau_sac === selectedColor && variant.kich_thuoc_bien_the.kich_thuoc === selectedSize
  );

  const variantImages = selectedVariant ? selectedVariant.anh_bien_the.map(img => img.duong_dan_anh) : [];
  const allImages = [product.anh_san_pham, ...variantImages].filter(Boolean);

  return (
    <div>
      <p onClick={() => setOpen(true)} className="cursor-pointer"
      >
        {item.ten_san_pham}
      </p>

      <Modal
        centered
        open={open}
        width={1200}
        className=""
        okText="Đồng ý"
        footer={null}
        onCancel={handleCancel}
      >
        <div className="max-w-6xl mx-auto my-8 p-6 border rounded-lg shadow-lg">
          <section className="mb-8">
            <div className="container pb-8">
              <div className="md:px-8 px-4 pt-3 grid grid-cols-12 gap-3 w-full justify-center">
                {/* <div className="lg:col-span-6 col-span-12 mb-6">
                  <div className="bg-[#FAFAFB] w-full h-[400px] inline-flex justify-center items-center mb-4 rounded-2xl shadow shadow-zinc-300/60">
                    <Swiper
                      style={{
                        "--swiper-navigation-color": "#000000",
                        "--swiper-pagination-color": "#000000",
                      } as React.CSSProperties}
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
                      className="mySwiper2 w-full swiper-with-hover"
                      loop={true}
                      spaceBetween={10}
                    >
                      {variantImages.map((image, index) => (
                        <SwiperSlide key={index}>
                          <img
                            src={image}
                            alt=""
                            onClick={() => handlePreview(image)}
                            style={{ cursor: "pointer", maxHeight: "100%", width: "auto", objectFit: "contain" }}
                          />
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </div>
                  <div className="w-full mx-auto">
                    <Swiper
                      onSwiper={(swiperInstance) => setThumbsSwiper(swiperInstance as any)}
                      loop={true}
                      spaceBetween={16}
                      slidesPerView={4}
                      freeMode={true}
                      watchSlidesProgress={true}
                      modules={[FreeMode, Navigation, Thumbs]}
                      className="mySwiper1"
                    >
                      {variantImages.map((image, index) => (
                        <SwiperSlide key={index}>
                          <div className="w-[60px] h-[60px] bg-[#F4F4F4] rounded-lg border border-[#F4F4F4] flex justify-center items-center">
                            <img src={image} alt="" style={{ cursor: "pointer", maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
                          </div>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </div>
                </div> */}

                <div className="lg:col-span-6 col-span-12 mb-6">
                  <div className="bg-[#FAFAFB] w-full h-[400px] inline-flex justify-center items-center mb-4 rounded-2xl shadow shadow-zinc-300/60">
                    <Swiper
                      style={{
                        "--swiper-navigation-color": "#000000",
                        "--swiper-pagination-color": "#000000",
                      } as React.CSSProperties}
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
                      className="mySwiper2 w-full swiper-with-hover"
                      loop={true}
                      spaceBetween={10}
                    >
                      {allImages.map((image, index) => (
      <SwiperSlide key={index}>                                  <img
                            src={image}
                            alt=""
                            onClick={() => handlePreview(image)}
                            style={{ cursor: "pointer", maxHeight: "100%", width: "auto" }}
                          />
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </div>
                  <div className="w-full mx-auto">
                    <Swiper
                      onSwiper={(swiperInstance) =>
                        setThumbsSwiper(swiperInstance as any)
                      }
                      loop={true}
                      spaceBetween={16}
                      slidesPerView={4}
                      freeMode={true}
                      watchSlidesProgress={true}
                      modules={[FreeMode, Navigation, Thumbs]}
                      className="mySwiper1"
                    >
                      {allImages.map((image, index) => (
      <SwiperSlide key={index} >
                                  <div className="w-[full] h-[full] bg-[#F4F4F4] rounded-lg border border-[#F4F4F4] flex justify-center items-center">
                            <img src={image} alt="" style={{ cursor: "pointer", maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
                          </div>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </div>
                </div>
                <div className="lg:col-span-6 col-span-12 px-4 w-full">
                  <div className="product_detail_name">
                    <div className="flex justify-between mb-2">
                      <h3 className="font-bold text-2xl">{product.ten_san_pham}</h3>
                    
                    </div>
                    <h4 className="mb-3 text-xl font-normal">
                      {product.mo_ta_ngan}
                    </h4>
                    <div className="stars_reviews flex mb-3">
                      <Rate disabled defaultValue={Number(averageRating)} allowHalf />
                      <span className="px-2 text-[#A4A1AA] text-sm">
                        {averageRating} <span className="px-[2px]">({product.danh_gias.length} Reviews)</span>
                      </span>
                    </div>
                  </div>

                  {selectedVariant && (
                    <div className="mb-4 text-lg font-medium">
                      {selectedVariant.gia_khuyen_mai ? (
                        <>
                          <del className="text-[#A4A1AA]">{selectedVariant.gia_ban.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</del>
                          <span className="ml-2">{selectedVariant.gia_khuyen_mai.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>
                        </>
                      ) : (
                        <span>{selectedVariant.gia_ban.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>
                      )}
                    </div>
                  )}

                  <div className="mb-4">
                    <h3 className="text-gray-900 mb-2 font-bold">Color</h3>
                    <div className="flex space-x-2">
                      {uniqueColors.map((color, index) => (
                        <button
                          key={index}
                          className={`w-7 h-7 rounded-md border-2 ${selectedColor === color ? "border-black" : ""}`}
                          style={{ backgroundColor: color }}
                          onClick={() => setSelectedColor(color)}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="items-center mt-4 mb-3">
                    <h3 className="mr-4 font-bold">Size</h3>
                    <div className="flex mt-3">
                      {sizesForSelectedColor.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`w-8 h-8 rounded-md border border-blackL text-blackL hover:bg-blackL hover:text-white mr-2 ${selectedSize === size ? "bg-blackL text-white" : ""}`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                  <p style={{ marginTop: "10px" }}>
  {selectedVariant && getStockStatus(selectedVariant)}
</p>

                    
                  {/* <div className="mt-8 flex gap-3">
                    <div className="border rounded-lg border-black w-24 h-10 flex justify-center items-center shadow-md">
                      <button className="py-1 pr-2">
                        <i className="fa-solid fa-minus" />
                      </button>
                      <input
                        type="number"
                        id="numberInput"
                        defaultValue={1}
                        min={1}
                        maxLength={2}
                        className="w-8 h-8 border-0 focus:ring-0 focus:outline-none text-center"
                      />
                      <button className="py-1 pl-2">
                        <i className="fa-solid fa-plus" />
                      </button>
                    </div>
                    <button className="btn-black w-[200px] h-10 rounded-lg text-sm">
                      Add to Cart
                    </button>
                    <button
                      onClick={handleClickHeart}
                      className={`border border-black w-10 h-10 rounded-lg flex items-center justify-center shadow-md ${isHeart ? "bg-red-600" : ""}`}
                    >
                      <i
                        className={`fa-regular fa-heart text-xl ${isHeart ? "text-white" : "text-red-600"}`}
                      />
                    </button>
                  </div> */}
                </div>
              </div>
            </div>
          </section>

          <div className="border-t pt-6">
            <h1 className="text-2xl font-semibold mb-4">Chi tiết sản phẩm</h1>
            <div className="mb-8 flex justify-center"></div>
            <div className="mb-8 flex justify-center">
              <div className="bg-[#FAFAFB] w-1000 h-[400px] flex justify-center items-center mb-4 rounded-2xl shadow shadow-zinc-300/60">
                <img
                  src={product.anh_san_pham}
                  alt={product.ten_san_pham}
                  onClick={() => handlePreview(product.anh_san_pham)}
                  className="cursor-pointer max-h-full w-auto object-contain"
                />
              </div>
            </div>
            <div
              className={`description mb-4 text-sm px-5 whitespace-pre-wrap ${isDescriptionExpanded ? '' : 'line-clamp-3'
                }`}
              dangerouslySetInnerHTML={{ __html: product.noi_dung }}
            />
            <div className="flex justify-center">
              <Button onClick={toggleDescription} className="mb-4">
                {isDescriptionExpanded ? 'Thu gọn' : 'Xem thêm'}
              </Button>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">Đánh giá sản phẩm</h2>
              <div className="space-y-4">
                {product.danh_gias.length > 0 ? (
                  product.danh_gias.slice(-5).map((review) => (
                    <div key={review.id} className="border p-4 rounded-lg">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                          {review.user.anh_nguoi_dung ? (
                            <img
                              src={review.user.anh_nguoi_dung}
                              alt={`${review.user.ho} ${review.user.ten}`}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-500">
                              {review.user.ho[0]}{review.user.ten[0]}
                            </div>
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium">{`${review.user.ho} ${review.user.ten}`}</h4>
                          <div className="flex items-center">
                            <Rate disabled defaultValue={review.so_sao_san_pham} />
                            <span className="ml-2 text-xs text-gray-500">
                              {review.created_at ? new Date(review.created_at).toLocaleDateString() : 'N/A'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700 font-medium mb-1">{review.chat_luong_san_pham}</p>
                      <p className="text-gray-600 text-sm">{review.mo_ta}</p>
                      {review.phan_hoi && (
                        <div className="mt-2">
                          <button
                            onClick={() => toggleResponse(review.id)}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            {expandedResponses.includes(review.id) ? "Ẩn phản hồi" : "Xem phản hồi từ shop"}
                          </button>
                          {expandedResponses.includes(review.id) && (
                            <div className="mt-2 pl-4 border-l-2 border-gray-300">
                              <p className="text-sm font-medium">Phản hồi từ shop:</p>
                              <p className="text-sm text-gray-600">{review.phan_hoi}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p>Chưa có đánh giá nào cho sản phẩm này.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </Modal>
      <Image
        style={{ display: 'none' }}
        src={previewImage}
        preview={{
          visible: previewOpen,
          onVisibleChange: (visible) => {
            setPreviewOpen(visible);
          },
        }}
      />
    </div>
  );
};

export default Detail;
