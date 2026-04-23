import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import getCurrentUser from './customHooks/getCurrentUser'
import { useSelector } from 'react-redux'
import Home from './pages/Home'
import Profile from './pages/Profile'
import { Navigate } from 'react-router-dom'
import getOtherUsers from './customHooks/getOtherUsers'
import { useEffect } from 'react'
import { io } from 'socket.io-client'
import { serverUrl } from './main'
import { useDispatch } from 'react-redux'
import { setSocket, setOnlineUsers } from './redux/userSlice'

function App() {
  getCurrentUser() // Custom hook to fetch current user data on app load
  getOtherUsers() // Custom hook to fetch other users data on app load
  let {userData, socket, onlineUsers} = useSelector((state) => state.user)
  let dispatch = useDispatch()

  useEffect(() => {
    if(userData) {
      const socketio = io(`${serverUrl}`, {
        query: {
          userId: userData?._id,
        },
      });
      dispatch(setSocket(socketio));

      socketio.on("getOnlineUsers", (users) => {
        dispatch(setOnlineUsers(users));
      });

      return () => socket.close();
    }
     else {
      if(socket) {
        socket.close();
        dispatch(setSocket(null));
      }
    }
  },[userData])

  return (
    <Routes>
      <Route path="/login" element={!userData ? <Login /> : <Navigate to="/" />} />
      <Route path="/signup" element={!userData ? <SignUp /> : <Navigate to="/profile" />} />
      <Route path="/" element={userData ? <Home /> : <Navigate to = "/login" />} />
      <Route path="/profile" element={userData ? <Profile /> : <Navigate to = "/signup" />} />
    </Routes>
  )
}

export default App