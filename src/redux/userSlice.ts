import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mainUser: {
    name: "",
    email: "",
    role:'',
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
  },
});

export const { setUserState } = userSlice.actions;
export default userSlice;