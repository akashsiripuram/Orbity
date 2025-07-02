"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
require("./App.css");
function App() {
    const [socket, setSocket] = (0, react_1.useState)();
    const inputRef = (0, react_1.useRef)();
    function SendMessage() {
        if (!socket) {
            return;
        }
    }
    (0, react_1.useEffect)(() => {
        const ws = new WebSocket("ws://localhost:8080");
        setSocket(ws);
    }, []);
    return (<div>
      <input type='text' ref={inputRef} placeholder='Enter message'></input>
      <button onClick={SendMessage}>Send</button>
    </div>);
}
exports.default = App;
