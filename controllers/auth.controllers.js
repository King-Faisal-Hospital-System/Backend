import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { signIn, supplierLogin } from "../services/auth.services.js";

export const register = async (req, res) => {
    const { fullname, username, email, phone_number, password, role } = req.body;
    try {
        const existingUser = await User.findOne({ $or: [{ email: email }, { username: username }, { phone_number: phone_number }] });
        if (existingUser) return res.status(403).json({ message: "User already exists" });
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt)
        const user = new User({
            fullname: fullname,
            username: username,
            email: email,
            password: hashedPassword,
            phone_number: phone_number,
            role: role,
            isVerified: role === "ADMIN" ? true : false
        });
        await user.save();
        return res.status(201).json({ message: "Registered successfully" })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" })
    }
};

export const login = async (req, res) => {
    const { email, password, role } = req.body;
    if (!role) return res.status(404).json({ message: "Role not found" })
    try {
        if (role === "ADMIN" || role === "STOCK_MANAGER") {
            const user = await signIn(email, password,role, res);
            return res.status(200).json({ message: "Login successful", user : user })
        };
        await supplierLogin(email, password, role, res);
        return res.status(200).json({ message: "Login successful" })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" })
    }
};

export const logout = async (req, res) => {
    try {
        return res.clearCookie("token")
            .status(200).json({ message: "Logged out" })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server error" })
    }
}