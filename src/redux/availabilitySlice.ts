import { createSlice } from "@reduxjs/toolkit";

const initialState = {
 availability:[]
};

const availabilitySlice = createSlice({
  name: "availability",
  initialState,
  reducers: {
    // Action to set the authentication status
    setAvailabilityState(state, action) {
      state.availability = action.payload;
    },
  },
});

export const { setAvailabilityState } = availabilitySlice.actions;
export default availabilitySlice;