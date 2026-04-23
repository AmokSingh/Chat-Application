import React from 'react'
import SideBar from '../components/SideBar.jsx'
import MessageArea from '../components/MessageArea.jsx'
import getMessage from '../customHooks/getMessages.jsx'
import getOtherUsers from '../customHooks/getOtherUsers.jsx';

function Home() {
  getMessage();
  getOtherUsers();
  return (
    <div className='w-full h-[100vh] flex'>
        <SideBar />
        <MessageArea />
    </div>
  )
}

export default Home