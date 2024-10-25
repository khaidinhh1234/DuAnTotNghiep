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
            key: "f62e9799c7e13f6841a6",
            cluster: "ap1",
            encrypted: true,
        });

        const user = localStorage.getItem("user");
        if (!user) {
            console.log("Người dùng không tồn tại");
            return;
        }

        let userId: number;
        try {
            const parsedUser = JSON.parse(user);
            userId = parsedUser.user.id;
            console.log("ID người dùng:", userId);
        } catch (error) {
            console.error("Lỗi khi phân tích dữ liệu người dùng:", error);
            return;
        }

        const channelName = `thong-bao`;

        echo.channel(channelName).listen("ThongBaoMoi", (event: { user_id: number; tieu_de: string; noi_dung: string }) => {
            if (event.user_id === userId) {
                const toastMessage = `${event.tieu_de}: ${event.noi_dung}`;
                toast(toastMessage);
                setNotifications(prev => [...prev, toastMessage]);
            }
        });

        return () => {
            echo.leave(channelName);
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
