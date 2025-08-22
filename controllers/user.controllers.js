import { retrieveUser } from "../services/user.services.js";

export const getLoggedInUser = async (req, res) => {
    const { id } = req.user;
    try {
        const user = await retrieveUser(id);
        if(!user) return res.status(404).json({ message : "User not found" });
        return res.status(200).json({ user : user })
    } catch (error) {
        return res.status(500).json({ message : "Internal server error" })
    }
};

export const getUser = async (req, res) => {
    const { id } = req.params;
    try {
        const user = retrieveUser(id);
        if(!user) return res.status(404).json({ message : "User not found"});
        return res.status(200).json({ user : user })
    } catch (error) {
        return res.status(500).json({ message : "Internal server errror" })
    }
}