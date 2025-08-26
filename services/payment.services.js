import Transaction from "../models/transaction.model.js";

// Create new payment
export const createPayment = async (invoice, amount, method, notes) => {
    try {
        const payment = new Transaction({
            invoice,
            amount,
            method,
            status: "PROCESSING",
            notes
        });
        
        await payment.save();
        
        // Return payment without population for now to avoid model registration issues
        const populatedPayment = await Transaction.findById(payment._id);
        
        return populatedPayment;
    } catch (error) {
        throw new Error(error.message || "Failed to create payment");
    }
};

// Get all payments
export const getAllPayments = async () => {
    try {
        const payments = await Transaction.find()
            .sort({ createdAt: -1 });
        
        return payments;
    } catch (error) {
        throw new Error(error.message || "Failed to retrieve payments");
    }
};

// Update payment
export const updatePayment = async (id, updateData) => {
    try {
        const payment = await Transaction.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );
        
        return payment;
    } catch (error) {
        throw new Error(error.message || "Failed to update payment");
    }
};

// Delete payment
export const deletePayment = async (id) => {
    try {
        const payment = await Transaction.findByIdAndDelete(id);
        return payment;
    } catch (error) {
        throw new Error(error.message || "Failed to delete payment");
    }
};

// Get payment by ID
export const getPaymentById = async (id) => {
    try {
        const payment = await Transaction.findById(id);
        return payment;
    } catch (error) {
        throw new Error(error.message || "Failed to retrieve payment");
    }
};

// Get payments by invoice
export const getPaymentsByInvoice = async (invoiceId) => {
    try {
        const payments = await Transaction.find({ invoice: invoiceId })
            .sort({ createdAt: -1 });
        
        return payments;
    } catch (error) {
        throw new Error(error.message || "Failed to retrieve payments for invoice");
    }
};
