import Stock from "../models/stock.model.js";

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
        if(!stock) return res.status(404).json({ message : "Stock not found" });
        return stock
    } catch (error) {
        throw new Error(error)
    }
}

/* Stock Management Helper functions */

export const requestStockReFill = async (stockId) => {
    try {
        const stock = await Stock.findById(stockId);
        if(!stock) return res.status(404).json({ message : "Stock not found" });
        
    } catch (error) {
        throw new Error(error)
    }
}