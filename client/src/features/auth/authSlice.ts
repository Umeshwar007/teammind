import {createSlice ,type PayloadAction} from "@reduxjs/toolkit";

export interface User{
    id:string;
    email:string;
    name:string;
}

interface AuthState{
    user:User | null;
    accessToken:string | null;
    isAuthenticated:boolean;
}

const initialState:AuthState={
    user:null,
    accessToken:null,
    isAuthenticated:false,
}

const AuthSlice= createSlice({
    name: "auth",
    initialState,
    reducers:{
      setCredentials:(
        state,
        action:PayloadAction<{user:User ; accessToken:string}>
      )=>{
        state.user=action.payload.user;
        state.accessToken= action.payload.accessToken;
        state.isAuthenticated=true;
      },
      logout:(state)=>{
        state.user=null;
        state.accessToken=null;
        state.isAuthenticated= false;
      },
    },
});

export const {setCredentials,logout}=AuthSlice.actions;
export default AuthSlice.reducer; 