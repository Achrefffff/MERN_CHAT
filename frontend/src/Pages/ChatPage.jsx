import React, { useEffect } from "react";
import axios from "axios";
import { useState } from "react";

const ChatPage = () => {
  /*const [chats, setChats] = useState([]);
  const fetchChats = async () => {
    const { data } = await axios.get("/api/chat");
    console.log(data);
    setChats(data);
  };
  useEffect(() => {
    fetchChats();
  }, []);
*/
  return (
    <div>
      {/*chats.map((chat) => (
        <div key={chat.chatId}> {chat.chatName} </div>
      ))*/}
      <h1 style={{color:'whitesmoke'}}>Chat Page</h1>
    </div>
  );
};

export default ChatPage;
