import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateTokenAndSetCookie } from "../utils/cookie.utils.js"
// REGISTER
export const register = async (req, res) => {
  const { fullname, username, email, phone_number, password, role } = req.body;
  try {
    const existingUser = await User.findOne({
      $or: [{ email }, { username }, { phone_number }],
    });
    if (existingUser)
      return res.status(403).json({ message: "User already exists" });

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      fullname,
      username,
      email,
      password: hashedPassword,
      phone_number,
      role,
      isVerified: role === "ADMIN" ? true : false,
    });

    await user.save();
    return res.status(201).json({ message: "Registered successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// LOGIN
export const login = async (req, res) => {
  const { email, password, role } = req.body;
  if (!role) return res.status(404).json({ message: "Role not found" });

  try {
    const user = await User.findOne({ email, role });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.password) {
      return res.status(500).json({ message: "Password not set for this user" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(403).json({ message: "Incorrect password" });

    if (!user.isVerified)
      return res.status(403).json({ message: "User not verified by admin" });

    generateTokenAndSetCookie(user, res);

    return res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


// LOGOUT
export const logout = async (req, res) => {
  try {
    return res.clearCookie("token").status(200).json({ message: "Logged out" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
