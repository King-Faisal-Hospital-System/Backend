import { supplierConfirmPurchaseOrder, supplierRejectPurchaseOrder } from "../services/purchaseOrder.services.js";
import { approveStockSupply } from "../services/stock.services.js";

export const getMyPurchaseOrders = async (req, res) => {
    const { role } = req.body;
    try {
        const orders = await getRoleBasedPurchaseOrders(role)
    } catch (error) {
        return res.status(500).json({ message : "Internal server error" })
    }
}

export const confirmPurchaseOrder = async (req, res) => {
    const { orderId } = req.params
    try {
        await supplierConfirmPurchaseOrder(orderId, res);
        return res.status(200).json({ message: `Purchase order with ID ${orderId} confirmed` })
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" })
    }
};

export const rejectPurchaseOrder = async (req, res) => {
    const { orderId } = req.params;
    try {
        await supplierRejectPurchaseOrder(orderId, res);
        return res.status(200).json({ message: `Purchase order with ID ${orderId} rejected` })
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" })
    }
};

export const receiveRequestedQuantities = async (req, res) => {
    const { orderId } = req.params;
    const { quantity_received } = req.body;
    try {
        await approveStockSupply(orderId, quantity_received, res);
        return res.status(200).json({ message: `Order with ID ${orderId} supply confirmation successful` })
    } catch (error) {
        throw new Error(error)
    }
};