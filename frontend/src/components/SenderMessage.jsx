import React from "react";
import Profile from "../pages/Profile";
import { useSelector } from "react-redux";

function SenderMessage({ image, message, onImageLoad }) {
  let { userData } = useSelector((state) => state.user);
  return (
    <div className="w-full flex justify-end items-end gap-1 mb-2 px-2">
      {/* Message bubble */}
      <div className="w-fit max-w-[70%] bg-[#6C63FF] p-1 rounded-lg rounded-tr-none flex flex-col">
        {image && (
          <img
            src={image}
            alt=""
            className="w-[150px] m-1 rounded-md"
            onLoad={onImageLoad}
          />
        )}
        {message && <span className="m-1 text-white">{message}</span>}
      </div>

      {/* Profile image */}
      <div className="w-[3vh] h-[3vh] bg-white rounded-full overflow-hidden shadow-gray-500 shadow-lg cursor-pointer flex-shrink-0 mb-1">
        <img
          src={userData.image || Profile}
          alt=""
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}

export default SenderMessage;
