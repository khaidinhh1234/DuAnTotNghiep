import instanceClient from "@/configs/client";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

const NewDetail = () => {
  const { duong_dan } = useParams();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["baiviet", duong_dan],
    queryFn: async () => {
      const response = await instanceClient.get(`/tin-tuc-theo-danh-muc/${duong_dan}`);
      console.log("Response data:", response.data);
      return response.data;
    },
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading data.</p>;

  return (<>
    <div className="flex">
      {/* Main content */}
      <div className="w-2/3 mt-20 ml-20 mr-10">
        {/* Main article */}
        {data?.baiVietMoiNhatCuaDanhMuc ? (
          <div key={data.baiVietMoiNhatCuaDanhMuc.id}>
            <img
              src={data.baiVietMoiNhatCuaDanhMuc.anh_tin_tuc}
              alt={data.baiVietMoiNhatCuaDanhMuc.tieu_de || "Article"}
              className="w-full h-[700px] rounded-lg object-cover"
            />
            <div className="mt-4">
              <h2 className="text-2xl font-bold mb-2">{data.baiVietMoiNhatCuaDanhMuc.tieu_de}</h2>
              <p className="text-gray-700 mb-4">{data.baiVietMoiNhatCuaDanhMuc.noi_dung}</p>
              <span className="text-sm text-gray-400">Ngày tạo: {data.baiVietMoiNhatCuaDanhMuc.created_at}</span>
            </div>
          </div>
        ) : (
          <p>No articles available.</p>
        )}

        {/* Related articles slider */}
   
      </div>

      {/* Sidebar */}
      <div className="w-1/3 p-4 bg-gray-100 mt-20 mr-24 max-h-[700px] overflow-y-auto">
  <h2 className="text-xl font-semibold mb-4">Mới Nhất</h2>
  <div className="space-y-4">
    {Array.isArray(data?.baiVietTop) && data.baiVietTop.length > 0 ? (
      data.baiVietTop.map((article: any) => (
        <div key={article.id} className="flex items-start space-x-3">
          <img
            src={article.anh_tin_tuc}
            alt="Article Thumbnail"
            className="w-20 h-20 rounded-lg object-cover"
          />
          <div>
            <h3 className="text-lg font-medium">{article.tieu_de}</h3>
            <span className="text-xs text-gray-400">{article.created_at}</span>
          </div>
        </div>
      ))
    ) : (
      <p>No articles available.</p>
    )}
  </div>
</div>

    </div>
         <div className="mt-10 pl-20">
          <h2 className="text-xl font-semibold mb-4">Bài Viết Liên Quan</h2>
          {Array.isArray(data?.baiVietKhacCuaDanhMuc.data) && data.baiVietKhacCuaDanhMuc.data.length > 0 ? (
            <Swiper
              spaceBetween={20}
              slidesPerView={5}
              className="related-articles-slider"
            >
              {data.baiVietKhacCuaDanhMuc.data.map((article: any) => (
                <SwiperSlide key={article.id}>
                  <div className="p-4 bg-white rounded-lg shadow-md">
                    <img
                      src={article.anh_tin_tuc}
                      alt="Related Article Thumbnail"
                      className="w-full h-[200px] rounded-lg object-cover mb-3"
                    />
                    <h3 className="text-lg font-medium">{article.tieu_de}</h3>
                    <span className="text-xs text-gray-400">{article.created_at}</span>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <p>No related articles available.</p>
          )}
        </div>
    </>
  );
};

export default NewDetail;
