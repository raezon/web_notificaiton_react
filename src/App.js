import { useState, useEffect } from "react";
import { io } from "socket.io-client";

function App() {
  const [notifications, setNotifications] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const userId = 10961096;
  console.log(userId);
  useEffect(() => {
    const socket = io("http://localhost:3000");
    socket.on("connect", () => {
      console.log(`Connected with ID ${socket.id}`);
      // save the socket ID to your state or send it to your server to associate it with the user
      socket.emit("register", { userId: 10961096, socketId: socket.id });
    });
    socket.on("disconnect", () => {
      console.log("Disconnected from WebSocket server");
    });

    socket.on("text-chat", (data) => {
      console.log("Received notification from server:", data.message);

      setNotifications((prevMessages) => [...prevMessages, data.message]);
    });

    socket.on("booking-created", (data) => {
      console.log("Received notification from server:", data.notifications);

      setNotifications(data.notifications);
      setNotificationCount(data.countNotification);

      console.log(notifications);
    });

    socket.on("booking-rejected", (data) => {
      console.log(
        "Received notification from server rejected:",
        data.notifications
      );

      setNotifications(data.notifications);
      setNotificationCount(data.countNotification);

      console.log(notifications);
    });

    socket.on("booking-returned", (data) => {
      console.log("Received notification from server:", data.notifications);

      setNotifications(data.notifications);
      setNotificationCount(data.countNotification);

      console.log(notifications);
    });

    socket.on("booking-accepted", (data) => {
      console.log("recepient accepted:", data.recipientId);
      console.log("userId  accepted:");
      console.log(
        "Received notification from server accepted:",
        data.notifications
      );

      setNotifications(data.notifications);
      setNotificationCount(data.countNotification);

      console.log(notifications);
    });

    socket.on("booking-finished", (data) => {
      console.log("Received notification from server:", data.notifications);

      setNotifications(data.notifications);
      setNotificationCount(data.countNotification);

      console.log(notifications);
    });
  }, []);

  return (
    <div>
      <p>Total notifications: {notificationCount}</p>
      <ul>
        {notifications.map((notification, index) => (
          <li key={index}>
            <p>{notification.id}</p>
            <p>{notification.isRead}</p>
            <p>{notification.bookId}</p>
            <p>{notification.status}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
