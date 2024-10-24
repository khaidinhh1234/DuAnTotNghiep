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

        console.log("Connecting to Pusher...");

        const echo = new Echo({
            broadcaster: "pusher",
            key: "f62e9799c7e13f6841a6",
            cluster: "ap1",
            encrypted: true,
        });

        echo.connector.pusher.connection.bind('state_change', (states) => {
            console.log('Pusher state changed:', states);
        });

        const user = localStorage.getItem("user");

        if (!user) {
            console.log("User does not exist");
            return;
        }

        const parsedUser = JSON.parse(user);
        const user_id = parsedUser.user.id;
        console.log("User ID:", user_id);

        const channelName = `thong-bao.${user_id}`;
        console.log(`Listening to channel: ${channelName}`);

        const notificationListener = echo.private(channelName).listen("ThongBaoMoi", (event) => {
            const toastMessage = `${event.tieu_de}: ${event.noi_dung}`;
            console.log('Received event on channel ' + channelName, event);
            toast(toastMessage);
            setNotifications((prevNotifications) => [
                ...prevNotifications,
                toastMessage,
            ]);
        });

        return () => {
            echo.leave(channelName);
            echo.disconnect();
            console.log(`Stopped listening to channel: ${channelName}`);
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
