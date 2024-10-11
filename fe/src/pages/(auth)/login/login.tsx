import ImageSection from "./_components/ImageSection";
import LoginForm from "./_components/loginForm";

const Page = () => {
  return (
    <>
      <div className="h-screen overflow-hidden bg-gray-100 md:bg-white">
        <div className="flex flex-col md:flex-row min-h-screen">
          <ImageSection />
          <LoginForm />
        </div>
      </div>
    </>
  );
};
export default Page;
