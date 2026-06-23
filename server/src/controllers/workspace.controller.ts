import {Response} from "express";
import {prisma} from "../config/prisma";
import {AuthRequest} from "../middleware/auth.middleware";

export async function createWorkspace(req: AuthRequest, res: Response) {
    try {
        const {name} = req.body;
        const userId = req.user!.userId;    
        if (!name) {
            return res.status(400).json({ message: "Workspace name is required" });
        }
        const workspace = await prisma.workspace.create({
            data: {
                name,
                memberships: {
                    create: {
                        userId,
                        role: "ADMIN",
                    },
                },
            },
            include: {memberships: true},
        });
        return res.status(201).json(workspace);
    } catch (error) {
        console.error("Error creating workspace:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export async function joinWorkspace(req: AuthRequest, res: Response) {
    try{
        const workspaceId = Array.isArray(req.params.workspaceId) ? req.params.workspaceId[0] : req.params.workspaceId;



        const userId = req.user!.userId;
        const workspace = await prisma.workspace.findUnique({
            where: { id: workspaceId }
        });
        if(!workspace){
            return res.status(404).json({ message: "Workspace not found" });
        }
        const existing = await prisma.membership.findUnique({
            where: {
                userId_workspaceId: { userId, workspaceId}},
            });
            if(existing){
                return res.status(400).json({ message: "User is already a member of this workspace" });
            }
            const membership = await prisma.membership.create({
                data: {
                    userId,
                    workspaceId,
                    role: "MEMBER",
                },
            });
            return res.status(201).json({membership});
    }
    catch (error) {
        console.error("Error joining workspace:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}