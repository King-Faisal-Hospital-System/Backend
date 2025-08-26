import PurchaseOrder from "../models/purchaseOrder.model.js";
import Stock from "../models/stock.model.js";
import Supplier from "../models/supplier.model.js"
import { receiveStockRefill, registerStock, requestStockReFill, retrieveAllStocks, retriveStock } from "../services/stock.services.js";

export const getAllStocks = async (req, res) => {
  try {
    let stocks = await retrieveAllStocks(); 
    stocks = stocks.map(stock => stock.toObject()); 
    return res.status(200).json({ stocks });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};





export const createStock = async (req, res) => {
  const {
    stock_name,
    product_name,
    name,
    initial_quantity,
    quantity,
    category,
    form,
    description,
    product_description,
    supplierId,
    supplier,
    batch_number,
    expiry_date,
    notes,
    unit_price,
  } = req.body;

  try {
   
    const finalQuantity = Number(initial_quantity || quantity) || 0;
    const price = Number(unit_price) || 0;

    const stockDetails = {
      name: stock_name || product_name || name,
      product_name: product_name || name,
      product_description: description || product_description,
      quantity: finalQuantity,
      issued: 0,
      category,
      form,
      supplier: supplierId || supplier,
      batch_number,
      expiry_date,
      notes,
      unit_price: price,
      total_value: finalQuantity * price,
    };

    const stock = await registerStock(stockDetails);
    return res
      .status(200)
      .json({ message: "Product created and its stock initialized", stock });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message || "Internal server error" });
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

/* Stock Manipulation Controllers */

export const requestSupplierForStockRefill = async (req, res) => {
    const { supplierId, quantity, order_date, notes, unit_price } = req.body;
    if(!supplierId || !quantity || !order_date || !notes || !unit_price) return res.status(403).json({ message : "All fields required" })
    const { stockId } = req.params;
    const { id } = req.user;
    try {
        const stock = await Stock.findById(stockId);
        if(!stock) return res.status(404).json({ message : "Stock not found" });
        const supplier = await Supplier.findById(supplierId);
        if(!supplier) return res.status(404).json({ message : "Supplier not found" });
        await requestStockReFill(stock, supplier, quantity, unit_price, id, order_date, notes);
        return res.status(200).json({ message : "Request sent via email to the supplier" })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message : "Internal server error" })
    }
};

export const receiveOrderToStock = async (req, res) => {
    const { orderId, batch_number, quantity_received, notes } = req.body;
    const { stockId } = req.params;
    try {
        const stock = await Stock.findById(stockId);
        if(!stock) return res.status(404).json({ message : "Stock not found" });
        const purchase_order = await PurchaseOrder.findById(orderId);
        if(!purchase_order) return res.status(404).json({ message : "Purchase order not found" });
        if(purchase_order.status === "DELIVERED") return res.status(405).json({ message : "Order already received" })
        await receiveStockRefill(stock, purchase_order, batch_number, quantity_received, notes)
        return res.status(200).json({ message : "Order received and updated stock" })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message : "Internal server error" })
    }
}

// Update stock details
export const updateStock = async (req, res) => {
    const { stockId } = req.params;
    const {
        name,
        product_name,
        product_description,
        category,
        form,
        supplier,
        batch_number,
        expiry_date,
        notes,
        unit_price,
        quantity
    } = req.body;

    try {
        const stock = await Stock.findById(stockId);
        if (!stock) return res.status(404).json({ message: "Stock not found" });

        
        if (name) stock.name = name;
        if (product_name) stock.product_name = product_name;
        if (product_description) stock.product_description = product_description;
        if (category) stock.category = category;
        if (form) stock.form = form;
        if (supplier) stock.supplier = supplier;
        if (batch_number) stock.batch_number = batch_number;
        if (expiry_date) stock.expiry_date = expiry_date;
        if (notes) stock.notes = notes;
        if (unit_price) {
            stock.unit_price = Number(unit_price);
            stock.total_value = (stock.quantity - stock.issued) * stock.unit_price;
        }
        if (quantity) {
            stock.quantity = Number(quantity);
            stock.total_value = (stock.quantity - stock.issued) * stock.unit_price;
        }

        await stock.save();
        return res.status(200).json({ message: "Stock updated successfully", stock });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// Issue stock endpoint
export const issueStockController = async (req, res) => {
    const { stockId } = req.params;
    const { quantity, requestor, remark } = req.body;

    if (!quantity || !requestor) {
        return res.status(400).json({ message: "Quantity and requestor are required" });
    }

    try {
        const stock = await Stock.findById(stockId);
        if (!stock) return res.status(404).json({ message: "Stock not found" });

        const { issueStock } = await import("../services/stock.services.js");
        const issue = await issueStock(stock, requestor, remark, Number(quantity));
        
        return res.status(200).json({ 
            message: "Stock issued successfully", 
            issue,
            stock: await stock.populate("supplier")
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ 
            message: error.message || "Internal server error" 
        });
    }
}