import instanceClient from "@/configs/client";
import { useQuery } from "@tanstack/react-query";
import { message } from "antd";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";

const BlogDetail = () => {
  const nav = useNavigate();
  const { duong_dan } = useParams<{ duong_dan: string }>();
  const [viewed, setViewed] = useState(false);
  const { data } = useQuery({
    queryKey: ["blogDetail", duong_dan],
    queryFn: async () => {
      try {
        const response = await instanceClient.post(
          `/xem-bai-viet/${duong_dan}`
        );
        return response.data;
      } catch (error) {
        nav("/404");
        message.error("Bài viết không tồn tại");

        return { baiVietDetail: null, baiVietTop: [], danhMucTinTuc: [] };
      }
    },
    enabled: !!duong_dan,
  });

  // Format ngày tháng
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    };
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("vi-VN", options).format(date);
  };

  // Tăng lượt xem nếu chưa xem trong 24 giờ
  useEffect(() => {
    if (duong_dan) {
      const viewedArticles = JSON.parse(
        localStorage.getItem("viewedArticles") || "{}"
      );
      const currentTime = Date.now();

      if (!viewedArticles[duong_dan]) {
        instanceClient
          .post(`/xem-bai-viet/${duong_dan}`, { tang_luot_xem: true })
          .then(() => {
            viewedArticles[duong_dan] = currentTime;
            localStorage.setItem(
              "viewedArticles",
              JSON.stringify(viewedArticles)
            );
            setViewed(true);
          })
          .catch((error) => {
            console.error("Lỗi khi tăng lượt xem:", error);
          });
      } else {
        const lastViewedTime = viewedArticles[duong_dan];
        const hoursPassed = (currentTime - lastViewedTime) / (1000 * 60 * 60);

        if (hoursPassed > 24) {
          instanceClient
            .post(`/xem-bai-viet/${duong_dan}`, { tang_luot_xem: true })
            .then(() => {
              viewedArticles[duong_dan] = currentTime;
              localStorage.setItem(
                "viewedArticles",
                JSON.stringify(viewedArticles)
              );
              setViewed(true);
            })
            .catch((error) => {
              console.error("Lỗi khi tăng lượt xem:", error);
            });
        } else {
          setViewed(true);
        }
      }
    }
  }, [duong_dan]);

  return (
    <div>
      {/* Chi tiết bài viết */}
      <div className="flex flex-col lg:flex-row w-full px-10 mt-20 ml-5 mb-20">
        <div className="lg:w-2/3 pr-5">
          <div className="w-full">
            {data?.data?.baiVietDetail ? (
              <div className="mt-4">
                <img
                  src={data?.data?.baiVietDetail.anh_tin_tuc}
                  alt={data?.data?.baiVietDetail.tieu_de}
                  className="w-full h-auto mb-10"
                />
                <h1 className="text-4xl font-semibold mb-6">
                  {data?.data?.baiVietDetail.tieu_de}
                </h1>
                <span className="text-xl text-gray-400">
                  Ngày đăng: {formatDate(data?.data?.baiVietDetail.created_at)}
                </span>
                <div
                  dangerouslySetInnerHTML={{
                    __html: data?.data?.baiVietDetail.noi_dung,
                  }}
                  className="mt-4 text-lg"
                />
              </div>
            ) : (
              <h1 className="text-xl font-semibold">Bài viết không tồn tại</h1>
            )}
          </div>
        </div>

        {/* Bài viết liên quan */}
        <div className="lg:w-1/3 pl-5 mt-3">
          <h3 className="text-2xl font-semibold mb-4">Bài viết liên quan</h3>
          <div className="space-y-4">
            {data?.data?.baiVietTop && data?.data?.baiVietTop.length > 0 ? (
              data?.data?.baiVietTop.map((baiViet: any) => (
                <div key={baiViet.id} className="flex items-start">
                  <img
                    src={baiViet.anh_tin_tuc}
                    alt={baiViet.tieu_de}
                    className="w-16 h-16 rounded object-cover mr-4"
                  />
                  <div>
                    <h4 className="text-lg font-medium">{baiViet.tieu_de}</h4>
                    <p className="text-gray-500 text-sm">
                      {baiViet.danh_muc_tin_tuc.ten_danh_muc_tin_tuc}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p>Không có bài viết liên quan.</p>
            )}
          </div>
        </div>
      </div>

      {/* Danh mục nổi bật */}
      <div className="mb-36">
        {data?.data?.danhMucTinTuc &&
          Array.isArray(data?.data?.danhMucTinTuc) &&
          data?.data?.danhMucTinTuc.length > 0 ? (
          <Swiper
            spaceBetween={20}
            loop={true}
            className="related-articles-slides"
            breakpoints={{
              1024: {
                slidesPerView: 6,
              },
              768: {
                slidesPerView: 4,
              },
              640: {
                slidesPerView: 3,
              },
              480: {
                slidesPerView: 2,
              },
            }}
          >
            {data?.data?.danhMucTinTuc.map((item: any) => (
              <SwiperSlide key={item.id}>
                <div className="p-4 bg-white rounded-lg shadow-md relative">
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
        ) : (
          <p>Không có danh mục nổi bật.</p>
        )}
      </div>

    </div>
  );
};

export default BlogDetail;
