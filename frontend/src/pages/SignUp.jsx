import React from "react";
import { useNavigate } from "react-router-dom";

function SignUp() {
    let navigate = useNavigate();
  return (
    <div className="w-full h-[100vh] bg-slate-200 flex items-center justify-center">
      <div className="w-full max-w-[350px] h-[85vh] bg-white rounded-lg shadow-gray-400 shadow-lg flex flex-col gap-[10px]">
        <div className="w-full h-[25vh] bg-[#6C63FF] rounded-b-[30%] shadow-gray-400 shadow-lg flex items-center justify-center">
          <h1 className="text-gray-900 text-[20px] font-bold">
            Welcome to <span className="text-white">ChatSync</span>
          </h1>
        </div>

        <form className="w-full h-[55vh] flex flex-col gap-[3vh] pt-[4vh] items-center">
          <input
            className="w-[85%] h-[7vh] outline-none border-2 border-[#6C63FF] px-[10px] py-[15px] rounded-lg bg-white shadow-gray-400 shadow-lg"
            type="text"
            placeholder="username"
          />
          <input
            className="w-[85%] h-[7vh] outline-none border-2 border-[#6C63FF] px-[10px] py-[15px] rounded-lg bg-white shadow-gray-400 shadow-lg"
            type="email"
            placeholder="email"
          />
          <input
            className="w-[85%] h-[7vh] outline-none border-2 border-[#6C63FF] px-[10px] py-[15px] rounded-lg bg-white shadow-gray-400 shadow-lg"
            type="password"
            placeholder="password"
          />
          <button className="w-[30%] bg-[#6C63FF] text-gray-900 font-bold py-[8px] mt-[3vh] rounded-xl shadow-lg shadow-gray-400 hover:shadow-inner transition duration-300">
            Sign Up
          </button>
          <p>Already Have An Account ? <span className="text-blue-500 text-bold cursor-pointer" onClick={() => navigate("/login")}>
            Login
          </span></p>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
