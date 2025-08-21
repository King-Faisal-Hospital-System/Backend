
import { registerStock, requestProductQuantityFromSupplier } from "../services/stock.services.js";

export const createStock = async (req, res) => {
    const { name, productId, initial_quantity } = req.body;
    try {
        const stockDetails = {
            name : name ? name : "",
            productId : productId,
            initial_quantity : initial_quantity ? initial_quantity : 0
        }
        await registerStock(stockDetails, res);
        return res.status(200).json({ message : `Stock of product ${productId} created` })
    } catch (error) {
        return res.status(500).json({ message : "Internal server error" })
    } 
};

export const requestQuantity = async (req, res) => {
    const { stockId } = req.params;
    const { productId, quantity, supplierId } = req.body;
    const { id } = req.user;
    try {
        await requestProductQuantityFromSupplier(id, productId, supplierId, stockId, quantity);
        return res.status(200).json({ message : "Purchase order created and sent to supplier" })
    } catch (error) {
        return res.status(500).json({ message : "Internal server error" })
    }
};