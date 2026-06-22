import {Request, Response, NextFunction} from 'express';
import {verifyAccessToken, TokenPayload} from '../utils/jwt';
export interface AuthRequest extends Request {
    user?: TokenPayload;
}

export function authenticate(req:AuthRequest, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;   
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const token = authHeader.split(" ")[1];
    try {
        const payload = verifyAccessToken(token);
        req.user = payload;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
}