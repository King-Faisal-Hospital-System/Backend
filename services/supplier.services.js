import Supplier from "../models/supplier.model.js";

export const retrieveAllSuppliers = async () => {
    try {
        const suppliers = await Supplier.find();
        return suppliers
    } catch (error) {
        throw new Error(error)
    }
};

export const retrieveSupplier = async (supplierId) => {
    try {
        const supplier = await Supplier.findById(supplierId);
        return supplier
    } catch (error) {
        throw new Error(error)
    }
};

export const registerSupplier = async (company_name, company_email, contact_person, company_phone, address, tax_id, payment_terms) => {
    try {
        const existingSupplier = await Supplier.findOne({ $or: [{ company_name: company_name }, { company_email: company_email }, { company_phone: company_phone }] });
        if (existingSupplier) {
            throw new Error("Supplier already exists");
        }
        const supplier = new Supplier({
            company_name,
            company_email,
            contact_person,
            company_phone,
            address,
            tax_id,
            payment_terms,
            isVerified: false
        });
        const savedSupplier = await supplier.save();
        return savedSupplier;
    } catch (error) {
        throw new Error(error.message || error)
    }
};

export const removeSupplier = async (supplierId, res) => {
    try {
        const supplier = await Supplier.findById(supplierId);
        if (!supplier) return res.status(404).json({ message: "Supplier not found" });
        await supplier.deleteOne();
    } catch (error) {
        throw new Error(error)
    }
};