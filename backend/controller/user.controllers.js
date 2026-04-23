import uploadOnCloudinary from "../config/cloudinary.js";
import User from "../models/user.model.js";


export const getCurrentUser = async (req, res) => {
    try {
        let userId = req.userId;
        let user = await User.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json({ user });

    } catch (error) {
        return res.status(500).json({ message: `Server error ${error.message}` });
    }
}


export const editProfile = async (req, res) => {
    try {
        let {name} = req.body;
        let image;
        if (req.file) {
            image = await uploadOnCloudinary(req.file.path);
        }

        let user = await User.findByIdAndUpdate(req.userId,
            {name, image}
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json({ message: "Profile updated successfully" });
    }
     catch (error) {
        return res.status(500).json({ message: `Server error ${error.message}` });
    }
}
    

// find other users
export const getOtherUsers = async (req, res) => {
    try {
        let users = await User.find({_id: {$ne: req.userId}}).select("-password");
        return res.status(200).json({ users });
    } catch (error) {
        return res.status(500).json({ message: `Get other users error ${error.message}` });
    }
}