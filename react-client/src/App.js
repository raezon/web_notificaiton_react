import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:3000");
const BASE_API_URL = "http://localhost:3000"; // Replace with your REST API URL

const ChatApp = () => {
  const [room, setRoom] = useState("");
  const [userId, setUserId] = useState(0);
  const [bearerToken, setBearerToken] = useState(""); // New state for bearer token
  const [roomId, setRoomId] = useState(0);
  const [messages, setMessages] = useState("");
  const [chatLog, setChatLog] = useState({ messages: [] });
  const chatLogRef = useRef(null);
  const socketRef = useRef(null); // Add a ref to store the socket instance

  const addMessage = (userId, message, roomId) => {
    setChatLog([{ userId, message, roomId }]);
  };

  const handleJoinRoom = async () => {
    try {
      const response = await fetch(`${BASE_API_URL}/v1/chat/joinRoom`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${bearerToken}`, // Include the bearer token in the
        },
        body: JSON.stringify({
          roomId: Number(21),
        }),
      });

      if (response.ok) {
        console.log("Joined room successfully");
        // Join the room using the socket connection
        socketRef.current.emit("joinRoom", roomId);
      } else {
        console.error("Failed to join room");
      }
    } catch (error) {
      console.error("Error joining room", error);
    }
  };
  const handleMessageSend = async () => {
    try {
      const response = await fetch(`${BASE_API_URL}/v1/chat/sendMessage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${bearerToken}`, // Include the bearer token in the
        },
        body: JSON.stringify({
          roomId: Number(roomId),
          message: messages,
        }),
      });

      if (response.ok) {
        console.log("Message sent successfully");
      } else {
        console.error("Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message", error);
    }
  };

  const handleScrollToBottom = () => {
    chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight;
  };

  useEffect(() => {
    socketRef.current = socket;
    socket.on("connect",async () => {
          console.log("giiiiiiiiiiiii");
          socket.emit("register", { userId: 10961096, socketId: socket.id });
                try{
          const response = await fetch("http://localhost:3000/v1/chat/register", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId: 10385756, socketId: socket.id }),
          });

            if (response.ok) {
              console.log("Socket registered successfully");
            } else {
              console.error("Failed to register socket");
            }
          } catch (error) {
            console.error("Error registering socket", error);
          }
        });
    

    socket.on("userJoined", ({ userId, messages }) => {
      console.log(userId);
      addMessage(userId, messages);
    });

    socket.on("message", ({ userId, messages, roomId }) => {
      console.log("Received message:", { userId, messages, roomId });
      setRoomId(roomId);
      console.log({ userId, messages, roomId });
      setChatLog({ userId, messages, roomId });
    });

    // Clean up event listeners when the component unmounts
    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("userJoined");
      socket.off("message");
    };
  }, []); // Empty dependency array ensures that the effect runs only once

  useEffect(() => {
    handleScrollToBottom();
  }, [chatLog]);

  return (
    <div>
      <h1>Chat App</h1>
      <div className="chat-log" ref={chatLogRef}>
        {chatLog.messages
          ? chatLog.messages.map((messageObject, messageIndex) => (
              <div key={messageIndex}>
                <strong>{messageObject.userId}: </strong>
                {messageObject.message}
              </div>
            ))
          : []}
      </div>
      <div>
        <input
          type="text"
          placeholder="Bearer Token" // Add input field for bearer token
          value={bearerToken}
          onChange={(e) => setBearerToken(e.target.value)}
        />
        <button onClick={handleJoinRoom}>Join Room</button>
      </div>
      <div>
        <input
          type="text"
          placeholder="Message"
          value={messages}
          onChange={(e) => setMessages(e.target.value)}
        />
        <button onClick={handleMessageSend}>Send</button>
      </div>
    </div>
  );
};

export default ChatApp;
