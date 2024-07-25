import React from 'react';

const LoginForm = () => {
  return (
    <section className="flex-1 flex items-center justify-center p-4 md:p-0">
      <div className="w-full max-w-md p-6 md:p-8 bg-white shadow-lg rounded-lg border border-slate-100 h-[480px]">
        <h1 className="text-2xl font-bold mb-4">Chào Mừng 👋</h1>
        <p className="text-gray-600 mb-6">Vui lòng đăng nhập</p>
        <form>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 mb-2">Địa Chỉ Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="robertdavis@sample.com"
              required
              className="w-full p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:border-gray-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 mb-2">Mật Khẩu</label>
            <input
              type="password"
              id="password"
              name="password"
              required
              placeholder="Mật Khẩu Của Bạn"
              className="w-full p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:border-gray-500"
            />
          </div>
          <div className="flex items-center mb-6">
            <input
              type="checkbox"
              id="remember-me"
              name="remember-me"
              className="mr-2"
            />
            <label htmlFor="remember-me" className="text-gray-700">Ghi Nhớ Đăng Nhập</label>
          </div>
          <button
            type="submit"
            className="w-full bg-gray-800 text-white p-3 rounded-md hover:bg-gray-900"
          >
            Đăng Nhập
          </button>
          <a
            href="#"
            className="block text-right text-gray-600 mt-4 hover:underline"
          >
            Quên Mật Khẩu?
          </a>
        </form>
      </div>
    </section>
  );
};

export default LoginForm;
