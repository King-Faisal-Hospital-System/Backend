import { backupDB } from "../config/db.config.js";

export const backupDatabase = async (req, res) => {
    try {
        await backupDB()
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message : "Internal server error" })
    }
}