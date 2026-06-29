import {Request , Response} from "express";
import {prisma} from "../config/prisma";
import bcrypt from "bcrypt";
import {generateAccessToken, generateRefreshToken} from "../utils/jwt";
import {verifyRefreshToken} from "../utils/jwt";
import { AuthRequest } from "../middleware/auth.middleware";
export async function register(req: Request, res: Response) {
    try{
        const{email, password,name} = req.body;
        if(!email || !password || !name){
            return res.status(400).json({message: "All Fields are required"});
        }
        const existingUser= await prisma.user.findUnique({where:{email}});
        if(existingUser){
            return res.status(409).json({message: "User already exists"});
        }
        const passwordHash= await bcrypt.hash(password,10);
        const user= await prisma.user.create({
            data:{email,passwordHash,name}
        });
        const payload={userId: user.id, email: user.email};
        const accessToken= generateAccessToken(payload);
        const refreshToken= generateRefreshToken(payload);
        
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false, // Set to true in production
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });
       return res.status(201).json({accessToken,
            user:{id: user.id, email: user.email, name: user.name}

        });

    }
    catch(error){
        console.error(error);
        return res.status(500).json({message:"Internal server error"});
    }
}
export async function login(req: Request, res: Response) {
    try{
        const{email,password}= req.body;
        if(!email || !password){
            return res.status(400).json({message: "All Fields are required"});
        }
        const user= await prisma.user.findUnique({where:{email}});
        if(!user){
            return res.status(401).json({message: "Invalid credentials"});
        }

        const isPasswordValid= await bcrypt.compare(password,user.passwordHash);
        if(!isPasswordValid){
            return res.status(401).json({message: "Invalid credentials"});
        }
        const payload={userId: user.id, email: user.email};
        const accessToken= generateAccessToken(payload);
        const refreshToken= generateRefreshToken(payload);
        
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false, // Set to true in production
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });
       return res.status(200).json({accessToken,
        user:{id: user.id, email: user.email, name: user.name}
       });
    }
    catch(error){
        console.error(error);
        return res.status(500).json({message:"Internal server error"});
    }
}

export async function getProfile(req:AuthRequest,res:Response){
     try{
        const user= await prisma.user.findUnique({where:{id:req.user!.userId},
        select:{id:true,email:true,name:true,createdAt:true,updatedAt:true}});


        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        return res.json({user});
     }
     catch(error){
        console.error(error);
        return res.status(500).json({message:"Internal server error"});
     }  
}
export async function refresh (req:Request, res:Response){
    try{
      const token= req.cookies.refreshToken;
      if(!token){
        return res.status(401).json({message:"No refresh token"});
      }
      const payload= verifyRefreshToken(token);
      const user= await prisma.user.findUnique({where:{id:payload.userId}});
      if(!user){
        return res.status(401).json({message:"User not found"});
      }
      const newAccessToken= generateAccessToken({userId:user.id,email:user.email});
      return res.status(200).json({
        accessToken:newAccessToken,
        user:{id:user.id,email:user.email,name:user.name},
      });
    }
    catch(error){
        return res.status(401).json({message: "Invalid refresh token"});
    }
}