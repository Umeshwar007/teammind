import {Response,NextFunction} from "express";
import{AuthRequest} from "./auth.middleware";
import {prisma} from "../config/prisma";

export function requireRole(allowedRoles:("ADMIN" | "MEMBER")[]){
    return async (req: AuthRequest, res: Response, next: NextFunction) => {
        try{
            const workspaceId = Array.isArray(req.params.workspaceId)
                ? req.params.workspaceId[0]
                : req.params.workspaceId;
            const userId= req.user?.userId;
            
            if(!userId){
                return res.status(401).json({message: "Unauthorized"});
            }
        const membership= await prisma.membership.findUnique({
            where: {
                userId_workspaceId: {
                    userId,
                    workspaceId,
                },
            },
        });
        if(!membership){
            return res.status(403).json({message: "Not a member of this workspace"});
        }
        if(!allowedRoles.includes(membership.role)){
            return res.status(403).json({message: "Insufficient permissions"});
        }
        next();
    
}
catch(error){
    console.error("Error in requireRole middleware:", error);
    res.status(500).json({message: "Internal server error"});
}   
    };
}