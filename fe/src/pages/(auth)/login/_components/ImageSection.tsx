import { imglogin2, logo } from "@/assets/img";
const ImageSection = () => {
  return (
    <div className="hidden md:flex md:w-1/2  bg-gray-100 relative">
      <img
        src={logo}
        alt="Krist Logo"
         className="absolute top-5 left-5 w-[150px] md:w-34 border "
      />
      <img
        src={
          "https://res.cloudinary.com/dcvu7e7ps/image/upload/v1734025913/vt0ijlzhxvv9ckf9fcqj.jpg"
        }
        alt="Fashion Model"
        className="object-cover w-1024 h-800"
      />
    </div>
  );
};

export default ImageSection;
