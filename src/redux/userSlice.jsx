import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",
    initialState: {
        authUser: null,
        suggestedUsers: [],
        userProfile: null
    },
    reducers: {
        setAuthUser: (state, action) => {
            state.authUser = action.payload
        },
        setSuggestedUsers: (state, action) => {
            state.suggestedUsers = action.payload
        },
        setUserProfile: (state, action) => {
            state.userProfile = action.payload
        }
    }
})

export const {
    setAuthUser,
    setSuggestedUsers,
    setUserProfile
} = userSlice.actions;
export default userSlice.reducer;