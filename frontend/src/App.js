import "./App.css";
import io from "socket.io-client";
import { useState } from "react";
import Chat from "./Chat";
import { useAlert } from "react-alert";
import appbg from "./assets/appbg.jpg"

const socket = io.connect("http://localhost:3001");

function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);
  const alert = useAlert();

  const joinRoom = () => {
    if (username !== "" && room !== "") {
      socket.emit("join_room", room);
      setShowChat(true);
    }
    if (username == "" && room == "") {
      alert.error("Enter username and room ID");
    }
    if (username == "" && room !== "") {
      alert.error("Enter username");
    }
    if (username !== "" && room == "") {
      alert.error("Enter room ID");
    }
  };

  return (
    <div style={{
      backgroundImage: `url(${appbg})`,
      backgroundPosition: 'center',
    }} className="App">
      {!showChat ? (
        <div className="joinChatContainer">
          <h3>Chat App</h3>
          <input
            style={{ "margin-left": "85px" }}
            type="text"
            placeholder="Name"
            onChange={(event) => {
              setUsername(event.target.value);
            }}
          />
          <input
            style={{ "margin-left": "85px" }}
            type="text"
            placeholder="Room ID"
            onChange={(event) => {
              setRoom(event.target.value);
            }}
          />
          <button style={{ "margin-left": "85px" }} onClick={joinRoom}>Join A Room</button>
        </div>
      ) : (
        <Chat socket={socket} username={username} room={room} />
      )}
    </div>
  );
}

export default App;