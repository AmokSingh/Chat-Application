import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: null,
    otherUsers: null,
    selectedUser: null,
    Socket: null,
    onlineUsers: [],
    searchData: [],
    unreadMessages: {}, // Track unread counts per user
  },
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
    setOtherUsers: (state, action) => {
      state.otherUsers = action.payload;
    },
    setSelectedUser: (state, action) => {
      // Clear unread count when opening chat with a user
      if (action.payload && state.unreadMessages[action.payload._id]) {
        state.unreadMessages[action.payload._id] = 0;
      }
      state.selectedUser = action.payload;
    },
    setSocket: (state, action) => {
      state.Socket = action.payload;
    },
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
    setSearchData: (state, action) => {
      state.searchData = action.payload;
    },
    incrementUnread: (state, action) => {
      const userId = action.payload;
      state.unreadMessages[userId] = (state.unreadMessages[userId] || 0) + 1;
    },
    clearUnread: (state, action) => {
      const userId = action.payload;
      state.unreadMessages[userId] = 0;
    },
    resetAllUnread: (state) => {
      state.unreadMessages = {};
    },
  },
});

export const {
  setUserData,
  setOtherUsers,
  setSelectedUser,
  setSocket,
  setOnlineUsers,
  setSearchData,
  incrementUnread,
  clearUnread,
  resetAllUnread,
} = userSlice.actions;

export default userSlice.reducer;
