import { useEffect, useState } from "react";
import Echo from "laravel-echo";
import Pusher from "pusher-js";
import { Toaster } from "@/components/ui/toaster";
import { ToastContainer, toast } from "react-toastify";
import Router from "./routes";
import "react-toastify/dist/ReactToastify.css"; // Đảm bảo thêm phần này để Toast hoạt động

// Extend the Window interface to include Pusher
declare global {
  interface Window {
    Pusher: typeof Pusher;
  }
}

function App() {
  const [notifications, setNotifications] = useState<string[]>([]);

  useEffect(() => {
    // Thiết lập Pusher
    window.Pusher = Pusher;

    // Khởi tạo Laravel Echo
    const echo = new Echo({
      broadcaster: "pusher",
      key: "1c8e95dbe744a942b3f8", // Thay bằng khóa Pusher của bạn
      cluster: "ap1", // Thay bằng cluster Pusher của bạn
      encrypted: true,
    });

    // Lắng nghe sự kiện từ kênh "notifications"
    echo.channel("thongbao").listen("UserNotification", (event: any) => {
      console.log("Notification received:", event.message);
      setNotifications((prevNotifications) => [
        ...prevNotifications,
        event.message,
      ]);

      // Hiển thị thông báo sử dụng Toast
      toast(event.message);
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
      {/* Nếu cần, bạn có thể hiển thị danh sách thông báo nhận được */}
      <ul>
        {notifications.map((notification, index) => (
          <li key={index}>{notification}</li>
        ))}
      </ul>
    </>
  );
}

export default App;
