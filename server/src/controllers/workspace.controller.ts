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