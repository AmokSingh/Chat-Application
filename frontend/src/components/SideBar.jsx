import React from "react";
import { useSelector } from "react-redux";
import dp from "../assets/profile.webp";
import { IoMdSearch } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import { RiLogoutBoxLine } from "react-icons/ri";
import axios from "axios";
import { serverUrl } from "../main";
import { useDispatch } from "react-redux";
import { setUserData, setOtherUsers, setSelectedUser } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";

function SideBar() {
  let { userData, otherUsers, selectedUser } = useSelector((state) => state.user);
  let [search, setSearch] = React.useState(false);

  let dispatch = useDispatch();
  let navigate = useNavigate();

  if (!userData) {
    return (
      <div
        className={`lg:w-[30%] w-full h-full bg-slate-300 box-border lg:block ${!selectedUser ? "block" : "hidden"}`}
      >
        <div className="w-full h-full flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6C63FF]"></div>
        </div>
      </div>
    );
  }
  
  const handleLogOut = async () => {
    try {
      let result = await axios.get(`${serverUrl}/api/auth/logout`, {
        withCredentials: true,
      })
      dispatch(setUserData(null));
      dispatch(setOtherUsers([]));
      navigate("/login")
    } catch (error) {
      console.log("Error logging out:", error);
    }
  }
  return (
    <div className={`lg:w-[30%] w-full h-full bg-slate-300 box-border lg:block ${!selectedUser?"block": "hidden"}`}>
      <div
        className="w-[6vh] h-[6vh] rounded-full bg-[#6C63FF] flex items-center justify-center overflow-hidden shadow-gray-950 shadow-lg mt-3 cursor-pointer fixed left-3 bottom-3 text-white"
        onClick={handleLogOut}
      >
        <RiLogoutBoxLine className="h-[20px] w-[20px]" />
      </div>

      <div className="w-full h-[40vh] bg-[#6C63FF] rounded-b-[30%] shadow-gray-500 shadow-lg flex flex-col justify-center px-[15px]">
        <h1 className="text-white font-bold text-[20px] ">ChatSync</h1>

        <div className="w-full flex items-center justify-between ">
          <h1 className="text-gray-900 font-bold text-[18px] ">
            Hey , {userData.name || "User"}
          </h1>
          <div
            className="w-[8vh] h-[8vh] bg-white rounded-full flex items-center justify-center overflow-hidden shadow-gray-800 shadow-lg cursor-pointer"
            onClick={() => navigate("/profile")}
          >
            <img
              src={userData.image || dp}
              alt="Profile"
              className="h-[100%]"
            />
          </div>
        </div>

        <div className="w-full flex items-center gap-[15px]">
          {!search && (
            <div
              className="w-[6vh] h-[6vh] rounded-full bg-[#dfdefb] flex items-center justify-center overflow-hidden shadow-gray-950 shadow-lg mt-3 cursor-pointer"
              onClick={() => setSearch(true)}
            >
              <IoMdSearch className="w-[25px] h-[25px]" />
            </div>
          )}
          {search && (
            <form className="w-full h-[6vh] bg-[#e0dffb] shadow-gray-950 shadow-lg flex items-center gap-[10px] rounded-full overflow-hidden mt-4">
              <IoMdSearch className="w-[30px] h-[30px] ml-[6px]" />
              <input
                type="text"
                placeholder="Search User... "
                className="w-full h-full p-[10px] outline-none border-none text-[15px] bg-[#e1e0fb]"
              />
              <RxCross2
                className="w-[20px] h-[20px] mr-[6px] cursor-pointer"
                onClick={() => setSearch(false)}
              />
            </form>
          )}

          {!search &&
            otherUsers?.map((user) => (
              <div
                key={user._id}
                className="w-[6vh] h-[6vh] mt-3 bg-white rounded-full flex items-center justify-center overflow-hidden shadow-gray-800 shadow-lg"
              >
                <img
                  src={user.image || dp}
                  alt="Profile"
                  className="h-[100%]"
                />
              </div>
            ))}
        </div>
      </div>

      <div className="w-full h-[55vh] mt-[4vh] overflow-auto flex flex-col ">
        {otherUsers?.map((user) => (
          <div
            key={user._id}
            className="w-[100%] h-[10vh] px-5 py-8 flex items-center justify-start gap-[15px]  shadow-gray-400 shadow-sm cursor-pointer hover:bg-[#6C63FF] transition duration-300"
            onClick={() => dispatch(setSelectedUser(user))}
          >
            <div className="w-[6vh] h-[6vh] bg-whit rounded-full flex items-center justify-center overflow-hidden shadow-gray-700 shadow-lg">
              <img src={user.image || dp} alt="Profile" className="h-[100%]" />
            </div>
            <h1 className="text-gray-900 font-semibold text-[16px] ">
              {user.name || user.userName}
            </h1>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SideBar;
