import React from "react";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import getCurrentUser from "./customHooks/getCurrentUser";
import { useSelector } from "react-redux";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import { Navigate } from "react-router-dom";
import getOtherUsers from "./customHooks/getOtherUsers";
import { useEffect } from "react";
import { io } from "socket.io-client";
import { serverUrl } from "./main";
import { useDispatch } from "react-redux";
import {
  setSocket,
  setOnlineUsers,
  setOtherUsers,
  incrementUnread,
  clearUnread,
} from "./redux/userSlice";
import { setMessages } from "./redux/messageSlice";
import axios from "axios";

function App() {
  getCurrentUser();
  getOtherUsers();
  let {
    userData,
    socket,
    onlineUsers,
    otherUsers,
    selectedUser,
    unreadMessages,
  } = useSelector((state) => state.user);
  let { messages } = useSelector((state) => state.message);
  let dispatch = useDispatch();

  useEffect(() => {
    if (userData) {
      const socketio = io(`${serverUrl}`, {
        query: {
          userId: userData?._id,
        },
      });
      dispatch(setSocket(socketio));

      socketio.on("getOnlineUsers", (users) => {
        dispatch(setOnlineUsers(users));
      });

      // Handle new message received
      socketio.on("newMessage", (newMessage) => {
        // Only increment unread if the message is not from the current selected user
        if (selectedUser?._id !== newMessage.sender) {
          dispatch(incrementUnread(newMessage.sender));
        }

        // Update messages if the chat is open with the sender
        if (selectedUser?._id === newMessage.sender) {
          dispatch(setMessages([...messages, newMessage]));
        }

        // Update otherUsers list to bring the sender to top
        if (otherUsers && otherUsers.length > 0) {
          const updatedUsers = [...otherUsers];
          const senderIndex = updatedUsers.findIndex(
            (user) => user._id === newMessage.sender,
          );

          if (senderIndex !== -1) {
            // Update last message for this user
            const updatedUser = {
              ...updatedUsers[senderIndex],
              lastMessage: {
                time: newMessage.createdAt || new Date(),
                preview:
                  newMessage.message || (newMessage.image ? "📷 Image" : ""),
                message: newMessage.message,
                image: newMessage.image,
              },
            };

            // Remove user from current position
            updatedUsers.splice(senderIndex, 1);
            // Add user to the top
            updatedUsers.unshift(updatedUser);

            dispatch(setOtherUsers(updatedUsers));
          } else {
            // User not in list, refresh the list
            const refreshUsers = async () => {
              try {
                const result = await axios.get(`${serverUrl}/api/user/others`, {
                  withCredentials: true,
                });
                dispatch(setOtherUsers(result.data.users));
              } catch (error) {
                console.log(error);
              }
            };
            refreshUsers();
          }
        }
      });

      return () => socketio.close();
    } else {
      if (socket) {
        socket.close();
        dispatch(setSocket(null));
      }
    }
  }, [userData, otherUsers, messages, selectedUser, dispatch]);

  return (
    <Routes>
      <Route
        path="/login"
        element={!userData ? <Login /> : <Navigate to="/" />}
      />
      <Route
        path="/signup"
        element={!userData ? <SignUp /> : <Navigate to="/profile" />}
      />
      <Route
        path="/"
        element={userData ? <Home /> : <Navigate to="/login" />}
      />
      <Route
        path="/profile"
        element={userData ? <Profile /> : <Navigate to="/signup" />}
      />
    </Routes>
  );
}

export default App;
