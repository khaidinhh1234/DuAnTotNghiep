import { useEffect, useState, useRef } from "react";
import Echo from "laravel-echo";
import Router from "./routes";
import "react-toastify/dist/ReactToastify.css";
import Pusher from "pusher-js";
import { ToastContainer } from "react-toastify";

const notificationSoundUrl = "/explosion-42132.mp3";

const Banner = ({ notifications = [], onDelete }: any) => {
    const notificationList = Array.isArray(notifications) ? notifications : [];

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                backgroundColor: "#fff",
                color: "#000",
                padding: "15px",
                zIndex: 1000,
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
                borderRadius: "15px",
                display: notificationList.length > 0 ? "block" : "none",
                animation: "slideIn 0.6s cubic-bezier(0.68, -0.55, 0.27, 1.55)",
                overflow: "hidden",
            }}
        >
            {notificationList.map((notification: any) => (
                <div
                    key={notification.id}
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "15px",
                        padding: "12px 20px",
                        background: "linear-gradient(45deg, #ff6f61, #ff8a65)",
                        color: "#fff",
                        borderRadius: "12px",
                        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
                        animation: "bounceIn 0.7s ease-out",
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <i
                            className="fas fa-bell"
                            style={{
                                marginRight: "10px",
                                fontSize: "22px",
                                animation: "shake 0.6s ease-in-out",
                            }}
                        ></i>
                        <span style={{ fontWeight: "600", fontSize: "16px" }}>
              {notification.message}
            </span>
                    </div>
                    <button
                        onClick={() => onDelete(notification.id)}
                        style={{
                            background: "#fff",
                            border: "none",
                            color: "#ff6f61",
                            cursor: "pointer",
                            padding: "8px 12px",
                            borderRadius: "8px",
                            fontSize: "14px",
                            transition: "transform 0.2s ease, background 0.3s ease",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "#ffefef")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}
                    >
                        Xóa
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
            forceTLS: true,
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

            {/* Thêm ảnh động bay xung quanh viền màn hình */}
            <div className="animals-container">
                <img
                    src="https://cdn.pixabay.com/animation/2022/07/29/10/28/10-28-56-392_512.gif"
                    className="animal"
                    alt="Animal flying"
                />
            </div>

            <style>
                {`
          @keyframes slideIn {
            from {
              transform: translateY(-100%);
            }
            to {
              transform: translateY(0);
            }
          }

          @keyframes bounceIn {
            0% {
              transform: scale(0.5);
            }
            60% {
              transform: scale(1.1);
            }
            100% {
              transform: scale(1);
            }
          }

          @keyframes shake {
            0% { transform: rotate(0); }
            25% { transform: rotate(15deg); }
            50% { transform: rotate(-15deg); }
            75% { transform: rotate(10deg); }
            100% { transform: rotate(0); }
          }

          @keyframes flyAroundBorder {
            0% {
              transform: translate(0, 0);
            }
            25% {
              transform: translateX(100vw);
            }
            50% {
              transform: translateX(100vw) translateY(100vh);
            }
            75% {
              transform: translateX(0) translateY(100vh);
            }
            100% {
              transform: translate(0, 0);
            }
          }

          .animals-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            overflow: hidden;
            z-index: 1001; /* Đảm bảo nó luôn hiển thị trên các thành phần khác */
          }

          .animal {
            position: absolute;
            width: 80px; /* Điều chỉnh kích thước ảnh */
            animation: flyAroundBorder 20s linear infinite;
          }
        `}
            </style>

            <ToastContainer />
        </>
    );
}

export default App;
