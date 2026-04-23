import React, { useState } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import dp from "../assets/profile.webp";
import { useSelector, useDispatch } from "react-redux";
import { setSelectedUser } from "../redux/userSlice";
import { RiEmojiStickerLine } from "react-icons/ri";
import { IoImageOutline } from "react-icons/io5";
import { IoSend } from "react-icons/io5";
import EmojiPicker from "emoji-picker-react";
import SenderMessage from "./SenderMessage";
import ReceiverMessage from "./ReceiverMessage";
import axios from "axios";
import { serverUrl } from "../main";
import { setMessages } from "../redux/messageSlice";
import { useEffect, useRef } from "react";

function MessageArea() {
  let { selectedUser, userData, Socket } = useSelector((state) => state.user);
  let dispatch = useDispatch();

  let [showPicker, setShowPicker] = React.useState(false);
  let [input, setInput] = useState("");
  let [frontendImage, setFrontendImage] = useState(null);
  let [backendImage, setBackendImage] = useState(null);
  let image = React.useRef();
  let { messages } = useSelector((state) => state.message);
  let messagesEndRef = useRef(null);
  let scrollTimeoutRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleImage = (e) => {
    let file = e.target.files[0];
    if (file) {
      setFrontendImage(URL.createObjectURL(file));
      setBackendImage(file);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() && !backendImage) return;

    try {
      let formData = new FormData();
      formData.append("message", input);
      if (backendImage) {
        formData.append("image", backendImage);
      }

      let result = await axios.post(
        `${serverUrl}/api/message/send/${selectedUser._id}`,
        formData,
        {
          withCredentials: true,
        },
      );
      dispatch(setMessages([...messages, result.data.data]));
      setInput("");
      setFrontendImage(null);
      setBackendImage(null);

      // Clear any existing timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      // Scroll again after a short delay to ensure any images are rendered
      scrollTimeoutRef.current = setTimeout(scrollToBottom, 100);
    } catch (error) {
      console.log(error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const onEmojiClick = (emojiData) => {
    setInput((prevInput) => prevInput + emojiData.emoji);
    setShowPicker(false);
  };

  useEffect(() => {
    if (Socket) {
      const handleNewMessage = (data) => {
        dispatch(setMessages([...messages, data]));
        // Clear any existing timeout
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }
        // Scroll after receiving new message
        scrollTimeoutRef.current = setTimeout(scrollToBottom, 100);
      };

      Socket.on("newMessage", handleNewMessage);
      return () => {
        Socket.off("newMessage", handleNewMessage);
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }
      };
    }
  }, [messages, Socket, dispatch]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  // Check if send button should be visible
  const shouldShowSendButton = input.trim().length > 0 || backendImage !== null;

  return (
    <div
      className={`lg:w-[70%] lg:flex ${selectedUser ? "flex" : "hidden"} w-full h-full bg-slate-200 relative`}
    >
      {selectedUser && (
        <div className="w-full h-[100vh] flex flex-col">
          <div className="w-full h-[12vh] bg-[#6C63FF] rounded-b-[30px] shadow-gray-400 shadow-lg flex items-center px-[15px] gap-[10px] mb-2">
            <div
              className=" cursor-pointer"
              onClick={() => dispatch(setSelectedUser(null))}
            >
              <IoMdArrowRoundBack className="w-[20px] h-[20px]" />
            </div>

            <div className="w-[7vh] h-[7vh] bg-white rounded-full flex items-center justify-center overflow-hidden shadow-gray-600 shadow-lg cursor-pointer">
              <img
                src={selectedUser?.image || dp}
                alt="Profile"
                className="h-[100%]"
              />
            </div>

            <h1 className="text-gray-900 font-bold text-[18px] ml-3 ">
              {selectedUser?.name || "User"}
            </h1>
          </div>

          <div className="w-full h-[76vh] flex flex-col overflow-auto">
            {showPicker && (
              <div className="absolute left-4 bottom-20">
                <EmojiPicker
                  height={350}
                  width={250}
                  onEmojiClick={onEmojiClick}
                />
              </div>
            )}

            {messages?.map((mess, index) => {
              if (mess.sender === userData._id) {
                return (
                  <SenderMessage
                    key={mess._id || index}
                    image={mess.image}
                    message={mess.message}
                    onImageLoad={scrollToBottom}
                  />
                );
              } else {
                return (
                  <ReceiverMessage
                    key={mess._id || index}
                    image={mess.image}
                    message={mess.message}
                    onImageLoad={scrollToBottom}
                  />
                );
              }
            })}
            <div ref={messagesEndRef} />
          </div>
        </div>
      )}

      {!selectedUser && (
        <div className="w-full h-full flex flex-col justify-center items-center">
          <h1 className="text-gray-900 font-bold text-[25px] ml-3 ">
            Welcome to ChatSync !
          </h1>
          <span className="text-gray-900 font-semibold text-[18px] ml-3 ">
            Please select a user to start chatting...
          </span>
        </div>
      )}

      {selectedUser && (
        <div className="absolute bottom-3 left-0 right-0 ">
          <form
            className="w-[95%] mx-auto h-[8vh] bg-white rounded-full shadow-lg shadow-gray-400 flex items-center"
            onSubmit={handleSendMessage}
          >
            <img
              src={frontendImage}
              alt=""
              className="w-[100px] absolute lg:bottom-12 bottom-16 right-[30px] rounded-md"
            />
            <div
              className="h-[5vh] w-[5vh] ml-2 flex items-center justify-center cursor-pointer"
              onClick={() => setShowPicker((prev) => !prev)}
            >
              <RiEmojiStickerLine className="h-[5vh] w-[5vh]" />
            </div>

            <input
              type="file"
              accept="image/*"
              ref={image}
              hidden
              onChange={handleImage}
            />

            <input
              type="text"
              placeholder="Message"
              className="h-[5vh] w-full px-2 mx-2 outline-none"
              onChange={(e) => setInput(e.target.value)}
              value={input}
              onKeyPress={handleKeyPress}
            />

            <div
              className="h-[5vh] w-[5vh] flex items-center justify-center cursor-pointer ml-auto mr-2 "
              onClick={() => image.current.click()}
            >
              <IoImageOutline className="h-[5vh] w-[5vh]" />
            </div>

            {shouldShowSendButton && (
              <button
                type="submit"
                className="h-[7vh] lg:w-[9vh] md:w-[10vh] w-[11vh] bg-[#6C63FF] rounded-full flex items-center justify-center ml-2 mr-1 cursor-pointer"
              >
                <IoSend className="text-white text-xl" />
              </button>
            )}
          </form>
        </div>
      )}
    </div>
  );
}

export default MessageArea;
