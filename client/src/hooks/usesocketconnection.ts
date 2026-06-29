import { useEffect} from "react";
import { useAppSelector } from "../app/hooks";
import {connectSocket , disconnectSocket} from "../sockets/socket";

export function useSocketConnection(){
    const accessToken = useAppSelector((state)=>state.auth.accessToken);
    const isAuthenticated = useAppSelector((state)=>state.auth.isAuthenticated);
    useEffect(()=>{
        if(isAuthenticated && accessToken){
            connectSocket(accessToken);
        }
        return ()=>{
            disconnectSocket();
        }
    },[isAuthenticated, accessToken]);
}
