import React from "react";
import { useSelector } from "react-redux";
import Profile from "../assets/profile.webp";

function ReceiverMessage({ image, message, onImageLoad }) {
  let { selectedUser } = useSelector((state) => state.user);
  return (
    <div className="w-full flex  justify-start items-end gap-1 mb-2 px-2">

      <div className="w-[3vh] h-[3vh] bg-white rounded-full overflow-hidden shadow-gray-500 shadow-lg cursor-pointer flex-shrink-0 mb-1">
        <img
          src={selectedUser.image || Profile}
          alt=""
          className="w-full h-full object-cover"
        />
      </div>

      <div className="w-fit max-w-[70%] bg-[#c7c7c7] p-1 rounded-lg gap-[10px] flex flex-col">
        {image && (
          <img
            src={image}
            alt=""
            className="w-[150px] m-1"
            onLoad={onImageLoad}
          />
        )}
        {message && <span className="m-1">{message}</span>}
      </div>
    
    </div>
  );
}

export default ReceiverMessage;
