import { useEffect, useRef, useState } from 'react'
import './App.css'

function App() {
  const [socket,setSocket]=useState();
  const inputRef=useRef();
  function SendMessage(){
    if(!socket){
      return;
    }
  }
  useEffect(()=>{
    const ws=new WebSocket("ws://localhost:8080");
    setSocket(ws);
    
  },[])

  return (
    <div>
      <input type='text' ref={inputRef}placeholder='Enter message'></input>
      <button onClick={SendMessage}>Send</button>
    </div>
  )
}

export default App
