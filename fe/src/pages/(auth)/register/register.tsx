import ImageSection from "./_components/ImageSection";
import SignupForm from "./_components/registerForm";

const Register = () => {
  return (
    <>
      <div className="h-screen overflow-hidden bg-gray-100 md:bg-white">
        <div className="flex flex-col md:flex-row min-h-screen ">
          <ImageSection />
          <SignupForm />
        </div>
      </div>
    </>
  );
};

export default Register;
