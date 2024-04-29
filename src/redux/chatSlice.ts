import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
    online: [],
    typing: [],
    lastChat: null,
};

const chatSlice = createSlice({
  name: "ChatUsers",
  initialState,
  reducers: {
    // Action to set the authentication status
    setChatState(state, action) {
      return {
        ...state,
        ...action.payload // Merge the payload with the current state
      };
    },
  },
});

export const { setChatState } = chatSlice.actions;
export default chatSlice;