// OTPForm.js
import React from 'react';

const OTPForm = () => {
  const handleInputChange = (e : any, ) => {
    e.target.value = e.target.value.replace(/[^0-9]/g, '').slice(0, 1);
  };

  return (
    <section className="flex-1 flex items-center justify-center p-4 md:p-0">

    <div className="w-full max-w-md p-6 md:p-8 bg-white shadow-lg rounded-lg">
      <div className="mb-6">
        <a href="#" className="text-gray-600 hover:text-gray-800 flex items-center">
          <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Back
        </a>
      </div>

      <h2 className="text-3xl font-bold mb-2">Enter OTP</h2>
      <p className="text-gray-600 mb-6">We have shared a code to your registered email address robertfox@example.com</p>

      <form>
        <div className="flex justify-between mb-6">
          <input
            type="text"
            maxlength="1"
            className="w-14 h-14 text-center text-2xl border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            defaultValue="3"
            onInput={handleInputChange}
          />
          <input
            type="text"
            maxlength="1"
            className="w-14 h-14 text-center text-2xl border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            defaultValue="1"
            onInput={handleInputChange}
          />
          <input
            type="text"
            maxlength="1"
            className="w-14 h-14 text-center text-2xl border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            onInput={handleInputChange}
          />
          <input
            type="text"
            maxlength="1"
            className="w-14 h-14 text-center text-2xl border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            onInput={handleInputChange}
          />
        </div>
        <button type="submit" className="w-full bg-black text-white p-3 rounded-md hover:bg-gray-800 text-sm font-bold">
          Verify
        </button>
      </form>
    </div>
    </section>
  );
};

export default OTPForm;
