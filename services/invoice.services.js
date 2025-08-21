import Invoice from "../models/invoice.model.js"

export const issueInvoiceToStock = async (supplierId, stockId, productId, amount, notes) => {
    try {
        const invoice = new Invoice({
            stock : stockId,
            product : productId,
            supplier : supplierId,
            amount : amount,
            notes : notes ? notes : ""
        });
        await invoice.save();
    } catch (error) {
        throw new Error(error);
    }
};