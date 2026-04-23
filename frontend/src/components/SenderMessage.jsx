import React from 'react'

function SenderMessage({image, message}) {
  return (
    <div className="w-fit max-w-[70%] bg-[#6C63FF] px-1 py-1 mx-3 my-1 rounded-lg ml-auto gap-[10px] flex flex-col">
      {image && <img src={image} alt="" className="w-[150px] m-1" />}
      {message && <span className="m-1">{message}</span>}
    </div>
  );
}

export default SenderMessage