import Product from "../models/product.model.js";
import Stock from "../models/stock.model.js";

export const createProduct = async (req, res) => {
    const { name, unit_price, form } = req.body;
    const { id } = req.user;
    try {
        const existingProduct = await Product.findOne({ $or: [{ name: name }, { form: form }] });
        if (existingProduct) return res.status(403).json({ message: "Product already exists" });
        const product = new Product({
            name: name,
            price: unit_price,
            form: form,
            createdBy: id
        });
        await product.save();
        return res.status(201).json({ message: "Product created successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" })
    }
};

export const getProducts = async (req, res) => {
    try {
        const products = await Product.find().populate("createdBy");
        if (!products || !products.length) return res.status(404).json({ message: "Products not found" })
        return res.status(200).json({ products });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" })
    }
};

export const updateProductPrice = async (req, res) => {
    const { id } = req.user;
    const { productId } = req.params;
    const { unit_price } = req.body;
    try {
        const product = await Product.findById(productId);
        if(!product) return res.status(404).json({ message : "Product not found" });
        if(product.createdBy.toString() !== id) return res.status(403).json({ message : "You are not authorized to update this product" });
        if(!unit_price) return res.status(400).json({ message : "Please provide unit price" });
        if(unit_price < 0) return res.status(400).json({ message : "Unit price cannot be negative" });
        product.unit_price = unit_price;
        await product.save();
        return res.status(200).json({ message : "Product price updated successfully" })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" })
    }
};

export const deleteProduct = async (req, res) => {
    const { productId } = req.params;
    const { id } = req.user;
    try {
        const productExistingInStock = await Stock.findOne({ product : productId });
        if(productExistingInStock && productExistingInStock.quantity > 0) return res.status(403).json({ message : "Product is existing in stock, cannot be deleted" }); 
        if(productExistingInStock && productExistingInStock.quantity === 0) {
            await Stock.findByIdAndDelete(productExistingInStock._id);
        }
        await Product.findByIdAndDelete(productId);
        return res.status(200).json({ message : "Product deleted successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message : "Internal server error" })
    }
}