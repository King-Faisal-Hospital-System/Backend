import PurchaseOrder from "../models/purchaseOrder.model.js";

export const createPurchaseOrder = async (userId, supplierId, stockId, product, quantity) => {
    try {
        const purchase_order = new PurchaseOrder({
            createdBy: userId,
            supplier: supplierId,
            item: { product: product._id, quantity: quantity, unit_price: product.price },
            stock: stockId
        });
        await purchase_order.save();
    } catch (error) {
        throw new Error(error);
    }
};

export const retrievePurchaseOrders = async () => {
    try {
        const orders = await PurchaseOrder.find();
        return orders
    } catch (error) {
        throw new Error(error)
    }
}