import { retrievePurchaseOrders } from "../services/purchaseOrder.services.js";

export const getPurchaseOrders = async (req, res) => {
    const { role } = req.body;
    try {
        const orders = await retrievePurchaseOrders(role);
        return res.status(200).json({ orders : orders })
    } catch (error) {
        return res.status(500).json({ message : "Internal server error" })
    }
}