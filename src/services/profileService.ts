import requests from "./http";
import { UserType, UserTypeSubmit } from "@/types/user";

class ProfileService {
  getProfile() {
    return requests.get('/users/profile'); 
  };
  patchProfile(body: UserTypeSubmit){
    return requests.patch('/users/profile',body);
  };
};

export default new ProfileService();