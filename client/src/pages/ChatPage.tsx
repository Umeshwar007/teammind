 import {useState , useEffect , useRef} from "react";
 import { useAppDispatch , useAppSelector} from "../app/hooks";

 import { setActiveChannel , setMessages} from "../features/chat/chatSlice";
 import { getSocket } from "../sockets/socket";
 import { getChannelsApi, createChannelApi, getMessagesApi} from "../api/workspace";
import { useChatSocket} from "../hooks/useChatSocket";

 interface Channel{
    id: string;
    name: string;
    workspaceId:string;
 }

 const WORKSPACE_ID= "";

export default function ChatPage(){
   const dispatch = useAppDispatch();
   const user = useAppSelector((state)=>state.auth.user);
   const activeChannelId= useAppSelector((state)=>state.chat.activeChannelId);
   const messages = useAppSelector((state)=> activeChannelId ? (state.chat.messagesByChannel[activeChannelId] ??[]):[]);
   const typingUsers= useAppSelector((state)=>activeChannelId ?(state.chat.typingUsers[activeChannelId] ??[]):[]);

    const [channels, setChannels]= useState<Channel[]>([]);
    const [newChannelName, setNewChannelName]= useState("");
    const [messageInput, setMessageInput]= useState("");
    const messagesEndRef= useRef<HTMLDivElement>(null);
    
    useChatSocket();

    useEffect(()=>{
        async function loadChannels(){
           try {
            const data= await getChannelsApi(WORKSPACE_ID);
            setChannels(data.channels);
            if(data.channels.length>0){
                selectChannel(data.channels[0].id);
            }

           }catch(error){
            console.error("Error loading channels:", error);
           }
        }
        loadChannels();
    },[]);

    useEffect(()=>{
        messagesEndRef.current?.scrollIntoView({behavior:"smooth"});
    },[messages]);

    async function selectChannel(channelId:string){
        const socket = getSocket();
        if(activeChannelId) socket?.emit("leave_channel",activeChannelId);
        dispatch(setActiveChannel(channelId));
        socket?.emit("join_channel",channelId);
        try{
            const data= await getMessagesApi(WORKSPACE_ID,channelId);
            dispatch(setMessages({channelId, messages:data.messages}));
        }catch(error){
            console.error("Error loading messages:", error);
        }
    }

    async function handleCreateChannel(e:React.FormEvent){
        e.preventDefault();
        if(!newChannelName.trim())return;
        try{
            const data= await createChannelApi(WORKSPACE_ID,newChannelName);
            setChannels((prev)=>[...prev,data.channel]);
            setNewChannelName("");
        }catch(error){
            console.error(error);
        }
    }
    
    function handleSendMessage(e:React.FormEvent){
        e.preventDefault();
        if(!messageInput.trim() || !activeChannelId)return;
        const socket= getSocket();
        socket?.emit("send_message",{
            channelId: activeChannelId,
            content: messageInput,
        });
        setMessageInput("");
    }

    function handleTyping(){
        const socket = getSocket();
        if(activeChannelId){
            socket?.emit("typing",{channelId:activeChannelId});
        }
    }



 return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "sans-serif" }}>
      {/* Sidebar */}
      <div style={{ width: 240, background: "#1a1a2e", color: "white", padding: 16 }}>
        <h3 style={{ marginBottom: 16 }}>Channels</h3>
        {channels.map((channel) => (
          <div
            key={channel.id}
            onClick={() => selectChannel(channel.id)}
            style={{
              padding: "8px 12px",
              marginBottom: 4,
              borderRadius: 6,
              cursor: "pointer",
              background: activeChannelId === channel.id ? "#16213e" : "transparent",
            }}
          >
            # {channel.name}
          </div>
        ))}
        <form onSubmit={handleCreateChannel} style={{ marginTop: 24 }}>
          <input
            value={newChannelName}
            onChange={(e) => setNewChannelName(e.target.value)}
            placeholder="New channel..."
            style={{ width: "100%", padding: 8, borderRadius: 4, border: "none", marginBottom: 8 }}
          />
          <button
            type="submit"
            style={{ width: "100%", padding: 8, background: "#0f3460", color: "white", border: "none", borderRadius: 4, cursor: "pointer" }}
          >
            + Add Channel
          </button>
        </form>
      </div>

      {/* Chat area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#f5f5f5" }}>
        {/* Header */}
        <div style={{ padding: "16px 24px", background: "white", borderBottom: "1px solid #eee" }}>
          <strong>
            {activeChannelId
              ? `# ${channels.find((c) => c.id === activeChannelId)?.name}`
              : "Select a channel"}
          </strong>
          <span style={{ float: "right", color: "#888" }}>{user?.name}</span>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: "auto", padding: 24 }}>
          {messages.map((message) => (
            <div
              key={message.id}
              style={{
                marginBottom: 16,
                padding: "10px 14px",
                background: message.isAiReply ? "#e8f4fd" : "white",
                borderRadius: 8,
                boxShadow: "0 1px 2px rgba(0,0,0,0.08)",
                borderLeft: message.isAiReply ? "3px solid #0084ff" : "none",
              }}
            >
              <div style={{ fontWeight: 600, marginBottom: 4, fontSize: 13, color: "#555" }}>
                {message.isAiReply ? "🤖 AI Assistant" : message.author.name}
              </div>
              <div>{message.content}</div>
              <div style={{ fontSize: 11, color: "#aaa", marginTop: 4 }}>
                {new Date(message.createdAt).toLocaleTimeString()}
              </div>
            </div>
          ))}
          {typingUsers.length > 0 && (
            <div style={{ color: "#888", fontSize: 13, fontStyle: "italic" }}>
              {typingUsers.join(", ")} {typingUsers.length === 1 ? "is" : "are"} typing...
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form
          onSubmit={handleSendMessage}
          style={{ padding: 16, background: "white", borderTop: "1px solid #eee", display: "flex", gap: 8 }}
        >
          <input
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyDown={handleTyping}
            placeholder="Type a message... (use @ai to ask the AI assistant)"
            style={{ flex: 1, padding: "10px 14px", borderRadius: 8, border: "1px solid #ddd", fontSize: 14 }}
          />
          <button
            type="submit"
            style={{ padding: "10px 20px", background: "#0084ff", color: "white", border: "none", borderRadius: 8, cursor: "pointer" }}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
