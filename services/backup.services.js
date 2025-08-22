import { backupDB } from "../config/db.config.js"

// Database backup logic
export const initialiseBackup = async (storage) => {
    try {
        await backupDB();
        
    } catch (error) {
        throw new Error(error)
    }
}