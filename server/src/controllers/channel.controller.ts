import { Response } from  "express";
import { prisma } from "../config/prisma";
import { AuthRequest } from "../middleware/auth.middleware";

export async function createChannel(req: AuthRequest, res: Response) {
    try {
        const { name } = req.body;
        const workspaceId = Array.isArray(req.params.workspaceId)
            ? req.params.workspaceId[0]
            : req.params.workspaceId;
        
            if(!name){
                return res.status(400).json({message: "Channel name is required"});
            }
            const channel= await prisma.channel.create({
                data:{
                    name,
                    workspaceId
                },
            });
            return res.status(201).json({channel});
    } catch (error) {
        console.error("Error creating channel:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export async function getChannel(req: AuthRequest, res: Response) {
    try{
        const workspaceId = Array.isArray(req.params.workspaceId)
            ? req.params.workspaceId[0]
            : req.params.workspaceId;



        const channels= await prisma.channel.findMany({
            where:{workspaceId},
            orderBy:{createdAt: "asc"},
        });
        return res.status(200).json({channels});
    } catch (error) {
        console.error("Error fetching channels:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export async function deleteChannel(req: AuthRequest, res: Response) {
    try{
        const id = Array.isArray(req.params.id)
            ? req.params.id[0]
            : req.params.id;
        await prisma.channel.delete({where:{id}});
        return res.status(204).send();
    } catch (error) {
        console.error("Error deleting channel:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}