import {Server} from "socket.io";
import { AuthSocket} from  "./socketAuth"
import {prisma} from "../config/prisma";
export function registerChatHandlers (io:Server ,socket:AuthSocket){
    socket.on("join_channel",  (channelId:string)=>{
        socket.join(channelId);
        console.log(`${socket.user?.email} joined channel ${channelId}`);
    })

    socket.on("leave_channel",(channelId:string)=>{
        socket.leave(channelId);
    });

    socket.on("send_message",async (data:{channelId:string;content:string })=>{
       try{
        const {channelId,content}=data;
        const userId= socket.user!.userId;
        const message= await prisma.message.create({
            data:{content,channelId,authorId:userId},
            include:{author:{select:{id:true,name:true,email:true}}},
        });

        io.to(channelId).emit("new_message",message);
       }
       catch(error){
        console.error(error);
        socket.emit("error_message","failed to send message");
       }
    });
    socket.on("typing",(data:{channelId:string})=>{
        socket.to(data.channelId).emit("user_typing",{
            userId:socket.user?.userId,
            email:socket.user?.email,
        });
    });


}