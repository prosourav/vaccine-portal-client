export const routes = Object.freeze(
  {
    protected: ["/", "", "/appointment", "/availability", "/vaccine", "/users", '/chat', '/profile', '/feedback',],
    auth: ['/auth/login', '/auth/register']
  }
);

export const defaultValues = {
  email: "",
  password: "",
};