import Cookies from 'js-cookie';
import router from 'next/router';
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mainUser: {
    id:"",
    name: "",
    email: "",
    role:'',
    photo:'',
    token:{
      accessToken:'',
      refreshToken:''
    }
  },
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // Action to set the authentication status
    setUserState(state, action) {
      state.mainUser = action.payload;
    },
    setLogout(state, action) {
      state.mainUser = action.payload;
      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');
      Cookies.remove('id');
      router.push('/');

    }
  },
});

export const { setUserState, setLogout } = userSlice.actions;
export default userSlice;