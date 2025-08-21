import Stock from "../models/stock.model.js";
import Product from "../models/product.model.js";
import PurchaseOrder from "../models/purchaseOrder.model.js";
import { createPurchaseOrder } from "./purchaseOrder.services.js";
import { issueGRN } from "./grn.services.js";

export const registerStock = async (stockDetails, res) => {
    try {
        const existingStock = await Stock.findOne({ product: stockDetails.productId });
        if (existingStock) return res.status(403).json({ message: "Stock of this product already exists" });
        const product = await Product.findById(stockDetails.productId)
        const stock = new Stock({
            name: stockDetails.name,
            product: stockDetails.productId,
            quantity: stockDetails.initial_quantity ? stockDetails.initial_quantity : 0,
            value: product.price * stockDetails.initial_quantity
        });
        await stock.save();
    } catch (error) {
        throw new Error(error)
    }
};

export const requestProductQuantityFromSupplier = async (userId, productId, supplierId, stockId, quantity) => {
    try {
        const product = await Product.findById(productId)
        await createPurchaseOrder(userId, supplierId, stockId, product, quantity);
    } catch (error) {
        throw new Error(error)
    }
};

export const approveStockSupply = async (orderId, quantity_received, res) => {
    try {
        const purchase_order = await PurchaseOrder.findById(orderId);
        if(!purchase_order) return res.status(404).json({ message : "Purchase Order not found" });
        if(purchase_order.status !== "CONFIRMED") return res.status(403).json({ message : "Purchase order not confirmed or rejected" })
        await issueGRN(purchase_order, quantity_received);
    } catch (error) {
        throw new Error(error)
    }
}