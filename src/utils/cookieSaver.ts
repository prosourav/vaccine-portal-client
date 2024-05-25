import Cookies from 'js-cookie';

const saveCookies = ({id, atoken, rtoken}: Record<string, string>):void =>{
  Cookies.set("id",id);
  Cookies.set("accessToken", atoken);
  Cookies.set("refreshToken", rtoken);
};

export default saveCookies;