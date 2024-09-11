import React from "react";
import { Link } from "react-router-dom";

const ForgotPasswordForm = () => {
  return (
    <section className="flex-1 flex items-center justify-center p-4 md:p-0">
      <div className="w-full max-w-md p-6 md:p-8 bg-white shadow-lg rounded-lg">
        <div className="mb-8">
          <Link
            to="/login"
            className="text-gray-600 hover:text-gray-800 flex items-center"
          >
            <svg
              className="w-6 h-6 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              ></path>
            </svg>
            Back
          </Link>
        </div>

        <h2 className="text-3xl font-bold mb-2">Quên Mật khẩu</h2>
        <p className="text-gray-600 mb-6">
          Nhập địa chỉ email đã đăng ký của bạn, chúng tôi sẽ gửi cho bạn một mã
          để đặt lại mật khẩu.
        </p>
        <form>
          <div className="mb-6">
            <label
              htmlFor="email"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full p-3 border border-gray-300 rounded-md"
              placeholder="robertfox@example.com"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-black text-white p-3 rounded-md hover:bg-gray-800 text-sm font-bold"
          >
            <Link to={"/changePassword"}>Gửi Yêu Cầu</Link>
          </button>
        </form>
      </div>
    </section>
  );
};

export default ForgotPasswordForm;
