
import requests from "./http";


class VaccineService {
    
  getVaccines(query: string) {
    return requests.get(query ? `/vaccines${query}` : 'vaccines'); 
  };

  addVaccine(payload: Record<string, string>){
    return requests.post('/vaccines', payload);
  };

};

export default new VaccineService();