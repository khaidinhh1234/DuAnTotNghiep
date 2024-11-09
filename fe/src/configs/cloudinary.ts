// cấu hình cloudinary
import axios from "axios";

const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dpundwxg1/image/upload";
const CLOUDINARY_UPLOAD_PRESET = "upload";

export const uploadToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

  try {
    const response = await axios.post(CLOUDINARY_URL, formData);
    return response.data.secure_url;
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    throw error;
  }
};
