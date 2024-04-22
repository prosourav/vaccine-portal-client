import requests from "./http";
import { UserType, UserTypeSubmit } from "@/types/user";

class ProfileService {
  getProfile() {
    return requests.get('/users/profile'); 
  };
  patchProfile(query: string){
    return 
  };

};

export default new ProfileService();