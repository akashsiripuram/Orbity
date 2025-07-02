
import { Route, Routes } from "react-router-dom";
import "./App.css";
import JoinRoom from "./components/room/JoinRoom";
import Chat from "./components/chat/Chat";

function App() {
  
  return (
    <Routes>
      <Route path="/" element={<JoinRoom/>}></Route>
      <Route path="/chat/:id/:username" element={<Chat/>}></Route>
    </Routes>
  );
}

export default App;
