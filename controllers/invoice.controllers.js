import { retrieveInvoice, retrieveInvoices } from "../services/invoice.services.js";

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
}