import {createSlice , type PayloadAction} from "@reduxjs/toolkit";

export interface Message{
    id:string;
    content : string;
    isAiReply:boolean;
    createdAt:string;
    channelId:string;
    authorId:string;
    author:{
        id:string;
        name:string;
        email:string;
    };
}


interface chatState{
    messagesByChannel:Record<string,Message[]>;
    activeChannelId: string | null;
    typingUsers: Record<string, string[]>;//array of emails typing
}

const initialState: chatState={
    messagesByChannel:{},
    activeChannelId:  null,
    typingUsers:{},
};

const chatSlice = createSlice({
    name:"chat",
    initialState,
    reducers:{
        setActiveChannel:(state,action:PayloadAction<string>)=>{
            state.activeChannelId= action.payload;
        },
        setMessages:(
            state,
            action:PayloadAction<{channelId:string,messages:Message[]}>)=>{
              state.messagesByChannel[action.payload.channelId]=action.payload.messages;
            },
        addMessages:(state,action:PayloadAction<Message>)=>{
            const channelId= action.payload.channelId;
            if(!state.messagesByChannel[channelId]){
                state.messagesByChannel[channelId]=[];
            }
            state.messagesByChannel[channelId].push(action.payload);
        },
        setUserTyping:(
            state,
            action:PayloadAction<{channelId:string ; email:string}>)=>{
                const {channelId ,email}= action.payload;
                if(!state.typingUsers[channelId]){
                    state.typingUsers[channelId]=[];
                }
                if(!state.typingUsers[channelId].includes(email)){
                    state.typingUsers[channelId].push(email);
                }
            },
        
        clearUserTyping:(
            state,
            action: PayloadAction<{channelId:string ; email:string}>)=>{
                const {channelId , email}= action.payload;
                if(state.typingUsers[channelId]){
                    state.typingUsers[channelId]=state.typingUsers[channelId].filter((e)=>e!==email);
                }
            },
        },
    });


    export  const {setActiveChannel, setMessages, setUserTyping, addMessages, clearUserTyping}= chatSlice.actions;
    export  default chatSlice.reducer;