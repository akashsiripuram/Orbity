import { WebSocketServer, WebSocket } from "ws";

//initializing server
const wss = new WebSocketServer({ port: 8080 });

interface User {
  room: string;
  socket: WebSocket;
  name: string;
}

//active sockets or rooms
let allSockets: User[] = [];

wss.on("connection", (socket) => {
  
  socket.on("message", (message) => {
    //@ts-ignore
    const parsedMessage = JSON.parse(message);
    if (parsedMessage.type == "join") {
      allSockets.push({
        socket,
        room: parsedMessage.payload.roomId,
        name: parsedMessage.payload.name,
      });
    }
    if (parsedMessage.type == "chat") {
      let senderUser: User | null = null;
      let currRomm = null;

      //finding current room
      for (let i = 0; i < allSockets.length; i++) {
        if (allSockets[i].socket == socket) {
          currRomm = allSockets[i].room;
          senderUser = allSockets[i];
          break;
        }
      }
     
      if (!senderUser) return;
      //sending message to all the users connected to current room
      for (let i = 0; i < allSockets.length; i++) {
        if (allSockets[i].room == currRomm) {
          allSockets[i].socket.send(
            JSON.stringify({
              name: senderUser.name,
              message: parsedMessage.payload.message,
            })
          );
        }
      }
    }
    if (parsedMessage.type == "leave") {
      //removing user from allSockets
      allSockets = allSockets.filter(
        (user) => user.socket !== socket
      );
    }
  });
});

