import { Link } from "react-router-dom";

const PasswordChangedSuccess = () => {
  return (
    <div className="relative bg-white p-8 rounded-lg shadow-lg mx-auto max-w-md text-center">
      <div className="flex items-center justify-center">
        <div className="w-16 h-16 relative">
          <div className="absolute inset-0 bg-gray-200 rounded-full"></div>
          <div className="absolute inset-1 bg-white rounded-full"></div>
          <div className="absolute inset-2 bg-black rounded-full flex items-center justify-center">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
          </div>
        </div>
      </div>
      <h2 className="text-2xl font-bold text-center mb-2">
        Password Changed Successfully
      </h2>
      <p className="text-gray-600 text-center mb-6">
        Your password has been updated successfully
      </p>
      <Link
        to="/login"
        className="w-full bg-gray-900 text-white py-2 rounded-md hover:bg-gray-800 transition duration-300 block text-center"
      >
        Back to Login
      </Link>
    </div>
  );
};

export default PasswordChangedSuccess;
