import React from 'react'

function ReceiverMessage({image, message}) {
  return (
    <div className="w-fit max-w-[70%] bg-[#c7c7c7] px-3 py-1 mx-3 my-1 rounded-lg gap-[10px] flex flex-col">
      {image && <img src={image} alt="" className="w-[150px] m-1" />}
      {message && <span className="m-1">{message}</span>}
    </div>
  );
}

export default ReceiverMessage