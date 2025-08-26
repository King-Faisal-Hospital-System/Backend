import Invoice from "../models/invoice.model.js"

export const createInvoice = async (invoice_type, purchase_order, total_value, notes) => {
    try {
        const invoice = new Invoice({
            type : invoice_type,
            purchase_order: purchase_order,
            total_value : total_value,
            notes : notes,
            status : "PENDING"
        });
        const savedInvoice = await invoice.save();
        return savedInvoice;
    } catch (error) {
        throw new Error(error.message || error)
    }
};

export const retrieveInvoices = async () => {
    try {
        const invoices = await Invoice.find();
        return invoices
    } catch (error) {
        throw new Error(error)
    }
};

export const retrieveInvoice = async (invoiceId) => {
    try {
        const invoice = await Invoice.findById(invoiceId);
        return invoice
    } catch (error) {
        throw new Error(error);
    }
};

export const updateInvoice = async (invoiceId, updateData) => {
    try {
        const invoice = await Invoice.findByIdAndUpdate(
            invoiceId, 
            updateData, 
            { new: true, runValidators: true }
        );
        return invoice;
    } catch (error) {
        throw new Error(error.message || error);
    }
};

export const deleteInvoice = async (invoiceId) => {
    try {
        const invoice = await Invoice.findByIdAndDelete(invoiceId);
        return invoice;
    } catch (error) {
        throw new Error(error.message || error);
    }
};