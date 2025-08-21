import { deleteThisStock, getAllStocks } from "../services/admin.services.js";
import { changeSupplier, managerAproveStockSupply, registerStock, renameStock, supplierAgreeStockSupply, supplierRejectStockSupply } from "../services/stock.services.js";

export const getStocks = async (req, res) => {
    try {
        const stocks = await getAllStocks();
        return res.status(200).json({ stocks })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" })
    }
};

export const createStock = async (req, res) => {
    const { initial_quantity, productId, name, supplierId, requested_amount } = req.body;
    const { id } = req.user;
    const stockDetails = {
        initial_quantity: initial_quantity ? initial_quantity : 0,
        productId: productId,
        name: name ? name : "",
        supplierId: supplierId,
        requested_amount: requested_amount
    }
    try {
        await registerStock(stockDetails, id, res);
        return res.status(200).json({ message: "Stock created and requested the supplier" })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" })
    }
};

export const changeStockName = async (req, res) => {
    const { stockId } = req.params;
    try {
        await renameStock(stockId);
        return res.status(200).json({ message: "Stock renamed" })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" })
    }
};

export const changeStockSupplier = async (req, res) => {
    const { stockId } = req.params;
    const { supplierId } = req.body;
    try {
        await changeSupplier(stockId, supplierId, res);
        return res.status(200).json({ message: `Supplier of stock ${stockId} changed to ${supplierId}` })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" })
    }
};

export const deleteStock = async (req, res) => {
    const { stockId } = req.params
    try {
        await deleteThisStock(stockId, res);
        return res.status(200).json({ message: "Stock deleted" })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" })
    }
};

export const agreeStockSupply = async (req, res) => {
    const { stockId } = req.params;
    const { id } = req.user;
    try {
        await supplierAgreeStockSupply(stockId, id, res);
        return res.status(200).json({ message: `You agreed to supply stock ${stockId}` })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" })
    }
};

export const rejectStockSupply = async (req, res) => {
    const { stockId } = req.params;
    try {
        await supplierRejectStockSupply(stockId, res);
        return res.status(200).json({ message: `Stock ${stockId} supply rejected` })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" })
    }
};

export const approveStockSupplied = async (req, res) => {
    const { stockId } = req.params;
    try {
        await managerAproveStockSupply(stockId, res);
        return res.status(200).json({ message : "Approved that the stock is supplied" })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" })
    }
}