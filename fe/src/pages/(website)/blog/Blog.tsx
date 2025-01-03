import instanceClient from "@/configs/client";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css"; // Import Swiper CSS
import { bannerOurStory } from "@/assets/img";
import { message } from "antd";

const Blog = () => {
  const nav = useNavigate();
  const { data } = useQuery({
    queryKey: ["baiviet"],
    queryFn: async () => {
      try {
        const response = await instanceClient.get(`/load-danh-muc-tin-tuc`);
        console.log("Response data:", response.data);
        return response.data;
      } catch (error) {
        nav("/404");
        message.error("Bài viết không tồn tại");
      }
    },
  });

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    };
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("vi-VN", options).format(date);
  };

  return (
    <>
      {!data?.Danh_muc_tin_tuc?.length &&
      !data?.Lay_bai_viet_theo_danh_muc?.length ? (
        <div className="mb-5 text-center">
          <img src={bannerOurStory} alt="Banner" className="w-full" />
          <h2 className="lg:text-4xl text-2xl font-semibold mb-6 mt-6">
            Câu Chuyện Của Chúng Tôi
          </h2>
          <p className="lg:text-lg text-base lg:max-w-3xl max-w-lg mx-auto mb-6">
            Được thành lập với niềm đam mê thời trang và cam kết về chất lượng,
            Krist Clothing Shop cung cấp một loạt các trang phục phong cách.
            Chúng tôi tin tưởng vào việc trao quyền cho mọi người để cảm thấy tự
            tin và thoải mái trong làn da của chính mình. Hành trình của chúng
            tôi bắt đầu với một ý tưởng đơn giản: tạo ra quần áo kết hợp phong
            cách, sự thoải mái và chất lượng một cách liền mạch.
          </p>
        </div>
      ) : (
        <div className="mt-10 pl-4 lg:pl-20 pb-20">
          {/* Hiển thị danh mục tin tức */}
          {data?.Danh_muc_tin_tuc?.length > 0 && (
            <Swiper
              spaceBetween={20}
              slidesPerView={1}
              loop={true}
              className="related-articles-slides"
              breakpoints={{
                640: {
                  slidesPerView: 2,
                },
                768: {
                  slidesPerView: 3,
                },
                1024: {
                  slidesPerView: 6,
                },
              }}
            >
              {data.Danh_muc_tin_tuc.map((item: any) => (
                <SwiperSlide key={item.id}>
                  <div className="p-4 bg-white relative">
                    <Link to={`/danhmuctintuc/${item.duong_dan}`}>
                      <div className="relative w-full h-40 rounded-lg overflow-hidden cursor-pointer">
                        <img
                          src={item.hinh_anh}
                          alt={item.ten_danh_muc_tin_tuc}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                          <span className="text-white text-lg font-semibold text-center px-2">
                            {item.ten_danh_muc_tin_tuc}
                          </span>
                        </div>
                      </div>
                    </Link>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          )}

          {/* Hiển thị bài viết theo danh mục */}
          {data?.Lay_bai_viet_theo_danh_muc.filter(
            (category: any) => category.tin_tuc?.length > 0
          ).map((category: any) => (
            <div key={category.id} className="mb-6 mt-20">
              <Link to={`/danhmuctintuc/${category.duong_dan}`}>
                <h2 className="text-3xl font-bold mb-0">
                  {category.ten_danh_muc_tin_tuc}
                </h2>
              </Link>
              <div className="flex items-center justify-between">
                <h4 className="text-xl font-bold mb-4 mt-10">Mới nhất</h4>
                <Link to={`/danhmuctintuc/${category.duong_dan}`}>
                  <h4 className="text-xl font-bold mb-4 mt-10 text-right hover:text-red-500 mr-10">
                    Xem thêm <i className="fa-solid fa-arrow-right"></i>
                  </h4>
                </Link>
              </div>
              <div className="flex flex-wrap -mx-2">
                {category.tin_tuc.slice(0, 4).map((article: any) => (
                  <div
                    key={article.id}
                    className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-2"
                  >
                    <div className="bg-white p-4">
                      <Link to={`/xem-bai-viet/${article.duong_dan}`}>
                        <img
                          src={article.anh_tin_tuc}
                          alt={article.tieu_de}
                          className="w-full h-[300px] object-cover mb-3 cursor-pointer"
                        />
                        <h3 className="text-2xl font-semibold hover:text-red-500">
                          {article.tieu_de}
                        </h3>
                        <span className="text-lg text-gray-400">
                          {article.danh_muc_tin_tuc.ten_danh_muc_tin_tuc} |{" "}
                          {formatDate(article.created_at)}
                        </span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default Blog;
