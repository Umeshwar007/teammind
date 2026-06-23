import {Socket} from "socket.io";
import {verifyAccessToken,TokenPayload} from "../utils/jwt";

export interface AuthSocket extends Socket{
    user?: TokenPayload;
}

export function socketAuthMiddleware(socket:AuthSocket, next: (err?:Error)=>void){
    const token= socket.handshake.auth?.token;
    if(!token){
        return next(new Error("Authentication Required"));
    }
    try{
        const payload= verifyAccessToken(token);
        socket.user=payload;
        next();
    }
    catch(error){
        next(new Error("Invalid or expired token"));
    }

}