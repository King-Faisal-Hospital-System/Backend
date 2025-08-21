import PurchaseOrder from "../models/purchaseOrder.model.js";

export const createPurchaseOrder = async (userId, supplierId, stockId, product, quantity) => {
    try {
        const purchase_order = new PurchaseOrder({
            createdBy : userId,
            supplier : supplierId,
            item : { product : product._id, quantity : quantity, unit_price : product.price},
            stock : stockId
        });
        await purchase_order.save();
    } catch (error) {
        throw new Error(error);
    }
};

export const supplierConfirmPurchaseOrder = async (orderId, res) => {
    try {
        const purchase_order = await PurchaseOrder.findById(orderId);
        if(!purchase_order) return res.status(404).json({ message : "Purchase Order not found" });
        purchase_order.status = "CONFIRMED";
        await purchase_order.save()
    } catch (error) {
        throw new Error(error);
    }
};

export const supplierRejectPurchaseOrder = async (orderId, res) => {
    try {
        const purchase_order = await PurchaseOrder.findById(orderId);
        if(!purchase_order) return res.status(404).json({ message : "Purchase Order not found" });
        purchase_order.status = "REJECTED";
        await purchase_order.save()
    } catch (error) {
        throw new Error(error);
    }
}

export const getRoleBasedPurchaseOrders = async (role, userId) => {
    try {
        if(role === "ADMIN" || role === "STOCK_MANAGER"){
            const orders = await PurchaseOrder.find();
            return orders
        };
        const orders = await PurchaseOrder.find({ supplier : userId });
        return orders
    } catch (error) {
        throw new Error(error)
    }
}