export const routes =  Object.freeze(
  {
    protected:["/","/appointment", "/availability"], 
    auth:['/auth/login', '/auth/register']
  }
  );

export const defaultValues = {
    email: "",
    password: "",
};