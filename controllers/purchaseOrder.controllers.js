import { retrievePurchaseOrders, retrievePurchaseOrder } from "../services/purchaseOrder.services.js";

export const getPurchaseOrders = async (req, res) => {
    const { role } = req.body;
    try {
        const orders = await retrievePurchaseOrders(role);
        return res.status(200).json({ orders : orders })
    } catch (error) {
        return res.status(500).json({ message : "Internal server error" })
    }
};

export const getPurchaseOrder = async (req, res) => {
    const { orderId } = req.params;
    try {
        const order = await retrievePurchaseOrder(orderId);
        if(!order) return res.status(404).json({ message : "Purchase not found" });
        return res.status(200).json({ order : order })
    } catch (error) {
        return res.status(500).json({ message : "Internal server error" })
    }
}