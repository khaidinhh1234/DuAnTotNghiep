// OTPPage.js

import Change from "./_component/changepassword";
import ImageSection from "./_component/ImageSection";

const ChangePassword = () => (
  <section className="min-h-screen bg-gray-100 md:bg-white">
    <div className="flex flex-col md:flex-row min-h-screen">
      <ImageSection />
      <Change />
    </div>
  </section>
);

export default ChangePassword;
