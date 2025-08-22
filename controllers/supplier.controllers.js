import { retrieveAllSuppliers, retrieveSupplier, registerSupplier, removeSupplier } from "../services/supplier.services.js";

export const createSupplier = async (req, res) => {
    const { company_name, company_email, contact_person, company_phone, address, tax_id, payment_terms } = req.body;
    try {
        await registerSupplier(company_name, company_email, contact_person, company_phone, address, tax_id, payment_terms, res);
        return res.status(200).json({ message: "Supplier created" })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" })
    }
};

export const deleteSupplier = async (req, res) => {
    const { supplierId } = req.params;
    try {
        await removeSupplier(supplierId, res);
        return res.status(200).json({ message: "Supplier and their pending supplies deleted" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" })
    }
};

export const getSuppliers = async (req, res) => {
    try {
        const suppliers = await retrieveAllSuppliers();
        if (!suppliers) return res.status(404).json({ message: "Supplier not found" });
        return res.status(200).json({ suppliers: suppliers })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" })
    }
};

export const getSupplier = async (req, res) => {
    const { supplierId } = req.params;
    try {
        const supplier = await retrieveSupplier(supplierId, res);
        if (!supplier) return res.status(404).json({ message: "Supplier not found" });
        return res.status(200).json({ supplier: supplier })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" })
    }
}