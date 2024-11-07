import instanceClient from "@/configs/client"
import { useQuery } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

const BlogDetail = () => {
    const { duong_dan } = useParams()
    const [viewed, setViewed] = useState(false);
    const { data } = useQuery({
        queryKey: ["blogDetail", duong_dan],
        queryFn: async () => {
            const response = await instanceClient.post(`/xem-bai-viet/${duong_dan}`)
            return response.data
        }
    })
    console.log(data)
    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('vi-VN', options).format(date);
      };
      
    const incrementView = () => {
        if (!viewed) {
            console.log("Gửi yêu cầu tăng lượt xem..."); 

            instanceClient.post(`/xem-bai-viet/${duong_dan}`)
                .then((response) => {
                    console.log("Lượt xem đã tăng:", response.data); 
                    setViewed(true); 
                })
                .catch((error) => {
                    console.error("Lỗi khi tăng lượt xem:", error);
                });
        }
    };

    useEffect(() => {
        if (data) {
            const timeoutId = setTimeout(incrementView, 10000);
            return () => clearTimeout(timeoutId); 
        }
    }, [data, duong_dan, viewed]);

    return (
        <div>
            <div className="flex w-full px-10 mt-10 ml-5 mb-20">
                <div className="w-2/3 pr-5">
                    <div className="w-full">
                        {data?.baiVietDetail ? (
                            <>
                                <div className="mt-4">
                                    <img src={data.baiVietDetail.anh_tin_tuc} alt={data.baiVietDetail.tieu_de} className="w-full h-auto mb-10" />
                                    <h1 className="text-4xl font-semibold mb-6">{data.baiVietDetail.tieu_de}</h1>
                                    <span className="text-xl text-gray-400">Ngày đăng: {formatDate(data.baiVietDetail.created_at)}</span>
                                    <div dangerouslySetInnerHTML={{ __html: data.baiVietDetail.noi_dung }} className="mt-4 text-lg" />
                                </div>
                            </>
                        ) : (
                            <h1 className="text-xl font-semibold">Bài viết không tồn tại</h1>
                        )}
                    </div>
                </div>

                <div className="w-1/3 pl-5">
                    <h3 className="text-2xl font-semibold mb-4">Bài viết liên quan</h3>
                    <div className="space-y-4">
                        {data?.baiVietTop?.map((baiViet: any) => (
                            <div key={baiViet.id} className="flex items-start">
                                <img
                                    src={baiViet.anh_tin_tuc}
                                    alt={baiViet.tieu_de}
                                    className="w-16 h-16 rounded object-cover mr-4"
                                />
                                <div>
                                    <h4 className="text-lg font-medium">{baiViet.tieu_de}</h4>
                                    <p className="text-gray-500 text-sm">{baiViet.danh_muc_tin_tuc.ten_danh_muc_tin_tuc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </div>
    )
}

export default BlogDetail
