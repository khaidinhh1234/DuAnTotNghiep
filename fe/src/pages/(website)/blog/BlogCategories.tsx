import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import instanceClient from "@/configs/client";
import { Carousel, message } from "antd";
import "./blog.css";
interface Article {
  id: number;
  tieu_de: string;
  noi_dung: string;
  anh_tin_tuc: string;
  duong_dan: string;
  danh_muc_tin_tuc_id: number;
  luot_xem: number | null;
  created_at: string;
}

interface AppProps {
  data: {
    baiVietCoLuotXemNhieuNhatTrong24h: Article[];
  };
}
const BlogCategories = () => {
  const { duongDan } = useParams();
  const nav = useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: ["baiviet", duongDan],
    queryFn: async () => {
      try {
        const response = await instanceClient.get(`/danhmuctintuc/${duongDan}`);
        return response.data;
      } catch (error) {
        // console.log("error:", error);
        nav("/404");
        message.error("Bài viết không tồn tại");
        return error;
      }
      // const response = await instanceClient.get(`/danhmuctintuc/${duongDan}`);
      // return response.data;
    },
    enabled: !!duongDan,
  });

  //   console.log("duongDan:", duongDan);
  //   console.log("Data từ API:", data);
  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <svg
          className="w-24 h-24"
          width={240}
          height={240}
          viewBox="0 0 240 240"
        >
          <circle
            className="pl__ring pl__ring--a"
            cx={120}
            cy={120}
            r={105}
            fill="none"
            stroke="#f42f25"
            strokeWidth={20}
            strokeDasharray="0 660"
            strokeDashoffset={-330}
            strokeLinecap="round"
          />
          <circle
            className="pl__ring pl__ring--b"
            cx={120}
            cy={120}
            r={35}
            fill="none"
            stroke="#f49725"
            strokeWidth={20}
            strokeDasharray="0 220"
            strokeDashoffset={-110}
            strokeLinecap="round"
          />
          <circle
            className="pl__ring pl__ring--c"
            cx={85}
            cy={120}
            r={70}
            fill="none"
            stroke="#255ff4"
            strokeWidth={20}
            strokeDasharray="0 440"
            strokeLinecap="round"
          />
          <circle
            className="pl__ring pl__ring--d"
            cx={155}
            cy={120}
            r={70}
            fill="none"
            stroke="#f42582"
            strokeWidth={20}
            strokeDasharray="0 440"
            strokeLinecap="round"
          />
        </svg>
      </div>
    );
  return (
    <div className="">
      {/* danh mục */}
      <div className="items-center gap-10 py-10 px-5 mt-15">
        {data?.danhMuc ? (
          <>
            <div className="flex justify-center py-10">
              <div className="flex flex-col md:flex-row items-stretch w-full px-5 h-full">
                <div className="w-full md:w-1/2 bg-gray-100 p-10 md:p-28">
                  <h3 className="text-5xl font-semibold mb-5">
                    {data.danhMuc.ten_danh_muc_tin_tuc}
                  </h3>
                  <p className="text-xl text-gray-500">{data.danhMuc.mo_ta}</p>
                </div>
                <div className="w-full md:w-1/2 h-full">
                  <img
                    src={data.danhMuc.hinh_anh}
                    alt={data.danhMuc.ten_danh_muc_tin_tuc}
                    className="w-full h-full object-cover rounded-none"
                  />
                </div>
              </div>
            </div>
          </>
        ) : (
          <p>Chưa có dữ liệu :3 </p>
        )}
      </div>
      {/* baiVietCoNhieuLuotXem và baiVietCoLuotXemNhieuNhatTrong24h */}
      <div className="flex flex-col lg:flex-row w-full px-5 mt-10 mb-20 gap-10">
        <div className="w-full lg:w-2/3">
          <div className="w-full">
            {data?.baiVietCoLuotXemNhieuNhatTrong24h &&
              data.baiVietCoLuotXemNhieuNhatTrong24h.length > 0 ? (
              <Carousel
                dots={false}
                arrows={true}
                autoplay
                autoplaySpeed={2000}
                className="h-[400px] sm:h-[500px] lg:h-[700px] w-full"
              >
                {data.baiVietCoLuotXemNhieuNhatTrong24h.map((article: Article) => (
                  <Link to={`/xem-bai-viet/${article.duong_dan}`} key={article.id}>
                    <div className="h-full relative flex justify-center items-center">
                      <img
                        src={article.anh_tin_tuc}
                        alt={article.tieu_de}
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-opacity-50 p-4 flex justify-between items-end">
                        <Link
                          to={`/xem-bai-viet/${article.duong_dan}`}
                          className="px-4 py-2 border-2 border-white bg-transparent text-white rounded-md hover:bg-white hover:text-black hover:scale-110 mb-10 mr-14 transition-transform"
                        >
                          Đọc thêm
                        </Link>
                      </div>
                    </div>
                  </Link>
                ))}
              </Carousel>
            ) : (
              <p>Chưa có bài viết nào trong 24h này.</p>
            )}
          </div>
        </div>

        <div className="w-full lg:w-1/3">
          <h3 className="text-2xl font-semibold mb-4">Bài viết có nhiều lượt xem</h3>
          {data?.baiVietCoNhieuLuotXem && data.baiVietCoNhieuLuotXem.length > 0 ? (
            <div className="space-y-4">
              {data.baiVietCoNhieuLuotXem.map((article: Article) => (
                <div key={article.id} className="flex items-center gap-4">
                  <Link to={`/xem-bai-viet/${article.duong_dan}`}>
                    <div className="relative w-32 h-32">
                      <img
                        src={article.anh_tin_tuc}
                        alt={article.tieu_de}
                        className="absolute inset-0 w-full h-full object-cover rounded-lg"
                      />
                    </div>
                  </Link>

                  <div>
                    <Link to={`/xem-bai-viet/${article.duong_dan}`}>
                      <h4 className="text-lg font-medium">{article.tieu_de}</h4>
                    </Link>
                    <p className="text-sm text-gray-500">
                      {new Date(article.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>Không có bài viết nào.</p>
          )}
        </div>
      </div>

      {/* bài viết liên quan */}
      <div className="w-full px-5 mt-48">
        <h3 className="text-4xl font-semibold mb-4">Bài viết liên quan</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {data?.baiViet?.data && data.baiViet.data.length > 0 ? (
            data.baiViet.data.map((article: Article) => (
              <Link to={`/xem-bai-viet/${article.duong_dan}`} key={article.id}>
                <div className="p-4">
                  <img
                    src={article.anh_tin_tuc}
                    alt={article.tieu_de}
                    className="w-full h-64 sm:h-80 lg:h-96 object-cover rounded-lg"
                  />
                  <h4 className="text-xl sm:text-2xl font-bold hover:text-red-600 mt-2">
                    {article.tieu_de}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {new Date(article.created_at).toLocaleDateString()}
                  </p>
                </div>
              </Link>
            ))
          ) : (
            <p>Không có bài viết nào.</p>
          )}
        </div>
      </div>

    </div>
  );
};

export default BlogCategories;
