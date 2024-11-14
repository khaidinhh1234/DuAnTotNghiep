import instanceClient from "@/configs/client";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css"; // Import Swiper CSS

const Blog = () => {
    const { data } = useQuery({
        queryKey: ["baiviet"],
        queryFn: async () => {
            const response = await instanceClient.get(`/load-danh-muc-tin-tuc`);
            console.log("Response data:", response.data);
            return response.data;
        },
    });
    console.log(data)
    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('vi-VN', options).format(date);
    };
    // console.log
    return (
        <div className="mt-10 pl-20 pb-20">
            {data?.Danh_muc_tin_tuc && (
                <Swiper
                    spaceBetween={20}
                    slidesPerView={6}
                    loop={true}
                    className="related-articles-slides"
                >
                    {data.Danh_muc_tin_tuc.map((item: any) => (
                        <SwiperSlide key={item.id}>
                            <div className="p-4 bg-white rounded-lg shadow-md relative">
                                <Link to={`/danhmuctintuc/${item.duong_dan}`}>
                                    <div className="relative w-full h-40 rounded-lg overflow-hidden cursor-pointer">
                                        <img
                                            src={item.hinh_anh}
                                            alt={item.ten_danh_muc_tin_tuc}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                            <span className="text-white text-lg font-semibold text-center px-2">
                                                {item.ten_danh_muc_tin_tuc}
                                            </span>
                                        </div>
                                    </div>
                                </Link>

                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            )}
            <div className="mt-32">
                {data?.Lay_bai_viet_theo_danh_muc
                    .filter((category: any) => category.tin_tuc.length > 0) // Lọc các danh mục có bài viết
                    .map((category: any) => (
                        <div key={category.id} className="mb-6">
                            <h2 className="text-5xl font-bold mb-4">{category.ten_danh_muc_tin_tuc}</h2>
                            <h4 className="text-2xl font-bold mb-4 mt-10">Mới nhất</h4>
                            <div className="flex flex-wrap -mx-2">
                                {category.tin_tuc.map((article: any) => (
                                    <div key={article.id} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-2">
                                        <div className="bg-white p-4">
                                            <Link to={`/xem-bai-viet/${article.duong_dan}`}>
                                                <img
                                                    src={article.anh_tin_tuc}
                                                    alt=""
                                                    className="w-full h-[300px] object-cover mb-3 cursor-pointer"
                                                />
                                                <h3 className="text-2xl font-semibold hover:text-red-500">
                                                    {article.tieu_de}
                                                </h3>
                                                <span className="text-xl text-gray-400">
                                                    {article.danh_muc_tin_tuc.ten_danh_muc_tin_tuc} | {formatDate(article.created_at)}
                                                </span>
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
            </div>

        </div>
    );
};

export default Blog;
