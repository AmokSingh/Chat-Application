import uploadOnCloudinary from "../config/cloudinary.js";
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import mongoose from "mongoose";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const sendMessage = async (req, res) => {
  try {
    let sender = req.userId;
    let receiver = req.params.receiver;
    let messageText = req.body.message;

    let imageUrl = ""; // Changed from 'image' to 'imageUrl'
    if (req.file) {
      imageUrl = await uploadOnCloudinary(req.file.path); // This is now a string
      console.log("Image uploaded successfully:", imageUrl);
    }

    let existingConversation = await Conversation.findOne({
      participants: { $all: [sender, receiver] },
    });

    let newMessage = await Message.create({
      sender,
      receiver,
      message: messageText || "",
      image: imageUrl, // Directly use the string URL
    });

    
    if (!existingConversation) {
      existingConversation = await Conversation.create({
        participants: [sender, receiver],
        messages: [newMessage._id],
      });
    } else {
      existingConversation.messages.push(newMessage._id);
      await existingConversation.save();
    }

    const receiverSocketId = getReceiverSocketId(receiver);
    if(receiverSocketId){
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }
    return res
      .status(200)
      .json({ message: "Message sent successfully", data: newMessage });
  } catch (error) {
    console.error("Error sending message:", error);
    return res
      .status(500)
      .json({ message: "Internal server error message controller" });
  }
};

export const getMessages = async (req, res) => {
  try {
    let sender = req.userId;
    let receiver = req.params.receiver;

    let conversation = await Conversation.findOne({
      participants: { $all: [sender, receiver] },
    }).populate("messages");

    if (!conversation) {
      return res.status(404).json({ message: "No conversation found" });
    }

    return res
      .status(200)
      .json({
        message: "Messages retrieved successfully",
        data: conversation.messages,
      });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
