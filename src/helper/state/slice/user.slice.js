import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    role: "",
    name: "",
  },
  reducers: {
    changeRole: (state, action) => {
      state.name = action.payload.name;
      state.role = action.payload.role;
    },
  },
});

export const { changeRole } = userSlice.actions;

export default userSlice.reducer;
