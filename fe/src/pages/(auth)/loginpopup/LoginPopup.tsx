import { anhcuatoan } from '@/assets/img';
import { Link } from 'react-router-dom';

const LoginPopup = () => {
  return (
    <section className="flex-1 flex items-center justify-center p-4 md:p-0">
      <div className="w-full max-w-md p-6 md:p-8 h-auto">
        <h1 className="text-2xl font-bold mb-4 text-center">GLow Clothing</h1>
        <img 
          src={anhcuatoan}
          alt="Gmember" 
          className="w-20 h-20 mb-4 mx-auto"
        />
        <h3 className="text-gray-600 mb-6 text-xs my-5 text-center">
          Vui lòng đăng nhập tài khoản GLow Clothing để xem ưu đãi và thanh toán dễ dàng hơn.
        </h3>
        <div className="flex gap-4">
          <Link
            to="/register"
            className="flex-1 bg-gray-200 text-gray-800 p-3 rounded-md hover:bg-gray-300 text-center"
          >
            Đăng ký
          </Link>
          <Link
            to="/login"
            className="flex-1 bg-gray-800 text-white p-3 rounded-md hover:bg-gray-900 text-center"
          >
            Đăng nhập
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LoginPopup;
