import { not } from "@/assets/img";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <>
      <div
        className={`md:min-h-screen h-[600px] flex items-start justify-center bg-cover bg-center mt-10`}
        style={{ backgroundImage: `url(${not})` }}
      >
        <div className="md:mt-64 mt-32 bg-black bg-opacity-50 p-10 rounded-lg shadow-2xl md:max-w-lg max-w-sm text-center">
          <h1 className="text-7xl font-extrabold text-white mb-4 ">404</h1>
          <p className="text-xl text-gray-200 mb-6">
            Xin lỗi! Trang bạn đang tìm không tồn tại.
          </p>
          <Link
            to={"/"}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-full shadow-lg hover:scale-105 transform transition duration-300 ease-in-out"
          >
            Quay lại Trang Chủ
          </Link>
        </div>
      </div>
    </>
  );
};

export default NotFoundPage;
