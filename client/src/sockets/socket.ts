import{io , Socket} from "socket.io-client";

let socket: Socket | null = null;

export function connectSocket(token:string):Socket{
    socket= io(import.meta.env.VITE_API_URL,{
        auth:{token},
    });
    return socket;
}

export function getSocket():Socket|null{
    return socket;
}
export function disconnectSocket(){
    if(socket){
        socket.disconnect();
        socket=null;
    }
}