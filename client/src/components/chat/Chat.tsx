import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import { useParams } from "react-router-dom";

export default function Chat() {
  const [messages, setMessages] = useState<{ name: string; message: string }[]>([]);
  const [message, setMessage] = useState("");
  const {id,username}=useParams();
  const wsRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const ws = new WebSocket(import.meta.env.VITE_BACKEND_URI);
    wsRef.current = ws;

    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          type: "join",
          payload: {
            roomId: id,
            name: username,
          },
        })
      );
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages((m) => [...m, data]);
    };

    return () => {
      ws.close();
    };
  }, [id, username]);

  const sendMessage = () => {
    if (!message.trim()) return;
    wsRef.current.send(
      JSON.stringify({
        type: "chat",
        payload: {
          message: message,
        },
      })
    );
    setMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 flex flex-col">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 bg-black/20 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">#</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Room Id: {id}</h1>
              
            </div>
          </div>
          
          
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4 relative z-10">
        {messages.map((msg, index) => {
          const isCurrentUser = msg.name === username;

          return (
            <div key={index} className={`flex ${isCurrentUser ? "justify-end" : "justify-start"} animate-in slide-in-from-bottom-2 duration-300`}>
              <div className={`flex items-end space-x-3 max-w-md ${isCurrentUser ? "flex-row-reverse space-x-reverse" : ""}`}>
                {!isCurrentUser && (
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
                    {msg.name[0]?.toUpperCase()}
                  </div>
                )}
                
                <div className={`group relative ${isCurrentUser ? "ml-12" : "mr-12"}`}>
                  <div className={`px-4 py-3 rounded-2xl shadow-lg backdrop-blur-sm border ${
                    isCurrentUser 
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-white/10 rounded-br-md" 
                      : "bg-white/10 text-white border-white/10 rounded-bl-md"
                  }`}>
                    {!isCurrentUser && (
                      <div className="text-xs font-medium text-gray-300 mb-1">{msg.name}</div>
                    )}
                    <p className="text-sm leading-relaxed">{msg.message}</p>
                  </div>
                  
                  <div className={`mt-1 text-xs text-gray-500 ${isCurrentUser ? "text-right" : "text-left"}`}>
                    {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="relative z-10 bg-black/20 backdrop-blur-xl border-t border-white/5 p-6">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm">
          <div className="flex items-end space-x-4">
            

            <div className="flex-1">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                className="w-full bg-transparent text-white placeholder-gray-400 resize-none focus:outline-none max-h-32 min-h-[24px]"
                rows={1}
                style={{ height: "auto", minHeight: "24px" }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = "auto";
                  target.style.height = Math.min(target.scrollHeight, 128) + "px";
                }}
              />
            </div>

            <button
              onClick={sendMessage}
              disabled={!message.trim()}
              className="p-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:opacity-50"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          
          
        </div>
      </div>
    </div>
  );
}