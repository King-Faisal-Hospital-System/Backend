import Invoice from "../models/invoice.model.js"

export const issueInvoiceToStock = async (invoiceDetails) => {
    try {
        const invoice = new Invoice({
            stock : invoiceDetails.stockId,
            product : invoiceDetails.productId,
            supplier : invoiceDetails.supplierId,
            amount : invoiceDetails.amount,
            notes : invoiceDetails.notes ? invoiceDetails.notes : "",
            type : invoiceDetails.type ? invoiceDetails.type : "REGULAR"
        });
        await invoice.save();
    } catch (error) {
        throw new Error(error);
    }
};
