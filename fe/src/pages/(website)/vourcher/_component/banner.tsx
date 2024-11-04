import { useQuery } from "@tanstack/react-query";
import instanceClient from "@/configs/client";
import { Carousel } from "antd";
import { bannervoucher } from "@/assets/img";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
// console.log("Fallback banner:", bannervoucher);

interface Promotion {
  id: number;
  ten_uu_dai: string;
  duong_dan: string;
  duong_dan_anh: string;
  mo_ta: string;
  ngay_hien_thi: string;
  ngay_bat_dau: string;
  ngay_ket_thuc: string;
  gia_tri_uu_dai: number;
  loai: "tien" | "phan_tram";
}

const Banner = () => {
  const { data: promotions = [] } = useQuery({
    queryKey: ["promotions"],
    queryFn: async () => {
      const response = await instanceClient.get("/chuong-trinh-uu-dai");
      return response.data.data as Promotion[];
    },
  });

  return (
    <div className="relative">
      <section>
        <div className="container">
          <div className="">
            <Carousel
              autoplay
              autoplaySpeed={3000}
              dots={true}
              arrows={true}
              effect="fade"
            >
              {promotions.length != 0 ? (
                promotions?.map((promotion) => (
                  <div key={promotion?.id}>
                    <a href={`/shop/${promotion?.duong_dan}`}>
                      <img
                        src={
                          promotion?.duong_dan_anh ||
                          "https://res.cloudinary.com/dpypwbeis/image/upload/v1730302252/nb5vfqzp02pwzjogckyl.png"
                        }
                        alt={promotion?.ten_uu_dai}
                        className="w-full md:bg-center bg-top bg-cover md:h-[550px] h-[250px] rounded cursor-pointer"
                      />
                    </a>
                  </div>
                ))
              ) : (
                <img
                  src="https://res.cloudinary.com/dpypwbeis/image/upload/v1730302252/nb5vfqzp02pwzjogckyl.png"
                  alt="Promotion Banner"
                  className="w-full md:bg-center bg-top bg-cover md:h-[550px] h-[250px] rounded cursor-pointer"
                />
              )}
            </Carousel>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Banner;
