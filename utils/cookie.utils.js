import jwt from "jsonwebtoken";
import { configDotenv } from "dotenv";
configDotenv()

export const generateTokenAndSetCookie = (user, res) => {
    try {
        const payload = {
            id : user._id,
            role : user.role
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn : "15d" });
        return res.cookie("token", token, {
            secure : process.env.NODE_ENV === "production",
            maxAge : 15 * 24 * 60 * 60 * 1000,
            httpOnly : true
        })
    } catch (error) {
        throw new Error(error)
    }
}