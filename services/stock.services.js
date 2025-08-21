import Stock from "../models/stock.model.js"

export const registerStock = async (stockDetails, id, res) => {
    try {
        const existingStock = await Stock.findOne({ $or : [{ product : stockDetails.productId }]});
        if(existingStock) return res.status(403).json({ message : "Stock of this product already exists" });
        const stock = new Stock({
            product : stockDetails.productId,
            name : stockDetails.name ? stockDetails.name : "",
            supplier : [stockDetails.supplierId],
            quantity : stockDetails.initial_quantity ? stockDetails.initial_quantity : 0,
            createdBy : id,
            requested : stockDetails.requested_amount ? stockDetails.requested_amount : 0
        });
        await stock.save();
    } catch (error) {
        throw new Error(error)        
    }
};

export const renameStock = async (stockId, name, res) => {
    try {
        const stock = await Stock.findById(stockId);
        if(!stock) return res.status(404).json({ message : "Stock not found" });
        stock.name = name;
        await stock.save();
    } catch (error) {
        throw new Error(error)
    }
};

export const changeSupplier = async (stockId, newSupplierId, res) => {
    try {
        const stock = await Stock.findById(stockId);
        if(!stock) return res.status(404).json({ message : "Stock not found" });
        if(stock.supplyStatus === ("SUPPLIED" || "IN_PROGRESS")) return res.status(403).json({ message : "Supplier has agreed to deliver or already supplied" });
        stock.supplier = newSupplierId;
        await stock.save()
    } catch (error) {
        throw new Error(error);
    }
}