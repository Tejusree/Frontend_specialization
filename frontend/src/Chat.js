import React, { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import Picker from "emoji-picker-react";


function Chat({ socket, username, room }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [showPicker, setShowPicker] = useState(false);
 
  const onEmojiClick = (event, emojiObject) => {
    setCurrentMessage(prevInput => prevInput + emojiObject.emoji);
    setShowPicker(false);
  };

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        room: room,
        owner: username,
        message: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };

      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
    }
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList((list) => [...list, data]);
    });
  }, [socket]);

  return (
    <div className="chat-window">
      <div className="chat-header">
        <p>Live Chat - Room {room} </p>
      </div>
      <div className="chat-body">
        <ScrollToBottom className="message-container">
        <p id="welcomeMsg">  Hi {username}, you have entered live chat room! Keep Chatting...</p>
          {messageList.map((messageContent) => {
            return (
              <div
                className="message"
                id={username === messageContent.owner ? "you" : "other"}
              >
                <div>
                  <div className="message-content">
                    <p style={{padding: "5px"}}>{messageContent.message}</p>
                  </div>
                  <div className="message-details">
                    <p id="time">{messageContent.time}</p>
                    <p id="owner">{messageContent.owner===username?("you"):(messageContent.owner)}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </ScrollToBottom>
      </div>
      <div className="chat-footer">
      <img
          className="emoji-icon"
          src="https://icons.getbootstrap.com/assets/icons/emoji-smile.svg"
          onClick={() => setShowPicker(val => !val)} />
        {showPicker && <Picker
          pickerStyle={{ width: '100%' }}
          onEmojiClick={onEmojiClick} />}
        <input
          type="text"
          value={currentMessage}
          placeholder="type text..."
          onChange={(event) => {
            setCurrentMessage(event.target.value);
          }}
          onKeyPress={(event) => {
            event.key === "Enter" && sendMessage();
          }}
        />
        <button onClick={sendMessage}>&#9658;</button>
       
      </div>
    </div>
  );
}

export default Chat;