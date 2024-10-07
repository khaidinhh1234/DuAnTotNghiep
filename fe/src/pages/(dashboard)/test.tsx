import { Editor } from "@tinymce/tinymce-react";
import { Button } from "antd";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
const Test = () => {
  // const [value, setValue] = useState("");
  // console.log(value);
  const { register, handleSubmit, setValue } = useForm();
  const onSubmit = (data: any) => {
    console.log(data);
  };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="md:text-base">
          Quản trị / Sản phẩm /
          <span className="font-semibold">Thêm sản phẩm </span>
        </h1>
      </div>
      <div className="flex items-center justify-between">
        <h1 className="font-semibold md:text-3xl">Thêm sản phẩm </h1>
        <div className="flex gap-2">
          <Link to="/admin/products">
            <Button className="bg-gradient-to-r  from-blue-500 to-blue-400 text-white rounded-lg py-1 hover:bg-blue-600 shadow-md transition-colors">
              Quay lại
            </Button>
          </Link>
        </div>
      </div>
      <div className="max-w-8xl mx-5 px-5 py-8 bg-white rounded-lg shadow-lg">
        <form
          className="bg-white rounded-lg shadow-md p-6"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="grid grid-cols-2 gap-5 mb-5">
            <div className="col-span-1">
              <label
                htmlFor="productName"
                className="block text-[15px] font-medium text-gray-700 px-2 py-1"
              >
                Tên sản phẩm
              </label>
              <input
                type="text"
                {...register("productName")}
                id="productName"
                placeholder="Nhập tên sản phẩm"
                className="mt-1 w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-[15px] px-2"
              />
            </div>

            {/* Danh mục sản phẩm */}
            <div className="col-span-1">
              <label
                htmlFor="category"
                className="block text-[15px] font-medium text-gray-700 px-2 py-1"
              >
                Danh mục sản phẩm
              </label>
              <select
                id="category"
                {...register("category")}
                className="mt-1 w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-[15px] px-2"
              >
                <option>Danh mục 1</option>
                <option>Danh mục 2</option>
              </select>
            </div>
          </div>

          {/* Mô tả ngắn */}
          <div className="mb-5">
            <label
              htmlFor="shortDescription"
              className="block text-[15px] font-medium text-gray-700 px-2 py-1"
            >
              Mô tả ngắn
            </label>
            <textarea
              id="shortDescription"
              rows={5}
              {...register("shortDescription")}
              placeholder="Nhập mô tả ngắn"
              className="mt-1 w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-5 mb-5">
            {/* Chọn tags */}
            <div>
              <label
                htmlFor="tags"
                className="block text-[15px] font-medium text-gray-700 px-2 py-1"
              >
                Chọn tags
              </label>
              <select
                id="tagss"
                {...register("tags")}
                className="mt-1 w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-[15px] px-2"
              >
                <option>Danh mục 1</option>
                <option>Danh mục 2</option>
              </select>
            </div>

            {/* Mã sản phẩm */}
            <div>
              <label
                htmlFor="productCode"
                className="block text-[15px] font-medium text-gray-700 px-2 py-1"
              >
                Mã sản phẩm
              </label>
              <input
                type="text"
                id="productCode"
                {...register("productCode")}
                defaultValue="SP-ZR77NA5Q"
                readOnly
                className="mt-1 w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-[15px] px-2"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-5 mb-5">
            {/* Ảnh nổi bật */}
            <div>
              <label
                htmlFor="featuredImage"
                className="block text-[15px] font-medium text-gray-700 px-2 py-1"
              >
                Ảnh nổi bật
              </label>
              {/* <input
                type="file"
                id="featuredImage"
                className="mt-1 w-full p-3 border border-gray-300 rounded-lg shadow-sm"
              /> */}
            </div>
            <div>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  {...register("featured")}
                  className="form-checkbox h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-gray-700">Chọn sản phẩm</span>
              </label>
            </div>
          </div>
          {/* Nội dung */}
          <div className="mb-10">
            <label
              htmlFor="content"
              className="block text-[15px] font-medium text-gray-700 px-2 py-2"
            >
              Nội dung
            </label>

            <Editor
              apiKey="4co2z7i0ky0nmudlm5lsoetsvp6g3u4110d77s2cq143a9in"
              init={{
                plugins: [
                  "anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount",
                  "checklist mediaembed casechange export formatpainter pageembed a11ychecker tinymcespellchecker permanentpen powerpaste advtable advcode editimage advtemplate ai mentions tinycomments tableofcontents footnotes mergetags autocorrect typography inlinecss markdown",
                ],
                toolbar:
                  "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat",
              }}
              onEditorChange={(content) => setValue("content", content)} // Cập nhật nội dung vào form
            />
          </div>

          {/* Giá bán, Kho hàng và Biến thể */}
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            Giá bán, Kho hàng và Biến thể
          </h3>
          <p className="text-gray-600 mb-4">
            Tạo biến thể nếu sản phẩm có hơn một tùy chọn, ví dụ như về kích
            thước hay màu sắc.
          </p>

          {/* Biến thể */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="size"
                className="block text-[15px] font-medium text-gray-700 px-2 py-1"
              >
                Kích thước
              </label>
              <input
                type="text"
                id="size"
                placeholder="Nhập kích thước"
                className="mt-1 w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label
                htmlFor="color"
                className="block text-[15px] font-medium text-gray-700 px-2 py-1"
              >
                Màu sắc
              </label>
              <input
                type="text"
                id="color"
                placeholder="Nhập màu sắc"
                className="mt-1 w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label
                htmlFor="price"
                className="block text-[15px] font-medium text-gray-700 px-2 py-1"
              >
                Giá bán
              </label>
              <input
                type="number"
                id="price"
                placeholder="Nhập giá bán"
                className="mt-1 w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label
                htmlFor="discountPrice"
                className="block text-[15px] font-medium text-gray-700 px-2 py-1"
              >
                Giá khuyến mãi
              </label>
              <input
                type="number"
                id="discountPrice"
                placeholder="Nhập giá khuyến mãi"
                className="mt-1 w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label
                htmlFor="quantity"
                className="block text-[15px] font-medium text-gray-700 px-2 py-1"
              >
                Số lượng
              </label>
              <input
                type="number"
                id="quantity"
                placeholder="Nhập số lượng"
                className="mt-1 w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label
                htmlFor="variantImage"
                className="block text-[15px] font-medium text-gray-700 px-2 py-1"
              >
                Ảnh biến thể
              </label>
              <input
                type="file"
                id="variantImage"
                className="mt-1 w-full p-3 border border-gray-300 rounded-lg shadow-sm"
              />
            </div>
          </div>

          {/* Nút thêm biến thể */}
          <div>
            <button
              type="button"
              className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600"
            >
              Chọn biến thể
            </button>
          </div>

          {/* Nút thêm sản phẩm */}
          <div>
            <button
              type="submit"
              className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600"
            >
              Thêm sản phẩm
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default Test;
