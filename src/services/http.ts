import saveCookies from '@/utils/cookieSaver';
import axios, { AxiosHeaderValue, AxiosResponse, HeadersDefaults } from 'axios';
import Cookies from 'js-cookie';
import { redirect } from 'next/dist/server/api-utils';
import { NextResponse } from 'next/server';

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
    // Dispatch any action on success
    return response;
  },
  async function (error) {
    if (error.response && error.response.status === 401) {
      // Token error, try refreshing the token
      try {
        const refreshToken = Cookies.get("refreshToken");
        const id = Cookies.get("id");
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_APP_API_ENDPOINT}/${process.env.NEXT_PUBLIC_APP_API_VERSION}/auth/refresh`,
          { id,refreshToken }
        );

        const newAccessToken = response.data.data.token.accessToken;

        // Update the stored access token
        saveCookies({id:response.data.data.id, atoken:response.data.data.token.accessToken, rtoken: response.data.data.token.refreshToken})

        // Retry the original request with the new access token
        const originalRequest = error.config;
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axios(originalRequest);
      } catch (refreshError) {
        // Refresh token failed, redirect to login or handle accordingly
        // console.log("Refresh token failed", refreshError);
        //  window.location.href = '/auth/login';
        // return NextResponse.redirect('/auth/login')
        // You may want to redirect to login or show an error message
        // Redirect to login page: window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);





const responseBody = (response: AxiosResponse) => response.data;

const requests = {
  get: (url: string) => instance.get(url).then(responseBody),
  post: (url: string, body?: object) => instance.post(url, body).then(responseBody),
  patch: (url: string, body?: object) => instance.patch(url, body).then(responseBody),
  delete: (url: string) => instance.delete(url).then(responseBody),
};

export default requests;
