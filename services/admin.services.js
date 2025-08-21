import Supplier from "../models/supplier.model";
import bcrypt from "bcryptjs";
import Stock from "../models/stock.model.js"

export const adminCreateSupplier = async (company_name, company_email, password, res) => {
    try {
        const existingSupplier = await Supplier.findOne({ $or: [{ company_name: company_name }, { company_email: company_email }] });
        if (existingSupplier) return res.status(403).json({ message: "Supplier already exists" });
        const hashedPassword = bcrypt.hash(password);
        const supplier = new Supplier({
            company_name,
            company_email,
            password: hashedPassword,
            role: "SUPPLIER",
            isVerified: false
        });
        await supplier.save();
    } catch (error) {
        throw new Error(error)
    }
};

export const adminDeleteSupplier = async (supplierId, res) => {
    try {
        const supplier = await Supplier.findById(supplierId);
        if(!supplier) return res.status(404).json({ message : "Supplier not found" });
        const existingPendingSupplies = await Stock.findOne({ $and : [{ supplier : supplierId}, { supplyStatus : "IN_PROGRESS" }]});
        if(existingPendingSupplies) return res.status(403).json({ message : "This supplier has pending supplies" });
        Promise.all([existingPendingSupplies.deleteOne(), supplier.deleteOne()]);
    } catch (error) {
        throw new Error()
    }
};

export const getAllSuppliers = async () => {
    try {
        const suppliers = await Supplier.find().select("-password");
        return suppliers
    } catch (error) {
        throw new Error(error)
    }
};