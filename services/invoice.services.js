import Invoice from "../models/invoice.model.js"

export const createInvoice = async (invoice_type, orderId, total_value, notes) => {
    try {
        const invoice = new Invoice({
            type : invoice_type,
            order: orderId,
            total_value : total_value,
            notes : notes,
            status : "PENDING"
        });
        await invoice.save()
    } catch (error) {
        throw new Error(error)
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
}