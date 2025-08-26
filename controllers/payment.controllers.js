import { createPayment, getAllPayments, updatePayment, deletePayment } from "../services/payment.services.js";

//  new payment
export const createPaymentController = async (req, res) => {
    try {
        const { invoice, amount, method, notes } = req.body;
        
        if (!invoice || !amount || !method) {
            return res.status(400).json({
                success: false,
                message: "Invoice, amount, and method are required"
            });
        }

        const payment = await createPayment(invoice, amount, method, notes);
        
        res.status(201).json({
            success: true,
            message: "Payment created successfully",
            data: payment
        });
    } catch (error) {
        console.log("Create payment error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to create payment"
        });
    }
};

// all payments
export const getAllPaymentsController = async (req, res) => {
    try {
        const payments = await getAllPayments();
        
        res.status(200).json({
            success: true,
            message: "Payments retrieved successfully",
            data: payments
        });
    } catch (error) {
        console.log("Get payments error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to retrieve payments"
        });
    }
};

// Update payment
export const updatePaymentController = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        
        const payment = await updatePayment(id, updateData);
        
        if (!payment) {
            return res.status(404).json({
                success: false,
                message: "Payment not found"
            });
        }
        
        res.status(200).json({
            success: true,
            message: "Payment updated successfully",
            data: payment
        });
    } catch (error) {
        console.log("Update payment error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to update payment"
        });
    }
};

// Delete payment
export const deletePaymentController = async (req, res) => {
    try {
        const { id } = req.params;
        
        const payment = await deletePayment(id);
        
        if (!payment) {
            return res.status(404).json({
                success: false,
                message: "Payment not found"
            });
        }
        
        res.status(200).json({
            success: true,
            message: "Payment deleted successfully"
        });
    } catch (error) {
        console.log("Delete payment error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to delete payment"
        });
    }
};
