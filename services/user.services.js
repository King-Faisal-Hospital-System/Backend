import User from "../models/user.model.js"

export const retrieveUser = async (userId) => {
    try {
        const user = await User.findById(userId).select("-password");
        return user
    } catch (error) {
        throw new Error(error)
    }
};