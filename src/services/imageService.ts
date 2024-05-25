import { ImageType } from "@/types/Profile";
import requests from "./http";


class ImageService {

  getImageUrl(type: string){
    return requests.get('/image_url',{
      params: {
        type: type // Assuming type is the name of the query parameter
      },
    })
  };

  uploadImage(img: ImageType ){
    return requests.put(img?.url.toString(), img.file as File, {
      headers: {
        'Content-Type': img.type
    }
    })
  }

};

export default new ImageService();