
import { ConversationType, MessageType } from "@/types/Chat";
import requests from "./http";


class ChatService {

  getAdminDetails(){
    return requests.get('/admin/details');
  }
    
  addConversation(payload: ConversationType) {
    return requests.post('/conversations/add', payload); 
  };

  getConversation(payload: ConversationType){
    return requests.post('/conversations/get', payload);
  };


  getMessage(id: string){
    return requests.get(`/messages/${id}`);
  }

  sendMessage(payload: MessageType){
    return requests.post('/messages', payload);
  };

};

export default new ChatService();