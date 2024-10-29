
import { useQuery } from '@tanstack/react-query';
import instanceClient from "@/configs/client";
import { Carousel } from 'antd';
import { bannervoucher } from "@/assets/img";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
console.log('Fallback banner:', bannervoucher); 


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
  loai: 'tien' | 'phan_tram';
}

const Banner = () => {
  const { data: promotions = [] } = useQuery({
    queryKey: ['promotions'],
    queryFn: async () => {
      const response = await instanceClient.get('/chuong-trinh-uu-dai');
      return response.data.data as Promotion[];
    },
  });

  return (
    <div className="relative">
      <section>
        <div className="container">
          <div className="[&_.slick-dots]:!bottom-4 [&_.slick-dots_li.slick-active_button]:!bg-white [&_.slick-dots_li_button]:!bg-white/50">
            <Carousel
              autoplay
              autoplaySpeed={3000}
              dots={true}
              arrows={true}
              effect="fade"
            >
              {promotions?.map((promotion) => (
                <div key={promotion?.id}>
                  <a href={`/shop/${promotion?.duong_dan}`}>
                    <img
 src={promotion?.duong_dan_anh || bannervoucher} 
                      alt={promotion?.ten_uu_dai}
                      className="w-full md:bg-center bg-top bg-cover md:h-[550px] h-[250px] rounded cursor-pointer"
                    />
                  </a>
                </div>
              ))}
            </Carousel>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Banner;
