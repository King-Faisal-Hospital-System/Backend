import Supplier from "../models/supplier.model.js";
import User from "../models/user.model.js";
import { generateTokenAndSetCookie } from "../utils/cookie.utils.js";
import bcrypt from "bcryptjs";

export const supplierLogin = async (email, password, role, res) => {
    try {
        const supplier = await Supplier.findOne({ email: email, role: role });
        if (!supplier) return res.status(404).json({ message: "User not found" });
        if (!supplier.isVerified) return res.status(403).json({ message: "Supplier not verified" })
        const isPasswordValid = await bcrypt.compare(password, supplier.password);
        if (!isPasswordValid) return res.status(403).json({ message: "Invalid password" });
        generateTokenAndSetCookie(supplier, res);
    } catch (error) {
        throw new Error(error);
    }
};

export const signIn = async (email, password, role, res) => {
    try {
        const user = await User.findOne({ email: email, role: role });
        if (!user) { console.log("User not found"); return res.status(404).json({ message: "User not found" }); }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(403).json({ message: "Incorrect password" });
        generateTokenAndSetCookie(user, res);
        return user
    } catch (error) {
        throw new Error(error)
    }
}