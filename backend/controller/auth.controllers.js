import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import gentoken from "../config/token.js";


export const signup = async (req, res) => {
  try {
    const { userName, email, password } = req.body;
    const checkUserByUserName = await User.findOne({ userName });
    if (checkUserByUserName) {
      return res.status(400).json({ message: "Username already exists" });
    }
    const checkUserByEmail = await User.findOne({ email });
    if (checkUserByEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      userName,
      email,
      password: hashedPassword,
    });

    const token = await gentoken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "Strict", 
      maxAge: 2 * 24 * 60 * 60 * 1000, // 2 days
      secure: false, // Set to true in production with HTTPS
    });
    return res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "signup error", error: error.message });
  }
};



export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = await gentoken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 2 * 24 * 60 * 60 * 1000, // 2 days
      sameSite: "Strict",
      secure: false, // Set to true in production with HTTPS
    });
    return res.status(200).json({ message: "User logged in successfully", user });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "login error", error: error.message });
  }
};



export const logout = async (req, res) => {
    try {
        res.clearCookie("token");
        return res.status(200).json({ message: "User logged out successfully" });
    } catch (error) {
        return res
            .status(500)
            .json({ message: "logout error", error: error.message });
    }
}