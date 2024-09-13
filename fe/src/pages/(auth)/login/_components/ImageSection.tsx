import React from "react";
import { logo, login } from "@/assets/img";
import { imglogin2 } from "@/assets/img";
const ImageSection = () => {
  return (
    <div className="hidden md:flex md:w-1/2  bg-gray-100 relative">
      <img
        src={logo}
        alt="Krist Logo"
        className="absolute top-5 left-5 w-22 md:w-34"
      />
      <img
        src={imglogin2}
        alt="Fashion Model"
        className="object-cover w-1024 h-800"
      />
    </div>
  );
};

export default ImageSection;
