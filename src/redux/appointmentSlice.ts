import { createSlice } from "@reduxjs/toolkit";

const initialState = {
 operation:false
};

const appointmentSlice = createSlice({
  name: "appointment",
  initialState,
  reducers: {
    // Action to set the authentication status
    setAppointmentState(state, action) {
      state.operation = action.payload;
    },
  },
});

export const { setAppointmentState } = appointmentSlice.actions;
export default appointmentSlice;