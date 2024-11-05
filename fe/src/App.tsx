import { useEffect, useState, useRef } from "react";
import Echo from "laravel-echo";

import Router from "./routes";
import "react-toastify/dist/ReactToastify.css";

import Pusher from "pusher-js";

import { ToastContainer } from "react-toastify";

const notificationSoundUrl = "/THONGBAO.mp3";

const Banner = ({ notifications = [], onDelete }) => {
  const notificationList = Array.isArray(notifications) ? notifications : [];

  if (!Array.isArray(notifications)) {
    console.error("Error: notifications is not an array", notifications);
  }

  // return (
  //   <div
  //     style={{
  //       position: "fixed",
  //       top: 0,
  //       left: 0,
  //       right: 0,
  //       backgroundColor: "#ffffff",
  //       color: "#000000",
  //       padding: "10px 15px",
  //       zIndex: 1000,
  //       boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
  //       borderRadius: "8px",
  //       display: notificationList.length > 0 ? "block" : "none",
  //       animation: "slideDown 0.5s ease-out",
  //       overflow: "hidden",
  //     }}
  //   >
  //     {notificationList.map((notification) => (
  //       <div
  //         key={notification.id}
  //         style={{
  //           display: "flex",
  //           justifyContent: "space-between",
  //           alignItems: "center",
  //           marginBottom: "5px",
  //           padding: "10px",
  //           backgroundColor: "#f8f8f8",
  //           color: "#333333",
  //           borderRadius: "8px",
  //           boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
  //           animation: "fadeIn 0.5s forwards",
  //         }}
  //       >
  //         <div style={{ display: "flex", alignItems: "center" }}>
  //           <i
  //             className="fas fa-bell"
  //             style={{
  //               marginRight: "8px",
  //               color: "#ff6f61",
  //             }}
  //           ></i>
  //           <span style={{ fontWeight: "600", fontSize: "14px" }}>
  //             {notification.message}
  //           </span>
  //         </div>
  //         <button
  //           onClick={() => onDelete(notification.id)}
  //           style={{
  //             background: "#ff6f61",
  //             border: "none",
  //             color: "#ffffff",
  //             cursor: "pointer",
  //             padding: "5px 8px",
  //             borderRadius: "5px",
  //             fontSize: "12px",
  //             transition: "background 0.3s",
  //           }}
  //         >
  //           Ẩn
  //         </button>
  //       </div>
  //     ))}
  //   </div>
  // );
    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                backgroundColor: "#ff69b4", // Bright pink background
                color: "#00ff00", // Green text
                padding: "5px 10px",
                zIndex: 1000,
                boxShadow: "0 0 30px #000000", // Heavy shadow
                display: notificationList.length > 0 ? "block" : "none",
                animation: "shake 0.5s infinite", // Shake effect
                overflow: "hidden",
                fontFamily: "Comic Sans MS, cursive, sans-serif", // Playful font
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
                        padding: "5px",
                        backgroundColor: "#ffff00", // Yellow background
                        color: "#ff0000", // Red text
                        border: "5px dotted #0000ff", // Blue dotted border
                        animation: "fadeIn 2s forwards",
                        fontSize: "20px", // Larger text size
                        boxShadow: "0 0 20px #000", // Soft shadow
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <i
                            className="fas fa-bell"
                            style={{
                                marginRight: "8px",
                                color: "#0000ff", // Blue icon
                                fontSize: "40px", // Larger icon size
                            }}
                        ></i>
                        <span style={{ fontWeight: "bold", fontSize: "22px" }}>
                            {notification.message}
                        </span>
                    </div>
                    <button
                        onClick={() => onDelete(notification.id)}
                        style={{
                            background: "#ff0000", // Red button
                            border: "1px solid #ffffff", // White border
                            color: "#000000", // Black text
                            cursor: "pointer",
                            padding: "8px 12px",
                            borderRadius: "5px",
                            fontSize: "18px",
                            transition: "transform 0.5s", // Slow transition
                            transform: "rotate(15deg)", // Tilted button
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
      console.error("Lỗi phân tích người dùng:", error);
      return;
    }

    const channelName = `thong-bao`;
    echo
      .channel(channelName)
      .listen(
        "ThongBaoMoi",
        (event: { user_id: number; tieu_de: string; noi_dung: string }) => {
          if (event.user_id === userId) {
            const toastMessage = `${event.tieu_de}: ${event.noi_dung}`;
            const id = notificationId++;
            setNotifications((prev) => [
              ...prev,
              { id, message: toastMessage },
            ]);

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
        // echo.leave(channelName);
        echo.disconnect();
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
