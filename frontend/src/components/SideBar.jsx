import React from "react";
import { useSelector } from "react-redux";
import dp from "../assets/profile.webp";
import { IoMdSearch } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";

function SideBar() {
  let { userData } = useSelector((state) => state.user);
  let [search, setSearch] = React.useState(false);
  return (
    <div className="lg:w-[30%] w-full h-full bg-slate-300">
      <div className="w-full h-[240px] bg-[#6C63FF] rounded-b-[30%] shadow-gray-500 shadow-lg flex flex-col justify-center px-[15px]">
        <h1 className="text-white font-bold text-[20px] ">ChatSync</h1>

        <div className="w-full flex items-center justify-between ">
          <h1 className="text-gray-900 font-bold text-[18px] ">
            Hey , {userData.name}
          </h1>
          <div className="w-[8vh] h-[8vh] rounded-full flex items-center justify-center overflow-hidden shadow-gray-800 shadow-lg">
            <img
              src={userData.image || dp}
              alt="Profile"
              className="h-[100%]"
            />
          </div>
        </div>

        <div>
          {!search && (
            <div
              className="w-[6vh] h-[6vh] rounded-full bg-white flex items-center justify-center overflow-hidden shadow-gray-950 shadow-lg mt-3 cursor-pointer"
              onClick={() => setSearch(true)}
            >
              <IoMdSearch className="w-[25px] h-[25px]" />
            </div>
          )}
          {search && (
            <form className="w-full h-[6vh] bg-white shadow-gray-950 shadow-lg flex items-center gap-[10px] rounded-full overflow-hidden mt-4">
              <IoMdSearch className="w-[30px] h-[30px] ml-[6px]" />
              <input
                type="text"
                placeholder="Search User... "
                className="w-full h-full p-[10px] outline-none border-none text-[15px]"
              />
              <RxCross2
                className="w-[20px] h-[20px] mr-[6px] cursor-pointer"
                onClick={() => setSearch(false)}
              />
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default SideBar;
