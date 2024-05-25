import { ChatUsersType } from "@/types/Chat";

export function findOnlineStatus(users: ChatUsersType[], online:ChatUsersType[], email: string){
    const onlineIds = new Set(online.map(user => user.id));
    return users?.map(user => ({
      ...user,
      online: onlineIds.has(user?.id) ? true : false
    })).filter(userData => userData.email !== email);
  };