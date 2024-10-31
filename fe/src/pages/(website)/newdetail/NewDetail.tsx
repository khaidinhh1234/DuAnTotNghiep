import instanceClient from "@/configs/client";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

const NewDetail = () => {
  const { duong_dan } = useParams();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["baiviet", duong_dan],
    queryFn: async () => {
      const response = await instanceClient.post(`/tin-tuc-theo-danh-muc/${duong_dan}`);
      console.log("Response data:", response.data);
      return response.data;
    },
  });
  const truncateContent = (content: string, maxLength: number) => {
    if (content.length > maxLength) {
      return content.substring(0, maxLength); 
    }
    return content;
  };
  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading data.</p>;
  const { duong_dan_tt } = useParams();
  // const { data: ViewNew } = useQuery({
  //   queryKey: ["baiVietTop"],
  //   queryFn: async () => {
  //     const response = await instanceClient.post(`/xem-bai-viet/${duong_dan_tt}`);
  //     console.log("Response data:", response.data);
  //     return response.data;
  //   },
  // })
  return (<>
    <div className="flex">
      <div className="w-2/3 mt-20 ml-20 mr-10">
        {data?.baiVietMoiNhatCuaDanhMuc ? (
          <div key={data.baiVietMoiNhatCuaDanhMuc.id}>
            <Link to={`/xem-bai-viet/${duong_dan}`}>
            <img
              src={data.baiVietMoiNhatCuaDanhMuc.anh_tin_tuc}
              alt={data.baiVietMoiNhatCuaDanhMuc.tieu_de || "Article"}
              className="w-full h-[700px] rounded-[5px] object-cover"
            />
            </Link>
            <div className="mt-4">
            <span className="text-xs text-gray-400">{data.baiVietMoiNhatCuaDanhMuc.danh_muc_tin_tuc.ten_danh_muc_tin_tuc}</span> 
              <Link to={`/xem-bai-viet/${duong_dan_tt}`}>
              <h2 className="text-2xl hover:text-red-500 font-bold mb-2">{data.baiVietMoiNhatCuaDanhMuc.tieu_de}</h2>
              </Link>
              <p className="text-gray-700 mb-4" dangerouslySetInnerHTML={{ __html: truncateContent(data.baiVietMoiNhatCuaDanhMuc.noi_dung, 400) }}></p>
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
              <div key={article.id} className="flex items-start space-x-3">
               <Link to={`/xem-bai-viet/${duong_dan}`}>
               <img
                  src={article.anh_tin_tuc}
                  alt="Article Thumbnail"
                  className="w-20 h-20 rounded-lg object-cover"
                />
               </Link>
                <div>
                <span className="text-xs text-gray-400">{article.danh_muc_tin_tuc.ten_danh_muc_tin_tuc}</span> 
                  <Link to={`/xem-bai-viet/${duong_dan}`}>
                  <h3 className="text-lg font-medium hover:text-red-500">{article.tieu_de}</h3>
                  </Link>
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
              <div className="p-4 bg-white rounded-lg shadow-md">
                <Link to={`/xem-bai-viet/${duong_dan}`}>
                <img
                  src={article.anh_tin_tuc}
                  alt="Related Article Thumbnail"
                  className="w-full h-[250px] rounded-lg object-cover mb-3"
                />    
                </Link>
                <Link to={`/xem-bai-viet/${duong_dan}`}>
                <h3 className="text-lg font-medium hover:text-red-500">{article.tieu_de}</h3>
                </Link>
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
