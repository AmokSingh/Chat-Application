import { createSlice } from "@reduxjs/toolkit";
import { Socket } from "socket.io-client";

const userSlice = createSlice({
    name: "user",
    initialState: {
        userData: null,
        otherUsers: null,
        selectedUser: null,
        Socket: null,
        onlineUsers: [],
    },
    reducers: {
        setUserData: (state, action) => {
            state.userData = action.payload;
        },
        setOtherUsers: (state, action) => {
            state.otherUsers = action.payload;
        },
        setSelectedUser: (state, action) => {
            state.selectedUser = action.payload;
        },
        setSocket: (state, action) => {
            state.Socket = action.payload;
        },
        setOnlineUsers: (state, action) => {
            state.onlineUsers = action.payload;
        },
    },
});
export const { setUserData, setOtherUsers, setSelectedUser, setSocket, setOnlineUsers } = userSlice.actions;
export default userSlice.reducer;