/* eslint-disable import/no-anonymous-default-export */
import formDataSignUp from "@/types/register";
import requests from "./http";
import { formDataLogin } from "@/types/login";

class AuthService {
  register(payload: formDataSignUp){
    return requests.post("/auth/register", payload);
  }
  verify(payload: string, signal: Record<string, unknown> = {}){
    return requests.get(`/auth/verify/${payload}`);
  }
  login(payload: formDataLogin) {
    return requests.post("/auth/login", payload);
  }
  logout(id: string){
    return requests.delete(`/auth/logout?id=${id}`);
  }
};

export default new AuthService();
