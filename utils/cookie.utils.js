import jwt from "jsonwebtoken";
import { configDotenv } from "dotenv";
configDotenv();

export const generateTokenAndSetCookie = (user, res) => {
    try {
        const payload = {
            id: user._id,
            role: user.role,
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "15d" });

        const isProd = process.env.NODE_ENV === "production";
        console.log("Node Production Mode : ", isProd)

        return res.cookie("token", token, {
            httpOnly: true,                        // prevent JS or XSS access
            secure: isProd,                        // only true on HTTPS
            sameSite: isProd ? "None" : "Lax",     // None for cross-site in prod, Lax in dev
            maxAge: 15 * 24 * 60 * 60 * 1000,      // 15 days
        });
    } catch (error) {
        throw new Error(error);
    }
};
