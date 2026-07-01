import axiosInstance from './axiosInstance';

export async function createWorkspaceApi(name:string){
    const response = await axiosInstance.post("/api/workspaces",{name});
    return response.data;
}

export async function joinWorkspaceApi(workspaceId:string){
    const response= await axiosInstance.post(`/api/workspaces/${workspaceId}/join`);
    return response.data;
}

export async function getChannelsApi(workspaceId:string){
    const response= await axiosInstance.get(`/api/workspaces/${workspaceId}/channels`);
    return response.data;
}

export async function createChannelApi(workspaceId:string, name:string){
    const response= await axiosInstance.post(`/api/workspaces/${workspaceId}/channels`,{name});
    return response.data;
}

export async function getMessagesApi(workspaceId:string, channelId:string){
    const response= await axiosInstance.get(`/api/workspaces/${workspaceId}/channels/${channelId}/messages`);
    return response.data;
}