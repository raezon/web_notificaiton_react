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
        const response = await fetch(
          "http://localhost:3000/socket/register",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${bearerToken}`, // Include the bearer token in the
            },
            body: JSON.stringify({ socketId: socket.id }),
          }
        );

        if (response.ok) {
          console.log("Socket registered successfully");
        } else {
          console.error("Failed to register socket");
        }
      } catch (error) {
        console.error("Error registering socket", error);
      }
    try {
      /*const response = await fetch(`${BASE_API_URL}/v1/socket/joinRoom`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${bearerToken}`, // Include the bearer token in the
        },
        body: JSON.stringify({
          roomId: Number(3),
        }),
      });*/

   /*   if (response.ok) {
        console.log("Joined room successfully");
        // Join the room using the socket connection
        socketRef.current.emit("joinRoom", roomId);
      } else {
        console.error("Failed to join room");
      }*/
    } catch (error) {
      console.error("Error joining room", error);
    }
  };
  const handleMessageSend = async () => {
    try {
      const response = await fetch(`${BASE_API_URL}/socket/sendMessage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${bearerToken}`, // Include the bearer token in the
        },
        body: JSON.stringify({
          roomId: Number(roomId),
          roomsId:[1,2,3],
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
    socket.on("connect", async () => {
      console.log("giiiiiiiiiiiii");
    //  socket.emit("register", { userId: 10385756, socketId: socket.id });
     /* try {
        const response = await fetch("http://localhost:3000/v1/chat/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${bearerToken}`, // Include the bearer token in the
          },
          body: JSON.stringify({  socketId: socket.id }),
        });

        if (response.ok) {
          console.log("Socket registered successfully");
        } else {
          console.error("Failed to register socket");
        }
      } catch (error) {
        console.error("Error registering socket", error);
      }*/
    });

    socket.on("userJoined", ({ userId, messages }) => {
   
      addMessage(userId, messages);
    });
        socket.on("booking-created", (data) => {
          console.log(data);
        });
        socket.on("ticked-created", (data) => {
          console.log(data);
        });
            socket.on("comment-created", (data) => {
              console.log(data);
            });
           socket.on("forget-password", (data) => {
             console.log(data);
           });
       
                socket.on("employee-created", (data) => {
                  console.log(data);
                });
        socket.on("booking-accepted", (data) => {
          console.log(data);
        });
    socket.on("paying-succeded", (data) => {
      console.log(data);
    });

    socket.on("message", ({ userId, messages, roomId }) => {
    
        console.log("Received message:", { userId, messages, roomId });
        setRoomId(roomId);
        console.log({ userId, messages, roomId });
        setChatLog({ userId, messages, roomId });
      
       
    });

        socket.on("countMessage", ({  count }) => {
          console.log("count Message:", {  count });
 
        });

      socket.on("countNewMessages", ({ count }) => {
        console.log("Received message:", { count });
   
        console.log({ count });

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
                <strong>
                  {" "}
                  {messageObject.sender.firstName +
                    messageObject.sender.lastName}
                  :{" "}
                </strong>{" "}
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
