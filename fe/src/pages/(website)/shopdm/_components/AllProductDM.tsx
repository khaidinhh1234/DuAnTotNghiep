import instanceClient from "@/configs/client";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

const AllProductDM = () => {
    const { tenDanhMucCha, tenDanhMucCon, tenDanhMucConCapBa } = useParams();

    const { data } = useQuery({
        queryKey: ["AllProductDM"],
        queryFn: async () => {
            try {
                let url = "/danhmuc"; // Bắt đầu với URL cơ bản
    
                // Xác định cấp độ danh mục và tạo URL phù hợp
                if (tenDanhMucCha) url += `/${tenDanhMucCha}`;
                if (tenDanhMucCon) url += `/${tenDanhMucCon}`;
                if (tenDanhMucConCapBa) url += `/${tenDanhMucConCapBa}`;
    
                // Gọi API với URL đã tạo
                const response = await instanceClient.post(url);
    
                // Kiểm tra trạng thái phản hồi
                if (response.data.status !== true) {
                    throw new Error("Error fetching product");
                }
    
                return response.data; // Trả về dữ liệu
            } catch (error) {
                throw new Error("Lỗi khi lấy thông tin");
            }
        },
    });
    
    return (
        <>
            <section>
                <div className="container">
                    <div className=" flex mt-10 ">
                        <p className="pr-2">{data?.data?.danh_muc?.ten_danh_muc || "Tên danh mục không có sẵn"}</p>
                    </div>
                </div>
            </section>
        </>
    );
};

export default AllProductDM;
