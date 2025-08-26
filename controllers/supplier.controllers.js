import { retrieveAllSuppliers, retrieveSupplier, registerSupplier, removeSupplier } from "../services/supplier.services.js";

export const createSupplier = async (req, res) => {
    const { company_name, company_email, contact_person, company_phone, address, tax_id, payment_terms } = req.body;
    
    // Validation
    if (!company_name || !company_email || !contact_person || !company_phone) {
        return res.status(400).json({ message: "Missing required fields" });
    }
    
    try {
        
        const paymentTermsNumber = payment_terms ? parseInt(payment_terms, 10) : undefined;
        
        const supplier = await registerSupplier(company_name, company_email, contact_person, company_phone, address, tax_id, paymentTermsNumber);
        return res.status(201).json({ message: "Supplier created successfully", supplier })
    } catch (error) {
        console.log("Create supplier error:", error);
        if (error.message === "Supplier already exists") {
            return res.status(409).json({ message: "Supplier already exists" });
        }
        return res.status(500).json({ message: "Internal server error", error: error.message })
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

export const updateSupplier = async (req, res) => {
    const { supplierId } = req.params;
    const { company_name, company_email, contact_person, company_phone, address, tax_id, payment_terms } = req.body;
    
    try {
        const supplier = await retrieveSupplier(supplierId);
        if (!supplier) return res.status(404).json({ message: "Supplier not found" });

        
        if (company_name) supplier.company_name = company_name;
        if (company_email) supplier.company_email = company_email;
        if (contact_person) supplier.contact_person = contact_person;
        if (company_phone) supplier.company_phone = company_phone;
        if (address) supplier.address = address;
        if (tax_id) supplier.tax_id = tax_id;
        if (payment_terms) supplier.payment_terms = parseInt(payment_terms, 10);

        await supplier.save();
        return res.status(200).json({ message: "Supplier updated successfully", supplier });
    } catch (error) {
        console.log("Update supplier error:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
}