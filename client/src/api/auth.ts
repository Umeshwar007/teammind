import axiosInstance from "./axiosInstance";
 export interface SignupData{
    email:string;
    password:string;
    name:string;
 }

 export interface LoginData{
    email:string;
    password:string;
 }

 export async function signupApi(data:SignupData){
    const response = await axiosInstance.post("/api/auth/signup",data);
    return response.data;
 }

 export async function loginApi(data:LoginData){
    const response= await axiosInstance.post("/api/auth/login",data);
    return response.data;
 }