import Stock from "../models/stock.model.js";

export const createStock = async (req, res) => {
    const { productId, supplierId, quantity } = req.body;
    const { id } = req.body;
    try {
        const existingStock = await Stock.findOne({ product: productId });
        if (existingStock) return res.status(403).json({ message: "Stock of this product already exists" });
        const stock = new Stock({
            name : name ? name : "",
            product: productId,
            supplier: supplierId,
            quantity: 0,
            requested: quantity,
            received: 0,
            createdBy : id
        });
        await stock.save();
        return res.status(200).json({ message: "Stock requested successfully" })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" })
    }
};

export const changeStockName = async (req, res) => {
    const { name } = req.body;
    const { stockId } = req.params
    try {
        const stock = await Stock.findById(stockId);
        if(!stock) return res.status(404).json({ message : "Stock not found" });
        stock.name = name;
        await stock.save();
        return res.status(200).json({ message : `Stock renamed to ${name}` })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message : "Internal server error" })
    }
};

export const getStocks = async (req, res) => {
    try {
        const stocks = await Stock.find();
        return res.status(200).json({ stocks : stocks })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message : "Internal server error" })
    }
};

export const getMyStocks = async (req, res) => {
    const { id} = req.user;
    try {
        const stocks = await Stock.find({ createdBy : id });
        return res.status(200).json({ stocks : stocks })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message : "Internal server error"})
    }
};

export const deleteStock = async (req, res) => {
    const { stockId } = req.params;
    try {
        const stock = await Stock.findById(stockId);
        if(!stock) return res.status(404).json({ message : "Stock not found" });
        if(stock.quantity > 0) return res.status(403).json({ message : "Stock quantity must be 0 to delete" });
        await stock.deleteOne();
        return res.status(200).json({ message : "Stock deleted successfully" })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message : "Internal server eror"})
    }
}