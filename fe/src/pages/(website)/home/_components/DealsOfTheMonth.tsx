import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";

const DealsOfTheMonth = ({ chuong_trinh_uu_dai }: any) => {
  const calculateTimeLeft = (startDate: string, endDate: string) => {
    const now = new Date();
    const startTime = new Date(startDate);
    const endTime = new Date(endDate);

    if (now < startTime) {
      return {
        label: "Sắp Bắt Đầu",
        timeLeft: startTime.getTime() - now.getTime(),
      };
    } else if (now < endTime) {
      return {
        label: "Đang Diễn Ra",
        timeLeft: endTime.getTime() - now.getTime(),
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

  const gridClass =
    chuong_trinh_uu_dai.length === 1
      ? "grid-cols-1"
      : chuong_trinh_uu_dai.length === 2
        ? "grid-cols-2"
        : "grid-cols-2 lg:grid-cols-4";

  return (
    <section className="bg-gray-100 py-10">
      <div className={`max-w-7xl mx-auto grid ${gridClass} gap-8`}>
        {chuong_trinh_uu_dai?.slice(0, 8).map((item: any, index: any) => {
          const [countdown, setCountdown] = useState(() =>
            calculateTimeLeft(item.ngay_bat_dau, item.ngay_ket_thuc)
          );

          useEffect(() => {
            const timer = setInterval(() => {
              setCountdown(
                calculateTimeLeft(item.ngay_bat_dau, item.ngay_ket_thuc)
              );
            }, 1000);

            return () => clearInterval(timer);
          }, [item.ngay_bat_dau, item.ngay_ket_thuc]);

          const timeLeft = formatTime(countdown.timeLeft);

          return (
            <div
              key={index}
              className="relative bg-white shadow-xl rounded-lg overflow-hidden hover:scale-105 transition-transform duration-300"
            >
              <Link to={`/shopp/${item?.duong_dan}`}>
                <div className="relative">
                  {/* Maintain aspect ratio 16:9 */}
                  <div className="relative w-full pb-[56.25%]">
                    {/* Padding-bottom trick to maintain 16:9 aspect ratio */}
                    <img
                      src={item?.duong_dan_anh}
                      alt="Deal"
                      className="absolute top-0 left-0 w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-pink-500 text-white text-sm px-3 py-1 rounded-full shadow-md">
                    {countdown.label}
                  </div>
                  {countdown.label !== "Đã Kết Thúc" && (
                    <div className="absolute bottom-3 right-3 bg-white p-3 rounded-lg shadow-md flex items-center space-x-2">
                      {Object.entries(timeLeft).map(([unit, value]) => (
                        <div key={unit} className="text-center">
                          <div className="text-xl font-bold text-gray-800">
                            {value}
                          </div>
                          <div className="text-xs text-gray-500 capitalize">
                            {unit === "days"
                              ? "Ngày"
                              : unit === "hours"
                                ? "Giờ"
                                : unit === "minutes"
                                  ? "Phút"
                                  : unit === "seconds"
                                    ? "Giây"
                                    : unit}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
              <div className="p-4">
                <h3
                  className="text-lg font-semibold text-gray-800 truncate"
                  title={item.ten_uu_dai} // Hiển thị tooltip khi hover
                >
                  {item.ten_uu_dai}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Ưu đãi đến{" "}
                  {new Date(item.ngay_ket_thuc).toLocaleDateString("vi-VN")}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default DealsOfTheMonth;
