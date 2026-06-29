import axios from "axios";
import {store} from "../app/store";
import { setCredentials ,logout } from "../features/auth/authSlice";
const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
});


axiosInstance.interceptors.request.use((config)=>{
    const token= store.getState().auth.accessToken;
    if(token){
        config.headers.Authorization=`Bearer ${token}`;
    }
    return config;
});

let isRefreshing =false;
 
axios.interceptors.response.use((response)=>response,
async(error)=>{
    const originalRequest= error.config;
    if(error.response?.staus==401 && !originalRequest._retry && !isRefreshing){
        originalRequest._retry= true;
        isRefreshing=true;
        try{
           const refreshResponse= await axios.post(
            `${import.meta.env.VITE_API_URL}/api/auth/refresh`,
            {},
            {withCredentials:true}
           );
           const {accessToken,user}= refreshResponse.data;
           store.dispatch(setCredentials({user,accessToken}));
           originalRequest.headers.Authorization= `Bearer ${accessToken}`;
           isRefreshing= false;
        }
        catch(refreshError){
            isRefreshing= false;
            store.dispatch(logout());
            window.location.href="/login";
            return Promise.reject(refreshError);
        }
    }
    return Promise.reject(error);
}
);
export default axiosInstance;