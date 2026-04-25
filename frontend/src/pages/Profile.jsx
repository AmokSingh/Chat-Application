import React from "react";
import profile from "../assets/profile.webp";
import { useDispatch } from "react-redux";
import axios from "axios";
import { serverUrl } from "..//main.jsx";
import { useSelector } from "react-redux";
import { GoHome } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import { setUserData } from "../redux/userSlice";

function Profile() {
  let { userData } = useSelector((state) => state.user);
  const navigate = useNavigate();
  let dispatch = useDispatch();

  let [name, setName] = React.useState("");
  let [frontendImage, setFrontendImage] = React.useState(profile);
  let [backendImage, setBackendImage] = React.useState(null);

  let image = React.useRef();
  let [saving, setSaving] = React.useState(false);

  // Update local state when userData loads/changes
  React.useEffect(() => {
    if (userData) {
      setName(userData.name || "");
      setFrontendImage(userData.image || profile);
    }
  }, [userData]);

  const handleImage = (e) => {
    let file = e.target.files[0];
    if (file) {
      setFrontendImage(URL.createObjectURL(file));
      setBackendImage(file);
    }
  };

  const handleProfile = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      let formData = new FormData();
      formData.append("name", name);
      if (backendImage) {
        formData.append("image", backendImage);
      }

      // Update profile
      await axios.put(`${serverUrl}/api/user/profile`, formData, {
        withCredentials: true,
      });

      // ✅ Fetch fresh user data after update
      const userResult = await axios.get(`${serverUrl}/api/user/current`, {
        withCredentials: true,
      });

      dispatch(setUserData(userResult.data.user));
      setSaving(false);
      navigate("/"); // Redirect to home
    } catch (error) {
      console.error("Error updating profile:", error);
      setSaving(false);
    }
  };

  return (
    <div className="w-full h-[100vh] bg-slate-200 flex items-center justify-center flex-col gap-[5vh] relative">
      <nav className="bg-slate-100 w-full h-[8vh]">
        <div
          className="fixed top-3 left-5 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <GoHome className="h-[25px] w-[25px]" />
        </div>
      </nav>
      <div
        className="w-[150px] h-[150px] min-h-[150px] min-w-[150px] bg-white rounded-full border-4 border-[#6C63FF] shadow-gray-400 shadow-lg overflow-hidden relative"
        onClick={() => image.current.click()}
      >
        <div className="w-[100%] h-[100%] flex items-center justify-center">
          <img
            src={frontendImage}
            alt="Profile"
            className="h-[100%] rounded-full object-cover"
          />
        </div>
      </div>

      <form
        className="w-[90%] h-[55vh] max-w-[400px] flex flex-col gap-[3vh] pt-[3vh] items-center"
        onSubmit={handleProfile}
      >
        <input
          type="file"
          accept="image/*"
          ref={image}
          hidden
          onChange={handleImage}
        />

        <input
          type="text"
          placeholder="Enter your name"
          className="w-[85%] h-[7vh] outline-none border-2 border-[#6C63FF] px-[10px] py-[15px] rounded-lg bg-white shadow-gray-400 shadow-lg"
          value={name}
          onChange={(e) => setName(e.target.value.slice(0, 20))}
        />

        <input
          type="text"
          readOnly
          className="w-[85%] h-[7vh] outline-none border-2 border-[#6C63FF] px-[10px] py-[15px] rounded-lg bg-white shadow-gray-400 shadow-lg text-gray-500"
          value={userData?.userName || ""}
        />

        <input
          type="email"
          readOnly
          className="w-[85%] h-[7vh] outline-none border-2 border-[#6C63FF] px-[10px] py-[15px] rounded-lg bg-white shadow-gray-400 shadow-lg text-gray-500"
          value={userData?.email || ""}
        />

        <button
          className="w-[30%] bg-[#6C63FF] text-gray-900 font-bold py-[8px] mt-[2vh] rounded-xl shadow-lg shadow-gray-400 hover:shadow-inner transition duration-300"
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Profile"}
        </button>
      </form>
    </div>
  );
}

export default Profile;
