import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "antd";

const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dpypwbeis/image/upload";
const CLOUDINARY_UPLOAD_PRESET = "demo-update";

const Test = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const [fileList, setFileList] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  // Handle file change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFileList(files);
    setValue("feature_image", files);
  };

  // Update preview URLs when fileList changes
  useEffect(() => {
    const urls = fileList.map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);

    // Cleanup object URLs on component unmount
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, [fileList]);

  // Function to upload file to Cloudinary
  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    const response = await fetch(CLOUDINARY_URL, {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    return data.secure_url;
  };

  // Handle form submit
  const onSubmit = async (data: any) => {
    let uploadedUrls = [];

    if (fileList.length > 0) {
      uploadedUrls = await Promise.all(
        fileList.map(async (file) => {
          return await uploadFile(file);
        })
      );
    }

    console.log("Form data:", {
      ...data,
      feature_image: uploadedUrls.length ? uploadedUrls : null,
    });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full space-y-4 overflow-y-auto h-auto">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Yêu cầu Trả hàng /Hoàn tiền
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-800"
            >
              Mô tả sản phẩm
            </label>
            <textarea
              id="description"
              {...register("description", {
                required: "Mô tả sản phẩm là bắt buộc",
              })}
              rows={5}
              placeholder="Nhập mô tả sản phẩm"
              className="w-full mt-1 p-2 border border-gray-300 rounded-md"
            />
            {errors.description && (
              <p className="text-red-500 text-sm">
                {errors.description.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="feature_image"
              className="block text-sm font-medium text-gray-800"
            >
              Ảnh nổi bật
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="file"
                id="feature_image"
                className="p-2"
                multiple
                onChange={handleChange}
              />
              {previewUrls.length > 0 && (
                <div className="flex space-x-2">
                  {previewUrls.map((url, index) => (
                    <img
                      key={index}
                      src={url}
                      alt={`preview-${index}`}
                      className="w-12 h-12 object-cover rounded-md"
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-between items-center pt-4">
            <button
              type="button"
              className="text-gray-600 hover:text-gray-800 text-sm font-medium"
              onClick={() => {}}
            >
              KHÔNG PHẢI BÂY GIỜ
            </button>
            <button
              type="submit"
              className="bg-gradient-to-r from-blue-500 to-blue-400 text-white rounded-lg py-1 hover:bg-blue-600 shadow-md transition-colors"
            >
              Thêm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Test;
