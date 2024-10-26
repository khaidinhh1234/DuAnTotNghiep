import { useEffect, useState, useRef } from "react";
import Echo from "laravel-echo";
import Pusher from "pusher-js";
import Router from "./routes";
import "react-toastify/dist/ReactToastify.css";

const notificationSoundUrl = `${process.env.PUBLIC_URL}/explosion-42132.mp3`;

const Banner = ({ notifications, onDelete }) => (
    <div
        style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            backgroundColor: '#ffffff',
            color: '#000000',
            padding: '10px 15px',
            zIndex: 1000,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            borderRadius: '8px',
            display: notifications.length > 0 ? 'block' : 'none',
            animation: 'slideDown 0.5s ease-out',
            overflow: 'hidden',
        }}
    >
        {notifications.map((notification) => (
            <div
                key={notification.id}
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '5px',
                    padding: '10px',
                    backgroundColor: '#f8f8f8',
                    color: '#333333',
                    borderRadius: '8px',
                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                    animation: 'fadeIn 0.5s forwards',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <i
                        className="fas fa-bell"
                        style={{
                            marginRight: '8px',
                            color: '#ff6f61'
                        }}
                    ></i>
                    <span style={{ fontWeight: '600', fontSize: '14px' }}>{notification.message}</span>
                </div>
                <button
                    onClick={() => onDelete(notification.id)}
                    style={{
                        background: '#ff6f61',
                        border: 'none',
                        color: '#ffffff',
                        cursor: 'pointer',
                        padding: '5px 8px',
                        borderRadius: '5px',
                        fontSize: '12px',
                        transition: 'background 0.3s',
                    }}
                >
                    Xóa
                </button>
            </div>
        ))}
        <div className="animals-container">
            <img src="https://cdn.pixabay.com/animation/2023/08/10/21/14/21-14-12-148_512.gif" className="animal animal1" alt="Mosquito 1" />
        </div>
    </div>
);

declare global {
    interface Window {
        Pusher: typeof Pusher;
    }
}

function App() {
    const [notifications, setNotifications] = useState<{ id: number; message: string }[]>([]);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    let notificationId = 0;

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
        echo
            .channel(channelName)
            .listen("ThongBaoMoi", (event: { user_id: number; tieu_de: string; noi_dung: string }) => {
                if (event.user_id === userId) {
                    const toastMessage = `${event.tieu_de}: ${event.noi_dung}`;
                    const id = notificationId++;
                    setNotifications((prev) => [...prev, { id, message: toastMessage }]);

                    // Thiết lập âm thanh
                    if (!audioRef.current) {
                        audioRef.current = new Audio(notificationSoundUrl);
                    } else {
                        audioRef.current.pause();
                        audioRef.current.currentTime = 0;
                    }

                    // Phát âm thanh khi có tương tác
                    const playSound = async () => {
                        try {
                            await audioRef.current.play();
                        } catch (error) {
                            console.error("Error playing audio:", error);
                        }
                    };
                    playSound(); // Gọi hàm phát âm thanh
                }
            });

        return () => {
            echo.leave(channelName);
            echo.disconnect();
        };
    }, []);

    const handleDelete = (id: number) => {
        setNotifications((prev) => prev.filter(notification => notification.id !== id));
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
            top: 10%; /* Adjusts vertical position */
          }

          .animal2 {
            animation-delay: 2s;
            top: 30%; /* Adjusts vertical position */
          }

          .animal3 {
            animation-delay: 4s;
            top: 50%; /* Adjusts vertical position */
          }

          @keyframes fly {
            0% { transform: translateX(-50%) translateY(0); } /* Start from left outside of screen */
            100% { transform: translateX(100vw) translateY(-20px); } /* Move to right outside of screen and slightly up */
          }

          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
        `}
            </style>
        </>
    );
}

export default App;
