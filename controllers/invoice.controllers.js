import { retrieveInvoice, retrieveInvoices, createInvoice, updateInvoice, deleteInvoice } from "../services/invoice.services.js";

export const getAllInvoices = async (req, res) => {
    try {
        const invoices = await retrieveInvoices();
        return res.status(200).json({ invoices : invoices })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message : "Internal server error" })
    }
};

export const getInvoice = async (req, res) => {
    const { invoiceId } = req.params;
    try {
        const invoice = await retrieveInvoice(invoiceId);
        if(!invoice) return res.status(404).json({ message : "Invoice not found" });
        return res.status(200).json({ invoice : invoice })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message : "Internal server error" })
    }
};

export const createInvoiceController = async (req, res) => {
    const { type, purchase_order, total_value, notes } = req.body;
    
    // Validation
    if (!type || !total_value) {
        return res.status(400).json({ message: "Missing required fields: type and total_value" });
    }
    
    try {
        const invoice = await createInvoice(type, purchase_order, total_value, notes);
        return res.status(201).json({ message: "Invoice created successfully", invoice });
    } catch (error) {
        console.log("Create invoice error:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

export const updateInvoiceController = async (req, res) => {
    const { invoiceId } = req.params;
    const { type, purchase_order, total_value, notes, status } = req.body;
    
    try {
        const invoice = await updateInvoice(invoiceId, { type, purchase_order, total_value, notes, status });
        if (!invoice) return res.status(404).json({ message: "Invoice not found" });
        
        return res.status(200).json({ message: "Invoice updated successfully", invoice });
    } catch (error) {
        console.log("Update invoice error:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

export const deleteInvoiceController = async (req, res) => {
    const { invoiceId } = req.params;
    
    try {
        const result = await deleteInvoice(invoiceId);
        if (!result) return res.status(404).json({ message: "Invoice not found" });
        
        return res.status(200).json({ message: "Invoice deleted successfully" });
    } catch (error) {
        console.log("Delete invoice error:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};