import saveCookies from '@/utils/cookieSaver';
import axios, { AxiosHeaderValue, AxiosResponse, HeadersDefaults } from 'axios';
import Cookies from 'js-cookie';
import { setAvailabilityState } from '@/redux/availabilitySlice';
import { store } from '@/redux/store';
import { setLogout } from '@/redux/userSlice';

const instance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_APP_API_ENDPOINT}/${process.env.NEXT_PUBLIC_APP_API_VERSION}`
});

instance.defaults.headers.post["Content-Type"] = "application/json";
instance.defaults.headers["Accept"] = "application/json";
instance.defaults.timeout = 15000,

  instance.interceptors.request.use(
    function (config) {
      // Do something before request is sent
      const accessToken = Cookies.get("accessToken");
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    },
    function (error) {
      // Do something with request error
      return Promise.reject(error);
    }
  );


instance.interceptors.response.use(
  function (response) {
    return response;
  },
  async function (error) {
    if (error.response && error.response.status === 401) {
      try {
        const refreshToken = Cookies.get("refreshToken");
        const id = Cookies.get("id");
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_APP_API_ENDPOINT}/${process.env.NEXT_PUBLIC_APP_API_VERSION}/auth/refresh`,
          { id, refreshToken }
        );

        const newAccessToken = response.data.data.token.accessToken;

        // Update the stored access token
        saveCookies({ id: response.data.data.id, atoken: response.data.data.token.accessToken, rtoken: response.data.data.token.refreshToken })

        // Retry the original request with the new access token
        const originalRequest = error.config;
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axios(originalRequest);
      } catch (refreshError) {
        store.dispatch(setLogout({}));
        store.dispatch(setAvailabilityState({}));
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);






const responseBody = (response: AxiosResponse) => response.data;

const requests = {
  get: (url: string, option?: any ) => instance.get(url, option).then(responseBody),
  post: (url: string, body?: object, option? :object) => instance.post(url, body, option).then(responseBody),
  patch: (url: string, body?: object) => instance.patch(url, body).then(responseBody),
  put: (url: string, body?: File, header?: object) => axios.put(url, body, header).then(responseBody),
  delete: (url: string) => instance.delete(url).then(responseBody),
};

export default requests;
