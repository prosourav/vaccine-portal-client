import { Dispatch, SetStateAction } from "react";
import { UserType } from "./user";



export type DefaultEventsMap = {
  [key: string]: (...args: any[]) => void;
};

export interface ChatUsersType{
    email: string;
    name: string;
    id: string;
    createdAt?:string;
    link?: string;
    role: "user" | "admin" | "doctor";
    status?: "approved" |"pending" | "block"
    updatedAt?: string
    vaccines?: [string]
    token?: string
    online?: boolean
}

export interface PaginationType {
    limit: number | string,
    page: string|number,
    totalItems: string,
    totalPage: string
    sort_type: string,
    sort_by: string,
    search?: string,
    name?: string
    status: string
    next?: number,
    prev?:number,
  }

  export interface ConversationType {
    senderId: string
    receiverId: string
  };


export interface ChatUsersPropType {
  setConversation?: Dispatch<SetStateAction<ConversationType>>;
  setChatWith: Dispatch<SetStateAction<ChatUsersType>>
};

export interface MessageType{
  conversationId: string
  senderId:string
  receiverId: string
  text?: string
  type?: string
  createdAt?: string;
}