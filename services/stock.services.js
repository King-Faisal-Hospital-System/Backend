import Issue from "../models/issue.model.js";
import PurchaseOrder from "../models/purchaseOrder.model.js";
import Stock from "../models/stock.model.js";
import { sendPurchaseOrderEmail } from "./email.services.js";
import { createInvoice } from "./invoice.services.js";

// Register new stock
export const registerStock = async (stockDetails) => {
    const existingStock = await Stock.findOne({
        product_name: stockDetails.product_name,
        category: stockDetails.category,
        form: stockDetails.form
    });

    if (existingStock) {
        const error = new Error("Stock of this product already exists");
        error.statusCode = 403;
        throw error;
    }

    const stock = new Stock(stockDetails);
    await stock.save();
    return stock;
};

// Retrieve all stocks
export const retrieveAllStocks = async () => {
    const stocks = await Stock.find().populate("supplier");
    return stocks;
};

// Retrieve single stock by ID
export const retriveStock = async (stockId) => {
    const stock = await Stock.findById(stockId).populate("supplier");
    if (!stock) {
        const error = new Error("Stock not found");
        error.statusCode = 404;
        throw error;
    }
    return stock;
};

/* Stock Management Helper functions */
export const requestStockReFill = async (stock, supplier, quantity, unit_price, userId, order_date, notes) => {
    const purchase_order = new PurchaseOrder({
        supplier: supplier._id,
        status: "REQUESTED",
        stock: stock._id,
        quantity: quantity,
        total_value: quantity * unit_price,
        createdBy: userId,
        order_date,
        notes
    });

    await purchase_order.save();

    const orderData = { purchase_order, stock, supplier, unit_price };

    await sendPurchaseOrderEmail(supplier.company_email, orderData);
};

export const receiveStockRefill = async (stock, purchase_order, batch_number, quantity_received, notes) => {
    stock.quantity += quantity_received;
    stock.batch_number = batch_number;
    stock.notes = notes;
    purchase_order.status = "DELIVERED";

    stock.total_value = (stock.quantity - stock.issued) * stock.unit_price; // updated

    await Promise.all([
        stock.save(),
        purchase_order.save(),
        createInvoice("REGULAR", purchase_order._id, quantity_received * stock.unit_price, notes)
    ]);
};

export const issueStock = async (stock, requestor, remark, quantity) => {
    if (quantity > (stock.quantity - stock.issued)) {
        const error = new Error("Insufficient stock to issue");
        error.statusCode = 400;
        throw error;
    }

    const issue = new Issue({
        stock: stock._id,
        requestor,
        notes: remark,
        quantity
    });

    stock.issued += quantity;
    stock.total_value = (stock.quantity - stock.issued) * stock.unit_price; // update total value

    await Promise.all([stock.save(), issue.save()]);

    return issue;
};

