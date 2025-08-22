import PurchaseOrder from "../models/purchaseOrder.model.js";
import Stock from "../models/stock.model.js";
import { sendPurchaseOrderEmail } from "./email.services.js";
import { createInvoice } from "./invoice.services.js";

export const registerStock = async (stockDetails, res) => {
    try {
        const existingStock = await Stock.findOne({ $and: [{ product_name: stockDetails.product_name }, { category: stockDetails.category }, { form: stockDetails.form }] });
        if (existingStock) return res.status(403).json({ message: "Stock of this product already exists" });
        const stock = new Stock(stockDetails);
        await stock.save();
    } catch (error) {
        throw new Error(error)
    }
};

export const retrieveAllStocks = async () => {
    try {
        const stocks = await Stock.find();
        return stocks
    } catch (error) {
        throw new Error(error)
    }
};

export const retriveStock = async (stockId, res) => {
    try {
        const stock = await Stock.findById(stockId).populate("supplier")
        if (!stock) return res.status(404).json({ message: "Stock not found" });
        return stock
    } catch (error) {
        throw new Error(error)
    }
}

/* Stock Management Helper functions */

export const requestStockReFill = async (stock, supplier, quantity, unit_price, userId, order_date, notes) => {
    try {
        const purchase_order = new PurchaseOrder({
            supplier: supplier._id,
            status: "REQUESTED",
            stock: stock._id,
            quantity: quantity,
            total_value: quantity * unit_price,
            createdBy: userId,
            order_date: order_date,
            notes: notes
        });
        await purchase_order.save();
        // Email generation and sending logic
        await sendPurchaseOrderEmail(supplier.company_email);
    } catch (error) {
        throw new Error(error)
    }
};

export const receiveStockRefill = async (stock, purchase_order, batch_number, quantity_received, notes) => {
    try {
        stock.quantity += quantity_received;
        stock.batch_number = batch_number;
        purchase_order.notes = notes;
        purchase_order.status = "DELIVERED";
        const total_value = stock.quantity * stock.unit_price;
        await createInvoice("REGULAR", purchase_order._id, total_value, notes);
        Promise.all([stock.save(), purchase_order.save()]);
    } catch (error) {
        throw new Error(error)
    }
};