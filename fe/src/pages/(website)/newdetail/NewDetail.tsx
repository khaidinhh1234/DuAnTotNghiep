
const NewDetail = () => {
  return (
    <div className="flex">
      {/* Main content */}
      <div className="w-2/3 mt-20 ml-20 mr-10">
        <img
          src="https://res.cloudinary.com/dpundwxg1/image/upload/v1729347057/8tp24a005-sb067-4_jvrbhu.webp" // Replace with your image URL
          alt="Concert Group"
          className="w-[9000px] h-[700px] rounded-lg object-cover"
        />
         {/* Title, Content, and Date */}
         <div className="mt-4">
          <h2 className="text-2xl font-bold mb-2">Tiêu Đề Bài Viết</h2>
          <p className="text-gray-700 mb-4">
            Đây là nội dung chi tiết của bài viết, nơi bạn có thể viết về các chủ đề thú vị và thông tin liên quan. 
            Hãy chắc chắn rằng bạn bao gồm tất cả các điểm chính để người đọc hiểu rõ về nội dung bạn đang trình bày.
          </p>
          <span className="text-sm text-gray-400">Ngày tạo: 25/10/2024</span>
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-1/3 p-4 bg-gray-100 mt-20 mr-10">
        <h2 className="text-xl font-semibold mb-4">Mới Nhất</h2>
        <div className="space-y-4">
          {/* Example of a single sidebar item */}
          <div className="flex items-start space-x-3">
            <img
              src="https://via.placeholder.com/80x80" // Replace with each article's image
              alt="Article Thumbnail"
              className="w-20 h-20 rounded-lg object-cover"
            />
            <div>
              <p className="text-sm text-gray-600">Tư vấn thời trang</p>
              <h3 className="text-lg font-medium">
                Đi Concert Mang Gì? Bí Kíp Chọn Đồ Cần Thiết Và Tiện Dụng
              </h3>
              <span className="text-xs text-gray-400">14:45 25/10/2024</span>
            </div>
          </div>

          {/* Additional sidebar items */}
          {/* Repeat this block for each article */}
          <div className="flex items-start space-x-3">
            <img
              src="https://via.placeholder.com/80x80"
              alt="Article Thumbnail"
              className="w-20 h-20 rounded-lg object-cover"
            />
            <div>
              <p className="text-sm text-gray-600">Tư vấn thời trang</p>
              <h3 className="text-lg font-medium">
                Đi Concert Mặc Gì? 10+ Gợi Ý Outfit Cực Chất, Nổi Bật Cho Fan
              </h3>
              <span className="text-xs text-gray-400">11:42 25/10/2024</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewDetail;
    