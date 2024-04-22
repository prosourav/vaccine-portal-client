/* eslint-disable import/no-anonymous-default-export */
import formDataSignUp from "@/types/register";
import requests from "./http";
import { formDataLogin } from "@/types/login";
import { AppointmentType } from "@/types/appointment";

class AppoinmentService {

  getAvailibity() {
    return requests.get("/availability");
  };
  takeAppointment(payload: AppointmentType) {
    return requests.post(`/appointments`, payload);
  };
  getAllAppointments(query?: string) {
    return requests.get( query ? `/appointments${query}`: 'appointments' ); 
  };
  getSingleAppointment(paramId: string) {
    return requests.get( `/appointments/${paramId}`);
  };
  updateAppointment(paramId: string, payload: AppointmentType) {
    return requests.patch( `/appointments/${paramId}`, payload );
  };
  cancelAppoinment(paramId: string) {
    return requests.delete( `/appointments/${paramId}`);
  };

  updateAppointmentStatus(paramId: string) {
    return requests.patch( `/appointments/complete/${paramId}`);
  };

};

export default new AppoinmentService();