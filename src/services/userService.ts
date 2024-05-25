import requests from "./http";
import { UserType, UserTypeSubmit } from "@/types/user";

class UserService {
  getUsers(query: string) {
    return requests.get(query ? `/users${query}` : 'users'); 
  };
  getSingleUser(id: string) {
    return requests.get(`/users/${id}`);
  };
  deleteUser(id: string) {
    return requests.delete(`/users/${id}`);
  };
  updateUser(id: string, payload:UserType){
    return requests.patch(`/users/${id}`, payload);
  };
  createUser(payload:UserTypeSubmit){
    return requests.post('/users',payload);
  };
  changeAdmin(id: string){
    return requests.patch(`/change_admin/${id}`);
  };

};

export default new UserService();