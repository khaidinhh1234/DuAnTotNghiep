import React from "react";
import ReCAPTCHA from "react-google-recaptcha";

const Change = () => {
  const recaptchaRef = React.createRef<ReCAPTCHA>();
  // const handleInputChange = (e: any) => {
  //   e.target.value = e.target.value.replace(/[^0-9]/g, "").slice(0, 1);
  // };

  const onSubmit = async (e: any) => {
    e.preventDefault();
    const recaptchaValue = recaptchaRef.current?.getValue();
    if (!recaptchaValue) {
      alert("Vui lòng xác minh bạn không phải robot");
      return;
    }

    // Gọi API tới backend tại http://localhost:8080/api/v1/vea
    // setLoading(true);

    // if (response.data.success) {
    //   alert("Xác thực reCAPTCHA thành công!");
    // } else {
    //   alert("Xác thực reCAPTCHA thất bại!");
    // }
  };
  return (
    <section className="flex-1 flex items-center justify-center p-4 md:p-0">
      <div className="w-full max-w-md p-6 md:p-8 bg-white shadow-lg rounded-lg">
        <div className="mb-6">
          <a
            href="#"
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
          </a>
        </div>

        <h2 className="text-3xl font-bold mb-2">Đặt lại mật khẩu</h2>
        <p className="text-gray-600 mb-6">
          Nhập mật khẩu mới cho tài khoản của bạn
        </p>

        <form onSubmit={onSubmit}>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Mật khẩu mới
            </label>
            <input
              type="password"
              className={`w-full p-3 border  rounded-md  border-gray-300`}
              placeholder="••••••••••••••••"
            />
            {/* {errors.password && (
              <p className="text-red-600">{errors.password.message}</p>
            )} */}
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Nhập lại mật khẩu
            </label>
            <input
              type="password"
              className={`w-full p-3 border  rounded-md   order-gray-300`}
              placeholder="••••••••••••••••"
            />
            {/* {errors.confirmPassword && (
              <p className="text-red-600">{errors.confirmPassword.message}</p>
            )} */}
          </div>
          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey="6LeZ7DsqAAAAAFQ4zz5W8jQ9DzNxF6MDRLr4QWBB"
          />
          <button
            type="submit"
            className=" mt-4 w-full bg-black text-white p-3 rounded-md hover:bg-gray-800 text-sm font-bold"
          >
            Xác Nhận
          </button>
        </form>
      </div>
    </section>
  );
};

export default Change;
