// OTPPage.js

import Error from "./_component/Error";
import ImageError from "./_component/ImageError";

const ErrorAuth = () => (
  <section className="min-h-screen bg-gray-100 md:bg-white">
    <div className="flex flex-Ocol md:flex-row min-h-screen">
      <ImageError />
      <Error />
    </div>
  </section>
);

export default ErrorAuth;
