import axios from "axios";
import requests from "./http";
import { UserTypeSubmit } from "@/types/user";

class ProfileService {

  getProfile() {
    return requests.get('/users/profile'); 
  };

  patchProfile(payload: UserTypeSubmit){
    return requests.patch('/users/profile',payload);
  };

  generatePdf(payload: UserTypeSubmit){
    return requests.post('generate_certificate',payload, {  responseType: 'arraybuffer' });
  };
};

export default new ProfileService();