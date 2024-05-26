export const routes =  Object.freeze(
  {
    protected:["/","/appointment", "/availability", "/vaccine", "/users", '/chat','/profile', '/feedbacks',], 
    auth:['/auth/login', '/auth/register']
  }
  );

export const defaultValues = {
    email: "",
    password: "",
};