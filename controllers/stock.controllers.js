import Stock from "../models/stock.model.js";
import { registerStock, retrieveAllStocks, retriveStock } from "../services/stock.services.js";

export const getAllStocks = async (req, res) => {
    try {
        const stocks = await retrieveAllStocks();
        return res.status(200).json({ stocks : stocks })
    } catch (error) {
        return res.status(500).json({ message : "Internal server error" })
    }
};

export const createStock = async (req, res) => {
    const { stock_name, product_name, initial_quantity, category, form, description, supplierId, batch_number, expiry_date, notes, unit_cost } = req.body;
    try {
        const stockDetails = {
            name: stock_name ? stock_name : product_name,
            product_name: product_name,
            product_description: description,
            quantity: initial_quantity ? initial_quantity : 0,
            category: category,
            form: form,
            supplierId : supplierId,
            batch : batch_number,
            expiry_date : expiry_date,
            notes : notes,
            unit_cost : unit_cost,
            total_value : initial_quantity * unit_cost
        }
        await registerStock(stockDetails, res);
        return res.status(200).json({ message: "Product created and it's stock initialized" })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server error" })
    }
};

export const getStockById = async (req, res) => {
    const { stockId } = req.params;
    try {
        const stock = await retriveStock(stockId, res);
        return res.status(200).json({ stock : stock })
    } catch (error) {
        return res.status(500).json({ message : "Internal server error" })
    }
}

export const changeProductStockName = async (req, res) => {
    const { name } = req.body;
    const { stockId } = req.params;
    try {
        const stock = await Stock.findById(stockId);
        if(!stock) return res.status(404).json({ message : "Stock not found" });
        stock.name = name;
        await stock.save();
        return res.status(200).json({ message : "Stock renamed" })
    } catch (error) {
        return res.status(500).json({ message : "Internal server error" })
    }
};

