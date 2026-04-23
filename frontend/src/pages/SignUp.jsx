import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../main.jsx";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice.js";


function SignUp() {
  let navigate = useNavigate();
  let [show, setShow] = React.useState(false);

  let [userName, setUserName] = React.useState("");
  let [email, setEmail] = React.useState("");
  let [password, setPassword] = React.useState("");
  let [loading, setLoading] = React.useState(false);
  let [error, setError] = React.useState("");

  const dispatch = useDispatch();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let result = await axios.post(
        `${serverUrl}/api/auth/signup`,
        {
          userName,
          email,
          password,
        },
        { withCredentials: true },
      );

      dispatch(setUserData(result.data));
      navigate("/profile");

      setUserName("");
      setEmail("");
      setPassword("");
      setLoading(false);
      setError("");

    } catch (error) {
      console.error(error);
      setLoading(false);
      setError(error.response.data.message);
    }
  };

  return (
    <div className="w-full h-[100vh] bg-slate-200 flex items-center justify-center">
      <div className="w-full max-w-[350px] h-[85vh] bg-white rounded-lg shadow-gray-400 shadow-lg flex flex-col gap-[10px]">
        <div className="w-full h-[25vh] bg-[#6C63FF] rounded-b-[30%] shadow-gray-400 shadow-lg flex items-center justify-center">
          <h1 className="text-gray-900 text-[20px] font-bold">
            Welcome to <span className="text-white">ChatSync</span>
          </h1>
        </div>

        <form
          className="w-full h-[55vh] flex flex-col gap-[2.5vh] pt-[3vh] items-center"
          onSubmit={handleSignUp}
        >
          <input
            className="w-[85%] h-[7vh] outline-none border-2 border-[#6C63FF] px-[10px] py-[15px] rounded-lg bg-white shadow-gray-400 shadow-lg"
            type="text"
            placeholder="username"
            onChange={(e) => setUserName(e.target.value)}
            value={userName}
          />
          <input
            className="w-[85%] h-[7vh] outline-none border-2 border-[#6C63FF] px-[10px] py-[15px] rounded-lg bg-white shadow-gray-400 shadow-lg"
            type="email"
            placeholder="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
          <div className="w-[85%] h-[7vh] border-2 border-[#6C63FF] rounded-lg overflow-hidden shadow-gray-400 shadow-lg relative">
            <input
              className="w-full h-full outline-none px-[10px] py-[15px]  bg-white "
              type={`${show ? "text" : "password"}`}
              placeholder="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
            <span
              className="absolute top-[1vh] right-[1vw] text-blue-500 cursor-pointer font-semibold"
              onClick={() => setShow(!show)}
            >
              {show ? "hide" : "show"}
            </span>
          </div>
          <button className="w-[30%] bg-[#6C63FF] text-gray-900 font-bold py-[8px] mt-[2vh] rounded-xl shadow-lg shadow-gray-400 hover:shadow-inner transition duration-300" disabled={loading}>
            {loading ? "Signing Up..." : "Sign Up"}
          </button>

          {error && <p className="text-red-500 font-semibold">*{error}</p>}

          <p>
            Already Have An Account ?{" "}
            <span
              className="text-blue-500 text-bold cursor-pointer"
              onClick={() => navigate("/login")}
            >
              Login
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
