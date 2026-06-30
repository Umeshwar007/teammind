import { useEffect } from "react";
import { useAppDispatch} from "../app/hooks";
import { getSocket } from "../sockets/socket";
import { addMessages , setUserTyping, clearUserTyping, type Message } from "../features/chat/chatSlice";


export function useChatSocket(){
    const dispatch= useAppDispatch();
    useEffect(()=>{
        const socket= getSocket();
        if(!socket)return;

        function handleNewMessage(message:Message){
            dispatch(addMessages(message));
        }

        function handleUserTyping(data:{channelId:string, email:string}){
            //new channelId here
            dispatch(setUserTyping({channelId: data.channelId, email:data.email}));
            setTimeout(()=>{
                dispatch(clearUserTyping({channelId:data.channelId, email:data.email}));
            },3000);
        }
        socket.on("user_typing", handleUserTyping);
        socket.on("new_message",handleNewMessage);
        return ()=>{
            socket.off("new_message",handleNewMessage);
        };
    },[dispatch]);

}