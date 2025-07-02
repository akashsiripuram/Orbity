import { useEffect, useRef, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [messages, setMessages] = useState(["hi there", "hello"]);
  const [message, setMessage] = useState();
  const wsRef = useRef();
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080/");
    ws.onmessage = (event) => {
      setMessages((m) => [...m, event.data]);
    };
    wsRef.current = ws;
    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          type: "join",
          payload: {
            roomId: "red",
          },
        })
      );
    };
  }, []);
  return (
    <div>
      <div className="h-screen bg-black flex flex-col justify-between">
        <br></br>
        <br></br>
        <br></br>
        <div className="h-[95vh]">
          {messages.map((msg) => (
            <div className="mb-9">
              <span className="bg-white text-black rounded p-4 m-8">{msg}</span>
            </div>
          ))}
        </div>
        <div className="w-full bg-white flex">
          <input
            type="text"
            className="flex-1 p-4"
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            onClick={() => {
              if (!message) return;
              wsRef.current.send(
                JSON.stringify({
                  type: "chat",
                  payload: {
                    message: message,
                  },
                })
              );
            }}
            className="cursor-pointer bg-purple-600 text-white p-4 rounded-2xl"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
