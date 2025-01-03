import Echo from "laravel-echo";
import { useEffect, useRef, useState } from "react";

import "react-toastify/dist/ReactToastify.css";
import Router from "./routes";

import Pusher from "pusher-js";

import Snowfall from "react-snowfall";
import { ToastContainer } from "react-toastify";

const notificationSoundUrl = "/explosion-42132.mp3";

const Banner = ({ notifications = [], onDelete }) => {
    const notificationList = Array.isArray(notifications) ? notifications : [];

    if (!Array.isArray(notifications)) {
        console.error("Error: notifications is not an array", notifications);
    }

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                backgroundColor: "#ffffff",
                color: "#000000",
                padding: "10px 15px",
                zIndex: 2000,
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                borderRadius: "8px",
                display: notificationList.length > 0 ? "block" : "none",
                animation: "slideDown 0.5s ease-out",
                overflow: "hidden",
            }}
        >
            {notificationList.map((notification) => (
                <div
                    key={notification.id}
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "5px",
                        padding: "10px",
                        backgroundColor: "#f8f8f8",
                        color: "#333333",
                        borderRadius: "8px",
                        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                        animation: "fadeIn 0.5s forwards",
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <i
                            className="fas fa-bell"
                            style={{
                                marginRight: "8px",
                                color: "#ff6f61",
                            }}
                        ></i>
                        <span style={{ fontWeight: "600", fontSize: "14px" }}>
              {notification.message}
            </span>
                    </div>
                    <button
                        onClick={() => onDelete(notification.id)}
                        style={{
                            background: "#ff6f61",
                            border: "none",
                            color: "#ffffff",
                            cursor: "pointer",
                            padding: "5px 8px",
                            borderRadius: "5px",
                            fontSize: "12px",
                            transition: "background 0.3s",
                        }}
                    >
                        Ẩn
                    </button>
                </div>
            ))}
        </div>
    );
};

declare global {
    interface Window {
        Pusher: typeof Pusher;
    }
}

function App() {
    const [notifications, setNotifications] = useState<
        { id: number; message: string }[]
    >([]);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    let notificationId = 0;

    useEffect(() => {
        window.Pusher = Pusher;

        const echo = new Echo({
            broadcaster: "pusher",
            key: "481e2d48d1b812127469",
            cluster: "ap1",
            forceTLS: true, // Sử dụng forceTLS thay vì encrypted
        });

        const user = localStorage.getItem("user");
        if (!user) {
            return;
        }
        let userId: number;
        try {
            const parsedUser = JSON.parse(user);
            userId = parsedUser.user.id;
        } catch (error) {
            return;
        }

        const channelName = `thong-bao`;
        const channel = echo.channel(channelName);

        channel.listen(
            "ThongBaoMoi",
            (event: { user_id: number; tieu_de: string; noi_dung: string }) => {
                if (event.user_id === userId) {
                    const toastMessage = `${event.tieu_de}: ${event.noi_dung}`;
                    const id = notificationId++;
                    setNotifications((prev) => [...prev, { id, message: toastMessage }]);

                    // Phát âm thanh thông báo
                    if (!audioRef.current) {
                        audioRef.current = new Audio(notificationSoundUrl);
                    } else {
                        audioRef.current.pause();
                        audioRef.current.currentTime = 0;
                    }

                    const playSound = async () => {
                        try {
                            if (audioRef.current) {
                                await audioRef.current.play();
                            }
                        } catch (error) {
                            console.error("Lỗi khi phát âm thanh:", error);
                        }
                    };
                    playSound();

                    // Tự động xóa thông báo sau 5 giây
                    setTimeout(() => {
                        setNotifications((prev) =>
                            prev.filter((notification) => notification.id !== id)
                        );
                    }, 5000);
                }
            }
        );

        return () => {
            if (echo) {
                echo.leave(channelName);
            }
        };
    }, []);

    const handleDelete = (id: number) => {
        setNotifications((prev) =>
            prev.filter((notification) => notification.id !== id)
        );
    };

    return (
        <>
            <Banner notifications={notifications} onDelete={handleDelete} />
            <Router />

            <style>
                {`
                    .animals-container {
                        position: absolute;
                        top: 50%;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        pointer-events: none;
                        overflow: hidden;
                    }

                    .animal {
                        position: absolute;
                        width: 50px;
                        animation: fly 5s linear infinite;
                    }

                    .animal1 {
                        animation-delay: 0s;
                        top: 10%; 
                    }

                    @keyframes fly {
                        0% { transform: translateX(-50%) translateY(0); }
                        100% { transform: translateX(100vw) translateY(-20px); }
                    }

                    @keyframes fadeIn {
                        from {
                            opacity: 0;
                        }
                        to {
                            opacity: 1;
                        }
                    }
                `}
            </style>

            <ToastContainer />
        </>
    );
}

export default App;
