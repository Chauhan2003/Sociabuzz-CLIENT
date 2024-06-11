import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import postSlice from "./postSlice";
import notificationSlice from "./notificationSlice";

const store = configureStore({
    reducer: {
        user: userSlice,
        post: postSlice,
        notification: notificationSlice
    }
})

export default store;