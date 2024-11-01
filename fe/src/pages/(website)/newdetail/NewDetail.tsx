import instanceClient from "@/configs/client";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { useState, useRef } from "react";

interface Article {
  [x: string]: any;
  id: number;
  anh_tin_tuc: string;
  
  created_at: string;
  danh_muc_tin_tuc: {
    ten_danh_muc_tin_tuc: string;
  };
}

interface Data {
  baiVietMoiNhatCuaDanhMuc?: Article;
  baiVietTop?: Article[];
  baiVietKhacCuaDanhMuc?: {
    data: Article[];
  };
}

const NewDetail = () => {
  const { duong_dan } = useParams();
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null); 
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["baiviet", duong_dan],
    queryFn: async () => {
      const response = await instanceClient.post(`/tin-tuc-theo-danh-muc/${duong_dan}`);
      console.log("Response data:", response.data);
      return response.data;
    },
  });

  // Tạo một ref cho bài viết mới nhất
  const latestArticleRef = useRef<HTMLDivElement>(null);

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading data.</p>;

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  const handleArticleClick = (article: Article) => {
    setSelectedArticle(article); 
    refetch();

    // Cuộn lên phần bài viết mới nhất
    latestArticleRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const noi_dung = selectedArticle ? selectedArticle.noi_dung : data?.baiVietMoiNhatCuaDanhMuc?.noi_dung || "";

  return (
    <>
      <div className="flex">
        <div className="w-2/3 mt-20 ml-20 mr-10" ref={latestArticleRef}>
          {selectedArticle ? (
            <div key={selectedArticle.id}>
              <img
                src={selectedArticle.anh_tin_tuc}
                alt={selectedArticle.tieu_de || "Article"}
                className="w-full h-[700px] rounded-[5px] object-cover"
              />
              <div className="mt-4">
                <span className="text-xs text-gray-400">{selectedArticle.danh_muc_tin_tuc.ten_danh_muc_tin_tuc}</span>
                <h2 className="text-2xl font-bold mb-2">{selectedArticle.tieu_de}</h2>
                <p className="text-gray-700 mb-4" dangerouslySetInnerHTML={{
                  __html: isExpanded ? noi_dung : noi_dung.substring(0, 500) + '...'
                }}></p>
                {noi_dung.length > 500 && (
                  <button onClick={toggleExpand} className="text-sky-600 hover:text-sky-500">
                    {isExpanded ? 'Thu gọn' : 'Xem thêm'}
                  </button>
                )} <br />
                <span className="text-sm text-gray-400">Ngày tạo: {selectedArticle.created_at}</span>
              </div>
            </div>
          ) : data?.baiVietMoiNhatCuaDanhMuc ? ( 
            <div key={data.baiVietMoiNhatCuaDanhMuc.id}>
              <img
                src={data.baiVietMoiNhatCuaDanhMuc.anh_tin_tuc}
                alt={data.baiVietMoiNhatCuaDanhMuc.tieu_de || "Article"}
                className="w-full h-[700px] rounded-[5px] object-cover"
              />
              <div className="mt-4">
                <span className="text-xs text-gray-400">{data.baiVietMoiNhatCuaDanhMuc.danh_muc_tin_tuc.ten_danh_muc_tin_tuc}</span>
                <h2 className="text-2xl font-bold mb-2">{data.baiVietMoiNhatCuaDanhMuc.tieu_de}</h2>
                <p className="text-gray-700 mb-4" dangerouslySetInnerHTML={{
                  __html: isExpanded ? noi_dung : noi_dung.substring(0, 500) + '...'
                }}></p>
                {noi_dung.length > 500 && (
                  <button onClick={toggleExpand} className="text-sky-600 hover:text-sky-500">
                    {isExpanded ? 'Thu gọn' : 'Xem thêm'}
                  </button>
                )} <br />
                <span className="text-sm text-gray-400">Ngày tạo: {data.baiVietMoiNhatCuaDanhMuc.created_at}</span>
              </div>
            </div>
          ) : (
            <p>Chưa có bài viết nào.</p>
          )}
        </div>

        {/* Sidebar */}
        <div className="w-1/3 p-4 bg-gray-100 mt-20 mr-24 max-h-[700px] overflow-y-auto">
          <h2 className="text-xl font-semibold mb-4">Lượt xem nhiều nhất</h2>
          <div className="space-y-4">
            {Array.isArray(data?.baiVietTop) && data.baiVietTop.length > 0 ? (
              data.baiVietTop.map((article: any) => (
                <div key={article.id} className="flex items-start space-x-3" onClick={() => handleArticleClick(article)}>
                  <img
                    src={article.anh_tin_tuc}
                    alt="Article Thumbnail"
                    className="w-20 h-20 rounded-lg object-cover cursor-pointer"
                  />
                  <div>
                    <span className="text-xs text-gray-400">{article.danh_muc_tin_tuc.ten_danh_muc_tin_tuc}</span>
                    <h3 className="text-lg font-medium">{article.tieu_de}</h3>
                    <span className="text-xs text-gray-400">{article.created_at}</span>
                  </div>
                </div>
              ))
            ) : (
              <p>Chưa có bài viết nào.</p>
            )}
          </div>
        </div>

      </div>
      <div className="mt-10 pl-20 pb-20">
        <h2 className="text-xl font-semibold mb-4">Bài Viết Liên Quan</h2>
        {Array.isArray(data?.baiVietKhacCuaDanhMuc.data) && data.baiVietKhacCuaDanhMuc.data.length > 0 ? (
          <Swiper
            spaceBetween={20}
            slidesPerView={5}
            className="related-articles-slider"
          >
            {data.baiVietKhacCuaDanhMuc.data.map((article: any) => (
              <SwiperSlide key={article.id}>
                <div className="p-4 bg-white rounded-lg shadow-md" onClick={() => handleArticleClick(article)}>
                  <img
                    src={article.anh_tin_tuc}
                    alt="Related Article Thumbnail"
                    className="w-full h-[250px] rounded-lg object-cover mb-3 cursor-pointer"
                  />
                  <h3 className="text-lg font-medium">{article.tieu_de}</h3>
                  <span className="text-xs text-gray-400">{article.created_at}</span>
                </div>
              </SwiperSlide>
            ))}

          </Swiper>
        ) : (
          <p>Chưa có bài viết nào.</p>
        )}
      </div>
    </>
  );
};

export default NewDetail;
