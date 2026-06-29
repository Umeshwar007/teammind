import {useEffect , useState} from "react";

import { useAppDispatch } from  "../app/hooks";
import { setCredentials } from "../features/auth/authSlice";
import { refreshApi } from "../api/auth";



export default function AuthInitializer ({children} : {children : React.ReactNode}){
    const [loading , setLoading] = useState(true);
    const dispatch = useAppDispatch();

    useEffect(()=>{
        async function tryAutoLogin(){
            try {
                const data = await refreshApi();
                dispatch(setCredentials({user: data.user , accessToken:data.accessToken}));
            }
            catch{

            }finally{
                setLoading(false);
            }
        }
        tryAutoLogin();
    },[dispatch]);

    if(loading){
        return <div>
            Loading...
        </div>;
    }
    return <> {children}</>;
}
