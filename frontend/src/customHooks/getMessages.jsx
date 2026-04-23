// useGetMessages.jsx
import axios from "axios";
import { useEffect } from "react";
import { serverUrl } from "../main";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { setMessages } from "../redux/messageSlice";

const useGetMessages = () => {
  const dispatch = useDispatch();
  const { selectedUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedUser?._id) {
        console.log("No user selected, clearing messages");
        dispatch(setMessages([])); // Clear messages when no user selected
        return;
      }

      try {
        let result = await axios.get(
          `${serverUrl}/api/message/get/${selectedUser._id}`,
          {
            withCredentials: true,
          },
        );
        console.log("Messages fetched:", result.data);
        dispatch(setMessages(result.data.data || []));
      } catch (error) {
        console.log("Error fetching messages:", error);
        dispatch(setMessages([])); // Only set messages to empty, NOT other users
      }
    };

    fetchMessages();
  }, [selectedUser?._id, dispatch]); // Only depend on selectedUser ID
};

export default useGetMessages;
