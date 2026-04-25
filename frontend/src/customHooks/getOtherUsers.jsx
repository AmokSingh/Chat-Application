import axios from "axios";
import { useEffect } from "react";
import { serverUrl } from "../main";
import { useDispatch } from "react-redux";
import { setOtherUsers } from "../redux/userSlice";

const getOtherUsers = () => {
  let dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        let result = await axios.get(`${serverUrl}/api/user/others`, {
          withCredentials: true,
        });
        // The backend should already sort them, but just in case
        dispatch(setOtherUsers(result.data.users));
      } catch (error) {
        console.log("Error fetching other users:", error);
        dispatch(setOtherUsers([]));
      }
    };
    fetchUser();
  }, [dispatch]);
};

export default getOtherUsers;
