import User from "../models/user.model.js";
import Supplier from "../models/supplier.model.js";

export const approveSupplierRegistration = async (req, res) => {
    const { userId } = req.body;
    try {
        const requestingUser = await User.findById(userId);
        if (!requestingUser) return res.status(404).json({ message: "Requesting user not found" });
        requestingUser.isVerified = true;
        const supplierProfile = new Supplier({
            user: requestingUser._id,
            company_name: requestingUser.company_name,
            company_phone: requestingUser.company_phone,
            address: requestingUser.address
        });
        Promise.all([supplierProfile.save(), requestingUser.save()])
        return res.status(200).json({ message: "Supplier approved" })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" })
    }

};

export const rejectSupplierRegistration = async (req, res) => {
    const { userId } = req.body;
    try {
        const requestingUser = await User.findById(userId);
        if (!requestingUser) return res.status(404).json({ message: "Requesting user not found" });
        requestingUser.isVerified = false;
        Promise.all([supplierProfile.save(), requestingUser.save()])
        return res.status(200).json({ message: "Supplier rejected" })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" })
    }
};

export const approveStockManagerRegistration = async (req, res) => {
    const { userId } = req.body;
    try {
        const requestingUser = await User.findById(userId);
        if (!requestingUser) return res.status(404).json({ message: "Requesting user not found" });
        requestingUser.isVerified = true;
        requestingUser.save()
        return res.status(200).json({ message: "Stock manager approved" })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" })
    }
};

export const rejectStockManagerRegistration = async (req, res) => {
    const { userId } = req.body;
    try {
        const requestingUser = await User.findById(userId);
        if (!requestingUser) return res.status(404).json({ message: "Requesting user not found" });
        requestingUser.isVerified = false;
        requestingUser.save()
        return res.status(200).json({ message: "Stock manager rejected" })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message : "Internal server error"})
    }
};

export const addSupplier = async (req, res) => {
    const { company_name, company_phone, address } = req.body;
    try {
        const supplier = new Supplier({
            company_name,
            company_phone,
            address
        });
        await supplier.save();
        return res.status(201).json({ message: "Supplier added successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const deleteSupplier = async (req, res) => {
    const { supplierId } = req.body;
    try {
        const supplier = await Supplier.findById(supplierId);
        if (!supplier) return res.status(404).json({ message: "Supplier not found" });
        await supplier.remove();
        return res.status(200).json({ message: "Supplier deleted successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const deleteStockManager = async (req, res) => {
    const { stockManagerId } = req.body;
    try {
        const stockManager = await User.findById(stockManagerId);
        if (!stockManager) return res.status(404).json({ message: "Stock manager not found" });
        if (stockManager.role !== "STOCK_MANAGER") return res.status(403).json({ message: "You can only delete stock managers" });
        await stockManager.remove();
        return res.status(200).json({ message: "Stock manager deleted successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const deleteUser = async (req, res) => {
    const { userId } = req.body;
    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });
        await user.remove();
        return res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};



