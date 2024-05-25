import requests from "./http";


class ReviewService {
    
  getReviews(query: string) {
    return requests.get(query ? `/reviews${query}` : 'vaccines'); 
  };

  addReview(payload: Record<string, string>){
    return requests.post('/reviews', payload); 
  };

  editReview(id: string, payload: Record<string, string>){
    return requests.patch(`/reviews/${id}`, payload);
  };

  deleteReview(id: string){
    return requests.delete(`/reviews/${id}`);
  }

};

export default new ReviewService();