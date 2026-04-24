import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import dp from "../assets/profile.webp";
import { IoMdSearch } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import { RiLogoutBoxLine } from "react-icons/ri";
import axios from "axios";
import { serverUrl } from "../main";
import { useDispatch } from "react-redux";
import {
  setUserData,
  setOtherUsers,
  setSelectedUser,
  setSearchData,
} from "../redux/userSlice";
import { useNavigate } from "react-router-dom";

function SideBar() {
  let { userData, otherUsers, selectedUser, onlineUsers, searchData } =
    useSelector((state) => state.user);
  let [search, setSearch] = React.useState(false);
  let [input, setInput] = React.useState("");

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
      });
      dispatch(setUserData(null));
      dispatch(setOtherUsers([]));
      navigate("/login");
    } catch (error) {
      console.log("Error logging out:", error);
    }
  };

  const handleSearch = async () => {
    try {
      let result = await axios.get(
        `${serverUrl}/api/user/search?query=${input}`,
        {
          withCredentials: true,
        },
      );
      // Filter out the current user from search results
      const filteredUsers = result.data.users.filter(
        (user) => user._id !== userData._id,
      );
      dispatch(setSearchData(filteredUsers));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (input) {
      handleSearch();
    } else {
      dispatch(setSearchData([]));
    }
  }, [input]);

  const handleCloseSearch = () => {
    setSearch(false);
    setInput("");
    dispatch(setSearchData([]));
  };

  // Filter out current user from otherUsers list (just in case)
  const filteredOtherUsers = otherUsers?.filter(
    (user) => user._id !== userData?._id,
  );

  return (
    <div
      className={`lg:w-[30%] w-full h-full bg-slate-300 box-border lg:block ${!selectedUser ? "block" : "hidden"}`}
    >
      <div
        className="w-[6vh] h-[6vh] rounded-full bg-[#6C63FF] flex items-center justify-center overflow-hidden shadow-gray-950 shadow-lg mt-3 cursor-pointer fixed left-3 bottom-3 text-white"
        onClick={handleLogOut}
      >
        <RiLogoutBoxLine className="h-[20px] w-[20px]" />
      </div>

      <div className="w-full h-[40vh] bg-[#6C63FF] rounded-b-[30%] shadow-gray-500 shadow-lg flex flex-col justify-center px-[15px] pb-5">
        <h1 className="text-white font-bold text-[20px] pt-4">ChatSync</h1>

        <div className="w-full flex items-center justify-between mt-2">
          <h1 className="text-gray-900 font-bold text-[18px]">
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

        {/* Search Bar or Online Users Avatars */}
        <div className="w-full mt-3">
          {!search ? (
            <div className="flex items-center gap-[15px]">
              <div
                className="w-[6vh] h-[6vh] rounded-full bg-[#dfdefb] flex items-center justify-center overflow-hidden shadow-gray-950 shadow-lg cursor-pointer"
                onClick={() => setSearch(true)}
              >
                <IoMdSearch className="w-[25px] h-[25px]" />
              </div>
              <div className="flex gap-[15px] flex-1">
                {filteredOtherUsers?.map(
                  (user) =>
                    onlineUsers?.includes(user._id) && (
                      <div
                        key={user._id}
                        className="relative cursor-pointer"
                        onClick={() => dispatch(setSelectedUser(user))}
                      >
                        <div className="w-[6vh] h-[6vh] bg-white rounded-full flex items-center justify-center overflow-hidden shadow-gray-800 shadow-lg">
                          <img
                            src={user.image || dp}
                            alt="Profile"
                            className="h-[100%]"
                          />
                        </div>
                        <span className="w-[2vh] h-[2vh] rounded-full bg-[#0eff0e] absolute top-0 -right-[2px]"></span>
                      </div>
                    ),
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-[15px]">
              <div
                className="w-[6vh] h-[6vh] rounded-full bg-[#dfdefb] flex items-center justify-center overflow-hidden shadow-gray-950 shadow-lg cursor-pointer"
                onClick={handleCloseSearch}
              >
                <RxCross2 className="w-[25px] h-[25px]" />
              </div>
              <div className="flex-1">
                <form className="w-full h-[6vh] bg-[#e0dffb] shadow-gray-950 shadow-lg flex items-center gap-[10px] rounded-full overflow-hidden">
                  <IoMdSearch className="w-[30px] h-[30px] ml-[6px]" />
                  <input
                    type="text"
                    placeholder="Search User... "
                    className="w-full h-full p-[10px] outline-none border-none text-[15px] bg-[#e1e0fb]"
                    onChange={(e) => setInput(e.target.value)}
                    value={input}
                    autoFocus
                  />
                </form>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* User List - Shows search results when searching, otherwise shows otherUsers */}
      <div className="w-full h-[46vh] mt-[4vh] overflow-auto flex flex-col">
        {search ? (
          // Search Results
          searchData?.length > 0 ? (
            searchData.map((user) => (
              <div
                key={user._id}
                className="w-[100%] h-[10vh] px-5 py-8 flex items-center justify-start gap-[15px] shadow-gray-400 shadow-sm cursor-pointer hover:bg-[#6C63FF] transition duration-300"
                onClick={() => {
                  dispatch(setSelectedUser(user));
                  handleCloseSearch();
                }}
              >
                <div className="relative">
                  <div className="w-[6vh] h-[6vh] mt-3 bg-white rounded-full flex items-center justify-center overflow-hidden shadow-gray-800 shadow-lg">
                    <img
                      src={user.image || dp}
                      alt="Profile"
                      className="h-[100%]"
                    />
                  </div>
                  {onlineUsers?.includes(user._id) && (
                    <span className="w-[2vh] h-[2vh] rounded-full bg-[#0eff0e] absolute top-3 -right-[2px]"></span>
                  )}
                </div>
                <div>
                  <h1 className="text-gray-900 font-semibold text-[16px]">
                    {user.name || user.userName}
                  </h1>
                  {user.bio && (
                    <p className="text-gray-500 text-[12px] mt-1">{user.bio}</p>
                  )}
                </div>
              </div>
            ))
          ) : input ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500 text-center">No users found</p>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500 text-center">
                Type to search users...
              </p>
            </div>
          )
        ) : (
          // Regular Users List
          filteredOtherUsers?.map((user) => (
            <div
              key={user._id}
              className="w-[100%] h-[10vh] px-5 py-8 flex items-center justify-start gap-[15px] shadow-gray-400 shadow-sm cursor-pointer hover:bg-[#6C63FF] transition duration-300 group"
              onClick={() => dispatch(setSelectedUser(user))}
            >
              <div className="relative">
                <div className="w-[6vh] h-[6vh] mt-3 bg-white rounded-full flex items-center justify-center overflow-hidden shadow-gray-800 shadow-lg">
                  <img
                    src={user.image || dp}
                    alt="Profile"
                    className="h-[100%]"
                  />
                </div>
                {onlineUsers?.includes(user._id) && (
                  <span className="w-[2vh] h-[2vh] rounded-full bg-[#0eff0e] absolute top-3 -right-[2px]"></span>
                )}
              </div>
              <div>
                <h1 className="text-gray-900 font-semibold text-[16px]">
                  {user.name || user.userName}
                </h1>
                {onlineUsers?.includes(user._id) && (
                  <p className="text-green-600 text-[12px] mt-1 group-hover:text-green-300 transition duration-300">
                    Online
                  </p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default SideBar;
