import express from "express";
import {createServer} from "http";
import { Server} from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import cookieParser from "cookie-parser";   
dotenv.config();

  

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors:{
        origin:"http://localhost:3000",
        methods:["GET","POST"],
    },
});
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes);

app.get("/",(req,res)=>{
    res.json({message: "Teammind Api is running"});

})


io.on("connection",(socket)=>{
    console.log("A user connected: " + socket.id);
    socket.on("disconnect",()=>{
        console.log("A user disconnected: " + socket.id);
    });
});
const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});