import express from "express";
import {createServer} from "http";
import { Server} from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import cookieParser from "cookie-parser";  
import workspaceRoutes from "./routes/workspace.routes"; 
import { AuthSocket, socketAuthMiddleware } from "./sockets/socketAuth";
import{ registerChatHandlers} from "./sockets/chat";
dotenv.config();

  

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors:{
        origin:"http://localhost:5173",
        methods:["GET","POST"],
    },
});
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true,
}));
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/workspaces", workspaceRoutes);

app.get("/",(req,res)=>{
    res.json({message: "Teammind Api is running"});

})

io.use(socketAuthMiddleware);
io.on("connection",(socket:AuthSocket)=>{
    console.log("A user connected: " ,socket.user?.email);
    registerChatHandlers(io,socket);
    socket.on("disconnect",()=>{
        console.log("A user disconnected: " ,socket.user?.email);
    });
});
const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});