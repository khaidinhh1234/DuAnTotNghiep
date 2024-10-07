import { useEffect, useState } from "react";
import Echo from "laravel-echo";
import Pusher from "pusher-js";
import { Toaster } from "@/components/ui/toaster";
import { ToastContainer, toast } from "react-toastify";
import Router from "./routes";
import "react-toastify/dist/ReactToastify.css"; // Đảm bảo thêm phần này để Toast hoạt động

declare global {
  interface Window {
    Pusher: typeof Pusher;
  }
}

function App() {
  const [notifications] = useState<string[]>([]);

  useEffect(() => {
    // Thiết lập Pusher
    window.Pusher = Pusher;

    // Khởi tạo Laravel Echo
    const echo = new Echo({
      broadcaster: "pusher",
      key: "ec6b4203ba3ec544f8ae", // Thay bằng khóa Pusher của bạn
      cluster: "ap1", // Thay bằng cluster Pusher của bạn
      encrypted: true,
    });

    echo.channel("ma-khuyen-mai").listen("MaKhuyenMaiCreated", (event: any) => {
      console.log("Notification received:", event.mo_ta);

      // Hiển thị thông báo sử dụng Toast
      // Hiển thị thông báo toast với thông tin từ event
      const toastMessage = `${event.mo_ta} - ${event.hang_thanh_vien_ids}`;
      toast(toastMessage);

// Thêm thông báo alert
      const alertMessage = `Mã khuyến mãi mới: ${event.mo_ta} - ${event.hang_thanh_vien_ids}`;
      alert(alertMessage);

    });

    // Cleanup khi component bị hủy
    return () => {
      echo.disconnect();
    };
  }, []);

  return (
      <>
        <Router />
        <Toaster />
        <ToastContainer />

        {/* Hiển thị danh sách thông báo nhận được */}
        <ul>
          {notifications.length > 0 && (
              <h3>Thông báo:</h3>
          )}
          {notifications.map((notification, index) => (
              <li key={index}>{notification}</li>
          ))}
        </ul>
      </>
  );
}

export default App;