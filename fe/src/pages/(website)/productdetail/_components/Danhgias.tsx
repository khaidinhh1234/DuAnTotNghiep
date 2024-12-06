import { Image } from "antd";
// import { AnyObject } from "antd/es/_util/type";
// import React from "react";

const Danhgias = ({
  product,
  likeMutation,
  handleReviewLike,
  handlePreview,
}: {
  product: any;
  likeMutation: any;
  handleReviewLike: (id: number, status: boolean) => void;
  handlePreview: (image: string) => void;
}) => {
  return (
    <div>
      {" "}
      <div className="space-y-6">
        {product?.danhGias?.map((review: any, index: number) => (
          <div key={index} className="border p-4 rounded-lg shadow-sm">
            <div className="flex items-center space-x-4 mb-3">
              <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                <img
                  src={
                    review?.user?.anh_nguoi_dung || "https://i.pravatar.cc/100"
                  }
                  alt={`${review?.user?.ho} ${review?.user?.ten}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h4 className="font-medium">{`${review?.user?.ho} ${review?.user?.ten}`}</h4>
                <div className="flex items-center justify-between">
                  <span className="text-yellow-500 text-sm">
                    {"★".repeat(review?.so_sao_san_pham)}
                    {"☆".repeat(5 - review?.so_sao_san_pham)}
                  </span>
                  <span className="ml-1 text-xs text-gray-500">
                    {new Date(review?.created_at).toLocaleString()}
                  </span>
                  <div className="flex gap-1 text-xs text-gray-600 border-l border-gray-300 pl-1 ml-1">
                    <span className="">Phân loại hàng:</span>{" "}
                    {review.danh_gia_bien_the_san_phams.map(
                      (item: any, index: any) => (
                        <div key={index} className="flex ">
                          {item?.mau_bien_the?.ten_mau_sac},
                          {item?.kich_thuoc_bien_the?.kich_thuoc +
                            " | " +
                            "("+item?.kich_thuoc_bien_the?.loai_kich_thuoc+")"+ ","}
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-3">
              <span>Đúng với mô tả:</span>{" "}
              <span className="font-bold">{review?.mo_ta}</span>
            </p>

            <p className="text-gray-600  text-sm mb-2">
              <span className="font-bold"> {review?.chat_luong_san_pham}</span>
            </p>
            {review?.anh_danh_gias && (
              <div className="flex flex-wrap gap-2">
                {review?.anh_danh_gias.map((img: any, index: number) => (
                  <div
                    key={index}
                    className="w-[72px] h-[72px] overflow-hidden rounded-lg"
                  >
                    <Image
                      src={img?.anh_danh_gia}
                      alt={`Review Image ${index + 1}`}
                      className="w-full h-full object-cover"
                      onClick={() =>
                        review?.anh_danh_gia &&
                        handlePreview(review?.anh_danh_gia)
                      }
                      preview={{
                        mask: <div className="bg-black bg-opacity-50" />,
                      }}
                    />
                  </div>
                ))}
              </div>
            )}

            {review?.phan_hoi && (
              <div className="mt-2 pl-4 border-l-2 border-gray-300">
                <p className="text-gray-600 italic text-sm">
                  Phản hồi: {review?.phan_hoi}
                </p>
              </div>
            )}
            <div className="mt-2 flex items-center space-x-4">
              <button
                className={`like-button flex items-center space-x-2 ${likeMutation?.isPending ? "opacity-50 cursor-not-allowed" : ""}`}
                onClick={() =>
                  handleReviewLike(
                    review?.id,
                    review?.trang_thai_danh_gia_nguoi_dung
                  )
                }
                disabled={likeMutation?.isPending}
              >
                <i
                  className={
                    review.trang_thai_danh_gia_nguoi_dung
                      ? "fa-solid fa-thumbs-up text-blue-500"
                      : "fa-regular fa-thumbs-up text-gray-500"
                  }
                ></i>

                <span>
                  {likeMutation?.isPending ? (
                    "Đang xử lý..."
                  ) : (
                    <>
                      {review?.trang_thai_danh_gia_nguoi_dung
                        ? "Đã thích"
                        : "Hữu ích"}{" "}
                      ({review?.danh_gia_huu_ich_count})
                    </>
                  )}
                </span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Danhgias;
