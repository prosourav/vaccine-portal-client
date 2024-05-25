export const routes =  Object.freeze(
  {
    protected:["/","/appointment", "/availability", "/vaccines", "/users", '/support','/profile', '/feedbacks',], 
    auth:['/auth/login', '/auth/register']
  }
  );

export const defaultValues = {
    email: "",
    password: "",
};