// import { useQuery } from "@tanstack/react-query";
// import instanceClient from "@/configs/client";
// import { Carousel } from "antd";
// import { bannervoucher } from "@/assets/img";

// import "swiper/css";
// import "swiper/css/navigation";
// import "swiper/css/pagination";
// import "swiper/css/scrollbar";
// // console.log("Fallback banner:", bannervoucher);

// interface Promotion {
//   id: number;
//   ten_uu_dai: string;
//   duong_dan: string;
//   duong_dan_anh: string;
//   mo_ta: string;
//   ngay_hien_thi: string;
//   ngay_bat_dau: string;
//   ngay_ket_thuc: string;
//   gia_tri_uu_dai: number;
//   loai: "tien" | "phan_tram";
// }

// const Banner = () => {
//   const { data: promotions = [] } = useQuery({
//     queryKey: ["promotions"],
//     queryFn: async () => {
//       const response = await instanceClient.get("/chuong-trinh-uu-dai");
//       return response.data.data as Promotion[];
//     },
//   });

//   return (
//     <div className="relative">
//       <section>
//         <div className="container">
//           <div className="">
//             <Carousel
//               autoplay
//               autoplaySpeed={3000}
//               dots={true}
//               arrows={true}
//               effect="fade"
//             >
//               {promotions.length != 0 ? (
//                 promotions?.map((promotion) => (
//                   <div key={promotion?.id}>
//                     <a href={`/shopp/${promotion?.duong_dan}`}>
//                       <img
//                         src={
//                           promotion?.duong_dan_anh ||
//                           "https://res.cloudinary.com/dpypwbeis/image/upload/v1730302252/nb5vfqzp02pwzjogckyl.png"
//                         }
//                         alt={promotion?.ten_uu_dai}
//                         className="w-full md:bg-center bg-top bg-cover md:h-[550px] h-[250px] rounded cursor-pointer"
//                       />
//                     </a>
//                   </div>
//                 ))
//               ) : (
//                 <img
//                   src="https://res.cloudinary.com/dpypwbeis/image/upload/v1730302252/nb5vfqzp02pwzjogckyl.png"
//                   alt="Promotion Banner"
//                   className="w-full md:bg-center bg-top bg-cover md:h-[550px] h-[250px] rounded cursor-pointer"
//                 />
//               )}
//             </Carousel>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default Banner;
import { useQuery } from "@tanstack/react-query";
import instanceClient from "@/configs/client";
import { Carousel } from "antd";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
  const [countdowns, setCountdowns] = useState<{ [key: number]: any }>({});
  
  const { data: promotions = [] } = useQuery<Promotion[]>({
    queryKey: ["promotions"],
    queryFn: async () => {
      const response = await instanceClient.get("/chuong-trinh-uu-dai");
      return response.data.data;
    },
  });

  const calculateTimeLeft = (startDate: string, endDate: string) => {
    const now = new Date().getTime();
    const startTime = new Date(startDate).getTime();
    const endTime = new Date(endDate).getTime();

    if (now < startTime) {
      return {
        label: "Sắp Bắt Đầu",
        timeLeft: startTime - now,
      };
    } else if (now < endTime) {
      return {
        label: "Đang Diễn Ra",
        timeLeft: endTime - now,
      };
    }
    return { label: "Đã Kết Thúc", timeLeft: 0 };
  };

  const formatTime = (milliseconds: number) => {
    if (milliseconds <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
      days: Math.floor(milliseconds / (1000 * 60 * 60 * 24)),
      hours: Math.floor((milliseconds / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((milliseconds / (1000 * 60)) % 60),
      seconds: Math.floor((milliseconds / 1000) % 60),
    };
  };

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];
    
    promotions.forEach((promotion) => {
      const updateCountdown = () => {
        setCountdowns(prev => ({
          ...prev,
          [promotion.id]: calculateTimeLeft(promotion.ngay_bat_dau, promotion.ngay_ket_thuc)
        }));
      };
      
      updateCountdown();
      const timer = setInterval(updateCountdown, 1000);
      timers.push(timer);
    });

    return () => timers.forEach(timer => clearInterval(timer));
  }, [promotions]);

  return (
    <div className="relative">
      <section>
        <div className="container">
          <Carousel autoplay autoplaySpeed={3000} dots={true} arrows={true} effect="fade">
            {promotions.map((promotion) => {
              const countdown = countdowns[promotion.id] || calculateTimeLeft(promotion.ngay_bat_dau, promotion.ngay_ket_thuc);
              const timeLeft = formatTime(countdown.timeLeft);

              return (
                <div key={promotion.id} className="relative">
                  <Link to={`/shopp/${promotion.duong_dan}`}>
                    <img
                      src={promotion.duong_dan_anh}
                      alt={promotion.ten_uu_dai}
                      className="w-full md:bg-center bg-top bg-cover md:h-[550px] h-[250px] rounded cursor-pointer"
                    />
                    <motion.div
                      initial={{ x: -100, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      className="absolute top-6 left-6 bg-gradient-to-r from-red-500 to-pink-500 text-white text-lg px-6 py-2 rounded-full shadow-lg font-semibold"
                    >
                      {countdown.label}
                    </motion.div>
                    {countdown.label !== "Đã Kết Thúc" && (
                      <motion.div
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="absolute bottom-8 right-8 bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-xl flex items-center gap-6"
                      >
                        {Object.entries(timeLeft).map(([unit, value]) => (
                          <motion.div
                            key={unit}
                            className="text-center min-w-[80px] relative"
                            whileHover={{ scale: 1.1 }}
                            transition={{ type: "spring", stiffness: 300 }}
                          >
                            <AnimatePresence mode="wait">
                              <motion.div
                                key={value}
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -20, opacity: 0 }}
                                className="text-4xl font-bold text-gray-800 mb-1"
                              >
                                {String(value).padStart(2, '0')}
                              </motion.div>
                            </AnimatePresence>
                            <div className="text-sm font-medium text-gray-600 uppercase tracking-wider">
                              {unit === "days" ? "Ngày"
                                : unit === "hours" ? "Giờ"
                                : unit === "minutes" ? "Phút"
                                : unit === "seconds" ? "Giây"
                                : unit}
                            </div>
                            <motion.div
                              className="absolute inset-0 border-2 border-pink-500 rounded-lg"
                              animate={{
                                scale: [1, 1.1, 1],
                                opacity: [1, 0.5, 1]
                              }}
                              transition={{
                                duration: 1,
                                repeat: Infinity,
                                ease: "easeInOut"
                              }}
                            />
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </Link>
                </div>
              );
            })}
          </Carousel>
        </div>
      </section>
    </div>
  );
};

export default Banner;
