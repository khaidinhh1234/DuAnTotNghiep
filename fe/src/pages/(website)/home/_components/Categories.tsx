import { Swiper, SwiperSlide } from "swiper/react";

import { Ticket } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import "swiper/css";
import View from "../../_component/View";
const Categories = ({ bo_suu_tap }: any) => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [hoveredProductId, setHoveredProductId] = useState<number | null>(null);
  const [hoveredVariantIndex, setHoveredVariantIndex] = useState<number | null>(
    null
  );
  const handleMouseEnter = (productId: number, variantIndex: number) => {
    setHoveredProductId(productId);
    setHoveredVariantIndex(variantIndex);
  };

  // Khi chuột rời khỏi nút màu
  const handleMouseLeave = () => {
    setHoveredProductId(null);
    setHoveredVariantIndex(null);
  };
  // const { mutate, isPending } = useMutation({
  //   mutationFn: async (id: any) => {
  //     try {
  //       const response = await instanceClient.post(`sanpham/yeuthich/${id}`);

  //       if (
  //         response.data.mess === "Sản phẩm đã được xóa khỏi danh sách yêu thích"
  //       ) {
  //         message.success("Xóa sản phẩm yêu thích thành công");
  //       }
  //       if (
  //         response.data.mess === "Sản phẩm đã được thêm vào danh sách yêu thích"
  //       ) {
  //         message.success("Thêm sản phẩm yêu thích thành công");
  //       }

  //       return response.data;
  //     } catch (error: any) {
  //       message.error(error?.response?.data?.mess);
  //       // throw new Error("Xóa sản phẩm yêu thích thất bại");
  //     }
  //   },
  //   onSuccess: () => {
  //     queryclient.invalidateQueries({
  //       queryKey: ["TRANG_CHU_CLIENT"],
  //     });
  //   },
  // });
  // const categories = [
  //   {
  //     name: "Kids",
  //     image: sanPham3,
  //   },
  //   {
  //     name: "Cart",
  //     image: sanPham3,
  //   },
  //   {
  //     name: "Gift",
  //     image: sanPham3,
  //   },
  //   {
  //     name: "Rings",
  //     image: sanPham3,
  //   },
  //   {
  //     name: "Bracelets",
  //     image: sanPham3,
  //   },
  // ];
  // console.log(bo_suu_tap);
  // console.log(activeTab);
  return (
    <>
      <section>
        {/* <!-- Shop by categories --> */}
        <div className="md:container md:mb-28  mb-16  container-mobile">
          <div className="md:mb-14 mb-8 mx-2 md:mx-0">
            <h1 className="md:text-4xl text-3xl font-semibold tracking-[1px] text-center">
              Bộ Sưu Tập
            </h1>{" "}
            <div className="flex justify-center items-center  my-10">
              {bo_suu_tap?.map((item: any, index: number) => (
                <button
                  className={` px-1 py-1 lg:px-5 lg:py-2 font-bold text-xs lg:text-base rounded-3xl lg:pt-3 lg:mx-3 ${activeTab === index
                    ? "bg-black/80 text-white"
                    : " text-gray-500"
                    }`}
                  key={index}
                  onClick={() => setActiveTab(index)}
                  title={item?.ten}
                >
                  {item?.ten}
                </button>
              ))}
            </div>
          </div>
          <div className="flex">
            <div className="hidden lg:block w-1/4 pr-4">
              <img
                src={bo_suu_tap[activeTab]?.duong_dan_anh}
                alt={bo_suu_tap[activeTab]?.ten}
                className="w-full h-[550px] object-cover rounded-lg shadow-lg "
              />
            </div>
            <div className="w-full lg:w-3/4">
              <Swiper
                spaceBetween={140}
                slidesPerView={4}
                breakpoints={{
                  0: { slidesPerView: 1, spaceBetween: 10 },
                  640: { slidesPerView: 1.5, spaceBetween: 30 },
                  1024: { slidesPerView: 3 },
                  1244: { slidesPerView: 4 },
                }}
              >
                {bo_suu_tap[activeTab]?.san_phams?.map(
                  (item: any, index: number) => (
                    <SwiperSlide
                      key={index}
                      className="group relative mx-2 lg:mx-0"
                    >
                      <div className="relative">
                        <Link to={`/product-detail/${item.duong_dan}`}>
                          <div className="w-[400px] lg:w-[300px] lg:h-[400px] h-[500px] bg-neutral-200/70 relative">
                            <img
                              src={
                                hoveredProductId === item?.id && hoveredVariantIndex !== null
                                  ? item?.mau_sac_va_anh?.[hoveredVariantIndex]?.hinh_anh
                                  : item.anh_san_pham
                              }
                              alt={item.ten_san_pham}
                              className="absolute top-0 left-0 w-full h-full object-cover z-10 rounded-t-md"
                            />

                            {item.trong_chuong_trinh_uu_dai && (
                              <div
                                className="absolute bottom-0 left-0 text-white px-4 py-2 rounded-tr-2xl text-sm font-bold z-20 flex items-center space-x-2"
                                style={{
                                  background:
                                    "linear-gradient(to right, #f857a6, #ff5858)",
                                }}
                              >
                                <Ticket className="w-4 h-4" />
                                <div>
                                  <div>{item.trong_chuong_trinh_uu_dai}</div>
                                </div>
                              </div>
                            )}
                          </div>
                        </Link>
                        <View id={item?.duong_dan} ID={item?.id} />
                      </div>
                      <div className="bg-slate-50 pt-4 px-4 rounded-md pb-2 lg:w-[300px]">
                        <Link to={`/product-detail/${item.duong_dan}`}>
                          <h5 className="text-base truncate w-60 font-medium hover:text-red-500 text-left">
                            {item?.ten_san_pham}
                          </h5>
                        </Link>
                        <p className="font-semibold text-lg text-left">
                          {item?.gia_thap_nhat === item?.gia_cao_nhat ? (
                            <>
                              {(item?.gia_cao_nhat ?? 0).toLocaleString(
                                "vi-VN"
                              )}{" "}
                              đ
                            </>
                          ) : (
                            <>
                              {(item?.gia_thap_nhat ?? 0).toLocaleString(
                                "vi-VN"
                              )}{" "}
                              đ
                              <i className="fa-solid fa-minus text-sm mx-1 text-slate-500"></i>
                              {(item?.gia_cao_nhat ?? 0).toLocaleString(
                                "vi-VN"
                              )}{" "}
                              đ
                            </>
                          )}
                        </p>

                        <p className="font-bold text-lg flex items-center">
                          {item?.mau_sac_va_anh?.map((variant: any, index: number) => (
                            <button
                              key={index}
                              style={{
                                width: "28px",
                                height: "28px",
                                borderRadius: "50%",
                                marginRight: "4px",
                                border: `2px solid ${hoveredProductId === item?.id && hoveredVariantIndex === index
                                    ? "black" // Viền đen khi hover
                                    : "gray" // Viền xám khi không hover
                                  }`,
                                transform:
                                  hoveredProductId === item?.id && hoveredVariantIndex === index
                                    ? "scale(1.1)" // Phóng to khi hover
                                    : "scale(1)", // Kích thước mặc định
                                backgroundColor: variant?.ma_mau_sac,
                                transition: "all 0.3s ease",
                              }}
                              title={variant?.ten_mau_sac}
                              onMouseEnter={() => handleMouseEnter(item?.id, index)}
                              onMouseLeave={handleMouseLeave}
                            />
                          ))}
                        </p>
                      </div>
                    </SwiperSlide>
                  )
                )}
              </Swiper>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Categories;