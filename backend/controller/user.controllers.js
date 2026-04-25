// In your user.controller.js file - Update the getOtherUsers function
import uploadOnCloudinary from "../config/cloudinary.js";
import User from "../models/user.model.js";
import Conversation from "../models/conversation.model.js";

export const getCurrentUser = async (req, res) => {
  try {
    let userId = req.userId;
    let user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({ message: `Server error ${error.message}` });
  }
};

export const editProfile = async (req, res) => {
  try {
    let { name } = req.body;
    let image;
    if (req.file) {
      image = await uploadOnCloudinary(req.file.path);
    }

    let user = await User.findByIdAndUpdate(req.userId, { name, image });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: `Server error ${error.message}` });
  }
};

// find other users sorted by latest message
export const getOtherUsers = async (req, res) => {
  try {
    const currentUserId = req.userId;

    // Get all users except current user
    let users = await User.find({ _id: { $ne: currentUserId } }).select(
      "-password",
    );

    // Get all conversations for current user
    const conversations = await Conversation.find({
      participants: { $in: [currentUserId] },
    }).populate({
      path: "messages",
      options: { sort: { createdAt: -1 } }, // Sort messages by newest first
    });

    // Create maps for last message info for each user
    const userLastMessageMap = new Map();
    const userLastMessageTimeMap = new Map();
    const userLastMessagePreviewMap = new Map();

    conversations.forEach((conversation) => {
      // Find the other participant in the conversation
      const otherParticipant = conversation.participants.find(
        (p) => p.toString() !== currentUserId.toString(),
      );

      if (otherParticipant && conversation.messages.length > 0) {
        // Get the latest message
        const latestMessage = conversation.messages[0];
        const lastMessageTime =
          latestMessage.createdAt || latestMessage.updatedAt;

        // Store last message time
        userLastMessageTimeMap.set(
          otherParticipant.toString(),
          lastMessageTime,
        );

        // Store last message preview (for potential future use)
        let messagePreview = "";
        if (latestMessage.message) {
          messagePreview =
            latestMessage.message.length > 30
              ? latestMessage.message.substring(0, 30) + "..."
              : latestMessage.message;
        } else if (latestMessage.image) {
          messagePreview = "📷 Image";
        }
        userLastMessagePreviewMap.set(
          otherParticipant.toString(),
          messagePreview,
        );

        // Store full last message info
        userLastMessageMap.set(otherParticipant.toString(), {
          time: lastMessageTime,
          preview: messagePreview,
          message: latestMessage.message,
          image: latestMessage.image,
        });
      }
    });

    // Sort users by latest message time (users with conversations first, then by time)
    const sortedUsers = users.sort((a, b) => {
      const timeA = userLastMessageTimeMap.get(a._id.toString());
      const timeB = userLastMessageTimeMap.get(b._id.toString());

      // If both have conversations, sort by latest message time
      if (timeA && timeB) {
        return new Date(timeB) - new Date(timeA);
      }
      // If only A has a conversation, A comes first
      if (timeA && !timeB) return -1;
      // If only B has a conversation, B comes first
      if (!timeA && timeB) return 1;
      // If neither has conversations, sort by name
      return a.name.localeCompare(b.name);
    });

    // Add last message info to each user object
    const usersWithLastMessage = sortedUsers.map((user) => {
      const userObj = user.toObject();
      const lastMessageInfo = userLastMessageMap.get(user._id.toString());
      if (lastMessageInfo) {
        userObj.lastMessage = lastMessageInfo;
      }
      return userObj;
    });

    return res.status(200).json({ users: usersWithLastMessage });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Get other users error ${error.message}` });
  }
};

export const search = async (req, res) => {
  try {
    let { query } = req.query;
    if (!query) {
      return res.status(400).json({ message: "Query is required" });
    }
    let users = await User.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { userName: { $regex: query, $options: "i" } },
      ],
    }).select("-password");
    return res.status(200).json({ users });
  } catch (error) {
    return res.status(500).json({ message: `Search error ${error.message}` });
  }
};
