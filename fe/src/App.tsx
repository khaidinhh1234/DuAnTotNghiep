import { useEffect, useState } from "react";
import Echo from "laravel-echo";
import Pusher from "pusher-js";
import { Toaster } from "@/components/ui/toaster";
import { ToastContainer, toast } from "react-toastify";
import Router from "./routes";
import "react-toastify/dist/ReactToastify.css";

declare global {
    interface Window {
        Pusher: typeof Pusher;
    }
}

function App() {
    const [notifications, setNotifications] = useState<string[]>([]);

    useEffect(() => {
        window.Pusher = Pusher;

        const echo = new Echo({
            broadcaster: "pusher",
            key: "f62e9799c7e13f6841a6", // Sử dụng khóa Pusher của bạn
            cluster: "ap1", // Sử dụng cluster Pusher của bạn
            encrypted: true,
        });

        echo.channel('thong-bao').listen("ThongBaoMoi", (event) => {
            console.log('Event received:', event); // Log sự kiện nhận được
            const toastMessage = `${event.tieu_de}: ${event.noi_dung}`;
            toast(toastMessage); // Hiển thị thông báo
            setNotifications((prevNotifications) => [
                ...prevNotifications,
                toastMessage,
            ]);
        });

        return () => {
            echo.disconnect();
        };
    }, []);

    return (
        <>
            <Router />
            <Toaster />
            <ToastContainer />
            {notifications.length > 0 && (
                <div>
                    <h3>Thông báo:</h3>
                    <ul>
                        {notifications.map((notification, index) => (
                            <li key={index}>{notification}</li>
                        ))}
                    </ul>
                </div>
            )}
        </>
    );
}

export default App;
