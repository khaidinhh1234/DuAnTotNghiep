import React, { useEffect, useState } from "react";
import { Button } from "antd";
import { useForm } from "react-hook-form";

const Test = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const [fileList, setFileList] = useState<any[]>([]);
  const [img, setImg] = useState<string>("");
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  // Handle file change
  const handleChange = (e: any) => {
    const files = Array.from(e.target.files);
    setFileList(files);
    setValue("feature_image", files); // This stores files in the form state
  };
  useEffect(() => {
    const urls = fileList.map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);

    // Cleanup object URLs on component unmount
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, [fileList]);
  // Upload the file to Cloudinary and get the URL

  // Handle form submit
  const onSubmit = async (data: any) => {
    // Upload each file
    const uploadedUrls = await Promise.all(
      fileList.map((file) => URL.createObjectURL(file))
    );
    console.log("Uploaded image URLs:", { ...data, abc: uploadedUrls[0] });
    // Log or save the URLs to the database

    // Example: You can then send the data to your backend
    // await fetch('your_api_endpoint', {
    //   method: 'POST',
    //   body: JSON.stringify({ ...data, feature_image: uploadedUrls }),
    //   headers: { 'Content-Type': 'application/json' },
    // });
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
              })} // Register the input
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
