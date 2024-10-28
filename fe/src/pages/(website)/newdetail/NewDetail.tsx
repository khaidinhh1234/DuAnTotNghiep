import instanceClient from "@/configs/client";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

const NewDetail = () => {
  const { duong_dan } = useParams();

  const { data, error, isLoading } = useQuery({
    queryKey: ["baiviet", duong_dan],
    queryFn: async () => {
      const response = await instanceClient.get(`/tin-tuc-theo-danh-muc/${duong_dan}`);
      return response.data;
    },
  });

  console.log(data); // Check data structure for debugging

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching data: {error.message}</div>;

  return (
    <div className="flex">
      {/* Main content */} 
      <div className="w-2/3 mt-20 ml-20 mr-10">
        {data?.baiVietMoiNhatCuaDanhMuc?.length > 0 ? (
          data.baiVietMoiNhatCuaDanhMuc.map((newData: any) => (
            <div key={newData.id}>
              <img
                src={newData.anh_tin_tuc || "https://via.placeholder.com/700"}
                alt={newData.tieu_de || "Article"}
                className="w-full h-[700px] rounded-lg object-cover"
              />
              <div className="mt-4">
                <h2 className="text-2xl font-bold mb-2">{newData.tieu_de || "Tiêu đề không có"}</h2>
                <p className="text-gray-700 mb-4">
                  {newData.noi_dung || "Nội dung không có."}
                </p>
                <span className="text-sm text-gray-400">
                  Ngày tạo: {newData.createdAt || "25/10/2024"}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">Không có bài viết nào.</p>
        )}
      </div>

      {/* Sidebar */}
      <div className="w-1/3 p-4 bg-gray-100 mt-20 mr-10">
        <h2 className="text-xl font-semibold mb-4">Mới Nhất</h2>
        <div className="space-y-4">
          {/* Sidebar items */}
          {Array.from({ length: 2 }).map((_, index) => (
            <div key={index} className="flex items-start space-x-3">
              <img
                src="https://via.placeholder.com/80x80" // Use article images here if available
                alt="Article Thumbnail"
                className="w-20 h-20 rounded-lg object-cover"
              />
              <div>
                <p className="text-sm text-gray-600">Tư vấn thời trang</p>
                <h3 className="text-lg font-medium">
                  {index === 0
                    ? "Đi Concert Mang Gì? Bí Kíp Chọn Đồ Cần Thiết Và Tiện Dụng"
                    : "Đi Concert Mặc Gì? 10+ Gợi Ý Outfit Cực Chất, Nổi Bật Cho Fan"}
                </h3>
                <span className="text-xs text-gray-400">14:45 25/10/2024</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewDetail;
