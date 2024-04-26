import { configureStore } from "@reduxjs/toolkit";
import userSlice from "../slice/user.slice";

const userStore = configureStore({
  reducer: { userSlice: userSlice },
});

export default userStore;
